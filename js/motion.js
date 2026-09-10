(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('js-motion');

  function watchList(selector, stagger) {
    var nodes = document.querySelectorAll(selector);
    var delay = stagger || 0;
    nodes.forEach(function (node, index) {
      if (node.dataset.revealBound === '1') return;
      node.dataset.revealBound = '1';
      node.classList.add('reveal');
      if (delay) {
        node.style.setProperty('--reveal-delay', (index * delay) + 'ms');
      }
      observer.observe(node);
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -10% 0px'
  });

  function bindReveals() {
    watchList('#trabajos h2, #proceso h2, #contacto h2, .section-lead, .contact-intro, #contact-form');
    watchList('.work-container .card', 70);
    watchList('.step', 90);
    watchList('.project-detail-title, .project-meta-section, .project-actions-section');
    watchList('body[data-proyecto-id="5"] .reel-hero-copy, body[data-proyecto-id="5"] .reel-phone');
    watchList('body[data-proyecto-id="5"] .reel-step, body[data-proyecto-id="5"] .reel-result, body[data-proyecto-id="5"] .reel-gallery-item', 90);
    watchList('body[data-proyecto-id="4"] .photo-hero-copy, body[data-proyecto-id="4"] .photo-essay-copy', 80);
    watchList('.shot', 70);
    watchList('.golden-item', 80);
    watchList('.wine-intro, .wine-stage, .wine-block, .wine-gallery-title, .wine-mosaic-item, .wine-mosaic-video, .wine-close', 70);
    watchList('.ubicar-intro, .ubicar-step, .ubicar-gallery', 70);
    watchList('.noir-hero, .noir-service-card, .noir-step, .noir-gallery, .noir-close', 70);
    watchList('.mayo-hero, .mayo-copy, .mayo-posters, .mayo-feed, .mayo-close', 70);
    watchList('.other-project-card', 90);
    watchList('.about-page h1, .about-intro, .availability-card, .tools-horizontal');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.documentElement;
    if (root.hasAttribute('data-hero-enter')) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          root.classList.add('is-in');
          window.setTimeout(function () {
            root.classList.add('hero-enter-done');
            root.removeAttribute('data-hero-enter');
          }, 1000);
        });
      });
    }

    bindReveals();

    var grid = document.querySelector('.work-container[data-render="grid"]');
    if (grid && !grid.children.length) {
      var retries = 0;
      var timer = window.setInterval(function () {
        retries += 1;
        if (grid.children.length || retries > 20) {
          window.clearInterval(timer);
          bindReveals();
        }
      }, 50);
    }

    var processRoot = document.querySelector('[data-proyecto-process]');
    if (processRoot && !processRoot.querySelector('.noir-editorial, .wine-editorial, .ubicar-intro, .mayo-editorial, .reel-process, .photo-process')) {
      var processRetries = 0;
      var processTimer = window.setInterval(function () {
        processRetries += 1;
        if (processRoot.querySelector('.noir-editorial, .wine-editorial, .ubicar-intro, .mayo-editorial, .reel-process, .photo-process') || processRetries > 20) {
          window.clearInterval(processTimer);
          bindReveals();
        }
      }, 50);
    }

    var galleryRoot = document.querySelector('[data-proyecto-gallery]');
    if (galleryRoot && !galleryRoot.querySelector('.gallery, .reel-hero, .photo-case')) {
      var galleryRetries = 0;
      var galleryTimer = window.setInterval(function () {
        galleryRetries += 1;
        if (galleryRoot.querySelector('.gallery, .reel-hero, .photo-case') || galleryRetries > 20) {
          window.clearInterval(galleryTimer);
          bindReveals();
        }
      }, 50);
    }
  });
})();

(function () {
  var root = document.querySelector('[data-hero-morph]');
  if (!root) return;

  var photo = root.querySelector('[data-hero-photo]');
  var handle = root.querySelector('[data-hero-handle]');
  var stage = root.querySelector('.portrait-reveal-wrapper');
  if (!photo || !handle || !stage) return;

  var reveal = 0; // 0 = solo foto, 1 = solo dibujo
  var dragging = false;
  var moved = false;
  var axis = null; // null | 'x' | 'y'
  var startX = 0;
  var startY = 0;
  var startReveal = 0;
  var activePointer = null;
  var lastOrbitAt = 0;
  var suppressClick = false;
  var DRAG_THRESHOLD = 6;
  var MORPH_MS = 780;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setReveal(value, animate) {
    reveal = Math.max(0, Math.min(1, value));
    var pct = (reveal * 100).toFixed(2);
    var clip = 'inset(0 ' + pct + '% 0 0)';
    photo.style.webkitClipPath = clip;
    photo.style.clipPath = clip;
    handle.style.left = (100 - reveal * 100).toFixed(2) + '%';
    root.classList.toggle('is-drawn', reveal > 0.92);
    root.classList.toggle('is-animating', !!animate && !reduceMotion);
    root.setAttribute(
      'aria-label',
      reveal > 0.5
        ? 'Versión ilustrada de Rodrigo Caimi. Tocá para volver a la foto.'
        : 'Foto de Rodrigo Caimi. Tocá para ver la versión ilustrada.'
    );
  }

  function animateTo(target) {
    setReveal(target, true);
    if (reduceMotion) return;
    window.setTimeout(function () {
      root.classList.remove('is-animating');
    }, MORPH_MS + 40);
  }

  function setOrbit(on) {
    root.classList.toggle('is-orbit-on', !!on);
    lastOrbitAt = Date.now();
  }

  function ensureOrbit() {
    if (!root.classList.contains('is-orbit-on')) setOrbit(true);
  }

  function isActivated() {
    return root.classList.contains('is-orbit-on') || reveal >= 0.5;
  }

  function toggleBoth() {
    if (isActivated()) {
      setOrbit(false);
      animateTo(0);
    } else {
      setOrbit(true);
      animateTo(1);
    }
  }

  function pointInCircle(clientX, clientY) {
    var rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    var dx = clientX - (rect.left + rect.width / 2);
    var dy = clientY - (rect.top + rect.height / 2);
    var radius = Math.min(rect.width, rect.height) / 2;
    return (dx * dx + dy * dy) <= (radius * radius);
  }

  function dragWidth() {
    return stage.getBoundingClientRect().width || 0;
  }

  function resetGesture() {
    dragging = false;
    moved = false;
    axis = null;
    activePointer = null;
    root.classList.remove('is-dragging');
  }

  function abortGesture() {
    if (!dragging) return;
    try {
      if (activePointer !== null) stage.releasePointerCapture(activePointer);
    } catch (err) { /* ignore */ }
    suppressClick = true;
    resetGesture();
  }

  function applyHorizontalDrag(dx, event) {
    var width = dragWidth();
    if (!width) return;
    if (!moved) ensureOrbit();
    moved = true;
    setReveal(startReveal + (-dx / width), false);
    if (event && event.cancelable) event.preventDefault();
  }

  function resolveAxis(dx, dy) {
    var absX = Math.abs(dx);
    var absY = Math.abs(dy);
    if (absX < DRAG_THRESHOLD && absY < DRAG_THRESHOLD) return null;
    if (absY > absX) return 'y';
    return 'x';
  }

  function endGesture() {
    if (axis === 'y') return;
    if (!moved) {
      toggleBoth();
      return;
    }
    if (reveal >= 0.18) animateTo(1);
    else animateTo(0);
  }

  function onPointerDown(event) {
    if (activePointer !== null) return;
    if (typeof event.button === 'number' && event.button !== 0) return;
    if (!pointInCircle(event.clientX, event.clientY)) return;

    activePointer = event.pointerId;
    dragging = true;
    moved = false;
    axis = null;
    suppressClick = false;
    startX = event.clientX;
    startY = event.clientY;
    startReveal = reveal;
    root.classList.remove('is-animating');
  }

  function onPointerMove(event) {
    if (!dragging || event.pointerId !== activePointer) return;

    var dx = event.clientX - startX;
    var dy = event.clientY - startY;

    if (axis === null) {
      axis = resolveAxis(dx, dy);
      if (axis === null) return;
      if (axis === 'y') {
        abortGesture();
        return;
      }
      root.classList.add('is-dragging');
      try {
        stage.setPointerCapture(event.pointerId);
      } catch (err) { /* ignore */ }
    }

    if (axis !== 'x') return;
    applyHorizontalDrag(dx, event);
  }

  function onPointerUp(event) {
    if (event.pointerId !== activePointer) return;
    if (!dragging) return;

    try {
      stage.releasePointerCapture(event.pointerId);
    } catch (err) { /* ignore */ }

    var wasMoved = moved;
    var wasAxis = axis;
    resetGesture();
    moved = wasMoved;
    axis = wasAxis;
    endGesture();
    axis = null;
  }

  function onPointerCancel(event) {
    if (event.pointerId !== activePointer) return;
    abortGesture();
  }

  if (window.PointerEvent) {
    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove, { passive: false });
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerCancel);
  } else {
    stage.addEventListener('touchstart', function (event) {
      if (!event.changedTouches.length) return;
      var touch = event.changedTouches[0];
      if (!pointInCircle(touch.clientX, touch.clientY)) return;
      activePointer = 1;
      dragging = true;
      moved = false;
      axis = null;
      suppressClick = false;
      startX = touch.clientX;
      startY = touch.clientY;
      startReveal = reveal;
      root.classList.remove('is-animating');
    }, { passive: true });

    stage.addEventListener('touchmove', function (event) {
      if (!dragging || !event.touches.length) return;
      var touch = event.touches[0];
      var dx = touch.clientX - startX;
      var dy = touch.clientY - startY;
      if (axis === null) {
        axis = resolveAxis(dx, dy);
        if (axis === null) return;
        if (axis === 'y') {
          abortGesture();
          return;
        }
        root.classList.add('is-dragging');
      }
      if (axis !== 'x') return;
      applyHorizontalDrag(dx, event);
    }, { passive: false });

    stage.addEventListener('touchend', function () {
      if (!dragging) return;
      var wasMoved = moved;
      var wasAxis = axis;
      resetGesture();
      moved = wasMoved;
      axis = wasAxis;
      endGesture();
      axis = null;
    });

    stage.addEventListener('touchcancel', function () {
      abortGesture();
    });

    stage.addEventListener('mousedown', function (event) {
      if (event.button !== 0) return;
      if (!pointInCircle(event.clientX, event.clientY)) return;
      activePointer = 1;
      dragging = true;
      moved = false;
      axis = null;
      suppressClick = false;
      startX = event.clientX;
      startY = event.clientY;
      startReveal = reveal;
    });
    window.addEventListener('mousemove', function (event) {
      if (!dragging || activePointer !== 1) return;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (axis === null) {
        axis = resolveAxis(dx, dy);
        if (axis === null) return;
        if (axis === 'y') {
          abortGesture();
          return;
        }
        root.classList.add('is-dragging');
      }
      if (axis !== 'x') return;
      applyHorizontalDrag(dx, event);
    });
    window.addEventListener('mouseup', function () {
      if (!dragging) return;
      var wasMoved = moved;
      var wasAxis = axis;
      resetGesture();
      moved = wasMoved;
      axis = wasAxis;
      endGesture();
      axis = null;
    });
  }

  stage.addEventListener('click', function (event) {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (!pointInCircle(event.clientX, event.clientY)) return;
    if (Date.now() - lastOrbitAt < 450) return;
    if (moved) return;
    event.preventDefault();
    toggleBoth();
  });

  root.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleBoth();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      ensureOrbit();
      animateTo(1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      animateTo(0);
    }
  });

  setReveal(0, false);
})();
