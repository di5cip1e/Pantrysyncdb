from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import List, Optional
from app.libs.firebase_client import get_firestore_client
from app.libs.activity_logger import log_activity
from app.auth import AuthorizedUser
import asyncio

router = APIRouter()

class PantryItemRequest(BaseModel):
    name: str
    quantity: int
    expiry_date: Optional[datetime] = None
    is_staple: Optional[bool] = Field(default=False, description="Whether this item is marked as a household staple")
    voice_labels: Optional[List[str]] = Field(default_factory=list, description="Custom voice aliases for this item")
    display_name: Optional[str] = Field(default=None, description="Custom display name for this item")
    
    @validator('voice_labels')
    def validate_voice_labels(cls, v):
        if v is None:
            return []
        # Ensure all labels are strings and not empty
        valid_labels = [label.strip() for label in v if isinstance(label, str) and label.strip()]
        # Limit to 5 voice labels max and 50 chars each
        return [label[:50] for label in valid_labels[:5]]

class PantryItemResponse(PantryItemRequest):
    id: str
    added_by: str
    added_at: datetime
    usage_count: Optional[int] = Field(default=0, description="Number of times this item has been consumed")
    last_used: Optional[datetime] = Field(default=None, description="When this item was last consumed")
    times_suggested_as_staple: Optional[int] = Field(default=0, description="How many times we've suggested this as staple")

@router.post(
    "/households/{household_id}/pantry",
    response_model=PantryItemResponse,
    status_code=201,
)
async def add_pantry_item(
    household_id: str,
    item: PantryItemRequest,
    user: AuthorizedUser,
):
    """Adds a new item to a household's pantry."""
    try:
        db = get_firestore_client()
        
        # Verify the user is a member of the household (implement this logic later)
        
        item_data = item.dict()
        item_data["added_by"] = user.sub
        item_data["added_at"] = datetime.now()

        # Add the new item to the 'pantry' subcollection of the household
        item_ref = db.collection("households").document(household_id).collection("pantry").add(item_data)

        response_data = {
            "id": item_ref[1].id,
            **item_data,
        }
        
        # Log activity
        await log_activity(
            user_id=user.sub,
            user_name='User',  # Simplified user name
            household_id=household_id,
            action_type='add',
            action_description=f'Added {item.name} to pantry',
            entity_type='pantry_item',
            entity_id=item_ref[1].id,
            entity_name=item.name,
            metadata={'quantity': item.quantity}
        )
        
        # Trigger notification check
        await trigger_notification_check(user.sub, household_id)
        
        return PantryItemResponse(**response_data)
    except Exception as e:
        print(f"Error adding pantry item: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get(
    "/households/{household_id}/pantry",
    response_model=List[PantryItemResponse],
)
def get_pantry_items(household_id: str, user: AuthorizedUser):
    """Gets all items from a household's pantry."""
    try:
        db = get_firestore_client()
        
        # Verify the user is a member of the household (implement this logic later)

        items_ref = db.collection("households").document(household_id).collection("pantry").stream()
        
        items = []
        for item in items_ref:
            item_data = item.to_dict()
            item_data["id"] = item.id
            items.append(PantryItemResponse(**item_data))
            
        return items
    except Exception as e:
        print(f"Error getting pantry items: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


class PantryItemUpdateRequest(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    expiry_date: Optional[datetime] = None
    is_staple: Optional[bool] = None
    voice_labels: Optional[List[str]] = None
    display_name: Optional[str] = None
    usage_count: Optional[int] = None
    last_used: Optional[datetime] = None
    times_suggested_as_staple: Optional[int] = None
    
    @validator('voice_labels')
    def validate_voice_labels(cls, v):
        if v is None:
            return None
        # Ensure all labels are strings and not empty
        valid_labels = [label.strip() for label in v if isinstance(label, str) and label.strip()]
        # Limit to 5 voice labels max and 50 chars each
        return [label[:50] for label in valid_labels[:5]]


@router.put(
    "/households/{household_id}/pantry/{item_id}",
    response_model=PantryItemResponse,
)
async def update_pantry_item(
    household_id: str,
    item_id: str,
    item_update: PantryItemUpdateRequest,
    user: AuthorizedUser,
):
    """Updates an item in a household's pantry."""
    try:
        db = get_firestore_client()
        item_ref = db.collection("households").document(household_id).collection("pantry").document(item_id)
        
        # Get current item for logging
        current_item = item_ref.get()
        if not current_item.exists:
            raise HTTPException(status_code=404, detail="Item not found")
        current_data = current_item.to_dict()
        
        update_data = item_update.dict(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        item_ref.update(update_data)
        
        updated_item = item_ref.get()
        if not updated_item.exists:
            raise HTTPException(status_code=404, detail="Item not found after update")
        
        response_data = updated_item.to_dict()
        response_data["id"] = updated_item.id
        
        # Log activity
        update_description = f'Updated {current_data.get("name", "item")} in pantry'
        if 'name' in update_data:
            update_description = f'Renamed {current_data.get("name", "item")} to {update_data["name"]}'
        elif 'quantity' in update_data:
            update_description = f'Updated quantity of {current_data.get("name", "item")} to {update_data["quantity"]}'
        
        await log_activity(
            user_id=user.sub,
            user_name='User',  # Simplified user name
            household_id=household_id,
            action_type='update',
            action_description=update_description,
            entity_type='pantry_item',
            entity_id=item_id,
            entity_name=current_data.get('name'),
            metadata=update_data
        )
        
        # Trigger notification check
        await trigger_notification_check(user.sub, household_id)
        
        return PantryItemResponse(**response_data)
    except Exception as e:
        print(f"Error updating pantry item: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete(
    "/households/{household_id}/pantry/{item_id}",
    status_code=204,
)
async def delete_pantry_item(
    household_id: str,
    item_id: str,
    user: AuthorizedUser,
):
    """Deletes an item from a household's pantry."""
    try:
        db = get_firestore_client()
        item_ref = db.collection("households").document(household_id).collection("pantry").document(item_id)
        
        # Check if item exists and get its data for logging
        item_doc = item_ref.get()
        if not item_doc.exists:
             raise HTTPException(status_code=404, detail="Item not found")
        
        item_data = item_doc.to_dict()
        item_name = item_data.get('name', 'Unknown item')
        
        item_ref.delete()
        
        # Log activity
        await log_activity(
            user_id=user.sub,
            user_name='User',  # Simplified user name
            household_id=household_id,
            action_type='delete',
            action_description=f'Removed {item_name} from pantry',
            entity_type='pantry_item',
            entity_id=item_id,
            entity_name=item_name
        )
        
        # Trigger notification check
        await trigger_notification_check(user.sub, household_id)
        
        return
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error deleting pantry item: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


class ConsumptionRequest(BaseModel):
    item_name: str
    quantity_used: int = 1
    consumed_completely: bool = False


class ConsumptionResponse(BaseModel):
    success: bool
    message: str
    updated_item: Optional[PantryItemResponse] = None
    matched_by_voice_label: bool = False

@router.post(
    "/households/{household_id}/pantry/consume",
    response_model=ConsumptionResponse,
)
async def consume_pantry_item(
    household_id: str,
    consumption: ConsumptionRequest,
    user: AuthorizedUser,
):
    """Handle consumption of pantry items via voice commands with voice label matching."""
    try:
        db = get_firestore_client()
        
        # First, try to find item by exact name match
        items_ref = db.collection("households").document(household_id).collection("pantry")
        
        # Try exact name match first (case insensitive)
        name_query = items_ref.where("name", "==", consumption.item_name).limit(1).get()
        matched_by_voice = False
        
        item_doc = None
        if name_query:
            item_doc = name_query[0]
        else:
            # If no exact name match, search by voice labels
            all_items = items_ref.stream()
            for doc in all_items:
                data = doc.to_dict()
                voice_labels = data.get('voice_labels', [])
                
                # Check if any voice label matches (case insensitive)
                for label in voice_labels:
                    if label.lower() == consumption.item_name.lower():
                        item_doc = doc
                        matched_by_voice = True
                        break
                
                if item_doc:
                    break
        
        if not item_doc:
            return ConsumptionResponse(
                success=False,
                message=f"Item '{consumption.item_name}' not found in pantry"
            )
        
        # Get current item data
        item_data = item_doc.to_dict()
        current_quantity = item_data.get('quantity', 0)
        
        # Calculate new quantity
        if consumption.consumed_completely:
            new_quantity = 0
            actual_consumed = current_quantity
        else:
            actual_consumed = min(consumption.quantity_used, current_quantity)
            new_quantity = max(0, current_quantity - actual_consumed)
        
        # Update item with new quantity and usage tracking
        update_data = {
            'quantity': new_quantity,
            'usage_count': item_data.get('usage_count', 0) + 1,
            'last_used': datetime.now()
        }
        
        item_doc.reference.update(update_data)
        
        # Get updated item for response
        updated_doc = item_doc.reference.get()
        updated_data = updated_doc.to_dict()
        updated_data['id'] = updated_doc.id
        
        # Log activity
        item_name = item_data.get('name', 'Unknown item')
        if consumption.consumed_completely:
            action_desc = f"Finished all {item_name}"
        else:
            action_desc = f"Used {actual_consumed} {item_name}"
        
        if matched_by_voice:
            action_desc += f" (via voice label: '{consumption.item_name}')"
        
        await log_activity(
            user_id=user.sub,
            user_name='User',
            household_id=household_id,
            action_type='consume',
            action_description=action_desc,
            entity_type='pantry_item',
            entity_id=item_doc.id,
            entity_name=item_name,
            metadata={
                'quantity_consumed': actual_consumed,
                'new_quantity': new_quantity,
                'consumed_completely': consumption.consumed_completely,
                'matched_by_voice_label': matched_by_voice,
                'voice_label_used': consumption.item_name if matched_by_voice else None
            }
        )
        
        # Trigger notification check for low stock
        from app.apis.notifications import trigger_notification_check
        await trigger_notification_check(user.sub, household_id)
        
        success_message = f"Consumed {actual_consumed} {item_name}"
        if new_quantity == 0:
            success_message += " (item is now empty)"
        else:
            success_message += f" ({new_quantity} remaining)"
        
        return ConsumptionResponse(
            success=True,
            message=success_message,
            updated_item=PantryItemResponse(**updated_data),
            matched_by_voice_label=matched_by_voice
        )
        
    except Exception as e:
        print(f"Error consuming pantry item: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Import notification checking function
async def trigger_notification_check(user_id: str, household_id: str):
    """Trigger notification checking for a household after pantry changes."""
    try:
        # Import here to avoid circular imports
        from app.apis.notifications import check_and_create_notifications_for_user
        await check_and_create_notifications_for_user(user_id, household_id)
    except Exception as e:
        print(f"Error triggering notification check: {e}")
