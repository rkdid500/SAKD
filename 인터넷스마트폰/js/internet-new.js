/* =========================================================
   인터넷 상세 (신규 시안) — internet-new.js
   * 시안 단계라 상품 데이터는 아래 PLANS 예시값을 사용하고,
     신청 폼은 서버로 전송하지 않고 화면 흐름만 보여준다. (TODO: 실제 API 연결)
========================================================= */
(function () {
  'use strict';

  /* ---------- 예시 상품 데이터 ---------- */
  // gift: 사은품(만원), price: 월 요금(원, 3년 약정·VAT 포함 기준), speed: 100 | 500 | 1000
  const PLANS = [
    { id: 'k1', carrier: 'KT', product: '인터넷 슬림',   speed: 100,  tv: null,                          gift: 9,  price: 22000 },
    { id: 'k2', carrier: 'KT', product: '인터넷 슬림',   speed: 100,  tv: { name: '지니 TV 베이직', ch: 230 }, gift: 37, price: 34100 },
    { id: 'k3', carrier: 'KT', product: '인터넷 베이직', speed: 500,  tv: null,                          gift: 20, price: 33000 },
    { id: 'k4', carrier: 'KT', product: '인터넷 베이직', speed: 500,  tv: { name: '지니 TV 베이직', ch: 230 }, gift: 45, price: 39600 },
    { id: 'k5', carrier: 'KT', product: '인터넷 베이직', speed: 500,  tv: { name: '지니 TV 라이트', ch: 240 }, gift: 45, price: 40700 },
    { id: 'k6', carrier: 'KT', product: '인터넷 베이직', speed: 500,  tv: { name: '지니 TV 모든G',  ch: 250 }, gift: 48, price: 47300 },
    { id: 'k8', carrier: 'KT', product: '인터넷 에센스', speed: 1000, tv: null,                          gift: 28, price: 38500 },
    { id: 'k7', carrier: 'KT', product: '인터넷 에센스', speed: 1000, tv: { name: '지니 TV 베이직', ch: 230 }, gift: 50, price: 49500 },
    { id: 's1', carrier: 'SK', product: '광랜인터넷',     speed: 100,  tv: null,                          gift: 11, price: 22000 },
    { id: 's2', carrier: 'SK', product: '광랜인터넷',     speed: 100,  tv: { name: 'Btv New 이코노미', ch: 182 }, gift: 40, price: 29700 },
    { id: 's3', carrier: 'SK', product: '기가라이트인터넷', speed: 500, tv: null,                         gift: 17, price: 33000 },
    { id: 's4', carrier: 'SK', product: '기가라이트인터넷', speed: 500, tv: { name: 'Btv ALL', ch: 257 },   gift: 42, price: 47300 },
    { id: 's5', carrier: 'SK', product: '기가인터넷',     speed: 1000, tv: null,                          gift: 28, price: 38500 },
    { id: 's6', carrier: 'SK', product: '기가인터넷',     speed: 1000, tv: { name: 'Btv ALL', ch: 257 },   gift: 48, price: 52800 },
    { id: 'l1', carrier: 'LG', product: '와이파이기본 광랜안심', speed: 100, tv: null,                     gift: 20, price: 22000 },
    { id: 'l2', carrier: 'LG', product: '와이파이기본 광랜안심', speed: 100, tv: { name: '기본형', ch: 223 }, gift: 33, price: 36300 },
    { id: 'l3', carrier: 'LG', product: '기가슬림',       speed: 500,  tv: null,                          gift: 22, price: 33000 },
    { id: 'l4', carrier: 'LG', product: '기가슬림',       speed: 500,  tv: { name: '실속tv', ch: 217 },    gift: 40, price: 44000 },
    { id: 'l5', carrier: 'LG', product: '기가인터넷',     speed: 1000, tv: null,                          gift: 30, price: 38500 },
    { id: 'l6', carrier: 'LG', product: '기가인터넷',     speed: 1000, tv: { name: '프리미엄 TV', ch: 260 }, gift: 50, price: 55000 }
  ];
  const CARRIERS = ['KT', 'SK', 'LG'];
  const CARRIER_LABEL = { KT: 'KT', SK: 'SK', LG: 'LG U+' };
  const SPEEDS = [100, 500, 1000];
  const SPEED_LABEL = { 100: '100M', 500: '500M', 1000: '1G' };
  const SPEED_NOTE = { 100: '가볍게', 500: '가족용', 1000: '고속' };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const won = (n) => n.toLocaleString('ko-KR');
  const byId = (id) => PLANS.find(p => p.id === id);
  // 실질 월 요금: 사은품을 36개월에 나눠 뺀 값 (100원 단위 반올림)
  const realPrice = (p) => Math.round((p.price * 36 - p.gift * 10000) / 36 / 100) * 100;
  const planTitle = (p) => p.product + (p.tv ? ' + ' + p.tv.name : '');
  // 같은 조건(통신사·속도·TV 여부)에서 실질 월 요금이 가장 낮은 상품
  function bestPlan(carrier, speed, hasTv) {
    return PLANS
      .filter(p => p.carrier === carrier && p.speed === speed && !!p.tv === hasTv)
      .sort((a, b) => realPrice(a) - realPrice(b) || b.gift - a.gift)[0] || null;
  }

  /* ---------- 모바일 사이드 메뉴: 배경 동기화, 닫기 버튼/배경 클릭/ESC (토글은 main.js) ---------- */
  (function initSideMenu() {
    const menu = $('#mobileMenu'), dim = $('#mobileMenuDim'), burger = $('#hamburgerBtn'), closeBtn = $('#mobileMenuClose');
    if (!menu || !dim || !burger) return;
    new MutationObserver(() => dim.classList.toggle('is-open', menu.classList.contains('is-open')))
      .observe(menu, { attributes: true, attributeFilter: ['class'] });
    const close = () => { if (menu.classList.contains('is-open')) burger.click(); };
    dim.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  })();

  /* ---------- 연락처 입력 포맷 + 검증 ---------- */
  const formatPhone = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return d.slice(0, 3) + '-' + d.slice(3);
    return d.slice(0, 3) + '-' + d.slice(3, d.length - 4) + '-' + d.slice(-4);
  };
  const validPhone = (v) => /^01[016789]-\d{3,4}-\d{4}$/.test(v);
  document.addEventListener('input', (e) => {
    if (e.target.matches('input[type="tel"]')) e.target.value = formatPhone(e.target.value);
  });

  /* ---------- 신청 모달 ---------- */
  const modal = $('#applyModal');
  const applyBody = $('#applyBody');
  const applyDone = $('#applyDone');
  const applyPicked = $('#applyPicked');
  let selectedPlan = null;
  let lastFocus = null;

  function pickedHtml(p) {
    return '<div class="picked__top"><span class="cr cr--' + p.carrier + '">' + CARRIER_LABEL[p.carrier] + '</span>' +
      '<span class="picked__name">' + planTitle(p) + '</span></div>' +
      '<div class="picked__row"><span>인터넷 ' + SPEED_LABEL[p.speed] + (p.tv ? ' · ' + p.tv.ch + 'CH' : '') + '</span>' +
      '<span>월 <b>' + won(p.price) + '원</b> · 사은품 <b>' + p.gift + '만원</b></span></div>';
  }

  function openApply(planId) {
    selectedPlan = planId ? byId(planId) : null;
    applyBody.hidden = false;
    applyDone.hidden = true;
    $('#apError').textContent = '';
    if (selectedPlan) { applyPicked.innerHTML = pickedHtml(selectedPlan); applyPicked.hidden = false; }
    else { applyPicked.hidden = true; applyPicked.innerHTML = ''; }
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('is-locked');
    setTimeout(() => $('#apName').focus(), 60);
  }
  function closeApply() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function showModalDone(text) {
    $('#applyDoneText').textContent = text;
    applyBody.hidden = true;
    applyDone.hidden = false;
    if (modal.hidden) { modal.hidden = false; document.body.classList.add('is-locked'); }
  }

  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-apply]');
    if (openBtn) { openApply(openBtn.dataset.plan || null); return; }
    if (e.target.closest('[data-close-apply]')) closeApply();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeApply(); });

  $('#applyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#apError');
    const name = $('#apName').value.trim();
    if (!name) { err.textContent = '이름을 입력해 주세요.'; $('#apName').focus(); return; }
    if (!validPhone($('#apPhone').value)) { err.textContent = '연락처를 010-0000-0000 형식으로 입력해 주세요.'; $('#apPhone').focus(); return; }
    if (!$('#apAgree').checked) { err.textContent = '개인정보 수집·이용에 동의해 주세요.'; return; }
    err.textContent = '';
    // TODO: 실제 신청 API 연결 (name, phone, selectedPlan, 현재 통신사, 통화 시간)
    showModalDone(selectedPlan
      ? name + '님, ' + planTitle(selectedPlan) + ' 조건으로 상담사가 곧 연락드릴게요.'
      : name + '님, 상담사가 곧 연락드려 가장 좋은 조건을 안내해 드릴게요.');
    $('#applyForm').reset();
  });

  /* ---------- 프로모션 배너 캐러셀 (네이티브 구현, 외부 라이브러리 없음) ---------- */
  (function initBanner() {
    const track = $('#bnTrack');
    if (!track) return;
    const slides = Array.from(track.children);
    const count = $('#bnCount');
    let cur = 0, timer = null;
    const goTo = (i) => {
      cur = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';
      count.textContent = (cur + 1) + ' / ' + slides.length;
    };
    const start = () => { clearInterval(timer); timer = setInterval(() => goTo(cur + 1), 5000); };
    $('#bnPrev').addEventListener('click', () => { goTo(cur - 1); start(); });
    $('#bnNext').addEventListener('click', () => { goTo(cur + 1); start(); });
    // 모바일 스와이프
    let x0 = null;
    track.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (x0 !== null) {
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) goTo(cur + (dx < 0 ? 1 : -1));
      }
      x0 = null; start();
    }, { passive: true });
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();
  })();

  /* ---------- 통신사 × 속도 비교표 (CARRIERS 목록 길이만큼 열이 늘어남) ---------- */
  const mxGrid = $('#mxGrid');
  mxGrid.style.setProperty('--n', CARRIERS.length);
  let mxTv = false;

  function renderMatrix() {
    let html = '<div></div>' + CARRIERS.map(c =>
      '<div class="mx__h" role="columnheader"><span class="cr cr--' + c + '">' + CARRIER_LABEL[c] + '</span></div>').join('');
    SPEEDS.forEach(s => {
      const row = CARRIERS.map(c => bestPlan(c, s, mxTv));
      const min = Math.min.apply(null, row.filter(Boolean).map(realPrice));
      html += '<div class="mx__speed" role="rowheader"><b>' + SPEED_LABEL[s] + '</b><span>' + SPEED_NOTE[s] + '</span></div>';
      row.forEach(p => {
        if (!p) { html += '<div class="cell cell--empty">상담 시 안내</div>'; return; }
        const best = realPrice(p) === min;
        html += '<button type="button" class="cell' + (best ? ' is-best' : '') + '" role="cell" data-open-apply data-plan="' + p.id + '">' +
          (best ? '<span class="cell__best">최고 혜택</span>' : '') +
          '<span class="cell__real">' + won(realPrice(p)) + '<small>원</small></span>' +
          '<span class="cell__lbl">실질 월</span>' +
          '<span class="cell__name">' + planTitle(p) + '</span>' +
          '<span class="cell__meta">사은품 <b>' + p.gift + '만</b></span></button>';
      });
    });
    mxGrid.innerHTML = html;
  }
  $('#mxToggle').addEventListener('click', (e) => {
    const b = e.target.closest('.tgl__btn');
    if (!b) return;
    $$('#mxToggle .tgl__btn').forEach(x => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', String(on)); });
    mxTv = b.dataset.tv === 'yes';
    renderMatrix();
  });
  renderMatrix();

  /* ---------- 우리 집 맞춤 추천 ---------- */
  const LIFE = {
    small:  ['k1', 's2', 'l2'],
    family: ['k4', 's3', 'l4'],
    pro:    ['s5', 'l5', 'k7']
  };
  const lifeGrid = $('#lifeGrid');
  function renderLife(key) {
    lifeGrid.innerHTML = LIFE[key].map(id => {
      const p = byId(id);
      return '<article class="lc">' +
        '<div><span class="cr cr--' + p.carrier + '">' + CARRIER_LABEL[p.carrier] + '</span></div>' +
        '<h3 class="lc__name">' + planTitle(p) + '</h3>' +
        '<p class="lc__spec">인터넷 ' + SPEED_LABEL[p.speed] + (p.tv ? ' · ' + p.tv.ch + 'CH' : '') + '</p>' +
        '<div class="lc__tags"><span class="tag tag--gift">사은품 ' + p.gift + '만원</span><span class="tag tag--soft">실질 월 ' + won(realPrice(p)) + '원</span></div>' +
        '<p class="lc__price">월 <b>' + won(p.price) + '</b>원</p>' +
        '<button type="button" class="btn btn--primary btn--block" data-open-apply data-plan="' + p.id + '">신청하기</button>' +
      '</article>';
    }).join('');
  }
  $('#lifeTabs').addEventListener('click', (e) => {
    const b = e.target.closest('.seg__btn');
    if (!b) return;
    $$('#lifeTabs .seg__btn').forEach(x => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', String(on)); });
    renderLife(b.dataset.life);
    lifeGrid.scrollLeft = 0;
  });
  renderLife('small');

  /* ---------- 후기 레일 ---------- */
  const revRail = $('#revRail');
  const railStep = (dir) => {
    const card = revRail.firstElementChild;
    revRail.scrollBy({ left: dir * ((card ? card.getBoundingClientRect().width : 280) + 16), behavior: 'smooth' });
  };
  $('#revPrev').addEventListener('click', () => railStep(-1));
  $('#revNext').addEventListener('click', () => railStep(1));

  /* ---------- 하단 CTA 폼 ---------- */
  $('#endForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#endError');
    if (!validPhone($('#endPhone').value)) { err.textContent = '연락처를 010-0000-0000 형식으로 입력해 주세요.'; $('#endPhone').focus(); return; }
    if (!$('#endAgree').checked) { err.textContent = '개인정보 수집·이용에 동의해 주세요.'; return; }
    err.textContent = '';
    // TODO: 실제 신청 API 연결
    showModalDone('상담사가 곧 연락드려 가장 좋은 조건을 안내해 드릴게요.');
    $('#endForm').reset();
  });

  /* ---------- 데스크톱 알약 버튼: 히어로를 지나면 등장, 하단 CTA 영역에선 숨김 ---------- */
  const pill = $('#pill');
  const hero = $('#top'), endSec = $('#end');
  function updatePill() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const endTop = endSec.getBoundingClientRect().top;
    pill.classList.toggle('is-on', heroBottom < 0 && endTop > window.innerHeight * 0.85);
  }
  window.addEventListener('scroll', updatePill, { passive: true });
  window.addEventListener('resize', updatePill, { passive: true });
  updatePill();
})();
