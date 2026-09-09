const PROYECTOS = [
  {
    id: 1,
    slug: 'horizonte.html',
    title: 'Horizonte',
    category: 'Branding',
    cardClass: 'card-pair',
    cardImage: 'IMAGENES/Horizonte/horizonte-imagen-principal.png',
    cardAlt: 'Horizonte - Creación de marca',
    role: 'Identidad de marca: concepto, sistema visual y aplicaciones',
    tools: 'Illustrator, Photoshop',
    galleryContain: false,
    galleryLayout: 'spread',
    gallery: [
      { src: 'IMAGENES/Horizonte/horizonte-calle.jpg', thumb: 'IMAGENES/Horizonte/horizonte-calle-thumb.jpg', alt: 'Horizonte en calle' },
      { src: 'IMAGENES/Horizonte/horizonte-tarjeta.jpg', thumb: 'IMAGENES/Horizonte/horizonte-tarjeta-thumb.jpg', alt: 'Tarjeta de presentación Horizonte' },
      { src: 'IMAGENES/Horizonte/horizonte-bolsa.jpg', thumb: 'IMAGENES/Horizonte/horizonte-bolsa-thumb.jpg', alt: 'Bolsa Horizonte' },
      { src: 'IMAGENES/Horizonte/horizonte-pin.jpg', thumb: 'IMAGENES/Horizonte/horizonte-pin-thumb.jpg', alt: 'Pin de logo Horizonte' }
    ],
    processTitle: 'Cómo se pensó este proyecto',
    process: [
      {
        title: 'Cómo se pensó este proyecto',
        text: 'Horizonte surge de explorar un estudio de diseño que mira adelante. El concepto conecta "horizonte" con nuevas perspectivas. Se desarrolló una identidad que comunica innovación, claridad y amplitud, pensando en cómo el estudio se proyecta hacia el futuro del diseño gráfico.'
      },
      {
        title: 'Desarrollo y exploración',
        text: 'El proceso partió de la investigación sobre la marca Horizonte. Se exploraron múltiples direcciones visuales, definiendo tipografía y paleta. Se trabajó en soportes: señalética urbana, papelería, merchandising y piezas digitales, probando la flexibilidad del sistema en cada aplicación.'
      },
      {
        title: 'Resultado conceptual',
        text: 'Se logró un sistema de identidad completo y cohesivo. Funciona en múltiples contextos desde la calle hasta una tarjeta. Cada elemento refuerza la idea de una visión amplia y proyectada, manteniendo coherencia visual y comunicando valores de la marca constantemente.'
      }
    ],
    actions: [
      {
        label: 'Manual de marca',
        href: 'DOCUMENTOS/Manual-marca-Horizonte.pdf',
        download: 'Manual-marca-Horizonte.pdf'
      }
    ],
    related: [2, 3]
  },
  {
    id: 2,
    slug: 'mayo-amarillo.html',
    title: 'Mayo Amarillo',
    category: 'Campaña',
    cardClass: 'card-pair',
    cardImage: 'IMAGENES/Mayo amarillo/mayo-amarillo-card.jpg',
    cardAlt: 'Mayo Amarillo - Campaña',
    role: 'Campaña de concientización: concepto, piezas gráficas y piezas digitales',
    tools: 'Photoshop, Illustrator',
    galleryContain: true,
    galleryLayout: 'poster',
    gallery: [
      { src: 'IMAGENES/Mayo amarillo/Afiche-de-campana.webp', alt: 'Afiche de campaña Mayo Amarillo' },
      { src: 'IMAGENES/Mayo amarillo/5-PosteoIgMayo.webp', alt: 'Posteo Instagram Mayo Amarillo 5' },
      { src: 'IMAGENES/Mayo amarillo/4-PosteoIGMayoa.jpg', thumb: 'IMAGENES/Mayo amarillo/4-PosteoIGMayoa-thumb.jpg', alt: 'Posteo Instagram Mayo Amarillo 4' },
      { src: 'IMAGENES/Mayo amarillo/1-PosteoIgMayoA.webp', alt: 'Posteo Instagram Mayo Amarillo EN VIVO' }
    ],
    processTitle: 'Cómo se pensó este proyecto',
    process: [
      {
        title: 'Cómo se pensó esta campaña',
        text: 'Mayo Amarillo busca concientizar sobre la responsabilidad humana en el tránsito. La campaña impacta emocionalmente y genera reflexión sobre las consecuencias, usando la narrativa visual como herramienta de comunicación efectiva en espacios públicos y medios.'
      },
      {
        title: 'Desarrollo y producción',
        text: 'El proceso involucró investigación sobre casos reales y desarrollo de conceptos visuales, transmitiendo urgencia y responsabilidad en piezas tradicionales y digitales. Se trabajó con selective color para resaltar elementos clave del mensaje central.'
      },
      {
        title: 'Resultado y alcance',
        text: 'La campaña logró generar conciencia sobre la seguridad vial con mensajes claros, visualmente impactantes que conectan con la audiencia en múltiples canales, funcionando en formato impreso y redes sociales y manteniendo coherencia visual constantemente.'
      }
    ],
    actions: [
      {
        label: 'Información de la campaña',
        href: 'DOCUMENTOS/Mayo-amarillo-porfolio.pdf',
        download: 'Mayo-amarillo-porfolio.pdf'
      }
    ],
    related: [1, 4]
  },
  {
    id: 3,
    slug: 'totem-de-cafe.html',
    title: 'Totem de Café',
    category: 'UX/UI',
    cardClass: 'card-third',
    cardImage: 'IMAGENES/Totem Cafe/totem-cafe.jpg',
    cardAlt: 'Totem de Café - Interfaz digital',
    role: 'Diseño UX/UI end-to-end: flujos, pantallas y prototipo interactivo',
    tools: 'Figma',
    galleryContain: true,
    galleryLayout: 'screens',
    gallery: [
      { src: 'IMAGENES/Totem Cafe/totem-cafe-hq.png', thumb: 'IMAGENES/Totem Cafe/totem-cafe-thumb.jpg', alt: 'Totem de Café - Menú principal' },
      { src: 'IMAGENES/Totem Cafe/totem-recarga-hq.png', thumb: 'IMAGENES/Totem Cafe/totem-recarga-thumb.jpg', alt: 'Recarga completada Totem de Café' },
      { src: 'IMAGENES/Totem Cafe/totem-pago-hq.png', thumb: 'IMAGENES/Totem Cafe/totem-pago-thumb.jpg', alt: 'Pago Totem de Café' },
      { src: 'IMAGENES/Totem Cafe/totem-compra-hq.png', thumb: 'IMAGENES/Totem Cafe/totem-compra-thumb.jpg', alt: 'Gracias por su compra Totem de Café' }
    ],
    processTitle: 'Cómo se pensó este proyecto',
    process: [
      {
        title: 'Problema',
        text: 'En una cafetería, el pedido en mostrador genera filas, dudas sobre el menú y fricción al pagar. Hacía falta una interfaz de totem clara para elegir, confirmar y pagar sin depender de una explicación oral.'
      },
      {
        title: 'Mi rol',
        text: 'Diseñé la experiencia de punta a punta: flujos de usuario, arquitectura de pantallas, prototipo interactivo en Figma y criterios de usabilidad para menú, recarga y métodos de pago.'
      },
      {
        title: 'Decisión clave',
        text: 'Prioricé un recorrido lineal y predecible (menú → pedido → pago → confirmación) en lugar de un menú denso con muchas opciones a la vez. Menos carga cognitiva, más velocidad en el totem.'
      },
      {
        title: 'Resultado',
        text: 'Un prototipo navegable que demuestra un pedido completo en pocos pasos, con pantallas consistentes y un flujo listo para validar con usuarios reales o pasar a desarrollo.'
      }
    ],
    actions: [
      {
        label: 'Documentación del proyecto',
        href: 'DOCUMENTOS/Totem-porfolio.pdf',
        download: 'Totem-porfolio.pdf'
      },
      {
        label: 'Ver prototipo en Figma',
        href: 'https://www.figma.com/proto/G9Ekaxi9RBCIMgIpGvHD1L/Totem-de-Caf%C3%A9?node-id=144-176&t=isyDNesqZTwTblLN-1&scaling=scale-down&content-scaling=fixed&page-id=74%3A556&starting-point-node-id=80%3A1112',
        external: true
      }
    ],
    related: [1, 4]
  },
  {
    id: 4,
    slug: 'proyecto-fotografico.html',
    title: 'Proyecto Fotográfico',
    category: 'Fotografía',
    cardClass: 'card-pair',
    cardImage: 'IMAGENES/Proyecto fotografico/fotografia cerveza.jpg',
    cardAlt: 'Proyecto Fotográfico',
    role: 'Fotografía de producto y exploración técnica',
    tools: 'Cámara, Lightroom, Photoshop',
    galleryContain: true,
    galleryLayout: 'essay',
    gallery: [
      { src: 'IMAGENES/Proyecto fotografico/fotografia cerveza.jpg', thumb: 'IMAGENES/Proyecto fotografico/foto-cerveza-thumb.jpg', alt: 'Fotografía cerveza' },
      { src: 'IMAGENES/Proyecto fotografico/joyeriaCreacion.jpg', thumb: 'IMAGENES/Proyecto fotografico/foto-joyeria-thumb.jpg', alt: 'Joyeria Creación' },
      { src: 'IMAGENES/Proyecto fotografico/foto-lo-que-no-vemos4.jpg', thumb: 'IMAGENES/Proyecto fotografico/lo-que-no-vemos4-thumb.jpg', alt: 'Lo que no vemos 4' },
      { src: 'IMAGENES/Proyecto fotografico/foto-lo-que-no-vemos.jpg', thumb: 'IMAGENES/Proyecto fotografico/lo-que-no-vemos-thumb.jpg', alt: 'Lo que no vemos' }
    ],
    processTitle: 'Cómo se pensó este proyecto',
    process: [
      {
        title: 'Objetivo',
        text: 'Explorar diferentes técnicas fotográficas para capturar la esencia de productos y espacios, combinando creatividad técnica con narrativa visual para comunicar mensajes de marca de manera impactante.'
      },
      {
        title: 'Técnicas aplicadas',
        text: 'Implementé técnicas avanzadas como barrido para crear dinamismo y movimiento, junto con iluminación controlada y composición estratégica para destacar texturas, colores y detalles que potencian la identidad visual de cada producto.'
      },
      {
        title: 'Resultado',
        text: 'Una serie fotográfica que integra diferentes técnicas creativas aplicadas a la fotografía de producto y espacios, generando imágenes que se transforman en recursos visuales para campañas publicitarias, packaging y material promocional.'
      }
    ],
    actions: [
      {
        label: 'Documentación del proyecto',
        href: 'DOCUMENTOS/Proyecto-fotografico-porfolio.pdf',
        download: 'Proyecto-fotografico-porfolio.pdf'
      }
    ],
    related: [1, 3]
  },
  {
    id: 5,
    slug: 'campana-reel-ort.html',
    title: 'Campaña Reel ORT',
    category: 'Audiovisual',
    cardClass: 'card-pair',
    cardImage: 'IMAGENES/Campana reel ORT/ort-reel-card.jpg',
    cardAlt: 'Campaña Reel ORT',
    role: 'Reel promocional: concepto, generación audiovisual y edición',
    tools: 'ChatGPT, Runway, Premiere',
    galleryContain: true,
    galleryLayout: 'storyboard',
    gallery: [
      {
        type: 'drive',
        src: 'https://drive.google.com/file/d/1jJUfmDSgZgIW8X82zi6upIzRgT_ATak-/view?usp=sharing',
        poster: 'IMAGENES/Campana reel ORT/ort-frame1.jpg',
        thumb: 'IMAGENES/Campana reel ORT/ort-frame1-thumb.jpg',
        alt: 'Reel final Campaña ORT'
      },
      { src: 'IMAGENES/Campana reel ORT/ort-frame1.jpg', thumb: 'IMAGENES/Campana reel ORT/ort-frame1-thumb.jpg', alt: 'Frame 1 - Entrada ORT' },
      { src: 'IMAGENES/Campana reel ORT/ort-frame2.jpg', thumb: 'IMAGENES/Campana reel ORT/ort-frame2-thumb.jpg', alt: 'Frame 2' },
      { src: 'IMAGENES/Campana reel ORT/ort-frame3.jpg', thumb: 'IMAGENES/Campana reel ORT/ort-frame3-thumb.jpg', alt: 'Frame 3' }
    ],
    processTitle: 'Cómo se pensó este proyecto',
    process: [
      {
        title: 'Concepto y personaje',
        text: 'A partir del brief de ORT se definió la narrativa del reel y se creó un personaje con ChatGPT. Desde ahí se generaron las imágenes clave que guían la historia visual de la campaña.'
      },
      {
        title: 'Video y voces con IA',
        text: 'Las piezas fijas pasaron a movimiento en Runway, generando las secuencias de video. Las voces también se generaron con inteligencia artificial, alineadas al tono y al ritmo del relato.'
      },
      {
        title: 'Edición y pieza final',
        text: 'El material se editó en Premiere para unir imagen, video y voces generadas con IA. El resultado es un reel promocional que combina creación de personaje, generación audiovisual y postproducción.'
      }
    ],
    actions: [
      {
        label: 'Documentación del proyecto',
        href: 'DOCUMENTOS/ORT-porfolio.pdf',
        download: 'ORT-porfolio.pdf'
      },
      {
        label: 'Ver reel en Drive',
        href: 'https://drive.google.com/file/d/1jJUfmDSgZgIW8X82zi6upIzRgT_ATak-/view?usp=sharing',
        external: true
      }
    ],
    related: [1, 2]
  },
  {
    id: 6,
    slug: 'noir-estudio.html',
    title: 'Noir Estudio',
    category: 'Branding',
    cardClass: 'card-third',
    cardImage: 'IMAGENES/Noir Estudio/noir-interior-card.jpg',
    cardAlt: 'Noir Estudio - Identidad de marca',
    role: 'Dirección de identidad: concepto, sistema visual y aplicaciones',
    tools: 'Figma',
    galleryContain: true,
    galleryLayout: 'boutique',
    hideMeta: true,
    gallery: [
      { src: 'IMAGENES/Noir Estudio/noir-interior.jpg', thumb: 'IMAGENES/Noir Estudio/noir-interior-thumb.jpg', alt: 'Interior Noir Barbería & Estilo' },
      { src: 'IMAGENES/Noir Estudio/noir-herramientas.jpg', thumb: 'IMAGENES/Noir Estudio/noir-herramientas-thumb.jpg', alt: 'Herramientas y productos Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-experiencia.jpg', thumb: 'IMAGENES/Noir Estudio/noir-experiencia-thumb.jpg', alt: 'Experiencia Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-productos.jpg', thumb: 'IMAGENES/Noir Estudio/noir-productos-thumb.jpg', alt: 'Línea de coloración Noir Estudio' }
    ],
    processTitle: 'Cómo se pensó este proyecto',
    process: [
      {
        title: 'Problema',
        text: 'Noir Estudio necesitaba una identidad premium para barbería & estilo: verse exclusivo sin perder claridad en local, packaging y comunicación. El riesgo era caer en un look genérico “oscuro” sin sistema.'
      },
      {
        title: 'Mi rol',
        text: 'Definí el concepto de marca y construí el sistema visual en Figma: logo, aplicaciones, mockups de productos, ambientación del espacio y piezas de comunicación con una misma lógica tipográfica y cromática.'
      },
      {
        title: 'Decisión clave',
        text: 'Elegí una paleta de negros/carbón con acentos dorados y tipografía limpia, en vez de sobrecargar con texturas o efectos. La sobriedad sostiene la percepción premium y escala mejor a distintos soportes.'
      },
      {
        title: 'Resultado',
        text: 'Un universo de marca coherente entre interior, productos y piezas gráficas, listo para presentarse como caso de estudio y para iterar aplicaciones reales del local.'
      }
    ],
    actions: [
      {
        label: 'Documentación del proyecto',
        href: 'DOCUMENTOS/Noir-estudio-porfolio.pdf',
        download: 'Noir-estudio-porfolio.pdf'
      },
      {
        label: 'Ver diseño en Figma',
        href: 'https://www.figma.com/design/NUjf3slMWEIzsOJaHKwF4n/Noir-Estudio?node-id=321-15&t=XFBXzoCxvzPb1thY-1',
        external: true
      }
    ],
    related: [3, 1]
  },
  {
    id: 7,
    slug: 'don-pascual.html',
    title: 'Don Pascual',
    pageTitle: 'Don Pascual — Campaña Edición Limitada Invierno 2026',
    category: 'Campaña',
    cardClass: 'card-third',
    cardImage: 'IMAGENES/Don pascual/don-pascual-card.jpg',
    cardAlt: 'Don Pascual - Edición Limitada Invierno 2026',
    role: 'Campaña integral: concepto, piezas fijas, video y audio',
    tools: 'ChatGPT, Runway, Suno, ElevenLabs',
    galleryContain: true,
    galleryLayout: 'campaign',
    hideMeta: true,
    processLayout: 'editorial',
    editorial: {
      intro: 'Una campaña de edición limitada pensada para que etiqueta, piezas gráficas y video compartan la misma atmósfera de invierno.',
      bottle: {
        src: 'IMAGENES/Don pascual/don pascualfinal.png?v=20260908u',
        alt: 'Botella Don Pascual Chardonnay Edición Limitada 2026'
      },
      steps: [
        {
          src: 'IMAGENES/Don pascual/don-pascual-campana.jpg',
          alt: 'Mockup de campaña Don Pascual junto al fuego'
        },
        {
          src: 'IMAGENES/Don pascual/Plano 5-Miradas complices.png',
          alt: 'Miradas cómplices junto al fuego con Don Pascual'
        },
        {
          src: 'IMAGENES/Don pascual/Plano 6-Copas chocando.png',
          alt: 'Copas de Don Pascual brindando junto al fuego'
        },
        {
          src: 'IMAGENES/Don pascual/cartel omnibus2.png',
          alt: 'Campaña Don Pascual en ómnibus'
        }
      ],
      gallery: [
        { src: 'IMAGENES/Don pascual/don-pascual-etiqueta.jpg', alt: 'Etiqueta con ilustración Don Pascual', shape: 'trio' },
        { src: 'IMAGENES/Don pascual/don-pascual-afiche.jpg', alt: 'Afiche Don Pascual Edición Limitada', shape: 'trio' },
        { src: 'IMAGENES/Don pascual/don-pascual-botella-fuego.jpg', alt: 'Botella Don Pascual junto al fuego', shape: 'trio' },
        { src: 'IMAGENES/Don pascual/cartel omnibus2.png', alt: 'Campaña Don Pascual en ómnibus', shape: 'bus' }
      ]
    },
    gallery: [
      {
        type: 'drive',
        src: 'https://drive.google.com/file/d/1WydlpYJ0gdyQRTn3j-sHAU-dG0CKaq5O/view?usp=sharing',
        poster: 'IMAGENES/Don pascual/don-pascual-botella-fuego.jpg',
        thumb: 'IMAGENES/Don pascual/don-pascual-botella-fuego-thumb.jpg',
        alt: 'Video campaña Don Pascual Edición Limitada Invierno 2026'
      },
      { src: 'IMAGENES/Don pascual/don-pascual-afiche.jpg', thumb: 'IMAGENES/Don pascual/don-pascual-afiche-thumb.jpg', alt: 'Afiche Don Pascual Edición Limitada' },
      { src: 'IMAGENES/Don pascual/don-pascual-campana.jpg', thumb: 'IMAGENES/Don pascual/don-pascual-campana-thumb.jpg', alt: 'Mockup terminado campaña Don Pascual' },
      { src: 'IMAGENES/Don pascual/don-pascual-botella.jpg', thumb: 'IMAGENES/Don pascual/don-pascual-botella-thumb.jpg', alt: 'Botella Don Pascual Chardonnay 2026' },
      { src: 'IMAGENES/Don pascual/don-pascual-etiqueta.jpg', thumb: 'IMAGENES/Don pascual/don-pascual-etiqueta-thumb.jpg', alt: 'Etiqueta con ilustración Don Pascual' },
      { src: 'IMAGENES/Don pascual/don-pascual-omnibus.jpg?v=20260807g', thumb: 'IMAGENES/Don pascual/don-pascual-omnibus-thumb.jpg?v=20260807g', alt: 'Mockup publicidad en ómnibus Don Pascual' }
    ],
    processTitle: 'Cómo se pensó este proyecto',
    process: [
      {
        title: 'Problema',
        text: 'La Edición Limitada Invierno 2026 de Don Pascual necesitaba una campaña premium coherente: etiqueta, video y piezas de comunicación con una misma atmósfera, sin parecer un collage de herramientas distintas.'
      },
      {
        title: 'Mi rol',
        text: 'Definí el concepto creativo y produje el sistema de campaña: reinterpretación de marca, etiqueta ilustrada, afiche, aplicaciones y video promocional con música y voces alineadas al tono.'
      },
      {
        title: 'Decisión clave',
        text: 'Prioricé una narrativa cálida de invierno —íntima y contemporánea— y usé IA solo donde aceleraba producción (imagen, movimiento, audio), manteniendo dirección creativa y coherencia visual en todas las piezas.'
      },
      {
        title: 'Resultado',
        text: 'Un set de campaña listo para presentar: etiqueta, mockups de marca, piezas gráficas y video publicitario que conectan el producto con una atmósfera de cosecha especial.'
      }
    ],
    actions: [
      {
        label: 'Documentación del proyecto',
        href: 'DOCUMENTOS/DON-PASCUAL.pdf',
        download: 'DON-PASCUAL.pdf'
      },
      {
        label: 'Ver video en Drive',
        href: 'https://drive.google.com/file/d/1WydlpYJ0gdyQRTn3j-sHAU-dG0CKaq5O/view?usp=sharing',
        external: true
      }
    ],
    related: [6, 5]
  },
  {
    id: 8,
    slug: 'ubicar-gps.html',
    title: 'Ubicar GPS',
    pageTitle: 'Ubicar GPS — Tecnología que te acompaña',
    category: 'Identidad',
    cardClass: 'card-third',
    cardImage: 'IMAGENES/Ubicar gps/Ubicar Logo.png',
    cardAlt: 'Vidriera Ubicar GPS',
    role: 'Sistema visual de vidriera: iconos, piezas de producto y marca en local',
    tools: 'Illustrator, Photoshop',
    galleryContain: true,
    hideMeta: true,
    processLayout: 'trail',
    trail: {
      intro: 'Un sistema de comunicación para rastreo y seguridad: iconos, piezas de producto y vidriera con un mismo hilo naranja.',
      steps: [
        {
          src: 'IMAGENES/Ubicar gps/Camaras Final.webp',
          alt: 'Pieza Ubicar GPS de cámaras de seguridad',
          w: 1341,
          h: 2000
        },
        {
          src: 'IMAGENES/Ubicar gps/Iconos Finales.webp',
          alt: 'Sistema de iconos Ubicar GPS',
          w: 2000,
          h: 1602
        },
        {
          src: 'IMAGENES/Ubicar gps/Flotas Final.webp',
          alt: 'Pieza Ubicar GPS de rastreo satelital para flotas',
          w: 1341,
          h: 2000
        }
      ],
      result: [
        { src: 'IMAGENES/Ubicar gps/flotas y camaras.webp', alt: 'Vidriera Ubicar GPS de flotas y cámaras', w: 1050, h: 1400 },
        { src: 'IMAGENES/Ubicar gps/iconos1 vehiculos.webp', alt: 'Iconos Ubicar GPS para vehículos, mascotas y cámaras', w: 1120, h: 1400 },
        { src: 'IMAGENES/Ubicar gps/iconos2 gps.webp', alt: 'Iconos Ubicar GPS para niños, SOS y cámaras espía', w: 1120, h: 1400 },
        { src: 'IMAGENES/Ubicar gps/Ubicar Logo.webp', alt: 'Logo Ubicar GPS aplicado en vidriera', w: 1050, h: 1400 }
      ]
    },
    gallery: [],
    processTitle: 'Cómo se pensó este proyecto',
    process: [
      {
        title: 'Problema',
        text: 'Ubicar GPS tenía que explicar servicios técnicos —cámaras, rastreo, alertas— en vidriera y piezas de marca, sin saturar ni parecer un catálogo de fichas sueltas.'
      },
      {
        title: 'Mi rol',
        text: 'Organicé la oferta en un sistema visual simple: iconografía, jerarquía tipográfica y piezas de producto que se leen de un vistazo, con el naranja como hilo conductor.'
      },
      {
        title: 'Decisión clave',
        text: 'Traduje beneficios técnicos a mensajes visuales. Cada línea (cámaras, flotas, iconos de servicio) tiene su pieza, pero todas hablan con la misma gramática.'
      },
      {
        title: 'Resultado',
        text: 'Un sistema coherente aplicado en el local: logo, iconos y vidrieras que conectan producto, servicio y marca en un mismo recorrido.'
      }
    ],
    actions: [],
    related: [7, 6]
  }
];
