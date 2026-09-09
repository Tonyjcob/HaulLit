from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models import CodeStatus, OrderStatus, PaymentMethod


class CodeValidateRequest(BaseModel):
    code: str


class CodeValidateResponse(BaseModel):
    id: int
    code: str
    status: CodeStatus


class CodeStatusResponse(BaseModel):
    active: bool


class ProductSizeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    size: str
    stock: int


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ref: str
    name: str
    category: str
    price_cents: int
    photos: list[str]
    sizes: list[ProductSizeOut]


class ProductDetailOut(ProductOut):
    description: str
    measurements: dict | None
    condition_note: str | None


class CodeEmailUpdate(BaseModel):
    email: str


class CodeContactOut(BaseModel):
    id: int
    email: str | None
    shipping_address: dict | None


class CodeContactUpdate(BaseModel):
    email: str
    shipping_address: dict


class CartItemIn(BaseModel):
    ref: str
    size: str
    quantity: int = 1


class CartItemQuantityUpdate(BaseModel):
    quantity: int


class CartItemOut(BaseModel):
    id: int
    ref: str
    name: str
    photo: str | None
    size: str
    quantity: int
    price_cents: int
    line_total_cents: int


class CartOut(BaseModel):
    items: list[CartItemOut]
    subtotal_cents: int
    shipping_cents: int
    total_cents: int


class CheckoutRequest(BaseModel):
    email: str
    shipping_address: dict
    payment_method: PaymentMethod


class PaymentInstructions(BaseModel):
    method: PaymentMethod
    reference: str
    iban: str | None = None
    holder: str | None = None
    phone: str | None = None


class CheckoutResult(BaseModel):
    order_id: int
    total_cents: int
    payment: PaymentInstructions


class OrderItemHistoryOut(BaseModel):
    ref: str
    name: str
    photo: str | None
    size: str
    quantity: int
    price_cents: int


class OrderHistoryOut(BaseModel):
    id: int
    status: OrderStatus
    payment_method: PaymentMethod
    payment_reference: str
    subtotal_cents: int
    shipping_cents: int
    total_cents: int
    created_at: datetime
    items: list[OrderItemHistoryOut]


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class AdminLoginResponse(BaseModel):
    id: int
    email: str


class CodeAdminOut(BaseModel):
    id: int
    code: str
    status: CodeStatus
    email: str | None
    created_at: datetime
    last_seen_at: datetime | None


class CodeStatusUpdate(BaseModel):
    status: CodeStatus


class ProductSizeIn(BaseModel):
    size: str
    stock: int


class ProductAdminIn(BaseModel):
    ref: str
    name: str
    category: str
    price_cents: int
    description: str
    measurements: dict
    photos: list[str]
    condition_note: str | None = None
    sizes: list[ProductSizeIn]
