from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import databutton as db

router = APIRouter()

class UPCLookupRequest(BaseModel):
    upc_code: str

class ProductInfo(BaseModel):
    name: str
    brand: str | None = None
    category: str | None = None
    image_url: str | None = None
    ingredients: str | None = None
    nutrition_grade: str | None = None
    found: bool = True
    source: str = "external"  # "community" or "external"

class UPCLookupResponse(BaseModel):
    product: ProductInfo | None = None
    success: bool
    message: str

@router.post("/lookup-upc", response_model=UPCLookupResponse)
async def lookup_upc_product(request: UPCLookupRequest) -> UPCLookupResponse:
    """
    Look up product information using UPC/barcode.
    First checks community database, then falls back to Open Food Facts API.
    """
    try:
        # Clean the UPC code (remove any non-digits)
        upc_code = ''.join(filter(str.isdigit, request.upc_code))
        
        if not upc_code:
            return UPCLookupResponse(
                success=False,
                message="Invalid UPC code format"
            )
        
        if len(upc_code) != 12:
            return UPCLookupResponse(
                success=False,
                message="UPC must be exactly 12 digits"
            )
        
        print(f"Looking up UPC: {upc_code}")
        
        # First, check community database
        try:
            from app.libs.firebase_client import get_firestore_client
            db_client = get_firestore_client()
            
            community_ref = db_client.collection("community_products").where("upc", "==", upc_code).limit(1).get()
            
            if community_ref:
                print(f"Found UPC {upc_code} in community database")
                community_doc = community_ref[0]
                community_data = community_doc.to_dict()
                
                product_info = ProductInfo(
                    name=community_data.get("name", f"Product {upc_code}"),
                    brand=community_data.get("brand"),
                    category=community_data.get("category"),
                    image_url=community_data.get("image_url"),
                    ingredients=None,  # Community database doesn't have detailed ingredients
                    nutrition_grade=None,
                    found=True,
                    source="community"
                )
                
                return UPCLookupResponse(
                    product=product_info,
                    success=True,
                    message=f"Found product in community database: {product_info.name}"
                )
        except Exception as community_error:
            print(f"Error checking community database: {community_error}")
            # Continue to external API if community lookup fails
        
        # Fall back to Open Food Facts API
        url = f"https://world.openfoodfacts.org/api/v0/product/{upc_code}.json"
        
        print(f"Checking Open Food Facts API for UPC: {upc_code}")
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get("status") == 1 and "product" in data:
            product_data = data["product"]
            
            # Extract product information
            product_name = product_data.get("product_name", "")
            brand = product_data.get("brands", "")
            category = product_data.get("categories", "")
            image_url = product_data.get("image_url", "")
            ingredients = product_data.get("ingredients_text", "")
            nutrition_grade = product_data.get("nutrition_grade_fr", "")
            
            # Clean up empty strings
            brand = brand if brand else None
            category = category if category else None
            image_url = image_url if image_url else None
            ingredients = ingredients if ingredients else None
            nutrition_grade = nutrition_grade if nutrition_grade else None
            
            if not product_name:
                product_name = f"Product {upc_code}"
            
            product_info = ProductInfo(
                name=product_name,
                brand=brand,
                category=category,
                image_url=image_url,
                ingredients=ingredients,
                nutrition_grade=nutrition_grade,
                found=True,
                source="external"
            )
            
            return UPCLookupResponse(
                product=product_info,
                success=True,
                message=f"Found product in external database: {product_name}"
            )
        else:
            return UPCLookupResponse(
                success=False,
                message=f"Product not found for UPC: {upc_code}"
            )
            
    except requests.RequestException as e:
        print(f"Error calling Open Food Facts API: {e}")
        return UPCLookupResponse(
            success=False,
            message="Error connecting to product database"
        )
    except Exception as e:
        print(f"Error in UPC lookup: {e}")
        return UPCLookupResponse(
            success=False,
            message="An error occurred while looking up the product"
        )
