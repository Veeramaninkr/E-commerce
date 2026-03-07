from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Request
from datetime import datetime
from typing import Dict, Optional
import models
import crud
import auth

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.user_connections: Dict[str, WebSocket] = {}
        self.admin_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, email: str, is_admin: bool):
        # Only accept if not already accepted/connecting
        from fastapi import WebSocketState
        if websocket.client_state == WebSocketState.CONNECTING:
            await websocket.accept()
            
        if is_admin:
            self.admin_connections[email] = websocket
        else:
            self.user_connections[email] = websocket

    def disconnect(self, email: str):
        if email in self.user_connections:
            del self.user_connections[email]
        if email in self.admin_connections:
            del self.admin_connections[email]

    async def broadcast_to_admins(self, message: dict):
        for connection in self.admin_connections.values():
            try:
                await connection.send_json(message)
            except Exception:
                pass

    async def send_to_user(self, email: str, message: dict):
        if email in self.user_connections:
            try:
                await self.user_connections[email].send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    # 1. Authenticate the user from the token
    print(f"DEBUG: WebSocket connection attempt with token: {token[:10]}...")
    
    # We accept first to avoid some browser "onerror" issues during handshake
    await websocket.accept()
    
    payload = auth.decode_access_token(token)
    if not payload:
        print("DEBUG: WebSocket authentication failed - invalid token")
        await websocket.close(code=1008) # Policy Violation
        return
    
    email = payload.get("sub")
    if not email:
        print("DEBUG: WebSocket authentication failed - no email in payload")
        await websocket.close(code=1008)
        return

    # 2. Get user details for role verification
    user = await crud.get_user_by_email(email)
    if not user:
        print(f"DEBUG: WebSocket connection failed - user {email} not found")
        await websocket.close(code=1008)
        return
    
    is_admin = user.get("role") == "admin"
    print(f"DEBUG: WebSocket authenticated for {email} (is_admin={is_admin})")
    await manager.connect(websocket, email, is_admin)
    
    try:
        while True:
            # Receive message data (expects JSON)
            data = await websocket.receive_json()
            
            msg_text = data.get("message")
            if not msg_text:
                continue
                
            timestamp = datetime.utcnow()
            
            if is_admin:
                # Admin sending to a specific client
                receiver_email = data.get("receiver")
                if receiver_email:
                    # Persist message to database
                    chat_msg = models.ChatMessage(
                        sender_email=email,
                        recipient_email=receiver_email,
                        message=msg_text,
                        is_admin=True
                    )
                    await crud.create_chat_message(chat_msg)
                    
                    # Notify the target client and all admins
                    msg_payload = {
                        "sender": email,
                        "receiver": receiver_email,
                        "message": msg_text,
                        "is_admin": True
                    }
                    await manager.send_to_user(receiver_email, msg_payload)
                    await manager.broadcast_to_admins(msg_payload)
            else:
               
                chat_msg = models.ChatMessage(
                    sender_email=email,
                    recipient_email=None, # Sent as broadcast to admins
                    message=msg_text,
                    is_admin=False
                )
                await crud.create_chat_message(chat_msg)
                        
                # Echo to client and notify all admins
                msg_payload = {
                    "sender": email,
                    "receiver": None,
                    "message": msg_text,
                    "is_admin": False
                }
                await websocket.send_json(msg_payload)
                await manager.broadcast_to_admins(msg_payload)
                
    except WebSocketDisconnect:
        manager.disconnect(email)
    except Exception as e:
        print(f"WebSocket Error for {email}: {e}")
        manager.disconnect(email)

async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    email = payload.get("sub")
    user = await crud.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/chat/history")
async def get_chat_history(email: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") == "admin" and email:
            # Admin requesting history with a specific user
        return await crud.get_chat_history_between_users(current_user["email"], email)
    # Regular user or admin requesting their own history
    return await crud.get_chat_history(current_user["email"])

@router.get("/chat/users")
async def get_chat_users(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await crud.get_chat_users()


