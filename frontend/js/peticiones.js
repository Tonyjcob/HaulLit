// HAULIT — peticiones.js

const SESSION = {
  loggedIn: true,  // cambia a true para ver la vista logueada
  user: 'User'
};

let peticiones = [];
let activePeticion = null;

const lockedEl  = document.getElementById('js-locked');
const contentEl = document.getElementById('js-content');

if (SESSION.loggedIn) {
  lockedEl.style.display  = 'none';
  contentEl.style.display = 'block';
  initPeticiones();
} else {
  lockedEl.style.display  = 'flex';
  contentEl.style.display = 'none';
}

document.querySelectorAll('.pet__tab').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.pet__tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.getElementById('js-tab-nueva').style.display = tab === 'nueva' ? 'flex' : 'none';
    document.getElementById('js-tab-mis').style.display   = tab === 'mis'   ? 'flex' : 'none';
    if (tab === 'mis') renderPeticiones();
  });
});

const uploadArea  = document.getElementById('js-upload-area');
const uploadInput = document.getElementById('pet-foto');
const uploadName  = document.getElementById('js-upload-name');

uploadArea.addEventListener('click', function () { uploadInput.click(); });
uploadInput.addEventListener('change', function () {
  if (uploadInput.files.length > 0) uploadName.textContent = '✓ ' + uploadInput.files[0].name;
});
uploadArea.addEventListener('dragover',  function (e) { e.preventDefault(); uploadArea.style.borderColor = 'var(--color-text)'; });
uploadArea.addEventListener('dragleave', function ()  { uploadArea.style.borderColor = ''; });
uploadArea.addEventListener('drop', function (e) {
  e.preventDefault();
  uploadArea.style.borderColor = '';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    uploadInput.files = e.dataTransfer.files;
    uploadName.textContent = '✓ ' + file.name;
  }
});

document.getElementById('js-submit-btn').addEventListener('click', function () {
  const producto = document.getElementById('pet-producto').value.trim();
  const marca    = document.getElementById('pet-marca').value.trim();
  const desc     = document.getElementById('pet-desc').value.trim();
  const errorEl  = document.getElementById('js-form-error');

  if (!producto) { errorEl.textContent = 'El campo producto es obligatorio'; return; }
  if (!marca)    { errorEl.textContent = 'El campo marca es obligatorio'; return; }
  errorEl.textContent = '';

  const pet = {
    id:       'PET-' + String(peticiones.length + 1).padStart(3, '0'),
    producto: producto,
    marca:    marca,
    desc:     desc,
    fecha:    new Date(),
    estado:   'pendiente',
    mensajes: [{
      de:    'soporte',
      texto: `Hemos recibido tu petición sobre "${producto}". Estamos buscando opciones para ti.`,
      hora:  new Date()
    }]
  };

  peticiones.push(pet);
  activePeticion = pet;

  document.getElementById('pet-producto').value = '';
  document.getElementById('pet-marca').value    = '';
  document.getElementById('pet-desc').value     = '';
  uploadName.textContent = '';

  openChat(pet);
});

function openChat(pet) {
  document.getElementById('js-chat-empty').style.display = 'none';
  document.getElementById('js-chat').style.display       = 'flex';
  document.getElementById('js-chat-title').textContent   = 'SOPORTE — ' + pet.id;
  document.getElementById('js-chat-sub').textContent     = pet.producto + ' · ' + pet.marca;

  const statusEl = document.getElementById('js-chat-status');
  statusEl.textContent = pet.estado === 'proceso' ? 'EN PROCESO' : 'PENDIENTE';
  statusEl.className   = 'chat__status' + (pet.estado === 'proceso' ? ' active' : '');

  renderMessages(pet);
}

function renderMessages(pet) {
  const container = document.getElementById('js-chat-messages');
  container.innerHTML = '';
  pet.mensajes.forEach(function (msg) {
    const div  = document.createElement('div');
    div.className = 'chat__msg' + (msg.de === 'usuario' ? ' right' : '');
    const hora = msg.hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    div.innerHTML = `
      <div class="chat__avatar">${msg.de === 'usuario' ? SESSION.user.substring(0,2).toUpperCase() : 'HL'}</div>
      <div class="chat__bubble">${msg.texto}</div>
      <span class="chat__time">${hora}</span>
    `;
    container.appendChild(div);
  });
  container.scrollTop = container.scrollHeight;
}

document.getElementById('js-chat-send').addEventListener('click', enviarMensaje);
document.getElementById('js-chat-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') enviarMensaje();
});

function enviarMensaje() {
  if (!activePeticion) return;
  const input = document.getElementById('js-chat-input');
  const texto = input.value.trim();
  if (!texto) return;
  activePeticion.mensajes.push({ de: 'usuario', texto: texto, hora: new Date() });
  input.value = '';
  renderMessages(activePeticion);
  setTimeout(function () {
    activePeticion.mensajes.push({ de: 'soporte', texto: 'Gracias por tu mensaje. Te respondemos en breve.', hora: new Date() });
    renderMessages(activePeticion);
  }, 1200);
}

function renderPeticiones() {
  const list = document.getElementById('js-peticiones-list');
  list.innerHTML = '';
  if (peticiones.length === 0) {
    list.innerHTML = '<p class="pet__list-empty">Aún no has hecho ninguna petición</p>';
    return;
  }
  peticiones.forEach(function (pet) {
    const item = document.createElement('div');
    item.className = 'pet__item';
    const badgeClass = pet.estado === 'proceso' ? 'proceso' : pet.estado === 'cerrada' ? 'cerrada' : 'pendiente';
    const badgeText  = pet.estado === 'proceso' ? 'EN PROCESO' : pet.estado === 'cerrada' ? 'CERRADA' : 'PENDIENTE';
    const fecha = pet.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    item.innerHTML = `
      <div>
        <div class="pet__item-name">${pet.producto}</div>
        <div class="pet__item-meta">${pet.marca} · ${fecha}</div>
      </div>
      <span class="pet__badge ${badgeClass}">${badgeText}</span>
    `;
    item.addEventListener('click', function () {
      activePeticion = pet;
      document.querySelectorAll('.pet__tab').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-tab="nueva"]').classList.add('active');
      document.getElementById('js-tab-nueva').style.display = 'flex';
      document.getElementById('js-tab-mis').style.display   = 'none';
      openChat(pet);
    });
    list.appendChild(item);
  });
}

function initPeticiones() {
  // en el futuro: fetch('/api/peticiones')
  renderPeticiones();
}