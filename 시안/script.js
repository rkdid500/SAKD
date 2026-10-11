(() => {
  'use strict';

  /* ---------- Data (edit here) ---------- */
  const won = n => n.toLocaleString('ko-KR') + '원';

  const phones = [
    { brand: '삼성', name: '갤럭시 Z폴드8 와이드', plan: '데이터플랜MAX', msrp: 2278100, inst: 1028100, isNew: true, kind: 'fold', c: ['#d9c9f0', '#a98fe0'] },
    { brand: '애플', name: '아이폰 18 프로', plan: '베스트 109', msrp: 1991000, inst: 1201000, isNew: true, c: ['#3a3d46', '#15161b'] },
    { brand: '애플', name: '아이폰 18 프로맥스', plan: '베스트 109', msrp: 2200000, inst: 1860000, isNew: true, c: ['#8a3a48', '#4a1822'] },
    { brand: '애플', name: '아이폰 17', plan: '베스트 109', msrp: 1452000, inst: 612000, c: ['#e5d4f2', '#b9a0dc'] },
    { brand: '삼성', name: '갤럭시 Z 폴드8 울트라', plan: '데이터플랜MAX', msrp: 2577300, inst: 1627300, isNew: true, kind: 'fold', c: ['#2d3340', '#10131a'] },
    { brand: '애플', name: '아이폰16 PRO', plan: '플러스플랜105', msrp: 1694000, inst: 334000, c: ['#cfc5b6', '#9c917f'] },
    { brand: '삼성', name: '갤럭시 S25 FE', plan: '베이직100', msrp: 946000, inst: 0, c: ['#bfe3e8', '#7fbac4'] },
    { brand: '삼성', name: '갤럭시 S26', plan: '베스트 109', msrp: 1254000, inst: 114000, c: ['#f0ddc8', '#d6b48f'] },
    { brand: '애플', name: '아이폰 AIR', plan: '플러스플랜95', msrp: 1584000, inst: 14000, c: ['#e8edf2', '#bcc6d2'] },
    { brand: '삼성', name: '갤럭시 S26 울트라', plan: '베스트 109', msrp: 1797400, inst: 657400, c: ['#4c5262', '#232733'] },
    { brand: '삼성', name: '갤럭시 S25', plan: '베스트 109', msrp: 1155000, inst: 5000, c: ['#cfd8f5', '#93a4e3'] },
    { brand: '삼성', name: '갤럭시 Z 플립8', plan: '데이터플랜MAX', msrp: 1683000, inst: 463000, isNew: true, kind: 'flat', c: ['#ffd4e2', '#f29ab8'] },
  ];

  const carriers = [
    { name: 'LG U+', desc: '인터넷 · TV' },
    { name: 'KT', desc: '인터넷 · TV' },
    { name: 'SK', desc: '인터넷 · TV' },
  ];

  const reviews = [
    { n: '김*현', d: '2026-10-07', t: '숨은 조건 없이 원금이 깔끔하게 보여서 믿고 샀어요. 다음 모델 나오면 또 오겠습니다. 번창하세요!', g: ['#cfd8f5', '#8fa2e8'], e: '📱' },
    { n: '이*림', d: '2026-09-28', t: '상담이 빠르고 어렵지 않게 안내해 주셔서 만족해요. 케이스와 필름까지 챙겨주셔서 바로 쓸 수 있었어요. 재구매 의사 100%입니다.', g: ['#f3e0cf', '#d9ad8a'], e: '🎁' },
    { n: '박*연', d: '2026-09-18', t: '사전예약 마지막 날 주문했는데도 바로 개통해 주셔서 출시 당일에 퀵으로 받았어요. 사은품도 쓸 만한 것들로 알차게 주셨어요.', g: ['#d5ecdf', '#8fc7a6'], e: '🚀' },
  ];

  /* ---------- Render ---------- */
  const $ = s => document.querySelector(s);

  function phoneArt(p) {
    const cls = p.kind === 'fold' ? 'ph ph--fold' : p.kind === 'flat' ? 'ph ph--flat' : 'ph';
    return `<div class="${cls}" style="background:linear-gradient(150deg,${p.c[0]},${p.c[1]})"></div>`;
  }

  $('#phoneCards').innerHTML = phones.map(p => `
    <a class="card" href="#mobile">
      <div class="card__img">${phoneArt(p)}</div>
      <div class="card__body">
        ${p.isNew ? '<span class="tag">신상품</span>' : '<span class="card__spacer" style="flex:0;min-height:0"></span>'}
        <span class="card__brand">${p.brand}</span>
        <strong class="card__name">${p.name}</strong>
        <span class="card__plan">${p.plan}</span>
        <div class="card__price">
          <span><s>출고가</s>${won(p.msrp)}</span>
          <span class="r"><em>할부원금</em><strong>${won(p.inst)}<em>부터</em></strong></span>
        </div>
      </div>
    </a>`).join('');

  $('#carriers').innerHTML = carriers.map((c, i) => `
    <button class="carrier${i === 0 ? ' is-on' : ''}" type="button" data-i="${i}">
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      <span class="go">상품 선택 ›</span>
    </button>`).join('');

  $('#reviewGrid').innerHTML = reviews.map(r => `
    <article class="review">
      <div class="review__img" style="background:linear-gradient(140deg,${r.g[0]},${r.g[1]})" aria-hidden="true">${r.e}</div>
      <div class="review__meta"><b>${r.n}</b><span class="stars" aria-label="별점 5점">★★★★★</span><time datetime="${r.d}">${r.d}</time></div>
      <p>${r.t}</p>
    </article>`).join('');

  /* ---------- Carrier select ---------- */
  $('#carriers').addEventListener('click', e => {
    const b = e.target.closest('.carrier');
    if (!b) return;
    document.querySelectorAll('.carrier').forEach(el => el.classList.toggle('is-on', el === b));
  });

  /* ---------- Phone carousel arrow ---------- */
  const scroller = $('#phoneCards');
  const next = $('#phoneNext');
  next.addEventListener('click', () => {
    const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4;
    if (atEnd) scroller.scrollTo({ left: 0, behavior: 'smooth' });
    else scroller.scrollBy({ left: scroller.clientWidth * 0.8, behavior: 'smooth' });
  });

  /* ---------- Hero slider ---------- */
  const track = $('#heroTrack');
  const slides = track.children.length;
  const dots = $('#heroDots');
  let cur = 0, timer;

  dots.innerHTML = Array.from({ length: slides }, (_, i) =>
    `<button type="button" role="tab" aria-label="${i + 1}번 배너" data-i="${i}"></button>`).join('');

  function go(i) {
    cur = (i + slides) % slides;
    track.style.transform = `translateX(-${cur * 100}%)`;
    [...dots.children].forEach((d, k) => {
      d.classList.toggle('is-on', k === cur);
      d.setAttribute('aria-selected', k === cur);
    });
  }
  function play() { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000); }

  dots.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    go(+b.dataset.i); play();
  });

  let sx = null;
  track.addEventListener('pointerdown', e => { sx = e.clientX; });
  window.addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 50) { go(cur + (dx < 0 ? 1 : -1)); play(); }
  });

  go(0); play();

  /* ---------- Mobile menu ---------- */
  const btn = $('#menuBtn'), gnb = $('#gnb');
  function setMenu(open) {
    gnb.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }
  btn.addEventListener('click', () => setMenu(!gnb.classList.contains('is-open')));
  gnb.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
})();
