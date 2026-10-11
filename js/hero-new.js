/* 히어로 슬라이더 (새 홈페이지 시안) — 자동 재생, 점 선택, 스와이프 */
(function () {
  'use strict';
  const track = document.getElementById('hsTrack');
  const dots = document.getElementById('hsDots');
  if (!track || !dots) return;

  const total = track.children.length;
  let cur = 0, timer = null, startX = null;

  dots.innerHTML = Array.from({ length: total }, (_, i) =>
    '<button type="button" role="tab" aria-label="' + (i + 1) + '번 배너" data-i="' + i + '"></button>').join('');

  function go(i) {
    cur = (i + total) % total;
    track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    Array.prototype.forEach.call(dots.children, function (d, k) {
      d.classList.toggle('is-on', k === cur);
      d.setAttribute('aria-selected', String(k === cur));
    });
  }
  function play() {
    clearInterval(timer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(function () { go(cur + 1); }, 5000);
  }

  dots.addEventListener('click', function (e) {
    const b = e.target.closest('button');
    if (!b) return;
    go(Number(b.dataset.i));
    play();
  });

  track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (startX !== null) {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    }
    startX = null;
    play();
  }, { passive: true });

  go(0);
  play();
})();
