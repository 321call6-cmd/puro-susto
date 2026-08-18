/* ============================================================
   PURO SUSTO — i18n
   Un solo juego de archivos, dos idiomas. Nada de páginas duplicadas:
   cada texto lleva data-i18n y aquí vive el diccionario.

   La MARCA no se traduce: "PURO SUSTO" y "Puro susto. Pura fiesta."
   se quedan en español en los dos idiomas (así está el brand kit).

   Atributos que reconoce:
     data-i18n="clave"        → textContent
     data-i18n-html="clave"   → innerHTML (para textos con <b> o enlaces)
     data-i18n-ph="clave"     → placeholder
     data-i18n-title="clave"  → title
   ============================================================ */

const TEXTOS = {
  es: {
    /* ---- Navegación y pie ---- */
    'nav.confirmar': 'Confirmar',
    'nav.cuota': 'Cuota',
    'nav.noche': 'La noche',
    'nav.premios': 'Premios',
    'nav.lugar': 'Lugar',
    'pie.links': '<a href="la-noche.html">La noche</a> · <a href="premios.html">Premios y votación</a> · Dudas: por WhatsApp.',

    /* ---- Hero ---- */
    'hero.meta': 'Sábado 31 de octubre 2026 · 6:00 PM – 1:00 AM',
    'hero.lugar': 'Salón Castilla · Blvd. Viñas del Mar, Tijuana',
    'hero.cta': 'Regístrate y prepara tu disfraz 😈',
    'hero.agendar': 'Agendar',
    'hero.compartir': 'Pasar la invitación',
    'cd.dias': 'días',
    'cd.horas': 'horas',
    'cd.min': 'min',
    'cd.seg': 'seg',
    'cd.hoy': '<b>¡ES HOY!</b><span>La fiesta ya empezó 🎃</span>',
    'cd.fin': '<b>FIN</b><span>Nos vemos el próximo año</span>',

    /* ---- Gancho: el premio que se acumula ----
       OJO con el tono: aquí NO se vende el ahorro, se vende ganar. */
    'gancho.kicker': 'Truco o trato',
    'gancho.titulo': 'El mejor disfraz se lleva el premio',
    'gancho.sub': 'Y el premio <b>se acumula con cada quien que cae</b>. Entre más seamos, más grande — y para competir solo hay que caer disfrazado.',
    'gancho.premioLabel': 'El premio se acumula',
    'gancho.ahora': 'ahora mismo',
    'gancho.somos': 'Somos {n}',
    'gancho.meta': 'meta {n}',
    'gancho.siSomos': 'si somos {n}',
    'gancho.ahorita': 'Ahorita somos <b>{n}</b>: el premio va en <b>{bote}</b> y la cuota en <b>{cuota}</b> por cabeza.',
    'gancho.faltan': 'Faltan <b>{n}</b> para llegar ahí.',
    'gancho.logrado': 'Ya pasamos la meta — y el premio sigue subiendo con cada quien que cae.',
    'gancho.vacio': 'Todavía no cae nadie. El primero que caiga arranca el premio… y se queda con el mejor lugar de la lista.',
    'gancho.cta': 'Regístrate y prepara tu disfraz 😈',
    'gancho.cierre': 'El registro se cierra el <b>miércoles 28 de octubre</b> · faltan <b>{n} días</b>.',
    'gancho.cierreUno': 'El registro se cierra <b>mañana</b>. Última llamada.',
    'gancho.cierreHoy': 'El registro se cierra <b>hoy a medianoche</b>. Última llamada.',
    'gancho.cerrado': 'El registro cerró el 28 de octubre.',

    /* ---- RSVP ---- */
    'rsvp.titulo': 'Confirma tu asistencia',
    'rsvp.caption': 'Cada quien se registra por su cuenta · disfraz obligatorio',
    'rsvp.soloTu': 'Este formulario te registra a <b>ti</b>. Si vienes con alguien, que entre y se registre por su cuenta — así nadie se cuenta doble y las cuentas salen parejas.',
    'rsvp.nombre': 'Tu nombre completo',
    'rsvp.nombre.ph': 'Tu nombre, si te atreves…',
    'rsvp.whats': 'Tu WhatsApp (no se publica)',
    'rsvp.whats.ph': '664 123 4567',
    'rsvp.disfraz': '¿Vas disfrazado/a?',
    'rsvp.disfraz.si': 'Sí, obvio 🎃',
    'rsvp.disfraz.no': 'No — le meto $200 MXN al premio 😈',
    'rsvp.peques.abrir': '+ Traigo peques que no pagan',
    'rsvp.peques.cerrar': '− Quitar peques',
    'rsvp.peques.nota': 'Los niños chiquitos <b>entran gratis</b>: no pagan cuota ni cuentan para dividir los gastos. Solo los apuntamos para que salgan en la lista y puedan ganarse un trofeo.',
    'rsvp.peques.cuantos': '¿Cuántos peques traes?',
    'rsvp.peques.n': '{n} peques',
    'rsvp.peques.1': '1 peque',
    'rsvp.peques.nombre': 'Nombre del peque {n}',
    'rsvp.peques.ph': 'Su nombre',
    'rsvp.dupAviso': 'Ya hay un <b>{nombre}</b> en la lista. Si eres tú, <b>ya estás dentro</b> — no te registres otra vez.',
    'rsvp.dupPregunta': 'Ya hay alguien llamado «{nombre}» en la lista.\n\n¿Eres una persona distinta y quieres registrarte de todos modos?',
    'rsvp.bebidas': 'La comida va incluida en la cuota. <b>Lo que tomes, lo traes tú</b> — trae lo que se te antoje.',
    'rsvp.boton': '¡Voy!',
    'rsvp.enviando': 'Invocando…',
    'rsvp.errorRed': 'Algo salió mal en el inframundo. Intenta de nuevo o confirma por WhatsApp.',
    'rsvp.errorGeneral': 'No se pudo confirmar. Intenta de nuevo.',
    'rsvp.cerradoTitulo': 'El registro cerró',
    'rsvp.cerradoCuerpo': 'Cerramos el <b>28 de octubre</b> para poder encargar la comida a tiempo. Si de verdad te quieres colar, escríbele a Sandy y lo vemos.',
    'rsvp.cerradoBoton': 'Escribirle a Sandy',

    /* ---- Modal ---- */
    'modal.nuevo': '¡Caíste!',
    'modal.dup': 'Ya estabas',
    'modal.enLista': '<b>{nombre}</b>, ya estás en la lista.',
    'modal.pago': 'Te escribimos por WhatsApp para coordinar el pago.',
    'modal.yaEstabas': '<b>{nombre}</b>, ya estabas en la lista — el susto no se duplica.',
    'modal.disfraz': 'Anotamos {n} sin disfraz: +{monto} al premio. 😈',
    'modal.juegoPregunta': 'Ya que estás: ¿tienes un juego que nunca falla?',
    'modal.juegoBoton': 'Propón un juego',
    'modal.corregir': '¿Te equivocaste en algo? <a href="{url}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a> y lo corregimos.',
    'modal.cerrar': 'Cerrar',

    /* ---- Confirmados y cuota ---- */
    'conf.titulo': 'Los que ya cayeron',
    'conf.caption': 'Lista pública · en vivo',
    'conf.personas': 'personas que pagan',
    'conf.cuota': 'cuota por persona (en vivo)',
    'conf.bote': 'premio al mejor disfraz 💰',
    'conf.cargando': 'Cargando la lista…',
    'conf.vacio': 'Aún no cae nadie… sé el primero 🩸',
    'conf.invitadoDe': 'Peque de {nombre}',
    'conf.invitadoPor': 'Viene con {nombre}',
    'conf.peque': 'peque · gratis',
    'conf.conQuien': 'con {nombre}',
    'conf.masPeques': '+{n} peques gratis',
    'conf.masRebeldes': '{n} sin disfraz (+{monto} al premio)',
    'conf.todosDisfrazados': 'Nadie se ha rajado del disfraz 🎃',
    'conf.numero': '#{n}',
    'gastos.titulo': 'Desglose de gastos',
    'gastos.caption': 'Transparencia total: todo gasto aparece aquí',
    'gastos.concepto': 'Concepto',
    'gastos.tipo': 'Tipo',
    'gastos.monto': 'Monto (MXN)',
    'gastos.cargando': 'Cargando gastos…',
    'gastos.fijo': 'Fijo · se divide',
    'gastos.porPersona': 'Por persona',
    'gastos.cu': ' c/u',
    'gastos.totalFijo': 'Total fijo',
    'cuota.titulo': '¿Cómo se calcula tu cuota?',
    'cuota.explica': 'Los gastos <b>fijos</b> se dividen entre todos los que pagan; los <b>por persona</b> se suman por cabeza. Los peques no pagan y tampoco cuentan para dividir. Entre más seamos, más barato sale el susto.',
    'cuota.formula': '{fijo} ÷ {personas} personas + {porPersona} = {cuota} por persona',
    'cuota.formulaVacia': '{fijo} ÷ confirmados + {porPersona} por persona',
    'cuota.nota': 'El premio al mejor disfraz crece con cada confirmado (semilla por persona) y con cada rebelde sin disfraz (+$200 MXN).',

    /* ---- Explora y lugar ---- */
    'explora.noche': 'La noche completa →',
    'explora.nocheDesc': 'Horario, reglas, el Jam para tu música, fotos y juegos.',
    'explora.premios': 'Premios y votación →',
    'explora.premiosDesc': '6 trofeos esqueleto. El 31 se vota desde aquí.',
    'lugar.titulo': 'La guarida',
    'lugar.caption': 'Salón Castilla · Blvd. Viñas del Mar, Tijuana',
    'lugar.comoLlegar': 'Cómo llegar',
    'lugar.dudas': '¿Dudas? WhatsApp',

    /* ---- La noche ---- */
    'noche.titulo': 'La noche',
    'noche.caption': 'Sábado 31 de octubre · 6:00 PM – 1:00 AM · Salón Castilla',
    'noche.horario': 'Horario',
    'noche.h1': 'Abren las puertas. Música, botana y niebla.',
    'noche.h2': 'Cena.',
    'noche.h3': 'Pasarela de disfraces: todos desfilan.',
    'noche.h4': 'Se abre la <a href="premios.html">votación</a> desde tu celular.',
    'noche.h5': 'Premiación: 6 trofeos esqueleto.',
    'noche.h6': 'Jam libre y juegos hasta que el cuerpo aguante.',
    'noche.h7': 'Fin del susto. Nos vemos el próximo año.',
    'noche.reglas': 'Reglas de la casa',
    'noche.r1': '<b>Sin disfraz, pagas $200 MXN</b> que van íntegros al premio del mejor disfraz.',
    'noche.r2': '<b>Transparencia total:</b> cada peso gastado está publicado en el <a href="index.html#cuota">desglose</a>.',
    'noche.r3': '<b>Acompañantes bienvenidos</b> — pagan cuota completa igual que todos.',
    'noche.r4': '<b>El pago se coordina por WhatsApp.</b> Aquí nunca verás números de cuenta.',
    'juegos.titulo': 'Juegos',
    'juegos.caption': 'Propón el tuyo',
    'juegos.texto': 'Habrá juegos toda la noche. ¿Tienes uno que nunca falla? <b>Mándanos tu propuesta por WhatsApp</b> y entra al line-up. Esto <b>ya está abierto</b> — no hay que esperar al 31.',
    'juegos.boton': 'Sugerir un juego',
    'jam.titulo': 'El Jam',
    'jam.caption': 'Tú pones la música · Spotify Jam en vivo',
    'jam.texto': 'La música la armamos entre todos con un <b>Jam de Spotify</b>: te unes desde tu celular y encolas lo que quieras — de Thriller a los corridos, sin juzgar (bueno, un poco).',
    'jam.boton': 'Unirme al Jam',
    'jam.dormido': 'Jam disponible el 31 de octubre',
    'fotos.titulo': 'Fotos y videos',
    'fotos.caption': 'El álbum compartido de la noche',
    'fotos.texto': 'Todo lo que captures esa noche —fotos, videos, evidencia comprometedora— va al <b>álbum compartido</b> para que nadie se quede sin su copia.',
    'fotos.boton': 'Abrir el álbum',
    'fotos.dormido': 'El álbum se abre el día de la fiesta',

    /* ---- FAQ ---- */
    'faq.titulo': 'Preguntas del más allá',
    'faq.caption': 'FAQ',
    'faq.q1': '¿Cuánto cuesta entrar?',
    'faq.a1': 'La cuota es transparente y en vivo: gastos fijos divididos entre confirmados + gastos por persona. El número exacto está en <a href="index.html#cuota">Cuota</a> y baja conforme más gente confirma.',
    'faq.q2': '¿Puedo llevar acompañante?',
    'faq.a2': 'Sí — indícalo al confirmar. <b>Pagan cuota completa</b>, aquí no hay mitades.',
    'faq.q3': '¿Qué pasa si no llevo disfraz?',
    'faq.a3': 'Pagas <b>$200 MXN</b> que van directo al premio del mejor disfraz. Tu flojera financia la gloria de alguien más.',
    'faq.q4': '¿Qué hay de tomar?',
    'faq.a4': 'La <b>comida va incluida</b> en la cuota. Las bebidas no: <b>cada quien trae lo que quiera tomar</b>. Sin listas, sin organizar nada — trae lo tuyo y ya.',
    'faq.q5': '¿Cómo pago mi cuota?',
    'faq.a5': 'Al confirmar te escribimos <b>por WhatsApp</b> con los datos. Por seguridad, nunca se publican en este sitio.',
    'faq.q6': '¿Cómo funcionan los premios?',
    'faq.a6': 'Son <b>6 trofeos esqueleto</b>: 4 se votan desde el celular (el mejor disfraz además gana el premio en efectivo) y 2 comodines los deciden los anfitriones en vivo. Detalles en <a href="premios.html">Premios</a>.',
    'faq.q7': 'Confirmé y no puedo ir 😢',
    'faq.a7': 'Avísanos por WhatsApp lo antes posible: tu lugar afecta la cuota de los demás.',

    /* ---- Premios ---- */
    'prem.titulo': 'Premios',
    'prem.caption': '6 trofeos esqueleto · se vota desde tu celular',
    'prem.votaAqui': 'Se vota aquí, el 31',
    'prem.categorias': '<b>Mejor disfraz</b> — trofeo + <b>el premio en efectivo completo</b> 💰<br><b>Más creativo</b> · <b>Más ridículo</b> · <b>Más terrorífico</b> — trofeo y gloria eterna.',
    'prem.unVoto': '1 voto por persona por categoría. El sistema no perdona tramposos.',
    'prem.comodines': 'Los comodines',
    'prem.comodinesTexto': 'Los otros <b>2 trofeos</b> los deciden los anfitriones en vivo, por puro capricho y justicia poética. Nadie está a salvo.',
    'prem.comodinesNota': 'El monto del premio crece con cada confirmado y cada rebelde sin disfraz — míralo en vivo en la <a href="index.html#confirmados">página principal</a>.',
    'prem.sellada': 'La votación está sellada',
    'prem.selladaTexto': 'Se abre el 31 de octubre durante la fiesta. Vuelve aquí desde tu celular cuando los anfitriones den la señal.',
    'prem.votante': '¿Quién vota? (tu nombre, como confirmaste)',
    'prem.votante.ph': 'Tu nombre',
    'prem.enviar': 'Enviar mis votos',
    'prem.catMejor': 'Mejor disfraz 💰 (gana el premio)',
    'prem.catCreativo': 'Más creativo',
    'prem.catRidiculo': 'Más ridículo',
    'prem.catTerrorifico': 'Más terrorífico',
    'prem.sinCandidatos': 'Sin confirmados para votar',
    'prem.faltaNombre': 'Pon tu nombre para votar.',
    'prem.eligeUno': 'Elige al menos un candidato.',
    'prem.votosOk': '{n} voto(s) registrados. <span class="badge-vas">Contado</span>',
    'prem.votosNo': 'No se registraron votos (¿ya habías votado?).',

    /* ---- WhatsApp prellenado ---- */
    'wa.dudas': '🎃 Hola, tengo una duda sobre PURO SUSTO: ',
    'wa.juego': '🎃 PURO SUSTO — propongo un juego para la noche: ',
    'wa.juegoNombre': '🎃 PURO SUSTO — soy {nombre} y propongo este juego para la noche: ',
    'wa.corregir': '🎃 PURO SUSTO — soy {nombre} y necesito corregir mi confirmación: ',
    'wa.tarde': '🎃 PURO SUSTO — sé que el registro ya cerró, pero sí quiero ir. Soy: ',
    'compartir.texto': '🎃 Estás invitado a PURO SUSTO — 31 de octubre, Tijuana. Confirma aquí… si te atreves:',
  },

  en: {
    'nav.confirmar': 'RSVP',
    'nav.cuota': 'Cost',
    'nav.noche': 'The night',
    'nav.premios': 'Prizes',
    'nav.lugar': 'Venue',
    'pie.links': '<a href="la-noche.html">The night</a> · <a href="premios.html">Prizes &amp; voting</a> · Questions: on WhatsApp.',

    'hero.meta': 'Saturday, October 31, 2026 · 6:00 PM – 1:00 AM',
    'hero.lugar': 'Salón Castilla · Blvd. Viñas del Mar, Tijuana, Mexico',
    'hero.cta': 'Sign up and start that costume 😈',
    'hero.agendar': 'Add to calendar',
    'hero.compartir': 'Share the invite',
    'cd.dias': 'days',
    'cd.horas': 'hours',
    'cd.min': 'min',
    'cd.seg': 'sec',
    'cd.hoy': '<b>IT\'S TONIGHT!</b><span>The party already started 🎃</span>',
    'cd.fin': '<b>THE END</b><span>See you next year</span>',

    'gancho.kicker': 'Trick or treat',
    'gancho.titulo': 'Best costume takes the prize',
    'gancho.sub': 'And the prize <b>grows with every soul who falls</b>. The more of us, the bigger it gets — all you have to do is show up in costume.',
    'gancho.premioLabel': 'The prize keeps growing',
    'gancho.ahora': 'right now',
    'gancho.somos': "We're {n}",
    'gancho.meta': 'goal {n}',
    'gancho.siSomos': 'if we hit {n}',
    'gancho.ahorita': 'Right now we\'re <b>{n}</b>: the prize sits at <b>{bote}</b> and the share at <b>{cuota}</b> a head.',
    'gancho.faltan': '<b>{n}</b> more to get there.',
    'gancho.logrado': "We're past the goal — and the prize keeps climbing with every soul who falls.",
    'gancho.vacio': 'Nobody yet. Whoever falls first starts the prize… and takes top billing on the list.',
    'gancho.cta': 'Sign up and start that costume 😈',
    'gancho.cierre': 'RSVPs close <b>Wednesday, October 28</b> · <b>{n} days</b> left.',
    'gancho.cierreUno': 'RSVPs close <b>tomorrow</b>. Last call.',
    'gancho.cierreHoy': 'RSVPs close <b>tonight at midnight</b>. Last call.',
    'gancho.cerrado': 'RSVPs closed on October 28.',

    'rsvp.titulo': 'Confirm your spot',
    'rsvp.caption': 'Everyone signs up for themselves · costume required',
    'rsvp.soloTu': 'This form signs up <b>you</b>. If you\'re coming with someone, have them open the site and sign up themselves — that way nobody gets counted twice and the math stays honest.',
    'rsvp.nombre': 'Your full name',
    'rsvp.nombre.ph': 'Your name, if you dare…',
    'rsvp.whats': 'Your WhatsApp (never published)',
    'rsvp.whats.ph': '+1 619 123 4567',
    'rsvp.disfraz': 'Are you wearing a costume?',
    'rsvp.disfraz.si': 'Of course 🎃',
    'rsvp.disfraz.no': "No — I'll throw $200 MXN into the prize 😈",
    'rsvp.peques.abrir': "+ I'm bringing little kids (they don't pay)",
    'rsvp.peques.cerrar': '− Remove kids',
    'rsvp.peques.nota': "Little kids get in <b>free</b>: no share, and they don't count when splitting costs. We only list them so they show up on the wall and can win a trophy.",
    'rsvp.peques.cuantos': 'How many kids?',
    'rsvp.peques.n': '{n} kids',
    'rsvp.peques.1': '1 kid',
    'rsvp.peques.nombre': 'Kid {n} name',
    'rsvp.peques.ph': 'Their name',
    'rsvp.dupAviso': "There's already a <b>{nombre}</b> on the list. If that's you, <b>you're already in</b> — don't sign up twice.",
    'rsvp.dupPregunta': 'Someone named "{nombre}" is already on the list.\n\nAre you a different person and want to sign up anyway?',
    'rsvp.bebidas': 'Food is included in the share. <b>Drinks are BYO</b> — bring whatever you like.',
    'rsvp.boton': "I'm in!",
    'rsvp.enviando': 'Summoning…',
    'rsvp.errorRed': 'Something went wrong in the underworld. Try again, or RSVP over WhatsApp.',
    'rsvp.errorGeneral': "Couldn't confirm. Please try again.",
    'rsvp.cerradoTitulo': 'RSVPs are closed',
    'rsvp.cerradoCuerpo': 'We closed on <b>October 28</b> so we could order the food in time. If you really want to sneak in, message Sandy and we\'ll see.',
    'rsvp.cerradoBoton': 'Message Sandy',

    'modal.nuevo': "You're in!",
    'modal.dup': 'Already in',
    'modal.enLista': "<b>{nombre}</b>, you're on the list.",
    'modal.pago': "We'll message you on WhatsApp to sort out payment.",
    'modal.yaEstabas': '<b>{nombre}</b>, you were already on the list — no double scares.',
    'modal.disfraz': 'Noted: {n} without a costume. +{monto} to the prize. 😈',
    'modal.juegoPregunta': "While you're here: got a party game that never fails?",
    'modal.juegoBoton': 'Suggest a game',
    'modal.corregir': 'Got something wrong? <a href="{url}" target="_blank" rel="noopener">Message us on WhatsApp</a> and we\'ll fix it.',
    'modal.cerrar': 'Close',

    'conf.titulo': "Who's already in",
    'conf.caption': 'Public list · live',
    'conf.personas': 'paying guests',
    'conf.cuota': 'share per person (live)',
    'conf.bote': 'best costume prize 💰',
    'conf.cargando': 'Loading the list…',
    'conf.vacio': 'Nobody yet… be the first 🩸',
    'conf.invitadoDe': "{nombre}'s kid",
    'conf.invitadoPor': 'Coming with {nombre}',
    'conf.peque': 'kid · free',
    'conf.conQuien': 'with {nombre}',
    'conf.masPeques': '+{n} kids free',
    'conf.masRebeldes': '{n} without a costume (+{monto} to the prize)',
    'conf.todosDisfrazados': 'Nobody has chickened out of the costume yet 🎃',
    'conf.numero': '#{n}',
    'gastos.titulo': 'Cost breakdown',
    'gastos.caption': 'Full transparency: every expense is listed here',
    'gastos.concepto': 'Item',
    'gastos.tipo': 'Type',
    'gastos.monto': 'Amount (MXN)',
    'gastos.cargando': 'Loading expenses…',
    'gastos.fijo': 'Fixed · split',
    'gastos.porPersona': 'Per person',
    'gastos.cu': ' ea.',
    'gastos.totalFijo': 'Fixed total',
    'cuota.titulo': 'How your share is calculated',
    'cuota.explica': '<b>Fixed</b> costs are split among everyone who pays; <b>per person</b> costs are charged per head. Little kids don\'t pay and don\'t count toward the split. The more of us there are, the cheaper the scare.',
    'cuota.formula': '{fijo} ÷ {personas} people + {porPersona} = {cuota} per person',
    'cuota.formulaVacia': '{fijo} ÷ confirmed + {porPersona} per person',
    'cuota.nota': 'The best-costume prize grows with every person who confirms (a seed per head) and with every rebel who shows up without a costume (+$200 MXN).',

    'explora.noche': 'The full night →',
    'explora.nocheDesc': 'Schedule, house rules, the Jam for your music, photos and games.',
    'explora.premios': 'Prizes & voting →',
    'explora.premiosDesc': '6 skeleton trophies. Voting opens here on the 31st.',
    'lugar.titulo': 'The lair',
    'lugar.caption': 'Salón Castilla · Blvd. Viñas del Mar, Tijuana, Mexico',
    'lugar.comoLlegar': 'Get directions',
    'lugar.dudas': 'Questions? WhatsApp',

    'noche.titulo': 'The night',
    'noche.caption': 'Saturday, October 31 · 6:00 PM – 1:00 AM · Salón Castilla',
    'noche.horario': 'Schedule',
    'noche.h1': 'Doors open. Music, snacks and fog.',
    'noche.h2': 'Dinner.',
    'noche.h3': 'Costume runway: everybody walks.',
    'noche.h4': '<a href="premios.html">Voting</a> opens on your phone.',
    'noche.h5': 'Awards: 6 skeleton trophies.',
    'noche.h6': 'Open Jam and games until you drop.',
    'noche.h7': 'The scare ends. See you next year.',
    'noche.reglas': 'House rules',
    'noche.r1': '<b>No costume, you pay $200 MXN</b> — every peso goes to the best-costume prize.',
    'noche.r2': '<b>Full transparency:</b> every peso spent is published in the <a href="index.html#cuota">breakdown</a>.',
    'noche.r3': '<b>Guests welcome</b> — they pay a full share, same as everyone.',
    'noche.r4': '<b>Payment is arranged over WhatsApp.</b> You will never see account numbers on this site.',
    'juegos.titulo': 'Games',
    'juegos.caption': 'Pitch yours',
    'juegos.texto': "There'll be games all night. Got one that never fails? <b>Send us your pitch on WhatsApp</b> and it joins the line-up. This one's <b>open already</b> — no need to wait for the 31st.",
    'juegos.boton': 'Suggest a game',
    'jam.titulo': 'The Jam',
    'jam.caption': 'You pick the music · live Spotify Jam',
    'jam.texto': 'We build the playlist together with a <b>Spotify Jam</b>: join from your phone and queue whatever you want — from Thriller to corridos, no judgment (well, a little).',
    'jam.boton': 'Join the Jam',
    'jam.dormido': 'Jam opens October 31',
    'fotos.titulo': 'Photos & videos',
    'fotos.caption': 'The shared album of the night',
    'fotos.texto': 'Everything you capture that night —photos, videos, incriminating evidence— goes to the <b>shared album</b> so nobody misses out.',
    'fotos.boton': 'Open the album',
    'fotos.dormido': 'The album opens on party day',

    'faq.titulo': 'Questions from beyond',
    'faq.caption': 'FAQ',
    'faq.q1': 'How much does it cost?',
    'faq.a1': 'The share is transparent and live: fixed costs split among everyone confirmed, plus per-person costs. The exact number is under <a href="index.html#cuota">Cost</a>, and it drops as more people confirm.',
    'faq.q2': 'Can I bring someone?',
    'faq.a2': 'Yes — just say so when you RSVP. <b>They pay a full share</b>, no half prices here.',
    'faq.q3': 'What if I skip the costume?',
    'faq.a3': 'You pay <b>$200 MXN</b> that goes straight to the best-costume prize. Your laziness funds somebody else\'s glory.',
    'faq.q4': "What's there to drink?",
    'faq.a4': '<b>Food is included</b> in the share. Drinks are not: <b>bring whatever you want to drink</b>. No lists, no coordinating — just bring yours.',
    'faq.q5': 'How do I pay my share?',
    'faq.a5': 'Once you confirm we message you <b>on WhatsApp</b> with the details. For safety, they are never published on this site.',
    'faq.q6': 'How do the prizes work?',
    'faq.a6': "There are <b>6 skeleton trophies</b>: 4 are voted from your phone (best costume also takes the cash prize) and 2 wildcards are decided live by the hosts. Details under <a href=\"premios.html\">Prizes</a>.",
    'faq.q7': "I confirmed but I can't make it 😢",
    'faq.a7': 'Tell us on WhatsApp as soon as you can: your spot affects everyone else\'s share.',

    'prem.titulo': 'Prizes',
    'prem.caption': '6 skeleton trophies · voted from your phone',
    'prem.votaAqui': 'Voting happens here, on the 31st',
    'prem.categorias': '<b>Best costume</b> — trophy + <b>the entire cash prize</b> 💰<br><b>Most creative</b> · <b>Most ridiculous</b> · <b>Most terrifying</b> — trophy and eternal glory.',
    'prem.unVoto': '1 vote per person per category. The system does not forgive cheaters.',
    'prem.comodines': 'The wildcards',
    'prem.comodinesTexto': 'The other <b>2 trophies</b> are decided live by the hosts, out of pure whim and poetic justice. Nobody is safe.',
    'prem.comodinesNota': 'The prize grows with every person who confirms and every rebel without a costume — watch it live on the <a href="index.html#confirmados">home page</a>.',
    'prem.sellada': 'Voting is sealed',
    'prem.selladaTexto': 'It opens on October 31 during the party. Come back here from your phone when the hosts give the signal.',
    'prem.votante': "Who's voting? (your name, as you confirmed it)",
    'prem.votante.ph': 'Your name',
    'prem.enviar': 'Send my votes',
    'prem.catMejor': 'Best costume 💰 (takes the prize)',
    'prem.catCreativo': 'Most creative',
    'prem.catRidiculo': 'Most ridiculous',
    'prem.catTerrorifico': 'Most terrifying',
    'prem.sinCandidatos': 'No confirmed guests to vote for yet',
    'prem.faltaNombre': 'Enter your name to vote.',
    'prem.eligeUno': 'Pick at least one candidate.',
    'prem.votosOk': '{n} vote(s) recorded. <span class="badge-vas">Counted</span>',
    'prem.votosNo': 'No votes were recorded (did you already vote?).',

    'wa.dudas': '🎃 Hi! I have a question about PURO SUSTO: ',
    'wa.juego': '🎃 PURO SUSTO — here\'s a game I\'d like to pitch for the night: ',
    'wa.juegoNombre': "🎃 PURO SUSTO — I'm {nombre} and I'd like to pitch this game for the night: ",
    'wa.corregir': "🎃 PURO SUSTO — I'm {nombre} and I need to fix my RSVP: ",
    'wa.tarde': "🎃 PURO SUSTO — I know RSVPs closed, but I'd still like to come. I'm: ",
    'compartir.texto': "🎃 You're invited to PURO SUSTO — October 31, Tijuana. RSVP here… if you dare:",
  },
};

/* ---------------- Estado ---------------- */
const IDIOMAS = ['es', 'en'];
const LS_KEY = 'puro-susto-idioma';

function idiomaGuardado() {
  try { return localStorage.getItem(LS_KEY); } catch (_) { return null; }
}
function guardarIdioma(l) {
  try { localStorage.setItem(LS_KEY, l); } catch (_) { /* modo privado: ni modo */ }
}

/* Prioridad: ?lang= en la URL > lo que eligió antes > idioma del navegador > español. */
function idiomaInicial() {
  const url = new URLSearchParams(location.search).get('lang');
  if (IDIOMAS.includes(url)) return url;

  const guardado = idiomaGuardado();
  if (IDIOMAS.includes(guardado)) return guardado;

  const nav = (navigator.language || 'es').toLowerCase();
  return nav.startsWith('en') ? 'en' : 'es';
}

let IDIOMA = idiomaInicial();
function idioma() { return IDIOMA; }

/* t('clave', {n: 3}) — si falta la clave devuelve la clave, para que salte a la vista. */
function t(clave, vars) {
  let s = (TEXTOS[IDIOMA] && TEXTOS[IDIOMA][clave]) || (TEXTOS.es && TEXTOS.es[clave]);
  if (s == null) return clave;
  if (vars) {
    Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
  }
  return s;
}

/* ---------------- Pintar el DOM ---------------- */
function aplicarIdioma() {
  document.documentElement.lang = IDIOMA;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    el.placeholder = t(el.getAttribute('data-i18n-ph'));
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });

  // Opciones del select de peques: el 1 es singular, el resto plural.
  const selPeques = document.getElementById('f-peques');
  if (selPeques) {
    Array.prototype.forEach.call(selPeques.options, (op) => {
      const n = Number(op.value);
      if (n === 1) op.textContent = t('rsvp.peques.1');
      else if (n >= 2) op.textContent = t('rsvp.peques.n', { n });
    });
  }

  document.querySelectorAll('.lang-toggle button').forEach((b) => {
    b.setAttribute('aria-current', String(b.dataset.lang === IDIOMA));
  });

  // Que el resto de la app repinte lo que arma por JS (gastos, lista, selects…).
  document.dispatchEvent(new CustomEvent('idioma-cambiado', { detail: IDIOMA }));
}

function cambiarIdioma(nuevo) {
  if (!IDIOMAS.includes(nuevo) || nuevo === IDIOMA) return;
  IDIOMA = nuevo;
  guardarIdioma(nuevo);
  aplicarIdioma();
}

/* Inyecta el switch en el header. Va FUERA de nav.links porque esa lista
   se oculta en móvil — el toggle tiene que verse siempre. */
function montarToggle() {
  document.querySelectorAll('.nav-inner').forEach((cont) => {
    if (cont.querySelector('.lang-toggle')) return;
    const div = document.createElement('div');
    div.className = 'lang-toggle';
    div.setAttribute('role', 'group');
    div.setAttribute('aria-label', 'Idioma / Language');
    div.innerHTML =
      '<button type="button" data-lang="es">ES</button>' +
      '<span aria-hidden="true">/</span>' +
      '<button type="button" data-lang="en">EN</button>';
    div.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-lang]');
      if (b) cambiarIdioma(b.dataset.lang);
    });
    cont.appendChild(div);
  });
}

montarToggle();
aplicarIdioma();
