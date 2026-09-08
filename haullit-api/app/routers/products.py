from typing import Literal

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db import get_db
from app.models import Product
from app.schemas import ProductOut

router = APIRouter(prefix="/products", tags=["products"])

Orden = Literal["recientes", "precio_asc", "precio_desc"]


@router.get("", response_model=list[ProductOut])
def list_products(
    categoria: str | None = None,
    orden: Orden = "recientes",
    db: Session = Depends(get_db),
) -> list[Product]:
    stmt = select(Product).options(selectinload(Product.sizes))

    if categoria:
        stmt = stmt.where(Product.category == categoria)

    if orden == "precio_asc":
        stmt = stmt.order_by(Product.price_cents.asc())
    elif orden == "precio_desc":
        stmt = stmt.order_by(Product.price_cents.desc())
    else:
        stmt = stmt.order_by(Product.created_at.desc())

    return list(db.scalars(stmt).unique())


@router.get("/categorias", response_model=list[str])
def list_categorias(db: Session = Depends(get_db)) -> list[str]:
    stmt = select(Product.category).distinct().order_by(Product.category)
    return list(db.scalars(stmt))
