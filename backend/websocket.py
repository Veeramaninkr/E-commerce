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
    elif ObjectId.is_valid(_id):
        user = await user_collection.find_one({"_id": ObjectId(_id)})
        if user and user.get("role") == "admin":
            is_admin = True
            admin_user = user

    if is_admin:
        admin_sockets.append(websocket)
        try:
            while True:
                data = await websocket.receive_text()
                if ":" in data:
                    target, message = data.split(":", 1)
                    
                    sender_name = admin_user.get("name") if admin_user else "Admin"
                    sender_email = admin_user.get("email") if admin_user else "admin@ecommerce.com"
                    
                    await chat_collection.insert_one({
                        "sender": "admin",
                        "sender_name": sender_name,
                        "sender_email": sender_email,
                        "receiver": target,
                        "message": message,
                        "timestamp": datetime.datetime.utcnow()
                    })
                    
                    # Send to target client
                    if target in users:
                        await users[target].send_text(message)
                    
                    # Broadcast to all admins (to sync parallel admin sessions)
                    admin_broadcast = json.dumps({
                        "client_id": target,
                        "username": sender_name,
                        "useremail": sender_email,
                        "message": message,
                        "is_admin_sending": True
                    })
                    for admin in admin_sockets:
                        await admin.send_text(admin_broadcast)
        except WebSocketDisconnect:
            if websocket in admin_sockets:
                admin_sockets.remove(websocket)

    else:
        users[_id] = websocket
        
        username = "Guest"
        useremail = "N/A"
        
        if ObjectId.is_valid(_id):
            db_user = await user_collection.find_one({"_id": ObjectId(_id)})
            if db_user:
                username = db_user.get("name", "User")
                useremail = db_user.get("email", "N/A")

        try:
            while True:
                data = await websocket.receive_text()
                
                await chat_collection.insert_one({
                    "sender": _id,
                    "sender_name": username,
                    "sender_email": useremail,
                    "receiver": "admin",
                    "message": data,
                    "timestamp": datetime.datetime.utcnow()
                })
                
                msg_payload = json.dumps({
                    "client_id": _id,
                    "username": username,
                    "useremail": useremail,
                    "message": data
                })
                
                for admin in admin_sockets:
                    await admin.send_text(msg_payload)
        except WebSocketDisconnect:
            users.pop(_id, None)


