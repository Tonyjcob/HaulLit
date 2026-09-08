from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Code, CodeStatus
from app.schemas import (
    CodeEmailUpdate,
    CodeStatusResponse,
    CodeValidateRequest,
    CodeValidateResponse,
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
