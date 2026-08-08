/* ============================================================
   PURO SUSTO — Halloween 2026 · app.js
   Corre en las 3 páginas (index, la-noche, premios): cada
   bloque se activa solo si sus elementos existen en la página.
   ============================================================ */

/* ---------------- CONFIGURACIÓN ---------------- */
const API_URL = 'https://script.google.com/macros/s/AKfycbwyaHDTp_BWN_48Pk7bFielSHAAa3QLQ1nwT5T9lZuwkPMQD-zVzx-iF4N5Jy_L24GfYw/exec';

/* WhatsApp de los anfitriones (solo dígitos con lada, ej. '526641234567').
   Cada botón va a quien le toca, para que nadie se sature:
     · DUDAS  → dinero y logística (cuánto pago, cómo lo mando, llevo a alguien)
     · JUEGOS → sugerencias para la noche, puro tema divertido
   Si alguno queda vacío, el botón abre WhatsApp sin destinatario. */
const WHATSAPP_DUDAS  = '526631077285'; // Sandy
const WHATSAPP_JUEGOS = '525518103139'; // Pau

/* Si se llenan aquí, ganan sobre la pestaña Config (jam_url / album_url) */
const JAM_URL_MANUAL = '';
const ALBUM_URL_MANUAL = '';

const FALLBACK_GASTOS = [
  { concepto: 'Palapa / salón', tipo: 'FIJO', monto: 500 },
  { concepto: 'Sillas y mesas', tipo: 'FIJO', monto: 1000 },
  { concepto: 'Trofeos esqueleto (6)', tipo: 'FIJO', monto: 436 },
  { concepto: 'Comida', tipo: 'POR PERSONA', monto: 300 },
];

const FECHA_FIESTA = new Date('2026-10-31T18:00:00-07:00');
const FECHA_FIN = new Date('2026-11-01T01:00:00-07:00');

const CATEGORIAS_VOTO = [
  { id: 'mejor', clave: 'prem.catMejor' },
  { id: 'creativo', clave: 'prem.catCreativo' },
  { id: 'ridiculo', clave: 'prem.catRidiculo' },
  { id: 'terrorifico', clave: 'prem.catTerrorifico' },
];

/* ---------------- Helpers ---------------- */
const $ = (id) => document.getElementById(id);
const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };
const setText = (id, txt) => { const el = $(id); if (el) el.textContent = txt; };
/* Tipo de cambio: se sobreescribe con el parámetro de Config si existe,
   para poder actualizarlo sin tocar código. 0 = no mostrar aproximado. */
let TIPO_CAMBIO_USD = 17;

/* Todos los montos llevan MXN. Un americano que lee "$2,266" pelón entiende
   dos mil dólares y se le va la sangre de la cara. */
const mxn = (n) => '$' + Math.ceil(n).toLocaleString('es-MX') + ' MXN';

/* Sin sufijo: para la tabla de gastos, donde el encabezado ya dice "(MXN)".
   Repetir MXN en cada celda partía los montos en dos renglones. */
const mxnCorto = (n) => '$' + Math.ceil(n).toLocaleString('es-MX');

/* Solo el aproximado en dólares, o '' si no aplica. */
function usdAprox(n) {
  if (idioma() !== 'en' || !TIPO_CAMBIO_USD) return '';
  return '≈US$' + Math.round(Number(n) / TIPO_CAMBIO_USD).toLocaleString('en-US');
}

/* Pinta un tile: el monto grande y, debajo y en chico, el aproximado en USD.
   Meterlo en la misma línea desbordaba el recuadro en inglés. */
function pintarStat(id, monto) {
  const el = $(id);
  if (!el) return;
  const usd = usdAprox(monto);
  el.innerHTML = escapeHtml(mxn(monto)) + (usd ? `<small>${escapeHtml(usd)}</small>` : '');
}

/* Igual que mxn(), pero en inglés agrega el aproximado en dólares.
   Solo para los números grandes (cuota y premio) — en la tabla sería ruido. */
function mxnUsd(n) {
  const base = mxn(n);
  if (idioma() !== 'en' || !TIPO_CAMBIO_USD) return base;
  return base + ' (≈US$' + Math.round(Number(n) / TIPO_CAMBIO_USD).toLocaleString('en-US') + ')';
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

let confirmadosCache = [];

/* ---------------- Countdown (solo index) ---------------- */
if ($('cd-d')) {
  const tick = () => {
    const ahora = new Date();
    const diff = FECHA_FIESTA - ahora;
    if (diff <= 0) {
      const cont = $('countdown');
      cont.style.gridTemplateColumns = '1fr';
      cont.innerHTML =
        ahora < FECHA_FIN
          ? '<div class="count-cell" style="padding:22px 28px;">' + t('cd.hoy') + '</div>'
          : '<div class="count-cell" style="padding:22px 28px;">' + t('cd.fin') + '</div>';
      clearInterval(timer);
      return;
    }
    setText('cd-d', Math.floor(diff / 86400000));
    setText('cd-h', String(Math.floor(diff / 3600000) % 24).padStart(2, '0'));
    setText('cd-m', String(Math.floor(diff / 60000) % 60).padStart(2, '0'));
    setText('cd-s', String(Math.floor(diff / 1000) % 60).padStart(2, '0'));
  };
  const timer = setInterval(tick, 1000);
  tick();
}

/* ---------------- Agendar (.ics) ---------------- */
on('btn-calendario', 'click', (e) => {
  e.preventDefault();
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PURO SUSTO//Halloween 2026//ES',
    'BEGIN:VEVENT', 'UID:puro-susto-2026@puro-susto', 'DTSTAMP:20260806T000000Z',
    'DTSTART:20261101T010000Z', 'DTEND:20261101T080000Z',
    'SUMMARY:PURO SUSTO 🎃 Fiesta de Halloween',
    'DESCRIPTION:Puro susto. Pura fiesta. Disfraz obligatorio (sin disfraz\\, $200 al premio). Detalles y confirmación en el sitio.',
    'LOCATION:Salón Castilla\\, Blvd. Viñas del Mar\\, Tijuana',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY',
    'DESCRIPTION:Mañana es PURO SUSTO — ¿ya tienes disfraz?', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'puro-susto-2026.ics';
  a.click();
  URL.revokeObjectURL(a.href);
});

/* ---------------- Pasar la invitación ----------------
   El link ES la invitación: WhatsApp genera la tarjeta con el
   og-image al compartirlo pelón. */
on('btn-compartir', 'click', async (e) => {
  e.preventDefault();
  const url = location.origin + (idioma() === 'en' ? '/en/' : '/');
  const texto = t('compartir.texto');
  if (navigator.share) {
    try { await navigator.share({ text: texto, url }); return; } catch (_) { /* cancelado */ }
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`, '_blank', 'noopener');
  }
});

/* ---------------- WhatsApp: juegos y dudas ---------------- */
function linkWhats(numero, texto) {
  // OJO: no llamar 't' a esta variable — taparía la función t() de i18n.js.
  const txt = encodeURIComponent(texto);
  return numero ? `https://wa.me/${numero}?text=${txt}` : `https://wa.me/?text=${txt}`;
}

/* ---------------- Modal de confirmación ---------------- */
function abrirModal(titulo, cuerpoHtml) {
  const modal = $('modal-rsvp');
  if (!modal) return false;
  setText('modal-titulo', titulo);
  $('modal-cuerpo').innerHTML = cuerpoHtml;
  modal.classList.remove('hidden');

  /* Bloquea el scroll del fondo. En desktop, quitar la barra de scroll ensancha
     la página y todo brinca a la derecha: se compensa con un padding del mismo
     ancho que la barra. En móvil la barra es flotante y esto vale 0. */
  const anchoBarra = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (anchoBarra > 0) document.body.style.paddingRight = anchoBarra + 'px';

  $('modal-cerrar')?.focus();
  return true;
}

function cerrarModal() {
  const modal = $('modal-rsvp');
  if (!modal || modal.classList.contains('hidden')) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

on('modal-cerrar', 'click', cerrarModal);
// Clic en el fondo (fuera del panel) también cierra.
$('modal-rsvp')?.addEventListener('click', (e) => { if (e.target.id === 'modal-rsvp') cerrarModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });

function initWhats() {
  const juego = $('btn-sugerir-juego');
  if (juego) juego.href = linkWhats(WHATSAPP_JUEGOS, t('wa.juego'));

  const dudas = $('btn-dudas');
  if (dudas) dudas.href = linkWhats(WHATSAPP_DUDAS, t('wa.dudas'));
}
initWhats();

/* ---------------- API ---------------- */
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

/* ---------------- Datos en vivo ---------------- */
function pintarGastos(gastos, personas) {
  const tbody = $('tabla-gastos');
  const fijos = gastos.filter((g) => String(g.tipo).toUpperCase().startsWith('FIJO'));
  const porPersona = gastos.filter((g) => !String(g.tipo).toUpperCase().startsWith('FIJO'));
  const totalFijo = fijos.reduce((s, g) => s + Number(g.monto || 0), 0);
  const totalPP = porPersona.reduce((s, g) => s + Number(g.monto || 0), 0);

  if (tbody) {
    tbody.innerHTML =
      gastos.map((g) => {
        const fijo = String(g.tipo).toUpperCase().startsWith('FIJO');
        return `<tr>
          <td>${escapeHtml(g.concepto)}</td>
          <td class="niebla">${fijo ? t('gastos.fijo') : t('gastos.porPersona')}</td>
          <td class="num">${mxnCorto(g.monto)}${fijo ? '' : t('gastos.cu')}</td>
        </tr>`;
      }).join('') +
      `<tr class="total"><td>${t('gastos.totalFijo')}</td><td></td><td class="num">${mxnCorto(totalFijo)}</td></tr>`;
  }

  const formula = $('cuota-formula');
  if (formula) {
    formula.textContent = personas
      ? t('cuota.formula', { fijo: mxn(totalFijo), personas, porPersona: mxn(totalPP), cuota: mxnUsd(totalFijo / personas + totalPP) })
      : t('cuota.formulaVacia', { fijo: mxn(totalFijo), porPersona: mxn(totalPP) });
  }
  return { totalFijo, totalPP };
}

/* Aplana la lista en PERSONAS: quien confirmó + cada acompañante con nombre.
   Los acompañantes sin nombre capturado quedan como "Invitado de X" para que
   igual se puedan votar el 31. */
function todasLasPersonas(lista) {
  const out = [];
  (lista || []).forEach((c) => {
    const anfitrion = c.nombre || String(c);
    out.push({ nombre: anfitrion, invitadoPor: null });

    const nombres = (c.acompanantes_nombres || []).filter(Boolean);
    nombres.forEach((n) => out.push({ nombre: n, invitadoPor: anfitrion }));

    const faltan = Number(c.acompanantes || 0) - nombres.length;
    for (let i = 1; i <= faltan; i++) {
      out.push({ nombre: t('conf.invitadoDe', { nombre: anfitrion }), invitadoPor: anfitrion });
    }
  });
  return out;
}

function pintarConfirmados(lista) {
  const cont = $('lista-confirmados');
  const personas = todasLasPersonas(lista);
  if (cont) {
    cont.innerHTML = personas.length
      ? personas.map((p) =>
          p.invitadoPor
            ? `<span class="chip niebla" title="${escapeHtml(t('conf.invitadoPor', { nombre: p.invitadoPor }))}">${escapeHtml(p.nombre)}</span>`
            : `<span class="chip">${escapeHtml(p.nombre)}</span>`
        ).join('')
      : `<span class="chip niebla">${escapeHtml(t('conf.vacio'))}</span>`;
  }
  return personas.length;
}

async function cargarDatos() {
  // Solo pide lo que la página actual necesita
  const necesitaStats = !!($('stat-personas') || $('tabla-gastos'));
  const necesitaConfig = !!($('btn-jam') || $('btn-album') || $('votacion-dormida'));
  const necesitaConfirmados = necesitaStats || !!$('votacion-dormida');

  const [config, gastos, confirmados, cuota, bote] = await Promise.all([
    necesitaConfig ? apiGet('config') : null,
    necesitaStats ? apiGet('gastos') : null,
    necesitaConfirmados ? apiGet('confirmados') : null,
    necesitaStats ? apiGet('cuota') : null,
    necesitaStats ? apiGet('bote') : null,
  ]);

  if (necesitaConfirmados) {
    const lista = Array.isArray(confirmados) ? confirmados : confirmados?.confirmados || [];
    confirmadosCache = lista;
    const personas = pintarConfirmados(lista);
    setText('stat-personas', personas || '0');
    if (!API_URL) setText('ultima-actualizacion', 'La lista en vivo se conecta muy pronto');

    if (necesitaStats) {
      const listaGastos = Array.isArray(gastos) ? gastos : gastos?.gastos || [];
      const { totalFijo, totalPP } = pintarGastos(listaGastos.length ? listaGastos : FALLBACK_GASTOS, personas);
      const cuotaApi = Number(cuota?.cuota || 0);
      const cuotaCalc = personas ? totalFijo / personas + totalPP : 0;
      const cuotaMostrar = cuotaApi || (personas ? cuotaCalc : 0);
      if (cuotaMostrar) pintarStat('stat-cuota', cuotaMostrar); else setText('stat-cuota', '—');
      pintarStat('stat-bote', Number(bote?.bote || 0));
    }
  }

  const cfg = config || {};
  if (Number(cfg.usd_rate) > 0) TIPO_CAMBIO_USD = Number(cfg.usd_rate);
  const jamUrl = JAM_URL_MANUAL || cfg.jam_url || '';
  if (jamUrl && $('btn-jam')) {
    $('btn-jam').href = jamUrl;
    $('btn-jam').classList.remove('hidden');
    $('jam-dormido')?.classList.add('hidden');
  }
  const albumUrl = ALBUM_URL_MANUAL || cfg.album_url || '';
  if (albumUrl && $('btn-album')) {
    $('btn-album').href = albumUrl;
    $('btn-album').classList.remove('hidden');
    $('album-dormido')?.classList.add('hidden');
  }

  const votacionOn = ['on', 'true', 'si', 'sí', '1', 'abierta'].includes(
    String(cfg.votacion ?? '').toLowerCase()
  );
  if (votacionOn && $('votacion-dormida')) despertarVotacion();
}

/* ---------------- RSVP (solo index) ---------------- */

/* El máximo de "sin disfraz" es el tamaño de tu grupo: tú + tus acompañantes.
   Se regenera cada vez que cambias el número de acompañantes, para que nadie
   pueda inflar el bote registrando más rebeldes de los que trae. */
function sincronizarSinDisfraz() {
  const sel = $('f-sindisfraz');
  if (!sel) return;
  const max = 1 + Number($('f-acomp')?.value || 0);
  const previo = Number(sel.value || 0);
  const opts = [`<option value="0">${escapeHtml(t('rsvp.sindisfraz.0'))}</option>`];
  for (let i = 1; i <= max; i++) {
    opts.push(`<option value="${i}">${escapeHtml(t('rsvp.sindisfraz.n', { n: i, monto: mxn(i * 200) }))}</option>`);
  }
  sel.innerHTML = opts.join('');
  sel.value = String(Math.min(previo, max));
}

/* Un campo por acompañante: sin comas ambiguas y sin adivinar cuántos nombres
   faltan. Conserva lo que ya escribiste si cambias el número. */
function sincronizarNombresAcomp() {
  const box = $('acomp-nombres-box');
  if (!box) return;
  const n = Number($('f-acomp')?.value || 0);
  const previos = leerNombresAcomp();

  box.classList.toggle('hidden', !n);
  if (!n) { box.innerHTML = ''; return; }

  let html = '';
  for (let i = 1; i <= n; i++) {
    html +=
      `<label for="f-acomp-${i}">${escapeHtml(t('rsvp.acompNombre', { n: i }))}</label>` +
      `<input type="text" id="f-acomp-${i}" class="acomp-nombre" maxlength="60"` +
      ` placeholder="${escapeHtml(t('rsvp.acompNombre.ph'))}" required value="${escapeHtml(previos[i - 1] || '')}">`;
  }
  box.innerHTML = html;
}

function leerNombresAcomp() {
  return Array.from(document.querySelectorAll('.acomp-nombre')).map((i) => i.value.trim());
}

on('f-acomp', 'change', () => {
  sincronizarNombresAcomp();
  sincronizarSinDisfraz();
});

sincronizarNombresAcomp();
sincronizarSinDisfraz();

on('form-rsvp', 'submit', async (e) => {
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
  btn.textContent = t('rsvp.enviando');
  const payload = {
    action: 'rsvp',
    nombre: $('f-nombre').value.trim(),
    whatsapp: $('f-whats').value.trim(),
    acompanantes: Number($('f-acomp').value),
    acompanantes_nombres: leerNombresAcomp().filter(Boolean).join(', '),
    sin_disfraz: Number($('f-sindisfraz').value),
  };
  const res = await apiPost(payload);
  btn.disabled = false;
  btn.textContent = t('rsvp.boton');

  if (!res) {
    msg.className = 'form-msg error';
    msg.textContent = t('rsvp.errorRed');
    return;
  }
  const esNuevo = !(res.status === 'duplicado' || res.duplicado) && (res.ok || res.status === 'nuevo');

  if (res.status === 'duplicado' || res.duplicado || esNuevo) {
    const nombre = escapeHtml(payload.nombre);

    const bloqueDisfraz = payload.sin_disfraz
      ? `<p class="niebla mt-1" style="font-size:15px;">${t('modal.disfraz', { n: payload.sin_disfraz, monto: mxn(payload.sin_disfraz * 200) })}</p>`
      : '';

    /* Acaba de decir que sí: es el mejor momento para pedirle algo.
       Sugerir un juego es lo ÚNICO que puede hacer hoy — el Jam, el álbum
       y la votación no despiertan hasta el 31. */
    const urlJuego = linkWhats(WHATSAPP_JUEGOS, t('wa.juegoNombre', { nombre: payload.nombre }));
    const bloqueJuego =
      `<div class="mt-3"><p class="niebla" style="font-size:15px;">${t('modal.juegoPregunta')}</p>` +
      `<a class="btn btn-rojo mt-1" href="${urlJuego}" target="_blank" rel="noopener">${t('modal.juegoBoton')}</a></div>`;

    const urlCorregir = linkWhats(WHATSAPP_DUDAS, t('wa.corregir', { nombre: payload.nombre }));
    const bloqueCorregir =
      `<p class="niebla mt-3" style="font-size:14px;">${t('modal.corregir', { url: urlCorregir })}</p>`;

    const encabezado = esNuevo
      ? `<p>${t('modal.enLista', { nombre })}</p>` +
        `<p class="niebla mt-1" style="font-size:15px;">${t('modal.pago')}</p>`
      : `<p>${t('modal.yaEstabas', { nombre })}</p>`;

    const cuerpo =
      `<div><span class="badge-vas">¡Vas!</span></div>` +
      `<div class="mt-2">${encabezado}</div>` +
      bloqueDisfraz + bloqueJuego + bloqueCorregir;

    // Si por lo que sea no existe el modal, no dejamos al invitado sin respuesta.
    if (!abrirModal(t(esNuevo ? 'modal.nuevo' : 'modal.dup'), cuerpo)) {
      msg.innerHTML = cuerpo;
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (esNuevo) {
      $('form-rsvp').reset();
      sincronizarNombresAcomp();
      sincronizarSinDisfraz();
      cargarDatos();
    }
  } else {
    msg.className = 'form-msg error';
    msg.textContent = res.error || t('rsvp.errorGeneral');
  }
});

/* ---------------- Votación (solo premios) ---------------- */
function despertarVotacion() {
  $('votacion-dormida').classList.add('hidden');
  $('votacion-activa').classList.remove('hidden');

  const cont = $('categorias-voto');
  // Candidatos = TODAS las personas, no solo quien llenó el formulario.
  // Los acompañantes también se disfrazan y también compiten.
  const candidatos = todasLasPersonas(confirmadosCache);

  cont.innerHTML = CATEGORIAS_VOTO.map(
    (cat) => `
    <div class="categoria-voto" data-cat="${cat.id}">
      <h3 style="font-size:20px;">${t(cat.clave)}</h3>
      <div class="candidatos">
        ${candidatos
          .map((p) => `<button type="button" class="candidato" data-nombre="${escapeHtml(p.nombre)}">${escapeHtml(p.nombre)}</button>`)
          .join('') || `<span class="niebla">${escapeHtml(t('prem.sinCandidatos'))}</span>`}
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

on('btn-votar', 'click', async () => {
  const msg = $('voto-msg');
  msg.className = 'form-msg';
  const votante = $('v-votante').value.trim();
  if (!votante) {
    msg.className = 'form-msg error';
    msg.textContent = t('prem.faltaNombre');
    return;
  }
  const votos = [];
  document.querySelectorAll('.categoria-voto').forEach((catEl) => {
    const sel = catEl.querySelector('.candidato.sel');
    if (sel) votos.push({ categoria: catEl.dataset.cat, candidato: sel.dataset.nombre });
  });
  if (!votos.length) {
    msg.className = 'form-msg error';
    msg.textContent = t('prem.eligeUno');
    return;
  }
  $('btn-votar').disabled = true;
  let oks = 0;
  for (const v of votos) {
    const res = await apiPost({ action: 'voto', votante, ...v });
    if (res && (res.ok || res.status === 'ok')) oks++;
  }
  $('btn-votar').disabled = false;
  msg.innerHTML = oks ? t('prem.votosOk', { n: oks }) : t('prem.votosNo');
});

/* ---------------- Arranque ---------------- */
/* i18n.js repinta el HTML estático; aquí repintamos lo que arma el JS. */
document.addEventListener('idioma-cambiado', () => {
  initWhats();
  sincronizarNombresAcomp();
  sincronizarSinDisfraz();
  const btn = $('btn-rsvp');
  if (btn && !btn.disabled) btn.textContent = t('rsvp.boton');
  cargarDatos();
});

cargarDatos();
