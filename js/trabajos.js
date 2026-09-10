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
        ' allow="fullscreen; picture-in-picture"' +
        ' allowfullscreen' +
        ' referrerpolicy="strict-origin-when-cross-origin">' +
      '</iframe>'
    );
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
    const isMedia = isVideoItem(item) || isDriveItem(item) || isVimeoItem(item);
    let media;

    if (isVimeoItem(item)) {
      media = vimeoEmbedHtml(item);
    } else if (isDriveItem(item)) {
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

    return '<figure class="shot' + (isMedia ? ' shot--video' : '') + (isVimeoItem(item) ? ' shot--vimeo' : '') + '">' + media + '</figure>';
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

    if (layout === 'poster' || layout === 'reel') {
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
    const actions = (proyecto.actions || []).filter(function (action) {
      return !(action.external && /drive|video/i.test((action.label || '') + (action.href || '')));
    }).map(function (action, index) {
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
    const bottleFig = stage.querySelector('.wine-bottle');
    if (!svg || !bottle || !bottleFig) return;

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
        { n: 1, from: [1, 0.36], side: -1, y: 0.30 },
        { n: 2, from: [0, 0.38], side: 1, y: 0.30 },
        { n: 3, from: [1, 0.62], side: -1, y: 0.68 },
        { n: 4, from: [0, 0.60], side: 1, y: 0.68 }
      ];

      function trailD(from, to, side, shift) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const amp = side * Math.min(160, Math.max(64, len * 0.38));
        const a = { x: from.x + nx * shift, y: from.y + ny * shift };
        const b = { x: to.x + nx * shift, y: to.y + ny * shift };
        const c1x = a.x + dx * 0.26 + nx * amp;
        const c1y = a.y + dy * 0.18 + ny * amp;
        const c2x = a.x + dx * 0.74 - nx * amp;
        const c2y = a.y + dy * 0.82 - ny * amp;
        return 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) +
          ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) +
          ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) +
          ', ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
      }

      const br = bottle.getBoundingClientRect();
      const srBox = stage.getBoundingClientRect();
      const glassHalf = br.width * 0.16;
      const bottleMidX = br.left - srBox.left + br.width / 2;

      specs.forEach(function (spec) {
        const block = stage.querySelector('.wine-block--' + spec.n);
        const path = svg.querySelector('[data-wine-line="' + spec.n + '"]');
        const echoA = svg.querySelector('[data-wine-echo="' + spec.n + 'a"]');
        const echoB = svg.querySelector('[data-wine-echo="' + spec.n + 'b"]');
        const dotA = svg.querySelector('[data-wine-dot="' + spec.n + 'a"]');
        const dotB = svg.querySelector('[data-wine-dot="' + spec.n + 'b"]');
        if (!block || !path) return;
        const from = localPoint(block, spec.from[0], spec.from[1]);
        const to = {
          x: bottleMidX + spec.side * glassHalf,
          y: br.top - srBox.top + br.height * spec.y
        };
        path.setAttribute('d', trailD(from, to, spec.side, 0));
        if (echoA) echoA.setAttribute('d', trailD(from, to, spec.side, 8));
        if (echoB) {
          echoB.setAttribute('d', '');
          echoB.style.display = 'none';
        }
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

  function bindWineMosaicLines(wrap) {
    if (!wrap) return;
    const mosaic = wrap.querySelector('.wine-mosaic');
    const svg = wrap.querySelector('.wine-mosaic-lines');
    if (!mosaic || !svg) return;
    const ns = 'http://www.w3.org/2000/svg';

    function localBox(el) {
      const wr = wrap.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        x: r.left - wr.left + r.width / 2,
        y: r.top - wr.top + r.height / 2,
        left: r.left - wr.left,
        w: r.width,
        h: r.height
      };
    }

    function rim(a, b) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const hw = a.w / 2;
      const hh = a.h / 2;
      const scale = Math.min(hw / (Math.abs(dx) || 0.001), hh / (Math.abs(dy) || 0.001));
      return {
        x: a.x + dx * scale,
        y: a.y + dy * scale
      };
    }

    function organicPath(from, to, amp, shift) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const a = { x: from.x + nx * shift, y: from.y + ny * shift };
      const b = { x: to.x + nx * shift, y: to.y + ny * shift };
      const c1x = a.x + dx * 0.28 + nx * amp;
      const c1y = a.y + dy * 0.22 + ny * amp;
      const c2x = a.x + dx * 0.72 - nx * amp;
      const c2y = a.y + dy * 0.78 - ny * amp;
      return 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) +
        ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) +
        ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) +
        ', ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
    }

    function mosaicEdges(nodes) {
      const seen = {};
      const edges = [];
      function add(a, b) {
        if (!a || !b || a.i === b.i) return;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 160) return;
        const key = a.i < b.i ? a.i + '-' + b.i : b.i + '-' + a.i;
        if (seen[key]) return;
        seen[key] = true;
        edges.push([a, b]);
      }

      const sorted = nodes.slice().sort(function (a, b) {
        return a.left - b.left || a.y - b.y;
      });
      const cols = [];
      sorted.forEach(function (node) {
        const last = cols[cols.length - 1];
        if (!last || Math.abs(node.left - last[0].left) > 48) {
          cols.push([node]);
        } else {
          last.push(node);
        }
      });
      cols.forEach(function (col) {
        col.sort(function (a, b) { return a.y - b.y; });
      });

      for (let c = 0; c < cols.length - 1; c++) {
        cols[c].forEach(function (node) {
          const nextCol = cols[c + 1].slice().sort(function (a, b) {
            return Math.abs(a.y - node.y) - Math.abs(b.y - node.y);
          });
          if (nextCol[0]) add(node, nextCol[0]);
          if (nextCol[1] && Math.abs(nextCol[1].y - node.y) < node.h * 1.35) add(node, nextCol[1]);
        });
      }

      if (cols.length >= 3 && !mosaic.querySelector('.wine-mosaic-video')) {
        cols[0].forEach(function (node, i) {
          const far = cols[2][Math.min(i, cols[2].length - 1)];
          if (far) add(node, far);
        });
      }

      nodes.forEach(function (node) {
        const ranked = nodes.filter(function (other) {
          return other.i !== node.i && Math.abs(other.left - node.left) > 48;
        }).map(function (other) {
          return { o: other, d: Math.hypot(node.x - other.x, node.y - other.y) };
        }).sort(function (a, b) { return a.d - b.d; });
        if (ranked[0] && ranked[0].d >= 160) add(node, ranked[0].o);
      });

      return edges;
    }

    function el(name, attrs) {
      const node = document.createElementNS(ns, name);
      Object.keys(attrs).forEach(function (key) {
        node.setAttribute(key, attrs[key]);
      });
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
        const box = localBox(items[i].querySelector('img') || items[i]);
        if (box.w < 8 || box.h < 8) continue;
        box.i = i;
        nodes.push(box);
      }

      const edges = mosaicEdges(nodes);
      const frag = document.createDocumentFragment();

      edges.forEach(function (pair, index) {
        const from = rim(pair[0], pair[1]);
        const to = rim(pair[1], pair[0]);
        const len = Math.hypot(to.x - from.x, to.y - from.y);
        if (len < 140) return;
        const amp = (index % 2 === 0 ? 1 : -1) * Math.min(170, Math.max(52, len * 0.30));
        frag.appendChild(el('path', { class: 'wine-trail-echo', d: organicPath(from, to, amp * 1.08, 6) }));
        frag.appendChild(el('path', { class: 'wine-trail-main', d: organicPath(from, to, amp, 0) }));
        frag.appendChild(el('circle', { cx: from.x.toFixed(1), cy: from.y.toFixed(1), r: '3.4' }));
        frag.appendChild(el('circle', { cx: to.x.toFixed(1), cy: to.y.toFixed(1), r: '3.4' }));
      });

      svg.appendChild(frag);
    }

    const redraw = function () { window.requestAnimationFrame(draw); };
    const images = mosaic.querySelectorAll('img');
    for (let i = 0; i < images.length; i++) {
      images[i].addEventListener('load', redraw);
    }
    let resizeTimer = 0;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(redraw, 120);
    });
    if (typeof ResizeObserver === 'function') {
      const ro = new ResizeObserver(function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(redraw, 80);
      });
      ro.observe(wrap);
      ro.observe(mosaic);
    }
    window.setTimeout(redraw, 480);
    window.setTimeout(redraw, 1100);
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
        '<h3>' + card.title + '</h3>' +
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
    const prev = section && section.querySelector('.noir-services-prev');
    const next = section && section.querySelector('.noir-services-next');

    function step() {
      const card = viewport.querySelector('.noir-service-card');
      const track = viewport.querySelector('.noir-services-track');
      const gap = track ? parseFloat(window.getComputedStyle(track).gap) || 20 : 20;
      return card ? card.getBoundingClientRect().width + gap : 280;
    }

    if (prev) prev.addEventListener('click', function () {
      viewport.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    if (next) next.addEventListener('click', function () {
      viewport.scrollBy({ left: step(), behavior: 'smooth' });
    });
  }

  function renderNoirCase(container, proyecto) {
    const photos = proyecto.gallery || [];
    const slides = (proyecto.heroSlider && proyecto.heroSlider.length) ? proyecto.heroSlider : photos;
    const cards = proyecto.serviceCards || [];
    const lightbox = slides.concat(cards, photos);
    const steps = proyecto.process || [];
    const figma = (proyecto.actions || []).filter(function (action) {
      return action && action.external;
    })[0];
    const closeActions = (proyecto.actions || []).map(function (action, index) {
      return actionLinkHtml(action, 'noir-cta' + (index === 0 ? ' noir-cta--solid' : ' noir-cta--ghost'));
    }).join('');
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
      return (
        '<figure class="noir-gallery-item">' +
          noirPhotoHtml(photo, slides.length + cards.length + index, 'noir-photo--contain') +
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
              (figma ? actionLinkHtml(figma, 'noir-cta noir-cta--solid') : '') +
            '</div>' +
          '</div>' +
        '</section>' +
        (cardHtml
          ? '<section class="noir-services" aria-label="Servicios">' +
              '<div class="noir-services-row">' +
                '<button type="button" class="noir-services-arrow noir-services-prev" aria-label="Ver anteriores">‹</button>' +
                '<div class="noir-services-viewport" data-noir-services>' +
                  '<div class="noir-services-track">' + cardHtml + '</div>' +
                '</div>' +
                '<button type="button" class="noir-services-arrow noir-services-next" aria-label="Ver siguientes">›</button>' +
              '</div>' +
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

  function mayoLooksSocial(item) {
    return item && /posteo|instagram|\bigmayo|\big-/i.test(((item.alt || '') + ' ' + (item.src || '')).toLowerCase());
  }

  function mayoLooksPoster(item) {
    return item && /afiche/i.test(((item.alt || '') + ' ' + (item.src || '')).toLowerCase());
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

  function mayoPhotoHtml(item, index, extraClass, eager) {
    if (!item || !item.src) return '';
    return (
      '<button type="button" class="mayo-photo' + (extraClass ? ' ' + extraClass : '') + '" data-mayo-index="' + index + '">' +
        '<img src="' + asset(item.src) + '" alt="' + (item.alt || '') + '"' +
          (eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') +
          ' decoding="async">' +
      '</button>'
    );
  }

  function renderMayoCase(container, proyecto) {
    const photos = proyecto.gallery || [];
    const steps = proyecto.process || [];
    const posters = photos.filter(mayoLooksPoster);
    const social = photos.filter(mayoLooksSocial);
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

    const feedFigures = social.map(function (item) {
      const caption = item.alt || '';
      return (
        '<figure class="mayo-feed-item">' +
          mayoPhotoHtml(item, take(item), 'mayo-photo--contain', false) +
          (caption ? '<figcaption>' + caption + '</figcaption>' : '') +
        '</figure>'
      );
    }).join('');

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
        (feedFigures
          ? '<section class="mayo-feed" aria-label="Campaña en redes">' +
              mayoHeadHtml(5, 'Campaña en redes') +
              '<div class="mayo-feed-grid">' + feedFigures + '</div>' +
            '</section>'
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
