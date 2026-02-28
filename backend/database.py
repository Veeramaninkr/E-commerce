from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.EcomDB

user_collection = database.get_collection("users")
product_collection = database.get_collection("products")
order_collection = database.get_collection("orders")
asset_collection = database.get_collection("assets")

