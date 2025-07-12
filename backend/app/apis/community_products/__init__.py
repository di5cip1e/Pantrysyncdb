from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field, validator
from app.auth import AuthorizedUser
from app.libs.firebase_client import get_firestore_client
import databutton as db

router = APIRouter()

# Community Product Models (simpler than enhanced product_info)
class CommunityProductRequest(BaseModel):
    upc: str = Field(..., description="12-digit UPC identifier")
    name: str = Field(..., description="Product name as entered by user")
    brand: Optional[str] = Field(None, description="Brand name if known")
    category: Optional[str] = Field(None, description="General category (produce, dairy, pantry, etc.)")
    description: Optional[str] = Field(None, description="Additional details about the product")
    image_url: Optional[str] = Field(None, description="URL to product image if available")
    
    @validator('upc')
    def validate_upc(cls, v):
        # Remove any non-digits and ensure it's 12 digits
        upc_clean = ''.join(filter(str.isdigit, v))
        if len(upc_clean) != 12:
            raise ValueError('UPC must be exactly 12 digits')
        return upc_clean
    
    @validator('name')
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Product name is required')
        return v.strip()

class CommunityProductResponse(BaseModel):
    id: str
    upc: str
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime
    created_by: str
    contributor_count: int = Field(default=1, description="Number of users who contributed this product")
    verified: bool = Field(default=False, description="Whether this entry has been verified by multiple users")

class CommunityProductLookupResponse(BaseModel):
    """Response for community UPC lookup"""
    upc: str
    found: bool
    product: Optional[CommunityProductResponse] = None
    message: str

# API Endpoints

@router.get("/community-products/lookup/{upc}", response_model=CommunityProductLookupResponse)
async def lookup_community_product(upc: str, user: AuthorizedUser):
    """Look up a product in the community database by UPC."""
    try:
        # Clean UPC
        upc_clean = ''.join(filter(str.isdigit, upc))
        if len(upc_clean) != 12:
            raise HTTPException(status_code=400, detail="UPC must be exactly 12 digits")
        
        print(f"Looking up community product for UPC: {upc_clean}")
        
        db = get_firestore_client()
        
        # Query community products collection
        product_ref = db.collection("community_products").where("upc", "==", upc_clean).limit(1).get()
        
        if not product_ref:
            return CommunityProductLookupResponse(
                upc=upc_clean,
                found=False,
                message=f"Product not found in community database for UPC: {upc_clean}"
            )
        
        product_doc = product_ref[0]
        product_data = product_doc.to_dict()
        product_data["id"] = product_doc.id
        
        product = CommunityProductResponse(**product_data)
        
        return CommunityProductLookupResponse(
            upc=upc_clean,
            found=True,
            product=product,
            message=f"Found community product: {product.name}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error looking up community product: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/community-products", response_model=CommunityProductResponse, status_code=201)
async def create_community_product(product: CommunityProductRequest, user: AuthorizedUser):
    """Add a new product to the community database."""
    try:
        db = get_firestore_client()
        
        print(f"Creating community product for UPC: {product.upc}")
        
        # Check if product already exists
        existing_ref = db.collection("community_products").where("upc", "==", product.upc).limit(1).get()
        
        now = datetime.utcnow()
        
        if existing_ref:
            # Product already exists - increment contributor count and update if needed
            doc = existing_ref[0]
            existing_data = doc.to_dict()
            
            # Update contributor count
            new_contributor_count = existing_data.get("contributor_count", 1) + 1
            
            # Mark as verified if multiple contributors
            verified = new_contributor_count >= 2
            
            update_data = {
                "contributor_count": new_contributor_count,
                "verified": verified,
                "updated_at": now,
                "last_contributor": user.sub
            }
            
            # If the new name is different and not empty, update it (community consensus)
            if product.name and product.name != existing_data.get("name", ""):
                update_data["name"] = product.name
            
            # Update other fields if they're provided and not already set
            if product.brand and not existing_data.get("brand"):
                update_data["brand"] = product.brand
            if product.category and not existing_data.get("category"):
                update_data["category"] = product.category
            if product.description and not existing_data.get("description"):
                update_data["description"] = product.description
            if product.image_url and not existing_data.get("image_url"):
                update_data["image_url"] = product.image_url
            
            doc.reference.update(update_data)
            
            # Get updated data
            updated_doc = doc.reference.get()
            response_data = updated_doc.to_dict()
            response_data["id"] = updated_doc.id
            
            print(f"Updated existing community product. Contributors: {new_contributor_count}, Verified: {verified}")
        else:
            # Create new product
            product_data = product.dict()
            product_data.update({
                "created_at": now,
                "updated_at": now,
                "created_by": user.sub,
                "last_contributor": user.sub,
                "contributor_count": 1,
                "verified": False
            })
            
            doc_ref = db.collection("community_products").add(product_data)[1]
            
            response_data = product_data.copy()
            response_data["id"] = doc_ref.id
            
            print(f"Created new community product: {product.name}")
        
        return CommunityProductResponse(**response_data)
        
    except Exception as e:
        print(f"Error creating community product: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/community-products/search", response_model=List[CommunityProductResponse])
async def search_community_products(
    user: AuthorizedUser,
    query: Optional[str] = Query(None, description="Search term"),
    category: Optional[str] = Query(None, description="Filter by category"),
    verified_only: bool = Query(False, description="Only return verified products"),
    limit: int = Query(20, description="Maximum results")
):
    """Search products in the community database."""
    try:
        db = get_firestore_client()
        
        # Start with base collection
        collection_ref = db.collection("community_products")
        
        # Apply filters
        if category:
            collection_ref = collection_ref.where("category", "==", category.lower())
        
        if verified_only:
            collection_ref = collection_ref.where("verified", "==", True)
        
        # Get documents
        docs = collection_ref.limit(min(100, limit * 2)).get()
        
        results = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            
            # Apply client-side text search if query provided
            if query:
                query_lower = query.lower()
                searchable_text = " ".join([
                    (data.get("name") or "").lower(),
                    (data.get("brand") or "").lower(),
                    (data.get("description") or "").lower()
                ])
                
                if query_lower not in searchable_text:
                    continue
            
            try:
                results.append(CommunityProductResponse(**data))
            except Exception as model_error:
                print(f"Error creating CommunityProductResponse: {model_error}")
                continue
            
            if len(results) >= limit:
                break
        
        return results
        
    except Exception as e:
        print(f"Error searching community products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/community-products/stats", response_model=Dict[str, Any])
async def get_community_stats(user: AuthorizedUser):
    """Get statistics about the community product database."""
    try:
        db = get_firestore_client()
        
        # Get total count
        all_products = db.collection("community_products").get()
        total_count = len(all_products)
        
        # Count verified products
        verified_count = sum(1 for doc in all_products if doc.to_dict().get("verified", False))
        
        # Get recent contributions (last 7 days)
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_count = 0
        for doc in all_products:
            created_at = doc.to_dict().get("created_at")
            if created_at and isinstance(created_at, datetime) and created_at > week_ago:
                recent_count += 1
        
        return {
            "total_products": total_count,
            "verified_products": verified_count,
            "recent_contributions": recent_count,
            "verification_rate": round(verified_count / total_count * 100, 1) if total_count > 0 else 0
        }
        
    except Exception as e:
        print(f"Error getting community stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
