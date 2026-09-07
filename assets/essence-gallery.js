/* The bottle-and-plant gallery on a single essence page.
   Advances on a timer, stops the moment anyone engages with it — an image that
   slides away while you are looking at it is the thing people dislike about
   carousels, and it costs nothing to avoid. */
(function () {
  var reduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setup(root) {
    if (root.dataset.egReady) return;
    root.dataset.egReady = '1';

    var slides = Array.prototype.slice.call(root.querySelectorAll('.eg-slide'));
    var thumbs = Array.prototype.slice.call(root.querySelectorAll('.eg-thumb'));
    var caps = Array.prototype.slice.call(root.querySelectorAll('[data-eg-caption] > span'));
    var wait = parseInt(root.dataset.interval, 10) || 7000;
    if (slides.length < 2) return;

    var at = 0;
    var timer = null;
    var stopped = false;
    var paused = false;

    function paint() {
      slides.forEach(function (s, i) { s.classList.toggle('is-on', i === at); });
      caps.forEach(function (c, i) { c.hidden = i !== at; });
      thumbs.forEach(function (t, i) {
        t.classList.toggle('is-on', i === at);
        t.setAttribute('aria-current', i === at ? 'true' : 'false');
        var bar = t.querySelector('.eg-bar');
        if (!bar) return;
        bar.classList.remove('is-running');
        if (i === at && !stopped && !paused && !reduce) {
          void bar.offsetWidth;            /* restart the fill */
          bar.style.animationDuration = wait + 'ms';
          bar.classList.add('is-running');
        }
      });
    }

    function go(i) { at = (i + slides.length) % slides.length; paint(); }

    function start() {
      if (stopped || reduce) return;
      clearInterval(timer);
      timer = setInterval(function () { go(at + 1); }, wait);
    }

    function halt(forGood) {
      if (forGood) stopped = true;
      paused = !forGood;
      clearInterval(timer);
      thumbs.forEach(function (t) {
        var bar = t.querySelector('.eg-bar');
        if (bar) bar.classList.remove('is-running');
      });
    }

    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { halt(true); go(i); });
      t.addEventListener('focus', function () { if (!stopped) halt(false); });
    });

    root.addEventListener('mouseenter', function () { if (!stopped) halt(false); });
    root.addEventListener('mouseleave', function () {
      if (stopped) return;
      paused = false;
      paint();
      start();
    });

    /* Nothing should tick while the tab is in the background. */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { clearInterval(timer); }
      else if (!stopped && !paused) { paint(); start(); }
    });

    paint();
    start();
  }

  function boot() {
    document.querySelectorAll('[data-essence-gallery]').forEach(setup);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  /* The theme editor re-renders sections without a page load. */
  document.addEventListener('shopify:section:load', boot);
})();
