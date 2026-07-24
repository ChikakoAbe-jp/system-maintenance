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
    const viewport = carousel.querySelector('.carousel__viewport');
    const track = carousel.querySelector('.carousel__track');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const dotsWrap = carousel.querySelector('[data-carousel-dots]');
    const items = Array.from(track.children);
    let index = 0;
    const GAP = 24;

    // SP幅ではネイティブ横スクロール（フリック）を使う
    const isNative = () => window.matchMedia('(max-width: 768px)').matches;
    const stepSize = () => items[0].offsetWidth + GAP;

    const getVisibleCount = () => {
      const width = window.innerWidth;
      if (width <= 560) return 1;
      if (width <= 900) return 2;
      return 3;
    };

    const getMaxIndex = () => Math.max(0, items.length - getVisibleCount());

    // 矢印の活性/ドットのアクティブ状態を反映（表示モード共通）
    const setActiveState = (activeIndex, maxIndex) => {
      prev.disabled = activeIndex <= 0;
      next.disabled = activeIndex >= maxIndex;
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((d, i) => {
          const active = i === activeIndex;
          d.classList.toggle('is-active', active);
          d.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      }
    };

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
        dot.addEventListener('click', () => {
          if (isNative()) {
            viewport.scrollTo({ left: i * stepSize(), behavior: 'smooth' });
          } else {
            index = i; update();
          }
        });
        dotsWrap.appendChild(dot);
      }
    };

    // PC等：transformでスライド
    const update = () => {
      const maxIndex = getMaxIndex();
      index = Math.min(index, maxIndex);
      const step = stepSize();
      // 末尾で余白が出ないよう、実スクロール幅でクランプ（peek対応）
      const maxTranslate = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const translate = Math.min(index * step, maxTranslate);
      track.style.transform = `translateX(${-translate}px)`;
      setActiveState(index, maxIndex);
    };

    // SP：ネイティブスクロール位置から現在インデックスを算出して同期
    const syncNative = () => {
      const maxIndex = getMaxIndex();
      index = Math.min(Math.round(viewport.scrollLeft / stepSize()), maxIndex);
      setActiveState(index, maxIndex);
    };

    const refresh = () => {
      renderDots();
      if (isNative()) {
        // ネイティブスクロールに切替時はtransformを解除
        track.style.transform = '';
        syncNative();
      } else {
        update();
      }
    };

    prev.addEventListener('click', () => {
      if (isNative()) {
        viewport.scrollBy({ left: -stepSize(), behavior: 'smooth' });
      } else {
        index = Math.max(0, index - 1); update();
      }
    });
    next.addEventListener('click', () => {
      if (isNative()) {
        viewport.scrollBy({ left: stepSize(), behavior: 'smooth' });
      } else {
        index = Math.min(getMaxIndex(), index + 1); update();
      }
    });

    // フリック（ネイティブスクロール）中はドット/矢印を同期（rAFで間引き）
    let scrollRaf = 0;
    viewport.addEventListener('scroll', () => {
      if (!isNative()) return;
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        syncNative();
      });
    }, { passive: true });

    // キーボード操作
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prev.click(); }
      if (e.key === 'ArrowRight') { next.click(); }
    });

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

  // フローティングCTA
  const fab = document.getElementById('floating-cta');
  if (fab) {
    const toggle = fab.querySelector('.floating-cta__toggle');
    const menu = fab.querySelector('.floating-cta__menu');
    const setOpen = (open) => {
      fab.classList.toggle('floating-cta--open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'お問い合わせメニューを閉じる' : 'お問い合わせメニューを開く');
      // 表示/非表示はCSS（opacity/visibility）でふわっとアニメーション。
      // アクセシビリティのため、閉じ切ってから aria-hidden を付与（開く時は即解除）
      if (open) {
        menu.removeAttribute('aria-hidden');
      } else {
        window.setTimeout(() => {
          if (!fab.classList.contains('floating-cta--open')) menu.setAttribute('aria-hidden', 'true');
        }, 320);
      }
    };

    // スクロール連動の自動開閉（SPとPCで挙動を分ける）
    const isSP = window.matchMedia('(max-width: 768px)').matches;
    let autoScroll = null;
    const stopAuto = () => {
      if (autoScroll) { window.removeEventListener('scroll', autoScroll); autoScroll = null; }
    };

    if (isSP) {
      // スマホ：最初は閉じ、少しスクロールで開き、しばらくスクロールで再び閉じる（各1回）
      setOpen(false);
      const OPEN_AT = 250;      // 「少し」スクロールしたら開く
      const CLOSE_AT = 1300;    // 「しばらく」スクロールしたら閉じる
      let phase = 'wait-open';  // wait-open → wait-close → done
      autoScroll = () => {
        const y = window.scrollY;
        if (phase === 'wait-open' && y > OPEN_AT) {
          setOpen(true); phase = 'wait-close';
        } else if (phase === 'wait-close' && y > CLOSE_AT) {
          setOpen(false); phase = 'done'; stopAuto();
        }
      };
    } else {
      // PC：最初は開いた状態。画面1つ分ほどスクロールしたら一度だけ閉じる
      setOpen(true);
      const collapseThreshold = Math.max(500, window.innerHeight * 0.9);
      autoScroll = () => {
        if (window.scrollY > collapseThreshold) { setOpen(false); stopAuto(); }
      };
    }
    window.addEventListener('scroll', autoScroll, { passive: true });

    toggle.addEventListener('click', () => {
      // ユーザーが手動操作したら自動開閉は無効化
      stopAuto();
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
