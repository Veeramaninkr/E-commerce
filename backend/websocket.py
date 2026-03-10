from fastapi import WebSocket, WebSocketDisconnect
from database import database, user_collection, chat_collection
from bson import ObjectId
import datetime
import json

users = {}
admin_sockets = []

async def user_socket(websocket: WebSocket, _id: str):
    await websocket.accept()
    
    is_admin = False
    admin_user = None
    
    if _id == "admin":
        is_admin = True
        # Note: if we need to know WHICH admin is connected, we might need auth headers
        # but for simplicity, we'll keep the current behavior where admin_user is None
        # and sender_email defaults to "admin"

    if is_admin:
        admin_sockets.append(websocket)
        try:
            while True:
                data = await websocket.receive_text()
                # Admins send in the format "target_email:message"
                if ":" in data:
                    target_email, message = data.split(":", 1)
                    
                    sender_email = admin_user.get("email") if admin_user else "admin"
                    timestamp = datetime.datetime.utcnow().isoformat()
                    
                    await chat_collection.insert_one({
                        "sender_email": sender_email,
                        "recipient_email": target_email,
                        "message": message,
                        "is_admin": True,
                        "timestamp": timestamp
                    })
                    
                    # Send to target client (as raw text)
                    if target_email in users:
                        try:
                            await users[target_email].send_text(message)
                        except Exception:
                            pass
                    
                    # Broadcast to all admins (as JSON for Admin UI)
                    admin_broadcast = json.dumps({
                        "sender": sender_email,
                        "receiver": target_email,
                        "message": message,
                        "is_admin": True,
                        "timestamp": timestamp
                    })
                    for admin in admin_sockets:
                        try:
                            await admin.send_text(admin_broadcast)
                        except Exception:
                            pass
        except WebSocketDisconnect:
            if websocket in admin_sockets:
                admin_sockets.remove(websocket)

    else:
        # Regular user connection
        users[_id] = websocket
        useremail = _id

        try:
            while True:
                data = await websocket.receive_text()
                timestamp = datetime.datetime.utcnow().isoformat()
                
                await chat_collection.insert_one({
                    "sender_email": useremail,
                    "recipient_email": None,
                    "message": data,
                    "is_admin": False,
                    "timestamp": timestamp
                })
                
                # Broadcast to admins (as JSON)
                msg_payload = json.dumps({
                    "sender": useremail,
                    "receiver": "admin",
                    "message": data,
                    "is_admin": False,
                    "timestamp": timestamp
                })
                
                for admin in admin_sockets:
                    try:
                        await admin.send_text(msg_payload)
                    except Exception:
                        pass
        except WebSocketDisconnect:
            users.pop(_id, None)
