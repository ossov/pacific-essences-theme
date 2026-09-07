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
    }

    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { halt(true); go(i); });
      t.addEventListener('focus', function () { if (!stopped) halt(false); });
    });

    /* The picture arrives soft on a fresh page load and sharpens the moment you
       switch images and come back. Nothing in the CSS explains it — no filter,
       no transform, no scaling of the element; the browser is simply drawing a
       large photograph into a smaller frame with its cheap scaler while the
       page is still loading, and only redoing it properly the next time it has
       a reason to repaint. Switching images was supplying that reason.

       So we supply it ourselves, once, as soon as the picture has decoded:
       promoting a slide to its own layer and immediately dropping it again
       forces exactly the repaint a switch would, and nothing moves on screen.
       Belt and braces, because this is a browser quirk rather than something
       the page controls: the same nudge runs again on window load, by which
       point everything else has finished competing for the main thread. */
    function resharpen() {
      slides.forEach(function (s) {
        s.style.willChange = 'opacity';
        var cleared = false;
        function clear() {
          if (cleared) return;
          cleared = true;
          s.style.willChange = '';
        }
        /* A frame is the right moment to drop it again, but requestAnimationFrame
           never fires in a background tab, and a slide left promoted for good is
           precisely what made the picture soft all the time. The timeout is the
           one that must not be missed. */
        requestAnimationFrame(function () { requestAnimationFrame(clear); });
        setTimeout(clear, 250);
      });
    }

    var lead = slides[0].querySelector('img');
    if (lead && lead.decode) lead.decode().then(resharpen, resharpen);
    else if (lead && lead.complete) resharpen();
    else if (lead) lead.addEventListener('load', resharpen, { once: true });
    window.addEventListener('load', resharpen);

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
