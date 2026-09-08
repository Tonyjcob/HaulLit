# HaulLit

Tienda online de streetwear de segunda mano (resale), curada a mano.

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
cd haullit-api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Sirve en `http://localhost:8000`. Healthcheck en `/health`.

Requiere una instancia local de PostgreSQL (ver `DATABASE_URL` en `.env`).
