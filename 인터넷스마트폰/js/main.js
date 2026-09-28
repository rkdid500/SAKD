document.addEventListener('DOMContentLoaded', () => {
  // ---- Mobile hamburger menu ----
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('is-active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- 히어로 비주얼: intro webp를 2.4초 재생한 뒤 floating-loop webp로 전환 ----
  // 두 webp 모두 처음부터 <img src>가 걸려 있어 브라우저가 병렬로 미리 로드하므로,
  // 전환 시점엔 이미 로드가 끝난 loop 이미지의 opacity만 올려서 깜빡임 없이 바뀐다.
  // Animated WebP는 종료 이벤트가 없어 타이머로만 전환 시점을 판단한다.
  (function initHeroVisual() {
    const introImg = document.getElementById('heroVisualIntro');
    const loopImg = document.getElementById('heroVisualLoop');
    if (!introImg || !loopImg) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // 정적 대표 프레임 에셋이 없어, 최선의 대안으로 intro 전환 없이 loop만 바로 노출한다.
      introImg.classList.remove('is-active');
      loopImg.classList.add('is-active');
      return;
    }

    const timerId = setTimeout(() => {
      loopImg.classList.add('is-active');
      introImg.classList.remove('is-active');
    }, 2400);

    window.addEventListener('beforeunload', () => clearTimeout(timerId), { once: true });
  })();

  // ---- Category tabs (visual state only; wiring to real filtering comes later) ----
  const catButtons = document.querySelectorAll('.cat-tabs__item');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      // TODO: hook up category filtering once product data is wired in
    });
  });


  // ---- 싹딜의 비교 방식: 데스크톱 스크롤 스크럽(순수 CSS sticky + 스크롤 리스너, 외부 라이브러리 없음) ----
  (function initMethodDesktop() {
    const section = document.getElementById('methodSection');
    const textSlides = section ? Array.from(section.querySelectorAll('.method__slide')) : [];
    const visualSlides = section ? Array.from(section.querySelectorAll('.method__visual-slide')) : [];
    const stepBoxes = section ? Array.from(section.querySelectorAll('.method__step-box')) : [];
    if (!section || !textSlides.length) return;

    const desktopQuery = window.matchMedia('(min-width: 769px)');
    let currentIdx = 0;
    let ticking = false;

    const setActiveStep = (idx) => {
      if (idx === currentIdx) return;
      currentIdx = idx;
      stepBoxes.forEach((box, i) => box.classList.toggle('is-active', i === idx));
      textSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === idx));
      visualSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === idx));
    };

    const updateProgress = () => {
      ticking = false;
      if (!desktopQuery.matches) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const idx = Math.min(2, Math.round(progress * 2));
      setActiveStep(idx);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateProgress();
  })();

  // ---- 싹딜의 비교 방식: 모바일 스와이프(네이티브 스크롤 스냅, 외부 라이브러리 없음) ----
  (function initMethodMobile() {
    const track = document.getElementById('methodMobileTrack');
    const dotsWrap = document.getElementById('methodMobileDots');
    if (!track || !dotsWrap) return;

    const dots = Array.from(dotsWrap.children);
    let ticking = false;

    const updateActiveDot = () => {
      ticking = false;
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === idx));
    };

    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActiveDot);
    }, { passive: true });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
      });
    });
  })();

  // ---- Mobile bottom bar "카테고리" button scrolls to category tabs ----
  const mobileBarCat = document.getElementById('mobileBarCat');
  const catTabs = document.querySelector('.cat-tabs');
  if (mobileBarCat && catTabs) {
    mobileBarCat.addEventListener('click', () => {
      catTabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---- 스크롤 리빌(.rv) + 자식 스태거([data-stagger]) ----
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.rv');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('is-in'));
    } else {
      const revealIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealIO.unobserve(entry.target);
          const kids = entry.target.querySelectorAll('[data-stagger] > *');
          kids.forEach((kid, i) => {
            kid.style.transitionDelay = (i * 55) + 'ms';
            kid.classList.add('is-in');
          });
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      revealEls.forEach(el => revealIO.observe(el));

      // 목차 이동 등으로 화면을 건너뛴 경우, 이미 보이는데 안 켜진 요소를 직접 켬
      let sweeping = false;
      const sweep = () => {
        if (sweeping) return;
        sweeping = true;
        requestAnimationFrame(() => {
          const vh = window.innerHeight || document.documentElement.clientHeight;
          document.querySelectorAll('.rv:not(.is-in)').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < vh * 0.94) el.classList.add('is-in');
          });
          sweeping = false;
        });
      };
      window.addEventListener('scroll', sweep, { passive: true });
      window.addEventListener('resize', sweep, { passive: true });
      setTimeout(sweep, 400);
    }

    // data-stagger 컨테이너 자체가 뷰포트에 들어올 때도 자식을 순서대로 표시
    const staggerEls = document.querySelectorAll('[data-stagger]');
    if (staggerEls.length && 'IntersectionObserver' in window && !reduceMotion) {
      const staggerIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          staggerIO.unobserve(entry.target);
          Array.from(entry.target.children).forEach((kid, i) => {
            kid.style.transitionDelay = (i * 55) + 'ms';
            kid.classList.add('is-in');
          });
        });
      }, { threshold: 0.06 });
      staggerEls.forEach(el => staggerIO.observe(el));
    } else if (reduceMotion) {
      staggerEls.forEach(el => Array.from(el.children).forEach(kid => kid.classList.add('is-in')));
    }
  }

  // ---- 숫자 카운트업 ([data-count]) ----
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      countEls.forEach(el => {
        const to = parseFloat(el.getAttribute('data-count'));
        const dec = parseInt(el.getAttribute('data-dec') || '0', 10);
        const suf = el.getAttribute('data-suf') || '';
        el.textContent = to.toLocaleString('ko-KR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      });
    } else {
      const countIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          countIO.unobserve(entry.target);
          const el = entry.target;
          const to = parseFloat(el.getAttribute('data-count'));
          const dec = parseInt(el.getAttribute('data-dec') || '0', 10);
          const suf = el.getAttribute('data-suf') || '';
          const duration = 1500;
          let start = null;
          function tick(t) {
            if (start === null) start = t;
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            el.textContent = (to * eased).toLocaleString('ko-KR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.6 });
      countEls.forEach(el => countIO.observe(el));
    }
  }

  // ---- 비교 막대그래프: 스크롤 진입 시 0에서 목표 높이까지 자라나는 효과 ----
  const whyChart = document.getElementById('whyChart');
  if (whyChart) {
    const bars = Array.from(whyChart.querySelectorAll('.why__chart-bar'));
    if (reduceMotion || !('IntersectionObserver' in window)) {
      bars.forEach(bar => { bar.style.height = (bar.getAttribute('data-h') || '0') + '%'; });
    } else {
      const chartIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          chartIO.unobserve(entry.target);
          bars.forEach((bar, i) => {
            bar.style.transitionDelay = (i * 90) + 'ms';
            bar.style.height = (bar.getAttribute('data-h') || '0') + '%';
          });
        });
      }, { threshold: 0.4 });
      chartIO.observe(whyChart);
    }
  }
});
