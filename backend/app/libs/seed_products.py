"""Seed data for common household products with enhanced metadata."""

from typing import List, Dict, Any
from datetime import datetime
from app.libs.firebase_client import get_firestore_client

# Common household products with enhanced metadata
COMMON_PRODUCTS = [
    {
        "upc": "041520893150",  # Coca-Cola 12oz can
        "base_name": "Coca-Cola Classic",
        "enhanced_name": "Coca-Cola Classic Soda",
        "category": "beverages",
        "subcategory": "soft_drinks",
        "tags": ["carbonated", "caffeine", "sweet", "cola"],
        "common_aliases": ["coke", "coca cola", "cola"],
        "storage_tips": "Store in cool, dry place. Refrigerate after opening.",
        "typical_shelf_life": 365,
        "nutritional_highlights": ["high_sugar", "caffeine"],
        "recipe_categories": ["drinks", "mixers"],
        "seasonal_availability": "year_round",
        "price_range": {"min": 1.0, "max": 2.5},
        "confidence_score": 0.9
    },
    {
        "upc": "011110087812",  # Wonder Bread
        "base_name": "Wonder Bread Classic White",
        "enhanced_name": "Wonder Classic White Sandwich Bread",
        "category": "bakery",
        "subcategory": "bread",
        "tags": ["white_bread", "sandwich", "soft", "enriched"],
        "common_aliases": ["white bread", "sandwich bread", "wonder"],
        "storage_tips": "Store in cool, dry place. Best kept sealed.",
        "typical_shelf_life": 7,
        "nutritional_highlights": ["enriched_flour", "fortified"],
        "recipe_categories": ["sandwiches", "toast", "breakfast"],
        "seasonal_availability": "year_round",
        "price_range": {"min": 1.5, "max": 3.0},
        "confidence_score": 0.9
    },
    {
        "upc": "073077326229",  # Bananas
        "base_name": "Fresh Bananas",
        "enhanced_name": "Fresh Yellow Bananas",
        "category": "produce",
        "subcategory": "fruits",
        "tags": ["fresh", "potassium", "natural", "tropical"],
        "common_aliases": ["banana", "yellow banana"],
        "storage_tips": "Store at room temperature. Refrigerate to slow ripening.",
        "typical_shelf_life": 5,
        "nutritional_highlights": ["potassium", "vitamin_b6", "fiber"],
        "recipe_categories": ["smoothies", "baking", "snacks", "breakfast"],
        "seasonal_availability": "year_round",
        "price_range": {"min": 0.5, "max": 1.5},
        "confidence_score": 0.8
    },
    {
        "upc": "011225202810",  # Whole Milk
        "base_name": "Whole Milk",
        "enhanced_name": "Fresh Whole Milk",
        "category": "dairy",
        "subcategory": "milk",
        "tags": ["fresh", "pasteurized", "vitamin_d", "calcium"],
        "common_aliases": ["milk", "whole milk", "regular milk"],
        "storage_tips": "Keep refrigerated. Use within use-by date.",
        "typical_shelf_life": 7,
        "nutritional_highlights": ["protein", "calcium", "vitamin_d"],
        "recipe_categories": ["baking", "cereal", "drinks", "cooking"],
        "seasonal_availability": "year_round",
        "price_range": {"min": 3.0, "max": 5.0},
        "confidence_score": 0.9
    },
    {
        "upc": "051000012340",  # Eggs
        "base_name": "Large White Eggs",
        "enhanced_name": "Fresh Large White Eggs",
        "category": "dairy",
        "subcategory": "eggs",
        "tags": ["fresh", "protein", "grade_a", "large"],
        "common_aliases": ["eggs", "chicken eggs", "white eggs"],
        "storage_tips": "Keep refrigerated. Store in original carton.",
        "typical_shelf_life": 21,
        "nutritional_highlights": ["protein", "vitamin_b12", "choline"],
        "recipe_categories": ["baking", "breakfast", "cooking", "protein"],
        "seasonal_availability": "year_round",
        "price_range": {"min": 2.0, "max": 4.0},
        "confidence_score": 0.9
    },
    {
        "upc": "041130558962",  # Peanut Butter
        "base_name": "Skippy Creamy Peanut Butter",
        "enhanced_name": "Skippy Creamy Peanut Butter",
        "category": "pantry",
        "subcategory": "spreads",
        "tags": ["creamy", "protein", "nuts", "spread"],
        "common_aliases": ["peanut butter", "pb", "skippy"],
        "storage_tips": "Store in cool, dry place. No refrigeration needed.",
        "typical_shelf_life": 365,
        "nutritional_highlights": ["protein", "healthy_fats", "niacin"],
        "recipe_categories": ["sandwiches", "baking", "snacks", "smoothies"],
        "seasonal_availability": "year_round",
        "price_range": {"min": 3.0, "max": 6.0},
        "confidence_score": 0.9
    },
    {
        "upc": "025700001003",  # Rice
        "base_name": "Long Grain White Rice",
        "enhanced_name": "Premium Long Grain White Rice",
        "category": "pantry",
        "subcategory": "grains",
        "tags": ["long_grain", "white", "staple", "gluten_free"],
        "common_aliases": ["rice", "white rice", "long grain rice"],
        "storage_tips": "Store in airtight container in cool, dry place.",
        "typical_shelf_life": 730,
        "nutritional_highlights": ["carbohydrates", "gluten_free", "energy"],
        "recipe_categories": ["side_dishes", "main_courses", "asian", "dinner"],
        "seasonal_availability": "year_round",
        "price_range": {"min": 2.0, "max": 5.0},
        "confidence_score": 0.8
    },
    {
        "upc": "070662003008",  # Chicken Breast
        "base_name": "Boneless Skinless Chicken Breast",
        "enhanced_name": "Fresh Boneless Skinless Chicken Breast",
        "category": "meat",
        "subcategory": "poultry",
        "tags": ["fresh", "lean", "protein", "boneless", "skinless"],
        "common_aliases": ["chicken breast", "chicken", "poultry"],
        "storage_tips": "Keep refrigerated. Use within 2 days or freeze.",
        "typical_shelf_life": 2,
        "nutritional_highlights": ["lean_protein", "low_fat", "vitamin_b6"],
        "recipe_categories": ["grilling", "baking", "stir_fry", "main_courses"],
        "seasonal_availability": "year_round",
        "price_range": {"min": 4.0, "max": 8.0},
        "confidence_score": 0.9
    },
    {
        "upc": "071921012345",  # Pasta
        "base_name": "Spaghetti Pasta",
        "enhanced_name": "Classic Spaghetti Pasta",
        "category": "pantry",
        "subcategory": "pasta",
        "tags": ["wheat", "long_pasta", "italian", "dried"],
        "common_aliases": ["spaghetti", "pasta", "noodles"],
        "storage_tips": "Store in cool, dry place in airtight container.",
        "typical_shelf_life": 730,
        "nutritional_highlights": ["carbohydrates", "energy", "b_vitamins"],
        "recipe_categories": ["italian", "main_courses", "dinner", "comfort_food"],
        "seasonal_availability": "year_round",
        "price_range": {"min": 1.0, "max": 3.0},
        "confidence_score": 0.8
    },
    {
        "upc": "036800012345",  # Cheese
        "base_name": "Sharp Cheddar Cheese",
        "enhanced_name": "Aged Sharp Cheddar Cheese",
        "category": "dairy",
        "subcategory": "cheese",
        "tags": ["aged", "sharp", "natural", "calcium"],
        "common_aliases": ["cheddar", "cheese", "sharp cheddar"],
        "storage_tips": "Keep refrigerated. Wrap tightly to prevent drying.",
        "typical_shelf_life": 14,
        "nutritional_highlights": ["protein", "calcium", "vitamin_a"],
        "recipe_categories": ["sandwiches", "snacks", "cooking", "appetizers"],
        "seasonal_availability": "year_round",
        "price_range": {"min": 3.0, "max": 7.0},
        "confidence_score": 0.9
    }
]

async def seed_product_data(user_id: str = "system") -> Dict[str, Any]:
    """Seed the database with common household products."""
    try:
        db = get_firestore_client()
        collection_ref = db.collection("product_info")
        
        created_count = 0
        updated_count = 0
        errors = []
        
        for product_data in COMMON_PRODUCTS:
            try:
                # Check if product already exists
                existing_query = collection_ref.where("upc", "==", product_data["upc"]).limit(1).get()
                
                # Add metadata
                now = datetime.utcnow()
                full_data = {
                    **product_data,
                    "updated_at": now,
                    "updated_by": user_id
                }
                
                if existing_query:
                    # Update existing
                    doc = existing_query[0]
                    doc.reference.update(full_data)
                    updated_count += 1
                    print(f"Updated product: {product_data['enhanced_name']} (UPC: {product_data['upc']})")
                else:
                    # Create new
                    full_data["created_at"] = now
                    full_data["created_by"] = user_id
                    
                    collection_ref.add(full_data)
                    created_count += 1
                    print(f"Created product: {product_data['enhanced_name']} (UPC: {product_data['upc']})")
                    
            except Exception as e:
                error_msg = f"Error processing {product_data.get('enhanced_name', 'Unknown')}: {str(e)}"
                errors.append(error_msg)
                print(f"ERROR: {error_msg}")
        
        result = {
            "status": "completed",
            "created": created_count,
            "updated": updated_count,
            "total_processed": len(COMMON_PRODUCTS),
            "errors": errors
        }
        
        print(f"Seed operation completed: {created_count} created, {updated_count} updated, {len(errors)} errors")
        return result
        
    except Exception as e:
        print(f"Fatal error in seed operation: {e}")
        return {
            "status": "failed",
            "error": str(e)
        }

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_product_data())
