from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import databutton as db
import json
from app.auth import AuthorizedUser

router = APIRouter()

# Initialize Firebase Admin (if not already done)
try:
    firebase_admin.get_app()
except ValueError:
    # App not initialized, so initialize it
    service_account_key = db.secrets.get("FIREBASE_SERVICE_ACCOUNT_KEY_JSON")
    if service_account_key:
        service_account_info = json.loads(service_account_key)
        cred = credentials.Certificate(service_account_info)
        firebase_admin.initialize_app(cred)
    else:
        raise HTTPException(status_code=500, detail="Firebase service account key not found")

# Get Firestore client
firestore_db = firestore.client()

class ActivityCreate(BaseModel):
    action_type: str  # 'add', 'update', 'delete', 'complete', etc.
    action_description: str  # Human readable description
    entity_type: str  # 'pantry_item', 'shopping_list', 'shopping_list_item', 'household'
    entity_id: Optional[str] = None
    entity_name: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class ActivityResponse(BaseModel):
    id: str
    household_id: str
    user_id: str
    user_name: str
    action_type: str
    action_description: str
    entity_type: str
    entity_id: Optional[str]
    entity_name: Optional[str]
    metadata: Optional[Dict[str, Any]]
    created_at: datetime

@router.post("/activities", response_model=dict)
async def log_activity(activity: ActivityCreate, user: AuthorizedUser):
    """
    Log an activity for the user's household
    """
    try:
        # Get user's household ID from their user document
        user_ref = firestore_db.collection('users').document(user.sub)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User profile not found")
            
        user_data = user_doc.to_dict()
        household_id = user_data.get('householdId')
        
        if not household_id:
            raise HTTPException(status_code=404, detail="User is not part of any household")
        
        # Create activity document
        activity_data = {
            'household_id': household_id,
            'user_id': user.sub,
            'user_name': user.display_name or user.primary_email or 'Unknown User',
            'action_type': activity.action_type,
            'action_description': activity.action_description,
            'entity_type': activity.entity_type,
            'entity_id': activity.entity_id,
            'entity_name': activity.entity_name,
            'metadata': activity.metadata or {},
            'created_at': firestore.SERVER_TIMESTAMP
        }
        
        # Add to Firestore
        activities_ref = firestore_db.collection('activities')
        doc_ref = activities_ref.add(activity_data)
        
        return {
            'success': True,
            'activity_id': doc_ref[1].id,
            'message': 'Activity logged successfully'
        }
        
    except Exception as e:
        print(f"Error logging activity: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to log activity: {str(e)}")

@router.get("/activities", response_model=List[ActivityResponse])
async def get_household_activities(user: AuthorizedUser, limit: int = 50):
    """
    Get recent activities for the user's household
    """
    try:
        # Get user's household ID from their user document
        user_ref = firestore_db.collection('users').document(user.sub)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User profile not found")
            
        user_data = user_doc.to_dict()
        household_id = user_data.get('householdId')
        
        if not household_id:
            raise HTTPException(status_code=404, detail="User is not part of any household")
        
        # Get activities for this household
        activities_ref = firestore_db.collection('activities')
        activities_query = (
            activities_ref
            .where(filter=FieldFilter('household_id', '==', household_id))
            .limit(limit)
        )
        
        activities = []
        for doc in activities_query.stream():
            activity_data = doc.to_dict()
            activity_data['id'] = doc.id
            
            # Convert Firestore timestamp to datetime
            if 'created_at' in activity_data:
                created_at = activity_data['created_at']
                if hasattr(created_at, 'timestamp'):
                    activity_data['created_at'] = datetime.fromtimestamp(created_at.timestamp())
                elif isinstance(created_at, datetime):
                    # Already a datetime object
                    pass
                else:
                    # Fallback to current time if we can't parse
                    activity_data['created_at'] = datetime.now()
            else:
                activity_data['created_at'] = datetime.now()
            
            activities.append(ActivityResponse(**activity_data))
        
        # Sort activities by created_at in Python (most recent first)
        activities.sort(key=lambda x: x.created_at, reverse=True)
        
        return activities
        
    except Exception as e:
        print(f"Error fetching activities: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch activities: {str(e)}")
