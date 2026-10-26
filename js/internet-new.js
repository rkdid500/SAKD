/* =========================================================
   인터넷 상세 (신규 시안) — internet-new.js
   * 시안 단계라 상품 데이터는 아래 PLANS 예시값을 사용하고,
     신청 폼은 서버로 전송하지 않고 화면 흐름만 보여준다. (TODO: 실제 API 연결)
========================================================= */
(function () {
  'use strict';

  /* ---------- 예시 상품 데이터 ---------- */
  // gift: 사은품(만원), price: 월 납부금(원, 3년 약정·VAT·공유기 임대료 포함, 모바일 미결합)
  // 출처: 싹딜 인터넷 상품 선택 페이지(sakd.co.kr/internet)의 '예상 월 납부금' · '예상 사은품' (2026-10-12 확인)
  //   (통신사 · 속도 · TV 조합별로 같은 결합 조건에서 가장 저렴한 TV 상품을 대표로 사용)
  const PLANS = [
    // KT
    { id: 'k1', carrier: 'KT', product: '인터넷 슬림',   speed: 100,  tv: null,                          gift: 9,  price: 23100 },
    { id: 'k2', carrier: 'KT', product: '인터넷 슬림',   speed: 100,  tv: { name: '지니 TV 베이직', ch: 238 }, gift: 37, price: 39600 },
    { id: 'k9', carrier: 'KT', product: '인터넷 슬림',   speed: 100,  tv: { name: '지니 TV 에센스', ch: 263 }, gift: 37, price: 44000 },
    { id: 'k3', carrier: 'KT', product: '인터넷 베이직', speed: 500,  tv: null,                          gift: 14, price: 34100 },
    { id: 'k4', carrier: 'KT', product: '인터넷 베이직', speed: 500,  tv: { name: '지니 TV 베이직', ch: 238 }, gift: 45, price: 45100 },
    { id: 'k5', carrier: 'KT', product: '인터넷 베이직', speed: 500,  tv: { name: '지니 TV 라이트', ch: 240 }, gift: 45, price: 46200 },
    { id: 'k6', carrier: 'KT', product: '인터넷 베이직', speed: 500,  tv: { name: '지니 TV 모든G',  ch: 250 }, gift: 45, price: 52800 },
    { id: 'k8', carrier: 'KT', product: '인터넷 에센스', speed: 1000, tv: null,                          gift: 14, price: 38500 },
    { id: 'k7', carrier: 'KT', product: '인터넷 에센스', speed: 1000, tv: { name: '지니 TV 베이직', ch: 238 }, gift: 45, price: 49500 },
    // SK (SKT)
    { id: 's1', carrier: 'SK', product: '광랜인터넷',       speed: 100,  tv: null,                          gift: 11, price: 23100 },
    { id: 's2', carrier: 'SK', product: '광랜인터넷',       speed: 100,  tv: { name: 'Btv 이코노미', ch: 182 }, gift: 40, price: 36300 },
    { id: 's3', carrier: 'SK', product: '기가라이트인터넷', speed: 500,  tv: null,                          gift: 17, price: 34100 },
    { id: 's4', carrier: 'SK', product: '기가라이트인터넷', speed: 500,  tv: { name: 'Btv 이코노미', ch: 182 }, gift: 43, price: 42900 },
    { id: 's5', carrier: 'SK', product: '기가인터넷',       speed: 1000, tv: null,                          gift: 17, price: 39600 },
    { id: 's6', carrier: 'SK', product: '기가인터넷',       speed: 1000, tv: { name: 'Btv ALL', ch: 255 },    gift: 52, price: 55000 },
    { id: 's7', carrier: 'SK', product: '기가인터넷',       speed: 1000, tv: { name: 'Btv 이코노미', ch: 182 }, gift: 52, price: 48400 },
    // LG U+
    { id: 'l1', carrier: 'LG', product: '광랜 인터넷',     speed: 100,  tv: null,                          gift: 20, price: 22000 },
    { id: 'l2', carrier: 'LG', product: '광랜 인터넷',     speed: 100,  tv: { name: '실속형', ch: 219 },    gift: 33, price: 39600 },
    { id: 'l3', carrier: 'LG', product: '기가슬림 인터넷', speed: 500,  tv: null,                          gift: 23, price: 33000 },
    { id: 'l4', carrier: 'LG', product: '기가슬림 인터넷', speed: 500,  tv: { name: '실속형', ch: 219 },    gift: 47, price: 45100 },
    { id: 'l5', carrier: 'LG', product: '기가 인터넷',     speed: 1000, tv: null,                          gift: 23, price: 38500 },
    { id: 'l6', carrier: 'LG', product: '기가 인터넷',     speed: 1000, tv: { name: '실속형', ch: 219 },    gift: 47, price: 50600 },
    // ----- 알뜰사 (스카이라이프 · LG 헬로비전 · SKB 알뜰) -----
    // SKB(알뜰)는 TV 결합(Btv pop) 상품만 있음 → 인터넷만 칸은 데이터 없이 비워 두고 'TV 결합 전용'으로 표시됨
    { id: 'm1',  carrier: 'SL', product: '스카이라이프 인터넷', speed: 100,  tv: null,                                gift: 10, price: 23100 },
    { id: 'm2',  carrier: 'SL', product: '기가 500M 인터넷', speed: 500,  tv: null,                                gift: 14, price: 29700 },
    { id: 'm3',  carrier: 'SL', product: '스카이라이프 인터넷', speed: 1000, tv: null,                                gift: 15, price: 35200 },
    { id: 'm4',  carrier: 'SL', product: '스카이라이프 인터넷', speed: 100,  tv: { name: 'IPTV 베이직', ch: 194 },      gift: 35, price: 31900 },
    { id: 'm5',  carrier: 'SL', product: '스카이라이프 인터넷', speed: 500,  tv: { name: 'IPTV 베이직', ch: 194 },      gift: 42, price: 37400 },
    { id: 'm6',  carrier: 'SL', product: '스카이라이프 인터넷', speed: 1000, tv: { name: 'IPTV 베이직', ch: 194 },      gift: 48, price: 42900 },
    { id: 'm7',  carrier: 'HV', product: '광랜라이트 인터넷',     speed: 100,  tv: null,                                gift: 13, price: 21890 },
    { id: 'm8',  carrier: 'HV', product: '기가라이트 인터넷',     speed: 500,  tv: null,                                gift: 18, price: 31460 },
    { id: 'm9',  carrier: 'HV', product: '플래티넘기가 인터넷',     speed: 1000, tv: null,                                gift: 20, price: 33000 },
    { id: 'm10', carrier: 'HV', product: '광랜라이트 인터넷',     speed: 100,  tv: { name: '헬로tv플러스', ch: 102 },    gift: 23, price: 25130 },
    { id: 'm11', carrier: 'HV', product: '기가라이트 인터넷',     speed: 500,  tv: { name: '헬로tv플러스', ch: 102 },    gift: 31, price: 32890 },
    { id: 'm12', carrier: 'HV', product: '플래티넘기가 인터넷',     speed: 1000, tv: { name: '헬로tv플러스', ch: 102 },    gift: 34, price: 34100 },
    { id: 'm13', carrier: 'SB', product: 'SKB 알뜰 인터넷',     speed: 100,  tv: { name: 'Btv pop230', ch: 231 },      gift: 31, price: 31900 },
    { id: 'm14', carrier: 'SB', product: 'SKB 알뜰 인터넷',     speed: 500,  tv: { name: 'Btv pop230', ch: 231 },      gift: 35, price: 38500 },
    { id: 'm15', carrier: 'SB', product: 'SKB 알뜰 인터넷',     speed: 1000, tv: { name: 'Btv pop230', ch: 231 },      gift: 35, price: 44000 }
  ];
  const CARRIERS = ['KT', 'SK', 'LG'];
  const MVNO_CARRIERS = ['SL', 'HV', 'SB'];   // 알뜰사 3곳: 스카이라이프 · LG 헬로비전 · SKB(알뜰)
  const CARRIER_LABEL = { KT: 'KT', SK: 'SK', LG: 'LG U+', SL: '스카이라이프', HV: 'LG 헬로비전', SB: 'SKB 알뜰' };
  // 통신사 코드 → images/carriers/ 안의 로고 파일명 (확장자 제외)
  const LOGO_FILE = { KT: 'kt', SK: 'sk', LG: 'lg', SL: 'skylife', HV: 'lg-hellovision', SB: 'skb-saving' };
  // 통신사 로고: images/carriers/<파일명>.webp (없으면 webp → png → svg 순으로 찾고, 끝내 없으면 글자 배지)
  // 미리 불러 둔 로고는 처음부터 로고 모양(has-logo)으로 그려서, 전환 때 글자 배지가 번쩍이지 않게 함
  const logoReady = new Set();
  const carrierMark = (c) => '<span class="cr cr--' + c + (logoReady.has(LOGO_FILE[c]) ? ' has-logo' : '') + '" data-logo="' + LOGO_FILE[c] + '">' +
    '<img class="cr__img" src="images/carriers/' + LOGO_FILE[c] + '.webp?v=' + LOGO_V + '" alt="" data-ext="0">' +
    '<span class="cr__txt">' + CARRIER_LABEL[c] + '</span></span>';
  // 로고 이미지가 있으면 글자 배지 대신 표시, 없으면 확장자를 바꿔 가며 찾고 끝내 없으면 글자 배지 유지
  const LOGO_EXT = ['webp', 'png', 'svg'];
  const LOGO_V = '20261012d';   // 로고 파일을 바꾸면 이 값도 올려서 캐시 무효화
  Object.keys(LOGO_FILE).forEach((k) => {   // 모든 통신사 로고를 미리 내려받아 둠
    const f = LOGO_FILE[k], im = new Image();
    im.onload = () => logoReady.add(f);
    im.src = 'images/carriers/' + f + '.webp?v=' + LOGO_V;
  });
  document.addEventListener('load', (e) => {
    const img = e.target;
    if (img && img.classList && img.classList.contains('cr__img') && img.naturalWidth > 0) {
      img.parentElement.classList.add('has-logo');
    }
  }, true);
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!img || !img.classList || !img.classList.contains('cr__img')) return;
    const next = Number(img.dataset.ext) + 1;
    if (next < LOGO_EXT.length) {
      img.dataset.ext = String(next);
      img.src = 'images/carriers/' + img.parentElement.dataset.logo + '.' + LOGO_EXT[next] + '?v=' + LOGO_V;
    }
  }, true);
  const SPEEDS = [100, 500, 1000];
  const SPEED_LABEL = { 100: '100M', 500: '500M', 1000: '1G' };
  const SPEED_NOTE = { 100: '1~2인 가구', 500: '3~4인 가구', 1000: '재택 · 방송' };

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
    return carrierMark(p.carrier) +
      '<div class="picked__info"><span class="picked__name">' + planTitle(p) + '</span>' +
      '<span class="picked__spd">인터넷 ' + SPEED_LABEL[p.speed] + (p.tv ? ' · ' + p.tv.ch + 'CH' : '') + '</span></div>' +
      '<div class="picked__side"><span class="picked__price">월 <b>' + won(p.price) + '원</b></span>' +
      '<span class="picked__gift">사은품 ' + p.gift + '만원</span></div>';
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
    if (!$('#apCarrier').value) { err.textContent = '현재 이용 통신사를 선택해 주세요.'; $('#apCarrier').focus(); return; }
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
  let mxTv = true;
  let mxMvno = false;   // true: 알뜰사 3곳 보기

  function renderMatrix() {
    const cols = mxMvno ? MVNO_CARRIERS : CARRIERS;
    mxGrid.style.setProperty('--n', cols.length);
    let html = '<div></div>' + cols.map(c =>
      '<div class="mx__h" role="columnheader">' + carrierMark(c) + '</div>').join('');
    SPEEDS.forEach(s => {
      const row = cols.map(c => bestPlan(c, s, mxTv));
      const min = Math.min.apply(null, row.filter(Boolean).map(realPrice));
      html += '<div class="mx__speed" role="rowheader"><b>' + SPEED_LABEL[s] + '</b><span>' + SPEED_NOTE[s] + '</span></div>';
      row.forEach((p, ci) => {
        if (!p) {
          // SKB(알뜰)는 TV 결합 상품만 있어서 '인터넷만' 칸이 비어 있음
          const msg = (cols[ci] === 'SB' && !mxTv) ? 'TV 결합 전용' : '상담 시 안내';
          html += '<div class="cell cell--empty">' + msg + '</div>'; return;
        }
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

  // 표 전환을 부드럽게: 현재 표를 살짝 흐리게 사라지게 → 내용 교체 → 다시 나타나게.
  // 전환 중에는 표 높이를 고정해서 아래 내용이 위아래로 출렁이지 않게 함.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mxSwapTimer = null, mxDoneTimer = null;
  function swapMatrix(update) {
    clearTimeout(mxSwapTimer); clearTimeout(mxDoneTimer);
    if (reduceMotion) { update(); renderMatrix(); return; }
    const startH = mxGrid.offsetHeight;
    mxGrid.style.height = startH + 'px';      // 사라지는 동안 높이를 고정
    mxGrid.classList.remove('is-in');
    mxGrid.classList.add('is-out');
    mxSwapTimer = setTimeout(() => {
      update();
      renderMatrix();
      // 새 내용의 높이를 재서, 이전 높이에서 새 높이로 부드럽게 늘어나거나 줄어들게 함
      mxGrid.style.height = 'auto';
      const endH = mxGrid.offsetHeight;
      mxGrid.style.height = startH + 'px';
      void mxGrid.offsetHeight;
      mxGrid.style.overflow = 'hidden';
      mxGrid.style.transition = 'height .32s cubic-bezier(.22,.61,.36,1), opacity .17s ease, transform .17s ease';
      mxGrid.style.height = endH + 'px';
      mxGrid.classList.remove('is-out');
      void mxGrid.offsetWidth;            // 애니메이션 재시작
      mxGrid.classList.add('is-in');
      mxDoneTimer = setTimeout(() => {
        mxGrid.classList.remove('is-in');
        mxGrid.style.height = '';
        mxGrid.style.overflow = '';
        mxGrid.style.transition = '';
      }, 400);
    }, 170);
  }

  $('#mxToggle').addEventListener('click', (e) => {
    const b = e.target.closest('.tgl__btn');
    if (!b) return;
    $$('#mxToggle .tgl__btn').forEach(x => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', String(on)); });
    const wantTv = b.dataset.tv === 'yes';
    if (wantTv === mxTv) return;
    swapMatrix(() => { mxTv = wantTv; });
  });
  // 알뜰사 버튼: 누르면 알뜰 3사(스카이라이프 · LG 헬로비전 · SKB 알뜰), 다시 누르면 통신 3사
  const mxMvnoBtn = $('#mxMvno');
  if (mxMvnoBtn) {
    mxMvnoBtn.addEventListener('click', () => {
      const next = !mxMvno;
      // 버튼 상태와 글자는 바로 바꾸고, 표는 부드럽게 전환
      mxMvnoBtn.classList.toggle('is-on', next);
      mxMvnoBtn.setAttribute('aria-pressed', String(next));
      // 알뜰사를 보고 있을 땐 '통신 3사'로, 통신 3사를 보고 있을 땐 '알뜰사'로 글자가 바뀜
      mxMvnoBtn.textContent = next ? '통신 3사' : '알뜰사';
      swapMatrix(() => { mxMvno = next; });
    });
  }
  renderMatrix();

  /* ---------- 우리 집 맞춤 추천 (같은 인터넷에서 TV 구성별 비교 목록) ---------- */
  const LIFE = {
    small:  ['k1', 'k2', 'k9'],
    family: ['k3', 'k4', 'k5'],
    pro:    ['s5', 's6', 's7']
  };
  const lifeGrid = $('#lifeGrid');
  function renderLife(key) {
    const plans = LIFE[key].map(byId);
    const base = plans[0];
    lifeGrid.innerHTML =
      '<div class="rec__bar">' + carrierMark(base.carrier) + '' +
        '<span>' + base.product + ' <i>· ' + SPEED_LABEL[base.speed] + '</i></span></div>' +
      plans.map(p =>
        '<button type="button" class="rrow" data-open-apply data-plan="' + p.id + '">' +
          '<span><span class="rrow__type">' + (p.tv ? '인터넷 + TV' : '인터넷만') + '</span>' +
            '<span class="rrow__name" style="display:block">' + (p.tv ? p.tv.name : '인터넷만') + '</span>' +
            '<span class="rrow__sub" style="display:block">' + (p.tv ? p.tv.ch + 'CH' : 'TV 없이') + '</span></span>' +
          '<span class="rrow__gift"><small>사은품</small><b>' + p.gift + '만원</b></span>' +
          '<span class="rrow__price">월 <b>' + won(p.price) + '</b>원<span class="rrow__real">실질 월 ' + won(realPrice(p)) + '원</span></span>' +
          '<span class="rrow__go" aria-hidden="true">›</span>' +
        '</button>').join('') +
      '<p class="rec__note">3년 약정 · VAT 포함 · 설치비 별도</p>';
    lifeGrid.classList.remove('rec'); void lifeGrid.offsetWidth; lifeGrid.classList.add('rec');
  }
  // 메인 페이지에서는 이 섹션이 없을 수 있으므로, 있을 때만 동작시킴
  if (lifeGrid && $('#lifeTabs')) {
    $('#lifeTabs').addEventListener('click', (e) => {
      const b = e.target.closest('.seg__btn');
      if (!b) return;
      $$('#lifeTabs .seg__btn').forEach(x => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', String(on)); });
      renderLife(b.dataset.life);
    });
    renderLife('small');
  }

  /* ---------- 후기 레일 ---------- */
  const revRail = $('#revRail');
  const railStep = (dir) => {
    const card = revRail.firstElementChild;
    revRail.scrollBy({ left: dir * ((card ? card.getBoundingClientRect().width : 280) + 16), behavior: 'smooth' });
  };
  // 메인 페이지에서는 후기·하단 신청 영역이 없을 수 있으므로, 있을 때만 동작시킴
  if ($('#revPrev')) $('#revPrev').addEventListener('click', () => railStep(-1));
  if ($('#revNext')) $('#revNext').addEventListener('click', () => railStep(1));

  /* ---------- 하단 CTA 폼 ---------- */
  if ($('#endForm')) $('#endForm').addEventListener('submit', (e) => {
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
    const endTop = endSec ? endSec.getBoundingClientRect().top : Infinity;
    pill.classList.toggle('is-on', heroBottom < 0 && endTop > window.innerHeight * 0.85);
  }
  window.addEventListener('scroll', updatePill, { passive: true });
  window.addEventListener('resize', updatePill, { passive: true });
  updatePill();
})();
