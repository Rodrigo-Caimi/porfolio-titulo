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
      proyecto.processLayout === 'noir'
    );
  }

  function renderWorkGrid(container) {
    if (!container) return;

    const layoutOrder = [8, 6, 7, 3, 5, 1, 2, 4];
    const ordered = layoutOrder
      .map(function (id) { return getProyecto(id); })
      .filter(Boolean);

    container.innerHTML = ordered.map(function (proyecto) {
      const thumb = proyecto.cardImage
        ? '<img loading="lazy" decoding="async" alt="' + proyecto.cardAlt + '" src="' + asset(proyecto.cardImage) + '" />'
        : '';
      const category = proyecto.category
        ? '<span class="card-category">' + proyecto.category + '</span>'
        : '';
      const body =
        '<div class="card-body">' +
          '<div class="card-text">' +
            category +
            '<span class="card-title">' + proyecto.title + '</span>' +
          '</div>' +
        '</div>';

      if (proyecto.placeholder) {
        return (
          '<div class="card ' + proyecto.cardClass + '" aria-label="' + proyecto.title + '">' +
            '<div class="thumb">' + thumb + '</div>' +
            body +
          '</div>'
        );
      }

      return (
        '<a class="card ' + proyecto.cardClass + '" href="' + proyectoHref(proyecto.slug) + '">' +
          '<div class="thumb">' + thumb + '</div>' +
          body +
        '</a>'
      );
    }).join('');
  }

  function isVideoItem(item) {
    return item && (item.type === 'video' || /\.(mp4|webm|ogg)$/i.test(item.src || ''));
  }

  function isDriveItem(item) {
    return item && item.type === 'drive';
  }

  function driveFileId(link) {
    if (!link || link.indexOf('PEGAR_LINK') !== -1) return '';
    const match = String(link).match(/\/d\/([a-zA-Z0-9_-]+)/) || String(link).match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : '';
  }

  function drivePreviewUrl(link) {
    const id = driveFileId(link);
    if (id) return 'https://drive.google.com/file/d/' + id + '/preview';
    if (!link || link.indexOf('PEGAR_LINK') !== -1) return '';
    return link.indexOf('drive.google.com') !== -1 ? link : '';
  }

  function driveViewUrl(link) {
    const id = driveFileId(link);
    if (id) return 'https://drive.google.com/file/d/' + id + '/view';
    if (!link || link.indexOf('PEGAR_LINK') !== -1) return '';
    return link;
  }

  // iOS/móvil: el embed de Drive deja play/controles trabados a mitad de pantalla
  function shouldOpenDriveExternally() {
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isMobileViewport = window.matchMedia('(max-width: 920px)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    return isIOS || isMobileViewport || coarsePointer;
  }

  function drivePosterHtml(preview, viewUrl, poster, alt, mainClass, eager) {
    const label = shouldOpenDriveExternally() ? 'Ver video en Drive' : 'Reproducir video';
    const eagerAttrs = eager
      ? ' decoding="async" fetchpriority="high"'
      : ' decoding="async"';
    return (
      '<button type="button" class="drive-poster" data-drive-preview="' + (preview || '') + '" data-drive-view="' + (viewUrl || '') + '" data-drive-title="' + (alt || 'Video') + '" aria-label="' + label + '">' +
        '<img id="main-media" class="' + (mainClass || '') + '" src="' + (poster || '') + '" alt="' + (alt || '') + '"' + eagerAttrs + ' />' +
        '<span class="drive-poster-label">' + label + '</span>' +
      '</button>'
    );
  }

  function renderShot(item, index) {
    const eager = index === 0;
    const loading = eager ? 'eager' : 'lazy';
    const isMedia = isVideoItem(item) || isDriveItem(item);
    let media;

    if (isDriveItem(item)) {
      const preview = drivePreviewUrl(item.src);
      const viewUrl = driveViewUrl(item.src);
      const poster = asset(item.poster || '');
      if (preview || viewUrl) {
        media = drivePosterHtml(preview, viewUrl, poster, item.alt, 'shot-media', eager);
      } else {
        media = '<img class="shot-media" src="' + poster + '" alt="' + (item.alt || '') + '" loading="' + loading + '" decoding="async" />';
      }
    } else if (isVideoItem(item)) {
      media = '<video class="shot-media" controls playsinline poster="' + asset(item.poster || '') + '" src="' + asset(item.src) + '"></video>';
    } else {
      media =
        '<img class="shot-media" src="' + asset(item.src) + '" alt="' + (item.alt || '') + '" loading="' + loading + '" decoding="async"' +
        (eager ? ' fetchpriority="high"' : '') +
        ' />';
    }

    return '<figure class="shot' + (isMedia ? ' shot--video' : '') + '">' + media + '</figure>';
  }

  function bindShotRatio(shot) {
    const media = shot.querySelector('img, video');
    if (!media) return;

    function apply() {
      const w = media.naturalWidth || media.videoWidth;
      const h = media.naturalHeight || media.videoHeight;
      if (!w || !h) return;
      shot.style.setProperty('--shot-ratio', w + ' / ' + h);
    }

    if (media.tagName === 'VIDEO') {
      media.addEventListener('loadedmetadata', apply);
      return;
    }

    if (media.complete && media.naturalWidth) apply();
    else media.addEventListener('load', apply);
  }

  function renderGallery(container, proyecto) {
    if (!container) return;

    const items = proyecto.gallery || [];
    if (isCustomCase(proyecto) || !items.length) {
      container.innerHTML = '';
      return;
    }

    const layout = proyecto.galleryLayout || 'spread';
    const shots = items.map(renderShot);
    var inner;

    if (layout === 'poster') {
      inner = shots[0] + '<div class="shot-stack">' + shots.slice(1).join('') + '</div>';
    } else if (layout === 'essay') {
      inner = shots[0] + '<div class="shot-stack">' + shots.slice(1, 3).join('') + '</div>' + shots.slice(3).join('');
    } else {
      inner = shots.join('');
    }

    container.innerHTML =
      '<div class="gallery gallery--' + layout + '" data-gallery>' + inner + '</div>';

    container.querySelectorAll('.shot').forEach(function (shot) {
      bindShotRatio(shot);
      bindDrivePoster(shot);
    });
  }

  function loadDriveEmbed(mainWrap, preview, title) {
    if (!mainWrap || !preview) return;
    mainWrap.classList.add('is-drive-playing');
    mainWrap.innerHTML =
      '<iframe id="main-media" class="drive-embed" src="' + preview + '" title="' + (title || 'Video') + '" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen webkitallowfullscreen playsinline></iframe>';
  }

  function openDriveExternal(viewUrl, preview) {
    const url = viewUrl || (preview ? String(preview).replace('/preview', '/view') : '');
    if (!url) return false;
    window.open(url, '_blank', 'noopener');
    return true;
  }

  function bindDrivePoster(mainWrap) {
    if (!mainWrap) return;
    const btn = mainWrap.querySelector('.drive-poster');
    if (!btn || btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', function () {
      const preview = btn.getAttribute('data-drive-preview') || '';
      const viewUrl = btn.getAttribute('data-drive-view') || '';
      const title = btn.getAttribute('data-drive-title') || 'Video';

      // Evita el bug de iPhone: UI de Drive atrapada a mitad de pantalla
      if (shouldOpenDriveExternally()) {
        openDriveExternal(viewUrl, preview);
        return;
      }

      if (preview) {
        loadDriveEmbed(mainWrap, preview, title);
        return;
      }

      openDriveExternal(viewUrl, preview);
    });
  }

  function renderActions(container, proyecto) {
    if (!container) return;

    if (isCustomCase(proyecto) || !proyecto.actions || !proyecto.actions.length) {
      container.innerHTML = '';
      container.hidden = true;
      return;
    }

    container.hidden = false;

    const rows = proyecto.actions.map(function (action) {
      if (action.href && String(action.href).indexOf('PEGAR_LINK') !== -1) return '';

      const href = action.external ? action.href : asset(action.href);
      const attrs = action.external
        ? ' target="_blank" rel="noopener"'
        : (action.download
          ? ' target="_blank" rel="noopener" download="' + (action.download || '') + '"'
          : ' target="_blank" rel="noopener"');

      var prompt = action.external
        ? (action.label && /reel|video|drive/i.test(action.label)
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

  function renderMeta(container, proyecto) {
    if (!container) return;

    if (proyecto.hideMeta || (!proyecto.category && !proyecto.role && !proyecto.tools)) {
      container.innerHTML = '';
      container.hidden = true;
      return;
    }

    container.hidden = false;
    container.innerHTML =
      '<div class="project-meta">' +
        (proyecto.category ? '<p><span>Categoría</span> ' + proyecto.category + '</p>' : '') +
        (proyecto.role ? '<p><span>Rol</span> ' + proyecto.role + '</p>' : '') +
        (proyecto.tools ? '<p><span>Herramientas</span> ' + proyecto.tools + '</p>' : '') +
      '</div>';
  }

  function actionLinkHtml(action, className) {
    if (!action || (action.href && String(action.href).indexOf('PEGAR_LINK') !== -1)) return '';

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

    return (
      '<article class="wine-block wine-block--' + n + '">' +
        '<header class="wine-block-head">' +
          '<span class="wine-num">' + num + '</span>' +
          '<h3><span class="wine-sep" aria-hidden="true">•</span> ' + item.title + '</h3>' +
        '</header>' +
        '<p>' + item.text + '</p>' +
      '</article>'
    );
  }

  function renderEditorialProcess(container, proyecto) {
    const ed = proyecto.editorial || {};
    const steps = proyecto.process || [];
    const gallery = ed.gallery || [];
    const actions = (proyecto.actions || []).filter(function (action) {
      return !(action.external && /drive|video/i.test((action.label || '') + (action.href || '')));
    }).map(function (action, index) {
      return actionLinkHtml(action, 'btn wine-btn' + (index === 0 ? ' wine-btn--solid' : ' wine-btn--ghost'));
    }).join('');

    const mosaic = gallery.map(function (item, index) {
      return (
        '<button type="button" class="wine-mosaic-item" data-wine-index="' + index + '">' +
          '<img src="' + asset(item.src) + '" alt="' + (item.alt || '') + '"' +
            (index === 0 ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') +
            ' decoding="async">' +
        '</button>'
      );
    }).join('');

    const lineMarks = [1, 2, 3, 4].map(function (n) {
      return '<path data-wine-line="' + n + '"></path>' +
        '<circle data-wine-dot="' + n + 'a" r="3.5"></circle>' +
        '<circle data-wine-dot="' + n + 'b" r="3.5"></circle>';
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
            (ed.caption ? '<figcaption class="wine-caption">' + ed.caption + '</figcaption>' : '') +
          '</figure>' +
          wineBlockHtml(steps[1], 2) +
          wineBlockHtml(steps[2], 3) +
          wineBlockHtml(steps[3], 4) +
        '</div>' +
        '</div>' +
        '<div class="wine-gallery">' +
          '<h2 class="wine-gallery-title">Más fotos</h2>' +
          '<div class="wine-mosaic">' + mosaic + '</div>' +
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

  function bindSimpleLightbox(gallery, dialog, items, opts) {
    if (!gallery || !dialog || !items || !items.length) return;
    opts = opts || {};
    const itemSel = opts.item || '[data-ubicar-index]';
    const indexAttr = opts.indexAttr || 'data-ubicar-index';
    const img = dialog.querySelector('img');
    const closeBtn = dialog.querySelector(opts.close || '.ubicar-lightbox-close');
    const prevBtn = dialog.querySelector(opts.prev || '.ubicar-lightbox-prev');
    const nextBtn = dialog.querySelector(opts.next || '.ubicar-lightbox-next');
    let index = 0;

    function show(i) {
      index = (i + items.length) % items.length;
      const item = items[index];
      img.src = asset(item.src);
      img.alt = item.alt || '';
      if (item.w) img.width = item.w;
      if (item.h) img.height = item.h;
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
    dialog.addEventListener('close', function () {
      img.removeAttribute('src');
    });
  }

  function bindWineArrows(stage) {
    if (!stage) return;
    const svg = stage.querySelector('.wine-lines');
    const bottle = stage.querySelector('.wine-bottle img');
    if (!svg || !bottle) return;

    function localPoint(el, relX, relY) {
      const sr = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        x: r.left - sr.left + r.width * relX,
        y: r.top - sr.top + r.height * relY
      };
    }

    function draw() {
      if (window.matchMedia('(max-width: 900px)').matches) return;
      const sr = stage.getBoundingClientRect();
      if (!sr.width || !sr.height) return;

      svg.setAttribute('viewBox', '0 0 ' + sr.width + ' ' + sr.height);
      svg.setAttribute('width', String(sr.width));
      svg.setAttribute('height', String(sr.height));

      const specs = [
        { n: 1, from: [1, 0.36], to: [0.08, 0.27], bulge: 74, lift: -26 },
        { n: 2, from: [0, 0.40], to: [0.92, 0.24], bulge: -82, lift: 18 },
        { n: 3, from: [1, 0.58], to: [0.10, 0.71], bulge: 58, lift: 30 },
        { n: 4, from: [0, 0.52], to: [0.90, 0.73], bulge: -90, lift: -16 }
      ];

      specs.forEach(function (spec) {
        const block = stage.querySelector('.wine-block--' + spec.n);
        const path = svg.querySelector('[data-wine-line="' + spec.n + '"]');
        const dotA = svg.querySelector('[data-wine-dot="' + spec.n + 'a"]');
        const dotB = svg.querySelector('[data-wine-dot="' + spec.n + 'b"]');
        if (!block || !path) return;
        const from = localPoint(block, spec.from[0], spec.from[1]);
        const to = localPoint(bottle, spec.to[0], spec.to[1]);
        const c1x = from.x + spec.bulge;
        const c1y = from.y + spec.lift;
        const c2x = to.x - spec.bulge * 0.28;
        const c2y = to.y - spec.lift * 0.4;
        path.setAttribute('d',
          'M' + from.x.toFixed(1) + ' ' + from.y.toFixed(1) +
          ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) +
          ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) +
          ', ' + to.x.toFixed(1) + ' ' + to.y.toFixed(1)
        );
        if (dotA) {
          dotA.setAttribute('cx', from.x.toFixed(1));
          dotA.setAttribute('cy', from.y.toFixed(1));
        }
        if (dotB) {
          dotB.setAttribute('cx', to.x.toFixed(1));
          dotB.setAttribute('cy', to.y.toFixed(1));
        }
      });
    }

    const redraw = function () { window.requestAnimationFrame(draw); };
    if (!bottle.complete) bottle.addEventListener('load', redraw, { once: true });
    let resizeTimer = 0;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(redraw, 120);
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

  function renderNoirCase(container, proyecto) {
    const photos = proyecto.gallery || [];
    const steps = proyecto.process || [];
    const figma = (proyecto.actions || []).filter(function (action) {
      return action && action.external;
    })[0];
    const closeActions = (proyecto.actions || []).map(function (action, index) {
      return actionLinkHtml(action, 'noir-cta' + (index === 0 ? ' noir-cta--solid' : ' noir-cta--ghost'));
    }).join('');

    container.innerHTML =
      '<div class="noir-editorial">' +
        '<section class="noir-hero">' +
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
              (proyecto.role ? '<p class="noir-hero-lead">' + proyecto.role + '</p>' : '') +
              (proyecto.tools ? '<p class="noir-hero-tools"><span>Herramientas</span> ' + proyecto.tools + '</p>' : '') +
              (figma ? actionLinkHtml(figma, 'noir-cta noir-cta--solid') : '') +
            '</div>' +
          '</div>' +
          '<figure class="noir-hero-visual">' +
            noirPhotoHtml(photos[0], 0, 'noir-photo--hero', true) +
          '</figure>' +
        '</section>' +
        '<section class="noir-board-section" aria-label="Piezas del proyecto">' +
          '<div class="noir-wrap">' +
            '<div class="noir-board">' +
              '<figure class="noir-board-item noir-board-item--experience">' +
                noirPhotoHtml(photos[2], 2, 'noir-photo--contain') +
                (photos[2] && photos[2].alt ? '<figcaption>' + photos[2].alt + '</figcaption>' : '') +
              '</figure>' +
              '<figure class="noir-board-item noir-board-item--tools">' +
                noirPhotoHtml(photos[1], 1, 'noir-photo--contain') +
                (photos[1] && photos[1].alt ? '<figcaption>' + photos[1].alt + '</figcaption>' : '') +
              '</figure>' +
              '<figure class="noir-board-item noir-board-item--products">' +
                noirPhotoHtml(photos[3], 3, 'noir-photo--contain') +
                (photos[3] && photos[3].alt ? '<figcaption>' + photos[3].alt + '</figcaption>' : '') +
              '</figure>' +
            '</div>' +
          '</div>' +
        '</section>' +
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

    bindSimpleLightbox(
      container.querySelector('.noir-editorial'),
      container.querySelector('.noir-lightbox'),
      photos,
      {
        item: '[data-noir-index]',
        indexAttr: 'data-noir-index',
        close: '.noir-lightbox-close',
        prev: '.noir-lightbox-prev',
        next: '.noir-lightbox-next'
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

    const items = proyecto.process.map(function (item) {
      return (
        '<div class="golden-item">' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + item.text + '</p>' +
        '</div>'
      );
    }).join('');

    container.innerHTML =
      '<h2>' + proyecto.processTitle + '</h2>' +
      '<div class="golden-vertical">' + items + '</div>';
  }

  function renderOtherProjects(container, currentId) {
    if (!container) return;

    const proyecto = getProyecto(currentId);
    if (!proyecto) return;

    const cards = proyecto.related.map(function (id) {
      const related = getProyecto(id);
      if (!related || related.placeholder) return '';

      return (
        '<a class="other-project-card" href="./' + related.slug + '">' +
          '<div class="other-project-image">' +
            '<img loading="lazy" src="' + asset(related.cardImage) + '" alt="' + related.title + '">' +
          '</div>' +
          '<div class="other-project-content">' +
            '<h3>' + related.title + '</h3>' +
          '</div>' +
        '</a>'
      );
    }).join('');

    container.innerHTML =
      '<h2>Otros proyectos</h2>' +
      '<div class="other-projects-grid">' + cards + '</div>';
  }

  function renderProjectTitle(container, proyecto) {
    if (!container || !proyecto) return;
    if (isCustomCase(proyecto)) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = '<h1>' + proyecto.title + '</h1>';
  }

  function renderProjectDetail(proyectoId) {
    const proyecto = getProyecto(proyectoId);
    if (!proyecto) return;

    document.title = (proyecto.pageTitle || proyecto.title) + ' — Rodrigo Caimi';

    renderProjectTitle(document.querySelector('[data-proyecto-title]'), proyecto);
    renderGallery(document.querySelector('[data-proyecto-gallery]'), proyecto);
    renderMeta(document.querySelector('[data-proyecto-meta]'), proyecto);
    renderProcess(document.querySelector('[data-proyecto-process]'), proyecto);
    renderActions(document.querySelector('[data-proyecto-actions]'), proyecto);
    renderOtherProjects(document.querySelector('[data-proyecto-related]'), proyectoId);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.work-container[data-render="grid"]');
    if (grid) {
      renderWorkGrid(grid);
    }

    const proyectoId = Number(document.body.dataset.proyectoId);
    if (proyectoId) {
      renderProjectDetail(proyectoId);
    }
  });
})();
