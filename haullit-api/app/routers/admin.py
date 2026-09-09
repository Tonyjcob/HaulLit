import secrets
import string

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.db import get_db
from app.models import AdminUser, Code
from app.schemas import (
    AdminLoginRequest,
    AdminLoginResponse,
    CodeAdminOut,
    CodeStatusUpdate,
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
