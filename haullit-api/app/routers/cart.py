from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.db import get_db
from app.models import CartItem, Product
from app.schemas import CartItemIn, CartItemOut, CartItemQuantityUpdate, CartOut

router = APIRouter(prefix="/cart/{code_id}", tags=["cart"])


def _stock_for_size(product: Product, size: str) -> int:
    for s in product.sizes:
        if s.size == size:
            return s.stock
    return 0


def _to_cart_out(items: list[CartItem]) -> CartOut:
    out_items = [
        CartItemOut(
            id=item.id,
            ref=item.product.ref,
            name=item.product.name,
            photo=item.product.photos[0] if item.product.photos else None,
            size=item.size,
            quantity=item.quantity,
            price_cents=item.product.price_cents,
            line_total_cents=item.product.price_cents * item.quantity,
        )
        for item in items
    ]
    subtotal = sum(i.line_total_cents for i in out_items)
    shipping = settings.shipping_flat_cents if out_items else 0
    return CartOut(
        items=out_items,
        subtotal_cents=subtotal,
        shipping_cents=shipping,
        total_cents=subtotal + shipping,
    )


def _get_cart_items(code_id: int, db: Session) -> list[CartItem]:
    stmt = (
        select(CartItem)
        .options(selectinload(CartItem.product).selectinload(Product.sizes))
        .where(CartItem.code_id == code_id)
        .order_by(CartItem.created_at)
    )
    return list(db.scalars(stmt))


@router.get("", response_model=CartOut)
def get_cart(code_id: int, db: Session = Depends(get_db)) -> CartOut:
    return _to_cart_out(_get_cart_items(code_id, db))


@router.post("/items", response_model=CartOut)
def add_item(
    code_id: int, payload: CartItemIn, db: Session = Depends(get_db)
) -> CartOut:
    product = db.scalar(
        select(Product)
        .options(selectinload(Product.sizes))
        .where(Product.ref == payload.ref)
    )
    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    stock = _stock_for_size(product, payload.size)
    if stock == 0:
        raise HTTPException(status_code=400, detail="Talla sin stock")

    existing = db.scalar(
        select(CartItem).where(
            CartItem.code_id == code_id,
            CartItem.product_id == product.id,
            CartItem.size == payload.size,
        )
    )
    if existing:
        existing.quantity = min(existing.quantity + payload.quantity, stock)
    else:
        db.add(
            CartItem(
                code_id=code_id,
                product_id=product.id,
                size=payload.size,
                quantity=min(payload.quantity, stock),
            )
        )
    db.commit()

    return _to_cart_out(_get_cart_items(code_id, db))


@router.patch("/items/{item_id}", response_model=CartOut)
def update_item_quantity(
    code_id: int,
    item_id: int,
    payload: CartItemQuantityUpdate,
    db: Session = Depends(get_db),
) -> CartOut:
    item = db.scalar(
        select(CartItem)
        .options(selectinload(CartItem.product).selectinload(Product.sizes))
        .where(CartItem.id == item_id, CartItem.code_id == code_id)
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Línea no encontrada")

    if payload.quantity <= 0:
        db.delete(item)
    else:
        stock = _stock_for_size(item.product, item.size)
        item.quantity = min(payload.quantity, stock)
    db.commit()

    return _to_cart_out(_get_cart_items(code_id, db))


@router.delete("/items/{item_id}", response_model=CartOut)
def remove_item(code_id: int, item_id: int, db: Session = Depends(get_db)) -> CartOut:
    item = db.scalar(
        select(CartItem).where(CartItem.id == item_id, CartItem.code_id == code_id)
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Línea no encontrada")

    db.delete(item)
    db.commit()

    return _to_cart_out(_get_cart_items(code_id, db))
