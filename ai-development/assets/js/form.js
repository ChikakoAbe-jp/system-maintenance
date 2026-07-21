// お問い合わせフォーム（カスタム複数選択 + 入力→確認→送信の2ステップ）
(() => {
  // CSRFトークンをサーバーから取得してhidden fieldに注入
  fetch('contact/token.php', { credentials: 'same-origin' })
    .then(r => r.json())
    .then(d => { const el = document.getElementById('cf-csrf'); if (el && d.token) el.value = d.token; })
    .catch(() => {});

  const form = document.getElementById('contact-form');
  if (!form) return;

  const errorEl = document.getElementById('contact-form-error');
  const stepInput = form.querySelector('[data-step="input"]');
  const stepConfirm = form.querySelector('[data-step="confirm"]');
  const reviewEl = document.getElementById('cf-review');

  // カスタムセレクト関連
  const customSelect = form.querySelector('[data-custom-select]');
  const trigger = document.getElementById('cf-type-trigger');
  const panel = customSelect ? customSelect.querySelector('.custom-select__panel') : null;
  const selectText = customSelect ? customSelect.querySelector('.custom-select__text') : null;
  const serviceChecks = () => [...form.querySelectorAll('input[name="service[]"]')];

  const confirmBtn = document.getElementById('cf-confirm-btn');
  const backBtn = document.getElementById('cf-back-btn');

  const showError = (msg) => {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const clearError = () => {
    errorEl.hidden = true;
    errorEl.textContent = '';
  };

  // ---- カスタム複数選択ドロップダウン ----
  const selectedServices = () => serviceChecks().filter(c => c.checked).map(c => c.value);

  const updateSelectText = () => {
    if (!selectText) return;
    const sel = selectedServices();
    if (sel.length === 0) {
      selectText.textContent = selectText.dataset.placeholder || '選択してください';
      selectText.classList.remove('is-selected');
    } else {
      selectText.textContent = sel.join('、');
      selectText.classList.add('is-selected');
    }
  };

  const openPanel = () => {
    if (!panel) return;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    customSelect.classList.add('is-open');
  };
  const closePanel = () => {
    if (!panel) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    customSelect.classList.remove('is-open');
  };
  const togglePanel = () => {
    if (panel && panel.hidden) openPanel(); else closePanel();
  };

  if (trigger) {
    trigger.addEventListener('click', togglePanel);
    // チェック変更でプレースホルダ更新
    serviceChecks().forEach(c => c.addEventListener('change', updateSelectText));
    // 外側クリックで閉じる
    document.addEventListener('click', (e) => {
      if (customSelect && !customSelect.contains(e.target)) closePanel();
    });
    // Escで閉じてトリガーへフォーカス
    customSelect.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closePanel(); trigger.focus(); }
    });
    updateSelectText();
  }

  // ---- バリデーション ----
  const validateInput = () => {
    clearError();

    // 種別: 1つ以上選択
    if (selectedServices().length === 0) {
      openPanel();
      showError('お問い合わせ種別を1つ以上お選びください。');
      return false;
    }
    // 必須テキスト項目・pattern等のネイティブ検証
    if (!checkNativeValidity()) {
      return false;
    }
    // メール形式
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.email.focus();
      showError('メールアドレスの形式が正しくありません。');
      return false;
    }
    // 同意
    const consent = form.querySelector('input[name="consent"]');
    if (consent && !consent.checked) {
      consent.focus();
      showError('プライバシーポリシーへの同意が必要です。');
      return false;
    }
    return true;
  };

  // 入力ステップ内の必須項目をネイティブ検証（種別/同意は個別処理済み）
  const checkNativeValidity = () => {
    const targets = ['name', 'kana', 'email', 'tel', 'message'];
    for (const n of targets) {
      const el = form.elements[n];
      if (el && !el.checkValidity()) {
        el.focus();
        showError('未入力・不正な入力があります。項目をご確認ください。');
        return false;
      }
    }
    return true;
  };

  // ---- 確認ビューの組み立て ----
  const buildReview = () => {
    const rows = [
      ['お問い合わせ種別', selectedServices().join('、')],
      ['お名前', form.name.value.trim()],
      ['お名前（ふりがな）', form.kana.value.trim()],
      ['会社名', form.company.value.trim() || '（未入力）'],
      ['メールアドレス', form.email.value.trim()],
      ['お電話番号', form.tel.value.trim()],
      ['お問い合わせ内容', form.message.value.trim()],
    ];
    reviewEl.innerHTML = '';
    rows.forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value; // textContentでエスケープ（XSS対策）
      reviewEl.appendChild(dt);
      reviewEl.appendChild(dd);
    });
  };

  const showConfirm = () => {
    if (!validateInput()) return;
    closePanel();
    buildReview();
    stepInput.hidden = true;
    stepConfirm.hidden = false;
    stepConfirm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showInput = () => {
    stepConfirm.hidden = true;
    stepInput.hidden = false;
    stepInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (confirmBtn) confirmBtn.addEventListener('click', showConfirm);
  if (backBtn) backBtn.addEventListener('click', showInput);

  // ---- 送信 ----
  form.addEventListener('submit', (e) => {
    // 確認ステップ未表示（＝入力中にEnter等）の場合は送信せず確認へ
    if (stepConfirm.hidden) {
      e.preventDefault();
      showConfirm();
      return;
    }
    // Honeypot: 隠し項目が埋まっていればbotとみなし送信中止
    const hp = form.querySelector('input[name="_hp"]');
    if (hp && hp.value) {
      e.preventDefault();
      return;
    }
    // 念のため最終検証（不正なら入力へ戻す）
    if (!validateInput()) {
      e.preventDefault();
      showInput();
    }
    // 問題なければネイティブ送信（contact/submit.php へPOST）
  });
})();
