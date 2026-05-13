// HAULIT — catalogo.js

const CATALOG_PRODUCTS = [
  { id: 'p1', name: 'Camiseta Oversize', price: 29.99, size: 'M', category: 'camisetas' },
  { id: 'p2', name: 'Sudadera Basic',    price: 49.99, size: 'L', category: 'sudaderas' },
  { id: 'p3', name: 'Cargo Pants',       price: 64.99, size: 'M', category: 'pantalones' },
  { id: 'p4', name: 'Hoodie Washed',     price: 54.99, size: 'L', category: 'sudaderas' },
  { id: 'p5', name: 'Tee Dropped',       price: 24.99, size: 'S', category: 'camisetas' },
  { id: 'p6', name: 'Track Jacket',      price: 74.99, size: 'M', category: 'chaquetas' },
  { id: 'p7', name: 'Wide Leg Pants',    price: 59.99, size: 'M', category: 'pantalones' },
  { id: 'p8', name: 'Zip Hoodie',        price: 69.99, size: 'L', category: 'sudaderas' },
];

let activeCategory = 'all';
let activeSort     = 'default';

function getFilteredProducts() {
  let list = [...CATALOG_PRODUCTS];
  if (activeCategory !== 'all') {
    list = list.filter(p => p.category === activeCategory);
  }
  if (activeSort === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (activeSort === 'price-desc') list.sort((a, b) => b.price - a.price);
  return list;
}

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

function createCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-aos', 'fade-up');
  card.innerHTML = `
    <div class="product-card__img">${product.image ? `<img src="${product.image}" alt="${product.name}">` : placeholderSVG}</div>
    <div class="product-card__info">
      <span class="product-card__name">${product.name}</span>
      <span class="product-card__price">${product.price.toFixed(2).replace('.', ',')} €</span>
    </div>
    <button class="product-card__btn">AÑADIR AL CARRITO</button>
  `;


  card.addEventListener('click', function () {
    window.location.href = 'producto.html?id=' + product.id;
  });


  return card;
}

function renderCatalog() {
  const grid    = document.getElementById('js-catalog-grid');
  const countEl = document.getElementById('js-catalog-count');
  const list    = getFilteredProducts();

  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = '<p class="catalog__empty">NO HAY PRODUCTOS EN ESTA CATEGORÍA</p>';
    countEl.textContent = '0 productos';
    return;
  }

  countEl.textContent = `${list.length} producto${list.length !== 1 ? 's' : ''}`;
  list.forEach(p => grid.appendChild(createCard(p)));
  if (window.AOS) AOS.refresh();
}

document.querySelectorAll('[data-filter="category"]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('[data-filter="category"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.value;
    renderCatalog();
  });
});

document.querySelectorAll('[data-sort]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSort = btn.dataset.sort;
    renderCatalog();
  });
});

renderCatalog();