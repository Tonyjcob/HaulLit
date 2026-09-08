# HaulLit

Tienda online de streetwear de resale, curada a mano.

## Estructura

- [`haullit-web/`](./haullit-web) — frontend, Next.js 15 (App Router) + TypeScript + Tailwind v4.
- [`haullit-api/`](./haullit-api) — backend, FastAPI + PostgreSQL.

## Desarrollo local

### Frontend

```bash
cd haullit-web
npm install
cp .env.example .env.local
npm run dev
```

Sirve en `http://localhost:3000`.

### Backend

```bash
docker compose up -d db   # Postgres local (ver docker-compose.yml)

cd haullit-api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Sirve en `http://localhost:8000`. Healthcheck en `/health`.

`DATABASE_URL` en `.env` debe apuntar al Postgres de `docker-compose.yml` (por defecto ya coinciden). Tras cambiar `app/models.py`, generar migración con `alembic revision --autogenerate -m "..."` y aplicarla con `alembic upgrade head`.
