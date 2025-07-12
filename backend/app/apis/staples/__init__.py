from fastapi import APIRouter, HTTPException
from typing import List
from app.auth import AuthorizedUser
from app.libs.firebase_client import get_firestore_client
from app.apis.pantry import PantryItemResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
import math

router = APIRouter()


class StapleToggleRequest(BaseModel):
    is_staple: bool


class StaplesStatsResponse(BaseModel):
    total_staples: int
    low_stock_staples: int
    never_used_staples: int
    frequently_used_staples: int


class StapleSuggestion(BaseModel):
    item_id: str
    item_name: str
    usage_frequency: float
    days_since_added: int
    usage_count: int
    suggestion_score: float
    suggestion_reason: str


class StapleSuggestionsResponse(BaseModel):
    suggestions: List[StapleSuggestion]
    total_suggestions: int


class SuggestionActionRequest(BaseModel):
    action: str  # "accept" or "dismiss"


@router.get(
    "/households/{household_id}/staples",
    response_model=List[PantryItemResponse],
)
def get_staples(household_id: str, user: AuthorizedUser):
    """Gets all items marked as staples from a household's pantry."""
    try:
        db = get_firestore_client()
        
        # Query only items where is_staple is True
        items_ref = (
            db.collection("households")
            .document(household_id)
            .collection("pantry")
            .where("is_staple", "==", True)
            .stream()
        )
        
        staples = []
        for item in items_ref:
            item_data = item.to_dict()
            item_data["id"] = item.id
            staples.append(PantryItemResponse(**item_data))
            
        # Sort by usage - most used first, then by name
        staples.sort(key=lambda x: (-x.usage_count, x.name))
        
        return staples
    except Exception as e:
        print(f"Error getting staples: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put(
    "/households/{household_id}/pantry/{item_id}/staple",
    response_model=PantryItemResponse,
)
async def toggle_staple_status(
    household_id: str,
    item_id: str,
    toggle_request: StapleToggleRequest,
    user: AuthorizedUser,
):
    """Toggle the staple status of a pantry item."""
    try:
        db = get_firestore_client()
        item_ref = (
            db.collection("households")
            .document(household_id)
            .collection("pantry")
            .document(item_id)
        )
        
        # Check if item exists
        item_doc = item_ref.get()
        if not item_doc.exists:
            raise HTTPException(status_code=404, detail="Item not found")
        
        # Update the staple status
        item_ref.update({"is_staple": toggle_request.is_staple})
        
        # Get updated item
        updated_item = item_ref.get()
        response_data = updated_item.to_dict()
        response_data["id"] = updated_item.id
        
        # Log activity
        from app.apis.activities import log_activity
        item_name = response_data.get('name', 'Unknown item')
        action_desc = f"Marked {item_name} as staple" if toggle_request.is_staple else f"Unmarked {item_name} as staple"
        
        await log_activity(
            user_id=user.sub,
            user_name='User',
            household_id=household_id,
            action_type='update',
            action_description=action_desc,
            entity_type='pantry_item',
            entity_id=item_id,
            entity_name=item_name,
            metadata={'is_staple': toggle_request.is_staple}
        )
        
        return PantryItemResponse(**response_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error toggling staple status: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/households/{household_id}/staples/stats",
    response_model=StaplesStatsResponse,
)
def get_staples_stats(household_id: str, user: AuthorizedUser):
    """Get statistics about staples in the household."""
    try:
        db = get_firestore_client()
        
        # Get all staples
        staples_ref = (
            db.collection("households")
            .document(household_id)
            .collection("pantry")
            .where("is_staple", "==", True)
            .stream()
        )
        
        total_staples = 0
        low_stock_staples = 0
        never_used_staples = 0
        frequently_used_staples = 0
        
        for item in staples_ref:
            item_data = item.to_dict()
            total_staples += 1
            
            # Low stock (quantity <= 2 for staples)
            if item_data.get('quantity', 0) <= 2:
                low_stock_staples += 1
            
            # Never used (usage_count = 0)
            usage_count = item_data.get('usage_count', 0)
            if usage_count == 0:
                never_used_staples += 1
            elif usage_count >= 5:  # Frequently used threshold
                frequently_used_staples += 1
        
        return StaplesStatsResponse(
            total_staples=total_staples,
            low_stock_staples=low_stock_staples,
            never_used_staples=never_used_staples,
            frequently_used_staples=frequently_used_staples
        )
    except Exception as e:
        print(f"Error getting staples stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/households/{household_id}/staples/suggestions",
    response_model=StapleSuggestionsResponse,
)
def get_staple_suggestions(household_id: str, user: AuthorizedUser):
    """Get AI-powered suggestions for items that should be marked as staples."""
    try:
        db = get_firestore_client()
        
        # Get all non-staple items with usage data
        items_ref = (
            db.collection("households")
            .document(household_id)
            .collection("pantry")
            .where("is_staple", "==", False)
            .stream()
        )
        
        suggestions = []
        current_time = datetime.now()
        
        for item in items_ref:
            item_data = item.to_dict()
            item_id = item.id
            
            # Skip items that have been suggested too many times
            times_suggested = item_data.get('times_suggested_as_staple', 0)
            if times_suggested >= 3:
                continue
            
            # Calculate usage metrics
            usage_count = item_data.get('usage_count', 0)
            added_at = item_data.get('added_at')
            
            if not added_at or usage_count == 0:
                continue
            
            # Calculate days since added
            if isinstance(added_at, str):
                added_date = datetime.fromisoformat(added_at.replace('Z', '+00:00'))
            else:
                added_date = added_at
            
            days_since_added = (current_time - added_date).days
            if days_since_added < 7:  # Need at least a week of data
                continue
            
            # Calculate usage frequency (uses per week)
            usage_frequency = (usage_count / max(days_since_added, 1)) * 7
            
            # Calculate suggestion score (0-100)
            suggestion_score = 0
            suggestion_reasons = []
            
            # High usage frequency (weight: 40%)
            if usage_frequency >= 2.0:  # 2+ times per week
                suggestion_score += 40
                suggestion_reasons.append(f"Used {usage_frequency:.1f} times per week")
            elif usage_frequency >= 1.0:  # 1+ times per week
                suggestion_score += 25
                suggestion_reasons.append(f"Used {usage_frequency:.1f} times per week")
            
            # Total usage count (weight: 30%)
            if usage_count >= 10:
                suggestion_score += 30
                suggestion_reasons.append(f"Used {usage_count} times total")
            elif usage_count >= 5:
                suggestion_score += 20
                suggestion_reasons.append(f"Used {usage_count} times total")
            
            # Consistency over time (weight: 20%)
            last_used = item_data.get('last_used')
            if last_used:
                if isinstance(last_used, str):
                    last_used_date = datetime.fromisoformat(last_used.replace('Z', '+00:00'))
                else:
                    last_used_date = last_used
                
                days_since_last_use = (current_time - last_used_date).days
                if days_since_last_use <= 7:  # Used within last week
                    suggestion_score += 20
                    suggestion_reasons.append("Recently used")
                elif days_since_last_use <= 14:  # Used within last 2 weeks
                    suggestion_score += 10
            
            # Item age bonus (weight: 10%)
            if days_since_added >= 30:  # Established item
                suggestion_score += 10
                suggestion_reasons.append("Long-term pantry item")
            
            # Only suggest items with score >= 50
            if suggestion_score >= 50:
                suggestions.append(StapleSuggestion(
                    item_id=item_id,
                    item_name=item_data.get('name', 'Unknown'),
                    usage_frequency=round(usage_frequency, 2),
                    days_since_added=days_since_added,
                    usage_count=usage_count,
                    suggestion_score=round(suggestion_score, 1),
                    suggestion_reason=', '.join(suggestion_reasons)
                ))
        
        # Sort by suggestion score (highest first)
        suggestions.sort(key=lambda x: x.suggestion_score, reverse=True)
        
        # Limit to top 5 suggestions
        suggestions = suggestions[:5]
        
        return StapleSuggestionsResponse(
            suggestions=suggestions,
            total_suggestions=len(suggestions)
        )
    except Exception as e:
        print(f"Error getting staple suggestions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post(
    "/households/{household_id}/staples/suggestions/{item_id}/{action}",
)
async def handle_staple_suggestion(
    household_id: str,
    item_id: str,
    action: str,
    user: AuthorizedUser,
):
    """Handle acceptance or dismissal of a staple suggestion."""
    try:
        if action not in ["accept", "dismiss"]:
            raise HTTPException(status_code=400, detail="Action must be 'accept' or 'dismiss'")
        
        db = get_firestore_client()
        item_ref = (
            db.collection("households")
            .document(household_id)
            .collection("pantry")
            .document(item_id)
        )
        
        # Check if item exists
        item_doc = item_ref.get()
        if not item_doc.exists:
            raise HTTPException(status_code=404, detail="Item not found")
        
        item_data = item_doc.to_dict()
        item_name = item_data.get('name', 'Unknown item')
        
        if action == "accept":
            # Mark as staple
            item_ref.update({
                "is_staple": True,
                "times_suggested_as_staple": item_data.get('times_suggested_as_staple', 0) + 1
            })
            
            # Log activity
            from app.apis.activities import log_activity
            await log_activity(
                user_id=user.sub,
                user_name='User',
                household_id=household_id,
                action_type='ai_suggestion',
                action_description=f"Accepted AI suggestion to mark {item_name} as staple",
                entity_type='pantry_item',
                entity_id=item_id,
                entity_name=item_name,
                metadata={'action': 'accept_staple_suggestion', 'ai_suggested': True}
            )
            
            return {"success": True, "message": f"Marked {item_name} as staple"}
        
        else:  # dismiss
            # Increment suggestion counter to avoid re-suggesting too soon
            item_ref.update({
                "times_suggested_as_staple": item_data.get('times_suggested_as_staple', 0) + 1
            })
            
            # Log activity
            from app.apis.activities import log_activity
            await log_activity(
                user_id=user.sub,
                user_name='User',
                household_id=household_id,
                action_type='ai_suggestion',
                action_description=f"Dismissed AI suggestion for {item_name}",
                entity_type='pantry_item',
                entity_id=item_id,
                entity_name=item_name,
                metadata={'action': 'dismiss_staple_suggestion'}
            )
            
            return {"success": True, "message": f"Dismissed suggestion for {item_name}"}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error handling staple suggestion: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
