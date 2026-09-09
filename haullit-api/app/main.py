from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import cart, checkout, codes, products

app = FastAPI(title="HaulLit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(codes.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(checkout.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
