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

/* Solo se usa si la hoja no responde. La fuente de verdad es la pestaña
   Gastos; esto es el paracaídas para que el sitio nunca muestre $0. */
const FALLBACK_GASTOS = [
  { concepto: 'Renta de la palapa', tipo: 'FIJO', monto: 300 },
  { concepto: 'Limpieza de la palapa', tipo: 'FIJO', monto: 500 },
  { concepto: 'Mesas y sillas', tipo: 'FIJO', monto: 450 },
  { concepto: 'Comida (gorditas, bloque para 30)', tipo: 'FIJO', monto: 3800 },
  { concepto: 'Trofeos de esqueleto (6 pack)', tipo: 'FIJO', monto: 436 },
  { concepto: 'Premio', tipo: 'POR PERSONA', monto: 30 },
];

const FECHA_FIESTA = new Date('2026-10-31T18:00:00-07:00');
const FECHA_FIN = new Date('2026-11-01T01:00:00-07:00');

/* El registro cierra 3 días antes para poder encargar la comida.
   Miércoles 28 de octubre, 11:59 PM hora de Tijuana. */
const FECHA_CIERRE_REGISTRO = new Date('2026-10-28T23:59:59-07:00');

/* Meta de personas para la barra del gancho. No es un cupo: es el número
   contra el que se proyecta "si llegamos a X, pagas Y". Cuando se rebasa,
   la barra se llena y el mensaje cambia. */
const META_PERSONAS = 20;

/* Los peques (niños chiquitos) NO pagan y NO cuentan para dividir gastos.
   Truco para no tocar la hoja ni el Apps Script: se mandan con
   acompanantes = 0 y sus nombres en 'acompanantes_nombres'. Así la columna
   'Total Personas' queda en 1 (un adulto que paga) y la fórmula de la cuota
   sigue igual, pero los peques sí salen en la lista pública y en la votación.
   OJO: si alguien vuelve a poner acompanantes > 0 en la hoja, esa fila se
   cobra completa — que es justo lo correcto para un adulto capturado a mano. */
const MAX_PEQUES = 4;

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

/* Para comparar nombres: sin acentos, sin mayúsculas, sin espacios de más.
   "Edgar  Calleros" y "edgar calleros" tienen que chocar. */
function normalizarNombre(s) {
  return String(s ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

let confirmadosCache = [];
let personasCache = [];      // lista aplanada: adultos + peques
let adultosCache = 0;        // los que pagan (autoridad: B13 de la hoja)
let gastosCache = { totalFijo: 0, totalPP: 0 };
let premioPorPersona = 30;   // se refresca desde la hoja

const registroCerrado = () => new Date() > FECHA_CIERRE_REGISTRO;

/* Días completos que faltan para el cierre (0 = cierra hoy). */
function diasParaCierre() {
  return Math.max(0, Math.ceil((FECHA_CIERRE_REGISTRO - new Date()) / 86400000));
}

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

/* ---------------- Menú móvil ----------------
   nav.links se oculta abajo de 720px. Clonamos esos mismos enlaces en un
   panel de pantalla completa: así el menú nunca se desincroniza del de
   escritorio y los data-i18n viajan con la copia (i18n.js los repinta). */
(function menuMovil() {
  const barra = document.querySelector('.nav-inner');
  const links = document.querySelector('nav.links');
  if (!barra || !links || barra.querySelector('.nav-toggle')) return;

  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'nav-toggle';
  boton.setAttribute('aria-label', 'Menú');
  boton.setAttribute('aria-expanded', 'false');
  boton.innerHTML = '<span></span><span></span><span></span>';
  barra.appendChild(boton);

  const panel = document.createElement('nav');
  panel.className = 'menu-movil hidden';
  panel.id = 'menu-movil';
  links.querySelectorAll('a').forEach((a) => panel.appendChild(a.cloneNode(true)));
  document.body.appendChild(panel);

  const abrir = (si) => {
    panel.classList.toggle('hidden', !si);
    boton.setAttribute('aria-expanded', String(si));
    document.body.style.overflow = si ? 'hidden' : '';
  };

  boton.addEventListener('click', () => abrir(panel.classList.contains('hidden')));
  // Al elegir una sección, cerrar: si es un ancla de esta misma página no
  // hay recarga y el panel se quedaría tapando todo.
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) abrir(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') abrir(false); });
  // Si gira el teléfono o crece la ventana, el menú de escritorio reaparece.
  window.addEventListener('resize', () => { if (window.innerWidth > 720) abrir(false); });
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

  /* El bote crece $X por cabeza; ese X vive en la fila "Premio" de la hoja. */
  const filaPremio = porPersona.find((g) => /premio|bote/i.test(String(g.concepto)));
  const premio = Number(filaPremio?.monto || 0);

  const formula = $('cuota-formula');
  if (formula) {
    formula.textContent = personas
      // Mismo redondeo que la hoja (CEILING sobre la parte fija) o los dos números no cuadran.
      ? t('cuota.formula', { fijo: mxn(totalFijo), personas, porPersona: mxn(totalPP), cuota: mxnUsd(Math.ceil(totalFijo / personas) + totalPP) })
      : t('cuota.formulaVacia', { fijo: mxn(totalFijo), porPersona: mxn(totalPP) });
  }
  return { totalFijo, totalPP, premio };
}

/* Aplana la lista en PERSONAS: quien confirmó + sus peques con nombre.
   Regla: 'acompanantes_nombres' son PEQUES (no pagan). El número
   'acompanantes' solo aparece en filas viejas o capturadas a mano, y ahí sí
   son adultos que pagan — por eso se marcan distinto. */
function todasLasPersonas(lista) {
  const out = [];
  (lista || []).forEach((c) => {
    const anfitrion = c.nombre || String(c);
    out.push({ nombre: anfitrion, conQuien: null, peque: false });

    const nombres = (c.acompanantes_nombres || []).filter(Boolean);
    nombres.forEach((n) => out.push({ nombre: n, conQuien: anfitrion, peque: true }));

    // Filas viejas: un número de acompañantes sin nombre capturado.
    const faltan = Number(c.acompanantes || 0) - nombres.length;
    for (let i = 1; i <= faltan; i++) {
      out.push({ nombre: t('conf.invitadoDe', { nombre: anfitrion }), conQuien: anfitrion, peque: false });
    }
  });
  return out;
}

/* Hash estable del nombre. Todo lo que varía de una lápida a otra sale de
   aquí y NO de un random: así la misma persona tiene siempre el mismo
   monstruo y la misma silueta, no cambian en cada recarga, y la gente
   reconoce "su" lápida. */
function hashDe(nombre) {
  let h = 0;
  const s = normalizarNombre(nombre);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const MONSTRUOS = ['i-calavera', 'i-fantasma', 'i-murcielago', 'i-calabaza', 'i-vampiro', 'i-bruja', 'i-franky', 'i-casa'];
const monstruoDe = (nombre) => MONSTRUOS[hashDe(nombre) % MONSTRUOS.length];

/* Cuatro siluetas de panteón real: arco, gablete (punta), hombros cortados
   y una chueca que lleva años hundiéndose. Todas caben texto; la cruz se
   descartó porque no hay dónde poner el nombre. */
const SILUETAS = ['arco', 'gablete', 'hombros', 'torcida'];
const siluetaDe = (nombre) => SILUETAS[(hashDe(nombre) >> 3) % SILUETAS.length];

function pintarConfirmados(lista) {
  const cont = $('lista-confirmados');
  const personas = todasLasPersonas(lista);
  personasCache = personas;
  if (!cont) return personas.length;

  if (!personas.length) {
    cont.innerHTML = `<p class="niebla">${escapeHtml(t('conf.vacio'))}</p>`;
    return 0;
  }

  /* Lápidas. El delay escalonado hace que la lista "brote" al cargar:
     tope de 40 para que el último no espere una eternidad. */
  cont.innerHTML = personas
    .map((p, i) => {
      const delay = Math.min(i, 40) * 45;
      const etiqueta = p.peque
        ? `<span class="lapida-tag">${escapeHtml(t('conf.peque'))}</span>`
        : '';
      const conQuien = p.conQuien
        ? `<span class="lapida-con">${escapeHtml(t('conf.conQuien', { nombre: p.conQuien }))}</span>`
        : '';
      return `<div class="lapida lapida-${siluetaDe(p.nombre)}${p.peque ? ' lapida-peque' : ''}" style="animation-delay:${delay}ms">
        <span class="lapida-num">${escapeHtml(t('conf.numero', { n: i + 1 }))}</span>
        <svg class="lapida-monstruo" viewBox="0 0 24 24" aria-hidden="true"><use href="#${monstruoDe(p.nombre)}"/></svg>
        <span class="lapida-nombre">${escapeHtml(p.nombre)}</span>
        ${conQuien}${etiqueta}
      </div>`;
    })
    .join('');

  return personas.length;
}

/* Pie de la lista: cuántos peques van gratis y cuántos rebeldes sin disfraz.
   El número de rebeldes NO viene de la API — se despeja del bote, que ya lo
   incluye: bote = premio×personas + 200×rebeldes. Así no hubo que tocar
   el Apps Script para tener el dato. */
function pintarPieLista(adultos, bote) {
  const el = $('lista-pie');
  if (!el) return;
  const peques = personasCache.filter((p) => p.peque).length;
  const rebeldes = Math.max(0, Math.round((Number(bote || 0) - premioPorPersona * adultos) / 200));

  const partes = [];
  if (peques) partes.push(t('conf.masPeques', { n: peques }));
  partes.push(rebeldes
    ? t('conf.masRebeldes', { n: rebeldes, monto: mxn(rebeldes * 200) })
    : t('conf.todosDisfrazados'));
  el.textContent = partes.join(' · ');
}

/* ---------------- El gancho: cuota baja / premio sube ---------------- */

/* Cuota que saldría si fuéramos n personas. Mismo redondeo que la hoja
   (CEILING sobre la parte fija) para que los dos números coincidan. */
function cuotaCon(n) {
  if (!n) return 0;
  return Math.ceil(gastosCache.totalFijo / n) + gastosCache.totalPP;
}
/* El bote lo manda la hoja: semilla por persona + $200 por cada rebelde sin
   disfraz + bote extra. Aquí se guarda el valor real para no inventar un
   segundo número: el gancho y el tile de arriba tienen que decir lo mismo. */
let boteActual = 0;
const boteCon = (n) => premioPorPersona * n;

/* Bote proyectado si llegáramos a n personas: se conserva lo que ya hay
   (rebeldes incluidos) y se le suma la semilla de los que faltan. */
function boteProyectadoA(n) {
  return boteActual + premioPorPersona * Math.max(0, n - adultosCache);
}

/* Cuenta ascendente del número grande. Es la "animación" que pidió el
   brief: el monto se mueve solo y el ojo lo persigue. */
function animarMonto(el, destino) {
  if (!el) return;
  /* En inglés el aproximado en dólares va en una línea chica DEBAJO. En la
     misma línea desbordaba el recuadro (ya pasó una vez, bug #10). Y solo
     se pinta al final: en cada cuadro de la animación parpadearía. */
  const fijar = () => {
    const usd = usdAprox(destino);
    el.innerHTML = escapeHtml(mxn(destino)) + (usd ? `<small>${escapeHtml(usd)}</small>` : '');
  };

  const previo = Number(el.dataset.valor || 0);
  el.dataset.valor = String(destino);
  if (previo === destino) { fijar(); return; }

  const inicio = performance.now();
  const dur = 900;
  const paso = (ahora) => {
    const p = Math.min(1, (ahora - inicio) / dur);
    if (p >= 1) { fijar(); return; }
    const suave = 1 - Math.pow(1 - p, 3);
    el.textContent = mxn(previo + (destino - previo) * suave);
    requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

/* UN solo número grande: el premio. La versión anterior tenía dos recuadros
   —cuota abajo, premio arriba— y vendía el ahorro. Mal calibrado para este
   grupo: no les duele la cuota, y hablar de dinero hacía sonar la fiesta a
   vaquita. Ahora manda la gloria (ganar el concurso) y la cuota vive en la
   línea chica de abajo, visible pero sin protagonismo.

   El monto grande muestra la META, no el momento: con la lista vacía el
   "ahora mismo" sería $0 (parece bug) y con una persona $30 (da risa).
   Ya rebasada la meta, la proyección deja de servir y vuelve al presente. */
function pintarGancho(adultos) {
  if (!$('gancho-premio')) return;

  const yaLlegamos = adultos >= META_PERSONAS;
  animarMonto($('gancho-premio'), yaLlegamos ? boteActual : boteProyectadoA(META_PERSONAS));
  setText('gancho-premio-pie', yaLlegamos ? t('gancho.ahora') : t('gancho.siSomos', { n: META_PERSONAS }));

  setText('gancho-somos', t('gancho.somos', { n: adultos }));
  setText('gancho-meta', t('gancho.meta', { n: META_PERSONAS }));

  const pct = Math.min(100, Math.round((adultos / META_PERSONAS) * 100));
  const relleno = $('gancho-barra-relleno');
  if (relleno) {
    relleno.style.width = pct + '%';
    // Sin nadie registrado no hay sangre: la gota quedaría goteando de la nada.
    relleno.classList.toggle('sin-sangre', pct === 0);
  }
  $('gancho-barra')?.setAttribute('aria-valuenow', String(pct));

  const proy = $('gancho-proyeccion');
  if (proy) {
    if (!adultos) {
      proy.innerHTML = t('gancho.vacio');
    } else if (yaLlegamos) {
      proy.innerHTML = t('gancho.logrado');
    } else {
      proy.innerHTML =
        t('gancho.ahorita', {
          n: adultos,
          cuota: mxn(cuotaCon(adultos)),
          bote: mxn(boteActual),
        }) + ' ' + t('gancho.faltan', { n: META_PERSONAS - adultos });
    }
  }

  const cierre = $('gancho-cierre');
  if (cierre) {
    const dias = diasParaCierre();
    if (registroCerrado()) cierre.innerHTML = t('gancho.cerrado');
    else if (dias <= 0) cierre.innerHTML = t('gancho.cierreHoy');
    else if (dias === 1) cierre.innerHTML = t('gancho.cierreUno');
    else cierre.innerHTML = t('gancho.cierre', { n: dias });
    cierre.classList.toggle('urgente', !registroCerrado() && dias <= 3);
  }

  $('gancho-cta')?.classList.toggle('hidden', registroCerrado());
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
    pintarConfirmados(lista);
    if (!API_URL) setText('ultima-actualizacion', 'La lista en vivo se conecta muy pronto');

    /* Quién manda en "cuántos somos": la hoja (B13, vía action=cuota).
       Los peques NO entran ahí a propósito — no pagan y no dividen.
       Si la hoja no responde, se cae al número de filas, que es lo mismo
       mientras nadie capture acompañantes a mano. */
    const adultos = Number(cuota?.personas || 0) || lista.length;
    adultosCache = adultos;

    if (necesitaStats) {
      const listaGastos = Array.isArray(gastos) ? gastos : gastos?.gastos || [];
      const { totalFijo, totalPP, premio } = pintarGastos(listaGastos.length ? listaGastos : FALLBACK_GASTOS, adultos);
      gastosCache = { totalFijo, totalPP };
      if (premio > 0) premioPorPersona = premio;

      setText('stat-personas', adultos || '0');
      const cuotaApi = Number(cuota?.cuota || 0);
      const cuotaMostrar = cuotaApi || cuotaCon(adultos);
      if (cuotaMostrar) pintarStat('stat-cuota', cuotaMostrar); else setText('stat-cuota', '—');

      const boteMostrar = Number(bote?.bote || 0) || boteCon(adultos);
      boteActual = boteMostrar;
      pintarStat('stat-bote', boteMostrar);
      pintarPieLista(adultos, boteMostrar);
      pintarGancho(adultos);
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

/* Un campo por peque. Conserva lo escrito si cambias el número. */
function sincronizarNombresPeques() {
  const box = $('peques-nombres-box');
  if (!box) return;
  const n = Math.min(MAX_PEQUES, Number($('f-peques')?.value || 0));
  const previos = leerNombresPeques();

  if (!n) { box.innerHTML = ''; return; }

  let html = '';
  for (let i = 1; i <= n; i++) {
    html +=
      `<label for="f-peque-${i}">${escapeHtml(t('rsvp.peques.nombre', { n: i }))}</label>` +
      `<input type="text" id="f-peque-${i}" class="peque-nombre" maxlength="60"` +
      ` placeholder="${escapeHtml(t('rsvp.peques.ph'))}" required value="${escapeHtml(previos[i - 1] || '')}">`;
  }
  box.innerHTML = html;
}

function leerNombresPeques() {
  return Array.from(document.querySelectorAll('.peque-nombre')).map((i) => i.value.trim());
}

on('f-peques', 'change', sincronizarNombresPeques);

/* El bloque de peques nace cerrado: el camino fácil es registrarse solo. */
on('btn-peques', 'click', () => {
  const box = $('peques-box');
  const btn = $('btn-peques');
  if (!box || !btn) return;
  const abriendo = box.classList.contains('hidden');
  box.classList.toggle('hidden', !abriendo);
  btn.textContent = t(abriendo ? 'rsvp.peques.cerrar' : 'rsvp.peques.abrir');
  if (!abriendo) {
    // Al cerrarlo se limpia: si no se ve, no se manda.
    const sel = $('f-peques');
    if (sel) sel.value = '0';
    sincronizarNombresPeques();
  }
});

sincronizarNombresPeques();

/* ---------------- Candado contra duplicados ----------------
   El duplicado real que pasó no fue "alguien se registró dos veces": fue una
   persona que se registró Y ADEMÁS venía como acompañante de otra. Quitar el
   selector de acompañantes cierra esa puerta; esto cierra la otra: avisar en
   cuanto el nombre choca con alguien que ya está en la lista en vivo. */
function nombreYaEnLista(nombre) {
  const n = normalizarNombre(nombre);
  if (n.length < 3) return null;
  const hit = personasCache.find((p) => normalizarNombre(p.nombre) === n);
  return hit ? hit.nombre : null;
}

function revisarDuplicado() {
  const aviso = $('aviso-dup');
  if (!aviso) return;
  const choque = nombreYaEnLista($('f-nombre')?.value || '');
  aviso.classList.toggle('hidden', !choque);
  if (choque) aviso.innerHTML = t('rsvp.dupAviso', { nombre: escapeHtml(choque) });
}

on('f-nombre', 'input', revisarDuplicado);

/* ---------------- Cierre del registro ----------------
   Se apaga el formulario y aparece la salida por WhatsApp. Es un candado de
   cortesía, no de seguridad: la hoja sigue aceptando escrituras. Para una
   fiesta alcanza — el objetivo es comunicar la fecha, no blindarla. */
function aplicarCierreRegistro() {
  const form = $('form-rsvp');
  const cerrado = $('rsvp-cerrado');
  if (!form || !cerrado) return;
  const tarde = $('btn-tarde');
  if (tarde) tarde.href = linkWhats(WHATSAPP_DUDAS, t('wa.tarde'));
  form.classList.toggle('hidden', registroCerrado());
  cerrado.classList.toggle('hidden', !registroCerrado());
  document.querySelector('.aviso-solo-tu')?.classList.toggle('hidden', registroCerrado());
}
aplicarCierreRegistro();

on('form-rsvp', 'submit', async (e) => {
  e.preventDefault();
  const msg = $('rsvp-msg');
  const btn = $('btn-rsvp');
  msg.className = 'form-msg';
  msg.textContent = '';

  if (registroCerrado()) { aplicarCierreRegistro(); return; }

  if (!API_URL) {
    msg.innerHTML = 'Las confirmaciones se abren en unos días. Mientras tanto, aparta la fecha ☠️';
    return;
  }

  /* Segundo candado: si el nombre ya está, no se manda sin que la persona
     diga explícitamente "soy otra persona". */
  const choque = nombreYaEnLista($('f-nombre').value);
  if (choque && !confirm(t('rsvp.dupPregunta', { nombre: choque }))) {
    revisarDuplicado();
    return;
  }

  btn.disabled = true;
  btn.textContent = t('rsvp.enviando');

  /* Los peques van con acompanantes = 0 y solo sus nombres: así la columna
     'Total Personas' de la hoja queda en 1 y no se les cobra cuota. */
  const peques = leerNombresPeques().filter(Boolean).slice(0, MAX_PEQUES);
  const payload = {
    action: 'rsvp',
    nombre: $('f-nombre').value.trim(),
    whatsapp: $('f-whats').value.trim(),
    acompanantes: 0,
    acompanantes_nombres: peques.join(', '),
    sin_disfraz: Number($('f-disfraz').value) ? 1 : 0,
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
      $('peques-box')?.classList.add('hidden');
      const btnPeques = $('btn-peques');
      if (btnPeques) btnPeques.textContent = t('rsvp.peques.abrir');
      sincronizarNombresPeques();
      revisarDuplicado();
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
  sincronizarNombresPeques();
  revisarDuplicado();
  aplicarCierreRegistro();
  const btnPeques = $('btn-peques');
  if (btnPeques) btnPeques.textContent = t($('peques-box')?.classList.contains('hidden') ? 'rsvp.peques.abrir' : 'rsvp.peques.cerrar');
  const btn = $('btn-rsvp');
  if (btn && !btn.disabled) btn.textContent = t('rsvp.boton');
  cargarDatos();
});

cargarDatos();
