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
  { id: 'mejor', nombre: 'Mejor disfraz 💰 (gana el premio)' },
  { id: 'creativo', nombre: 'Más creativo' },
  { id: 'ridiculo', nombre: 'Más ridículo' },
  { id: 'terrorifico', nombre: 'Más terrorífico' },
];

/* ---------------- Helpers ---------------- */
const $ = (id) => document.getElementById(id);
const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };
const setText = (id, txt) => { const el = $(id); if (el) el.textContent = txt; };
const mxn = (n) => '$' + Math.ceil(n).toLocaleString('es-MX');

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
          ? '<div class="count-cell" style="padding:22px 28px;"><b>¡ES HOY!</b><span>La fiesta ya empezó 🎃</span></div>'
          : '<div class="count-cell" style="padding:22px 28px;"><b>FIN</b><span>Nos vemos el próximo año</span></div>';
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
  const url = location.origin + '/';
  const texto = '🎃 Estás invitado a PURO SUSTO — 31 de octubre, Tijuana. Confirma aquí… si te atreves:';
  if (navigator.share) {
    try { await navigator.share({ text: texto, url }); return; } catch (_) { /* cancelado */ }
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`, '_blank', 'noopener');
  }
});

/* ---------------- WhatsApp: juegos y dudas ---------------- */
function linkWhats(numero, texto) {
  const t = encodeURIComponent(texto);
  return numero ? `https://wa.me/${numero}?text=${t}` : `https://wa.me/?text=${t}`;
}

(function initWhats() {
  const juego = $('btn-sugerir-juego');
  if (juego) juego.href = linkWhats(WHATSAPP_JUEGOS, '🎃 PURO SUSTO — propongo un juego para la noche: ');

  const dudas = $('btn-dudas');
  if (dudas) dudas.href = linkWhats(WHATSAPP_DUDAS, '🎃 Hola, tengo una duda sobre PURO SUSTO: ');
})();

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
      gastos.map((g) => `<tr>
          <td>${escapeHtml(g.concepto)}</td>
          <td class="niebla">${String(g.tipo).toUpperCase().startsWith('FIJO') ? 'Fijo · se divide' : 'Por persona'}</td>
          <td class="num">${mxn(g.monto)}${String(g.tipo).toUpperCase().startsWith('FIJO') ? '' : ' c/u'}</td>
        </tr>`).join('') +
      `<tr class="total"><td>Total fijo</td><td></td><td class="num">${mxn(totalFijo)}</td></tr>`;
  }

  const formula = $('cuota-formula');
  if (formula) {
    formula.textContent = personas
      ? `${mxn(totalFijo)} ÷ ${personas} personas + ${mxn(totalPP)} = ${mxn(totalFijo / personas + totalPP)} por persona`
      : `${mxn(totalFijo)} ÷ confirmados + ${mxn(totalPP)} por persona`;
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
      out.push({ nombre: `Invitado de ${anfitrion}`, invitadoPor: anfitrion });
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
            ? `<span class="chip niebla" title="Invitado por ${escapeHtml(p.invitadoPor)}">${escapeHtml(p.nombre)}</span>`
            : `<span class="chip">${escapeHtml(p.nombre)}</span>`
        ).join('')
      : '<span class="chip niebla">Aún no cae nadie… sé el primero 🩸</span>';
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
      setText('stat-cuota', cuotaApi ? mxn(cuotaApi) : personas ? mxn(cuotaCalc) : '—');
      const boteVal = Number(bote?.bote || 0);
      setText('stat-bote', boteVal ? mxn(boteVal) : '$0');
    }
  }

  const cfg = config || {};
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
  const opts = ['<option value="0">Nadie — todos disfrazados 🎃</option>'];
  for (let i = 1; i <= max; i++) {
    opts.push(`<option value="${i}">${i} sin disfraz (+${mxn(i * 200)})</option>`);
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
      `<label for="f-acomp-${i}">Nombre del acompañante ${i}</label>` +
      `<input type="text" id="f-acomp-${i}" class="acomp-nombre" maxlength="60"` +
      ` placeholder="Nombre y apellido" required value="${escapeHtml(previos[i - 1] || '')}">`;
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
  btn.textContent = 'Invocando…';
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
  btn.textContent = '¡Voy!';

  if (!res) {
    msg.className = 'form-msg error';
    msg.textContent = 'Algo salió mal en el inframundo. Intenta de nuevo o confirma por WhatsApp.';
    return;
  }
  if (res.status === 'duplicado' || res.duplicado) {
    msg.innerHTML = `Ya estabas en la lista, ${escapeHtml(payload.nombre)} — el susto no se duplica. <span class="badge-vas">¡Vas!</span>`;
  } else if (res.ok || res.status === 'nuevo') {
    const notaDisfraz = payload.sin_disfraz
      ? `<br><span class="niebla" style="font-size:15px;">Anotamos ${payload.sin_disfraz} sin disfraz: +${'$' + (payload.sin_disfraz * 200).toLocaleString('es-MX')} al premio. 😈</span>`
      : '';
    const urlCorregir = linkWhats(WHATSAPP_DUDAS, `🎃 PURO SUSTO — soy ${payload.nombre} y necesito corregir mi confirmación: `);
    const notaError = `<br><span class="niebla" style="font-size:15px;">¿Te equivocaste en algo? <a href="${urlCorregir}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a> y lo corregimos.</span>`;
    msg.innerHTML = `Listo, ${escapeHtml(payload.nombre)}. Te escribimos por WhatsApp para el pago. <span class="badge-vas">¡Vas!</span>${notaDisfraz}${notaError}`;
    $('form-rsvp').reset();
    sincronizarNombresAcomp();
    sincronizarSinDisfraz();
    cargarDatos();
  } else {
    msg.className = 'form-msg error';
    msg.textContent = res.error || 'No se pudo confirmar. Intenta de nuevo.';
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
      <h3 style="font-size:20px;">${cat.nombre}</h3>
      <div class="candidatos">
        ${candidatos
          .map((p) => `<button type="button" class="candidato" data-nombre="${escapeHtml(p.nombre)}">${escapeHtml(p.nombre)}</button>`)
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

on('btn-votar', 'click', async () => {
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

/* ---------------- Arranque ---------------- */
cargarDatos();
