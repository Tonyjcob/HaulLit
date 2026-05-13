// HAULIT — producto.js

const CATALOG_PRODUCTS = [
  {
    id: 'p1', name: 'Camiseta Oversize', price: 29.99, category: 'camisetas',
    desc: 'Camiseta de corte oversize confeccionada en algodón 100% orgánico. Caída amplia y hombros caídos para un look relajado. Costuras reforzadas y cuello ribeteado.',
    colors: [
      { name: 'Negro',  hex: '#0e0e0e' },
      { name: 'Blanco', hex: '#f5f5f3', border: true },
      { name: 'Gris',   hex: '#888884' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStock: ['XS'],
    images: []
  },
  {
    id: 'p2', name: 'Sudadera Basic', price: 49.99, category: 'sudaderas',
    desc: 'Sudadera de felpa francesa con interior suave al tacto. Corte recto y puños acanalados. Ideal para el día a día con un acabado limpio y minimalista.',
    colors: [
      { name: 'Negro', hex: '#0e0e0e' },
      { name: 'Crema', hex: '#e8e4dc', border: true },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    outOfStock: [],
    images: []
  },
  {
    id: 'p3', name: 'Cargo Pants', price: 64.99, category: 'pantalones',
    desc: 'Pantalón cargo de corte recto con bolsillos laterales funcionales. Cintura elástica con cordón ajustable. Tejido resistente de algodón y poliéster.',
    colors: [
      { name: 'Negro', hex: '#0e0e0e' },
      { name: 'Kaki',  hex: '#7a7a5a' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    outOfStock: ['S'],
    images: []
  },
  {
    id: 'p4', name: 'Hoodie Washed', price: 54.99, category: 'sudaderas',
    desc: 'Hoodie con efecto washed para un acabado vintage desgastado. Capucha con cordón y bolsillo canguro frontal. Lavado especial para un tacto extra suave.',
    colors: [
      { name: 'Gris washed',  hex: '#9a9a9a' },
      { name: 'Negro washed', hex: '#2a2a2a' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    outOfStock: [],
    images: []
  },
  {
    id: 'p5', name: 'Tee Dropped', price: 24.99, category: 'camisetas',
    desc: 'Camiseta con hombros caídos y largo extended. Corte limpio sin costuras laterales. Algodón peinado de alta densidad para mayor durabilidad.',
    colors: [
      { name: 'Negro',  hex: '#0e0e0e' },
      { name: 'Blanco', hex: '#f5f5f3', border: true },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStock: ['XL'],
    images: []
  },
  {
    id: 'p6', name: 'Track Jacket', price: 74.99, category: 'chaquetas',
    desc: 'Chaqueta estilo track con cremallera central y dos bolsillos con cierre. Cuello alto y puños acanalados. Tejido técnico ligero con acabado mate.',
    colors: [
      { name: 'Negro', hex: '#0e0e0e' },
      { name: 'Gris',  hex: '#888884' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    outOfStock: ['S'],
    images: []
  },
  {
    id: 'p7', name: 'Wide Leg Pants', price: 59.99, category: 'pantalones',
    desc: 'Pantalón de pierna ancha con caída fluida. Cintura alta con trabillas. Mezcla de viscosa y lino para mayor comodidad en todas las estaciones.',
    colors: [
      { name: 'Negro', hex: '#0e0e0e' },
      { name: 'Beige', hex: '#c8b89a' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    outOfStock: [],
    images: []
  },
  {
    id: 'p8', name: 'Zip Hoodie', price: 69.99, category: 'sudaderas',
    desc: 'Hoodie con cremallera completa y capucha estructurada. Bolsillos laterales con cremallera. Interior afelpado para mayor abrigo.',
    colors: [
      { name: 'Negro', hex: '#0e0e0e' },
      { name: 'Gris',  hex: '#888884' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    outOfStock: ['XL'],
    images: []
  },
];

let selectedColor = null;
let selectedSize  = null;

const params  = new URLSearchParams(window.location.search);
const id      = params.get('id');
const product = CATALOG_PRODUCTS.find(p => p.id === id);

if (!product) window.location.href = 'catalogo.html';

document.title = product.name + ' — HaulLit';
document.getElementById('js-breadcrumb-category').textContent = product.category.toUpperCase();
document.getElementById('js-breadcrumb-name').textContent     = product.name.toUpperCase();
document.getElementById('js-product-name').textContent        = product.name;
document.getElementById('js-product-price').textContent       = product.price.toFixed(2).replace('.', ',') + ' €';
document.getElementById('js-product-desc').textContent        = product.desc;

const mainEl   = document.getElementById('js-gallery-main');
const thumbsEl = document.getElementById('js-gallery-thumbs');

const placeholderHTML = `
  <div class="product-card__placeholder">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57
               a1 1 0 00.99.84H5v10a1 1 0 001 1h12a1 1 0 001-1V10h1.15a1 1 0 00.99-.84
               l.58-3.57a2 2 0 00-1.34-2.23z"/>
    </svg>
    <span>FOTO PRÓXIMAMENTE</span>
  </div>`;

const thumbCount = product.images.length > 0 ? product.images.length : 4;

for (let i = 0; i < thumbCount; i++) {
  const thumb = document.createElement('div');
  thumb.className = 'gallery__thumb' + (i === 0 ? ' active' : '');
  if (product.images[i]) {
    thumb.innerHTML = `<img src="${product.images[i]}" alt="${product.name} foto ${i + 1}">`;
    thumb.addEventListener('click', function () {
      document.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainEl.innerHTML = `<img src="${product.images[i]}" alt="${product.name}">`;
    });
  } else {
    thumb.innerHTML = placeholderHTML;
  }
  thumbsEl.appendChild(thumb);
}

const colorsEl    = document.getElementById('js-colors');
const colorNameEl = document.getElementById('js-color-name');

product.colors.forEach(function (color, i) {
  const dot = document.createElement('div');
  dot.className = 'color-dot' + (i === 0 ? ' active' : '');
  dot.style.background = color.hex;
  if (color.border) dot.style.outlineColor = 'var(--color-border)';
  dot.title = color.name;

  if (i === 0) {
    selectedColor = color.name;
    colorNameEl.textContent = color.name.toUpperCase();
  }

  dot.addEventListener('click', function () {
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    selectedColor = color.name;
    colorNameEl.textContent = color.name.toUpperCase();
  });

  colorsEl.appendChild(dot);
});

const sizesEl = document.getElementById('js-sizes');

product.sizes.forEach(function (size) {
  const btn   = document.createElement('button');
  const isOut = product.outOfStock.includes(size);
  btn.className   = 'size-pill' + (isOut ? ' out' : '');
  btn.textContent = size;
  btn.disabled    = isOut;

  btn.addEventListener('click', function () {
    if (isOut) return;
    document.querySelectorAll('.size-pill').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    selectedSize = size;
    document.getElementById('js-add-error').textContent = '';
  });

  sizesEl.appendChild(btn);
});

document.getElementById('js-add-btn').addEventListener('click', function () {
  if (!selectedSize) {
    document.getElementById('js-add-error').textContent = 'Selecciona una talla';
    return;
  }
  addToCart({
    id:    product.id + '-' + selectedSize + '-' + selectedColor,
    name:  product.name,
    price: product.price,
    size:  selectedSize,
    color: selectedColor
  });
  document.getElementById('js-add-error').textContent = '';
  document.getElementById('js-cart').classList.add('open');
});

const similares     = CATALOG_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
const similaresGrid = document.getElementById('js-similares-grid');

if (similares.length === 0) {
  similaresGrid.innerHTML = '<p style="font-size:12px;letter-spacing:2px;color:var(--color-muted)">NO HAY PRODUCTOS SIMILARES</p>';
} else {
  similares.forEach(function (p) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <div class="product-card__img">${placeholderHTML}</div>
      <div class="product-card__info">
        <span class="product-card__name">${p.name}</span>
        <span class="product-card__price">${p.price.toFixed(2).replace('.', ',')} €</span>
      </div>
      <div class="product-card__btn">VER PRODUCTO</div>
    `;
    card.addEventListener('click', function () {
      window.location.href = 'producto.html?id=' + p.id;
    });
    similaresGrid.appendChild(card);
  });
}