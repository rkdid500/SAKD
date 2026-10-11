/* 메인 "휴대폰" 상품 카드 — 스마트폰 페이지(phone.html)의 상품·가격과 동일한 예시 데이터
   (실제 상품 데이터가 정해지면 이 배열만 교체) */
(function () {
  'use strict';
  const list = document.getElementById('mpCards');
  if (!list) return;

  // save: 지원금(만원), list: 출고가, final: 최종 기기값 (원), join: 가입 유형
  const PHONES = [
    { name: '아이폰 18 프로맥스', spec: '256GB · 티타늄 블랙', img: 'images/products/18P_BG.jpg', list: 2200000, save: 48, final: 1719000, carrier: 'SKT', join: '번호이동', badges: ['hot', 'new'], featured: true },
    { name: '아이폰 18 프로', spec: '256GB · 딥블루', img: 'images/products/18P_BG.jpg', list: 1991000, save: 63, final: 1361000, carrier: 'LG U+', join: '번호이동', badges: ['new'] },
    { name: '갤럭시 Z 폴드8', spec: '256GB · 블루 섀도우', img: 'images/products/F791N_G.jpg', list: 2278100, save: 90, final: 1377100, carrier: 'SKT', join: '번호이동', badges: ['hot', 'new'] },
    { name: '갤럭시 Z 플립8', spec: '256GB · 코랄 오렌지', img: 'images/products/F776N_G.jpg', list: 1683000, save: 90, final: 782000, carrier: 'KT', join: '번호이동', badges: ['new'] },
    { name: '아이폰 17 프로맥스', spec: '256GB · 코스믹 오렌지', img: 'images/products/17PM_S.jpg', list: 1980000, save: 55, final: 1428000, carrier: 'LG U+', join: '번호이동', badges: ['new'] },
    { name: '아이폰 17 프로', spec: '256GB · 딥블루', img: 'images/products/17P_S.jpg', list: 1782000, save: 95, final: 831000, carrier: 'SKT', join: '번호이동', badges: ['hot'] },
    { name: '아이폰 17', spec: '128GB · 라벤더', img: 'images/products/17_B.jpg', list: 1287000, save: 95, final: 336000, carrier: 'KT', join: '번호이동', badges: [] },
    { name: '갤럭시 Z 폴드8 울트라', spec: '256GB · 바이올렛 쉐도우', img: 'images/products/F976N_G.jpg', list: 2577300, save: 90, final: 1676300, carrier: 'LG U+', join: '번호이동', badges: ['new'] },
    { name: '갤럭시 S26 울트라', spec: '256GB · 티타늄 그레이', img: 'images/products/S948_B.jpg', list: 1797400, save: 90, final: 896400, carrier: 'LG U+', join: '번호이동', badges: ['new'] },
    { name: '갤럭시 S26', spec: '256GB · 아이스 블루', img: 'images/products/S942_B.jpg', list: 1254000, save: 90, final: 353000, carrier: 'SKT', join: '번호이동', badges: [] },
  ];

  const won = (n) => n.toLocaleString('ko-KR') + '원';
  const pct = (p) => Math.round(((p.list - p.final) / p.list) * 100);

  list.innerHTML = PHONES.map((p) =>
    '<a class="mp-card' + (p.featured ? ' mp-card--featured' : '') + '" href="pages/phone-order.html">' +
      (p.badges.length
        ? '<div class="mp-card__badges">' + p.badges.map((b) =>
            '<span class="mp-badge mp-badge--' + b + '">' + b.toUpperCase() + '</span>').join('') + '</div>'
        : '') +
      '<div class="mp-card__visual"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></div>' +
      '<h3 class="mp-card__name">' + p.name + '</h3>' +
      '<p class="mp-card__storage">' + p.spec + '</p>' +
      '<div class="mp-card__price">' +
        '<s class="mp-card__list">' + won(p.list) + '</s>' +
        '<span class="mp-card__save">지원금 ' + p.save + '만원</span>' +
        '<p class="mp-card__final"><span class="mp-card__pct">' + pct(p) + '%</span><strong>' + won(p.final) + '</strong></p>' +
      '</div>' +
      '<div class="mp-card__meta"><span class="mp-tag">' + p.carrier + ' · ' + p.join + '</span></div>' +
    '</a>').join('');

  const next = document.getElementById('mpNext');
  if (next) {
    next.addEventListener('click', () => {
      const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
      if (atEnd) list.scrollTo({ left: 0, behavior: 'smooth' });
      else list.scrollBy({ left: list.clientWidth * 0.8, behavior: 'smooth' });
    });
  }
})();
