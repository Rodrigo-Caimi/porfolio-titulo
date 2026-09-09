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
    watchList('.shot', 70);
    watchList('.golden-item', 80);
    watchList('.wine-intro, .wine-stage, .wine-block, .wine-gallery-title, .wine-mosaic-item, .wine-mosaic-video, .wine-close', 70);
    watchList('.ubicar-intro, .ubicar-step, .ubicar-gallery', 70);
    watchList('.noir-hero, .noir-board-item, .noir-step, .noir-close', 70);
    watchList('.mayo-hero, .mayo-copy, .mayo-posters, .mayo-feed, .mayo-close', 70);
    watchList('.other-project-card', 90);
    watchList('.about-page h1, .about-intro, .availability-card, .tools-horizontal');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var hero = document.querySelector('section.hero');
    if (hero) {
      requestAnimationFrame(function () {
        hero.classList.add('is-ready');
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
    if (processRoot && !processRoot.querySelector('.noir-editorial, .wine-editorial, .ubicar-intro, .mayo-editorial')) {
      var processRetries = 0;
      var processTimer = window.setInterval(function () {
        processRetries += 1;
        if (processRoot.querySelector('.noir-editorial, .wine-editorial, .ubicar-intro, .mayo-editorial') || processRetries > 20) {
          window.clearInterval(processTimer);
          bindReveals();
        }
      }, 50);
    }
  });
})();
