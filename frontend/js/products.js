// HAULIT — products.js

const PRODUCTS = [
  { id: 'p1', name: 'Camiseta Oversize', price: 29.99, size: 'M' },
  { id: 'p2', name: 'Sudadera Basic',    price: 49.99, size: 'L' },
  { id: 'p3', name: 'Cargo Pants',       price: 64.99, size: 'M' },
  { id: 'p4', name: 'Hoodie Washed',     price: 54.99, size: 'L' },
  { id: 'p5', name: 'Tee Dropped',       price: 24.99, size: 'S' },
  { id: 'p6', name: 'Track Jacket',      price: 74.99, size: 'M' },
];

const placeholderSVG = `
  <div class="product-card__placeholder">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57
               a1 1 0 00.99.84H5v10a1 1 0 001 1h12a1 1 0 001-1V10h1.15a1 1 0 00.99-.84
               l.58-3.57a2 2 0 00-1.34-2.23z"/>
    </svg>
    <span>FOTO PRÓXIMAMENTE</span>
  </div>`;

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const img = product.image
    ? `<img src="${product.image}" alt="${product.name}">`
    : placeholderSVG;

  card.innerHTML = `
    <div class="product-card__img">${img}</div>
    <div class="product-card__info">
      <span class="product-card__name">${product.name}</span>
      <span class="product-card__price">${product.price.toFixed(2).replace('.', ',')} €</span>
    </div>
    <button class="product-card__btn">AÑADIR AL CARRITO</button>
  `;

  card.querySelector('.product-card__btn').addEventListener('click', function (e) {
   e.stopPropagation();
    addToCart({
      id:    product.id,
      name:  product.name,
      price: product.price,
      size:  product.size
    });
  });

  card.addEventListener('click', function()  {
    window.location.href = 'producto.html?id=' + product.id;
  });

  return card;
}

function renderProducts() {
  const grid = document.getElementById('js-products-grid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS.forEach(function(p) {
    grid.appendChild(createProductCard(p));
  });
}

renderProducts();