(function () {
  function asset(path) {
    const base = document.documentElement.dataset.assetBase || './';
    if (!path) return base;
    const q = path.indexOf('?');
    const file = q === -1 ? path : path.slice(0, q);
    const query = q === -1 ? '' : path.slice(q);
    return base + encodeURI(file) + query;
  }

  function proyectoHref(slug) {
    const base = document.documentElement.dataset.trabajosBase || './trabajos/';
    return base + slug;
  }

  function homeHref() {
    const base = document.documentElement.dataset.assetBase || './';
    return base + 'index.html';
  }

  function getProyecto(id) {
    return PROYECTOS.find(function (p) { return p.id === id; });
  }

  function isCustomCase(proyecto) {
    return proyecto && (
      proyecto.processLayout === 'editorial' ||
      proyecto.processLayout === 'trail' ||
      proyecto.processLayout === 'noir' ||
      proyecto.processLayout === 'mayo'
    );
  }

  function renderWorkGrid(container) {
    if (!container) return;

    const layoutOrder = [8, 6, 7, 2, 5, 4];
    const ordered = layoutOrder
      .map(function (id) { return getProyecto(id); })
      .filter(Boolean);

    container.innerHTML = ordered.map(function (proyecto) {
      const sizeAttr = (proyecto.cardWidth && proyecto.cardHeight)
        ? ' width="' + proyecto.cardWidth + '" height="' + proyecto.cardHeight + '"'
        : '';
      const thumb = proyecto.cardImage
        ? '<img loading="lazy" decoding="async" alt="' + proyecto.cardAlt + '" src="' + asset(proyecto.cardImage) + '"' + sizeAttr + ' />'
        : '';
      const categoryLabel = (proyecto.cardCategories && proyecto.cardCategories.length)
        ? proyecto.cardCategories.join(' · ')
        : (proyecto.category || '');
      const category = categoryLabel
        ? '<span class="card-category">' + categoryLabel + '</span>'
        : '';
      const description = proyecto.cardDescription
        ? '<p class="card-description">' + proyecto.cardDescription + '</p>'
        : '';
      const body =
        '<div class="card-body">' +
          '<div class="card-text">' +
            category +
            '<span class="card-title">' + proyecto.title + '</span>' +
            description +
          '</div>' +
          '<span class="card-arrow" aria-hidden="true">↗</span>' +
        '</div>';

      return (
        '<a class="card ' + proyecto.cardClass + '" href="' + proyectoHref(proyecto.slug) + '">' +
          '<div class="thumb">' + thumb + '</div>' +
          body +
        '</a>'
      );
    }).join('');
  }

  function isVimeoItem(item) {
    return item && (item.type === 'vimeo' || /player\.vimeo\.com|vimeo\.com\/\d+/.test(item.src || ''));
  }

  function vimeoEmbedUrl(src) {
    if (!src) return '';
    const player = String(src).match(/player\.vimeo\.com\/video\/(\d+)/);
    if (player) return 'https://player.vimeo.com/video/' + player[1];
    const page = String(src).match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (page) return 'https://player.vimeo.com/video/' + page[1];
    return src;
  }

  function vimeoEmbedHtml(item) {
    const url = vimeoEmbedUrl(item && item.src);
    return (
      '<iframe class="shot-media vimeo-embed"' +
        ' src="' + url + '"' +
        ' title="' + ((item && item.alt) || 'Video') + '"' +
        ' loading="lazy"' +
        ' allow="fullscreen; picture-in-picture"' +
        ' allowfullscreen' +
        ' referrerpolicy="strict-origin-when-cross-origin">' +
      '</iframe>'
    );
  }

  function renderShot(item, index) {
    const eager = index === 0;
    const loading = eager ? 'eager' : 'lazy';
    const isMedia = isVimeoItem(item);
    let media;

    if (isVimeoItem(item)) {
      media = vimeoEmbedHtml(item);
    } else {
      media =
        '<img class="shot-media" src="' + asset(item.src) + '" alt="' + (item.alt || '') + '" loading="' + loading + '" decoding="async"' +
        (eager ? ' fetchpriority="high"' : '') +
        ' />';
    }

    return '<figure class="shot' + (isMedia ? ' shot--video' : '') + (isVimeoItem(item) ? ' shot--vimeo' : '') + '">' + media + '</figure>';
  }

  function reelTitleHtml(title) {
    const text = String(title || '');
    const space = text.indexOf(' ');
    if (space === -1) return '<span class="reel-title-accent">' + text + '</span>';
    return (
      '<span class="reel-title-line">' + text.slice(0, space) + '</span>' +
      '<span class="reel-title-accent">' + text.slice(space + 1) + '</span>'
    );
  }

  function reelVimeoHtml(item) {
    const url = vimeoEmbedUrl(item && item.src);
    const sep = url.indexOf('?') === -1 ? '?' : '&';
    return (
      '<iframe class="reel-vimeo"' +
        ' src="' + url + sep + 'title=0&byline=0&portrait=0&dnt=1"' +
        ' title="' + ((item && item.alt) || 'Video') + '"' +
        ' loading="lazy"' +
        ' allow="fullscreen; picture-in-picture"' +
        ' allowfullscreen' +
        ' referrerpolicy="strict-origin-when-cross-origin">' +
      '</iframe>'
    );
  }

  function reelFrameHtml(item) {
    if (!item || !item.src) return '';
    return (
      '<figure class="reel-gallery-item">' +
        '<img src="' + asset(item.src) + '" alt="' + (item.alt || '') + '" loading="lazy" decoding="async">' +
      '</figure>'
    );
  }

  function reelGalleryItems(proyecto) {
    const items = proyecto.gallery || [];
    const videoItem = items.find(isVimeoItem);
    return items.filter(function (item) {
      return item && item !== videoItem && !isVimeoItem(item);
    });
  }

  function reelMetaIcon(kind) {
    if (kind === 'role') {
      return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5.2 19c1.4-3.2 3.8-4.8 6.8-4.8s5.4 1.6 6.8 4.8"/></svg>';
    }
    if (kind === 'tools') {
      return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 1 2.8 5.5L12 17.3 8.7 14l5.5-5.5a4 4 0 0 1 .5-2.2z"/><path d="M8.7 14l-2.4 2.4a2 2 0 0 0 2.8 2.8L11.5 17"/></svg>';
    }
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h6l2 2h8v9H4z"/><path d="M4 8V6h6l2 2"/></svg>';
  }

  function reelMetaItem(kind, label, value) {
    if (!value) return '';
    return (
      '<div class="reel-meta-item">' +
        '<span class="reel-meta-icon">' + reelMetaIcon(kind) + '</span>' +
        '<p><span>' + label + '</span> ' + value + '</p>' +
      '</div>'
    );
  }

  function renderReelHero(container, proyecto) {
    const items = proyecto.gallery || [];
    const videoItem = items.find(isVimeoItem);
    const intro = proyecto.heroLead || proyecto.role || '';
    const phone = videoItem
      ? '<div class="reel-phone" id="ort-reel">' +
          '<div class="reel-phone-notch" aria-hidden="true"></div>' +
          '<div class="reel-phone-screen">' +
            reelVimeoHtml(videoItem) +
          '</div>' +
        '</div>'
      : '';

    container.innerHTML =
      '<div class="reel-hero">' +
        '<div class="reel-hero-copy">' +
          '<h1>' + reelTitleHtml(proyecto.title) + '</h1>' +
          (intro ? '<p class="reel-hero-lead">' + intro + '</p>' : '') +
          '<div class="reel-hero-meta">' +
            reelMetaItem('category', 'Categoría', proyecto.category) +
            reelMetaItem('role', 'Rol', proyecto.role) +
            reelMetaItem('tools', 'Herramientas', proyecto.tools) +
          '</div>' +
        '</div>' +
        '<div class="reel-hero-visual">' + phone + '</div>' +
      '</div>';
  }

  function renderReelProcess(container, proyecto) {
    const steps = proyecto.process || [];
    const frames = reelGalleryItems(proyecto);
    const stepsHtml = steps.map(function (item, index) {
      const num = (index < 9 ? '0' : '') + (index + 1);
      return (
        '<article class="reel-step">' +
          '<span class="reel-step-num">' + num + '</span>' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + item.text + '</p>' +
        '</article>'
      );
    }).join('');

    var galleryHtml = '';
    if (frames.length === 1) {
      galleryHtml = '<div class="reel-gallery">' + reelFrameHtml(frames[0]) + '</div>';
    } else if (frames.length === 2) {
      galleryHtml =
        '<div class="reel-gallery reel-gallery--pair">' +
          reelFrameHtml(frames[0]) + reelFrameHtml(frames[1]) +
        '</div>';
    } else if (frames.length) {
      galleryHtml =
        '<div class="reel-gallery reel-gallery--trio">' +
          frames.map(reelFrameHtml).join('') +
        '</div>';
    }

    const lastStep = steps[steps.length - 1] || {};
    const resultText = lastStep.text || proyecto.role || '';

    container.innerHTML =
      '<div class="reel-process">' +
        (proyecto.processTitle ? '<h2>' + proyecto.processTitle + '</h2>' : '') +
        '<div class="reel-process-grid">' + stepsHtml + '</div>' +
      '</div>' +
      '<div class="reel-result">' +
        '<div class="reel-result-copy">' +
          '<p class="reel-result-kicker">Resultado</p>' +
          '<h2>' + proyecto.title + '</h2>' +
          (resultText ? '<p class="reel-result-text">' + resultText + '</p>' : '') +
        '</div>' +
        (galleryHtml || '') +
      '</div>';
  }

  function renderGallery(container, proyecto) {
    if (!container) return;

    const items = proyecto.gallery || [];
    if (isCustomCase(proyecto) || !items.length) {
      container.innerHTML = '';
      return;
    }

    const layout = proyecto.galleryLayout;
    if (layout === 'reel') {
      renderReelHero(container, proyecto);
      return;
    }

    // Foto (id 4): markup estático en trabajos/proyecto-fotografico.html
    container.innerHTML = '';
  }

  function renderActions(container, proyecto) {
    if (!container) return;

    if (!proyecto.actions || !proyecto.actions.length) {
      container.innerHTML = '';
      container.hidden = true;
      return;
    }

    container.hidden = false;

    const rows = proyecto.actions.map(function (action) {
      if (!action || !action.href) return '';

      const href = action.external ? action.href : asset(action.href);
      const attrs = action.external
        ? ' target="_blank" rel="noopener"'
        : (action.download
          ? ' target="_blank" rel="noopener" download="' + (action.download || '') + '"'
          : ' target="_blank" rel="noopener"');

      var prompt = action.external
        ? (action.label && /reel|video/i.test(action.label)
          ? 'Si querés visualizar el proyecto'
          : 'Si querés visitar el proyecto')
        : 'Si querés más información del proyecto';

      return (
        '<div class="project-action-row">' +
          '<p class="project-action-prompt">' + prompt + '</p>' +
          '<svg class="project-action-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M5 12h14M12 5l7 7-7 7"/>' +
          '</svg>' +
          '<a href="' + href + '"' + attrs + ' class="btn btn-primary project-action-btn">' + action.label + '</a>' +
        '</div>'
      );
    }).join('');

    container.innerHTML = '<div class="project-actions-list">' + rows + '</div>';
  }

  function actionLinkHtml(action, className) {
    if (!action || !action.href) return '';

    const href = action.external ? action.href : asset(action.href);
    const attrs = action.external
      ? ' target="_blank" rel="noopener"'
      : (action.download
        ? ' target="_blank" rel="noopener" download="' + (action.download || '') + '"'
        : ' target="_blank" rel="noopener"');

    return '<a href="' + href + '"' + attrs + ' class="' + className + '">' + action.label + '</a>';
  }

  function wineBlockHtml(item, n) {
    if (!item) return '';
    const num = (n < 10 ? '0' : '') + n;
    const text = String(item.text || '').replace(
      '—íntima y contemporánea—',
      '<span class="wine-nowrap">—íntima y contemporánea—</span>'
    );

    return (
      '<article class="wine-block wine-block--' + n + '">' +
        '<header class="wine-block-head">' +
          '<span class="wine-num">' + num + '</span>' +
          '<h3><span class="wine-sep" aria-hidden="true">•</span> ' + item.title + '</h3>' +
        '</header>' +
        '<p>' + text + '</p>' +
      '</article>'
    );
  }

  function renderEditorialProcess(container, proyecto) {
    const ed = proyecto.editorial || {};
    const steps = proyecto.process || [];
    const gallery = ed.gallery || [];
    const actions = (proyecto.actions || []).map(function (action, index) {
      return actionLinkHtml(action, 'btn wine-btn' + (index === 0 ? ' wine-btn--solid' : ' wine-btn--ghost'));
    }).join('');

    const videoHtml =
      '<figure class="wine-mosaic-video">' +
        '<figcaption class="wine-campaign-title">Campaña</figcaption>' +
        '<div class="wine-video-embed">' +
          '<iframe' +
            ' src="https://player.vimeo.com/video/1225310189"' +
            ' title="Campaña Don Pascual"' +
            ' loading="lazy"' +
            ' allow="fullscreen; picture-in-picture"' +
            ' allowfullscreen' +
            ' referrerpolicy="strict-origin-when-cross-origin">' +
          '</iframe>' +
        '</div>' +
      '</figure>';

    const mosaic = gallery.map(function (item, index) {
      const wh = (item.w && item.h)
        ? ' width="' + item.w + '" height="' + item.h + '"'
        : '';
      const load = index === 0
        ? ' loading="eager" fetchpriority="high"'
        : ' loading="lazy"';
      const photo =
        '<button type="button" class="wine-mosaic-item" data-wine-index="' + index + '">' +
          '<img src="' + asset(item.src) + '" alt="' + (item.alt || '') + '"' +
            wh + load +
            ' decoding="async">' +
        '</button>';
      return index === 3 ? photo + videoHtml : photo;
    }).join('');

    const lineMarks = [1, 2, 3, 4].map(function (n) {
      return '<g data-wine-trail="' + n + '">' +
        '<path data-wine-echo="' + n + 'a"></path>' +
        '<path data-wine-echo="' + n + 'b"></path>' +
        '<path data-wine-line="' + n + '"></path>' +
        '<circle data-wine-dot="' + n + 'a" r="3.5"></circle>' +
        '<circle data-wine-dot="' + n + 'b" r="3.5"></circle>' +
      '</g>';
    }).join('');

    container.innerHTML =
      '<div class="wine-editorial">' +
        '<div class="wine-board">' +
        '<div class="wine-intro">' +
          '<div class="wine-intro-top">' +
            '<a class="wine-back" href="' + homeHref() + '">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M15 18l-6-6 6-6"></path>' +
              '</svg>' +
              '<span>Volver al inicio</span>' +
            '</a>' +
            '<h1>' + (proyecto.pageTitle || proyecto.title) + '</h1>' +
          '</div>' +
          (ed.intro ? '<p class="wine-lead">' + ed.intro + '</p>' : '') +
          '<p class="wine-process-label">' + proyecto.processTitle + '</p>' +
        '</div>' +
        '<div class="wine-stage">' +
          '<svg class="wine-lines" aria-hidden="true">' + lineMarks + '</svg>' +
          wineBlockHtml(steps[0], 1) +
          '<figure class="wine-bottle">' +
            '<img src="' + asset(ed.bottle && ed.bottle.src) + '" alt="' + ((ed.bottle && ed.bottle.alt) || '') + '" decoding="async" fetchpriority="high">' +
          '</figure>' +
          wineBlockHtml(steps[1], 2) +
          wineBlockHtml(steps[2], 3) +
          wineBlockHtml(steps[3], 4) +
        '</div>' +
        '</div>' +
        '<div class="wine-gallery">' +
          '<h2 class="wine-gallery-title">Más fotos</h2>' +
          '<div class="wine-mosaic-wrap">' +
            '<svg class="wine-mosaic-lines" aria-hidden="true"></svg>' +
            '<div class="wine-mosaic">' + mosaic + '</div>' +
          '</div>' +
        '</div>' +
        '<dialog class="wine-lightbox" aria-label="Imagen ampliada">' +
          '<button type="button" class="wine-lightbox-close" aria-label="Cerrar">×</button>' +
          '<button type="button" class="wine-lightbox-prev" aria-label="Imagen anterior">‹</button>' +
          '<img alt="">' +
          '<button type="button" class="wine-lightbox-next" aria-label="Imagen siguiente">›</button>' +
        '</dialog>' +
        '<div class="wine-close">' +
          '<div class="wine-actions">' + actions + '</div>' +
        '</div>' +
        '<p class="wine-footerbrand">Don Pascual · Uruguay</p>' +
      '</div>';

    bindWineArrows(container.querySelector('.wine-stage'));
    bindWineMosaicLines(container.querySelector('.wine-mosaic-wrap'));
    bindSimpleLightbox(
      container.querySelector('.wine-mosaic'),
      container.querySelector('.wine-lightbox'),
      gallery,
      {
        item: '[data-wine-index]',
        indexAttr: 'data-wine-index',
        close: '.wine-lightbox-close',
        prev: '.wine-lightbox-prev',
        next: '.wine-lightbox-next'
      }
    );
  }

  function ubicarImgAttrs(photo, eager) {
    const wh = (photo.w && photo.h)
      ? ' width="' + photo.w + '" height="' + photo.h + '"'
      : '';
    const load = eager
      ? ' loading="eager" fetchpriority="high"'
      : ' loading="lazy"';
    return wh + load + ' decoding="async"';
  }

  function renderTrailProcess(container, proyecto) {
    const trail = proyecto.trail || {};
    const steps = proyecto.process || [];
    const photos = trail.steps || [];
    const result = trail.result || [];

    function stepHtml(item, n, photo, eager) {
      if (!item) return '';
      const num = (n < 10 ? '0' : '') + n;
      const image = photo && photo.src
        ? '<figure class="ubicar-shot">' +
            '<img src="' + asset(photo.src) + '" alt="' + (photo.alt || '') + '"' + ubicarImgAttrs(photo, eager) + '>' +
          '</figure>'
        : '';

      return (
        '<article class="ubicar-step ubicar-step--' + n + '">' +
          '<div class="ubicar-copy">' +
            '<div class="ubicar-kicker">' +
              '<span class="ubicar-num">' + num + '</span>' +
              '<h3>' + item.title + '</h3>' +
            '</div>' +
            '<p>' + item.text + '</p>' +
          '</div>' +
          image +
        '</article>'
      );
    }

    const galleryHtml = result.map(function (item, index) {
      return (
        '<button type="button" class="ubicar-gallery-item" data-ubicar-index="' + index + '" aria-label="Ampliar: ' + (item.alt || '') + '">' +
          '<img src="' + asset(item.src) + '" alt="' + (item.alt || '') + '"' + ubicarImgAttrs(item, false) + '>' +
        '</button>'
      );
    }).join('');

    const resultStep = steps[3]
      ? '<article class="ubicar-step ubicar-step--4 ubicar-step--result">' +
          '<div class="ubicar-copy">' +
            '<div class="ubicar-kicker">' +
              '<span class="ubicar-num">04</span>' +
              '<h3>' + steps[3].title + '</h3>' +
            '</div>' +
            '<p class="ubicar-result-lead">Del diseño a una aplicación real.</p>' +
            '<p>' + steps[3].text + '</p>' +
          '</div>' +
        '</article>'
      : '';

    container.innerHTML =
      '<div class="ubicar-page">' +
        '<div class="ubicar-intro">' +
          '<a class="ubicar-back" href="' + homeHref() + '">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<path d="M15 18l-6-6 6-6"></path>' +
            '</svg>' +
            '<span>Volver al inicio</span>' +
          '</a>' +
          '<h1>' + (proyecto.pageTitle || proyecto.title) + '</h1>' +
          (trail.intro ? '<p class="ubicar-lead">' + trail.intro + '</p>' : '') +
          '<p class="ubicar-process-label">Cómo se pensó este <em>proyecto</em></p>' +
        '</div>' +
        '<div class="ubicar-trail">' +
          '<svg class="ubicar-line" aria-hidden="true">' +
            '<defs>' +
              '<marker id="ubicar-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">' +
                '<path d="M0 0 L12 6 L0 12 Z" fill="#ff5a00"></path>' +
              '</marker>' +
            '</defs>' +
            '<path class="ubicar-line-path"></path>' +
          '</svg>' +
          stepHtml(steps[0], 1, photos[0], true) +
          stepHtml(steps[1], 2, photos[1], false) +
          stepHtml(steps[2], 3, photos[2], false) +
          resultStep +
        '</div>' +
        (galleryHtml
          ? '<section class="ubicar-gallery" aria-label="Aplicación real en el local">' + galleryHtml + '</section>'
          : '') +
        '<dialog class="ubicar-lightbox" aria-label="Imagen ampliada">' +
          '<button type="button" class="ubicar-lightbox-close" aria-label="Cerrar">×</button>' +
          '<button type="button" class="ubicar-lightbox-prev" aria-label="Imagen anterior">‹</button>' +
          '<img alt="">' +
          '<button type="button" class="ubicar-lightbox-next" aria-label="Imagen siguiente">›</button>' +
        '</dialog>' +
      '</div>';

    bindUbicarTrail(container.querySelector('.ubicar-trail'));
    bindSimpleLightbox(container.querySelector('.ubicar-gallery'), container.querySelector('.ubicar-lightbox'), result);
  }

  function bindUbicarTrail(trail) {
    if (!trail) return;
    const svg = trail.querySelector('.ubicar-line');
    const path = trail.querySelector('.ubicar-line-path');
    if (!svg || !path) return;

    function draw() {
      if (window.matchMedia('(max-width: 900px)').matches) return;

      const nodes = trail.querySelectorAll('.ubicar-num');
      if (!nodes.length) return;
      const tr = trail.getBoundingClientRect();
      if (!tr.width || !tr.height) return;

      svg.setAttribute('viewBox', '0 0 ' + tr.width + ' ' + tr.height);
      svg.setAttribute('width', String(tr.width));
      svg.setAttribute('height', String(tr.height));

      const pts = [];
      nodes.forEach(function (node) {
        const r = node.getBoundingClientRect();
        pts.push({
          x: r.left - tr.left + r.width / 2,
          y: r.top - tr.top + r.height / 2
        });
      });

      const compact = window.matchMedia('(max-width: 1024px)').matches;
      const bend = compact ? 0.22 : 0.32;
      let d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const dy = curr.y - prev.y;
        const c1y = prev.y + dy * bend;
        const c2y = curr.y - dy * bend;
        d += ' C' + prev.x.toFixed(1) + ' ' + c1y.toFixed(1) +
          ', ' + curr.x.toFixed(1) + ' ' + c2y.toFixed(1) +
          ', ' + curr.x.toFixed(1) + ' ' + curr.y.toFixed(1);
      }

      path.setAttribute('d', d);
      path.setAttribute('marker-end', 'url(#ubicar-arrow)');
    }

    let resizeTimer = 0;
    const redraw = function () { window.requestAnimationFrame(draw); };
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(redraw, 120);
    });
    trail.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', redraw, { once: true });
    });
    redraw();
  }

  function wrapLightboxGlyph(btn, modifier) {
    if (!btn || btn.querySelector('.lightbox-glyph')) return;
    const glyph = document.createElement('span');
    glyph.className = 'lightbox-glyph lightbox-glyph--' + modifier;
    glyph.setAttribute('aria-hidden', 'true');
    while (btn.firstChild) glyph.appendChild(btn.firstChild);
    btn.appendChild(glyph);
  }

  function bindSimpleLightbox(gallery, dialog, items, opts) {
    if (!gallery || !dialog || !items || !items.length) return;
    opts = opts || {};
    const itemSel = opts.item || '[data-ubicar-index]';
    const indexAttr = opts.indexAttr || 'data-ubicar-index';

    let stage = dialog.querySelector('.lightbox-stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.className = 'lightbox-stage';
      while (dialog.firstChild) stage.appendChild(dialog.firstChild);
      dialog.appendChild(stage);
    }

    const img = stage.querySelector('img');
    const closeBtn = dialog.querySelector(opts.close || '.ubicar-lightbox-close');
    const prevBtn = dialog.querySelector(opts.prev || '.ubicar-lightbox-prev');
    const nextBtn = dialog.querySelector(opts.next || '.ubicar-lightbox-next');
    let index = 0;
    let swipeX = 0;

    wrapLightboxGlyph(closeBtn, 'close');
    wrapLightboxGlyph(prevBtn, 'prev');
    wrapLightboxGlyph(nextBtn, 'next');

    function show(i) {
      index = (i + items.length) % items.length;
      const item = items[index];
      img.src = asset(item.src);
      img.alt = item.alt || '';
      img.removeAttribute('width');
      img.removeAttribute('height');
      if (item.w && item.h) img.style.aspectRatio = item.w + ' / ' + item.h;
      else img.style.removeProperty('aspect-ratio');
      if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    }

    gallery.addEventListener('click', function (event) {
      const button = event.target.closest(itemSel);
      if (!button || !gallery.contains(button)) return;
      show(Number(button.getAttribute(indexAttr)) || 0);
    });

    if (closeBtn) closeBtn.addEventListener('click', function () { dialog.close(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('keydown', function (event) {
      if (!dialog.open) return;
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });
    dialog.addEventListener('touchstart', function (event) {
      if (!event.changedTouches || !event.changedTouches.length) return;
      swipeX = event.changedTouches[0].clientX;
    }, { passive: true });
    dialog.addEventListener('touchend', function (event) {
      if (!dialog.open || !event.changedTouches || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - swipeX;
      if (Math.abs(dx) < 56) return;
      if (dx > 0) show(index - 1);
      else show(index + 1);
    }, { passive: true });
    dialog.addEventListener('close', function () {
      img.removeAttribute('src');
    });
  }

  function bindWineArrows(stage) {
    if (!stage) return;
    const svg = stage.querySelector('.wine-lines');
    const bottle = stage.querySelector('.wine-bottle img');
    if (!svg || !bottle) return;

    function curve(from, to, side) {
      const mx = (from.x + to.x) / 2 + side * 72;
      const my = (from.y + to.y) / 2;
      return 'M' + from.x.toFixed(1) + ' ' + from.y.toFixed(1) +
        ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) +
        ' ' + to.x.toFixed(1) + ' ' + to.y.toFixed(1);
    }

    function point(el, rx, ry, root) {
      const rr = root.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        x: r.left - rr.left + r.width * rx,
        y: r.top - rr.top + r.height * ry
      };
    }

    function draw() {
      if (window.matchMedia('(max-width: 900px)').matches) return;
      const sr = stage.getBoundingClientRect();
      if (!sr.width || !sr.height) return;
      svg.setAttribute('viewBox', '0 0 ' + sr.width + ' ' + sr.height);
      svg.setAttribute('width', String(sr.width));
      svg.setAttribute('height', String(sr.height));

      const br = bottle.getBoundingClientRect();
      const midX = br.left - sr.left + br.width / 2;
      const glass = br.width * 0.16;
      const specs = [
        { n: 1, from: [1, 0.36], side: -1, y: 0.30 },
        { n: 2, from: [0, 0.38], side: 1, y: 0.30 },
        { n: 3, from: [1, 0.62], side: -1, y: 0.68 },
        { n: 4, from: [0, 0.60], side: 1, y: 0.68 }
      ];

      specs.forEach(function (spec) {
        const block = stage.querySelector('.wine-block--' + spec.n);
        const path = svg.querySelector('[data-wine-line="' + spec.n + '"]');
        const echo = svg.querySelector('[data-wine-echo="' + spec.n + 'a"]');
        const echoB = svg.querySelector('[data-wine-echo="' + spec.n + 'b"]');
        const dotA = svg.querySelector('[data-wine-dot="' + spec.n + 'a"]');
        const dotB = svg.querySelector('[data-wine-dot="' + spec.n + 'b"]');
        if (!block || !path) return;
        const from = point(block, spec.from[0], spec.from[1], stage);
        const to = {
          x: midX + spec.side * glass,
          y: br.top - sr.top + br.height * spec.y
        };
        const d = curve(from, to, spec.side);
        path.setAttribute('d', d);
        if (echo) echo.setAttribute('d', d);
        if (echoB) echoB.style.display = 'none';
        if (dotA) { dotA.setAttribute('cx', from.x.toFixed(1)); dotA.setAttribute('cy', from.y.toFixed(1)); }
        if (dotB) { dotB.setAttribute('cx', to.x.toFixed(1)); dotB.setAttribute('cy', to.y.toFixed(1)); }
      });
    }

    const redraw = function () { window.requestAnimationFrame(draw); };
    if (!bottle.complete) bottle.addEventListener('load', redraw, { once: true });
    let timer = 0;
    window.addEventListener('resize', function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(redraw, 120);
    });
    redraw();
  }

  function bindWineMosaicLines(wrap) {
    if (!wrap) return;
    const mosaic = wrap.querySelector('.wine-mosaic');
    const svg = wrap.querySelector('.wine-mosaic-lines');
    if (!mosaic || !svg) return;
    const ns = 'http://www.w3.org/2000/svg';

    function curve(a, b, amp) {
      const mx = (a.x + b.x) / 2 + amp;
      const my = (a.y + b.y) / 2;
      return 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) +
        ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) +
        ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
    }

    function center(el) {
      const wr = wrap.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        x: r.left - wr.left + r.width / 2,
        y: r.top - wr.top + r.height / 2
      };
    }

    function el(name, attrs) {
      const node = document.createElementNS(ns, name);
      Object.keys(attrs).forEach(function (key) { node.setAttribute(key, attrs[key]); });
      return node;
    }

    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      if (window.matchMedia('(max-width: 900px)').matches) return;
      const wr = wrap.getBoundingClientRect();
      if (!wr.width || !wr.height) return;
      svg.setAttribute('viewBox', '0 0 ' + wr.width + ' ' + wr.height);
      svg.setAttribute('width', String(wr.width));
      svg.setAttribute('height', String(wr.height));

      const items = mosaic.querySelectorAll('.wine-mosaic-item');
      if (items.length < 2) return;
      const nodes = [];
      for (let i = 0; i < items.length; i++) {
        nodes.push(center(items[i].querySelector('img') || items[i]));
      }

      const frag = document.createDocumentFragment();
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i];
        const b = nodes[i + 1];
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        if (len < 140) continue;
        const amp = (i % 2 === 0 ? 1 : -1) * Math.min(120, len * 0.22);
        frag.appendChild(el('path', { class: 'wine-trail-echo', d: curve(a, b, amp * 1.1) }));
        frag.appendChild(el('path', { class: 'wine-trail-main', d: curve(a, b, amp) }));
        frag.appendChild(el('circle', { cx: a.x.toFixed(1), cy: a.y.toFixed(1), r: '3.4' }));
        frag.appendChild(el('circle', { cx: b.x.toFixed(1), cy: b.y.toFixed(1), r: '3.4' }));
      }
      svg.appendChild(frag);
    }

    const redraw = function () { window.requestAnimationFrame(draw); };
    mosaic.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('load', redraw);
    });
    let timer = 0;
    window.addEventListener('resize', function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(redraw, 120);
    });
    redraw();
  }

  function noirPhotoHtml(photo, index, extraClass, eager) {
    if (!photo || !photo.src) return '';
    return (
      '<button type="button" class="noir-photo' + (extraClass ? ' ' + extraClass : '') + '" data-noir-index="' + index + '">' +
        '<img src="' + asset(photo.src) + '" alt="' + (photo.alt || '') + '"' +
          (eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') +
          ' decoding="async">' +
      '</button>'
    );
  }

  function noirSlideHtml(photo, index, eager) {
    if (!photo || !photo.src) return '';
    return (
      '<figure class="noir-slide" data-noir-index="' + index + '">' +
        '<img src="' + asset(photo.src) + '" alt="' + (photo.alt || '') + '"' +
          (eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') +
          ' decoding="async" draggable="false">' +
      '</figure>'
    );
  }

  function noirServiceCardHtml(card, index) {
    if (!card || !card.src) return '';
    return (
      '<article class="noir-service-card">' +
        noirPhotoHtml(card, index, 'noir-photo--card') +
        '<div class="noir-service-copy">' +
          '<h3>' + card.title + '</h3>' +
          (card.text ? '<p>' + card.text + '</p>' : '') +
        '</div>' +
      '</article>'
    );
  }

  function noirStepHtml(item, n) {
    if (!item) return '';
    const num = (n < 10 ? '0' : '') + n;
    return (
      '<article class="noir-step noir-step--' + n + '">' +
        '<span class="noir-step-num">' + num + '</span>' +
        '<div class="noir-step-copy">' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + item.text + '</p>' +
        '</div>' +
      '</article>'
    );
  }

  function bindNoirSlider(root) {
    if (!root) return;
    const track = root.querySelector('.noir-hero-track');
    const slides = root.querySelectorAll('.noir-slide');
    const prev = root.querySelector('.noir-hero-prev');
    const next = root.querySelector('.noir-hero-next');
    const dots = root.querySelectorAll('[data-noir-slide]');
    if (!track || !slides.length) return;

    if (slides.length < 2) {
      if (prev) prev.hidden = true;
      if (next) next.hidden = true;
      return;
    }

    let index = 0;
    let startX = 0;
    let deltaX = 0;
    let dragging = false;
    let didDrag = false;
    let pointerId = null;

    function goTo(nextIndex, instant) {
      index = (nextIndex + slides.length) % slides.length;
      track.style.transition = instant ? 'none' : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';
      Array.prototype.forEach.call(dots, function (dot, dotIndex) {
        const active = dotIndex === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
      Array.prototype.forEach.call(slides, function (slide, slideIndex) {
        slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true');
      });
    }

    function onPointerDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging = true;
      didDrag = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      deltaX = 0;
      track.style.transition = 'none';
      root.classList.add('is-dragging');
      if (track.setPointerCapture) track.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event) {
      if (!dragging || event.pointerId !== pointerId) return;
      deltaX = event.clientX - startX;
      if (Math.abs(deltaX) > 8) didDrag = true;
      const width = root.offsetWidth || 1;
      track.style.transform = 'translate3d(' + ((-index * 100) + (deltaX / width * 100)) + '%,0,0)';
    }

    function onPointerUp(event) {
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false;
      root.classList.remove('is-dragging');
      const width = root.offsetWidth || 1;
      if (deltaX < -width * 0.15) goTo(index + 1);
      else if (deltaX > width * 0.15) goTo(index - 1);
      else goTo(index);
    }

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);
    track.addEventListener('click', function (event) {
      if (!didDrag) return;
      event.preventDefault();
      event.stopPropagation();
      didDrag = false;
    }, true);

    if (prev) prev.addEventListener('click', function () { goTo(index - 1); });
    if (next) next.addEventListener('click', function () { goTo(index + 1); });
    Array.prototype.forEach.call(dots, function (dot, dotIndex) {
      dot.addEventListener('click', function () { goTo(dotIndex); });
    });

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') goTo(index - 1);
      if (event.key === 'ArrowRight') goTo(index + 1);
    });

    goTo(0, true);
  }

  function bindNoirServices(viewport) {
    if (!viewport) return;
    const section = viewport.closest('.noir-services');
    const track = viewport.querySelector('.noir-services-track');
    const cards = viewport.querySelectorAll('.noir-service-card');
    const prev = section && section.querySelector('.noir-services-prev');
    const next = section && section.querySelector('.noir-services-next');
    const dotsRoot = section && section.querySelector('[data-noir-service-dots]');
    if (!track || !cards.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const singleMq = window.matchMedia('(max-width: 900px)');
    let index = 0;
    let autoplayId = 0;
    let userPaused = false;

    if (dotsRoot) {
      dotsRoot.innerHTML = Array.prototype.map.call(cards, function (_, i) {
        return (
          '<button type="button" class="noir-services-dot' + (i === 0 ? ' is-active' : '') + '"' +
            ' data-noir-service="' + i + '"' +
            ' aria-label="Ver servicio ' + (i + 1) + '"></button>'
        );
      }).join('');
    }
    const dots = dotsRoot ? dotsRoot.querySelectorAll('[data-noir-service]') : [];

    function isSingle() {
      return singleMq.matches;
    }

    function step() {
      const card = cards[0];
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return card ? card.getBoundingClientRect().width + gap : viewport.clientWidth || 280;
    }

    function maxIndex() {
      if (isSingle()) return cards.length - 1;
      const s = step() || 1;
      return Math.max(0, Math.round(Math.max(0, track.scrollWidth - viewport.clientWidth) / s));
    }

    function updateUi() {
      Array.prototype.forEach.call(dots, function (dot, i) {
        const active = i === index;
        dot.classList.toggle('is-active', active);
        if (active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      Array.prototype.forEach.call(cards, function (card, i) {
        if (isSingle()) card.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        else card.removeAttribute('aria-hidden');
      });
    }

    function goTo(nextIndex, instant) {
      if (isSingle()) {
        const total = cards.length;
        index = ((nextIndex % total) + total) % total;
      } else {
        index = Math.max(0, Math.min(maxIndex(), nextIndex));
      }
      const behavior = instant || reduceMotion.matches ? 'auto' : 'smooth';
      viewport.scrollTo({ left: step() * index, behavior: behavior });
      updateUi();
    }

    function syncFromScroll() {
      const s = step() || 1;
      const nextIndex = Math.round(viewport.scrollLeft / s);
      if (nextIndex === index) return;
      index = Math.max(0, Math.min(cards.length - 1, nextIndex));
      updateUi();
    }

    function stopAutoplay() {
      window.clearInterval(autoplayId);
      autoplayId = 0;
    }

    function pauseAutoplay() {
      userPaused = true;
      stopAutoplay();
    }

    function startAutoplay() {
      stopAutoplay();
      if (userPaused || reduceMotion.matches || !isSingle() || cards.length < 2) return;
      autoplayId = window.setInterval(function () {
        goTo(index + 1);
      }, 5600);
    }

    viewport.addEventListener('scroll', syncFromScroll, { passive: true });

    if (prev) prev.addEventListener('click', function () {
      pauseAutoplay();
      goTo(index - 1);
    });
    if (next) next.addEventListener('click', function () {
      pauseAutoplay();
      goTo(index + 1);
    });
    Array.prototype.forEach.call(dots, function (dot, i) {
      dot.addEventListener('click', function () {
        pauseAutoplay();
        goTo(i);
      });
    });

    viewport.addEventListener('pointerdown', pauseAutoplay);
    section.addEventListener('focusin', pauseAutoplay);

    viewport.setAttribute('tabindex', '0');
    viewport.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        pauseAutoplay();
        goTo(index - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        pauseAutoplay();
        goTo(index + 1);
      }
    });

    function onModeChange() {
      goTo(index, true);
      startAutoplay();
    }

    if (singleMq.addEventListener) singleMq.addEventListener('change', onModeChange);
    else singleMq.addListener(onModeChange);

    let resizeTimer = 0;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        goTo(index, true);
      }, 120);
    });

    updateUi();
    startAutoplay();
  }

  function isNoirFigmaAction(action) {
    return !!(action && action.external && /figma\.com/i.test(String(action.href || '')));
  }

  function noirFigmaBlockHtml(actions, variant) {
    if (!actions || !actions.length) return '';
    const links = actions.map(function (action, index) {
      var cls = 'noir-cta';
      if (variant === 'hero') {
        cls += index === 0 ? ' noir-cta--solid' : ' noir-cta--outline';
      } else {
        cls += ' noir-cta--ghost';
      }
      return actionLinkHtml(action, cls);
    }).join('');
    return (
      '<div class="noir-figma">' +
        '<p class="noir-figma-title">Figma</p>' +
        '<div class="noir-figma-links">' + links + '</div>' +
      '</div>'
    );
  }

  function renderNoirCase(container, proyecto) {
    const photos = proyecto.gallery || [];
    const slides = (proyecto.heroSlider && proyecto.heroSlider.length) ? proyecto.heroSlider : photos;
    const cards = proyecto.serviceCards || [];
    const lightbox = slides.concat(cards, photos);
    const steps = proyecto.process || [];
    const actions = proyecto.actions || [];
    const figmaActions = actions.filter(isNoirFigmaAction);
    const otherActions = actions.filter(function (action) {
      return !isNoirFigmaAction(action);
    });
    const closeActions = otherActions.map(function (action, index) {
      return actionLinkHtml(action, 'noir-cta' + (index === 0 ? ' noir-cta--solid' : ' noir-cta--ghost'));
    }).join('') + noirFigmaBlockHtml(figmaActions, 'close');
    const heroLead = proyecto.heroLead || proyecto.heroText || proyecto.role;
    const slideHtml = slides.map(function (photo, index) {
      return noirSlideHtml(photo, index, index === 0);
    }).join('');
    const dotsHtml = slides.map(function (photo, index) {
      return (
        '<button type="button" class="noir-hero-dot' + (index === 0 ? ' is-active' : '') + '" data-noir-slide="' + index + '"' +
          ' aria-label="Ver imagen ' + (index + 1) + '"></button>'
      );
    }).join('');
    const cardHtml = cards.map(function (card, index) {
      return noirServiceCardHtml(card, slides.length + index);
    }).join('');
    const galleryHtml = photos.map(function (photo, index) {
      const wide = !!(photo && photo.wide);
      return (
        '<figure class="noir-gallery-item' + (wide ? ' noir-gallery-item--wide' : ' noir-gallery-item--tall') + '">' +
          noirPhotoHtml(photo, slides.length + cards.length + index, wide ? 'noir-photo--wide' : 'noir-photo--tall') +
        '</figure>'
      );
    }).join('');

    container.innerHTML =
      '<div class="noir-editorial">' +
        '<section class="noir-hero">' +
          '<div class="noir-hero-slider" data-noir-slider>' +
            '<div class="noir-hero-viewport">' +
              '<div class="noir-hero-track">' +
                slideHtml +
              '</div>' +
            '</div>' +
            (slides.length > 1
              ? '<button type="button" class="noir-hero-arrow noir-hero-prev" aria-label="Imagen anterior">‹</button>' +
                '<button type="button" class="noir-hero-arrow noir-hero-next" aria-label="Imagen siguiente">›</button>' +
                '<div class="noir-hero-dots">' + dotsHtml + '</div>'
              : '') +
          '</div>' +
          '<div class="noir-hero-copy">' +
            '<a class="noir-back" href="' + homeHref() + '">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M15 18l-6-6 6-6"></path>' +
              '</svg>' +
              '<span>Volver al inicio</span>' +
            '</a>' +
            '<div class="noir-hero-text">' +
              (proyecto.category ? '<p class="noir-kicker">' + proyecto.category + '</p>' : '') +
              '<h1>' + (proyecto.pageTitle || proyecto.title) + '</h1>' +
              (heroLead ? '<p class="noir-hero-lead">' + heroLead + '</p>' : '') +
              (proyecto.tools ? '<p class="noir-hero-tools"><span>Herramientas</span> ' + proyecto.tools + '</p>' : '') +
              noirFigmaBlockHtml(figmaActions, 'hero') +
            '</div>' +
          '</div>' +
        '</section>' +
        (cardHtml
          ? '<section class="noir-services" aria-label="Servicios">' +
              '<div class="noir-services-row">' +
                '<button type="button" class="noir-services-arrow noir-services-prev" aria-label="Ver servicio anterior">‹</button>' +
                '<div class="noir-services-viewport" data-noir-services>' +
                  '<div class="noir-services-track">' + cardHtml + '</div>' +
                '</div>' +
                '<button type="button" class="noir-services-arrow noir-services-next" aria-label="Ver servicio siguiente">›</button>' +
              '</div>' +
              '<div class="noir-services-dots" data-noir-service-dots></div>' +
              (proyecto.servicesNote ? '<p class="noir-services-note">' + proyecto.servicesNote + '</p>' : '') +
            '</section>'
          : '') +
        '<section class="noir-process">' +
          '<div class="noir-wrap">' +
            '<h2>' + proyecto.processTitle + '</h2>' +
            '<div class="noir-steps">' +
              noirStepHtml(steps[0], 1) +
              noirStepHtml(steps[1], 2) +
              noirStepHtml(steps[2], 3) +
              noirStepHtml(steps[3], 4) +
            '</div>' +
          '</div>' +
        '</section>' +
        (galleryHtml
          ? '<section class="noir-gallery" aria-label="Galería del proyecto">' +
              '<div class="noir-wrap">' +
                '<div class="noir-gallery-grid">' + galleryHtml + '</div>' +
              '</div>' +
            '</section>'
          : '') +
        '<section class="noir-close">' +
          '<div class="noir-wrap">' +
            '<p class="noir-close-brand">' + proyecto.title + '</p>' +
            '<div class="noir-close-actions">' + closeActions + '</div>' +
          '</div>' +
        '</section>' +
        '<dialog class="noir-lightbox" aria-label="Imagen ampliada">' +
          '<button type="button" class="noir-lightbox-close" aria-label="Cerrar">×</button>' +
          '<button type="button" class="noir-lightbox-prev" aria-label="Imagen anterior">‹</button>' +
          '<img alt="">' +
          '<button type="button" class="noir-lightbox-next" aria-label="Imagen siguiente">›</button>' +
        '</dialog>' +
      '</div>';

    bindNoirSlider(container.querySelector('[data-noir-slider]'));
    bindNoirServices(container.querySelector('[data-noir-services]'));
    bindSimpleLightbox(
      container.querySelector('.noir-editorial'),
      container.querySelector('.noir-lightbox'),
      lightbox,
      {
        item: '[data-noir-index]',
        indexAttr: 'data-noir-index',
        close: '.noir-lightbox-close',
        prev: '.noir-lightbox-prev',
        next: '.noir-lightbox-next'
      }
    );
  }

  function mayoLooksGif(item) {
    return item && /\.gif$/i.test(item.src || '');
  }

  function mayoLooksPoster(item) {
    return item && /afiche/i.test(((item.alt || '') + ' ' + (item.src || '')).toLowerCase()) && !mayoLooksGif(item);
  }

  function mayoTitleHtml(title) {
    const parts = String(title || '').trim().split(/\s+/);
    if (parts.length < 2) return title || '';
    return (
      '<span class="mayo-title-mayo">' + parts[0] + '</span>' +
      '<span class="mayo-title-amarillo">' + parts.slice(1).join(' ') + '</span>'
    );
  }

  function mayoHeadHtml(num, title) {
    if (!title) return '';
    const label = (num < 10 ? '0' : '') + num;
    return (
      '<header class="mayo-head">' +
        '<span class="mayo-num">' + label + '</span>' +
        '<h2>' + title + '</h2>' +
        '<span class="mayo-rule" aria-hidden="true"></span>' +
      '</header>'
    );
  }

  function mayoPhotoHtml(item, index, extraClass, eager, innerExtra) {
    if (!item || !item.src) return '';
    const size = (item.width && item.height)
      ? ' width="' + item.width + '" height="' + item.height + '"'
      : '';
    return (
      '<button type="button" class="mayo-photo' + (extraClass ? ' ' + extraClass : '') + '" data-mayo-index="' + index + '">' +
        '<img src="' + asset(item.src) + '" alt="' + (item.alt || '') + '"' + size +
          (eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') +
          ' decoding="async">' +
        (innerExtra || '') +
      '</button>'
    );
  }

  function mayoFindPhoto(photos, needle) {
    const key = String(needle || '').toLowerCase();
    return (photos || []).find(function (item) {
      return item && String(item.src || '').toLowerCase().replace(/\\/g, '/').indexOf(key) !== -1;
    }) || null;
  }

  function mayoPieceHtml(item, index, slot, caption, extras) {
    extras = extras || {};
    if (!item) return '';
    return (
      '<figure class="mayo-piece mayo-piece--' + slot + '">' +
        mayoPhotoHtml(item, index, extras.photoClass || '', true, extras.inner || '') +
        (caption ? '<figcaption>' + caption + '</figcaption>' : '') +
      '</figure>'
    );
  }

  function renderMayoCase(container, proyecto) {
    const photos = proyecto.gallery || [];
    const steps = proyecto.process || [];
    const posters = photos.filter(mayoLooksPoster);
    const gifs = photos.filter(mayoLooksGif);
    const heroPhoto = posters[0] || photos[0];
    const lightbox = [];

    function take(item) {
      if (!item || !item.src) return -1;
      const existing = lightbox.findIndex(function (entry) { return entry.src === item.src; });
      if (existing !== -1) return existing;
      lightbox.push(item);
      return lightbox.length - 1;
    }

    const heroIndex = take(heroPhoto);
    const posterFigures = (posters.length ? posters : []).map(function (item) {
      const caption = item.alt || '';
      return (
        '<figure class="mayo-poster">' +
          mayoPhotoHtml(item, take(item), 'mayo-photo--contain', false) +
          (caption ? '<figcaption>' + caption + '</figcaption>' : '') +
        '</figure>'
      );
    }).join('');

    const piece01 = mayoFindPhoto(photos, '5-posteoigmayo');
    const piece02 = mayoFindPhoto(photos, '4-posteoigmayoa.jpg');
    const piece03 = mayoFindPhoto(photos, '1-posteoigmayoa');
    const piece04 = piece01;
    const piece05 = mayoFindPhoto(photos, '2-posteoig.jpg');
    const piece06 = gifs[0] || mayoFindPhoto(photos, 'reel-ig-final.gif');
    const ribbonMark =
      '<img src="' + asset('IMAGENES/Mayo amarillo/moño mayo.png?v=20260910s07') +
        '" alt="" width="280" height="396" decoding="async">';
    const gifOverlay =
      '<span class="mayo-gif-play" aria-hidden="true"><span class="mayo-gif-play-icon"></span></span>' +
      '<span class="mayo-gif-tag">GIF</span>';

    const gifHtml = piece06
      ? '<figure class="mayo-piece mayo-piece--06">' +
          '<div class="mayo-gif-cluster">' +
            mayoPhotoHtml(piece06, take(piece06), 'mayo-photo--gif', true, gifOverlay) +
            '<p class="mayo-gif-aside">El mismo momento.<br>En movimiento.</p>' +
          '</div>' +
        '</figure>'
      : '';

    const campaignHtml = (
      '<div class="mayo-board-ribbon mayo-board-ribbon--tr" aria-hidden="true">' + ribbonMark + '</div>' +
      '<div class="mayo-board-ribbon mayo-board-ribbon--bl" aria-hidden="true">' + ribbonMark + '</div>' +
      '<div class="mayo-board">' +
        '<aside class="mayo-board-copy">' +
          '<header class="mayo-board-head">' +
            '<span class="mayo-num">05</span>' +
            '<h2>Campaña<br>en redes</h2>' +
          '</header>' +
          '<p>La campaña cobró vida en redes sociales con piezas de alto impacto, pensadas para generar conciencia, conversación y alcance masivo. A través de fotografías, videos y contenido en formato vertical, llevamos el mensaje a nuevas audiencias.</p>' +
          '<p class="mayo-board-line">Mismas calles. Más conciencia.</p>' +
          '<div class="mayo-board-brand">' +
            '<p class="mayo-board-brand-name">Mayo Amarillo</p>' +
            '<p class="mayo-board-slogan">QUE NO SEA LA ULTIMA NOTICIA QUE TU FAMILIA RECIBA DE VOS.</p>' +
          '</div>' +
          gifHtml +
        '</aside>' +
        '<div class="mayo-board-grid">' +
          mayoPieceHtml(piece01, take(piece01), '01') +
          mayoPieceHtml(piece02, take(piece02), '02') +
          mayoPieceHtml(piece03, take(piece03), '03') +
          mayoPieceHtml(piece04, take(piece04), '04') +
          mayoPieceHtml(piece05, take(piece05), '05') +
        '</div>' +
      '</div>'
    );

    const closeActions = (proyecto.actions || []).map(function (action, index) {
      return actionLinkHtml(action, 'mayo-cta' + (index === 0 ? ' mayo-cta--solid' : ' mayo-cta--ghost'));
    }).join('');

    const closeSteps = steps.slice(2);
    const closeCopy = closeSteps.map(function (item) {
      return (
        '<div class="mayo-close-copy">' +
          (item.title ? '<h2>' + item.title + '</h2>' : '') +
          '<p>' + item.text + '</p>' +
        '</div>'
      );
    }).join('');

    const heroLead = proyecto.role || '';

    container.innerHTML =
      '<div class="mayo-editorial">' +
        '<section class="mayo-hero">' +
          '<div class="mayo-hero-copy">' +
            '<a class="mayo-back" href="' + homeHref() + '">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M15 18l-6-6 6-6"></path>' +
              '</svg>' +
              '<span>Volver al inicio</span>' +
            '</a>' +
            (proyecto.category ? '<p class="mayo-kicker">' + proyecto.category + '</p>' : '') +
            '<h1>' + mayoTitleHtml(proyecto.pageTitle || proyecto.title) + '</h1>' +
            (heroLead ? '<p class="mayo-hero-lead">' + heroLead + '</p>' : '') +
            (proyecto.tools ? '<p class="mayo-hero-tools"><span>Herramientas</span> ' + proyecto.tools + '</p>' : '') +
          '</div>' +
          '<figure class="mayo-hero-visual">' +
            mayoPhotoHtml(heroPhoto, heroIndex, 'mayo-photo--hero', true) +
          '</figure>' +
        '</section>' +
        ((steps[0] || steps[1])
          ? '<section class="mayo-duo">' +
              (steps[0]
                ? '<article class="mayo-copy">' + mayoHeadHtml(1, steps[0].title) + '<p>' + steps[0].text + '</p></article>'
                : '') +
              (steps[1]
                ? '<article class="mayo-copy">' + mayoHeadHtml(2, steps[1].title) + '<p>' + steps[1].text + '</p></article>'
                : '') +
            '</section>'
          : '') +
        (posterFigures
          ? '<section class="mayo-posters" aria-label="Afiche">' +
              mayoHeadHtml(3, 'Exploración del afiche') +
              '<div class="mayo-poster-grid">' + posterFigures + '</div>' +
            '</section>'
          : '') +
        (campaignHtml
          ? '<section class="mayo-feed" aria-label="Campaña en redes">' + campaignHtml + '</section>'
          : '') +
        '<section class="mayo-close">' +
          '<p class="mayo-close-brand">' + proyecto.title + '</p>' +
          (closeCopy || '') +
          (closeActions ? '<div class="mayo-close-actions">' + closeActions + '</div>' : '') +
        '</section>' +
        '<dialog class="mayo-lightbox" aria-label="Imagen ampliada">' +
          '<button type="button" class="mayo-lightbox-close" aria-label="Cerrar">×</button>' +
          '<button type="button" class="mayo-lightbox-prev" aria-label="Imagen anterior">‹</button>' +
          '<img alt="">' +
          '<button type="button" class="mayo-lightbox-next" aria-label="Imagen siguiente">›</button>' +
        '</dialog>' +
      '</div>';

    bindSimpleLightbox(
      container.querySelector('.mayo-editorial'),
      container.querySelector('.mayo-lightbox'),
      lightbox,
      {
        item: '[data-mayo-index]',
        indexAttr: 'data-mayo-index',
        close: '.mayo-lightbox-close',
        prev: '.mayo-lightbox-prev',
        next: '.mayo-lightbox-next'
      }
    );
  }

  function renderProcess(container, proyecto) {
    if (!container) return;

    if (proyecto.processLayout === 'editorial') {
      renderEditorialProcess(container, proyecto);
      return;
    }

    if (proyecto.processLayout === 'trail') {
      renderTrailProcess(container, proyecto);
      return;
    }

    if (proyecto.processLayout === 'noir') {
      renderNoirCase(container, proyecto);
      return;
    }

    if (proyecto.processLayout === 'mayo') {
      renderMayoCase(container, proyecto);
      return;
    }

    if (proyecto.galleryLayout === 'reel') {
      renderReelProcess(container, proyecto);
      return;
    }

    // Foto (id 4): markup estático en trabajos/proyecto-fotografico.html
    container.innerHTML = '';
  }

  function renderOtherProjects(container, currentId) {
    if (!container) return;

    const proyecto = getProyecto(currentId);
    if (!proyecto) return;

    const cards = proyecto.related.map(function (id) {
      const related = getProyecto(id);
      if (!related) return '';

      return (
        '<a class="other-project-card" href="./' + related.slug + '">' +
          '<div class="other-project-image">' +
            '<img loading="lazy" decoding="async" src="' + asset(related.cardImage) + '" alt="' + related.title + '">' +
          '</div>' +
          '<div class="other-project-content">' +
            '<h3>' + related.title + '</h3>' +
          '</div>' +
        '</a>'
      );
    }).join('');

    container.innerHTML =
      '<h2>Otros proyectos</h2>' +
      '<div class="other-projects-grid">' + cards + '</div>' +
      '<p class="other-projects-home"><a href="' + homeHref() + '#trabajos">Ver todos los trabajos</a></p>';
  }

  function notifyRendered() {
    document.dispatchEvent(new CustomEvent('portfolio:rendered'));
  }

  function renderProjectDetail(proyectoId) {
    const proyecto = getProyecto(proyectoId);
    if (!proyecto) return;

    document.title = (proyecto.pageTitle || proyecto.title) + ' — Rodrigo Caimi';

    renderGallery(document.querySelector('[data-proyecto-gallery]'), proyecto);
    renderProcess(document.querySelector('[data-proyecto-process]'), proyecto);
    renderActions(document.querySelector('[data-proyecto-actions]'), proyecto);
    renderOtherProjects(document.querySelector('[data-proyecto-related]'), proyectoId);
    notifyRendered();
  }

  document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.work-container[data-render="grid"]');
    if (grid) {
      renderWorkGrid(grid);
      notifyRendered();
    }

    const proyectoId = Number(document.body.dataset.proyectoId);
    if (proyectoId) {
      renderProjectDetail(proyectoId);
    }
  });
})();
