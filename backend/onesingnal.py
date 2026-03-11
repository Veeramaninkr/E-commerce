from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
import urllib.request
import urllib.error
import json
import os
from dotenv import load_dotenv

import auth
import crud

load_dotenv()

router = APIRouter(prefix="/notifications", tags=["notifications"])

# Using the keys provided by the user
ONESIGNAL_APP_ID = "2380f755-4e67-48ac-b906-6c680d6c67a1"
ONESIGNAL_REST_API_KEY = "ryhmfrgkfe27urhhvurccu77m"

class PushNotification(BaseModel):
    title: str
    message: str

async def get_current_admin(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    email = payload.get("sub")
    user = await crud.user_collection.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
        
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
        
    return user

@router.post("/send")
async def send_notification(notification: PushNotification, admin_user: dict = Depends(get_current_admin)):
    """
    Send push notifications using OneSignal. Admin access required.
    """
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": f"Basic {ONESIGNAL_REST_API_KEY}"
    }

    payload = {
        "app_id": ONESIGNAL_APP_ID,
        "included_segments": ["All"],  # Or if you still want a specific player ID: "include_player_ids": ["USER_PLAYER_ID"]
        "headings": {"en": notification.title},
        "contents": {"en": notification.message}
    }

    req = urllib.request.Request(
        "https://onesignal.com/api/v1/notifications",
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read()
            return {"status": "success", "response": json.loads(res_body.decode('utf-8'))}
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        raise HTTPException(status_code=e.code, detail=f"OneSignal API Error: {error_msg}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))