/* 추천 이유 슬라이더 — 화살표·점·마우스/터치 드래그, 0.9초 ease-in-out 전환 */
(function () {
  'use strict';
  const track = document.getElementById('whyTrack');
  if (!track) return;
  const slides = track.children, dots = document.getElementById('whyDots');
  const prev = document.querySelector('.why__nav--prev'), next = document.querySelector('.why__nav--next');
  for (let i = 0; i < slides.length; i++) {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', (i + 1) + '번째 카드'); b.onclick = () => go(i);
    dots.appendChild(b);
  }
  const cur = () => Math.round(track.scrollLeft / track.clientWidth);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function animateTo(x, dur) {
    cancelAnimationFrame(raf);
    const from = track.scrollLeft, dist = x - from;
    if (reduce || Math.abs(dist) < 2) { track.scrollLeft = x; track.classList.remove('is-anim'); return; }
    track.classList.add('is-anim');
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      track.scrollLeft = from + dist * ease(p);
      if (p < 1) raf = requestAnimationFrame(step);
      else { track.scrollLeft = x; track.classList.remove('is-anim'); }
    })(t0);
  }
  const go = (i, dur) => animateTo(i * track.clientWidth, dur || 900);
  function sync() {
    const c = cur();
    for (let i = 0; i < dots.children.length; i++) dots.children[i].setAttribute('aria-current', i === c ? 'true' : 'false');
    prev.hidden = c === 0; next.hidden = c === slides.length - 1;
  }

  let down = false, sx = 0, sl = 0, moved = false, lastX = 0, lastT = 0, vel = 0, pid = null;
  function finish(x) {
    if (!down) return; down = false;
    if (pid !== null) { try { track.releasePointerCapture(pid); } catch (_) {} pid = null; }
    track.classList.remove('is-drag');
    if (!moved) return;
    const dx = x - sx, c = Math.round(sl / track.clientWidth), w = track.clientWidth;
    const flick = Math.abs(vel) > 0.8, far = Math.abs(dx) > w * 0.15;
    const dir = (far || flick) ? ((dx < 0 || vel < -0.8) ? 1 : -1) : 0;
    go(Math.max(0, Math.min(slides.length - 1, c + dir)), 750);
  }
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cancelAnimationFrame(raf); track.classList.remove('is-anim');
    down = true; moved = false; sx = lastX = e.clientX; sl = track.scrollLeft; lastT = performance.now(); vel = 0; pid = e.pointerId;
    try { track.setPointerCapture(pid); } catch (_) {}
  });
  track.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('is-drag'); }
    if (!moved) return;
    track.scrollLeft = sl - dx;
    const n = performance.now();
    if (n > lastT) vel = 0.8 * vel + 0.2 * ((e.clientX - lastX) / (n - lastT));
    lastX = e.clientX; lastT = n;
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => track.addEventListener(t, (e) => finish(e.clientX)));
  track.addEventListener('dragstart', (e) => e.preventDefault());
  prev.onclick = () => go(cur() - 1); next.onclick = () => go(cur() + 1);
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync);
  sync();
})();
