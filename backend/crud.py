from fastapi import HTTPException
from database import user_collection, product_collection, order_collection, asset_collection, feedback_collection
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
        if "image" in product and "image_url" not in product:
            product["image_url"] = product["image"]
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
async def get_orders(search: str = None, status: str = None, page: int = 1, limit: int = 10):
    query = {}
    if search:
        query["$or"] = [
                {"user_name": {"$regex": search, "$options": "i"}},
                {"user_email": {"$regex": search, "$options": "i"}},
                {"user_number": {"$regex": search, "$options": "i"}},
                {"address": {"$regex": search, "$options": "i"}},
                {"pincode": {"$regex": search, "$options": "i"}},
                {"status": {"$regex": search, "$options": "i"}},
                {"items.name": {"$regex": search, "$options": "i"}},
                {"items.product_id": {"$regex": search, "$options": "i"}},
            ]
        if ObjectId.is_valid(search):
             query["$or"].append({"_id": ObjectId(search)})
    
    if status:
        query["status"] = status

    total_items = await order_collection.count_documents(query)
    skip = (page - 1) * limit
    
    orders = []
    async for order in order_collection.find(query).skip(skip).limit(limit):
        orders.append(order)
    
    total_pages = (total_items + limit - 1) // limit
    
    return {
        "data": orders,
        "meta": {
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total_items,
            "limit": limit
        }
    }

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
            item["image_url"] = product.get("image_url") or product.get("image")
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

# --- FEEDBACK ---
async def create_feedback(feedback: models.FeedbackCreate):
    f_dict = feedback.model_dump()
    result = await feedback_collection.insert_one(f_dict)
    return await feedback_collection.find_one({"_id": result.inserted_id})

async def get_feedback(feedback_id: str):
    if not ObjectId.is_valid(feedback_id):
        return None
    return await feedback_collection.find_one({"_id": ObjectId(feedback_id)})
async def get_feedbacks():
    feedbacks = []
    async for feedback in feedback_collection.find():
        feedback["id"] = str(feedback["_id"])
        feedback["_id"] = str(feedback["_id"])
        feedbacks.append(feedback)
    return feedbacks

async def update_feedback(feedback_id: str, data: dict):
    print(f"DEBUG: update_feedback called with feedback_id='{feedback_id}'")
    
    data = {k: v for k, v in data.items() if v is not None}
    
    feedback = None
    
    # 1. Try finding by feedback _id if valid ObjectId
    if ObjectId.is_valid(feedback_id):
        print(f"DEBUG: feedback_id '{feedback_id}' is a valid ObjectId, checking _id")
        feedback = await feedback_collection.find_one({"_id": ObjectId(feedback_id)})
        if feedback:
            print(f"DEBUG: Found feedback by _id: {feedback.get('_id')}")
    
    # 2. If not found (or not valid ObjectId), try finding by order_id
    if not feedback:
        print(f"DEBUG: Not found by _id (or invalid ObjectId), checking order_id='{feedback_id}'")
        feedback = await feedback_collection.find_one({"order_id": feedback_id})
        if feedback:
            print(f"DEBUG: Found feedback by order_id: {feedback.get('_id')}")
            
    if not feedback:
        print(f"DEBUG: No feedback found for feedback_id='{feedback_id}'")
        return None
        
    # Update the document
    await feedback_collection.update_one({"_id": feedback["_id"]}, {"$set": data})
    
    # Retrieve updated document
    res = await feedback_collection.find_one({"_id": feedback["_id"]})
    if res:
        res["id"] = str(res["_id"])
        res["_id"] = str(res["_id"])
        print(f"DEBUG: Successfully updated feedback {res['id']}")
    return res

async def get_user_feedbacks(email: str):
    feedbacks = []
    async for feedback in feedback_collection.find({"user_email": email}):
        feedback["id"] = str(feedback["_id"])
        feedback["_id"] = str(feedback["_id"])
        feedbacks.append(feedback)
    return feedbacks

# --- WISHLIST & COLLECTIONS ---
from database import collection_category_collection, wishlist_collection

async def create_collection(user_email: str, name: str):
    new_collection = {"user_email": user_email, "name": name}
    result = await collection_category_collection.insert_one(new_collection)
    return await collection_category_collection.find_one({"_id": result.inserted_id})

async def get_collections(user_email: str):
    collections = []
    async for coll in collection_category_collection.find({"user_email": user_email}):
        collections.append(coll)
    return collections

async def add_to_wishlist(user_email: str, product_id: str, collection_id: str = None):
    # Check if already in wishlist
    query = {"user_email": user_email, "product_id": product_id}
    existing = await wishlist_collection.find_one(query)
    
    if existing:
        if collection_id:
             await wishlist_collection.update_one(query, {"$set": {"collection_id": collection_id}})
             return await wishlist_collection.find_one(query)
        return existing
    
    # Get product details to store denormalized if needed (or just store ID)
    product = await get_product(product_id)
    if not product:
        return None
    
    wish_item = {
        "user_email": user_email,
        "product_id": product_id,
        "collection_id": collection_id,
        "product_name": product.get("name"),
        "product_image": product.get("image_url") or product.get("image"),
        "product_price": product.get("price")
    }
    
    result = await wishlist_collection.insert_one(wish_item)
    return await wishlist_collection.find_one({"_id": result.inserted_id})

async def get_wishlist(user_email: str, collection_id: str = None):
    query = {"user_email": user_email}
    if collection_id:
        query["collection_id"] = collection_id
    
    wishlist = []
    async for item in wishlist_collection.find(query):
        wishlist.append(item)
    return wishlist

async def remove_from_wishlist(item_id: str):
    if not ObjectId.is_valid(item_id):
        return False
    result = await wishlist_collection.delete_one({"_id": ObjectId(item_id)})
    return result.deleted_count > 0

async def delete_collection(collection_id: str):
    if not ObjectId.is_valid(collection_id):
        return False
    
    # Optional: Update wishlist items to remove this collection reference
    await wishlist_collection.update_many({"collection_id": collection_id}, {"$set": {"collection_id": None}})
    
    result = await collection_category_collection.delete_one({"_id": ObjectId(collection_id)})
    return result.deleted_count > 0
