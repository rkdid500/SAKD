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

  // ---- 기기 가격 비교: 브랜드 필터 탭 ----
  const filterButtons = document.querySelectorAll('.phone-filter-btn');
  const deviceCards = document.querySelectorAll('.device-card');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const target = btn.dataset.filter;
      deviceCards.forEach(card => {
        const show = target === 'all' || card.dataset.brand === target;
        card.hidden = !show;
      });
    });
  });

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
