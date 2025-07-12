from fastapi import APIRouter
import databutton as db
import json

router = APIRouter()

@router.get("/test-secret")
def test_secret():
    """
    Reads and attempts to parse the Firebase secret.
    """
    raw_secret = db.secrets.get("FIREBASE_SERVICE_ACCOUNT_KEY_JSON")
    try:
        json.loads(raw_secret)
        return {"status": "success", "message": "Secret parsed successfully"}
    except json.JSONDecodeError as e:
        return {"status": "error", "message": str(e), "raw_secret": raw_secret}
