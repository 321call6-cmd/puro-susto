# PURO SUSTO — Halloween 2026 🎃

Sitio estático de la fiesta. Sábado 31 de octubre 2026, 6 PM – 1 AM, Salón Castilla, Blvd. Viñas del Mar, Tijuana.

## Arquitectura

- **Frontend:** este repo, desplegado en Cloudflare Pages (HTML/CSS/JS puro, sin build).
- **Backend:** Google Sheets "PURO SUSTO — Logística v2" con pestañas `Confirmados`, `Gastos`, `Config`, `Votos`.
- **Puente:** Apps Script Web App (`puro-susto-api.gs`) — `doGet` para `config` / `gastos` / `confirmados` / `cuota` / `bote`, `doPost` para `rsvp` (anti-duplicados) y `voto` (1 por persona por categoría).

## Para activar el sitio (2 pasos)

1. **Desplegar el Apps Script** como Web App: Implementar → Nueva implementación → App web → *Ejecutar como: Yo* · *Acceso: Cualquier persona*. Copiar el URL `/exec`.
2. Pegar ese URL en `app.js`, línea `const API_URL = ''`.

Opcionales en `app.js`: `WHATSAPP_ANFITRIONES` (lada internacional, ej. `52664...`), `JAM_URL_MANUAL`, `ALBUM_URL_MANUAL` (también pueden venir de la pestaña `Config` como `jam_url` / `album_url`).

## Antes del deploy

- Reemplazar `TU-DOMINIO` en `index.html` (meta tags OG) y `recordatorios.html` por el dominio real de Cloudflare Pages.
- `og-image.png` (1200×630) ya está en la raíz — es la imagen que sale al compartir el link por WhatsApp.

## Votación

La sección de votación está **dormida** hasta que en la pestaña `Config` se ponga `votacion = on`. Ese switch la despierta en todos los celulares al recargar.

## Páginas

- `/` — invitación completa (countdown, RSVP, confirmados + cuota en vivo, gastos, bote, horario, reglas, Jam, fotos, juegos, votación, mapa, FAQ).
- `/recordatorios.html` — mensajes listos para copiar a WhatsApp (solo anfitriones, `noindex`, sin datos de pago).

## Reglas de la fiesta (fuente de verdad)

- Transparencia total: TODO gasto va a la pestaña `Gastos` (FIJO se divide entre todos; POR PERSONA por cabeza).
- Sin disfraz: $200 → bote del mejor disfraz.
- Acompañantes pagan cuota completa.
- Lista de confirmados pública; estatus de pago solo en la hoja (admins: Edgar y Sandra).
- 6 trofeos esqueleto: 4 por votación en celular (mejor disfraz gana el bote, más creativo, más ridículo, más terrorífico) + 2 comodines en vivo.
- Datos de pago NUNCA en el sitio — solo por WhatsApp.
