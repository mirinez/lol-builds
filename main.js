/* ============================================================
   main.js
   ============================================================ */

/* CATEGORÍAS POR DEFECTO */
const DEFAULT_CATEGORIES = [
  { key: 'starter',     label: 'Starter'     },
  { key: 'first_item',  label: '1st Item'    },
  { key: 'second_item', label: '2nd Item'    },
  { key: 'third_item',  label: '3rd Item'    },
  { key: 'fourth_item', label: '4th Item'    },
  { key: 'situational', label: 'Situational' },
  { key: 'boots',       label: 'Boots'       },
];

/* ESTADO */
function loadState() {
  try {
    const s = localStorage.getItem('lolbuilds_data');
    if (s) return JSON.parse(s);
  } catch(e) {}
  return clone(lolData);
}

function loadCategories() {
  try {
    const s = localStorage.getItem('lolbuilds_cats');
    if (s) return JSON.parse(s);
  } catch(e) {}
  return clone(DEFAULT_CATEGORIES);
}

/*
  Carga las categorías personalizadas por campeón.
  Estructura: { [champName]: [ { key, label }, ... ] }
*/

function loadChampCategories() {
  try {
    const s = localStorage.getItem('lolbuilds_champ_cats');
    if (s) return JSON.parse(s);
  } catch(e) {}
  return {};
}

function save() {
  localStorage.setItem('lolbuilds_data',      JSON.stringify(appData));
  localStorage.setItem('lolbuilds_cats',       JSON.stringify(categories));
  localStorage.setItem('lolbuilds_champ_cats', JSON.stringify(champCategories));
}

function clone(x) { return JSON.parse(JSON.stringify(x)); }

let appData          = loadState();
let categories       = loadCategories();
let champCategories  = loadChampCategories(); // categorías propias por campeón
let currentChamp     = null;
let openNoteRow      = null;
let openEditorRow    = null;                  // fila con editor inline abierto

/* Retorna las categorías del campeón activo, o las globales si no tiene propias */
function getCats(champName) {
  return champCategories[champName] || categories;
}

/* DOM */
const $sel   = document.getElementById('champion-selector');
const $hero  = document.getElementById('champion-hero');
const $grid  = document.getElementById('build-grid');
const $modal = document.getElementById('admin-modal');
const $toast = document.getElementById('toast');

/* TOAST */
let _tt;
function toast(msg) {
  clearTimeout(_tt);
  $toast.textContent = msg;
  $toast.classList.add('show');
  _tt = setTimeout(() => $toast.classList.remove('show'), 2200);
}

/* HELPERS DE ICONOS */
function makeIcon(item, cls) {
  if (item.icon) {
    const img = document.createElement('img');
    img.className = cls; img.alt = item.name;
    img.loading = 'lazy'; img.src = item.icon;
    img.onerror = () => img.replaceWith(makePh(item, cls + '-ph'));
    return img;
  }
  return makePh(item, cls + '-ph');
}

function makePh(item, cls) {
  const d = document.createElement('div');
  d.className = cls;
  d.textContent = item.name ? item.name[0].toUpperCase() : '?';
  return d;
}

/* NOTA EXPANDIBLE */
function openNote(row) {
  if (openNoteRow && openNoteRow !== row) closeNote(openNoteRow);
  row.classList.add('is-open');
  row.querySelector('.item-note').classList.add('is-open');
  openNoteRow = row;
}

function closeNote(row) {
  row.classList.remove('is-open');
  row.querySelector('.item-note').classList.remove('is-open');
  if (openNoteRow === row) openNoteRow = null;
}

function toggleNote(row) {
  row.classList.contains('is-open') ? closeNote(row) : openNote(row);
}

/* EDITOR INLINE */
function closeEditor() {
  if (!openEditorRow) return;
  const ed = openEditorRow.querySelector('.item-editor');
  if (ed) ed.remove();
  openEditorRow = null;
}

/*
  Abre el editor inline para un ítem existente.
  Si ya hay otro editor abierto, lo cierra primero.
*/

function openEditor(row, champName, catKey, itemIdx) {
  if (openEditorRow && openEditorRow !== row) closeEditor();
  if (openEditorRow === row) { closeEditor(); return; }
  openEditorRow = row;

  const item = appData.champions[champName][catKey][itemIdx];
  const ed   = document.createElement('div');
  ed.className = 'item-editor';

  function field(labelTxt, inputEl) {
    const wrap = document.createElement('div');
    wrap.className = 'item-editor-field';
    const lbl = document.createElement('label');
    lbl.textContent = labelTxt;
    wrap.append(lbl, inputEl);
    return wrap;
  }

  const inName  = document.createElement('input');
  inName.type   = 'text'; inName.value = item.name; inName.placeholder = 'Nombre';

  const inIcon  = document.createElement('input');
  inIcon.type   = 'text'; inIcon.value = item.icon || ''; inIcon.placeholder = 'URL icono';

  const inStats = document.createElement('textarea');
  inStats.rows  = 4;
  inStats.value = (item.stats || []).join('\n');
  inStats.placeholder = '+60 Ability Power\n+300 Health\nPassive Burn: ...';

  const inDesc  = document.createElement('textarea');
  inDesc.rows   = 3;
  inDesc.value  = item.description || '';
  inDesc.placeholder = 'Análisis...';

  const row1 = document.createElement('div'); row1.className = 'item-editor-row';
  row1.append(field('Nombre', inName), field('URL Icono', inIcon));

  const row2 = document.createElement('div'); row2.className = 'item-editor-row';
  row2.append(field('Stats (una por línea)', inStats));

  const row3 = document.createElement('div'); row3.className = 'item-editor-row';
  row3.append(field('Análisis', inDesc));

  const actions   = document.createElement('div');
  actions.className = 'item-editor-actions';

  const btnCancel = document.createElement('button');
  btnCancel.className = 'btn-editor'; btnCancel.textContent = 'Cancelar';
  btnCancel.addEventListener('click', closeEditor);

  const btnSave = document.createElement('button');
  btnSave.className = 'btn-editor save'; btnSave.textContent = 'Guardar';
  btnSave.addEventListener('click', () => {
    const newName  = inName.value.trim();
    const newIcon  = inIcon.value.trim();
    const newStats = inStats.value.split('\n').map(s => s.trim()).filter(Boolean);
    const newDesc  = inDesc.value.trim();

    if (!newName) return toast('Pon el nombre, máquina');

    const updated = {
      id:          item.id || newName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name:        newName,
      icon:        newIcon,
      stats:       newStats,
      description: newDesc
    };

    appData.champions[champName][catKey].splice(itemIdx, 1, updated);
    save();
    closeEditor();
    renderChampion(champName);
    toast(`${newName} guardado ✓`);
  });

  actions.append(btnCancel, btnSave);
  ed.append(row1, row2, row3, actions);
  row.querySelector('.item-trigger').after(ed);
  setTimeout(() => inName.focus(), 0);
}

/* DRAG & DROP */
// Almacena el estado de drag en curso
const drag = {
  champName: null,
  fromCat:   null,
  fromIdx:   null,
  row:       null,
};

/*
  Inicializa los eventos dragstart / dragend en una fila de ítem.
*/

function attachDragToRow(row, champName, catKey, idx) {
  row.setAttribute('draggable', 'true');

  row.addEventListener('dragstart', e => {
    drag.champName = champName;
    drag.fromCat   = catKey;
    drag.fromIdx   = idx;
    drag.row       = row;
    row.classList.add('dragging');
    // Necesario para Firefox
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  });

  row.addEventListener('dragend', () => {
    row.classList.remove('dragging');
    // Limpiar indicadores visuales
    document.querySelectorAll('.drag-target-above').forEach(el => el.classList.remove('drag-target-above'));
    document.querySelectorAll('.card.drag-over').forEach(el => el.classList.remove('drag-over'));
  });
}

/*
  Inicializa los eventos dragover / drop en una tarjeta (card).
  Permite soltar un ítem en cualquier posición dentro del body de la tarjeta.
*/

function attachDropToCard(card, champName, catKey) {
  const body = card.querySelector('.card-body');

  card.addEventListener('dragover', e => {
    if (!drag.champName) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    card.classList.add('drag-over');

    // Calcular posición de inserción entre ítems
    const rows = [...body.querySelectorAll('.item-row')];
    document.querySelectorAll('.drag-target-above').forEach(el => el.classList.remove('drag-target-above'));
    const target = rows.find(r => {
      const rect = r.getBoundingClientRect();
      return e.clientY < rect.top + rect.height / 2;
    });
    if (target) target.classList.add('drag-target-above');
  });

  card.addEventListener('dragleave', e => {
    // Solo limpiar si realmente salgo del card
    if (!card.contains(e.relatedTarget)) {
      card.classList.remove('drag-over');
      document.querySelectorAll('.drag-target-above').forEach(el => el.classList.remove('drag-target-above'));
    }
  });

  card.addEventListener('drop', e => {
    e.preventDefault();
    card.classList.remove('drag-over');
    document.querySelectorAll('.drag-target-above').forEach(el => el.classList.remove('drag-target-above'));

    if (!drag.champName || drag.champName !== champName) return;

    const fromCat = drag.fromCat;
    const fromIdx = drag.fromIdx;
    const toCat   = catKey;

    // Calcular índice de destino
    const rows     = [...body.querySelectorAll('.item-row')];
    let   toIdx    = rows.length; // por defecto al final
    const target   = rows.find(r => {
      const rect = r.getBoundingClientRect();
      return e.clientY < rect.top + rect.height / 2;
    });
    if (target) toIdx = parseInt(target.dataset.idx, 10);

    // Extraer el ítem de origen
    if (!appData.champions[champName][fromCat]) return;
    const [movedItem] = appData.champions[champName][fromCat].splice(fromIdx, 1);

    // Insertar en destino
    if (!appData.champions[champName][toCat]) appData.champions[champName][toCat] = [];

    // Ajustar índice si es la misma tarjeta y el origen era anterior
    let adjustedIdx = toIdx;
    if (fromCat === toCat && fromIdx < toIdx) adjustedIdx = Math.max(0, toIdx - 1);

    appData.champions[champName][toCat].splice(adjustedIdx, 0, movedItem);

    save();
    renderChampion(champName);
    toast(`${movedItem.name} movido ✓`);
  });
}

/* RENDER FILA DE ÍTEM */
function renderItemRow(item, champName, catKey, idx) {
  const row = document.createElement('div');
  row.className     = 'item-row';
  row.dataset.idx   = idx;

  /* Handle de arrastre */
  const handle = document.createElement('span');
  handle.className   = 'drag-handle';
  handle.title       = 'Arrastrar';
  handle.textContent = '⠿';

  /* Trigger principal */
  const trigger = document.createElement('button');
  trigger.className  = 'item-trigger';

  const icon    = makeIcon(item, 'item-icon');
  const name    = document.createElement('span');
  name.className     = 'item-name'; name.textContent = item.name;

  const chevron = document.createElement('span');
  chevron.className  = 'chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.textContent = '▼';

  /* Botones editar / borrar (visibles en hover via CSS) */
  const actions   = document.createElement('div');
  actions.className = 'item-actions';

  const btnEdit = document.createElement('button');
  btnEdit.className  = 'item-action-btn'; btnEdit.title = 'Editar'; btnEdit.textContent = '✎';
  btnEdit.addEventListener('click', e => {
    e.stopPropagation();
    openEditor(row, champName, catKey, idx);
  });

  const btnDel = document.createElement('button');
  btnDel.className   = 'item-action-btn del'; btnDel.title = 'Eliminar'; btnDel.textContent = '✕';
  btnDel.addEventListener('click', e => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    appData.champions[champName][catKey].splice(idx, 1);
    save();
    renderChampion(champName);
    toast(`${item.name} eliminado`);
  });

  actions.append(btnEdit, btnDel);
  trigger.append(handle, icon, name, chevron, actions);

  /* Panel nota expandible */
  const noteWrap  = document.createElement('div'); noteWrap.className = 'item-note';
  const noteInner = document.createElement('div'); noteInner.className = 'item-note-inner';
  const panel     = document.createElement('div'); panel.className = 'item-panel';

  const hasStats = Array.isArray(item.stats) && item.stats.length > 0;
  if (hasStats) {
    const statsSection = document.createElement('div'); statsSection.className = 'item-panel-stats';
    const statsLabel   = document.createElement('div'); statsLabel.className = 'item-panel-label'; statsLabel.textContent = 'Stats';
    statsSection.appendChild(statsLabel);
    const statsList = document.createElement('ul'); statsList.className = 'item-stats-list';

    item.stats.forEach(stat => {
      const li = document.createElement('li'); li.className = 'item-stat';
      // Regex para resaltar el valor numérico o la palabra Passive/Active al inicio
      const m = stat.match(/^((?:Passive|Active|Unique Passive|Unique Active)\s*:|[+\-\d%\s\.]+(?:Move Speed|Attack Damage|Ability Power|Health|Mana|Movement Speed|Attack Speed|Armor|Magic Resistance|Ability Haste|Tenacity|Magic Penetration|Omnivamp|Base Health Regeneration|Summoner Spell Haste)?)(.*)/i);
      if (m) {
        const sp = document.createElement('span'); sp.className = 'stat-value'; sp.textContent = m[1];
        li.append(sp, document.createTextNode(m[2]));
      } else {
        li.textContent = stat;
      }
      statsList.appendChild(li);
    });

    statsSection.appendChild(statsList);
    panel.appendChild(statsSection);
  }

  const hasDesc         = item.description && item.description.trim().length > 0;
  const analysisSection = document.createElement('div');
  analysisSection.className = 'item-panel-analysis' + (hasStats ? ' has-stats' : '');
  const analysisLabel   = document.createElement('div'); analysisLabel.className = 'item-panel-label'; analysisLabel.textContent = 'Análisis';
  const analysisBody    = document.createElement('p');
  analysisBody.className    = 'item-analysis-body' + (hasDesc ? '' : ' is-empty');
  analysisBody.textContent  = hasDesc ? item.description : 'no hay datos :(';
  analysisSection.append(analysisLabel, analysisBody);
  panel.appendChild(analysisSection);

  noteInner.appendChild(panel);
  noteWrap.appendChild(noteInner);
  row.append(trigger, noteWrap);

  trigger.addEventListener('click', () => toggleNote(row));

  // Adjuntar drag
  attachDragToRow(row, champName, catKey, idx);

  return row;
}

/* RENDER TARJETA */
function renderCard(config, champName) {
  const items = (appData.champions[champName] || {})[config.key] || [];

  const card = document.createElement('div');
  card.className = 'card';

  /* Header con label editable */
  const hdr = document.createElement('div');
  hdr.className = 'card-header';

  const lbl = document.createElement('span');
  lbl.className       = 'card-label';
  lbl.textContent     = config.label;
  lbl.contentEditable = 'true';
  lbl.spellcheck      = false;

  const saveLabel = () => {
    const newLabel = lbl.textContent.trim();
    if (!newLabel) { lbl.textContent = config.label; return; }
    config.label = newLabel;
    save();
    toast(`Tarjeta renombrada: ${newLabel}`);
  };

  lbl.addEventListener('blur', saveLabel);
  lbl.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); lbl.blur(); }
    if (e.key === 'Escape') { lbl.textContent = config.label; lbl.blur(); }
    e.stopPropagation();
  });
  lbl.addEventListener('click', e => e.stopPropagation());

  /* Acciones del header agrupadas */
  const headerActions = document.createElement('div');
  headerActions.className = 'card-header-actions';

  /* Botón + añadir ítem */
  const addBtn = document.createElement('button');
  addBtn.className = 'card-add-btn'; addBtn.title = 'Añadir ítem'; addBtn.textContent = '+';

  /* Botón borrar tarjeta que solo afecta al campeón activo */
  const delBtn = document.createElement('button');
  delBtn.className = 'card-del-btn'; delBtn.title = 'Borrar tarjeta'; delBtn.textContent = '✕';
  delBtn.addEventListener('click', e => {
    e.stopPropagation();
    const itemCount = (appData.champions[champName][config.key] || []).length;
    const msg       = itemCount > 0
      ? `¿Borrar la tarjeta "${config.label}" y sus ${itemCount} ítems de ${champName}?`
      : `¿Borrar la tarjeta "${config.label}" de ${champName}?`;
    if (!confirm(msg)) return;

    // Eliminar los datos del campeón para esta categoría
    delete appData.champions[champName][config.key];

    // Eliminar la categoría de la lista del campeón (o global si no tiene propias)
    const cats = getCats(champName);
    const idx  = cats.findIndex(c => c.key === config.key);
    if (idx !== -1) cats.splice(idx, 1);

    // Si el campeón tiene sus propias categorías actualizadas, guardarlas
    champCategories[champName] = cats;

    save();
    renderChampion(champName);
    toast(`Tarjeta "${config.label}" eliminada`);
  });

  headerActions.append(addBtn, delBtn);
  hdr.append(lbl, headerActions);

  /* Body */
  const body = document.createElement('div');
  body.className = 'card-body';

  if (!items || items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'card-empty'; empty.textContent = 'no hay datos :(';
    body.appendChild(empty);
  } else {
    items.forEach((item, idx) => body.appendChild(renderItemRow(item, champName, config.key, idx)));
  }

  /* Formulario add-item inline */
  const addForm = buildAddItemForm(champName, config.key);
  body.appendChild(addForm);

  addBtn.addEventListener('click', () => {
    addForm.classList.toggle('is-open');
    if (addForm.classList.contains('is-open')) {
      addForm.querySelector('input[data-field="name"]').focus();
    }
  });

  card.append(hdr, body);

  /* Adjuntar drop a la tarjeta */
  attachDropToCard(card, champName, config.key);

  return card;
}

/* FORMULARIO ADD ITEM INLINE */
function buildAddItemForm(champName, catKey) {
  const form = document.createElement('div');
  form.className = 'add-item-form';

  function field(labelTxt, inputEl) {
    const wrap = document.createElement('div');
    wrap.className = 'item-editor-field';
    const lbl  = document.createElement('label');
    lbl.textContent = labelTxt;
    wrap.append(lbl, inputEl);
    return wrap;
  }

  const inName = document.createElement('input');
  inName.type  = 'text'; inName.placeholder = 'Nombre del ítem';
  inName.dataset.field = 'name';

  const inIcon = document.createElement('input');
  inIcon.type  = 'text'; inIcon.placeholder = 'URL icono';

  const inStats  = document.createElement('textarea');
  inStats.rows   = 3; inStats.placeholder = '+60 Ability Power...';

  const inDesc   = document.createElement('textarea');
  inDesc.rows    = 2; inDesc.placeholder = 'Análisis...';

  const row1 = document.createElement('div'); row1.className = 'item-editor-row';
  row1.append(field('Nombre', inName), field('URL Icono', inIcon));

  const row2 = document.createElement('div'); row2.className = 'item-editor-row';
  row2.append(field('Stats (una por línea)', inStats));

  const row3 = document.createElement('div'); row3.className = 'item-editor-row';
  row3.append(field('Análisis', inDesc));

  const actions   = document.createElement('div'); actions.className = 'item-editor-actions';

  const btnCancel = document.createElement('button');
  btnCancel.className = 'btn-editor'; btnCancel.textContent = 'Cancelar';
  btnCancel.addEventListener('click', () => { form.classList.remove('is-open'); clearForm(); });

  const btnAdd = document.createElement('button');
  btnAdd.className = 'btn-editor save'; btnAdd.textContent = 'Añadir';
  btnAdd.addEventListener('click', () => {
    const name = inName.value.trim();
    if (!name) return toast('Pon el nombre, máquina');
    const newItem = {
      id:          name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name,
      icon:        inIcon.value.trim(),
      stats:       inStats.value.split('\n').map(s => s.trim()).filter(Boolean),
      description: inDesc.value.trim()
    };
    if (!appData.champions[champName][catKey]) appData.champions[champName][catKey] = [];
    appData.champions[champName][catKey].push(newItem);
    save();
    form.classList.remove('is-open');
    clearForm();
    renderChampion(champName);
    toast(`${name} añadido ✓`);
  });

  function clearForm() {
    inName.value = ''; inIcon.value = ''; inStats.value = ''; inDesc.value = '';
  }

  actions.append(btnCancel, btnAdd);
  form.append(row1, row2, row3, actions);
  return form;
}

/* BOTÓN "AÑADIR TARJETA" por campeón */
function buildAddCardButton(champName) {
  const btn = document.createElement('button');
  btn.className    = 'btn-nav';
  btn.style.cssText = 'font-size:11px; opacity:0.7;';
  btn.textContent  = '+ Tarjeta';
  btn.title        = `Añadir tarjeta a ${champName}`;
  btn.addEventListener('click', () => {
    const label = prompt('Nombre de la nueva tarjeta:', 'Nueva tarjeta');
    if (!label || !label.trim()) return;
    const key = label.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    const newCat = { key, label: label.trim() };
    // Clonar las categorías globales al campeón si aún no tiene propias
    if (!champCategories[champName]) {
      champCategories[champName] = clone(categories);
    }
    champCategories[champName].push(newCat);
    save();
    renderChampion(champName);
    toast(`Tarjeta "${newCat.label}" añadida`);
  });
  return btn;
}

/* RENDER CAMPEÓN */
function renderChampion(name) {
  const champ = appData.champions[name];
  if (!champ) return;
  currentChamp = name;
  openNoteRow  = null;
  openEditorRow = null;

  $hero.innerHTML = '';
  const hName = document.createElement('h1');
  hName.className  = 'hero-name'; hName.textContent = name;
  const hRole = document.createElement('span');
  hRole.className  = 'hero-role'; hRole.textContent = champ.role || '';
  $hero.append(hName, hRole);

  $grid.innerHTML = '';
  const cats = getCats(name);
  cats.forEach(cfg => $grid.appendChild(renderCard(cfg, name)));

  // Botón para añadir tarjeta nueva a este campeón
  let addCardBtn = document.getElementById('add-card-btn');
  if (addCardBtn) addCardBtn.remove();
  addCardBtn    = buildAddCardButton(name);
  addCardBtn.id = 'add-card-btn';
  $grid.after(addCardBtn);
}

function selectChampion(name) {
  document.querySelectorAll('.champ-bubble').forEach(b => {
    const active = b.dataset.champion === name;
    b.classList.toggle('active', active);
    b.classList.toggle('is-collapsed', !active);
  });
  renderChampion(name);
}

/* SELECTOR DE BURBUJAS */
function makeBubblePh(name) {
  const ph = document.createElement('div');
  ph.className = 'bubble-avatar-ph';
  ph.textContent = name[0].toUpperCase();
  return ph;
}

function renderSelector() {
  $sel.innerHTML = '';
  Object.keys(appData.champions).forEach(name => {
    const champ  = appData.champions[name];
    const bubble = document.createElement('button');
    bubble.className        = 'champ-bubble is-collapsed';
    bubble.dataset.champion = name; bubble.title = name;

    let avatar;
    if (champ.icon) {
      avatar           = document.createElement('img');
      avatar.className = 'bubble-avatar'; avatar.src = champ.icon; avatar.alt = name;
      avatar.onerror   = () => avatar.replaceWith(makeBubblePh(name));
    } else { avatar = makeBubblePh(name); }

    const label = document.createElement('span');
    label.className   = 'bubble-name'; label.textContent = name;
    bubble.append(avatar, label);
    bubble.addEventListener('click', () => selectChampion(name));
    $sel.appendChild(bubble);
  });
}

function fullRender() {
  renderSelector();
  const first = currentChamp || Object.keys(appData.champions)[0];
  if (first) selectChampion(first);
}

/* MODAL CAMPEONES */
function openAdmin() {
  $modal.setAttribute('aria-hidden', 'false');
  $modal.classList.add('is-open');
  populateChampList();
}

function closeAdmin() {
  $modal.setAttribute('aria-hidden', 'true');
  $modal.classList.remove('is-open');
}

document.getElementById('btn-admin').addEventListener('click', openAdmin);
document.getElementById('modal-close').addEventListener('click', closeAdmin);
$modal.addEventListener('click', e => { if (e.target === $modal) closeAdmin(); });

function populateChampList() {
  const list = document.getElementById('champ-list');
  list.innerHTML = '';
  Object.keys(appData.champions).forEach(name => {
    const champ = appData.champions[name];
    const row   = document.createElement('div');
    row.className = 'list-row';

    let av;
    if (champ.icon) {
      av           = document.createElement('img');
      av.className = 'list-row-icon'; av.src = champ.icon; av.alt = name;
      av.onerror   = () => av.replaceWith(listPh(name));
    } else av = listPh(name);

    const info = document.createElement('div');
    info.className = 'list-row-info';
    info.innerHTML = `<div class="list-row-name">${name}</div><div class="list-row-sub">${champ.role || 'sin rol'}</div>`;

    const acts    = document.createElement('div');
    acts.className = 'list-row-actions';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn-form'; btnEdit.textContent = 'Editar';
    btnEdit.addEventListener('click', () => {
      document.getElementById('champ-name').value = name;
      document.getElementById('champ-role').value = champ.role || '';
      document.getElementById('champ-icon').value = champ.icon || '';
      document.getElementById('champ-name').dataset.editing = name;
    });

    const btnDel = document.createElement('button');
    btnDel.className = 'btn-form danger'; btnDel.textContent = 'Borrar';
    btnDel.addEventListener('click', () => {
      if (!confirm(`¿Borrar ${name} y todos sus ítems?`)) return;
      delete appData.champions[name];
      delete champCategories[name]; // limpiar categorías propias
      if (currentChamp === name) currentChamp = null;
      save(); fullRender(); populateChampList();
      toast(`${name} eliminado`);
    });

    acts.append(btnEdit, btnDel);
    row.append(av, info, acts);
    list.appendChild(row);
  });
}

function listPh(name) {
  const ph = document.createElement('div');
  ph.className   = 'list-row-icon-ph';
  ph.textContent = name[0].toUpperCase();
  return ph;
}

document.getElementById('btn-save-champ').addEventListener('click', () => {
  const inp     = document.getElementById('champ-name');
  const newName = inp.value.trim();
  const role    = document.getElementById('champ-role').value.trim();
  const icon    = document.getElementById('champ-icon').value.trim();
  const editing = inp.dataset.editing;

  if (!newName) return toast('El nombre es obligatorio');

  if (editing && editing !== newName) {
    appData.champions[newName] = appData.champions[editing];
    delete appData.champions[editing];
    // Migrar categorías propias si las tiene
    if (champCategories[editing]) {
      champCategories[newName] = champCategories[editing];
      delete champCategories[editing];
    }
    if (currentChamp === editing) currentChamp = newName;
  }
  if (!appData.champions[newName]) appData.champions[newName] = {};
  appData.champions[newName].role = role;
  appData.champions[newName].icon = icon;

  delete inp.dataset.editing;
  clearChampForm();
  save(); fullRender(); populateChampList();
  toast(`${newName} guardado ✓`);
});

document.getElementById('btn-clear-champ').addEventListener('click', clearChampForm);

function clearChampForm() {
  document.getElementById('champ-name').value = '';
  document.getElementById('champ-role').value = '';
  document.getElementById('champ-icon').value = '';
  delete document.getElementById('champ-name').dataset.editing;
}

/* EXPORT */
/*
  Genera el bloque completo listo para sustituir data.js.
  Incluye las categorías propias de cada campeón si las tiene,
  y respeta la sintaxis original (const lolData = {...};).
*/

function generateDataJs() {
  // Merge: cada campeón lleva sus categorías si difieren de las globales
  const payload = {
    champions:  appData.champions,
    categories: categories,
    // Incluir overrides por campeón solo si existen
    ...(Object.keys(champCategories).length > 0 && { champCategories })
  };
  return `/* LoL Builds — ${new Date().toISOString().slice(0, 10)} */\nconst lolData = ${JSON.stringify(payload, null, 4)};\n`;
}

document.getElementById('btn-export').addEventListener('click', () => {
  const js = generateDataJs();
  const a  = Object.assign(document.createElement('a'), {
    href:     URL.createObjectURL(new Blob([js], { type: 'text/javascript' })),
    download: 'lolbuilds_export.js'
  });
  a.click(); URL.revokeObjectURL(a.href);
  toast('Exportado ✓');
});

/* GUARDAR Y DESCARGAR */
document.getElementById('btnExportar').addEventListener('click', () => {
  try {
    const js   = generateDataJs();
    const blob = new Blob([js], { type: 'text/javascript' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast('data.js descargado ✓');
  } catch (err) {
    console.error('Error al exportar:', err);
    toast('Error al generar el archivo');
  }
});

/* IMPORT */
document.getElementById('btn-import').addEventListener('click', () => {
  document.getElementById('file-import').value = '';
  document.getElementById('file-import').click();
});

document.getElementById('file-import').addEventListener('change', e => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      let raw = ev.target.result, parsed;
      try { parsed = JSON.parse(raw); }
      catch {
        // Intentar extraer el objeto de un archivo .js
        const m = raw.match(/const\s+lolData\s*=\s*(\{[\s\S]*?\});\s*(?:$|\/\/)/m)
               || raw.match(/const\s+lolData\s*=\s*(\{[\s\S]*\});/m);
        if (!m) throw new Error('Formato no reconocido');
        parsed = JSON.parse(m[1]);
      }
      if (!parsed.champions) throw new Error('Sin datos de campeones');
      appData         = { champions: parsed.champions };
      categories      = parsed.categories      || clone(DEFAULT_CATEGORIES);
      champCategories = parsed.champCategories || {};
      currentChamp    = null;
      save(); fullRender(); closeAdmin();
      toast('Importado ✓');
    } catch(err) { toast('Error: ' + err.message); }
  };
  reader.readAsText(file);
});

/* INIT */
document.addEventListener('DOMContentLoaded', fullRender);
