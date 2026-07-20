// お問い合わせ内容への自動入力ヘルパー（シミュレーター・料金プランから共用）
// ※main.jsはdefer先頭のため、後続のsimulator.jsが読み込まれる前にこの関数が定義される
window.lpSetAutofill = function (lines) {
  const ta = document.getElementById('cf-message');
  if (!ta) return;
  const START = '【自動入力ここから】';
  const END = '【自動入力ここまで】';
  const block = `${START}\n${lines.join('\n')}\n${END}\n`;
  // 既存の自動入力ブロックがあれば置き換え（重複防止）。ユーザー入力分は残す
  const re = /【自動入力ここから】[\s\S]*?【自動入力ここまで】\n*/;
  const rest = ta.value.replace(re, '').replace(/^\s+/, '');
  ta.value = block + (rest ? `\n${rest}` : '');
};

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

    carouselUpdaters.push(update);
    update();
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

  // フローティングCTA
  const fab = document.getElementById('floating-cta');
  if (fab) {
    const toggle = fab.querySelector('.floating-cta__toggle');
    const menu = fab.querySelector('.floating-cta__menu');
    const setOpen = (open) => {
      fab.classList.toggle('floating-cta--open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'お問い合わせメニューを閉じる' : 'お問い合わせメニューを開く');
      menu.hidden = !open;
    };

    // 初期表示は開いた状態。画面1つ分ほどスクロールしたら一度だけ自動で閉じる
    setOpen(true);
    let autoCollapseDone = false;
    // ファーストビューを読み終える程度スクロールしたら閉じる（早すぎ防止）
    const collapseThreshold = Math.max(500, window.innerHeight * 0.9);
    const onFirstScroll = () => {
      if (autoCollapseDone) return;
      if (window.scrollY > collapseThreshold) {
        autoCollapseDone = true;
        setOpen(false);
        window.removeEventListener('scroll', onFirstScroll);
      }
    };
    window.addEventListener('scroll', onFirstScroll, { passive: true });

    toggle.addEventListener('click', () => {
      // ユーザーが手動操作したら自動クローズは無効化
      autoCollapseDone = true;
      window.removeEventListener('scroll', onFirstScroll);
      const isOpen = fab.classList.contains('floating-cta--open');
      setOpen(!isOpen);
    });
    // 外側クリックで閉じる
    document.addEventListener('click', (e) => {
      if (!fab.contains(e.target) && fab.classList.contains('floating-cta--open')) {
        setOpen(false);
      }
    });
    // Escで閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
    // 項目クリックで閉じる
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  }

  // 料金プランの「相談する」→ 選択プランをお問い合わせ内容に自動記載
  document.querySelectorAll('.plan-card__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.plan-card');
      if (!card) return;
      const name = (card.querySelector('.plan-card__badge')?.textContent || '').trim();
      const priceNum = (card.querySelector('.plan-card__num')?.textContent || '').trim();
      const price = priceNum ? `（${priceNum}万円/月）` : '';
      if (name && window.lpSetAutofill) {
        window.lpSetAutofill([`ご希望のプラン：${name}${price}`]);
      }
    });
  });
});
