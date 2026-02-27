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
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    email = payload.get("sub")
    user = await crud.user_collection.find_one({"email": email})
    if user is None:
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
    return await crud.create_product(product)

@app.patch("/products/{product_id}", response_model=models.ProductResponse)
async def update_product(product_id: str, product: models.ProductUpdate, current_user: dict = Depends(get_current_user)):
    res = await crud.update_product(product_id, product.model_dump())
    if not res:
        raise HTTPException(status_code=404, detail="Product not found")
    return res

@app.delete("/products/{product_id}")
async def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    if not await crud.delete_product(product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}
# --- ORDERS ---
@app.get("/orders", response_model=List[models.OrderResponse])
async def read_orders(current_user: dict = Depends(get_current_user)):
    return await crud.get_orders()

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
