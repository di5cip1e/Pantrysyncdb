import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth import AuthorizedUser
from app.libs.firebase_client import get_firestore_client
from google.cloud.firestore_v1.client import Client

router = APIRouter()

class CreateHouseholdRequest(BaseModel):
    name: str

class HouseholdResponse(BaseModel):
    id: str
    name: str
    role: str

class InvitationResponse(BaseModel):
    invite_code: str

class JoinHouseholdRequest(BaseModel):
    invite_code: str

@router.post("/households", response_model=HouseholdResponse)
async def create_household(
    request: CreateHouseholdRequest, 
    user: AuthorizedUser, 
    db: Client = Depends(get_firestore_client)
):
    # Check if user is already in a household
    user_ref = db.collection("users").document(user.sub)
    user_doc = user_ref.get()
    if user_doc.exists and user_doc.to_dict().get("householdId"):
        raise HTTPException(status_code=400, detail="User is already in a household.")

    # Use a batch for atomic write
    batch = db.batch()
    
    # Create new household
    household_ref = db.collection("households").document()
    batch.set(household_ref, {"name": request.name})
    
    # Add the creator as the first member and admin
    batch.set(user_ref, {"householdId": household_ref.id, "role": "admin"})
    
    batch.commit()
    
    return HouseholdResponse(id=household_ref.id, name=request.name, role="admin")

@router.get("/households/me", response_model=HouseholdResponse)
async def get_my_household(user: AuthorizedUser, db: Client = Depends(get_firestore_client)):
    user_doc = db.collection("users").document(user.sub).get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User profile not found.")
        
    user_data = user_doc.to_dict()
    household_id = user_data.get("householdId")
    role = user_data.get("role")

    if not household_id:
        raise HTTPException(status_code=404, detail="User is not in a household.")
        
    household_doc = db.collection("households").document(household_id).get()
    if not household_doc.exists:
        # This case indicates data inconsistency.
        raise HTTPException(status_code=404, detail="Household not found.")
        
    household_data = household_doc.to_dict()
    return HouseholdResponse(id=household_doc.id, name=household_data.get("name"), role=role)

@router.post("/households/{household_id}/invitations", response_model=InvitationResponse)
async def create_invitation(
    household_id: str, user: AuthorizedUser, db: Client = Depends(get_firestore_client)
):
    # Verify user is part of the household before allowing to create an invite
    user_doc = db.collection("users").document(user.sub).get()
    if not user_doc.exists or user_doc.to_dict().get("householdId") != household_id:
        raise HTTPException(status_code=403, detail="User is not a member of this household.")

    invite_code = str(uuid.uuid4())[:8]
    db.collection("invitations").document(invite_code).set({
        "householdId": household_id,
    })
    return InvitationResponse(invite_code=invite_code)

@router.post("/households/join", status_code=204)
async def join_household(
    request: JoinHouseholdRequest, user: AuthorizedUser, db: Client = Depends(get_firestore_client)
):
    # Check if user is already in a household
    user_ref = db.collection("users").document(user.sub)
    if user_ref.get().exists and user_ref.get().to_dict().get("householdId"):
        raise HTTPException(status_code=400, detail="User is already in a household.")

    # Find the household associated with the invite code
    invite_ref = db.collection("invitations").document(request.invite_code)
    invite_doc = invite_ref.get()
    
    if not invite_doc.exists:
        raise HTTPException(status_code=404, detail="Invalid invite code")
        
    household_id = invite_doc.to_dict().get("householdId")
    
    # Use a batch to add user and delete invite atomically
    batch = db.batch()
    batch.set(user_ref, {"householdId": household_id, "role": "member"})
    batch.delete(invite_ref)
    batch.commit()
