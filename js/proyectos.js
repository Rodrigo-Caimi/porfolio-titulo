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
    galleryLayout: 'spread',
    gallery: [
      { src: 'IMAGENES/Horizonte/horizonte-calle.jpg', alt: 'Horizonte en calle' },
      { src: 'IMAGENES/Horizonte/horizonte-tarjeta.jpg', alt: 'Tarjeta de presentación Horizonte' },
      { src: 'IMAGENES/Horizonte/horizonte-bolsa.jpg', alt: 'Bolsa Horizonte' },
      { src: 'IMAGENES/Horizonte/horizonte-pin.jpg', alt: 'Pin de logo Horizonte' }
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
    hideMeta: true,
    processLayout: 'mayo',
    galleryLayout: 'poster',
    gallery: [
      { src: 'IMAGENES/Mayo amarillo/Afiche-de-campana.webp', alt: 'Afiche de campaña Mayo Amarillo' },
      { src: 'IMAGENES/Mayo amarillo/5-PosteoIgMayo.webp', alt: 'Posteo Instagram Mayo Amarillo 5' },
      { src: 'IMAGENES/Mayo amarillo/4-PosteoIGMayoa.jpg', alt: 'Posteo Instagram Mayo Amarillo 4' },
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
    galleryLayout: 'screens',
    gallery: [
      { src: 'IMAGENES/Totem Cafe/totem-cafe-hq.png', alt: 'Totem de Café - Menú principal' },
      { src: 'IMAGENES/Totem Cafe/totem-recarga-hq.png', alt: 'Recarga completada Totem de Café' },
      { src: 'IMAGENES/Totem Cafe/totem-pago-hq.png', alt: 'Pago Totem de Café' },
      { src: 'IMAGENES/Totem Cafe/totem-compra-hq.png', alt: 'Gracias por su compra Totem de Café' }
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
    galleryLayout: 'essay',
    gallery: [
      { src: 'IMAGENES/Proyecto fotografico/fotografia cerveza.jpg', alt: 'Fotografía cerveza' },
      { src: 'IMAGENES/Proyecto fotografico/joyeriaCreacion.jpg', alt: 'Joyeria Creación' },
      { src: 'IMAGENES/Proyecto fotografico/foto-lo-que-no-vemos4.jpg', alt: 'Lo que no vemos 4' },
      { src: 'IMAGENES/Proyecto fotografico/foto-lo-que-no-vemos.jpg', alt: 'Lo que no vemos' }
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
    galleryLayout: 'reel',
    gallery: [
      {
        type: 'vimeo',
        src: 'https://player.vimeo.com/video/1225425471',
        alt: 'Reel final Campaña ORT'
      },
      { src: 'IMAGENES/Campana reel ORT/ort-frame1.jpg', alt: 'Frame 1 - Entrada ORT' },
      { src: 'IMAGENES/Campana reel ORT/ort-frame2.jpg', alt: 'Frame 2' },
      { src: 'IMAGENES/Campana reel ORT/ort-frame3.jpg', alt: 'Frame 3' }
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
    pageTitle: 'Noir Estudio',
    category: 'Branding',
    cardClass: 'card-third',
    cardImage: 'IMAGENES/Noir Estudio/noir-interior-card.jpg',
    cardAlt: 'Noir Estudio - Identidad de marca',
    role: 'Dirección de identidad: concepto, sistema visual y aplicaciones',
    heroLead: 'Desarrollo de identidad visual y experiencia digital, desde el concepto de marca hasta sus aplicaciones y diseño UX/UI.',
    tools: 'Figma',
    hideMeta: true,
    processLayout: 'noir',
    heroSlider: [
      { src: 'IMAGENES/Noir Estudio/noir-interior.jpg', alt: 'Interior Noir Barbería & Estilo' },
      { src: 'IMAGENES/Noir Estudio/Primeratransformacion.png', alt: 'Transformación Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/experiencia Noir.png', alt: 'Experiencia Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/Slider2.png', alt: 'Herramientas y productos Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/Slider3.png', alt: 'Piezas de marca Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-herramientas.jpg', alt: 'Herramientas Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-productos.jpg', alt: 'Línea de coloración Noir Estudio' }
    ],
    serviceCards: [
      { title: 'afeitado', src: 'IMAGENES/Noir Estudio/afeitado.jpg', alt: 'Afeitado Noir Estudio' },
      { title: 'noir experiencia', src: 'IMAGENES/Noir Estudio/experiencia Noir.png', alt: 'Experiencia Noir Estudio' },
      { title: 'noir productos', src: 'IMAGENES/Noir Estudio/noir-productos.jpg', alt: 'Productos Noir Estudio' },
      { title: 'noir herramientas', src: 'IMAGENES/Noir Estudio/noir-herramientas.jpg', alt: 'Herramientas Noir Estudio' },
      { title: 'noir acabado', src: 'IMAGENES/Noir Estudio/noir acabado.png', alt: 'Acabado Noir Estudio' }
    ],
    gallery: [
      { src: 'IMAGENES/Noir Estudio/noir-interior.jpg', alt: 'Interior Noir Barbería & Estilo' },
      { src: 'IMAGENES/Noir Estudio/noir-herramientas.jpg', alt: 'Herramientas y productos Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-experiencia.jpg', alt: 'Experiencia Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-productos.jpg', alt: 'Línea de coloración Noir Estudio' }
    ],
    processTitle: 'Cómo se pensó este proyecto',
    process: [
      {
        title: 'Problema',
        text: 'Noir Estudio necesitaba construir una identidad premium para barbería & estilo y trasladarla a una experiencia digital coherente. El desafío era lograr una estética exclusiva sin caer en los códigos genéricos de las barberías oscuras y mantener claridad tanto en la marca como en la navegación del sitio.'
      },
      {
        title: 'Mi rol',
        text: 'Desarrollé la identidad visual y diseñé la experiencia web en Figma. Trabajé el sistema de marca, tipografías, paleta cromática, aplicaciones y mockups, junto con la estructura y diseño de la interfaz: servicios, transformaciones, experiencia Noir, ubicación y reserva.'
      },
      {
        title: 'Decisión clave',
        text: 'Construí el sistema alrededor de una paleta de negros y carbón con acentos dorados y una composición limpia. En la web prioricé jerarquía, fotografías protagonistas y una navegación simple para que la estética premium no comprometiera la claridad ni la experiencia de uso.'
      },
      {
        title: 'Resultado',
        text: 'Una identidad consistente que se extiende del espacio físico a la experiencia digital. El resultado integra marca, aplicaciones e interfaz dentro de un mismo universo visual, con una web pensada para presentar los servicios, generar confianza y facilitar el contacto con el estudio.'
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
    hideMeta: true,
    processLayout: 'editorial',
    editorial: {
      intro: 'Una campaña de edición limitada pensada para que etiqueta, piezas gráficas y video compartan la misma atmósfera de invierno.',
      bottle: {
        src: 'IMAGENES/Don pascual/don pascualfinal.png?v=20260908u',
        alt: 'Botella Don Pascual Chardonnay Edición Limitada 2026'
      },
      gallery: [
        { src: 'IMAGENES/Don pascual/don-pascual-afiche.jpg', alt: 'Afiche Don Pascual Edición Limitada' },
        { src: 'IMAGENES/Don pascual/don-pascual-campana.jpg', alt: 'Mockup de campaña Don Pascual junto al fuego' },
        { src: 'IMAGENES/Don pascual/don-pascual-etiqueta.jpg', alt: 'Etiqueta con ilustración Don Pascual' },
        { src: 'IMAGENES/Don pascual/Plano 6-Copas chocando.png', alt: 'Copas de Don Pascual brindando junto al fuego' },
        { src: 'IMAGENES/Don pascual/Plano 5-Miradas complices.png', alt: 'Miradas cómplices junto al fuego con Don Pascual' },
        { src: 'IMAGENES/Don pascual/cartel omnibus2.png', alt: 'Campaña Don Pascual en ómnibus' },
        { src: 'IMAGENES/Don pascual/Familia pascual sirviendo vino.png', alt: 'Familia sirviendo Don Pascual' },
        { src: 'IMAGENES/Don pascual/Plano 7-Tomando Vino.png', alt: 'Escena de campaña Don Pascual tomando vino' },
        { src: 'IMAGENES/Don pascual/don-pascual-botella-fuego.jpg', alt: 'Botella Don Pascual junto al fuego' }
      ]
    },
    gallery: [],
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
        text: 'UbicarGPS necesitaba comunicar distintos servicios —rastreo de flotas, cámaras de seguridad y soluciones asociadas— en una misma vidriera, de forma clara y visible desde la calle, sin saturar la información.'
      },
      {
        title: 'Mi rol',
        text: 'Organicé la información en un sistema visual simple, combinando iconografía, jerarquía tipográfica e imágenes de producto para lograr una lectura rápida, con el naranja como hilo conductor entre todas las piezas.'
      },
      {
        title: 'Decisión clave',
        text: 'Traduje información técnica a mensajes visuales simples. Cada servicio tiene su propia pieza, pero todos comparten la misma lógica de color, iconografía y jerarquía.'
      },
      {
        title: 'Resultado',
        text: 'Un sistema gráfico coherente llevado a una aplicación real: cinco piezas de vidriera que integran productos, servicios, iconografía e identidad de marca en un mismo recorrido visual.'
      }
    ],
    actions: [],
    related: [7, 6]
  }
];
