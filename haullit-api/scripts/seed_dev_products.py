"""Inserta productos de prueba (varias categorias, tallas y stock) para
probar la Fase 4 (tienda) en local.

Uso: python -m scripts.seed_dev_products
"""

from app.db import SessionLocal
from app.models import Product, ProductSize


def placeholder_photos(ref: str, color: str, count: int = 3) -> list[str]:
    return [
        f"https://placehold.co/600x750/{color}/FFFFFF?text={ref}+foto+{n}"
        for n in range(1, count + 1)
    ]


PRODUCTS = [
    {
        "ref": "HL-26-001",
        "name": "Sudadera Carhartt WIP",
        "category": "Sudaderas",
        "price_cents": 4500,
        "description": "Sudadera vintage en buen estado, sin manchas ni roturas.",
        "measurements": {"pecho": 58, "largo": 68, "manga": 60},
        "condition_note": "Muy buen estado",
        "color": "1D4A2E",
        "sizes": {"S": 2, "M": 3, "L": 0},
    },
    {
        "ref": "HL-26-002",
        "name": "Camiseta Stussy vintage",
        "category": "Camisetas",
        "price_cents": 2800,
        "description": "Camiseta con estampado descolorido de fabrica.",
        "measurements": {"pecho": 52, "largo": 70},
        "condition_note": "Buen estado, ligero desgaste",
        "color": "0E1F15",
        "sizes": {"S": 0, "M": 1, "L": 4},
    },
    {
        "ref": "HL-26-003",
        "name": "Cazadora Nike Windrunner",
        "category": "Chaquetas",
        "price_cents": 6200,
        "description": "Cazadora cortavientos, cremallera funcional al 100%.",
        "measurements": {"pecho": 60, "largo": 72, "manga": 62},
        "condition_note": "Excelente estado",
        "color": "8B1A1A",
        "sizes": {"M": 2, "L": 2, "XL": 1},
    },
    {
        "ref": "HL-26-004",
        "name": "Pantalon cargo Dickies",
        "category": "Pantalones",
        "price_cents": 3900,
        "description": "Cargo con bolsillos laterales, tono verde militar.",
        "measurements": {"cintura": 84, "largo": 104},
        "condition_note": "Buen estado",
        "color": "1D4A2E",
        "sizes": {"30": 0, "32": 0, "34": 0},
    },
    {
        "ref": "HL-26-005",
        "name": "Sudadera Champion reverse weave",
        "category": "Sudaderas",
        "price_cents": 5200,
        "description": "Reverse weave, sin pilling, capucha en buen estado.",
        "measurements": {"pecho": 56, "largo": 66, "manga": 58},
        "condition_note": "Muy buen estado",
        "color": "1D4A2E",
        "sizes": {"S": 1, "M": 0},
    },
    {
        "ref": "HL-26-006",
        "name": "Camiseta Nike Center Swoosh",
        "category": "Camisetas",
        "price_cents": 2200,
        "description": "Algodon grueso, swoosh central bordado.",
        "measurements": {"pecho": 54, "largo": 71},
        "condition_note": "Como nueva",
        "color": "0E1F15",
        "sizes": {"S": 3, "M": 5, "L": 2},
    },
]


def main() -> None:
    with SessionLocal() as db:
        for item in PRODUCTS:
            existing = db.query(Product).filter(Product.ref == item["ref"]).one_or_none()
            if existing:
                print(f"Ya existe {item['ref']}")
                continue

            product = Product(
                ref=item["ref"],
                name=item["name"],
                category=item["category"],
                price_cents=item["price_cents"],
                description=item["description"],
                measurements=item["measurements"],
                photos=placeholder_photos(item["ref"], item["color"]),
                condition_note=item["condition_note"],
            )
            product.sizes = [
                ProductSize(size=size, stock=stock)
                for size, stock in item["sizes"].items()
            ]
            db.add(product)
            # commit por producto: si se insertaran todos en la misma
            # transaccion, Postgres les daria el mismo created_at
            # (now() es la hora de inicio de transaccion, no de cada
            # INSERT) y el orden "recientes" no se podria probar de verdad.
            db.commit()
            print(f"Creado {item['ref']}")


if __name__ == "__main__":
    main()
