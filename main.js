/* ============================================================
   main.js — Dashboard v3
   - Nombre de tarjeta editable inline (contenteditable)
   - Edición de ítems inline (editor desplegable debajo del trigger)
   - Mover ítem entre tarjetas (selector en el editor)
   - Añadir ítem con formulario inline en cada tarjeta
   - Modal solo para añadir/borrar campeones
   - localStorage + export/import
   ============================================================ */

/* CATEGORÍAS por defecto */
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

function save() {
  localStorage.setItem('lolbuilds_data', JSON.stringify(appData));
  localStorage.setItem('lolbuilds_cats', JSON.stringify(categories));
}

function clone(x) { return JSON.parse(JSON.stringify(x)); }

let appData        = loadState();
let categories     = loadCategories();
let currentChamp   = null;
let openNoteRow    = null;
let openEditorRow  = null;  // fila con editor inline abierto

/* DOM */
const $sel    = document.getElementById('champion-selector');
const $hero   = document.getElementById('champion-hero');
const $grid   = document.getElementById('build-grid');
const $modal  = document.getElementById('admin-modal');
const $toast  = document.getElementById('toast');

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

function openEditor(row, champName, catKey, itemIdx) {
  // Cerrar editor previo si es otro
  if (openEditorRow && openEditorRow !== row) closeEditor();

  // Si ya estaba abierto en esta fila, cerrarlo (toggle)
  if (openEditorRow === row) { closeEditor(); return; }

  openEditorRow = row;

  const item = appData.champions[champName][catKey][itemIdx];
  const ed = document.createElement('div');
  ed.className = 'item-editor';

  // Función helper para crear campo
  function field(labelTxt, inputEl) {
    const wrap = document.createElement('div');
    wrap.className = 'item-editor-field';
    const lbl = document.createElement('label');
    lbl.textContent = labelTxt;
    wrap.append(lbl, inputEl);
    return wrap;
  }

  // Nombre
  const inName = document.createElement('input');
  inName.type = 'text'; inName.value = item.name; inName.placeholder = 'Nombre';

  // Icono
  const inIcon = document.createElement('input');
  inIcon.type = 'text'; inIcon.value = item.icon || ''; inIcon.placeholder = 'URL icono';

  // Mover a tarjeta
  const selCat = document.createElement('select');
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.key; opt.textContent = c.label;
    if (c.key === catKey) opt.selected = true;
    selCat.appendChild(opt);
  });

  // Stats
  const inStats = document.createElement('textarea');
  inStats.rows = 4;
  inStats.value = (item.stats || []).join('\n');
  inStats.placeholder = '+60 Ability Power\n+300 Health\nPassive Burn: ...';

  // Descripción
  const inDesc = document.createElement('textarea');
  inDesc.rows = 3;
  inDesc.value = item.description || '';
  inDesc.placeholder = 'Análisis...';

  // Row 1: nombre + icono
  const row1 = document.createElement('div');
  row1.className = 'item-editor-row';
  row1.append(field('Nombre', inName), field('URL Icono', inIcon));

  // Row 2: stats
  const row2 = document.createElement('div');
  row2.className = 'item-editor-row';
  row2.append(field('Stats (una por línea)', inStats));

  // Row 3: descripción + mover a
  const row3 = document.createElement('div');
  row3.className = 'item-editor-row';
  row3.append(field('Análisis', inDesc), field('Mover a tarjeta', selCat));

  // Acciones
  const actions = document.createElement('div');
  actions.className = 'item-editor-actions';

  const btnCancel = document.createElement('button');
  btnCancel.className = 'btn-editor'; btnCancel.textContent = 'Cancelar';
  btnCancel.addEventListener('click', closeEditor);

  const btnSave = document.createElement('button');
  btnSave.className = 'btn-editor save'; btnSave.textContent = 'Guardar';
  btnSave.addEventListener('click', () => {
    const newName   = inName.value.trim();
    const newIcon   = inIcon.value.trim();
    const newStats  = inStats.value.split('\n').map(s => s.trim()).filter(Boolean);
    const newDesc   = inDesc.value.trim();
    const newCatKey = selCat.value;

    if (!newName) return toast('Pon el nombre, máquina');

    const updated = { id: item.id || newName.toLowerCase().replace(/[^a-z0-9]/g,'_'), name: newName, icon: newIcon, stats: newStats, description: newDesc };

    // Quitar de categoría actual
    appData.champions[champName][catKey].splice(itemIdx, 1);

    // Poner en nueva categoría (o la misma)
    if (!appData.champions[champName][newCatKey]) appData.champions[champName][newCatKey] = [];
    appData.champions[champName][newCatKey].push(updated);

    save();
    closeEditor();
    renderChampion(champName);
    toast(`${newName} guardado ✓`);
  });

  actions.append(btnCancel, btnSave);
  ed.append(row1, row2, row3, actions);

  // Insertar justo después del trigger (y antes de la nota)
  const trigger = row.querySelector('.item-trigger');
  trigger.after(ed);

  // Focus al nombre
  setTimeout(() => inName.focus(), 0);
}

/* RENDER FILA DE ÍTEM */
function renderItemRow(item, champName, catKey, idx) {
  const row = document.createElement('div');
  row.className = 'item-row';

  /* Trigger */
  const trigger = document.createElement('button');
  trigger.className = 'item-trigger';

  const icon    = makeIcon(item, 'item-icon');
  const name    = document.createElement('span');
  name.className = 'item-name'; name.textContent = item.name;

  const chevron = document.createElement('span');
  chevron.className = 'chevron'; chevron.setAttribute('aria-hidden','true'); chevron.textContent = '▼';

  // Botones editar / borrar (visibles en hover via CSS)
  const actions = document.createElement('div');
  actions.className = 'item-actions';

  const btnEdit = document.createElement('button');
  btnEdit.className = 'item-action-btn'; btnEdit.title = 'Editar'; btnEdit.textContent = '✎';
  btnEdit.addEventListener('click', e => {
    e.stopPropagation();
    openEditor(row, champName, catKey, idx);
  });

  const btnDel = document.createElement('button');
  btnDel.className = 'item-action-btn del'; btnDel.title = 'Eliminar'; btnDel.textContent = '✕';
  btnDel.addEventListener('click', e => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    appData.champions[champName][catKey].splice(idx, 1);
    save();
    renderChampion(champName);
    toast(`${item.name} eliminado`);
  });

  actions.append(btnEdit, btnDel);
  trigger.append(icon, name, chevron, actions);

  /* -- Panel nota (expandible) -- */
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
      
      // EXCLUSIVO CAMBIO SOLICITADO: Regex unificada para capturar números o las palabras Passive/Active
      const combinedMatch = stat.match(/^((?:Passive|Active|Unique Passive|Unique Active)\s*:|[+\-\d%\s\.]+(?:Move Speed|Attack Damage|Ability Power|Health|Mana|Movement Speed|Attack Speed|Armor|Magic Resistance|Ability Haste|Tenacity|Magic Penetration|Omnivamp|Base Health Regeneration|Summoner Spell Haste)?)(.*)/i);
      
      if (combinedMatch) {
        const sp = document.createElement('span'); sp.className = 'stat-value'; sp.textContent = combinedMatch[1];
        li.append(sp, document.createTextNode(combinedMatch[2]));
      } else { 
        li.textContent = stat; 
      }
      statsList.appendChild(li);
    });
    
    statsSection.appendChild(statsList);
    panel.appendChild(statsSection);
  }

  const hasDesc = item.description && item.description.trim().length > 0;
  const analysisSection = document.createElement('div'); analysisSection.className = 'item-panel-analysis' + (hasStats ? ' has-stats' : '');
  const analysisLabel   = document.createElement('div'); analysisLabel.className = 'item-panel-label'; analysisLabel.textContent = 'Análisis';
  const analysisBody    = document.createElement('p');   analysisBody.className = 'item-analysis-body' + (hasDesc ? '' : ' is-empty');
  analysisBody.textContent = hasDesc ? item.description : 'no hay datos :(';
  analysisSection.append(analysisLabel, analysisBody);
  panel.appendChild(analysisSection);

  noteInner.appendChild(panel);
  noteWrap.appendChild(noteInner);
  row.append(trigger, noteWrap);

  trigger.addEventListener('click', () => toggleNote(row));
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
  lbl.className = 'card-label';
  lbl.textContent = config.label;
  lbl.contentEditable = 'true';
  lbl.spellcheck = false;

  // Guardar al perder foco o Enter
  const saveLabel = () => {
    const newLabel = lbl.textContent.trim();
    if (!newLabel) { lbl.textContent = config.label; return; }
    config.label = newLabel;
    save();
    toast(`Tarjeta renombrada: ${newLabel}`);
  };

  lbl.addEventListener('blur', saveLabel);
  lbl.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); lbl.blur(); }
    if (e.key === 'Escape') { lbl.textContent = config.label; lbl.blur(); }
    e.stopPropagation(); // no propagar al trigger
  });
  lbl.addEventListener('click', e => e.stopPropagation());

  /* Botón + añadir ítem */
  const addBtn = document.createElement('button');
  addBtn.className = 'card-add-btn'; addBtn.title = 'Añadir ítem'; addBtn.textContent = '+';

  hdr.append(lbl, addBtn);

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
  const addForm = buildAddItemForm(champName, config.key, card, body);
  body.appendChild(addForm);

  addBtn.addEventListener('click', () => {
    addForm.classList.toggle('is-open');
    if (addForm.classList.contains('is-open')) {
      addForm.querySelector('input[data-field="name"]').focus();
    }
  });

  card.append(hdr, body);
  return card;
}

/* FORMULARIO ADD ITEM INLINE */
function buildAddItemForm(champName, catKey, card, body) {
  const form = document.createElement('div');
  form.className = 'add-item-form';

  function field(labelTxt, inputEl) {
    const wrap = document.createElement('div');
    wrap.className = 'item-editor-field';
    const lbl = document.createElement('label');
    lbl.textContent = labelTxt;
    wrap.append(lbl, inputEl);
    return wrap;
  }

  const inName = document.createElement('input');
  inName.type = 'text'; inName.placeholder = 'Nombre del ítem';
  inName.dataset.field = 'name';

  const inIcon = document.createElement('input');
  inIcon.type = 'text'; inIcon.placeholder = 'URL icono';

  const inStats = document.createElement('textarea');
  inStats.rows = 3; inStats.placeholder = '+60 Ability Power...';

  const inDesc = document.createElement('textarea');
  inDesc.rows = 2; inDesc.placeholder = 'Análisis...';

  const row1 = document.createElement('div'); row1.className = 'item-editor-row';
  row1.append(field('Nombre', inName), field('URL Icono', inIcon));

  const row2 = document.createElement('div'); row2.className = 'item-editor-row';
  row2.append(field('Stats (una por línea)', inStats));

  const row3 = document.createElement('div'); row3.className = 'item-editor-row';
  row3.append(field('Análisis', inDesc));

  const actions = document.createElement('div'); actions.className = 'item-editor-actions';

  const btnCancel = document.createElement('button');
  btnCancel.className = 'btn-editor'; btnCancel.textContent = 'Cancelar';
  btnCancel.addEventListener('click', () => { form.classList.remove('is-open'); clearAddForm(); });

  const btnAdd = document.createElement('button');
  btnAdd.className = 'btn-editor save'; btnAdd.textContent = 'Añadir';
  btnAdd.addEventListener('click', () => {
    const name = inName.value.trim();
    if (!name) return toast('Pon el nombre, máquina');
    const newItem = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g,'_'),
      name,
      icon: inIcon.value.trim(),
      stats: inStats.value.split('\n').map(s=>s.trim()).filter(Boolean),
      description: inDesc.value.trim()
    };
    if (!appData.champions[champName][catKey]) appData.champions[champName][catKey] = [];
    appData.champions[champName][catKey].push(newItem);
    save();
    form.classList.remove('is-open');
    clearAddForm();
    renderChampion(champName);
    toast(`${name} añadido ✓`);
  });

  function clearAddForm() {
    inName.value = ''; inIcon.value = ''; inStats.value = ''; inDesc.value = '';
  }

  actions.append(btnCancel, btnAdd);
  form.append(row1, row2, row3, actions);
  return form;
}

/* RENDER CAMPEÓN */
function renderChampion(name) {
  const champ = appData.champions[name];
  if (!champ) return;
  currentChamp = name;
  openNoteRow  = null;
  openEditorRow = null;

  $hero.innerHTML = '';
  const hName = document.createElement('h1'); hName.className = 'hero-name'; hName.textContent = name;
  const hRole = document.createElement('span'); hRole.className = 'hero-role'; hRole.textContent = champ.role || '';
  $hero.append(hName, hRole);

  $grid.innerHTML = '';
  categories.forEach(cfg => $grid.appendChild(renderCard(cfg, name)));
}

function selectChampion(name) {
  document.querySelectorAll('.champ-bubble').forEach(b => {
    const a = b.dataset.champion === name;
    b.classList.toggle('active', a);
    b.classList.toggle('is-collapsed', !a);
  });
  renderChampion(name);
}

/* SELECTOR DE BURBUJAS */
function makeBubblePh(name) {
  const ph = document.createElement('div'); ph.className = 'bubble-avatar-ph';
  ph.textContent = name[0].toUpperCase(); return ph;
}

function renderSelector() {
  $sel.innerHTML = '';
  Object.keys(appData.champions).forEach(name => {
    const champ  = appData.champions[name];
    const bubble = document.createElement('button');
    bubble.className = 'champ-bubble is-collapsed';
    bubble.dataset.champion = name; bubble.title = name;

    let avatar;
    if (champ.icon) {
      avatar = document.createElement('img');
      avatar.className = 'bubble-avatar'; avatar.src = champ.icon; avatar.alt = name;
      avatar.onerror = () => avatar.replaceWith(makeBubblePh(name));
    } else { avatar = makeBubblePh(name); }

    const label = document.createElement('span'); label.className = 'bubble-name'; label.textContent = name;
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
  $modal.setAttribute('aria-hidden','false');
  $modal.classList.add('is-open');
  populateChampList();
}

function closeAdmin() {
  $modal.setAttribute('aria-hidden','true');
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
    const row = document.createElement('div'); row.className = 'list-row';

    let av;
    if (champ.icon) {
      av = document.createElement('img'); av.className = 'list-row-icon'; av.src = champ.icon; av.alt = name;
      av.onerror = () => av.replaceWith(listPh(name));
    } else av = listPh(name);

    const info = document.createElement('div'); info.className = 'list-row-info';
    info.innerHTML = `<div class="list-row-name">${name}</div><div class="list-row-sub">${champ.role||'sin rol'}</div>`;

    const acts = document.createElement('div'); acts.className = 'list-row-actions';

    const btnEdit = document.createElement('button'); btnEdit.className = 'btn-form'; btnEdit.textContent = 'Editar';
    btnEdit.addEventListener('click', () => {
      document.getElementById('champ-name').value = name;
      document.getElementById('champ-role').value = champ.role || '';
      document.getElementById('champ-icon').value = champ.icon || '';
      document.getElementById('champ-name').dataset.editing = name;
    });

    const btnDel = document.createElement('button'); btnDel.className = 'btn-form danger'; btnDel.textContent = 'Borrar';
    btnDel.addEventListener('click', () => {
      if (!confirm(`¿Borrar ${name} y todos sus ítems?`)) return;
      delete appData.champions[name];
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
  const ph = document.createElement('div'); ph.className = 'list-row-icon-ph';
  ph.textContent = name[0].toUpperCase(); return ph;
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
/* no va, me lo tira el navegador como potencial amenaza de seguridad, aunque el código es inofensivo y se ejecuta localmente... */
document.getElementById('btn-export').addEventListener('click', () => {
  const payload = { champions: appData.champions, categories };
  const js = `/* LoL Builds Export — ${new Date().toISOString().slice(0,10)} */\nconst lolData = ${JSON.stringify(payload, null, 2)};\n`;
  const a  = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([js], { type: 'text/javascript' })),
    download: 'lolbuilds_export.js'
  });
  a.click(); URL.revokeObjectURL(a.href);
  toast('Exportado ✓');
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
        const m = raw.match(/const\s+lolData\s*=\s*(\{[\s\S]*?\});\s*$/m);
        if (!m) throw new Error('Formato no reconocido');
        parsed = JSON.parse(m[1]);
      }
      if (!parsed.champions) throw new Error('Sin datos de campeones');
      appData    = { champions: parsed.champions };
      categories = parsed.categories || clone(DEFAULT_CATEGORIES);
      currentChamp = null;
      save(); fullRender(); closeAdmin();
      toast('Importado ✓');
    } catch(err) { toast('Error: ' + err.message); }
  };
  reader.readAsText(file);
});

/* INIT */
document.addEventListener('DOMContentLoaded', fullRender);

/* BOTÓN DE DESCARGA
*/

const btnExportarManual = document.getElementById('btnExportar');

if (btnExportarManual) {
    btnExportarManual.addEventListener('click', () => {
        try {
            // Usamos 'appData' que es la variable global que ya maneja el main.js
            // Y le añadimos las categorías para que el archivo esté completo.
            const payload = {
                champions: appData.champions,
                categories: categories 
            };

            const contenido = `export const lolData = ${JSON.stringify(payload, null, 4)};`;
            
            const blob = new Blob([contenido], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            a.href = url;
            a.download = 'data.js'; 
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            console.log("Exportación exitosa");
        } catch (error) {
            console.error("Error al exportar:", error);
            alert("Hubo un problema al generar el archivo");
        }
    });
}