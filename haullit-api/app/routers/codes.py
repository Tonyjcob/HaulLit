from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from sqlalchemy.orm import selectinload

from app.db import get_db
from app.models import Code, CodeStatus, Order, OrderItem
from app.schemas import (
    CodeContactOut,
    CodeContactUpdate,
    CodeEmailUpdate,
    CodeStatusResponse,
    CodeValidateRequest,
    CodeValidateResponse,
    OrderHistoryOut,
)

router = APIRouter(prefix="/codes", tags=["codes"])


@router.post("/validate", response_model=CodeValidateResponse)
def validate_code(payload: CodeValidateRequest, db: Session = Depends(get_db)) -> Code:
    code = db.scalar(select(Code).where(Code.code == payload.code))
    if code is None or code.status != CodeStatus.active:
        raise HTTPException(status_code=401, detail="Código inválido")

    code.last_seen_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(code)
    return code


@router.get("/{code_id}", response_model=CodeContactOut)
def get_code_contact(code_id: int, db: Session = Depends(get_db)) -> Code:
    code = db.get(Code, code_id)
    if code is None:
        raise HTTPException(status_code=404, detail="Código no encontrado")
    return code


@router.get("/{code_id}/status", response_model=CodeStatusResponse)
def code_status(code_id: int, db: Session = Depends(get_db)) -> CodeStatusResponse:
    code = db.get(Code, code_id)
    return CodeStatusResponse(active=code is not None and code.status == CodeStatus.active)


@router.patch("/{code_id}/email")
def update_code_email(
    code_id: int, payload: CodeEmailUpdate, db: Session = Depends(get_db)
) -> dict[str, str | int]:
    code = db.get(Code, code_id)
    if code is None:
        raise HTTPException(status_code=404, detail="Código no encontrado")

    code.email = payload.email
    db.commit()
    return {"id": code.id, "email": code.email}


@router.patch("/{code_id}", response_model=CodeContactOut)
def update_code_contact(
    code_id: int, payload: CodeContactUpdate, db: Session = Depends(get_db)
) -> Code:
    code = db.get(Code, code_id)
    if code is None:
        raise HTTPException(status_code=404, detail="Código no encontrado")

    code.email = payload.email
    code.shipping_address = payload.shipping_address
    db.commit()
    db.refresh(code)
    return code


@router.get("/{code_id}/orders", response_model=list[OrderHistoryOut])
def list_code_orders(code_id: int, db: Session = Depends(get_db)) -> list[Order]:
    stmt = (
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .where(Order.code_id == code_id)
        .order_by(Order.created_at.desc())
    )
    orders = list(db.scalars(stmt))
    return [
        OrderHistoryOut(
            id=order.id,
            status=order.status,
            payment_method=order.payment_method,
            payment_reference=order.payment_reference,
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
        for order in orders
    ]
