// お問い合わせフォーム
(() => {
  // CSRFトークンをサーバーから取得してhidden fieldに注入
  fetch('contact/token.php', { credentials: 'same-origin' })
    .then(r => r.json())
    .then(d => { const el = document.getElementById('cf-csrf'); if (el && d.token) el.value = d.token; })
    .catch(() => {});

  const form = document.getElementById('contact-form');
  const errorEl = document.getElementById('contact-form-error');
  if (!form) return;

  const showError = (msg) => {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const clearError = () => {
    errorEl.hidden = true;
    errorEl.textContent = '';
  };

  form.addEventListener('submit', (e) => {
    clearError();

    // Honeypot check
    if (form.querySelector('[name="_hp"]').value) {
      e.preventDefault();
      return;
    }

    // クライアント側の追加バリデーション
    if (!form.checkValidity()) {
      e.preventDefault();
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        showError('未入力・不正な入力があります。赤枠の項目をご確認ください。');
      }
      return;
    }

    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.preventDefault();
      form.email.focus();
      showError('メールアドレスの形式が正しくありません。');
      return;
    }
  });
})();
