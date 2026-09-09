import secrets
import string

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.core.security import verify_password
from app.db import get_db
from app.models import AdminUser, Code, Order, OrderItem, OrderStatus, Product, ProductSize
from app.schemas import (
    AdminLoginRequest,
    AdminLoginResponse,
    CodeAdminOut,
    CodeStatusUpdate,
    OrderAdminOut,
    OrderStatusUpdate,
    ProductAdminIn,
    ProductDetailOut,
)

router = APIRouter(prefix="/admin", tags=["admin"])

CODE_ALPHABET = string.ascii_uppercase + string.digits


def _generate_code(db: Session) -> str:
    for _ in range(5):
        suffix = "".join(
            "".join(secrets.choice(CODE_ALPHABET) for _ in range(4))
            for _ in range(2)
        )
        candidate = f"HL-{suffix[:4]}-{suffix[4:]}"
        if db.scalar(select(Code).where(Code.code == candidate)) is None:
            return candidate
    raise HTTPException(status_code=500, detail="No se pudo generar un código único")


@router.post("/login", response_model=AdminLoginResponse)
def admin_login(payload: AdminLoginRequest, db: Session = Depends(get_db)) -> AdminUser:
    admin = db.scalar(select(AdminUser).where(AdminUser.email == payload.email))
    if admin is None or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    return admin


@router.get("/codes", response_model=list[CodeAdminOut])
def list_all_codes(db: Session = Depends(get_db)) -> list[Code]:
    stmt = select(Code).order_by(Code.created_at.desc())
    return list(db.scalars(stmt))


@router.post("/codes", response_model=CodeAdminOut)
def create_code(db: Session = Depends(get_db)) -> Code:
    code = Code(code=_generate_code(db))
    db.add(code)
    db.commit()
    db.refresh(code)
    return code


@router.patch("/codes/{code_id}", response_model=CodeAdminOut)
def update_code_status(
    code_id: int, payload: CodeStatusUpdate, db: Session = Depends(get_db)
) -> Code:
    code = db.get(Code, code_id)
    if code is None:
        raise HTTPException(status_code=404, detail="Código no encontrado")

    code.status = payload.status
    db.commit()
    db.refresh(code)
    return code


def _product_query():
    return select(Product).options(selectinload(Product.sizes))


@router.get("/products", response_model=list[ProductDetailOut])
def list_all_products(db: Session = Depends(get_db)) -> list[Product]:
    stmt = _product_query().order_by(Product.created_at.desc())
    return list(db.scalars(stmt).unique())


@router.get("/products/{product_id}", response_model=ProductDetailOut)
def get_admin_product(product_id: int, db: Session = Depends(get_db)) -> Product:
    product = db.scalar(_product_query().where(Product.id == product_id))
    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product


@router.post("/products", response_model=ProductDetailOut)
def create_product(payload: ProductAdminIn, db: Session = Depends(get_db)) -> Product:
    product = Product(
        ref=payload.ref,
        name=payload.name,
        category=payload.category,
        price_cents=payload.price_cents,
        description=payload.description,
        measurements=payload.measurements,
        photos=payload.photos,
        condition_note=payload.condition_note,
    )
    product.sizes = [
        ProductSize(size=s.size, stock=s.stock) for s in payload.sizes
    ]
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/products/{product_id}", response_model=ProductDetailOut)
def update_product(
    product_id: int, payload: ProductAdminIn, db: Session = Depends(get_db)
) -> Product:
    product = db.scalar(_product_query().where(Product.id == product_id))
    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    product.ref = payload.ref
    product.name = payload.name
    product.category = payload.category
    product.price_cents = payload.price_cents
    product.description = payload.description
    product.measurements = payload.measurements
    product.photos = payload.photos
    product.condition_note = payload.condition_note

    # Borrar y volar a insertar en el mismo flush puede violar la
    # constraint unica (product_id, size) si una talla se mantiene con
    # otro stock: el INSERT de la nueva fila puede ejecutarse antes que
    # el DELETE de la vieja. Se vacia y se hace flush aparte primero.
    product.sizes = []
    db.flush()
    product.sizes = [
        ProductSize(size=s.size, stock=s.stock) for s in payload.sizes
    ]
    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)) -> dict[str, bool]:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    db.delete(product)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se puede borrar: esta pieza tiene pedidos asociados",
        )
    return {"ok": True}


def _order_query():
    return select(Order).options(
        selectinload(Order.code),
        selectinload(Order.items)
        .selectinload(OrderItem.product)
        .selectinload(Product.sizes),
    )


def _to_order_admin_out(order: Order) -> OrderAdminOut:
    return OrderAdminOut(
        id=order.id,
        status=order.status,
        payment_method=order.payment_method,
        payment_reference=order.payment_reference,
        code=order.code.code,
        email_snapshot=order.email_snapshot,
        shipping_address_snapshot=order.shipping_address_snapshot,
        subtotal_cents=order.subtotal_cents,
        shipping_cents=order.shipping_cents,
        total_cents=order.total_cents,
        created_at=order.created_at,
        items=[
            {
                "ref": item.product.ref,
                "name": item.product.name,
                "photo": item.product.photos[0] if item.product.photos else None,
                "size": item.size,
                "quantity": item.quantity,
                "price_cents": item.price_cents,
            }
            for item in order.items
        ],
    )


@router.get("/orders", response_model=list[OrderAdminOut])
def list_all_orders(db: Session = Depends(get_db)) -> list[OrderAdminOut]:
    stmt = _order_query().order_by(Order.created_at.desc())
    orders = list(db.scalars(stmt).unique())
    return [_to_order_admin_out(o) for o in orders]


@router.patch("/orders/{order_id}", response_model=OrderAdminOut)
def update_order_status(
    order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)
) -> OrderAdminOut:
    order = db.scalar(_order_query().where(Order.id == order_id))
    if order is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    was_cancelled = order.status == OrderStatus.cancelled
    order.status = payload.status

    # Solo se restaura el stock al pasar A cancelado desde otro estado -
    # no se vuelve a descontar si se "reactiva" un pedido cancelado.
    if payload.status == OrderStatus.cancelled and not was_cancelled:
        for item in order.items:
            size = next(
                (s for s in item.product.sizes if s.size == item.size), None
            )
            if size is not None:
                size.stock += item.quantity

    db.commit()
    db.refresh(order)
    return _to_order_admin_out(order)
