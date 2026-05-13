// HAULIT — cart.js

let cart = [];

const cartItemsEl = document.getElementById('js-cart-items');
const cartCountEl = document.getElementById('js-cart-count');
const cartLabelEl = document.getElementById('js-cart-label');
const subtotalEl  = document.getElementById('js-subtotal');

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id && i.size === product.size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function changeQty(id, size, delta) {
  const item = cart.find(i => i.id === id && i.size === size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => !(i.id === id && i.size === size));
  renderCart();
}

function getSubtotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCart() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);

  cartCountEl.textContent = total;
  cartLabelEl.textContent = total === 1 ? '1 artículo' : `${total} artículos`;
  subtotalEl.textContent  = getSubtotal().toFixed(2).replace('.', ',') + ' €';

  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart__empty">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Tu carrito está vacío</p>
      </div>`;
    return;
  }

  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item__thumb">
        ${item.image
          ? `<img src="${item.image}" alt="${item.name}">`
          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H5v10a1 1 0 001 1h12a1 1 0 001-1V10h1.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
        }
      </div>
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__detail">Talla ${item.size}</div>
        <div class="cart-item__qty">
          <button class="qty-btn" onclick="changeQty('${item.id}','${item.size}',-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}','${item.size}',1)">+</button>
        </div>
      </div>
      <span class="cart-item__price">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
    `;
    cartItemsEl.appendChild(el);
  });
}

window.addToCart  = addToCart;
window.changeQty  = changeQty;
window.renderCart = renderCart;

// toggle carrito
document.getElementById('js-cart-toggle').addEventListener('click', function (){
  document.getElementById('js-cart').classList.toggle('open');

});
renderCart();