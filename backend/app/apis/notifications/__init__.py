from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from app.libs.firebase_client import get_firestore_client
from app.auth import AuthorizedUser
from google.cloud.firestore_v1.client import Client
import asyncio

router = APIRouter()

# Pydantic Models
class NotificationPreferences(BaseModel):
    low_stock_enabled: bool = True
    low_stock_threshold: int = Field(default=3, ge=1, le=100)
    expiry_enabled: bool = True
    expiry_days_ahead: int = Field(default=3, ge=1, le=30)
    
class NotificationResponse(BaseModel):
    id: str
    type: str  # 'low_stock' or 'expiry'
    title: str
    message: str
    item_id: str
    item_name: str
    household_id: str
    created_at: datetime
    is_read: bool = False
    metadata: Optional[Dict[str, Any]] = None

class CreateNotificationRequest(BaseModel):
    type: str
    title: str
    message: str
    item_id: str
    item_name: str
    metadata: Optional[Dict[str, Any]] = None

# Helper function to get user's household
async def get_user_household_id(user_id: str, db: Client) -> str:
    user_doc = db.collection("users").document(user_id).get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    user_data = user_doc.to_dict()
    household_id = user_data.get("householdId")
    if not household_id:
        raise HTTPException(status_code=404, detail="User is not in a household")
    
    return household_id

@router.get("/notifications/preferences", response_model=NotificationPreferences)
async def get_notification_preferences(
    user: AuthorizedUser,
    db: Client = Depends(get_firestore_client)
):
    """Get user's notification preferences."""
    prefs_doc = db.collection("notification_preferences").document(user.sub).get()
    
    if prefs_doc.exists:
        return NotificationPreferences(**prefs_doc.to_dict())
    else:
        # Return default preferences
        return NotificationPreferences()

@router.put("/notifications/preferences")
async def update_notification_preferences(
    preferences: NotificationPreferences,
    user: AuthorizedUser,
    db: Client = Depends(get_firestore_client)
):
    """Update user's notification preferences."""
    db.collection("notification_preferences").document(user.sub).set(preferences.dict())
    return {"success": True, "message": "Preferences updated successfully"}

@router.get("/notifications", response_model=List[NotificationResponse])
async def get_notifications(
    user: AuthorizedUser,
    db: Client = Depends(get_firestore_client),
    limit: int = 50
):
    """Get user's notifications."""
    household_id = await get_user_household_id(user.sub, db)
    
    notifications_query = (
        db.collection("notifications")
        .where("household_id", "==", household_id)
        .order_by("created_at", direction="DESCENDING")
        .limit(limit)
        .stream()
    )
    
    notifications = []
    for doc in notifications_query:
        data = doc.to_dict()
        data["id"] = doc.id
        notifications.append(NotificationResponse(**data))
    
    return notifications

@router.post("/notifications/{notification_id}/mark-read")
async def mark_notification_read(
    notification_id: str,
    user: AuthorizedUser,
    db: Client = Depends(get_firestore_client)
):
    """Mark a notification as read."""
    household_id = await get_user_household_id(user.sub, db)
    
    notification_ref = db.collection("notifications").document(notification_id)
    notification_doc = notification_ref.get()
    
    if not notification_doc.exists:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification_data = notification_doc.to_dict()
    if notification_data.get("household_id") != household_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    notification_ref.update({"is_read": True})
    return {"success": True, "message": "Notification marked as read"}

@router.post("/notifications/check")
async def check_and_create_notifications(
    user: AuthorizedUser,
    db: Client = Depends(get_firestore_client)
):
    """Check for low stock and expiry conditions and create notifications."""
    household_id = await get_user_household_id(user.sub, db)
    
    # Get user's notification preferences
    prefs_doc = db.collection("notification_preferences").document(user.sub).get()
    if prefs_doc.exists:
        prefs = NotificationPreferences(**prefs_doc.to_dict())
    else:
        prefs = NotificationPreferences()
    
    notifications_created = []
    
    # Get all pantry items for the household
    pantry_items = db.collection("households").document(household_id).collection("pantry").stream()
    
    for item_doc in pantry_items:
        item_data = item_doc.to_dict()
        item_id = item_doc.id
        item_name = item_data.get("name", "Unknown item")
        quantity = item_data.get("quantity", 0)
        expiry_date = item_data.get("expiry_date")
        
        # Check for low stock
        if prefs.low_stock_enabled and quantity <= prefs.low_stock_threshold:
            notification_id = await create_notification(
                db, household_id, "low_stock",
                f"Low Stock Alert: {item_name}",
                f"{item_name} is running low (only {quantity} left)",
                item_id, item_name, 
                {"quantity": quantity, "threshold": prefs.low_stock_threshold}
            )
            if notification_id:
                notifications_created.append({
                    "id": notification_id,
                    "type": "low_stock",
                    "item_name": item_name
                })
        
        # Check for expiry
        if prefs.expiry_enabled and expiry_date:
            if isinstance(expiry_date, str):
                expiry_date = datetime.fromisoformat(expiry_date.replace('Z', '+00:00'))
            
            days_until_expiry = (expiry_date - datetime.now()).days
            
            if 0 <= days_until_expiry <= prefs.expiry_days_ahead:
                if days_until_expiry == 0:
                    title = f"Expired: {item_name}"
                    message = f"{item_name} has expired today"
                elif days_until_expiry == 1:
                    title = f"Expires Tomorrow: {item_name}"
                    message = f"{item_name} expires tomorrow"
                else:
                    title = f"Expires Soon: {item_name}"
                    message = f"{item_name} expires in {days_until_expiry} days"
                
                notification_id = await create_notification(
                    db, household_id, "expiry", title, message,
                    item_id, item_name,
                    {"expiry_date": expiry_date.isoformat(), "days_until_expiry": days_until_expiry}
                )
                if notification_id:
                    notifications_created.append({
                        "id": notification_id,
                        "type": "expiry",
                        "item_name": item_name,
                        "days_until_expiry": days_until_expiry
                    })
    
    return {
        "success": True,
        "notifications_created": len(notifications_created),
        "notifications": notifications_created
    }

async def create_notification(
    db: Client, household_id: str, notification_type: str,
    title: str, message: str, item_id: str, item_name: str,
    metadata: Optional[Dict[str, Any]] = None
) -> Optional[str]:
    """Create a notification if it doesn't already exist."""
    
    # Check if a similar notification already exists (within last 24 hours)
    yesterday = datetime.now() - timedelta(days=1)
    existing_query = (
        db.collection("notifications")
        .where("household_id", "==", household_id)
        .where("type", "==", notification_type)
        .where("item_id", "==", item_id)
        .where("created_at", ">=", yesterday)
        .limit(1)
        .stream()
    )
    
    # If similar notification exists, don't create duplicate
    for _ in existing_query:
        return None
    
    # Create new notification
    notification_data = {
        "type": notification_type,
        "title": title,
        "message": message,
        "item_id": item_id,
        "item_name": item_name,
        "household_id": household_id,
        "created_at": datetime.now(),
        "is_read": False,
        "metadata": metadata or {}
    }
    
    doc_ref = db.collection("notifications").add(notification_data)
    return doc_ref[1].id

# Helper function for triggering notification checks from other APIs
async def check_and_create_notifications_for_user(user_id: str, household_id: str):
    """Helper function to check notifications for a specific user and household."""
    try:
        db = get_firestore_client()
        
        # Get user's notification preferences
        prefs_doc = db.collection("notification_preferences").document(user_id).get()
        if prefs_doc.exists:
            prefs = NotificationPreferences(**prefs_doc.to_dict())
        else:
            prefs = NotificationPreferences()
        
        # Get all pantry items for the household
        pantry_items = db.collection("households").document(household_id).collection("pantry").stream()
        
        notifications_created = 0
        
        for item_doc in pantry_items:
            item_data = item_doc.to_dict()
            item_id = item_doc.id
            item_name = item_data.get("name", "Unknown item")
            quantity = item_data.get("quantity", 0)
            expiry_date = item_data.get("expiry_date")
            
            # Check for low stock
            if prefs.low_stock_enabled and quantity <= prefs.low_stock_threshold:
                notification_id = await create_notification(
                    db, household_id, "low_stock",
                    f"Low Stock Alert: {item_name}",
                    f"{item_name} is running low (only {quantity} left)",
                    item_id, item_name, 
                    {"quantity": quantity, "threshold": prefs.low_stock_threshold}
                )
                if notification_id:
                    notifications_created += 1
            
            # Check for expiry
            if prefs.expiry_enabled and expiry_date:
                if isinstance(expiry_date, str):
                    expiry_date = datetime.fromisoformat(expiry_date.replace('Z', '+00:00'))
                
                days_until_expiry = (expiry_date - datetime.now()).days
                
                if 0 <= days_until_expiry <= prefs.expiry_days_ahead:
                    if days_until_expiry == 0:
                        title = f"Expired: {item_name}"
                        message = f"{item_name} has expired today"
                    elif days_until_expiry == 1:
                        title = f"Expires Tomorrow: {item_name}"
                        message = f"{item_name} expires tomorrow"
                    else:
                        title = f"Expires Soon: {item_name}"
                        message = f"{item_name} expires in {days_until_expiry} days"
                    
                    notification_id = await create_notification(
                        db, household_id, "expiry", title, message,
                        item_id, item_name,
                        {"expiry_date": expiry_date.isoformat(), "days_until_expiry": days_until_expiry}
                    )
                    if notification_id:
                        notifications_created += 1
        
        print(f"Automatically created {notifications_created} notifications for household {household_id}")
        
    except Exception as e:
        print(f"Error in automatic notification check: {e}")
