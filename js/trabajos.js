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

  function renderWorkGrid(container) {
    if (!container) return;

    const layoutOrder = [6, 7, 3, 5, 1, 2, 4];
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

  function drivePreviewUrl(link) {
    if (!link || link.indexOf('PEGAR_LINK') !== -1) return '';
    const match = String(link).match(/\/d\/([a-zA-Z0-9_-]+)/) || String(link).match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (!match) return link.indexOf('drive.google.com') !== -1 ? link : '';
    return 'https://drive.google.com/file/d/' + match[1] + '/preview';
  }

  function driveViewUrl(link) {
    if (!link || link.indexOf('PEGAR_LINK') !== -1) return '';
    const match = String(link).match(/\/d\/([a-zA-Z0-9_-]+)/) || String(link).match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (!match) return link;
    return 'https://drive.google.com/file/d/' + match[1] + '/view';
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

    if (proyecto.processLayout === 'editorial' || !proyecto.gallery.length) {
      container.innerHTML = '';
      return;
    }

    const layout = proyecto.galleryLayout || 'spread';
    const shots = proyecto.gallery.map(renderShot);
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

    if (proyecto.processLayout === 'editorial' || !proyecto.actions || !proyecto.actions.length) {
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

  function wineBlockHtml(item, n, photo) {
    if (!item) return '';
    const num = (n < 10 ? '0' : '') + n;
    const image = photo && photo.src
      ? '<figure class="wine-thumb">' +
          '<img src="' + asset(photo.src) + '" alt="' + (photo.alt || '') + '" loading="lazy" decoding="async">' +
          (photo.caption ? '<figcaption>' + photo.caption + '</figcaption>' : '') +
        '</figure>'
      : '';

    return (
      '<article class="wine-block wine-block--' + n + '">' +
        '<button type="button" class="wine-block-head" aria-expanded="false">' +
          '<span class="wine-num">' + num + '</span>' +
          '<h3>' + item.title + '</h3>' +
          '<span class="wine-chevron" aria-hidden="true"></span>' +
        '</button>' +
        '<p>' + item.text + '</p>' +
        image +
      '</article>'
    );
  }

  function renderEditorialProcess(container, proyecto) {
    const ed = proyecto.editorial || {};
    const steps = proyecto.process || [];
    const photos = ed.steps || [];
    const actions = (proyecto.actions || []).filter(function (action) {
      return !(action.external && /drive|video/i.test((action.label || '') + (action.href || '')));
    }).map(function (action, index) {
      return actionLinkHtml(action, 'btn wine-btn' + (index === 0 ? ' wine-btn--solid' : ' wine-btn--ghost'));
    }).join('');

    const mosaic = (ed.gallery || []).map(function (item) {
      return (
        '<figure class="wine-mosaic-item is-' + (item.shape || 'wide') + '">' +
          '<img src="' + asset(item.src) + '" alt="' + (item.alt || '') + '" loading="lazy" decoding="async">' +
        '</figure>'
      );
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
          '<svg class="wine-lines" aria-hidden="true">' +
            '<defs>' +
              '<marker id="wine-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">' +
                '<path d="M0 0 L10 5 L0 10 Z" fill="#c4a574"></path>' +
              '</marker>' +
            '</defs>' +
            '<path data-wine-line="1"></path>' +
            '<path data-wine-line="2"></path>' +
            '<path data-wine-line="3"></path>' +
            '<path data-wine-line="4"></path>' +
          '</svg>' +
          wineBlockHtml(steps[0], 1, photos[0]) +
          '<figure class="wine-bottle">' +
            '<img src="' + asset(ed.bottle && ed.bottle.src) + '" alt="' + ((ed.bottle && ed.bottle.alt) || '') + '" decoding="async" fetchpriority="high">' +
          '</figure>' +
          wineBlockHtml(steps[1], 2, photos[1]) +
          wineBlockHtml(steps[2], 3, photos[2]) +
          wineBlockHtml(steps[3], 4, photos[3]) +
        '</div>' +
        '</div>' +
        '<div class="wine-mosaic">' + mosaic + '</div>' +
        '<div class="wine-close">' +
          '<div class="wine-actions">' + actions + '</div>' +
        '</div>' +
        '<p class="wine-footerbrand">Don Pascual · Uruguay</p>' +
      '</div>';

    container.querySelectorAll('.wine-block-head').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (window.matchMedia('(min-width: 921px)').matches) return;
        const block = btn.closest('.wine-block');
        const open = !block.classList.contains('is-open');
        container.querySelectorAll('.wine-block').forEach(function (node) {
          node.classList.remove('is-open');
          const head = node.querySelector('.wine-block-head');
          if (head) head.setAttribute('aria-expanded', 'false');
        });
        if (open) {
          block.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    bindWineArrows(container.querySelector('.wine-stage'));
  }

  function bindWineArrows(stage) {
    if (!stage) return;
    const svg = stage.querySelector('.wine-lines');
    const bottle = stage.querySelector('.wine-bottle img') || stage.querySelector('.wine-bottle');
    if (!svg || !bottle) return;

    function localPoint(el, relX, relY) {
      const sr = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        x: r.left - sr.left + r.width * relX,
        y: r.top - sr.top + r.height * relY
      };
    }

    function curve(from, to, pullX) {
      const c1x = from.x + pullX;
      const c1y = from.y;
      const c2x = to.x - pullX * 0.25;
      const c2y = to.y;
      return 'M' + from.x.toFixed(1) + ' ' + from.y.toFixed(1) +
        ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) +
        ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) +
        ', ' + to.x.toFixed(1) + ' ' + to.y.toFixed(1);
    }

    function draw() {
      if (window.matchMedia('(max-width: 920px)').matches) return;
      const sr = stage.getBoundingClientRect();
      if (!sr.width || !sr.height) return;

      svg.setAttribute('viewBox', '0 0 ' + sr.width + ' ' + sr.height);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      const anchors = [
        { n: 1, from: [1, 0.5], to: [0.12, 0.28], pull: 56 },
        { n: 2, from: [0, 0.5], to: [0.88, 0.28], pull: -56 },
        { n: 3, from: [1, 0.5], to: [0.12, 0.74], pull: 56 },
        { n: 4, from: [0, 0.5], to: [0.88, 0.74], pull: -56 }
      ];

      anchors.forEach(function (anchor) {
        const block = stage.querySelector('.wine-block--' + anchor.n);
        const path = svg.querySelector('[data-wine-line="' + anchor.n + '"]');
        if (!block || !path) return;
        const origin = block.querySelector('.wine-thumb') || block;
        const from = localPoint(origin, anchor.from[0], anchor.from[1]);
        const to = localPoint(bottle, anchor.to[0], anchor.to[1]);
        path.setAttribute('d', curve(from, to, anchor.pull));
        path.setAttribute('marker-end', 'url(#wine-arrow)');
      });
    }

    const redraw = function () { window.requestAnimationFrame(draw); };
    if (bottle.tagName === 'IMG' && !bottle.complete) {
      bottle.addEventListener('load', redraw);
    }
    window.addEventListener('resize', redraw);
    redraw();
  }

  function renderProcess(container, proyecto) {
    if (!container) return;

    if (proyecto.processLayout === 'editorial') {
      renderEditorialProcess(container, proyecto);
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
    if (proyecto.processLayout === 'editorial') {
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
