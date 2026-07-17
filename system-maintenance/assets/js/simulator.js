// 削減シミュレーター
(() => {
  const REDUCTION_RATE = 0.35; // 削減率（15〜50%の範囲で調整可能）
  const AI_RATIO = 0.35;       // AI自動化の内訳割合

  const inputEl = document.getElementById('sim-input');
  const rangeEl = document.getElementById('sim-range');
  const monthlyEl = document.getElementById('sim-monthly');
  const yearlyEl = document.getElementById('sim-yearly');
  const barAi = document.getElementById('sim-bar-ai');
  const barHuman = document.getElementById('sim-bar-human');
  const barEl = document.querySelector('.simulator__bar');

  if (!inputEl || !rangeEl) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const format = (n) => n.toLocaleString('ja-JP', { maximumFractionDigits: 0 });

  const update = (value) => {
    const v = clamp(Number(value) || 0, 10, 300);
    const monthly = v * REDUCTION_RATE;
    const yearly = monthly * 12;
    monthlyEl.innerHTML = `${format(monthly)}<span class="simulator__result-unit">万円</span>`;
    yearlyEl.innerHTML = `${format(yearly)}<span class="simulator__result-unit">万円</span>`;
    const aiPct = Math.round(AI_RATIO * 100);
    const humanPct = 100 - aiPct;
    barAi.style.width = `${aiPct}%`;
    // ラベルはネストされた span に設定（バー自体は aria-hidden のため）
    barAi.querySelector('.simulator__bar-label').textContent = `AI自動化 ${aiPct}%`;
    barHuman.style.width = `${humanPct}%`;
    barHuman.querySelector('.simulator__bar-label').textContent = `エンジニア対応 ${humanPct}%`;
    // スクリーンリーダー向けにバー全体のaria-labelを動的に更新
    if (barEl) {
      barEl.setAttribute('aria-label', `業務割合の内訳：AI自動化 ${aiPct}%、エンジニア対応 ${humanPct}%`);
    }
  };

  inputEl.addEventListener('input', (e) => {
    rangeEl.value = clamp(Number(e.target.value) || 10, 10, 300);
    update(e.target.value);
  });
  rangeEl.addEventListener('input', (e) => {
    inputEl.value = e.target.value;
    update(e.target.value);
  });

  update(inputEl.value);
})();
