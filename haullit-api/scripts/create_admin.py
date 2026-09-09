"""Crea o actualiza el usuario administrador.

Piensa el email y la contrasena que quieras usar de verdad para
entrar al panel - se piden aqui, en tu terminal, y nunca salen de tu
maquina.

Uso: python -m scripts.create_admin
"""

import getpass

from app.core.security import hash_password
from app.db import SessionLocal
from app.models import AdminUser


def main() -> None:
    email = input("Email del admin: ").strip()
    password = getpass.getpass("Contraseña: ")
    password_confirm = getpass.getpass("Repite la contraseña: ")

    if password != password_confirm:
        print("Las contraseñas no coinciden.")
        return
    if len(password) < 8:
        print("La contraseña debe tener al menos 8 caracteres.")
        return

    with SessionLocal() as db:
        existing = db.query(AdminUser).filter(AdminUser.email == email).one_or_none()
        if existing:
            existing.password_hash = hash_password(password)
            db.commit()
            print(f"Contraseña actualizada para {email}")
        else:
            admin = AdminUser(email=email, password_hash=hash_password(password))
            db.add(admin)
            db.commit()
            print(f"Admin creado: {email}")


if __name__ == "__main__":
    main()
