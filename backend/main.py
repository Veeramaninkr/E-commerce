from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from jose import JWTError, jwt

import models
import crud
import auth
import asyncio
import database
import shutil
import os
import uuid
from fastapi.staticfiles import StaticFiles
from fastapi import File, UploadFile
import websocket

app = FastAPI()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.on_event("startup")
async def startup_event():
    loop = asyncio.get_running_loop()
    existing_handler = loop.get_exception_handler()

    def custom_handler(loop, context):
        if "exception" in context:
            exc = context["exception"]
            if isinstance(exc, ConnectionResetError):
                return
        
        if existing_handler:
            existing_handler(loop, context)
        else:
            loop.default_exception_handler(context)

    loop.set_exception_handler(custom_handler)

@app.on_event("shutdown")
async def shutdown_event():
    database.client.close()

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_current_user(request: Request):
    # Check for token in cookies first, then in Authorization header
    token = request.cookies.get("access_token")
    print(f"DEBUG: Cookie token found: {token is not None}")
    
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            print(f"DEBUG: Header token found: {token is not None}")
            
    if not token:
        print("DEBUG: No token found in request")
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = auth.decode_access_token(token)
    if not payload:
        print("DEBUG: Token decoding failed")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    email = payload.get("sub")
    user = await crud.user_collection.find_one({"email": email})
    if user is None:
        print(f"DEBUG: User not found for email: {email}")
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --- AUTH ---
@app.post("/register", response_model=models.UserResponse)
async def register(user: models.UserCreate):
    db_user = await crud.create_user(user)
    if not db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return db_user

@app.post("/login")
async def login(request: models.LoginRequest, response: Response):
    user = await crud.get_user_by_email(request.email)
    if not user or not auth.verify_password(request.password, user["password"]):
         raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": user["email"]})
    response.set_cookie(
        key="access_token",
        value=access_token,
        path="/",
        httponly=True,
        max_age=auth.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False,
    )
    return {"message": "Login successful"}

@app.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return {"message": "Logout successful"}

@app.get("/me", response_model=models.UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# --- USERS ---
@app.get("/users", response_model=List[models.UserResponse])
async def read_users(current_user: dict = Depends(get_current_user)):
    return await crud.get_users()

@app.patch("/users/{user_id}/role", response_model=models.UserResponse)
async def update_user_role(user_id: str, role_update: models.UserRoleUpdate, current_user: dict = Depends(get_current_user)):
    res = await crud.update_user_role(user_id, role_update.role)
    if not res:
        raise HTTPException(status_code=404, detail="User not found")
    return res

# --- PRODUCTS ---
@app.get("/products", response_model=List[models.ProductResponse])
async def read_products(skip: int = 0, limit: int = 100):
    return await crud.get_products(skip, limit)

@app.post("/products", response_model=models.ProductResponse)
async def create_product(product: models.ProductCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await crud.create_product(product)

@app.patch("/products/{product_id}", response_model=models.ProductResponse)
async def update_product(product_id: str, product: models.ProductUpdate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    res = await crud.update_product(product_id, product.model_dump())
    if not res:
        raise HTTPException(status_code=404, detail="Product not found")
    return res

@app.delete("/products/{product_id}")
async def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    if not await crud.delete_product(product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}
# --- ORDERS ---
@app.get("/orders", response_model=models.PaginatedOrderResponse)
async def read_orders(search: str = None, status: str = None, page: int = 1, limit: int = 10, current_user: dict = Depends(get_current_user)):
    orders_data = await crud.get_orders(search, status, page, limit)
    return {
        "message": "Orders fetched successfully",
        "data": orders_data["data"],
        "meta": orders_data["meta"]
    }

@app.post("/orders", response_model=models.OrderResponse)
async def create_order(order: models.OrderCreate):
    return await crud.create_order(order)

@app.patch("/orders/{order_id}", response_model=models.OrderResponse)
async def update_order(order_id: str, order: models.OrderUpdate, current_user: dict = Depends(get_current_user)):
    res = await crud.update_order(order_id, order.model_dump())
    if not res:
        raise HTTPException(status_code=404, detail="Order not found")
    return res

@app.delete("/orders/{order_id}")
async def delete_order(order_id: str, current_user: dict = Depends(get_current_user)):
    if not await crud.delete_order(order_id):
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted"}

# --- UPLOAD ---
@app.get("/upload")
async def upload_help():
    return {"message": "This endpoint is for file uploads. Use POST with multipart/form-data to upload images."}

@app.post("/upload")
async def upload_image(request: Request, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    _, file_extension = os.path.splitext(file.filename or "")
    file_extension = file_extension.lower()
    if file_extension not in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Supported: JPG, PNG, WEBP, GIF.")
    
    try:
        contents = await file.read()
        asset_id = await crud.create_asset(contents, file.content_type or "image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store asset: {str(e)}")
    
    # Return a dynamic URL based on the current request
    base_url = str(request.base_url).rstrip("/")
    return {"url": f"{base_url}/assets/{asset_id}"}

@app.get("/assets/{asset_id}")
async def get_asset(asset_id: str):
    asset = await crud.get_asset_binary(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    return Response(content=asset["data"], media_type=asset["mime_type"])

# --- FEEDBACK ---
@app.post("/feedback", response_model=models.FeedbackResponse)
async def submit_feedback(feedback: models.FeedbackCreate, current_user: dict = Depends(get_current_user)):
    return await crud.create_feedback(feedback)

@app.get("/feedback", response_model=List[models.FeedbackResponse])
async def read_feedbacks(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await crud.get_feedbacks()


@app.get("/my-feedback", response_model=List[models.FeedbackResponse])
async def read_my_feedbacks(current_user: dict = Depends(get_current_user)):
    return await crud.get_user_feedbacks(current_user["email"])

@app.patch("/feedback/{feedback_id}", response_model=models.FeedbackResponse)
async def update_feedback_status(feedback_id: str, feedback_update: models.FeedbackUpdate, current_user: dict = Depends(get_current_user)):
    print(f"DEBUG: PATCH /feedback/{feedback_id} hit by {current_user.get('email')}")
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    res = await crud.update_feedback(feedback_id, feedback_update.model_dump())
    if not res:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return res

# --- WISHLIST & COLLECTIONS ---
@app.post("/collections", response_model=models.CollectionResponse)
async def create_new_collection(collection: models.CollectionCreate, current_user: dict = Depends(get_current_user)):
    return await crud.create_collection(current_user["email"], collection.name)

@app.get("/collections", response_model=List[models.CollectionResponse])
async def read_collections(current_user: dict = Depends(get_current_user)):
    return await crud.get_collections(current_user["email"])

@app.post("/wishlist", response_model=models.WishlistResponse)
async def add_product_to_wishlist(wish_item: models.WishlistItemCreate, current_user: dict = Depends(get_current_user)):
    res = await crud.add_to_wishlist(current_user["email"], wish_item.product_id, wish_item.collection_id)
    if not res:
        raise HTTPException(status_code=400, detail="Failed to add to wishlist")
    return res

@app.get("/wishlist", response_model=List[models.WishlistResponse])
async def read_wishlist(collection_id: str = None, current_user: dict = Depends(get_current_user)):
    return await crud.get_wishlist(current_user["email"], collection_id)

@app.delete("/wishlist/{item_id}")
async def delete_item_from_wishlist(item_id: str, current_user: dict = Depends(get_current_user)):
    if not await crud.remove_from_wishlist(item_id):
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Removed from wishlist"}

@app.delete("/collections/{collection_id}")
async def delete_user_collection(collection_id: str, current_user: dict = Depends(get_current_user)):
    if not await crud.delete_collection(collection_id):
        raise HTTPException(status_code=404, detail="Collection not found")
    return {"message": "Collection deleted"}


# --- CHATS ---
@app.get("/chats")
async def get_chats(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
         raise HTTPException(status_code=403, detail="Admin access required")
    from database import chat_collection
    chats = []
    async for chat in chat_collection.find().sort("timestamp", 1):
        chat["_id"] = str(chat["_id"])
        chats.append(chat)
    return chats
    
@app.get("/my-chats")
async def get_my_chats(current_user: dict = Depends(get_current_user)):
    from database import chat_collection
    user_id = str(current_user["_id"])
    chats = []
    # Fetch all chats where the user is either the sender or receiver
    async for chat in chat_collection.find({
        "$or": [
            {"sender": user_id},
            {"receiver": user_id}
        ]
    }).sort("timestamp", 1):
        chat["_id"] = str(chat["_id"])
        chats.append(chat)
    return chats


# --- WEBSOCKETS ---
app.add_api_websocket_route("/ws/{_id}", websocket.user_socket)



