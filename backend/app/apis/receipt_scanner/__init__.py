from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from google.cloud import vision
import json
import re
import databutton as db
from app.auth import AuthorizedUser
from app.libs.firebase_client import get_firestore_client

router = APIRouter(prefix="/receipt-scanner")

# Initialize Google Cloud Vision client
def get_vision_client():
    """Initialize Vision API client using Firebase service account"""
    try:
        # Get the service account key from secrets
        service_account_json = db.secrets.get("FIREBASE_SERVICE_ACCOUNT_KEY_JSON")
        if not service_account_json:
            raise HTTPException(status_code=500, detail="Firebase service account key not found")
        
        # Parse the JSON and create client
        service_account_info = json.loads(service_account_json)
        client = vision.ImageAnnotatorClient.from_service_account_info(service_account_info)
        return client
    except Exception as e:
        print(f"Error initializing Vision client: {e}")
        raise HTTPException(status_code=500, detail="Failed to initialize OCR service")

class ReceiptItem(BaseModel):
    """Individual item extracted from receipt"""
    name: str
    quantity: Optional[float] = 1.0
    price: Optional[float] = None
    category: Optional[str] = "Other"
    confidence: Optional[float] = None

class ReceiptScanResponse(BaseModel):
    """Response from receipt scanning"""
    items: List[ReceiptItem]
    raw_text: str
    total_amount: Optional[float] = None
    store_name: Optional[str] = None
    date: Optional[str] = None
    processing_time: Optional[float] = None

class ReceiptProcessRequest(BaseModel):
    """Request to process extracted receipt data"""
    items: List[ReceiptItem]
    add_to_pantry: bool = True

@router.post("/scan")
async def scan_receipt(user: AuthorizedUser, file: UploadFile = File(...)) -> ReceiptScanResponse:
    """Scan receipt image and extract items using Google Cloud Vision API"""
    
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        import time
        start_time = time.time()
        
        # Read the image file
        image_content = await file.read()
        
        # Initialize Vision API client
        client = get_vision_client()
        
        # Create Vision API image object
        image = vision.Image(content=image_content)
        
        # Perform OCR with document text detection for better receipt parsing
        response = client.document_text_detection(image=image)
        
        if response.error.message:
            raise HTTPException(status_code=500, detail=f"OCR failed: {response.error.message}")
        
        # Extract raw text
        raw_text = response.full_text_annotation.text if response.full_text_annotation else ""
        
        print(f"OCR Raw Text:\n{raw_text}")
        
        # Parse the receipt text to extract items
        items = parse_receipt_text(raw_text)
        
        # Extract metadata (store, date, total)
        store_name = extract_store_name(raw_text)
        date = extract_date(raw_text)
        total_amount = extract_total_amount(raw_text)
        
        processing_time = time.time() - start_time
        
        return ReceiptScanResponse(
            items=items,
            raw_text=raw_text,
            total_amount=total_amount,
            store_name=store_name,
            date=date,
            processing_time=processing_time
        )
        
    except Exception as e:
        print(f"Error processing receipt: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process receipt: {str(e)}")

def parse_receipt_text(text: str) -> List[ReceiptItem]:
    """Parse raw OCR text to extract grocery items with quantities and prices"""
    items = []
    lines = text.split('\n')
    
    # Common grocery item patterns
    # Pattern for lines like: "BANANAS 2.99" or "MILK GALLON $3.49" or "2 APPLES 1.98"
    item_patterns = [
        r'^(\d+(?:\.\d+)?)\s+(.+?)\s+\$?(\d+\.\d{2})$',  # "2 APPLES 1.98"
        r'^(.+?)\s+(\d+(?:\.\d+)?)\s+\$?(\d+\.\d{2})$',  # "BANANAS 2.99"
        r'^(.+?)\s+\$?(\d+\.\d{2})$',  # "MILK GALLON $3.49"
    ]
    
    # Skip common non-item lines
    skip_patterns = [
        r'(total|subtotal|tax|change|cash|credit|debit)',
        r'(thank you|receipt|store|address|phone)',
        r'^\s*$',  # empty lines
        r'^\d{1,2}/\d{1,2}/\d{2,4}',  # dates
        r'^\d{1,2}:\d{2}',  # times
        r'(cashier|register|transaction)',
    ]
    
    for line in lines:
        line = line.strip().upper()
        
        # Skip lines that don't look like items
        if any(re.search(pattern, line, re.IGNORECASE) for pattern in skip_patterns):
            continue
            
        if len(line) < 3:  # Skip very short lines
            continue
        
        # Try to match item patterns
        quantity = 1.0
        name = line
        price = None
        
        for pattern in item_patterns:
            match = re.search(pattern, line)
            if match:
                groups = match.groups()
                if len(groups) == 3:
                    # Check if first group is quantity or name
                    if groups[0].replace('.', '').isdigit():
                        quantity = float(groups[0])
                        name = groups[1].strip()
                        price = float(groups[2])
                    else:
                        name = groups[0].strip()
                        if groups[1].replace('.', '').isdigit():
                            quantity = float(groups[1])
                        price = float(groups[2])
                elif len(groups) == 2:
                    name = groups[0].strip()
                    price = float(groups[1])
                break
        
        # Clean up the item name
        name = clean_item_name(name)
        
        # Only add if it looks like a real grocery item
        if is_likely_grocery_item(name):
            items.append(ReceiptItem(
                name=name,
                quantity=quantity,
                price=price,
                category="Other",  # Will be enhanced later with AI categorization
                confidence=0.8  # Basic confidence score
            ))
    
    return items

def clean_item_name(name: str) -> str:
    """Clean and normalize item names"""
    # Remove common prefixes/suffixes
    name = re.sub(r'^(ORGANIC|ORG|FRESH|PREMIUM)\s+', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\s+(LB|OZ|CT|EA|EACH|POUND|OUNCE)$', '', name, flags=re.IGNORECASE)
    
    # Remove extra whitespace and convert to title case
    name = ' '.join(name.split())
    name = name.title()
    
    return name

def is_likely_grocery_item(name: str) -> bool:
    """Determine if a name is likely a grocery item"""
    # Must have at least 2 characters and contain letters
    if len(name) < 2 or not re.search(r'[A-Za-z]', name):
        return False
    
    # Skip if it's mostly numbers or symbols
    if len(re.sub(r'[^A-Za-z\s]', '', name)) < 2:
        return False
    
    # Skip common non-item words
    non_items = ['TOTAL', 'TAX', 'CHANGE', 'CASH', 'CARD', 'RECEIPT', 'THANK', 'WELCOME']
    if any(word in name.upper() for word in non_items):
        return False
    
    return True

def extract_store_name(text: str) -> Optional[str]:
    """Extract store name from receipt text"""
    lines = text.split('\n')[:5]  # Check first few lines
    
    # Common store patterns
    store_patterns = [
        r'(WALMART|TARGET|KROGER|SAFEWAY|WHOLE FOODS|TRADER JOE)',
        r'(PUBLIX|WEGMANS|HARRIS TEETER|FOOD LION|GIANT)',
    ]
    
    for line in lines:
        for pattern in store_patterns:
            match = re.search(pattern, line.upper())
            if match:
                return match.group(1).title()
    
    return None

def extract_date(text: str) -> Optional[str]:
    """Extract date from receipt text"""
    # Look for common date patterns
    date_patterns = [
        r'(\d{1,2}/\d{1,2}/\d{2,4})',
        r'(\d{1,2}-\d{1,2}-\d{2,4})',
        r'(\d{2,4}-\d{1,2}-\d{1,2})',
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1)
    
    return None

def extract_total_amount(text: str) -> Optional[float]:
    """Extract total amount from receipt text"""
    # Look for total patterns (usually near the end)
    lines = text.split('\n')
    
    for line in reversed(lines[-10:]):  # Check last 10 lines
        if re.search(r'(TOTAL|BALANCE)', line.upper()):
            # Look for dollar amount in this line
            amount_match = re.search(r'\$?(\d+\.\d{2})', line)
            if amount_match:
                return float(amount_match.group(1))
    
    return None

@router.post("/process")
async def process_receipt_items(user: AuthorizedUser, request: ReceiptProcessRequest):
    """Process extracted receipt items and optionally add to pantry"""
    
    if not request.add_to_pantry:
        return {"message": "Items processed but not added to pantry", "items_count": len(request.items)}
    
    try:
        # Get user's household
        db_client = get_firestore_client()
        
        # Find user's household
        households_ref = db_client.collection('households')
        query = households_ref.where('members', 'array_contains', user.sub)
        households = query.get()
        
        if not households:
            raise HTTPException(status_code=404, detail="User household not found")
        
        household_id = households[0].id
        
        # Add items to pantry
        pantry_ref = db_client.collection('pantry_items')
        added_items = []
        
        for item in request.items:
            # Check if item already exists in pantry
            existing_query = pantry_ref.where('household_id', '==', household_id).where('name', '==', item.name)
            existing_items = existing_query.get()
            
            if existing_items:
                # Update existing item quantity
                existing_item = existing_items[0]
                current_quantity = existing_item.get('quantity') or 0
                new_quantity = current_quantity + item.quantity
                
                existing_item.reference.update({
                    'quantity': new_quantity,
                    'updated_at': db_client.SERVER_TIMESTAMP
                })
                
                added_items.append(f"Updated {item.name} (added {item.quantity})")
            else:
                # Add new item
                pantry_ref.add({
                    'household_id': household_id,
                    'name': item.name,
                    'quantity': item.quantity,
                    'category': item.category,
                    'added_by': user.sub,
                    'created_at': db_client.SERVER_TIMESTAMP,
                    'updated_at': db_client.SERVER_TIMESTAMP
                })
                
                added_items.append(f"Added {item.name} ({item.quantity})")
        
        return {
            "message": "Items successfully added to pantry",
            "items_added": added_items,
            "total_items": len(request.items)
        }
        
    except Exception as e:
        print(f"Error processing receipt items: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to add items to pantry: {str(e)}")
