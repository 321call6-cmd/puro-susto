/* ============================================================
   PURO SUSTO — Halloween 2026 · app.js
   ============================================================ */

/* ------------------------------------------------------------
   CONFIGURACIÓN — lo único que hay que editar a mano.
   Pega aquí el URL /exec del Apps Script cuando esté desplegado
   (Implementar → Nueva implementación → App web →
    Ejecutar como: Yo · Acceso: Cualquier persona).
   ------------------------------------------------------------ */
const API_URL = 'https://script.google.com/macros/s/AKfycbwyaHDTp_BWN_48Pk7bFielSHAAa3QLQ1nwT5T9lZuwkPMQD-zVzx-iF4N5Jy_L24GfYw/exec';

/* WhatsApp de los anfitriones para sugerir juegos / dudas.
   Solo dígitos con lada internacional, ej. '526641234567' */
const WHATSAPP_ANFITRIONES = '';

/* Estos dos pueden venir de la pestaña Config (keys jam_url / album_url);
   si se llenan aquí, ganan las constantes. */
const JAM_URL_MANUAL = '';
const ALBUM_URL_MANUAL = '';

/* Fallback de gastos por si la API aún no responde (mismos datos
   que la pestaña Gastos al día de hoy). */
const FALLBACK_GASTOS = [
  { concepto: 'Palapa / salón', tipo: 'FIJO', monto: 500 },
  { concepto: 'Sillas y mesas', tipo: 'FIJO', monto: 1000 },
  { concepto: 'Trofeos esqueleto (6)', tipo: 'FIJO', monto: 436 },
  { concepto: 'Comida', tipo: 'POR PERSONA', monto: 300 },
];

const FECHA_FIESTA = new Date('2026-10-31T18:00:00-07:00');
const FECHA_FIN = new Date('2026-11-01T01:00:00-07:00');

const CATEGORIAS_VOTO = [
  { id: 'mejor', nombre: 'Mejor disfraz 💰 (gana el bote)' },
  { id: 'creativo', nombre: 'Más creativo' },
  { id: 'ridiculo', nombre: 'Más ridículo' },
  { id: 'terrorifico', nombre: 'Más terrorífico' },
];

/* ------------------------------------------------------------ */
const $ = (id) => document.getElementById(id);
const mxn = (n) => '$' + Math.ceil(n).toLocaleString('es-MX');

let confirmadosCache = [];

/* ---------- Countdown ---------- */
function tickCountdown() {
  const ahora = new Date();
  let diff = FECHA_FIESTA - ahora;
  if (diff <= 0) {
    const cont = $('countdown');
    cont.style.gridTemplateColumns = '1fr';
    cont.innerHTML =
      ahora < FECHA_FIN
        ? '<div class="count-cell" style="padding:22px 28px;"><b>¡ES HOY!</b><span>La fiesta ya empezó 🎃</span></div>'
        : '<div class="count-cell" style="padding:22px 28px;"><b>FIN</b><span>Nos vemos el próximo año</span></div>';
    clearInterval(cdTimer);
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;
  $('cd-d').textContent = d;
  $('cd-h').textContent = String(h).padStart(2, '0');
  $('cd-m').textContent = String(m).padStart(2, '0');
  $('cd-s').textContent = String(s).padStart(2, '0');
}
const cdTimer = setInterval(tickCountdown, 1000);
tickCountdown();

/* ---------- Agregar a calendario (.ics + Google Calendar) ---------- */
$('btn-calendario').addEventListener('click', (e) => {
  e.preventDefault();
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PURO SUSTO//Halloween 2026//ES',
    'BEGIN:VEVENT',
    'UID:puro-susto-2026@puro-susto',
    'DTSTAMP:20260806T000000Z',
    'DTSTART:20261101T010000Z',
    'DTEND:20261101T080000Z',
    'SUMMARY:PURO SUSTO 🎃 Fiesta de Halloween',
    'DESCRIPTION:Puro susto. Pura fiesta. Disfraz obligatorio (sin disfraz\\, $200 al bote). Detalles y confirmación en el sitio.',
    'LOCATION:Salón Castilla\\, Blvd. Viñas del Mar\\, Tijuana',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Mañana es PURO SUSTO — ¿ya tienes disfraz?',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'puro-susto-2026.ics';
  a.click();
  URL.revokeObjectURL(a.href);
});

/* ---------- Pasar la invitación ----------
   La invitación oficial ES la tarjeta que genera este link al
   compartirse (og-image + título + descripción). Aquí solo
   pasamos el link pelón: WhatsApp arma la tarjeta solo. */
$('btn-compartir').addEventListener('click', async (e) => {
  e.preventDefault();
  const url = location.origin + '/';
  const texto = '🎃 Estás invitado a PURO SUSTO — 31 de octubre, Tijuana. Confirma aquí… si te atreves:';
  if (navigator.share) {
    try { await navigator.share({ text: texto, url }); return; } catch (_) { /* cancelado */ }
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`, '_blank', 'noopener');
  }
});

/* ---------- Helpers de API ---------- */
async function apiGet(action) {
  if (!API_URL) return null;
  try {
    const r = await fetch(`${API_URL}?action=${encodeURIComponent(action)}`, { redirect: 'follow' });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (err) {
    console.warn('[PURO SUSTO] API GET falló:', action, err);
    return null;
  }
}

async function apiPost(payload) {
  if (!API_URL) return null;
  try {
    // text/plain evita el preflight CORS con Apps Script
    const r = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    return await r.json();
  } catch (err) {
    console.warn('[PURO SUSTO] API POST falló:', err);
    return null;
  }
}

/* ---------- Gastos + cuota ---------- */
function pintarGastos(gastos, personas) {
  const tbody = $('tabla-gastos');
  const fijos = gastos.filter((g) => String(g.tipo).toUpperCase().startsWith('FIJO'));
  const porPersona = gastos.filter((g) => !String(g.tipo).toUpperCase().startsWith('FIJO'));
  const totalFijo = fijos.reduce((s, g) => s + Number(g.monto || 0), 0);
  const totalPP = porPersona.reduce((s, g) => s + Number(g.monto || 0), 0);

  tbody.innerHTML =
    gastos
      .map(
        (g) => `<tr>
          <td>${escapeHtml(g.concepto)}</td>
          <td class="niebla">${String(g.tipo).toUpperCase().startsWith('FIJO') ? 'Fijo · se divide' : 'Por persona'}</td>
          <td class="num">${mxn(g.monto)}${String(g.tipo).toUpperCase().startsWith('FIJO') ? '' : ' c/u'}</td>
        </tr>`
      )
      .join('') +
    `<tr class="total"><td>Total fijo</td><td></td><td class="num">${mxn(totalFijo)}</td></tr>`;

  const formula = personas
    ? `${mxn(totalFijo)} ÷ ${personas} personas + ${mxn(totalPP)} = ${mxn(totalFijo / personas + totalPP)} por persona`
    : `${mxn(totalFijo)} ÷ confirmados + ${mxn(totalPP)} por persona`;
  $('cuota-formula').textContent = formula;

  return { totalFijo, totalPP };
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- Confirmados ---------- */
function pintarConfirmados(lista) {
  const cont = $('lista-confirmados');
  if (!lista || !lista.length) {
    cont.innerHTML = '<span class="chip niebla">Aún no cae nadie… sé el primero 🩸</span>';
    return 0;
  }
  cont.innerHTML = lista
    .map((c) => {
      const n = Number(c.acompanantes || c.acompañantes || 0);
      return `<span class="chip">${escapeHtml(c.nombre || c)}${n ? ` <span class="mas">+${n}</span>` : ''}</span>`;
    })
    .join('');
  return lista.reduce((s, c) => s + 1 + Number(c.acompanantes || c.acompañantes || 0), 0);
}

/* ---------- Carga principal de datos ---------- */
async function cargarDatos() {
  const [config, gastos, confirmados, cuota, bote] = await Promise.all([
    apiGet('config'),
    apiGet('gastos'),
    apiGet('confirmados'),
    apiGet('cuota'),
    apiGet('bote'),
  ]);

  // Confirmados
  const lista = Array.isArray(confirmados) ? confirmados : confirmados?.confirmados || [];
  confirmadosCache = lista;
  const personas = pintarConfirmados(lista);
  $('stat-personas').textContent = personas || '0';
  if (lista.length) {
    $('ultima-actualizacion').textContent = `Lista pública · actualizada al abrir la página`;
  } else if (!API_URL) {
    $('ultima-actualizacion').textContent = 'La lista en vivo se conecta muy pronto';
  }

  // Gastos
  const listaGastos = Array.isArray(gastos) ? gastos : gastos?.gastos || FALLBACK_GASTOS;
  const { totalFijo, totalPP } = pintarGastos(listaGastos.length ? listaGastos : FALLBACK_GASTOS, personas);

  // Cuota: la API manda; si no, se calcula aquí
  const cuotaApi = Number(cuota?.cuota || cuota?.monto || 0);
  const cuotaCalc = personas ? totalFijo / personas + totalPP : 0;
  $('stat-cuota').textContent = cuotaApi ? mxn(cuotaApi) : personas ? mxn(cuotaCalc) : '—';

  // Bote del disfraz
  const boteVal = Number(bote?.bote || bote?.monto || 0);
  $('stat-bote').textContent = boteVal ? mxn(boteVal) : '$0';

  // Config: links y votación
  const cfg = config || {};
  const jamUrl = JAM_URL_MANUAL || cfg.jam_url || cfg.jamUrl || '';
  if (jamUrl) {
    $('btn-jam').href = jamUrl;
    $('btn-jam').classList.remove('hidden');
    $('jam-dormido').classList.add('hidden');
  }
  const albumUrl = ALBUM_URL_MANUAL || cfg.album_url || cfg.albumUrl || '';
  if (albumUrl) {
    $('btn-album').href = albumUrl;
    $('btn-album').classList.remove('hidden');
    $('album-dormido').classList.add('hidden');
  }

  const votacionOn = ['on', 'true', 'si', 'sí', '1', 'abierta'].includes(
    String(cfg.votacion ?? cfg.votacion_activa ?? '').toLowerCase()
  );
  if (votacionOn) despertarVotacion();
}

/* ---------- WhatsApp: sugerir juego ---------- */
(function initWhats() {
  const btn = $('btn-sugerir-juego');
  const texto = encodeURIComponent('🎃 PURO SUSTO — propongo un juego para la noche: ');
  btn.href = WHATSAPP_ANFITRIONES
    ? `https://wa.me/${WHATSAPP_ANFITRIONES}?text=${texto}`
    : `https://wa.me/?text=${texto}`;
})();

/* ---------- RSVP ---------- */
$('f-acomp').addEventListener('change', () => {
  const n = Number($('f-acomp').value);
  $('l-acomp-nombres').classList.toggle('hidden', !n);
  $('f-acomp-nombres').classList.toggle('hidden', !n);
});

$('form-rsvp').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('rsvp-msg');
  const btn = $('btn-rsvp');
  msg.className = 'form-msg';
  msg.textContent = '';

  if (!API_URL) {
    msg.innerHTML = 'Las confirmaciones se abren en unos días. Mientras tanto, aparta la fecha ☠️';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Invocando…';
  const payload = {
    action: 'rsvp',
    nombre: $('f-nombre').value.trim(),
    whatsapp: $('f-whats').value.trim(),
    acompanantes: Number($('f-acomp').value),
    acompanantes_nombres: $('f-acomp-nombres').value.trim(),
  };
  const res = await apiPost(payload);
  btn.disabled = false;
  btn.textContent = '¡Voy!';

  if (!res) {
    msg.className = 'form-msg error';
    msg.textContent = 'Algo salió mal en el inframundo. Intenta de nuevo o confirma por WhatsApp.';
    return;
  }
  if (res.status === 'duplicado' || res.duplicado) {
    msg.innerHTML = `Ya estabas en la lista, ${escapeHtml(payload.nombre)} — tranquilo, el susto no se duplica. <span class="badge-vas">¡Vas!</span>`;
  } else if (res.ok || res.status === 'nuevo') {
    msg.innerHTML = `Listo, ${escapeHtml(payload.nombre)}. Te escribimos por WhatsApp para el pago. <span class="badge-vas">¡Vas!</span><br><span class="niebla" style="font-size:15px;">¿Falta alguien? Pásale la invitación con el botón de arriba.</span>`;
    $('form-rsvp').reset();
    $('l-acomp-nombres').classList.add('hidden');
    $('f-acomp-nombres').classList.add('hidden');
    cargarDatos(); // refresca lista y cuota en vivo
  } else {
    msg.className = 'form-msg error';
    msg.textContent = res.error || 'No se pudo confirmar. Intenta de nuevo.';
  }
});

/* ---------- Votación ---------- */
function despertarVotacion() {
  $('votacion-dormida').classList.add('hidden');
  $('votacion-activa').classList.remove('hidden');

  const cont = $('categorias-voto');
  cont.innerHTML = CATEGORIAS_VOTO.map(
    (cat) => `
    <div class="categoria-voto" data-cat="${cat.id}">
      <h3 style="font-size:20px;">${cat.nombre}</h3>
      <div class="candidatos">
        ${confirmadosCache
          .map((c) => `<button type="button" class="candidato" data-nombre="${escapeHtml(c.nombre || c)}">${escapeHtml(c.nombre || c)}</button>`)
          .join('') || '<span class="niebla">Sin confirmados para votar</span>'}
      </div>
    </div>`
  ).join('');

  cont.querySelectorAll('.categoria-voto').forEach((catEl) => {
    catEl.addEventListener('click', (e) => {
      const b = e.target.closest('.candidato');
      if (!b) return;
      catEl.querySelectorAll('.candidato').forEach((x) => x.classList.remove('sel'));
      b.classList.add('sel');
    });
  });
}

$('btn-votar').addEventListener('click', async () => {
  const msg = $('voto-msg');
  msg.className = 'form-msg';
  const votante = $('v-votante').value.trim();
  if (!votante) {
    msg.className = 'form-msg error';
    msg.textContent = 'Pon tu nombre para votar.';
    return;
  }
  const votos = [];
  document.querySelectorAll('.categoria-voto').forEach((catEl) => {
    const sel = catEl.querySelector('.candidato.sel');
    if (sel) votos.push({ categoria: catEl.dataset.cat, candidato: sel.dataset.nombre });
  });
  if (!votos.length) {
    msg.className = 'form-msg error';
    msg.textContent = 'Elige al menos un candidato.';
    return;
  }
  $('btn-votar').disabled = true;
  let oks = 0;
  for (const v of votos) {
    const res = await apiPost({ action: 'voto', votante, ...v });
    if (res && (res.ok || res.status === 'ok')) oks++;
  }
  $('btn-votar').disabled = false;
  msg.innerHTML = oks
    ? `${oks} voto(s) registrados. <span class="badge-vas">Contado</span>`
    : 'No se registraron votos (¿ya habías votado?).';
});

/* ---------- Arranque ---------- */
cargarDatos();
