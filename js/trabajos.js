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

  function getProyecto(id) {
    return PROYECTOS.find(function (p) { return p.id === id; });
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

  function bindWineInteractions(root, proyecto) {
    if (!root) return;
    const gallery = (proyecto && proyecto.editorial && proyecto.editorial.gallery) || [];
    bindWineArrows(root.querySelector('.wine-stage'));
    bindWineMosaicLines(root.querySelector('.wine-mosaic-wrap'));
    bindSimpleLightbox(
      root.querySelector('.wine-mosaic'),
      root.querySelector('.wine-lightbox'),
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

  function bindUbicarInteractions(root, proyecto) {
    if (!root) return;
    const result = (proyecto && proyecto.trail && proyecto.trail.result) || [];
    bindUbicarTrail(root.querySelector('.ubicar-trail'));
    bindSimpleLightbox(root.querySelector('.ubicar-gallery'), root.querySelector('.ubicar-lightbox'), result);
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

  function bindNoirInteractions(root, proyecto) {
    if (!root) return;
    const photos = (proyecto && proyecto.gallery) || [];
    const slides = (proyecto && proyecto.heroSlider && proyecto.heroSlider.length)
      ? proyecto.heroSlider
      : photos;
    const cards = (proyecto && proyecto.serviceCards) || [];
    const lightbox = slides.concat(cards, photos);

    bindNoirSlider(root.querySelector('[data-noir-slider]'));
    bindNoirServices(root.querySelector('[data-noir-services]'));
    bindSimpleLightbox(
      root.querySelector('.noir-editorial') || root,
      root.querySelector('.noir-lightbox'),
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

  function mayoLooksGif(item) {
    return item && /\.gif$/i.test(item.src || '');
  }

  function mayoLooksPoster(item) {
    return item && /afiche/i.test(((item.alt || '') + ' ' + (item.src || '')).toLowerCase()) && !mayoLooksGif(item);
  }

  function mayoFindPhoto(photos, needle) {
    const key = String(needle || '').toLowerCase();
    return (photos || []).find(function (item) {
      return item && String(item.src || '').toLowerCase().replace(/\\/g, '/').indexOf(key) !== -1;
    }) || null;
  }

  function mayoLightboxItems(proyecto) {
    const photos = (proyecto && proyecto.gallery) || [];
    const posters = photos.filter(mayoLooksPoster);
    const gifs = photos.filter(mayoLooksGif);
    const lightbox = [];

    function take(item) {
      if (!item || !item.src) return;
      if (lightbox.some(function (entry) { return entry.src === item.src; })) return;
      lightbox.push(item);
    }

    take(posters[0] || photos[0]);
    take(mayoFindPhoto(photos, '5-posteoigmayo'));
    take(mayoFindPhoto(photos, '4-posteoigmayoa.jpg'));
    take(mayoFindPhoto(photos, '1-posteoigmayoa'));
    take(mayoFindPhoto(photos, '2-posteoig.jpg'));
    take(gifs[0] || mayoFindPhoto(photos, 'reel-ig-final.gif'));
    return lightbox;
  }

  function bindMayoInteractions(root, proyecto) {
    if (!root) return;
    bindSimpleLightbox(
      root.querySelector('.mayo-editorial') || root,
      root.querySelector('.mayo-lightbox'),
      mayoLightboxItems(proyecto),
      {
        item: '[data-mayo-index]',
        indexAttr: 'data-mayo-index',
        close: '.mayo-lightbox-close',
        prev: '.mayo-lightbox-prev',
        next: '.mayo-lightbox-next'
      }
    );
  }

  function notifyRendered() {
    document.dispatchEvent(new CustomEvent('portfolio:rendered'));
  }

  function renderProjectDetail(proyectoId) {
    const proyecto = getProyecto(proyectoId);
    if (!proyecto) return;

    document.title = (proyecto.pageTitle || proyecto.title) + ' — Rodrigo Caimi';

    // Ubicar (id 8): HTML estático; JS solo trail SVG + lightbox
    if (proyecto.processLayout === 'trail') {
      const root = document.querySelector('.ubicar-case') || document;
      if (root.querySelector('.ubicar-page')) {
        bindUbicarInteractions(root, proyecto);
        notifyRendered();
        return;
      }
    }

    // Don Pascual (id 7): HTML estático; JS solo curvas wine + lightbox
    if (proyecto.processLayout === 'editorial') {
      const root = document.querySelector('.wine-case') || document;
      if (root.querySelector('.wine-editorial')) {
        bindWineInteractions(root, proyecto);
        notifyRendered();
        return;
      }
    }

    // Noir (id 6): HTML estático; JS solo slider, servicios y lightbox
    if (proyecto.processLayout === 'noir') {
      const root = document.querySelector('.noir-case') || document;
      if (root.querySelector('.noir-editorial')) {
        bindNoirInteractions(root, proyecto);
        notifyRendered();
        return;
      }
    }

    // Mayo (id 2): HTML estático; JS solo lightbox
    if (proyecto.processLayout === 'mayo') {
      const root = document.querySelector('.mayo-case') || document;
      if (root.querySelector('.mayo-editorial')) {
        bindMayoInteractions(root, proyecto);
        notifyRendered();
        return;
      }
    }

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
