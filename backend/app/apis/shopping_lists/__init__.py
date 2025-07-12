import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends, Query
from pydantic import BaseModel

from app.auth import AuthorizedUser
from app.libs.firebase_client import get_firestore_client
from app.libs.activity_logger import log_activity
from google.cloud.firestore_v1.client import Client

router = APIRouter()


# --- Pydantic Models ---
# Request models
class ShoppingListRequest(BaseModel):
    name: str


class ShoppingListItemRequest(BaseModel):
    name: str
    quantity: int = 1


# Response models
class ShoppingListResponse(ShoppingListRequest):
    id: str


class ShoppingListItemResponse(ShoppingListItemRequest):
    id: str
    purchased: bool = False


# --- Helper function to get user's household ---
async def get_user_household_id(user_id: str, db: Client) -> str:
    """Helper to get household ID for a user."""
    user_doc = db.collection("users").document(user_id).get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User profile not found.")
    
    user_data = user_doc.to_dict()
    household_id = user_data.get("householdId")
    if not household_id:
        raise HTTPException(status_code=404, detail="User is not in a household.")
    return household_id


# --- API Endpoints ---
@router.post(
    "/shopping-lists",
    response_model=ShoppingListResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_shopping_list(
    request: ShoppingListRequest,
    user: AuthorizedUser,
    db: Client = Depends(get_firestore_client),
):
    household_id = await get_user_household_id(user.sub, db)
    
    list_ref = db.collection("shopping_lists").document()
    list_ref.set(
        {"name": request.name, "householdId": household_id, "createdAt": datetime.now()}
    )
    
    # Log activity
    await log_activity(
        user_id=user.sub,
        user_name=f'User-{user.sub[:8]}',
        household_id=household_id,
        action_type='create',
        action_description=f'Created shopping list "{request.name}"',
        entity_type='shopping_list',
        entity_id=list_ref.id,
        entity_name=request.name
    )
    
    return {"id": list_ref.id, "name": request.name}


@router.get("/shopping-lists", response_model=list[ShoppingListResponse])
async def get_shopping_lists(
    user: AuthorizedUser,
    db: Client = Depends(get_firestore_client),
):
    household_id = await get_user_household_id(user.sub, db)
    lists_query = db.collection("shopping_lists").where("householdId", "==", household_id).stream()
    
    return [
        {"id": doc.id, "name": doc.to_dict().get("name")} for doc in lists_query
    ]


@router.delete("/shopping-lists/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_shopping_list(
    list_id: str,
    user: AuthorizedUser,
    db: Client = Depends(get_firestore_client),
):
    household_id = await get_user_household_id(user.sub, db)
    list_ref = db.collection("shopping_lists").document(list_id)
    list_doc = list_ref.get()

    if not list_doc.exists or list_doc.to_dict().get("householdId") != household_id:
        raise HTTPException(status_code=404, detail="Shopping list not found.")

    list_data = list_doc.to_dict()
    list_name = list_data.get('name', 'Unknown list')
    
    # Note: Deleting a document does not delete its subcollections.
    # For a complete cleanup, a background function would be needed.
    list_ref.delete()
    
    # Log activity
    await log_activity(
        user_id=user.sub,
        user_name=f'User-{user.sub[:8]}',
        household_id=household_id,
        action_type='delete',
        action_description=f'Deleted shopping list "{list_name}"',
        entity_type='shopping_list',
        entity_id=list_id,
        entity_name=list_name
    )
    
    return


@router.post(
    "/shopping-lists/{list_id}/items",
    response_model=ShoppingListItemResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_shopping_list_item(
    list_id: str,
    request: ShoppingListItemRequest,
    user: AuthorizedUser,
    db: Client = Depends(get_firestore_client),
):
    household_id = await get_user_household_id(user.sub, db)
    list_ref = db.collection("shopping_lists").document(list_id)
    list_doc = list_ref.get()

    if not list_doc.exists or list_doc.to_dict().get("householdId") != household_id:
        raise HTTPException(status_code=404, detail="Shopping list not found.")

    list_data = list_doc.to_dict()
    list_name = list_data.get('name', 'shopping list')
    
    item_ref = list_ref.collection("items").document()
    item_ref.set(
        {
            "name": request.name,
            "quantity": request.quantity,
            "purchased": False,
            "addedAt": datetime.now(),
            "addedBy": user.sub,
        }
    )
    
    # Log activity
    await log_activity(
        user_id=user.sub,
        user_name=f'User-{user.sub[:8]}',
        household_id=household_id,
        action_type='add',
        action_description=f'Added {request.name} to "{list_name}"',
        entity_type='shopping_list_item',
        entity_id=item_ref.id,
        entity_name=request.name,
        metadata={'list_name': list_name, 'quantity': request.quantity}
    )
    
    return {
        "id": item_ref.id,
        "name": request.name,
        "quantity": request.quantity,
        "purchased": False,
    }


@router.get(
    "/shopping-lists/{list_id}/items", response_model=list[ShoppingListItemResponse]
)
async def get_shopping_list_items(
    list_id: str,
    user: AuthorizedUser,
    db: Client = Depends(get_firestore_client),
):
    household_id = await get_user_household_id(user.sub, db)
    list_ref = db.collection("shopping_lists").document(list_id)
    list_doc = list_ref.get()

    if not list_doc.exists or list_doc.to_dict().get("householdId") != household_id:
        raise HTTPException(status_code=404, detail="Shopping list not found.")

    items_query = list_ref.collection("items").order_by("addedAt").stream()
    
    return [
        {
            "id": doc.id,
            "name": doc.to_dict().get("name"),
            "quantity": doc.to_dict().get("quantity"),
            "purchased": doc.to_dict().get("purchased"),
        }
        for doc in items_query
    ]


@router.put(
    "/shopping-lists/items/{item_id}", response_model=ShoppingListItemResponse
)
async def update_shopping_list_item(
    item_id: str,
    request: ShoppingListItemRequest,
    user: AuthorizedUser,
    list_id: str = Query(..., description="List ID"),
    db: Client = Depends(get_firestore_client),
):
    household_id = await get_user_household_id(user.sub, db)
    list_ref = db.collection("shopping_lists").document(list_id)
    item_ref = list_ref.collection("items").document(item_id)
    
    # Batch read for efficiency
    list_doc = list_ref.get()
    item_doc = item_ref.get()
    
    if not list_doc.exists or list_doc.to_dict().get("householdId") != household_id:
        raise HTTPException(status_code=404, detail="Shopping list not found.")
        
    if not item_doc.exists:
        raise HTTPException(status_code=404, detail="Item not found.")

    list_data = list_doc.to_dict()
    item_data = item_doc.to_dict()
    list_name = list_data.get('name', 'shopping list')
    item_name = item_data.get('name', 'item')
    
    update_data = request.dict(exclude_unset=True)
    item_ref.update(update_data)
    
    # Log activity
    action_description = f'Updated {item_name} in "{list_name}"'
    if 'name' in update_data:
        action_description = f'Renamed {item_name} to {update_data["name"]} in "{list_name}"'
    elif 'quantity' in update_data:
        action_description = f'Updated quantity of {item_name} to {update_data["quantity"]} in "{list_name}"'
    
    await log_activity(
        user_id=user.sub,
        user_name=f'User-{user.sub[:8]}',
        household_id=household_id,
        action_type='update',
        action_description=action_description,
        entity_type='shopping_list_item',
        entity_id=item_id,
        entity_name=item_name,
        metadata={'list_name': list_name, **update_data}
    )
    
    # Refetch the updated document to return it
    updated_doc = item_ref.get().to_dict()
    return {"id": item_id, **updated_doc}


@router.delete(
    "/shopping-lists/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_shopping_list_item(
    item_id: str,
    user: AuthorizedUser,
    list_id: str = Query(..., description="List ID"),
    db: Client = Depends(get_firestore_client),
):
    household_id = await get_user_household_id(user.sub, db)
    list_ref = db.collection("shopping_lists").document(list_id)
    item_ref = list_ref.collection("items").document(item_id)
    
    list_doc = list_ref.get()
    item_doc = item_ref.get()
    
    if not list_doc.exists or list_doc.to_dict().get("householdId") != household_id:
        raise HTTPException(status_code=404, detail="Shopping list not found.")
    
    if item_doc.exists:
        list_data = list_doc.to_dict()
        item_data = item_doc.to_dict()
        list_name = list_data.get('name', 'shopping list')
        item_name = item_data.get('name', 'item')
        
        item_ref.delete()
        
        # Log activity
        await log_activity(
            user_id=user.sub,
            user_name=f'User-{user.sub[:8]}',
            household_id=household_id,
            action_type='delete',
            action_description=f'Removed {item_name} from "{list_name}"',
            entity_type='shopping_list_item',
            entity_id=item_id,
            entity_name=item_name,
            metadata={'list_name': list_name}
        )
    
    return
