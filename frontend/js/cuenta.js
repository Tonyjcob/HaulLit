// HAULIT — cuenta.js

const SESSION = { loggedIn: false, user: null };

const USUARIOS = [
  { email: 'antonio@haullit.com', password: '1234', nombre: 'Antonio', apellido: 'Pérez', telefono: '+34 600 000 000' }
];

const PEDIDOS = [
  { ref: '#HL-001', desc: 'Camiseta Oversize + Cargo Pants', fecha: '12 may 2025', total: '94,98 €', estado: 'entregado' },
  { ref: '#HL-002', desc: 'Hoodie Washed',                   fecha: '8 may 2025',  total: '54,99 €', estado: 'camino'    },
];

const loginEl  = document.getElementById('js-login');
const perfilEl = document.getElementById('js-perfil');

if (SESSION.loggedIn && SESSION.user) {
  showPerfil(SESSION.user);
} else {
  loginEl.style.display  = 'flex';
  perfilEl.style.display = 'none';
}

document.getElementById('js-login-btn').addEventListener('click', handleLogin);
document.getElementById('login-pass').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-pass').value;
  const errorEl  = document.getElementById('js-login-error');

  if (!email || !password) { errorEl.textContent = 'Rellena todos los campos'; return; }

  // En el futuro: fetch('/api/login', { method:'POST', body: JSON.stringify({email, password}) })
  const usuario = USUARIOS.find(u => u.email === email && u.password === password);

  if (!usuario) { errorEl.textContent = 'Email o contraseña incorrectos'; return; }

  errorEl.textContent  = '';
  SESSION.loggedIn     = true;
  SESSION.user         = usuario;
  showPerfil(usuario);
}

function showPerfil(usuario) {
  loginEl.style.display  = 'none';
  perfilEl.style.display = 'grid';

  const iniciales = (usuario.nombre[0] + (usuario.apellido ? usuario.apellido[0] : '')).toUpperCase();
  document.getElementById('js-avatar').textContent     = iniciales;
  document.getElementById('js-user-name').textContent  = usuario.nombre + ' ' + (usuario.apellido || '');
  document.getElementById('js-user-email').textContent = usuario.email;

  document.getElementById('p-nombre').value   = usuario.nombre   || '';
  document.getElementById('p-apellido').value = usuario.apellido || '';
  document.getElementById('p-email').value    = usuario.email    || '';
  document.getElementById('p-telefono').value = usuario.telefono || '';

  renderPedidos();
}

document.querySelectorAll('.perfil__nav-link').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.perfil__nav-link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const section = btn.dataset.section;
    document.querySelectorAll('.perfil__section').forEach(s => s.style.display = 'none');
    document.getElementById('js-section-' + section).style.display = 'flex';
  });
});

document.getElementById('js-perfil-save').addEventListener('click', function () {
  if (!SESSION.user) return;
  SESSION.user.nombre   = document.getElementById('p-nombre').value.trim();
  SESSION.user.apellido = document.getElementById('p-apellido').value.trim();
  SESSION.user.telefono = document.getElementById('p-telefono').value.trim();

  const iniciales = (SESSION.user.nombre[0] + SESSION.user.apellido[0]).toUpperCase();
  document.getElementById('js-avatar').textContent    = iniciales;
  document.getElementById('js-user-name').textContent = SESSION.user.nombre + ' ' + SESSION.user.apellido;

  const okEl = document.getElementById('js-perfil-ok');
  okEl.textContent = '✓ Cambios guardados';
  setTimeout(function () { okEl.textContent = ''; }, 3000);
  // En el futuro: fetch('/api/usuario', { method:'PUT', body: JSON.stringify(SESSION.user) })
});

document.getElementById('js-pass-save').addEventListener('click', function () {
  const actual    = document.getElementById('p-pass-actual').value;
  const nueva     = document.getElementById('p-pass-nueva').value;
  const confirmar = document.getElementById('p-pass-confirmar').value;
  const errorEl   = document.getElementById('js-pass-error');
  const okEl      = document.getElementById('js-pass-ok');

  errorEl.textContent = '';
  okEl.textContent    = '';

  if (!actual || !nueva || !confirmar) { errorEl.textContent = 'Rellena todos los campos'; return; }
  if (actual !== SESSION.user.password) { errorEl.textContent = 'La contraseña actual no es correcta'; return; }
  if (nueva.length < 6) { errorEl.textContent = 'La nueva contraseña debe tener al menos 6 caracteres'; return; }
  if (nueva !== confirmar) { errorEl.textContent = 'Las contraseñas no coinciden'; return; }

  SESSION.user.password = nueva;
  document.getElementById('p-pass-actual').value    = '';
  document.getElementById('p-pass-nueva').value     = '';
  document.getElementById('p-pass-confirmar').value = '';

  okEl.textContent = '✓ Contraseña actualizada';
  setTimeout(function () { okEl.textContent = ''; }, 3000);
  // En el futuro: fetch('/api/usuario/password', { method:'PUT', body: ... })
});

document.getElementById('js-dir-save').addEventListener('click', function () {
  const okEl = document.getElementById('js-dir-ok');
  okEl.textContent = '✓ Dirección guardada';
  setTimeout(function () { okEl.textContent = ''; }, 3000);
  // En el futuro: fetch('/api/usuario/direccion', { method:'PUT', body: ... })
});

function renderPedidos() {
  const list = document.getElementById('js-pedidos-list');
  list.innerHTML = '';
  if (PEDIDOS.length === 0) { list.innerHTML = '<p class="cuenta__empty">No tienes pedidos aún</p>'; return; }
  PEDIDOS.forEach(function (p) {
    const item = document.createElement('div');
    item.className = 'pedido__item';
    const badgeText = p.estado === 'entregado' ? 'ENTREGADO' : p.estado === 'camino' ? 'EN CAMINO' : 'PENDIENTE';
    item.innerHTML = `
      <div>
        <div class="pedido__ref">${p.ref} — ${p.desc}</div>
        <div class="pedido__meta">${p.fecha} · ${p.total}</div>
      </div>
      <span class="pedido__badge ${p.estado}">${badgeText}</span>
    `;
    list.appendChild(item);
  });
}

document.getElementById('js-logout').addEventListener('click', function () {
  SESSION.loggedIn = false;
  SESSION.user     = null;
  perfilEl.style.display = 'none';
  loginEl.style.display  = 'flex';
  document.getElementById('login-email').value = '';
  document.getElementById('login-pass').value  = '';
});