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

  /* ---------- 히어로: 단계형 추천 ---------- */
  const SVG = {
    plus:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7v9H4z"/><path d="M12 10v6M9 13h6"/></svg>',
    swap:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h12l-3-3M17 17H5l3 3"/></svg>',
    renew: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5"/></svg>',
    net:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 17a8.5 8.5 0 1 1 15 0M12 13l4-4"/></svg>',
    tv:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M9 21h6"/></svg>'
  };
  const QUESTIONS = [
    { key: 'situation', q: '어떤 상황이세요?', hint: '상황에 따라 챙겨드릴 내용이 달라져요.',
      opts: [
        { v: '신규·이사', t: '새로 가입해요', s: '이사하거나 처음 설치해요', ico: SVG.plus },
        { v: '통신사 변경', t: '통신사를 바꾸고 싶어요', s: '지금 쓰는 곳에서 갈아타요', ico: SVG.swap },
        { v: '재약정', t: '지금 통신사를 계속 쓸래요', s: '약정이 끝나서 다시 가입해요', ico: SVG.renew }
      ] },
    { key: 'speed', q: '집에서 인터넷을 어떻게 쓰세요?', hint: '쓰는 방식에 맞춰 속도를 골라드려요.',
      opts: [
        { v: 100,  t: '가볍게 써요', s: '검색·쇼핑·영상 위주, 1~2인', ico: '100M' },
        { v: 500,  t: '여러 명이 함께 써요', s: 'OTT·게임까지, 3~4인 가족', ico: '500M' },
        { v: 1000, t: '재택·방송·대용량이에요', s: '빠르고 안정적인 속도가 필요해요', ico: '1G' }
      ] },
    { key: 'tv', q: 'TV도 같이 쓰세요?', hint: '결합하면 사은품이 더 커지는 경우가 많아요.',
      opts: [
        { v: false, t: '인터넷만 필요해요', s: 'TV는 따로 보거나 안 봐요', ico: SVG.net },
        { v: true,  t: 'TV도 함께 쓸래요', s: '채널·OTT까지 한 번에', ico: SVG.tv }
      ] }
  ];

  const wzBody = $('#wzBody'), wzBack = $('#wzBack'), wzStep = $('#wzStep'), wzBar = $('#wzBar');
  const wz = { step: 0, ans: {}, pickedId: null };

  function setProgress(step) {
    $$('i', wzBar).forEach((b, i) => b.classList.toggle('is-on', i <= step));
    wzStep.textContent = step < 3 ? (step + 1) + ' / 3' : '추천 결과';
    wzBack.hidden = step === 0;
  }

  function renderQuestion() {
    const Q = QUESTIONS[wz.step];
    setProgress(wz.step);
    wzBody.innerHTML =
      '<h2 class="wz__q">' + Q.q + '</h2><p class="wz__hint">' + Q.hint + '</p>' +
      '<div class="wz__opts">' + Q.opts.map((o, i) =>
        '<button type="button" class="opt' + (wz.ans[Q.key] === o.v ? ' is-picked' : '') + '" data-i="' + i + '">' +
          '<span class="opt__ico">' + o.ico + '</span>' +
          '<span class="opt__txt"><b>' + o.t + '</b><span>' + o.s + '</span></span>' +
          '<span class="opt__go" aria-hidden="true">›</span></button>').join('') + '</div>';
  }

  function resultPlans() {
    return CARRIERS.map(c => bestPlan(c, wz.ans.speed, wz.ans.tv)).filter(Boolean);
  }

  function renderResult() {
    setProgress(3);
    const plans = resultPlans();
    const cheapest = plans.slice().sort((a, b) => realPrice(a) - realPrice(b))[0];
    if (!wz.pickedId || !plans.some(p => p.id === wz.pickedId)) wz.pickedId = cheapest.id;
    const p = byId(wz.pickedId);
    wzBody.innerHTML =
      '<div class="wzr">' +
        '<p class="wzr__label">' + (p.id === cheapest.id ? '싹딜이 고른 우리 집 최적 상품' : '선택하신 상품') + '</p>' +
        '<div class="wzr__main">' +
          '<div class="wzr__top"><span class="cr cr--' + p.carrier + '">' + CARRIER_LABEL[p.carrier] + '</span>' +
            '<span class="tag tag--gift">사은품 ' + p.gift + '만원</span></div>' +
          '<p class="wzr__name">' + planTitle(p) + '</p>' +
          '<p class="wzr__spec">인터넷 ' + SPEED_LABEL[p.speed] + (p.tv ? ' · ' + p.tv.ch + 'CH' : ' · 인터넷만') + '</p>' +
          '<p class="wzr__real">사은품 반영 실질 월<b>' + won(realPrice(p)) + '원</b></p>' +
          '<p class="wzr__line"><span>월 요금 <b>' + won(p.price) + '원</b></span><span>3년 약정 · VAT 포함</span></p>' +
        '</div>' +
        '<div class="wzr__alt">' + plans.map(a =>
          '<button type="button" class="alt' + (a.id === p.id ? ' is-sel' : '') + '" data-pick="' + a.id + '">' +
            '<span class="cr cr--' + a.carrier + '">' + CARRIER_LABEL[a.carrier] + '</span>' +
            '<span class="alt__name">' + planTitle(a) + '</span>' +
            '<span class="alt__real">실질 ' + won(realPrice(a)) + '원</span></button>').join('') + '</div>' +
        '<form class="wzr__form" id="wzForm" novalidate>' +
          '<input type="tel" id="wzPhone" inputmode="numeric" autocomplete="tel" placeholder="연락처 (010-0000-0000)" maxlength="13" aria-label="연락처">' +
          '<button type="submit" class="btn btn--primary btn--lg">이 조건으로 무료 상담 신청</button>' +
          '<label class="agree"><input type="checkbox" id="wzAgree"><span>개인정보 수집·이용에 동의합니다. <a href="#" class="agree__link">자세히</a></span></label>' +
          '<p class="qf__error" id="wzError" role="alert"></p>' +
        '</form>' +
      '</div>';
  }

  function renderWizard() {
    if (wz.step < 3) renderQuestion(); else renderResult();
  }

  wzBody.addEventListener('click', (e) => {
    const opt = e.target.closest('.opt');
    if (opt) {
      const Q = QUESTIONS[wz.step];
      wz.ans[Q.key] = Q.opts[Number(opt.dataset.i)].v;
      $$('.opt', wzBody).forEach(o => o.classList.toggle('is-picked', o === opt));
      setTimeout(() => { wz.step += 1; if (wz.step === 3) wz.pickedId = null; renderWizard(); }, 160);
      return;
    }
    const alt = e.target.closest('.alt');
    if (alt) { wz.pickedId = alt.dataset.pick; renderResult(); }
  });

  wzBack.addEventListener('click', () => { if (wz.step > 0) { wz.step -= 1; renderWizard(); } });

  wzBody.addEventListener('submit', (e) => {
    if (e.target.id !== 'wzForm') return;
    e.preventDefault();
    const err = $('#wzError');
    if (!validPhone($('#wzPhone').value)) { err.textContent = '연락처를 010-0000-0000 형식으로 입력해 주세요.'; $('#wzPhone').focus(); return; }
    if (!$('#wzAgree').checked) { err.textContent = '개인정보 수집·이용에 동의해 주세요.'; return; }
    const p = byId(wz.pickedId);
    // TODO: 실제 신청 API 연결 (phone, wz.ans, 선택 상품)
    setProgress(3);
    wzBody.innerHTML =
      '<div class="wz__done"><div class="done-mark" aria-hidden="true"></div>' +
      '<h3>신청이 접수됐어요</h3><p>' + planTitle(p) + ' 조건으로<br>상담사가 곧 연락드릴게요.</p>' +
      '<button type="button" class="btn btn--outline btn--block" id="wzRestart">처음부터 다시 해보기</button></div>';
  });
  wzBody.addEventListener('click', (e) => {
    if (e.target.id === 'wzRestart') { wz.step = 0; wz.ans = {}; wz.pickedId = null; renderWizard(); }
  });
  renderWizard();

  /* ---------- 3사 × 속도 비교표 ---------- */
  const mxGrid = $('#mxGrid');
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
          '<span class="cell__meta">월 ' + won(p.price) + ' · 사은품 <b>' + p.gift + '만</b></span></button>';
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

  /* ---------- 혜택 계산기 ---------- */
  const calcSelect = $('#calcSelect');
  calcSelect.innerHTML = CARRIERS.map(c =>
    '<optgroup label="' + CARRIER_LABEL[c] + '">' +
    PLANS.filter(p => p.carrier === c).map(p =>
      '<option value="' + p.id + '">' + planTitle(p) + ' · ' + SPEED_LABEL[p.speed] + '</option>').join('') +
    '</optgroup>').join('');
  calcSelect.value = 'k4';

  function renderCalc() {
    const p = byId(calcSelect.value);
    const total = p.price * 36;
    const gift = p.gift * 10000;
    const mePct = Math.round((total - gift) / total * 100);
    $('#calcOut').innerHTML =
      '<div class="cbar"><div class="cbar__me" style="width:' + mePct + '%">내 실제 부담 ' + won(Math.round((total - gift) / 10000)) + '만원</div>' +
      '<div class="cbar__gift" style="width:' + (100 - mePct) + '%">사은품 ' + p.gift + '만원</div></div>' +
      '<div class="cbar__cap"><span>3년 총 요금 <b>' + won(Math.round(total / 10000)) + '만원</b> (월 ' + won(p.price) + '원 × 36개월)</span></div>' +
      '<div class="cres"><div class="cres__box"><small>표시 월 요금</small><b>' + won(p.price) + '원</b></div>' +
      '<span class="cres__arrow" aria-hidden="true">→</span>' +
      '<div class="cres__box cres__box--hot"><small>사은품 반영 실질 월</small><b>' + won(realPrice(p)) + '원</b></div></div>' +
      '<p class="cres__save">한 달에 약 <b>' + won(p.price - realPrice(p)) + '원</b>, 3년이면 <b>' + p.gift + '만원</b>을 돌려받는 셈이에요.</p>';
  }
  calcSelect.addEventListener('change', renderCalc);
  $('#calcApply').addEventListener('click', () => openApply(calcSelect.value));
  renderCalc();

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
  pill.addEventListener('click', () => hero.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  updatePill();
})();
