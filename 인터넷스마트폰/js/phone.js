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

  // ---- 기기 가격 비교: 브랜드 필터 탭 + 모바일 더보기 ----
  const filterButtons = document.querySelectorAll('.phone-filter-btn');
  const deviceCards = Array.from(document.querySelectorAll('.device-card'));
  const moreBtn = document.getElementById('deviceMoreBtn');
  const MOBILE_QUERY = window.matchMedia('(max-width: 768px)');
  const PAGE_SIZE = 4;
  let expanded = false;

  const renderDevices = () => {
    const activeBtn = document.querySelector('.phone-filter-btn.is-active');
    const target = activeBtn ? activeBtn.dataset.filter : 'all';
    const matching = deviceCards.filter(card => target === 'all' || card.dataset.brand === target);

    deviceCards.forEach(card => { card.hidden = !matching.includes(card); });

    const shouldPaginate = MOBILE_QUERY.matches && !expanded;
    if (shouldPaginate) {
      matching.forEach((card, i) => { if (i >= PAGE_SIZE) card.hidden = true; });
    }

    if (moreBtn) {
      moreBtn.hidden = !(MOBILE_QUERY.matches && !expanded && matching.length > PAGE_SIZE);
    }
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      expanded = false;
      renderDevices();
    });
  });

  moreBtn?.addEventListener('click', () => {
    expanded = true;
    renderDevices();
  });

  MOBILE_QUERY.addEventListener('change', () => {
    expanded = false;
    renderDevices();
  });

  renderDevices();

  // ---- 기기 카드: 클릭하면 강조 카드와 같은 테두리·효과 적용 ----
  deviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return; // 내부 버튼 클릭은 그대로 동작
      deviceCards.forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
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
