(function () {
  var header = document.querySelector('header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (!header || !toggle || !nav) return;

  function setOpen(open) {
    header.classList.toggle('is-nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () {
    setOpen(!header.classList.contains('is-nav-open'));
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 920) setOpen(false);
  });
})();

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.icon-btn').forEach(function (btn) {
    btn.addEventListener('pointerdown', function () {
      btn.classList.remove('is-animating');
      // reflow para reiniciar la animación en taps seguidos
      void btn.offsetWidth;
      btn.classList.add('is-animating');
    });

    btn.addEventListener('animationend', function () {
      btn.classList.remove('is-animating');
    });
  });
})();

(function () {
  var root = document.querySelector('[data-hero-morph]');
  if (!root) return;

  var photo = root.querySelector('[data-hero-photo]');
  var handle = root.querySelector('[data-hero-handle]');
  var photoWrap = root.querySelector('.portrait-reveal-wrapper') || root;
  if (!photo || !handle) return;

  var reveal = 0; // 0 = solo foto, 1 = solo dibujo
  var dragging = false;
  var moved = false;
  var startX = 0;
  var startReveal = 0;
  var activePointer = null;
  var lastOrbitAt = 0;
  var DRAG_THRESHOLD = 6;
  var MORPH_MS = 780;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setReveal(value, animate) {
    reveal = Math.max(0, Math.min(1, value));
    var pct = (reveal * 100).toFixed(2);
    var clip = 'inset(0 ' + pct + '% 0 0)';
    // Safari iOS necesita el prefijo
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

  // Click/tap mueve las dos capas juntas: foto↔dibujo y disciplinas on/off.
  function toggleBoth() {
    if (isActivated()) {
      setOrbit(false);
      animateTo(0);
    } else {
      setOrbit(true);
      animateTo(1);
    }
  }

  function dragWidth() {
    var rect = photoWrap.getBoundingClientRect();
    return rect.width || root.getBoundingClientRect().width;
  }

  function markMoved(dx) {
    // Solo el eje horizontal decide tap vs drag; el clip-path se actualiza igual
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      if (!moved) ensureOrbit();
      moved = true;
    }
  }

  function endGesture() {
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

    activePointer = event.pointerId;
    dragging = true;
    moved = false;
    startX = event.clientX;
    startReveal = reveal;
    root.classList.add('is-dragging');
    root.classList.remove('is-animating');

    try {
      root.setPointerCapture(event.pointerId);
    } catch (err) { /* ignore */ }
  }

  function onPointerMove(event) {
    if (!dragging || event.pointerId !== activePointer) return;

    var width = dragWidth();
    if (!width) return;

    var dx = event.clientX - startX;
    markMoved(dx);

    // El threshold solo distingue tap vs drag; el morph no espera a crossed
    setReveal(startReveal + (-dx / width), false);
    if (event.cancelable && moved) event.preventDefault();
  }

  function onPointerUp(event) {
    if (event.pointerId !== activePointer) return;

    activePointer = null;
    if (!dragging) return;
    dragging = false;
    root.classList.remove('is-dragging');

    try {
      root.releasePointerCapture(event.pointerId);
    } catch (err) { /* ignore */ }

    endGesture();
  }

  // Pointer Events cubre mouse + touch + stylus (mejor en celular)
  if (window.PointerEvent) {
    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove, { passive: false });
    root.addEventListener('pointerup', onPointerUp);
    root.addEventListener('pointercancel', onPointerUp);
  } else {
    // Fallback viejo
    root.addEventListener('touchstart', function (event) {
      if (!event.changedTouches.length) return;
      activePointer = 1;
      dragging = true;
      moved = false;
      startX = event.changedTouches[0].clientX;
      startReveal = reveal;
      root.classList.add('is-dragging');
    }, { passive: true });

    root.addEventListener('touchmove', function (event) {
      if (!dragging || !event.touches.length) return;
      var width = dragWidth();
      var dx = event.touches[0].clientX - startX;
      markMoved(dx);
      setReveal(startReveal + (-dx / width), false);
      if (event.cancelable && moved) event.preventDefault();
    }, { passive: false });

    root.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      activePointer = null;
      root.classList.remove('is-dragging');
      endGesture();
    });

    root.addEventListener('mousedown', function (event) {
      if (event.button !== 0) return;
      activePointer = 1;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startReveal = reveal;
    });
    window.addEventListener('mousemove', function (event) {
      if (!dragging) return;
      var width = dragWidth();
      var dx = event.clientX - startX;
      markMoved(dx);
      setReveal(startReveal + (-dx / width), false);
    });
    window.addEventListener('mouseup', function () {
      if (!dragging) return;
      dragging = false;
      activePointer = null;
      endGesture();
    });
  }

  // Tap de respaldo (algunos Android no completan bien el pointerup)
  root.addEventListener('click', function (event) {
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

(function () {
  var steps = document.querySelectorAll('.step');
  if (!steps.length) return;

  function useHoverFlip() {
    return window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1101px)').matches;
  }

  function flipStep(step) {
    var open = step.classList.contains('is-flipped');
    steps.forEach(function (other) {
      other.classList.remove('is-flipped');
    });
    if (!open) step.classList.add('is-flipped');
  }

  steps.forEach(function (step) {
    var startX = 0;
    var startY = 0;

    step.addEventListener('click', function () {
      if (useHoverFlip()) return;
      flipStep(step);
    });

    step.addEventListener('touchstart', function (event) {
      if (useHoverFlip() || !event.changedTouches.length) return;
      startX = event.changedTouches[0].clientX;
      startY = event.changedTouches[0].clientY;
    }, { passive: true });

    step.addEventListener('touchend', function (event) {
      if (useHoverFlip() || !event.changedTouches.length) return;
      var dx = event.changedTouches[0].clientX - startX;
      var dy = event.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      event.preventDefault();
      flipStep(step);
    }, { passive: false });

    step.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      step.classList.toggle('is-flipped');
    });
  });
})();
