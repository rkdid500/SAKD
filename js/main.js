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

  // ---- Category tabs (visual state only; wiring to real filtering comes later) ----
  const catButtons = document.querySelectorAll('.cat-tabs__item');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      // TODO: hook up category filtering once product data is wired in
    });
  });

  // ---- 싹딜의 비교 방식: GSAP ScrollTrigger pinned step transitions (PC + Mobile) ----
  // Technique matches the reference site (rkdid500.github.io/green car, section02):
  // the image side is a Swiper.js "creative" effect carousel (rotate + fade) whose
  // slide is switched via swiper.slideTo() at scroll-progress thresholds. GSAP
  // ScrollTrigger only owns the pin + scroll-progress tracking, not the image
  // transform itself. Pin distance is kept short (+=120%) so it doesn't take an
  // excessive amount of scrolling to get through all 3 steps.
  if (window.gsap && window.ScrollTrigger && window.Swiper) {
    gsap.registerPlugin(ScrollTrigger);
    const PIN_DISTANCE = '+=120%';

    ScrollTrigger.matchMedia({
      '(min-width: 769px)': function () {
        const section = document.getElementById('methodSection');
        const pinTarget = section ? section.querySelector('.method__pin') : null;
        const swiperEl = document.getElementById('methodSwiper');
        if (!section || !pinTarget || !swiperEl) return;

        const textSlides = Array.from(section.querySelectorAll('.method__slide'));
        const stepBoxes = Array.from(section.querySelectorAll('.method__step-box'));

        const swiper = new Swiper(swiperEl, {
          speed: 700,
          effect: 'creative',
          allowTouchMove: false,
          creativeEffect: {
            prev: { opacity: 0, rotate: [0, 0, -45] },
            next: { opacity: 0, rotate: [0, 0, 45] }
          }
        });

        let currentIdx = 0;
        const setActiveStep = (idx) => {
          if (idx === currentIdx) return;
          currentIdx = idx;
          stepBoxes.forEach((box, i) => box.classList.toggle('is-active', i === idx));
          textSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === idx));
          swiper.slideTo(idx);
        };

        const st = ScrollTrigger.create({
          trigger: section,
          pin: pinTarget,
          start: 'top top',
          end: PIN_DISTANCE,
          scrub: 0.6,
          snap: {
            snapTo: [0, 0.5, 1],
            duration: { min: 0.25, max: 0.6 },
            ease: 'power2.inOut'
          },
          onUpdate: (self) => {
            const idx = Math.min(2, Math.round(self.progress * 2));
            setActiveStep(idx);
          }
        });

        return () => {
          st.kill();
          swiper.destroy(true, true);
        };
      },

      '(max-width: 768px)': function () {
        // Mobile: no scroll-jacking/pin — the section just scrolls past normally.
        // Steps are switched by swiping the carousel left/right instead.
        const swiperEl = document.getElementById('methodMobileSwiper');
        const dotsWrap = document.getElementById('methodMobileDots');
        if (!swiperEl || !dotsWrap) return;

        const dots = Array.from(dotsWrap.children);

        const swiper = new Swiper(swiperEl, {
          speed: 600,
          effect: 'creative',
          allowTouchMove: true,
          creativeEffect: {
            prev: { opacity: 0, rotate: [0, 0, -45] },
            next: { opacity: 0, rotate: [0, 0, 45] }
          },
          on: {
            slideChange(sw) {
              dots.forEach((dot, i) => dot.classList.toggle('is-active', i === sw.activeIndex));
            }
          }
        });

        return () => {
          swiper.destroy(true, true);
        };
      }
    });
  }

  // ---- Mobile bottom bar "카테고리" button scrolls to category tabs ----
  const mobileBarCat = document.getElementById('mobileBarCat');
  const catTabs = document.querySelector('.cat-tabs');
  if (mobileBarCat && catTabs) {
    mobileBarCat.addEventListener('click', () => {
      catTabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});
