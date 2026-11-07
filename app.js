(function () {
  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var dots = document.getElementById('dots');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var prog = document.getElementById('prog');
  var cur = 0;

  slides.forEach(function () { dots.appendChild(document.createElement('i')); });

  function show(i) {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, k) { s.classList.toggle('on', k === cur); });
    [].forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === cur); });
    prog.style.width = ((cur + 1) / slides.length * 100) + '%';
    prev.disabled = cur === 0;
    next.disabled = cur === slides.length - 1;
    history.replaceState(null, '', '#' + (cur + 1));
  }

  prev.addEventListener('click', function () { show(cur - 1); });
  next.addEventListener('click', function () { show(cur + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') show(cur + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') show(cur - 1);
  });

  var x0 = null;
  document.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  var fs = document.getElementById('fs');
  var raiz = document.documentElement;
  if (raiz.requestFullscreen || raiz.webkitRequestFullscreen) {
    fs.hidden = false;
    fs.addEventListener('click', function () {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        var p = (raiz.requestFullscreen || raiz.webkitRequestFullscreen).call(raiz);
        if (p && p['catch']) p['catch'](function () { fs.hidden = true; });
      }
    });
  }

  show((parseInt(location.hash.slice(1), 10) || 1) - 1);
})();
