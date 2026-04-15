from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from bson import ObjectId
from database import groups_collection
from models import GroupCreate

router = APIRouter()


def serialize_group(group):
    return {
        "groupId": str(group["_id"]),
        "group_name": group["group_name"],
        "currency": group["currency"],
        "members": group["members"],
        "created_at": group.get("created_at"),
    }


# ✅ CREATE GROUP
@router.post("/create-group")
def create_group(data: GroupCreate):
    group_doc = {
        "group_name": data.group_name,
        "currency": data.currency,
        "members": data.members,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    # ✅ Use custom group_id if provided (like hello77)
    if data.group_id:
        # Check if already exists
        existing = groups_collection.find_one({"_id": data.group_id})
        if existing:
            raise HTTPException(status_code=400, detail="Group ID already exists")

        group_doc["_id"] = data.group_id

    # If no ID provided → Mongo will generate one
    result = groups_collection.insert_one(group_doc)

    return {"groupId": str(result.inserted_id)}


@router.get("/group/{groupId}")
def get_group(groupId: str):
    group = groups_collection.find_one({"_id": groupId})

    if not group:
        try:
            group = groups_collection.find_one({"_id": ObjectId(groupId)})
        except Exception:
            pass

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    return serialize_group(group)