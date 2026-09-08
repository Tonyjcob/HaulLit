import enum
from datetime import datetime

from sqlalchemy import (
    JSON,
    Enum,
    ForeignKey,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class CodeStatus(str, enum.Enum):
    active = "active"
    revoked = "revoked"


class OrderStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    shipped = "shipped"
    cancelled = "cancelled"


class Code(Base):
    __tablename__ = "codes"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(unique=True, index=True)
    status: Mapped[CodeStatus] = mapped_column(
        Enum(CodeStatus, name="code_status"), default=CodeStatus.active
    )
    email: Mapped[str | None]
    shipping_address: Mapped[dict | None] = mapped_column(JSONB)
    admin_note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    last_seen_at: Mapped[datetime | None]

    orders: Mapped[list["Order"]] = relationship(back_populates="code")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    ref: Mapped[str] = mapped_column(unique=True, index=True)
    name: Mapped[str]
    category: Mapped[str]
    price_cents: Mapped[int]
    description: Mapped[str] = mapped_column(Text)
    measurements: Mapped[dict | None] = mapped_column(JSONB)
    photos: Mapped[list[str]] = mapped_column(JSON, default=list)
    condition_note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    sizes: Mapped[list["ProductSize"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )


class ProductSize(Base):
    __tablename__ = "product_sizes"
    __table_args__ = (UniqueConstraint("product_id", "size"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    size: Mapped[str]
    stock: Mapped[int] = mapped_column(default=0)

    product: Mapped["Product"] = relationship(back_populates="sizes")


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    code_id: Mapped[int] = mapped_column(ForeignKey("codes.id"))
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, name="order_status"), default=OrderStatus.pending
    )
    subtotal_cents: Mapped[int]
    shipping_cents: Mapped[int]
    total_cents: Mapped[int]
    shipping_address_snapshot: Mapped[dict] = mapped_column(JSONB)
    email_snapshot: Mapped[str]
    stripe_payment_id: Mapped[str | None]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    code: Mapped["Code"] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    size: Mapped[str]
    price_cents: Mapped[int]
    quantity: Mapped[int]

    order: Mapped["Order"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password_hash: Mapped[str]
