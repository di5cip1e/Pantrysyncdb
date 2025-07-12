from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field, validator
from app.auth import AuthorizedUser
from app.libs.firebase_client import get_firestore_client
import databutton as db

router = APIRouter()

# Enhanced Product Information Models
class ProductInfoRequest(BaseModel):
    upc: str = Field(..., description="12-digit UPC identifier")
    base_name: str = Field(..., description="Product name from UPC lookup API")
    enhanced_name: Optional[str] = Field(None, description="Our improved/cleaned product name")
    category: Optional[str] = Field(None, description="Standardized category (produce, dairy, pantry, etc.)")
    subcategory: Optional[str] = Field(None, description="More specific classification")
    tags: List[str] = Field(default=[], description="Searchable tags (organic, gluten-free, spicy, etc.)")
    common_aliases: List[str] = Field(default=[], description="Alternative names people might use")
    storage_tips: Optional[str] = Field(None, description="How to store this product")
    typical_shelf_life: Optional[int] = Field(None, description="Estimated days until expiry")
    nutritional_highlights: List[str] = Field(default=[], description="Key nutrition facts")
    recipe_categories: List[str] = Field(default=[], description="What types of recipes this works for")
    seasonal_availability: Optional[str] = Field(None, description="When this product is typically available")
    price_range: Optional[Dict[str, float]] = Field(None, description="Typical price range for budgeting")
    confidence_score: float = Field(default=0.5, description="How confident we are in this data")
    
    @validator('upc')
    def validate_upc(cls, v):
        # Remove any non-digits and ensure it's 12 digits
        upc_clean = ''.join(filter(str.isdigit, v))
        if len(upc_clean) != 12:
            raise ValueError('UPC must be exactly 12 digits')
        return upc_clean
    
    @validator('tags', 'common_aliases', 'nutritional_highlights', 'recipe_categories')
    def validate_string_arrays(cls, v):
        if v is None:
            return []
        # Ensure all items are strings and not empty, limit to 10 items max
        valid_items = [item.strip().lower() for item in v if isinstance(item, str) and item.strip()]
        return valid_items[:10]
    
    @validator('confidence_score')
    def validate_confidence(cls, v):
        return max(0.0, min(1.0, v))  # Clamp between 0 and 1

class ProductInfoResponse(BaseModel):
    id: str
    upc: str
    base_name: str
    enhanced_name: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    tags: List[str] = []
    common_aliases: List[str] = []
    storage_tips: Optional[str] = None
    typical_shelf_life: Optional[int] = None
    nutritional_highlights: List[str] = []
    recipe_categories: List[str] = []
    seasonal_availability: Optional[str] = None
    price_range: Optional[Dict[str, float]] = None
    confidence_score: float = 0.5
    created_at: datetime
    updated_at: datetime
    created_by: str
    updated_by: str

class ProductInfoUpdateRequest(BaseModel):
    enhanced_name: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    tags: Optional[List[str]] = None
    common_aliases: Optional[List[str]] = None
    storage_tips: Optional[str] = None
    typical_shelf_life: Optional[int] = None
    nutritional_highlights: Optional[List[str]] = None
    recipe_categories: Optional[List[str]] = None
    seasonal_availability: Optional[str] = None
    price_range: Optional[Dict[str, float]] = None
    confidence_score: Optional[float] = None
    
    @validator('tags', 'common_aliases', 'nutritional_highlights', 'recipe_categories')
    def validate_string_arrays(cls, v):
        if v is None:
            return None
        # Ensure all items are strings and not empty, limit to 10 items max
        valid_items = [item.strip().lower() for item in v if isinstance(item, str) and item.strip()]
        return valid_items[:10]
    
    @validator('confidence_score')
    def validate_confidence(cls, v):
        if v is None:
            return None
        return max(0.0, min(1.0, v))  # Clamp between 0 and 1

class ProductSearchRequest(BaseModel):
    query: Optional[str] = Field(None, description="Search term for product names")
    category: Optional[str] = Field(None, description="Filter by category")
    tags: Optional[List[str]] = Field(None, description="Filter by tags (AND logic)")
    limit: int = Field(20, description="Maximum number of results")
    
    @validator('limit')
    def validate_limit(cls, v):
        return max(1, min(100, v))  # Clamp between 1 and 100

class EnhancedUPCResponse(BaseModel):
    """Combined response with basic UPC data + enhanced product info"""
    upc: str
    basic_product_info: Dict[str, Any] = Field(description="Data from UPC lookup API")
    enhanced_product_info: Optional[ProductInfoResponse] = Field(None, description="Our enhanced metadata")
    has_enhancement: bool = Field(description="Whether we have enhanced data for this UPC")

# API Endpoints

@router.get("/product-info/search", response_model=List[ProductInfoResponse])
async def search_products(
    user: AuthorizedUser,
    query: Optional[str] = Query(None, description="Search term"),
    category: Optional[str] = Query(None, description="Filter by category"),
    tags: Optional[str] = Query(None, description="Comma-separated tags to filter by"),
    limit: int = Query(20, description="Maximum results")
):
    """Search products by name, category, tags, etc."""
    print(f"Search called with: query={query}, category={category}, tags={tags}, limit={limit}")
    try:
        db = get_firestore_client()
        print("Got firestore client")
        
        # Start with base collection
        collection_ref = db.collection("product_info")
        
        # Apply filters
        if category:
            collection_ref = collection_ref.where("category", "==", category.lower())
            print(f"Applied category filter: {category.lower()}")
        
        # Get all matching documents (Firestore doesn't support complex text search)
        print("About to query documents")
        docs = collection_ref.limit(min(100, limit * 2)).get()  # Get more to filter client-side
        print(f"Got {len(docs)} documents from firestore")
        
        results = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            
            # Apply client-side filters
            if query:
                query_lower = query.lower()
                # Search in multiple fields - handle None values
                searchable_text = " ".join([
                    (data.get("base_name") or "").lower(),
                    (data.get("enhanced_name") or "").lower(),
                    " ".join(data.get("tags") or []).lower(),
                    " ".join(data.get("common_aliases") or []).lower()
                ])
                
                if query_lower not in searchable_text:
                    continue
            
            # Filter by tags if specified
            if tags:
                tag_list = [tag.strip().lower() for tag in tags.split(",") if tag.strip()]
                product_tags = [tag.lower() for tag in data.get("tags", [])]
                
                # Check if any of the requested tags match
                if not any(tag in product_tags for tag in tag_list):
                    continue
            
            try:
                results.append(ProductInfoResponse(**data))
            except Exception as model_error:
                print(f"Error creating ProductInfoResponse: {model_error}")
                continue
            
            if len(results) >= limit:
                break
        
        print(f"Returning {len(results)} results")
        return results
        
    except Exception as e:
        print(f"Error searching products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/product-info/{upc}", response_model=ProductInfoResponse)
async def get_product_info(upc: str, user: AuthorizedUser):
    """Get enhanced product information by UPC."""
    try:
        # Clean UPC
        upc_clean = ''.join(filter(str.isdigit, upc))
        if len(upc_clean) != 12:
            raise HTTPException(status_code=400, detail="UPC must be exactly 12 digits")
        
        db = get_firestore_client()
        
        # Query by UPC
        product_ref = db.collection("product_info").where("upc", "==", upc_clean).limit(1).get()
        
        if not product_ref:
            raise HTTPException(status_code=404, detail="Enhanced product information not found")
        
        product_doc = product_ref[0]
        product_data = product_doc.to_dict()
        product_data["id"] = product_doc.id
        
        return ProductInfoResponse(**product_data)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting product info: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/product-info", response_model=ProductInfoResponse, status_code=201)
async def create_product_info(product: ProductInfoRequest, user: AuthorizedUser):
    """Create or update enhanced product information."""
    try:
        db = get_firestore_client()
        
        # Check if product already exists
        existing_ref = db.collection("product_info").where("upc", "==", product.upc).limit(1).get()
        
        now = datetime.utcnow()
        product_data = product.dict()
        
        if existing_ref:
            # Update existing
            doc = existing_ref[0]
            product_data.update({
                "updated_at": now,
                "updated_by": user.sub
            })
            doc.reference.update(product_data)
            
            # Get updated data
            updated_doc = doc.reference.get()
            response_data = updated_doc.to_dict()
            response_data["id"] = updated_doc.id
        else:
            # Create new
            product_data.update({
                "created_at": now,
                "updated_at": now,
                "created_by": user.sub,
                "updated_by": user.sub
            })
            
            doc_ref = db.collection("product_info").add(product_data)[1]
            
            response_data = product_data.copy()
            response_data["id"] = doc_ref.id
        
        return ProductInfoResponse(**response_data)
        
    except Exception as e:
        print(f"Error creating/updating product info: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/product-info/{product_id}", response_model=ProductInfoResponse)
async def update_product_info(product_id: str, updates: ProductInfoUpdateRequest, user: AuthorizedUser):
    """Update enhanced product information."""
    try:
        db = get_firestore_client()
        product_ref = db.collection("product_info").document(product_id)
        
        # Check if exists
        product_doc = product_ref.get()
        if not product_doc.exists:
            raise HTTPException(status_code=404, detail="Product information not found")
        
        # Update data
        update_data = updates.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_data.update({
            "updated_at": datetime.utcnow(),
            "updated_by": user.sub
        })
        
        product_ref.update(update_data)
        
        # Return updated data
        updated_doc = product_ref.get()
        response_data = updated_doc.to_dict()
        response_data["id"] = updated_doc.id
        
        return ProductInfoResponse(**response_data)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating product info: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/product-info/bulk-update", response_model=Dict[str, str])
async def bulk_update_products(products: List[ProductInfoRequest], user: AuthorizedUser):
    """Batch update multiple products."""
    try:
        db = get_firestore_client()
        batch = db.batch()
        
        now = datetime.utcnow()
        created_count = 0
        updated_count = 0
        
        for product in products:
            # Check if exists
            existing_ref = db.collection("product_info").where("upc", "==", product.upc).limit(1).get()
            
            product_data = product.dict()
            
            if existing_ref:
                # Update existing
                doc_ref = existing_ref[0].reference
                product_data.update({
                    "updated_at": now,
                    "updated_by": user.sub
                })
                batch.update(doc_ref, product_data)
                updated_count += 1
            else:
                # Create new
                product_data.update({
                    "created_at": now,
                    "updated_at": now,
                    "created_by": user.sub,
                    "updated_by": user.sub
                })
                doc_ref = db.collection("product_info").document()
                batch.set(doc_ref, product_data)
                created_count += 1
        
        # Commit batch
        batch.commit()
        
        return {
            "message": f"Successfully processed {len(products)} products",
            "created": str(created_count),
            "updated": str(updated_count)
        }
        
    except Exception as e:
        print(f"Error bulk updating products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Enhanced UPC lookup that combines basic + enhanced data
@router.get("/enhanced-upc/{upc}", response_model=EnhancedUPCResponse)
async def get_enhanced_upc_info(upc: str, user: AuthorizedUser):
    """Get combined UPC lookup data + enhanced product information."""
    try:
        # Clean UPC
        upc_clean = ''.join(filter(str.isdigit, upc))
        if len(upc_clean) != 12:
            raise HTTPException(status_code=400, detail="UPC must be exactly 12 digits")
        
        # Import UPC lookup function (avoid circular imports)
        from app.apis.upc import lookup_upc_product, UPCLookupRequest
        
        # Get basic UPC data
        basic_lookup = await lookup_upc_product(UPCLookupRequest(upc_code=upc_clean))
        basic_data = basic_lookup.dict() if basic_lookup else {}
        
        # Try to get enhanced data
        enhanced_data = None
        has_enhancement = False
        
        try:
            enhanced_data = await get_product_info(upc_clean, user)
            has_enhancement = True
        except HTTPException as e:
            if e.status_code != 404:
                # Log but don't fail the whole request
                print(f"Error getting enhanced data for {upc_clean}: {e}")
        
        return EnhancedUPCResponse(
            upc=upc_clean,
            basic_product_info=basic_data,
            enhanced_product_info=enhanced_data,
            has_enhancement=has_enhancement
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting enhanced UPC info: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
