import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_roles():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.EcomDB
    users = await db.users.find().to_list(100)
    for u in users:
        print(f"Email: {u['email']}, Role: {u.get('role', 'N/A')}")
    client.close()

if __name__ == "__main__":
    asyncio.run(check_roles())
