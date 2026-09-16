document.addEventListener('DOMContentLoaded', () => {
  // ---- 요금 찾기 카드: 그룹별 단일 선택 칩 ----
  document.querySelectorAll('.inet-finder__options').forEach(group => {
    const chips = Array.from(group.querySelectorAll('.inet-chip'));
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
      });
    });
  });

  // ---- 대표 요금제: 인터넷만 / 인터넷+TV 토글 (표시용, 실제 데이터 전환은 추후 연결) ----
  const toggleButtons = document.querySelectorAll('.inet-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  // ---- 대표 요금제 카드: 클릭하면 강조 카드와 같은 테두리·효과 적용 ----
  const planCards = document.querySelectorAll('.inet-plan-card');
  planCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return; // 내부 버튼 클릭은 그대로 동작
      planCards.forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
    });
  });

  // ---- 인터넷 후기: 화살표 클릭 + 자동 한 칸씩 스크롤 ----
  const reviewTrack = document.getElementById('inetReviewTrack');
  if (reviewTrack) {
    const cardStep = () => {
      const card = reviewTrack.querySelector('.inet-review-card');
      return card ? card.getBoundingClientRect().width + 14 : 240;
    };
    const atEnd = () => reviewTrack.scrollLeft + reviewTrack.clientWidth >= reviewTrack.scrollWidth - 4;
    const advance = (dir) => {
      reviewTrack.scrollLeft = (dir > 0 && atEnd()) ? 0 : reviewTrack.scrollLeft + dir * cardStep();
    };
    document.getElementById('inetReviewPrev')?.addEventListener('click', () => advance(-1));
    document.getElementById('inetReviewNext')?.addEventListener('click', () => advance(1));

    let autoplay = setInterval(() => advance(1), 3000);
    const pauseAutoplay = () => { clearInterval(autoplay); };
    const resumeAutoplay = () => { clearInterval(autoplay); autoplay = setInterval(() => advance(1), 3000); };
    reviewTrack.addEventListener('mouseenter', pauseAutoplay);
    reviewTrack.addEventListener('mouseleave', resumeAutoplay);
    reviewTrack.addEventListener('touchstart', pauseAutoplay, { passive: true });
  }

  // ---- FAQ 아코디언: 한 번에 하나만 펼치기 ----
  const faqItems = document.querySelectorAll('.inet-faq__item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => { if (other !== item) other.open = false; });
      }
    });
  });
});
