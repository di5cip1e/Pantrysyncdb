from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.libs.firebase_client import get_firestore_client
from app.auth import AuthorizedUser

router = APIRouter()

class HouseholdMember(BaseModel):
    id: str
    role: str
    joined_at: str

@router.get(
    "/households/{household_id}/members",
    response_model=List[HouseholdMember],
)
def get_household_members(household_id: str, user: AuthorizedUser):
    """Gets all members of a household."""
    try:
        db = get_firestore_client()
        
        # Verify the user is a member of the household (implement this logic later)

        members_ref = db.collection("households").document(household_id).collection("members").stream()
        
        members = []
        for member in members_ref:
            member_data = member.to_dict()
            member_data["id"] = member.id
            # Ensure joined_at is a string
            member_data["joined_at"] = str(member_data.get("joined_at"))
            members.append(HouseholdMember(**member_data))
            
        return members
    except Exception as e:
        print(f"Error getting household members: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
