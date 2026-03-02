from typing import Optional, Any, List
from bson import ObjectId
from pydantic import BaseModel, Field, EmailStr, GetCoreSchemaHandler
from pydantic_core import core_schema

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.str_schema(),
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    name: str = Field(...)
    password: str = Field(...)
    role: str = Field(default="user")

    class Config:
        populate_by_name = True

class UserResponse(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    role: str = "user"

    class Config:
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ProductBase(BaseModel):
    name: str = Field(...)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    category: str = Field(...)
    image_url: Optional[str] = None
    image_data: Optional[bytes] = None
    image_mime: Optional[str] = None
    stock: int = Field(default=0)
    offer: Optional[str] = None

    class Config:
        populate_by_name = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    image_data: Optional[bytes] = None
    image_mime: Optional[str] = None
    stock: Optional[int] = None
    offer: Optional[str] = None

    class Config:
        populate_by_name = True

class ProductResponse(ProductBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    class Config:
        populate_by_name = True

class BannerBase(BaseModel):
    title: str = Field(...)
    subtitle: Optional[str] = None
    image_url: str = Field(...)
    image_data: Optional[bytes] = None
    image_mime: Optional[str] = None
    button_text: Optional[str] = "Buy Now"
    link: Optional[str] = "#"
    active: bool = True

class BannerCreate(BannerBase):
    pass

class BannerResponse(BannerBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    class Config:
        populate_by_name = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class OrderItem(BaseModel):
    product_id: str
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: int
    image_url: Optional[str] = None

class OrderBase(BaseModel):
    user_name: str = Field(...)
    user_email: EmailStr = Field(...)
    user_number: str = Field(...)
    address: str = Field(...)
    pincode: str = Field(...)
    items: List[OrderItem] = []
    total_amount: Optional[float] = None
    status: str = Field(default="Pending")

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    user_name: Optional[str] = None
    user_email: Optional[EmailStr] = None
    user_number: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    status: Optional[str] = None

class OrderResponse(OrderBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    class Config:
        populate_by_name = True

class UserRoleUpdate(BaseModel):
    role: str

class FeedbackCreate(BaseModel):
    order_id: str
    product_id: str
    product_name: str
    product_image: Optional[str] = None
    user_email: EmailStr
    complaint: str

class FeedbackResponse(FeedbackCreate):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    class Config:
        populate_by_name = True
