"""Inserta un codigo de acceso activo para probar la Fase 3 en local.

Uso: python -m scripts.seed_dev_code
"""

from app.db import SessionLocal
from app.models import Code, CodeStatus

DEV_CODE = "HL-TEST-0001"


def main() -> None:
    with SessionLocal() as db:
        existing = db.query(Code).filter(Code.code == DEV_CODE).one_or_none()
        if existing:
            print(f"Ya existe {DEV_CODE} (id={existing.id}, status={existing.status})")
            return

        code = Code(code=DEV_CODE, status=CodeStatus.active)
        db.add(code)
        db.commit()
        db.refresh(code)
        print(f"Creado {DEV_CODE} (id={code.id})")


if __name__ == "__main__":
    main()
