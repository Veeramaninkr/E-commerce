from fastapi import HTTPException
from database import user_collection, product_collection, order_collection, asset_collection
import models
from auth import get_password_hash
from bson import ObjectId

# --- USER ---
async def get_user_by_email(email: str):
    return await user_collection.find_one({"email": email})

async def create_user(user: models.UserCreate):
    hashed_password = get_password_hash(user.password)
    new_user = user.model_dump()
    new_user["password"] = hashed_password
    
    existing = await get_user_by_email(user.email)
    if existing:
        return None
    
    # Check if this is the first user being registered
    user_count = await user_collection.count_documents({})
    if user_count == 0:
        new_user["role"] = "admin"
    else:
        new_user["role"] = "user"
    
    result = await user_collection.insert_one(new_user)
    return await user_collection.find_one({"_id": result.inserted_id})

async def get_users():
    users = []
    async for user in user_collection.find():
        users.append(user)
    return users

async def update_user_role(user_id: str, role: str):
    if not ObjectId.is_valid(user_id):
        return None
    await user_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": role}})
    return await user_collection.find_one({"_id": ObjectId(user_id)})

# --- PRODUCT ---
async def get_products(skip: int = 0, limit: int = 100):
    products = []
    cursor = product_collection.find().skip(skip).limit(limit)
    async for product in cursor:
        products.append(product)
    return products

async def get_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        return None
    return await product_collection.find_one({"_id": ObjectId(product_id)})

async def create_product(product: models.ProductCreate):
    p_dict = product.model_dump()
    result = await product_collection.insert_one(p_dict)
    return await get_product(str(result.inserted_id))

async def update_product(product_id: str, data: dict):
    if not ObjectId.is_valid(product_id):
        return None
    data = {k: v for k, v in data.items() if v is not None}
    if not data:
        return await get_product(product_id)
    await product_collection.update_one({"_id": ObjectId(product_id)}, {"$set": data})
    return await get_product(product_id)

async def delete_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        return False
    result = await product_collection.delete_one({"_id": ObjectId(product_id)})
    return result.deleted_count > 0
# --- ORDER ---
async def get_orders():
    orders = []
    async for order in order_collection.find():
        orders.append(order)
    return orders

async def get_order(order_id: str):
    if not ObjectId.is_valid(order_id):
        return None
    return await order_collection.find_one({"_id": ObjectId(order_id)})

async def create_order(order: models.OrderCreate):
    o_dict = order.model_dump()
    
    # Securely populate product details from database
    total_amount = 0
    updated_items = []
    
    for item in o_dict.get("items", []):
        product = await get_product(item["product_id"])
        if product:
            item["name"] = product["name"]
            item["price"] = product["price"]
            item["image_url"] = product.get("image_url")
            total_amount += item["price"] * item["quantity"]
        updated_items.append(item)
    
    o_dict["items"] = updated_items
    o_dict["total_amount"] = total_amount
    
    result = await order_collection.insert_one(o_dict)
    return await get_order(str(result.inserted_id))

async def update_order(order_id: str, data: dict):
    if not ObjectId.is_valid(order_id):
        return None
    data = {k: v for k, v in data.items() if v is not None}
    if not data:
        return await get_order(order_id)
    await order_collection.update_one({"_id": ObjectId(order_id)}, {"$set": data})
    return await get_order(order_id)

async def delete_order(order_id: str):
    if not ObjectId.is_valid(order_id):
        return False
    result = await order_collection.delete_one({"_id": ObjectId(order_id)})
    return result.deleted_count > 0

# --- ASSETS (Binary) ---
async def create_asset(data: bytes, mime_type: str):
    asset = {
        "data": data,
        "mime_type": mime_type
    }
    result = await asset_collection.insert_one(asset)
    return str(result.inserted_id)

async def get_asset_binary(asset_id: str):
    if not ObjectId.is_valid(asset_id):
        return None
    return await asset_collection.find_one({"_id": ObjectId(asset_id)})
