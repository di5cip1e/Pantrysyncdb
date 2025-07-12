import firebase_admin
from firebase_admin import credentials, firestore
import databutton as db
import json

# Get the service account key from secrets
service_account_key_json = db.secrets.get("FIREBASE_SERVICE_ACCOUNT_KEY_JSON")
service_account_key = json.loads(service_account_key_json)

# Initialize Firebase Admin SDK only if it hasn't been initialized yet
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(service_account_key)
        firebase_admin.initialize_app(cred)
        print("Firebase app initialized successfully.")
    except Exception as e:
        print(f"Error initializing Firebase app: {e}")


def get_firestore_client():
    """Provides a client for interacting with Firestore."""
    return firestore.client()
