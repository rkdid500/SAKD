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
    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    };
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
    document.querySelector('.phone-banner__arrow--prev')?.addEventListener('click', () => goTo(current - 1));
    document.querySelector('.phone-banner__arrow--next')?.addEventListener('click', () => goTo(current + 1));

    setInterval(() => goTo(current + 1), 5000);
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
