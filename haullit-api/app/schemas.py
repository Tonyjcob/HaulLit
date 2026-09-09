from pydantic import BaseModel, ConfigDict

from app.models import CodeStatus


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
