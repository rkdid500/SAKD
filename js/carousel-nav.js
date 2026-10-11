/* 가로 카드 캐러셀 공통 화살표 — .mp__carousel 안의 .mp__prev / .mp__next
   · 맨 앞이면 '이전' 숨김, 맨 끝이면 '다음' 숨김
   · 보이는 카드 수만큼 카드 경계에 맞춰 이동 (스크롤 스냅 + 직접 애니메이션) */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateTo(list, target, done) {
    const from = list.scrollLeft;
    const dist = target - from;
    if (reduce || Math.abs(dist) < 2) { list.scrollLeft = target; done(); return; }
    const dur = 380, t0 = performance.now();
    const prevSnap = list.style.scrollSnapType;
    list.style.scrollSnapType = 'none';            // 애니메이션 중에는 스냅이 끼어들지 않게
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;   // easeInOut
      list.scrollLeft = from + dist * e;
      if (p < 1) requestAnimationFrame(step);
      else { list.style.scrollSnapType = prevSnap; list.scrollLeft = target; done(); }
    })(t0);
  }

  document.querySelectorAll('.mp__carousel').forEach(function (box) {
    const list = box.querySelector('.mp__cards');
    const prev = box.querySelector('.mp__prev');
    const next = box.querySelector('.mp__next');
    if (!list || !prev || !next) return;
    let busy = false;

    function update() {
      const max = list.scrollWidth - list.clientWidth;
      prev.hidden = list.scrollLeft <= 4;
      next.hidden = max <= 4 || list.scrollLeft >= max - 4;
    }

    function move(dir) {
      if (busy) return;
      const cards = Array.from(list.children);
      if (cards.length < 2) return;
      const pos = cards.map(function (c) { return c.offsetLeft - list.offsetLeft; });
      const max = list.scrollWidth - list.clientWidth;
      const step = pos[1] - pos[0];
      const visible = Math.max(1, Math.floor(list.clientWidth / step));
      // 현재 위치에서 가장 가까운 카드 → visible 만큼 이동
      let cur = 0;
      pos.forEach(function (p, i) { if (Math.abs(p - list.scrollLeft) < Math.abs(pos[cur] - list.scrollLeft)) cur = i; });
      const idx = Math.max(0, Math.min(cards.length - 1, cur + dir * visible));
      const target = Math.max(0, Math.min(max, pos[idx]));
      busy = true;
      animateTo(list, target, function () { busy = false; update(); });
    }

    prev.addEventListener('click', function () { move(-1); });
    next.addEventListener('click', function () { move(1); });
    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('load', update);
    update();
  });
})();
