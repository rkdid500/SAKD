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
