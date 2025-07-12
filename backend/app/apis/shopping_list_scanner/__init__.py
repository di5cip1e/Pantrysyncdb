from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from google.cloud import vision
import json
import re
import databutton as db
from app.auth import AuthorizedUser
from app.libs.firebase_client import get_firestore_client

router = APIRouter(prefix="/shopping-list-scanner")

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

class ShoppingListItem(BaseModel):
    """Individual item extracted from shopping list"""
    name: str
    quantity: Optional[float] = 1.0
    unit: Optional[str] = None
    category: Optional[str] = "Other"
    confidence: Optional[float] = None
    checked: bool = False

class ShoppingListScanResponse(BaseModel):
    """Response from shopping list scanning"""
    items: List[ShoppingListItem]
    raw_text: str
    processing_time: Optional[float] = None
    total_items_found: int = 0

class ShoppingListProcessRequest(BaseModel):
    """Request to process extracted shopping list data"""
    items: List[ShoppingListItem]
    shopping_list_id: str
    add_to_list: bool = True

@router.post("/scan")
async def scan_shopping_list(user: AuthorizedUser, file: UploadFile = File(...)) -> ShoppingListScanResponse:
    """Scan shopping list image and extract items using Google Cloud Vision API"""
    
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
        
        # Perform OCR with document text detection for better text parsing
        response = client.document_text_detection(image=image)
        
        if response.error.message:
            raise HTTPException(status_code=500, detail=f"OCR failed: {response.error.message}")
        
        # Extract raw text
        raw_text = response.full_text_annotation.text if response.full_text_annotation else ""
        
        print(f"Shopping List OCR Raw Text:\n{raw_text}")
        
        # Parse the shopping list text to extract items
        items = parse_shopping_list_text(raw_text)
        
        processing_time = time.time() - start_time
        
        return ShoppingListScanResponse(
            items=items,
            raw_text=raw_text,
            processing_time=processing_time,
            total_items_found=len(items)
        )
        
    except Exception as e:
        print(f"Error processing shopping list: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process shopping list: {str(e)}")

def parse_shopping_list_text(text: str) -> List[ShoppingListItem]:
    """Parse raw OCR text to extract shopping list items with quantities"""
    items = []
    lines = text.split('\n')
    
    # Shopping list item patterns
    # Patterns for various formats like:
    # "- Milk" "* Bread" "1. Apples" "2 lbs Bananas" "3x Eggs" "Cheese (2 packs)"
    item_patterns = [
        r'^[\-\*•]\s*(.+)$',  # "- Milk" or "* Bread"
        r'^\d+\.\s*(.+)$',  # "1. Apples"
        r'^(\d+(?:\.\d+)?)\s*(lbs?|oz|ounces?|pounds?|kg|grams?|g|cups?|tbsp|tsp|gallons?|quarts?|pints?)\s+(.+)$',  # "2 lbs Bananas"
        r'^(\d+(?:\.\d+)?)x\s+(.+)$',  # "3x Eggs"
        r'^(\d+(?:\.\d+)?)\s+(.+)$',  # "2 Apples"
        r'^(.+?)\s*\((\d+(?:\.\d+)?)\s*(.*?)\)$',  # "Cheese (2 packs)"
        r'^(.+)$',  # Plain item name
    ]
    
    # Skip common non-item lines
    skip_patterns = [
        r'^(shopping list|grocery list|to buy|list|groceries)$',
        r'^\s*$',  # empty lines
        r'^\d{1,2}/\d{1,2}/\d{2,4}',  # dates
        r'^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)',  # days
        r'^(store|market|shop)',
    ]
    
    for line in lines:
        original_line = line.strip()
        line = line.strip().lower()
        
        # Skip lines that don't look like items
        if any(re.search(pattern, line, re.IGNORECASE) for pattern in skip_patterns):
            continue
            
        if len(line) < 2:  # Skip very short lines
            continue
        
        # Try to match item patterns
        quantity = 1.0
        unit = None
        name = original_line
        
        for pattern in item_patterns:
            match = re.search(pattern, line)
            if match:
                groups = match.groups()
                
                # Pattern: "2 lbs Bananas"
                if len(groups) == 3 and groups[0].replace('.', '').isdigit():
                    quantity = float(groups[0])
                    unit = groups[1]
                    name = groups[2].strip().title()
                    break
                # Pattern: "3x Eggs"
                elif len(groups) == 2 and groups[0].replace('.', '').isdigit():
                    quantity = float(groups[0])
                    name = groups[1].strip().title()
                    break
                # Pattern: "Cheese (2 packs)"
                elif len(groups) == 3 and groups[1].replace('.', '').isdigit():
                    name = groups[0].strip().title()
                    quantity = float(groups[1])
                    unit = groups[2].strip() if groups[2].strip() else None
                    break
                # Pattern: "- Milk" or "1. Apples"
                elif len(groups) == 1:
                    name = groups[0].strip().title()
                    break
                # Pattern: "2 Apples"
                elif len(groups) == 2:
                    if groups[0].replace('.', '').isdigit():
                        quantity = float(groups[0])
                        name = groups[1].strip().title()
                    else:
                        name = ' '.join(groups).strip().title()
                    break
        
        # Clean up the item name
        name = clean_shopping_item_name(name)
        
        # Only add if it looks like a real item
        if is_likely_shopping_item(name):
            items.append(ShoppingListItem(
                name=name,
                quantity=quantity,
                unit=unit,
                category="Other",  # Will be enhanced later with AI categorization
                confidence=0.8,  # Basic confidence score
                checked=False
            ))
    
    return items

def clean_shopping_item_name(name: str) -> str:
    """Clean and normalize shopping item names"""
    # Remove common list prefixes
    name = re.sub(r'^(\d+\.\s*|\-\s*|\*\s*|•\s*)', '', name)
    
    # Remove quantity indicators at the end
    name = re.sub(r'\s*\(.*?\)\s*$', '', name)  # Remove parenthetical notes
    name = re.sub(r'\s+(x\d+|\d+x)\s*$', '', name, flags=re.IGNORECASE)  # Remove "x2" etc
    
    # Remove extra whitespace and convert to title case
    name = ' '.join(name.split())
    name = name.title()
    
    return name

def is_likely_shopping_item(name: str) -> bool:
    """Determine if a name is likely a shopping item"""
    # Must have at least 2 characters and contain letters
    if len(name) < 2 or not re.search(r'[A-Za-z]', name):
        return False
    
    # Skip if it's mostly numbers or symbols
    if len(re.sub(r'[^A-Za-z\s]', '', name)) < 2:
        return False
    
    # Skip common non-item words
    non_items = ['LIST', 'SHOPPING', 'GROCERY', 'BUY', 'STORE', 'MARKET']
    if any(word in name.upper() for word in non_items):
        return False
    
    return True

@router.post("/process")
async def process_shopping_list_items(user: AuthorizedUser, request: ShoppingListProcessRequest):
    """Process extracted shopping list items and add to specified shopping list"""
    
    if not request.add_to_list:
        return {"message": "Items processed but not added to shopping list", "items_count": len(request.items)}
    
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
        
        # Verify shopping list exists and belongs to user's household
        shopping_list_ref = db_client.collection('shopping_lists').document(request.shopping_list_id)
        shopping_list_doc = shopping_list_ref.get()
        
        if not shopping_list_doc.exists:
            raise HTTPException(status_code=404, detail="Shopping list not found")
        
        shopping_list_data = shopping_list_doc.to_dict()
        if shopping_list_data.get('household_id') != household_id:
            raise HTTPException(status_code=403, detail="Shopping list does not belong to user's household")
        
        # Add items to shopping list
        shopping_list_items_ref = db_client.collection('shopping_list_items')
        added_items = []
        
        for item in request.items:
            # Check if item already exists in shopping list
            existing_query = shopping_list_items_ref.where('shopping_list_id', '==', request.shopping_list_id).where('name', '==', item.name)
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
                shopping_list_items_ref.add({
                    'shopping_list_id': request.shopping_list_id,
                    'name': item.name,
                    'quantity': item.quantity,
                    'unit': item.unit,
                    'category': item.category,
                    'checked': False,
                    'added_by': user.sub,
                    'created_at': db_client.SERVER_TIMESTAMP,
                    'updated_at': db_client.SERVER_TIMESTAMP
                })
                
                added_items.append(f"Added {item.name} ({item.quantity} {item.unit or ''}).strip()")
        
        return {
            "message": "Items successfully added to shopping list",
            "items_added": added_items,
            "total_items": len(request.items),
            "shopping_list_id": request.shopping_list_id
        }
        
    except Exception as e:
        print(f"Error processing shopping list items: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to add items to shopping list: {str(e)}")
