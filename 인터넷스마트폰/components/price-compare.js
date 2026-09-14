// 요금 비교 가로 막대 그래프 (독립 컴포넌트)
// 재사용 시: 대상 페이지의 DOMContentLoaded 핸들러 안에 이 블록을 그대로 옮겨 붙이면 됨.
// 필요 요소: <div class="price-compare__bars" id="priceCompareBars"> 안의 각 막대에
// style="--pct:00%" 로 목표 너비를 지정해두면, 화면에 보이는 순간 한 번만 그 너비로 채워짐.
document.addEventListener('DOMContentLoaded', () => {
  const compareBars = document.getElementById('priceCompareBars');
  if (!compareBars) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          compareBars.classList.add('is-visible');
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(compareBars);
  } else {
    compareBars.classList.add('is-visible');
  }
});
