document.addEventListener('DOMContentLoaded', () => {
  // ---- 프로모션 배너 캐러셀 ----
  const track = document.getElementById('phoneBannerTrack');
  if (track) {
    const slides = Array.from(track.children);
    const dotsWrap = document.querySelector('.phone-banner__dots');
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'phone-banner__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `${i + 1}번째 배너로 이동`);
      dotsWrap.appendChild(dot);
      return dot;
    });

    let current = 0;
    let autoTimer = null;
    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    };
    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    };
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));
    document.querySelector('.phone-banner__arrow--prev')?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    document.querySelector('.phone-banner__arrow--next')?.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    startAuto();

    // ---- 배너 스와이프: 손가락(또는 마우스)으로 밀어서 이전/다음 배너로 이동 (외부 라이브러리 없음) ----
    const frame = track.parentElement;
    const SWIPE_RATIO = 0.18; // 배너 폭의 18% 이상 밀면 넘김
    let startX = 0;
    let startY = 0;
    let dragging = false;
    let dragged = false;
    let activePointer = null;

    const snapBack = () => {
      track.classList.remove('is-dragging');
      track.style.transform = `translateX(-${current * 100}%)`;
    };

    frame.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      dragged = false;
      activePointer = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      clearInterval(autoTimer); // 누르고 있는 동안 자동 넘김 일시정지
    });

    frame.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== activePointer) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!dragged) {
        if (Math.abs(dx) < 6) return;               // 아주 작은 움직임은 무시(탭으로 처리)
        if (Math.abs(dy) > Math.abs(dx)) return;    // 세로 스크롤 의도면 가로 드래그 안 함
        dragged = true;
        track.classList.add('is-dragging');
        try { frame.setPointerCapture(e.pointerId); } catch (_) {}
      }
      // 첫/마지막 배너에서 너무 많이 끌리지 않도록 약간 저항을 준다
      const atEdge = (current === 0 && dx > 0) || (current === slides.length - 1 && dx < 0);
      const offset = atEdge ? dx * 0.35 : dx;
      track.style.transform = `translateX(calc(-${current * 100}% + ${offset}px))`;
      e.preventDefault();
    });

    const endDrag = (e) => {
      if (!dragging || e.pointerId !== activePointer) return;
      dragging = false;
      activePointer = null;
      if (dragged) {
        const dx = e.clientX - startX;
        const width = frame.getBoundingClientRect().width;
        track.classList.remove('is-dragging');
        if (e.type === 'pointerup' && Math.abs(dx) > width * SWIPE_RATIO) {
          goTo(dx < 0 ? current + 1 : current - 1);
        } else {
          snapBack();
        }
      }
      startAuto();
      setTimeout(() => { dragged = false; }, 50); // 클릭 차단 플래그는 잠시 뒤 해제
    };
    frame.addEventListener('pointerup', endDrag);
    frame.addEventListener('pointercancel', endDrag);

    // 스와이프 직후에는 배너 링크(#devices)로 이동하지 않도록 클릭 차단
    frame.addEventListener('click', (e) => {
      if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; }
    }, true);
    frame.addEventListener('dragstart', (e) => e.preventDefault()); // 이미지 끌기 방지
  }

  // ---- 실제 개통 후기: 3초마다 한 칸씩 자동 스와이프(네이티브 스크롤 스냅, 외부 라이브러리 없음) ----
  (function initPhoneReviewSwiper() {
    const reviewTrack = document.getElementById('phoneReviewTrack');
    if (!reviewTrack) return;

    const cardStep = () => {
      const card = reviewTrack.querySelector('.review-card');
      if (!card) return 0;
      const gap = parseFloat(getComputedStyle(reviewTrack).columnGap || getComputedStyle(reviewTrack).gap || '0');
      return card.getBoundingClientRect().width + gap;
    };
    const advance = () => {
      const maxScroll = reviewTrack.scrollWidth - reviewTrack.clientWidth;
      if (reviewTrack.scrollLeft >= maxScroll - 2) {
        reviewTrack.scrollLeft = 0;
      } else {
        reviewTrack.scrollLeft = Math.min(maxScroll, reviewTrack.scrollLeft + cardStep());
      }
    };

    let autoplay = setInterval(advance, 3000);
    const pause = () => clearInterval(autoplay);
    const resume = () => { clearInterval(autoplay); autoplay = setInterval(advance, 3000); };
    reviewTrack.addEventListener('mouseenter', pause);
    reviewTrack.addEventListener('mouseleave', resume);
    reviewTrack.addEventListener('touchstart', pause, { passive: true });
  })();

  // ---- 기기 가격 비교: 브랜드 필터 탭 ----
  const filterButtons = document.querySelectorAll('.phone-filter-btn');
  const deviceCards = Array.from(document.querySelectorAll('.device-card'));
  const PAGE_SIZE = 4;

  const renderDevices = () => {
    const activeBtn = document.querySelector('.phone-filter-btn.is-active');
    const target = activeBtn ? activeBtn.dataset.filter : 'all';
    const matching = deviceCards.filter(card => target === 'all' || card.dataset.brand === target);

    deviceCards.forEach(card => { card.hidden = !matching.includes(card); });
    matching.forEach((card, i) => { if (i >= PAGE_SIZE) card.hidden = true; });
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderDevices();
    });
  });

  renderDevices();

  // ---- 기기 카드: 클릭하면 강조 카드와 같은 테두리·효과 적용 ----
  deviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return; // 내부 버튼 클릭은 그대로 동작
      const wasSelected = card.classList.contains('is-selected');
      deviceCards.forEach(c => c.classList.remove('is-selected'));
      if (!wasSelected) card.classList.add('is-selected'); // 선택된 카드를 다시 누르면 해제
    });
  });

  // ---- FAQ 아코디언: 한 번에 하나만 펼치기 ----
  const faqItems = document.querySelectorAll('.phone-faq__item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => { if (other !== item) other.open = false; });
      }
    });
  });
});
