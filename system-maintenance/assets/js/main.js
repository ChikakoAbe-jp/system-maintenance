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
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
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
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.carousel__track');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const items = Array.from(track.children);
    let index = 0;

    const getVisibleCount = () => {
      const width = window.innerWidth;
      if (width <= 560) return 1;
      if (width <= 900) return 2;
      return 3;
    };

    const update = () => {
      const visible = getVisibleCount();
      const maxIndex = Math.max(0, items.length - visible);
      index = Math.min(index, maxIndex);
      const card = items[0];
      const gap = 24;
      const step = card.offsetWidth + gap;
      track.style.transform = `translateX(${-index * step}px)`;
      prev.disabled = index === 0;
      next.disabled = index >= maxIndex;
    };

    prev.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
    next.addEventListener('click', () => { index = index + 1; update(); });

    // キーボード操作
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prev.click(); }
      if (e.key === 'ArrowRight') { next.click(); }
    });

    window.addEventListener('resize', update);
    update();
  });
});
