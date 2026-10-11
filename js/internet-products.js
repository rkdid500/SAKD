/* 메인 "인터넷" 상품 카드 — 휴대폰 카드와 같은 형식
   통신사 × 속도별 인터넷 단독 상품 9종 (internet-new.js 의 PLANS 예시값과 동일한 값)
   실제 상품 데이터가 정해지면 이 배열만 교체 */
(function () {
  'use strict';
  const list = document.getElementById('ipCards');
  if (!list) return;

  // gift: 사은품(만원), price: 월 요금(원, 3년 약정·VAT 포함)
  const PLANS = [
    { carrier: 'KT',    product: '인터넷 슬림',        speed: 100,  gift: 9,  price: 22000 },
    { carrier: 'SK',    product: '광랜인터넷',          speed: 100,  gift: 11, price: 22000 },
    { carrier: 'LG U+', product: '와이파이기본 광랜안심', speed: 100,  gift: 20, price: 22000 },
    { carrier: 'KT',    product: '인터넷 베이직',       speed: 500,  gift: 20, price: 33000 },
    { carrier: 'SK',    product: '기가라이트인터넷',     speed: 500,  gift: 17, price: 33000 },
    { carrier: 'LG U+', product: '기가슬림',            speed: 500,  gift: 22, price: 33000 },
    { carrier: 'KT',    product: '인터넷 에센스',       speed: 1000, gift: 28, price: 38500 },
    { carrier: 'SK',    product: '기가인터넷',          speed: 1000, gift: 28, price: 38500 },
    { carrier: 'LG U+', product: '기가인터넷',          speed: 1000, gift: 30, price: 38500 },
  ];
  const SPEED = { 100: { label: '100M', img: 'images/100M.png' }, 500: { label: '500M', img: 'images/500M.png' }, 1000: { label: '1G', img: 'images/1G.png' } };

  const won = (n) => n.toLocaleString('ko-KR') + '원';
  // 실질 월 요금: 사은품을 36개월에 나눠 뺀 값 (100원 단위 반올림)
  const real = (p) => Math.round((p.price * 36 - p.gift * 10000) / 36 / 100) * 100;
  const pct = (p) => Math.round(((p.price - real(p)) / p.price) * 100);

  // 속도별 최저 실질 월 요금 상품 → BEST, 전체 최저 → 강조 카드
  const bestBySpeed = {};
  PLANS.forEach((p) => {
    const cur = bestBySpeed[p.speed];
    if (!cur || real(p) < real(cur)) bestBySpeed[p.speed] = p;
  });
  const overall = PLANS.reduce((a, b) => (real(b) < real(a) ? b : a));

  list.innerHTML = PLANS.map((p) => {
    const featured = p === overall;
    const isBest = bestBySpeed[p.speed] === p;
    const sp = SPEED[p.speed];
    return (
      '<a class="mp-card' + (featured ? ' mp-card--featured' : '') + '" href="internet.html">' +
        (isBest ? '<div class="mp-card__badges"><span class="mp-badge mp-badge--best">BEST</span></div>' : '') +
        '<div class="mp-card__visual"><img src="' + sp.img + '" alt="' + sp.label + ' 인터넷" loading="lazy"></div>' +
        '<h3 class="mp-card__name">' + p.carrier + ' ' + p.product + '</h3>' +
        '<p class="mp-card__storage">' + sp.label + ' · 3년 약정</p>' +
        '<div class="mp-card__price">' +
          '<s class="mp-card__list">월 ' + won(p.price) + '</s>' +
          '<span class="mp-card__save">사은품 ' + p.gift + '만원</span>' +
          '<p class="mp-card__final"><span class="mp-card__pct">' + pct(p) + '%</span><strong>월 ' + won(real(p)) + '</strong></p>' +
        '</div>' +
        '<div class="mp-card__meta"><span class="mp-tag">' + p.carrier + ' · 인터넷만</span></div>' +
      '</a>'
    );
  }).join('');

  const next = document.getElementById('ipNext');
  if (next) {
    next.addEventListener('click', () => {
      const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
      if (atEnd) list.scrollTo({ left: 0, behavior: 'smooth' });
      else list.scrollBy({ left: list.clientWidth * 0.8, behavior: 'smooth' });
    });
  }
})();
