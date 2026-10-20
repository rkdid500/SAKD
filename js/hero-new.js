/* 히어로 슬라이더 — 자동 재생, 점 선택, 마우스·터치 드래그(손가락/마우스를 따라 움직임), 끝에서 처음으로 이어짐 */
(function () {
  'use strict';
  const track = document.getElementById('hsTrack');
  const dots = document.getElementById('hsDots');
  if (!track || !dots) return;

  const total = track.children.length;
  track.appendChild(track.children[0].cloneNode(true));   // 마지막 → 처음으로 이어지게 하는 복제 슬라이드
  track.lastElementChild.setAttribute('aria-hidden', 'true');
  const EASE = 'transform .7s cubic-bezier(.4,0,.2,1)';
  let idx = 0, timer = null, down = false, moved = false, sx = 0, sy = 0, dx = 0, W = 1, lock = null, lastX = 0, lastT = 0, vel = 0, pid = null;

  dots.innerHTML = Array.from({ length: total }, (_, i) =>
    '<button type="button" role="tab" aria-label="' + (i + 1) + '번 배너" data-i="' + i + '"></button>').join('');

  function place(px, anim) {
    track.style.transition = anim ? EASE : 'none';
    track.style.transform = 'translate3d(' + (-idx * W + px) + 'px,0,0)';
  }
  function paint() {
    const c = idx % total;
    Array.prototype.forEach.call(dots.children, function (d, k) {
      d.classList.toggle('is-on', k === c);
      d.setAttribute('aria-selected', String(k === c));
    });
  }
  function go(i) {
    W = track.parentElement.clientWidth;
    if (i < 0) { idx = total; place(0, false); track.getBoundingClientRect(); i = total - 1; }   // 첫 장에서 이전 → 끝으로 이어 붙임
    idx = Math.min(i, total);
    place(0, true); paint();
  }
  track.addEventListener('transitionend', function (e) {
    if (e.target !== track) return;
    if (idx >= total) { idx = 0; place(0, false); paint(); }   // 복제 슬라이드에 도착 → 첫 장으로 조용히 되돌림
  });
  function play() {
    clearInterval(timer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(function () { if (!down) go(idx + 1); }, 5000);
  }

  dots.addEventListener('click', function (e) {
    const b = e.target.closest('button');
    if (!b) return;
    go(Number(b.dataset.i)); play();
  });

  track.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    W = track.parentElement.clientWidth;
    if (idx >= total) { idx = 0; }
    down = true; moved = false; lock = null; sx = lastX = e.clientX; sy = e.clientY; dx = 0; vel = 0; lastT = performance.now(); pid = e.pointerId;
    place(0, false); clearInterval(timer);
  });
  track.addEventListener('pointermove', function (e) {
    if (!down) return;
    const mx = e.clientX - sx, my = e.clientY - sy;
    if (lock === null && (Math.abs(mx) > 6 || Math.abs(my) > 6)) {
      lock = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      if (lock === 'x') { moved = true; try { track.setPointerCapture(pid); } catch (_) {} }
    }
    if (lock !== 'x') return;
    dx = mx;
    const n = performance.now();
    if (n > lastT) vel = 0.8 * vel + 0.2 * ((e.clientX - lastX) / (n - lastT));
    lastX = e.clientX; lastT = n;
    place(dx, false);
  });
  function end() {
    if (!down) return;
    down = false;
    if (pid !== null) { try { track.releasePointerCapture(pid); } catch (_) {} pid = null; }
    if (lock === 'x') {
      const far = Math.abs(dx) > W * 0.15, flick = Math.abs(vel) > 0.5;
      const dir = (far || flick) ? ((dx < 0 || vel < -0.5) ? 1 : -1) : 0;
      go(idx + dir);
    }
    play();
  }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { track.addEventListener(t, end); });
  track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  track.addEventListener('dragstart', function (e) { e.preventDefault(); });
  window.addEventListener('resize', function () { W = track.parentElement.clientWidth; place(0, false); });

  W = track.parentElement.clientWidth;
  paint(); play();
})();
