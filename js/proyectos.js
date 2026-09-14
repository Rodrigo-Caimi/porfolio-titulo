const PROYECTOS = [
  {
    id: 2,
    slug: 'mayo-amarillo.html',
    title: 'Mayo Amarillo',
    category: 'Campaña',
    cardCategories: ['CAMPAÑA', 'DIRECCIÓN VISUAL'],
    cardDescription: 'Campaña de concientización vial con sistema gráfico y audiovisual.',
    cardClass: 'card-third',
    cardWidth: 800,
    cardHeight: 1120,
    cardImage: 'IMAGENES/Mayo amarillo/mayo-amarillo-card.webp',
    cardAlt: 'Mayo Amarillo - Campaña',
    processLayout: 'mayo',
    // Lightbox: solo piezas que abre el HTML (trabajos/mayo-amarillo.html)
    gallery: [
      { src: 'IMAGENES/Mayo amarillo/Afiche-de-campana.webp', alt: 'Afiche de campaña Mayo Amarillo' },
      { src: 'IMAGENES/Mayo amarillo/5-PosteoIgMayo.webp', alt: 'Posteo Instagram Mayo Amarillo 5' },
      { src: 'IMAGENES/Mayo amarillo/4-PosteoIGMayoa.jpg', alt: 'Posteo Instagram Mayo Amarillo 4' },
      { src: 'IMAGENES/Mayo amarillo/1-PosteoIgMayoA.webp', alt: 'Posteo Instagram Mayo Amarillo EN VIVO' },
      { src: 'IMAGENES/Mayo amarillo/2-Posteoig.jpg', alt: 'Posteo Instagram Mayo Amarillo 2', width: 1080, height: 1320 },
      { src: 'IMAGENES/Mayo amarillo/reel-ig-Final.gif', alt: 'gif de la campaña', width: 1080, height: 1920 }
    ]
  },
  {
    id: 4,
    slug: 'proyecto-fotografico.html',
    title: 'Proyecto Fotográfico',
    category: 'Fotografía',
    cardCategories: ['FOTOGRAFÍA'],
    cardDescription: 'Serie fotográfica centrada en dirección visual y composición.',
    cardClass: 'card-third',
    cardWidth: 800,
    cardHeight: 1201,
    cardImage: 'IMAGENES/Proyecto fotografico/fotografia-cerveza-card.webp',
    cardAlt: 'Proyecto Fotográfico'
    // Ficha estática en trabajos/proyecto-fotografico.html (sin datos de detalle aquí)
  },
  {
    id: 5,
    slug: 'campana-reel-ort.html',
    title: 'Campaña Reel ORT',
    category: 'Audiovisual',
    cardCategories: ['AUDIOVISUAL', 'IA GENERATIVA'],
    cardDescription: 'Reel promocional desarrollado con generación visual, movimiento y edición.',
    cardClass: 'card-third',
    cardWidth: 800,
    cardHeight: 1433,
    cardImage: 'IMAGENES/Campana reel ORT/ort-reel-card.webp',
    cardAlt: 'Campaña Reel ORT'
    // Ficha estática en trabajos/campana-reel-ort.html (sin datos de detalle aquí)
  },
  {
    id: 6,
    slug: 'noir-estudio.html',
    title: 'Noir Estudio',
    pageTitle: 'Noir Estudio',
    category: 'Branding',
    cardCategories: ['BRANDING', 'UX/UI'],
    cardDescription: 'Identidad visual y experiencia web para una peluquería premium.',
    cardClass: 'card-third',
    cardWidth: 800,
    cardHeight: 427,
    cardImage: 'IMAGENES/Noir Estudio/noir-interior-card.webp',
    cardAlt: 'Noir Estudio - Identidad de marca',
    processLayout: 'noir',
    // Lightbox: hero + servicios + galería (detalle en trabajos/noir-estudio.html)
    heroSlider: [
      { src: 'IMAGENES/Noir Estudio/noir-interior.jpg', alt: 'Interior Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/Slider2.webp', alt: 'Slider 2 — Herramientas y productos Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/Slider3.webp', alt: 'Slider 3 — Piezas de marca Noir Estudio' }
    ],
    serviceCards: [
      { src: 'IMAGENES/Noir Estudio/afeitado.jpg', alt: 'Perfilado Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/experiencia-Noir.webp', alt: 'Experiencia Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-productos.jpg', alt: 'Color y corrección Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-herramientas.jpg', alt: 'Diseño de corte Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-acabado.webp', alt: 'Acabado y estilo Noir Estudio' }
    ],
    gallery: [
      { src: 'IMAGENES/Noir Estudio/cuadro-echo-bien.webp', alt: 'Antes de la transformación Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/terminado1.webp', alt: 'Corte terminado Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-experiencia.jpg', alt: 'Experiencia en el sillón Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/noir-herramientas.jpg', alt: 'Herramientas Noir Estudio' },
      { src: 'IMAGENES/Noir Estudio/grid2.5.webp', alt: 'Composición de herramientas Noir Estudio', wide: true },
      { src: 'IMAGENES/Noir Estudio/grid3.webp', alt: 'Pieza de campaña Noir Estudio', wide: true },
      { src: 'IMAGENES/Noir Estudio/mapa-1.webp', alt: 'Mapa de ubicación Noir Estudio', wide: true },
      { src: 'IMAGENES/Noir Estudio/mapa-2.webp', alt: 'Detalle de mapa Noir Estudio', wide: true }
    ]
  },
  {
    id: 7,
    slug: 'don-pascual.html',
    title: 'Don Pascual',
    pageTitle: 'Don Pascual — Campaña Edición Limitada Invierno 2026',
    category: 'Campaña',
    cardCategories: ['CAMPAÑA', 'PACKAGING'],
    cardDescription: 'Edición limitada de invierno, identidad de campaña y pieza audiovisual.',
    cardClass: 'card-third',
    cardWidth: 800,
    cardHeight: 1421,
    cardImage: 'IMAGENES/Don pascual/don-pascual-card.webp',
    cardAlt: 'Don Pascual - Edición Limitada Invierno 2026',
    processLayout: 'editorial',
    // Lightbox: galería del mosaico (detalle en trabajos/don-pascual.html)
    editorial: {
      gallery: [
        { src: 'IMAGENES/Don pascual/don-pascual-afiche.webp', alt: 'Afiche Don Pascual Edición Limitada', w: 1130, h: 1600 },
        { src: 'IMAGENES/Don pascual/don-pascual-campana.webp', alt: 'Mockup de campaña Don Pascual junto al fuego', w: 1600, h: 640 },
        { src: 'IMAGENES/Don pascual/don-pascual-etiqueta.webp', alt: 'Etiqueta con ilustración Don Pascual', w: 683, h: 1024 },
        { src: 'IMAGENES/Don pascual/Plano 6-Copas chocando.webp', alt: 'Copas de Don Pascual brindando junto al fuego', w: 900, h: 1600 },
        { src: 'IMAGENES/Don pascual/Plano 5-Miradas complices.webp', alt: 'Miradas cómplices junto al fuego con Don Pascual', w: 900, h: 1600 },
        { src: 'IMAGENES/Don pascual/cartel omnibus2.webp', alt: 'Campaña Don Pascual en ómnibus', w: 1338, h: 491 },
        { src: 'IMAGENES/Don pascual/Familia pascual sirviendo vino.webp', alt: 'Familia sirviendo Don Pascual', w: 1055, h: 1491 },
        { src: 'IMAGENES/Don pascual/Plano 7-Tomando Vino.webp', alt: 'Escena de campaña Don Pascual tomando vino', w: 900, h: 1600 },
        { src: 'IMAGENES/Don pascual/don-pascual-botella-fuego.webp', alt: 'Botella Don Pascual junto al fuego', w: 900, h: 1600 }
      ]
    }
  },
  {
    id: 8,
    slug: 'ubicar-gps.html',
    title: 'Ubicar GPS',
    pageTitle: 'Ubicar GPS — Tecnología que te acompaña',
    category: 'Identidad',
    cardCategories: ['DISEÑO GRÁFICO', 'GRÁFICA APLICADA'],
    cardDescription: 'Sistema visual para vidrieras y comunicación de servicios.',
    cardClass: 'card-third',
    cardWidth: 800,
    cardHeight: 1067,
    cardImage: 'IMAGENES/Ubicar gps/ubicar-logo-card.webp',
    cardAlt: 'Vidriera Ubicar GPS',
    processLayout: 'trail',
    // Lightbox: piezas de vidriera (detalle en trabajos/ubicar-gps.html)
    trail: {
      result: [
        { src: 'IMAGENES/Ubicar gps/flotas y camaras.webp', alt: 'Vidriera Ubicar GPS de flotas y cámaras', w: 1050, h: 1400 },
        { src: 'IMAGENES/Ubicar gps/iconos1 vehiculos.webp', alt: 'Iconos Ubicar GPS para vehículos, mascotas y cámaras', w: 1120, h: 1400 },
        { src: 'IMAGENES/Ubicar gps/iconos2 gps.webp', alt: 'Iconos Ubicar GPS para niños, SOS y cámaras espía', w: 1120, h: 1400 },
        { src: 'IMAGENES/Ubicar gps/Ubicar Logo.webp', alt: 'Logo Ubicar GPS aplicado en vidriera', w: 1050, h: 1400 }
      ]
    }
  }
];
