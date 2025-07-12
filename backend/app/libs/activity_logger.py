from firebase_admin import firestore
import firebase_admin
from firebase_admin import credentials
import databutton as db
import json
from typing import Optional, Dict, Any

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
        raise Exception("Firebase service account key not found")

# Get Firestore client
firestore_db = firestore.client()

async def log_activity(
    user_id: str,
    user_name: str,
    household_id: str,
    action_type: str,
    action_description: str,
    entity_type: str,
    entity_id: Optional[str] = None,
    entity_name: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
):
    """
    Helper function to log an activity to Firestore
    """
    try:
        activity_data = {
            'household_id': household_id,
            'user_id': user_id,
            'user_name': user_name,
            'action_type': action_type,
            'action_description': action_description,
            'entity_type': entity_type,
            'entity_id': entity_id,
            'entity_name': entity_name,
            'metadata': metadata or {},
            'created_at': firestore.SERVER_TIMESTAMP
        }
        
        # Add to Firestore
        activities_ref = firestore_db.collection('activities')
        activities_ref.add(activity_data)
        
        print(f"Activity logged: {action_description}")
        
    except Exception as e:
        print(f"Error logging activity: {str(e)}")
        # Don't raise the error to avoid breaking the main operation
