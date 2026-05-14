// HAULIT — checkout.js

function renderSummary() {
  const itemsEl    = document.getElementById('js-summary-items');
  const subtotalEl = document.getElementById('js-summary-subtotal');
  const totalEl    = document.getElementById('js-summary-total');

  itemsEl.innerHTML = '';

  if (!cart || cart.length === 0) {
    itemsEl.innerHTML = '<p style="font-size:11px;letter-spacing:1px;color:var(--color-muted);padding:var(--spacing-md) 0;">Tu carrito está vacío</p>';
    subtotalEl.textContent = '0,00 €';
    totalEl.textContent    = '0,00 €';
    return;
  }

  cart.forEach(function (item) {
    const div = document.createElement('div');
    div.className = 'summary__item';
    div.innerHTML = `
      <div class="summary__item-left">
        <div class="summary__item-thumb">
          ${item.image
            ? `<img src="${item.image}" alt="${item.name}">`
            : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-muted);opacity:0.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H5v10a1 1 0 001 1h12a1 1 0 001-1V10h1.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`
          }
        </div>
        <div>
          <div class="summary__item-name">${item.name}</div>
          <div class="summary__item-meta">Talla ${item.size} · x${item.qty}</div>
        </div>
      </div>
      <span class="summary__item-price">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
    `;
    itemsEl.appendChild(div);
  });

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  subtotalEl.textContent = subtotal.toFixed(2).replace('.', ',') + ' €';
  totalEl.textContent    = subtotal.toFixed(2).replace('.', ',') + ' €';
}

function setStep(step) {
  [1, 2, 3, 4].forEach(function (n) {
    const el = document.getElementById('js-step-' + n);
    if (!el) return;
    el.classList.remove('active', 'done');
    if (n < step)  el.classList.add('done');
    if (n === step) el.classList.add('active');
  });

  document.getElementById('js-panel-envio').style.display   = step === 2 ? 'flex' : 'none';
  document.getElementById('js-panel-pago').style.display    = step === 3 ? 'flex' : 'none';
  document.getElementById('js-panel-confirm').style.display = step === 4 ? 'flex' : 'none';
}

document.getElementById('js-btn-envio').addEventListener('click', function () {
  const nombre    = document.getElementById('env-nombre').value.trim();
  const apellido  = document.getElementById('env-apellido').value.trim();
  const direccion = document.getElementById('env-direccion').value.trim();
  const ciudad    = document.getElementById('env-ciudad').value.trim();
  const cp        = document.getElementById('env-cp').value.trim();
  const telefono  = document.getElementById('env-telefono').value.trim();
  const errorEl   = document.getElementById('js-envio-error');

  if (!nombre || !apellido || !direccion || !ciudad || !cp || !telefono) {
    errorEl.textContent = 'Rellena todos los campos obligatorios';
    return;
  }
  errorEl.textContent = '';
  setStep(3);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('js-btn-back-envio').addEventListener('click', function () {
  setStep(2);
});

document.getElementById('js-btn-confirmar').addEventListener('click', function () {
  const ref = '#HL-' + String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('js-confirm-ref').textContent = 'Referencia del pedido: ' + ref;
  cart = [];
  renderCart();
  setStep(4);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // En el futuro: POST a /api/pedidos
});

renderSummary();
setStep(2);