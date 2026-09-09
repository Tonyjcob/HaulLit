from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.db import get_db
from app.models import CartItem, Order, OrderItem, PaymentMethod, Product
from app.schemas import CheckoutRequest, CheckoutResult, PaymentInstructions

router = APIRouter(prefix="/checkout", tags=["checkout"])


@router.post("/{code_id}", response_model=CheckoutResult)
def checkout(
    code_id: int, payload: CheckoutRequest, db: Session = Depends(get_db)
) -> CheckoutResult:
    stmt = (
        select(CartItem)
        .options(selectinload(CartItem.product).selectinload(Product.sizes))
        .where(CartItem.code_id == code_id)
    )
    cart_items = list(db.scalars(stmt))
    if not cart_items:
        raise HTTPException(status_code=400, detail="El carrito está vacío")

    for item in cart_items:
        size = next(
            (s for s in item.product.sizes if s.size == item.size), None
        )
        if size is None or size.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Ya no hay stock suficiente de {item.product.ref} ({item.size})",
            )

    subtotal_cents = sum(item.product.price_cents * item.quantity for item in cart_items)
    shipping_cents = settings.shipping_flat_cents

    order = Order(
        code_id=code_id,
        subtotal_cents=subtotal_cents,
        shipping_cents=shipping_cents,
        total_cents=subtotal_cents + shipping_cents,
        shipping_address_snapshot=payload.shipping_address,
        email_snapshot=payload.email,
        payment_method=payload.payment_method,
        payment_reference="",
    )
    db.add(order)
    db.flush()
    order.payment_reference = f"HL-PEDIDO-{order.id:06d}"

    for item in cart_items:
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                size=item.size,
                price_cents=item.product.price_cents,
                quantity=item.quantity,
            )
        )
        size = next(s for s in item.product.sizes if s.size == item.size)
        size.stock -= item.quantity
        db.delete(item)

    db.commit()

    if payload.payment_method == PaymentMethod.transferencia:
        instructions = PaymentInstructions(
            method=payload.payment_method,
            reference=order.payment_reference,
            iban=settings.bank_iban,
            holder=settings.bank_holder,
        )
    else:
        instructions = PaymentInstructions(
            method=payload.payment_method,
            reference=order.payment_reference,
            phone=settings.bizum_phone,
        )

    return CheckoutResult(
        order_id=order.id, total_cents=order.total_cents, payment=instructions
    )
