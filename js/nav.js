(function () {
  function syncThemeColor() {
    var body = document.body;
    if (!body) return;
    var color = window.getComputedStyle(body).backgroundColor;
    if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
      color = window.getComputedStyle(document.documentElement).backgroundColor;
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    if (color) meta.setAttribute('content', color);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncThemeColor);
  } else {
    syncThemeColor();
  }
})();

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
