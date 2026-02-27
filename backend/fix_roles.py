import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def fix_roles():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.EcomDB
    
    # Set admin@gmail.com to admin
    await db.users.update_one({"email": "admin@gmail.com"}, {"$set": {"role": "admin"}})
    print("Updated admin@gmail.com to admin role")
    
    # Check other admins
    await db.users.update_many({"role": "N/A"}, {"$set": {"role": "user"}})
    print("Cleaned up N/A roles to user")
    
    # Ensure veeramani4fairpay@gmail.com is admin if needed, but let's just stick to admin@gmail.com for now
    
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_roles())
