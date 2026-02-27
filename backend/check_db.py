import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

async def check():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.EcomDB
    coll = db.products
    
    print("Listing all products IDs and Types:")
    async for p in coll.find():
        _id = p.get("_id")
        print(f"ID: {_id}, Type: {type(_id)}, Name: {p.get('name')}")

    target = "699eb1778f7684bfb9bf2ced"
    print(f"\nSearching for target: {target}")
    res = await coll.find_one({"_id": ObjectId(target)})
    print(f"Found with ObjectId: {res is not None}")
    
    res_str = await coll.find_one({"_id": target})
    print(f"Found with String ID: {res_str is not None}")

if __name__ == "__main__":
    asyncio.run(check())
