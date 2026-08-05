// フェードイン (IntersectionObserver)
document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window)) {
    fadeElements.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeElements.forEach(el => observer.observe(el));

  // ヘッダー スクロール検知
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 8) header.classList.add('header--scrolled');
      else header.classList.remove('header--scrolled');
    }, { passive: true });
  }

  // カウントアップ
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      // reduced-motion 設定時はアニメなしで即時最終値を表示
      if (prefersReducedMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        countObserver.unobserve(el);
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => countObserver.observe(el));

  // カルーセル
  const carousels = document.querySelectorAll('[data-carousel]');
  const carouselUpdaters = [];

  carousels.forEach(carousel => {
    const viewport = carousel.querySelector('.carousel__viewport');
    const track = carousel.querySelector('.carousel__track');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const dotsWrap = carousel.querySelector('[data-carousel-dots]');
    const items = Array.from(track.children);
    let index = 0;

    const getVisibleCount = () => {
      const width = window.innerWidth;
      if (width <= 560) return 1;
      if (width <= 900) return 2;
      return 3;
    };

    const getMaxIndex = () => Math.max(0, items.length - getVisibleCount());

    // スクロール位置ごとのドットを生成（数が変わったときのみ作り直す）
    const renderDots = () => {
      if (!dotsWrap) return;
      const count = getMaxIndex() + 1;
      if (dotsWrap.children.length === count) return;
      dotsWrap.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel__dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `${i + 1}番目の位置から事例を表示`);
        dot.addEventListener('click', () => { index = i; update(); });
        dotsWrap.appendChild(dot);
      }
    };

    const update = () => {
      const maxIndex = getMaxIndex();
      index = Math.min(index, maxIndex);
      const gap = 24;
      const step = items[0].offsetWidth + gap;
      // 末尾で余白が出ないよう、実スクロール幅でクランプ（peek対応）
      const maxTranslate = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const translate = Math.min(index * step, maxTranslate);
      track.style.transform = `translateX(${-translate}px)`;
      prev.disabled = index === 0;
      next.disabled = index >= maxIndex;
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((d, i) => {
          const active = i === index;
          d.classList.toggle('is-active', active);
          d.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      }
    };

    const refresh = () => { renderDots(); update(); };

    prev.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
    next.addEventListener('click', () => { index = Math.min(getMaxIndex(), index + 1); update(); });

    // キーボード操作
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prev.click(); }
      if (e.key === 'ArrowRight') { next.click(); }
    });

    // タッチ操作（SPで指を左右にフリックして事例を切り替える）
    let touchStartX = 0;
    let touchDeltaX = 0;
    let dragging = false;

    const getStep = () => items[0].offsetWidth + 24;
    const getMaxTranslate = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
      dragging = true;
      track.style.transition = 'none'; // 指の動きに追従させる間はアニメを無効化
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
      const base = Math.min(index * getStep(), getMaxTranslate());
      let translate = base - touchDeltaX;
      translate = Math.max(0, Math.min(translate, getMaxTranslate())); // 端を超えないようクランプ
      track.style.transform = `translateX(${-translate}px)`;
    }, { passive: true });

    const endTouch = () => {
      if (!dragging) return;
      dragging = false;
      track.style.transition = ''; // CSSのスライドアニメを復帰
      const threshold = Math.min(80, getStep() * 0.2);
      if (touchDeltaX <= -threshold) {
        index = Math.min(getMaxIndex(), index + 1);
      } else if (touchDeltaX >= threshold) {
        index = Math.max(0, index - 1);
      }
      update(); // スナップして位置・ドット・ボタン状態を確定
    };
    viewport.addEventListener('touchend', endTouch);
    viewport.addEventListener('touchcancel', endTouch);

    carouselUpdaters.push(refresh);
    refresh();
  });

  // リサイズはデバウンスで一括処理（イベントリークを防止）
  if (carouselUpdaters.length > 0) {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        carouselUpdaters.forEach(fn => fn());
      }, 100);
    });
  }
});
