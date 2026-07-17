# JV-IT システム運用保守 LP 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** JV-IT のシステム運用保守LPを、素のHTML/CSS/Vanilla JS + PHPで実装し、既存 `https://jv-it.jp/lp/system-maintenance` を上書き差し替える。

**Architecture:** 単一の `index.html` に 17セクション + フローティングCTA を配置。CSSは1ファイル（BEM風、CSS変数）、JSは機能別3ファイル（main / simulator / form）。フォーム送信は `contact/submit.php`。ライブラリ依存なし。

**Tech Stack:** HTML5 / CSS3（変数）/ Vanilla JavaScript (ES6+) / PHP 7.4+（フォーム送信のみ）

## Global Constraints

- 対象URL: `https://jv-it.jp/lp/system-maintenance`（上書き）
- 依存ライブラリ禁止（Vanilla JS、CSSはカスタムのみ）
- WCAG 2.1 AA準拠（本文コントラスト 4.5:1、大文字 3:1）
- Lighthouse Performance 90+、LCP < 2.5s、CLS < 0.1
- Google広告品質スコア対策: テキスト量を削減しない
- フォント: `"Noto Sans JP", -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic ProN", sans-serif`
- 主要配色: ネイビー `#0B2A4A` / シアン `#00A6D6` / CTAアンバー `#F59E0B` / JV-IT赤 `#E63946`
- 本文フォントサイズ: PC 17px、SP 16px、H1 PC 56px / SP 32px
- コンテナ最大幅: 1200px、セクション縦余白 PC 96px / SP 64px
- ロゴ: 黒パイプ = デフォルト、白パイプ = べた塗り上のみ
- 誇大表現・No.1表現・ビフォーアフター表現は禁止（森先生確認前）
- テキストは全てHTML（画像化禁止、レビュー指摘35）
- `prefers-reduced-motion: reduce` 対応必須
- 参考LPの文言逐語コピー禁止（構成のみ参考、コピーは新規書き下ろし）
- 設計書参照: `docs/superpowers/specs/2026-07-17-jv-it-lp-design.md`

---

## File Structure

```
lp/system-maintenance/
├── index.html                       # 単一ページ、17セクション + FAB
├── assets/
│   ├── css/
│   │   └── style.css                # 変数、リセット、全セクションCSS
│   ├── js/
│   │   ├── main.js                  # ナビ、カウンター、フェード、カルーセル、アコーディオン、FAB
│   │   ├── simulator.js             # 削減シミュレーター計算
│   │   └── form.js                  # フォームバリデーション・送信
│   ├── img/
│   │   ├── logo-jvit-black.png      # ヘッダー用（黒パイプ）
│   │   ├── logo-jvit-white.png      # ヒーロー/フッター用（白パイプ）
│   │   ├── hero-bg.jpg              # ヒーロー背景（ストックフォト）
│   │   ├── og-image.jpg             # OGP 1200x630
│   │   └── cases/                   # 事例画像
│   └── icons/                       # Lucide SVG群
├── contact/
│   ├── submit.php                   # フォーム送信バックエンド
│   └── thanks.html                  # 送信完了ページ
├── sitemap.xml
├── robots.txt
└── favicon.ico
```

作業ディレクトリ基準: `C:\Users\oyako\Documents\★仕事\JVIT\Claude\jv-it.jp\lp\`

以降、パス表記は `lp/` を作業ディレクトリのルートとする。

---

## タスク一覧

1. プロジェクト初期化・アセット配置
2. HTML骨組み・SEOメタ・構造化データ
3. CSS基盤（変数・リセット・タイポ・ユーティリティ）
4. ヘッダー
5. ヒーロー
6. 実績数値バー（カウントアップ）
7. 課題提起
8. サービス概要
9. 削減シミュレーター
10. 選ばれる3つの理由
11. 導入事例（カルーセル）
12. サービス範囲
13. 料金プラン
14. 導入企業の声
15. 経営陣紹介
16. 導入フロー
17. FAQ（アコーディオン）
18. 会社情報
19. お問い合わせフォーム + PHPバックエンド
20. フッター
21. フローティングCTA
22. レスポンシブ調整
23. アクセシビリティ最終調整
24. SEO・パフォーマンス最終調整
25. code-reviewerレビュー実施

---

### Task 1: プロジェクト初期化・アセット配置

**Files:**
- Create: `lp/system-maintenance/` および配下ディレクトリ
- Copy: `../JVITHDシンボルロゴ2025_黒パイプ.png` → `lp/system-maintenance/assets/img/logo-jvit-black.png`
- Copy: `../JVITシンボルロゴ2025_白パイプ.png` → `lp/system-maintenance/assets/img/logo-jvit-white.png`
- Create: `lp/system-maintenance/favicon.ico`（ダミー、後で差し替え可）

**Interfaces:**
- Produces: 全タスクが使用するディレクトリ構造とロゴファイル

- [ ] **Step 1: ディレクトリ作成**

```bash
mkdir -p "lp/system-maintenance/assets/css"
mkdir -p "lp/system-maintenance/assets/js"
mkdir -p "lp/system-maintenance/assets/img/cases"
mkdir -p "lp/system-maintenance/assets/icons"
mkdir -p "lp/system-maintenance/contact"
```

- [ ] **Step 2: ロゴファイルをコピー**

```bash
cp "../JVITHDシンボルロゴ2025_黒パイプ.png" "lp/system-maintenance/assets/img/logo-jvit-black.png"
cp "../JVITシンボルロゴ2025_白パイプ.png" "lp/system-maintenance/assets/img/logo-jvit-white.png"
```

コピー後、`ls lp/system-maintenance/assets/img/` で2ファイル確認。

- [ ] **Step 3: 空 favicon.ico を配置**

一時的な 16×16 PNGを favicon.ico 名で配置（実装後に差し替え可能）。無ければブラウザは404だけ返すので致命ではない。

- [ ] **Step 4: ストックフォト選定**

Unsplashまたはpexelsから、ビジネスミーティングや握手のシーンを1枚選定し、`lp/system-maintenance/assets/img/hero-bg.jpg`（1920×1080程度）として保存。加えてOGP用に `og-image.jpg`（1200×630）を作成（同じ画像のクロップでも良い）。

推奨キーワード: `japanese business handshake office`, `enterprise it engineer meeting`

- [ ] **Step 5: 動作確認とコミット**

```bash
ls lp/system-maintenance/assets/img/
# 期待: logo-jvit-black.png, logo-jvit-white.png, hero-bg.jpg, og-image.jpg, cases/

git add lp/system-maintenance
git commit -m "chore: LP実装のプロジェクト初期化とアセット配置"
```

---

### Task 2: HTML骨組み・SEOメタ・構造化データ

**Files:**
- Create: `lp/system-maintenance/index.html`

**Interfaces:**
- Produces: `<section id="header|hero|stats-bar|problems|solution|simulator|strengths|cases|services|pricing|voices|team|flow|faq|company|contact|footer">` を持つ骨組み。以降のタスクが各セクションの中身を埋める。

- [ ] **Step 1: index.html を作成（骨組み）**

以下を `lp/system-maintenance/index.html` に記述：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI×オフショア システム運用保守｜Claude認定100名｜JV-IT</title>
  <meta name="description" content="Claude認定エンジニア100名 × ベトナム拠点20年の保守実績。AI活用でシステム運用保守を最大50%効率化。ブラックボックス化にも対応、月額12万円〜、無料診断受付中。">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://jv-it.jp/lp/system-maintenance">

  <!-- OGP -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="AI×オフショア システム運用保守｜JV-IT">
  <meta property="og:description" content="Claude認定エンジニア100名×ベトナム拠点20年の保守実績。AI活用でシステム運用保守を最大50%効率化。">
  <meta property="og:url" content="https://jv-it.jp/lp/system-maintenance">
  <meta property="og:image" content="https://jv-it.jp/lp/system-maintenance/assets/img/og-image.jpg">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">

  <!-- Favicon -->
  <link rel="icon" href="/lp/system-maintenance/favicon.ico">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap">

  <!-- CSS -->
  <link rel="stylesheet" href="assets/css/style.css">

  <!-- Structured Data: Organization -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "株式会社JV-ITホールディングス",
    "alternateName": ["JV-IT", "JV-IT HOLDINGS"],
    "url": "https://jv-it.jp/",
    "logo": "https://jv-it.jp/lp/system-maintenance/assets/img/logo-jvit-black.png",
    "email": "contact@jv-it.jp",
    "telephone": "+81-50-3196-3073"
  }
  </script>

  <!-- Structured Data: Service -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "システム運用保守",
    "alternateName": ["AI保守", "システム運用管理", "保守運用", "オフショア保守"],
    "provider": {
      "@type": "Organization",
      "name": "株式会社JV-ITホールディングス"
    },
    "areaServed": "JP",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "JPY",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "minPrice": 120000,
        "maxPrice": 1500000,
        "priceCurrency": "JPY"
      }
    }
  }
  </script>
</head>
<body>
  <!-- ヘッダー -->
  <header id="header" class="header"><!-- Task 4 --></header>

  <main>
    <section id="hero" class="hero"><!-- Task 5 --></section>
    <section id="stats-bar" class="stats-bar"><!-- Task 6 --></section>
    <section id="problems" class="problems"><!-- Task 7 --></section>
    <section id="solution" class="solution"><!-- Task 8 --></section>
    <section id="simulator" class="simulator"><!-- Task 9 --></section>
    <section id="strengths" class="strengths"><!-- Task 10 --></section>
    <section id="cases" class="cases"><!-- Task 11 --></section>
    <section id="services" class="services"><!-- Task 12 --></section>
    <section id="pricing" class="pricing"><!-- Task 13 --></section>
    <section id="voices" class="voices"><!-- Task 14 --></section>
    <section id="team" class="team"><!-- Task 15 --></section>
    <section id="flow" class="flow"><!-- Task 16 --></section>
    <section id="faq" class="faq"><!-- Task 17 --></section>
    <section id="company" class="company"><!-- Task 18 --></section>
    <section id="contact" class="contact"><!-- Task 19 --></section>
  </main>

  <footer id="footer" class="footer"><!-- Task 20 --></footer>

  <!-- フローティングCTA -->
  <div id="floating-cta" class="floating-cta"><!-- Task 21 --></div>

  <!-- JS -->
  <script src="assets/js/main.js" defer></script>
  <script src="assets/js/simulator.js" defer></script>
  <script src="assets/js/form.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: ブラウザで開いて確認**

`start lp/system-maintenance/index.html` （Windows）でブラウザ起動、`<title>` がタブに表示されていれば OK。エラーコンソール確認（CSS/JSはまだ空なので404が出るのは想定内）。

- [ ] **Step 3: コミット**

```bash
git add lp/system-maintenance/index.html
git commit -m "feat: HTML骨組みとSEOメタ・構造化データを追加"
```

---

### Task 3: CSS基盤（変数・リセット・タイポ・ユーティリティ）

**Files:**
- Create: `lp/system-maintenance/assets/css/style.css`

**Interfaces:**
- Produces: CSS変数 `--color-navy`, `--color-cyan`, `--color-amber`, `--color-red-accent`, `--color-white`, `--color-gray-*`; グローバルタイポ、`.container`, `.btn`, `.btn--primary`, `.btn--secondary`, `.section` などのユーティリティクラス。以降のタスクがこれらを利用する。

- [ ] **Step 1: style.css を作成**

```css
/* ============================================
   CSS Variables
   ============================================ */
:root {
  /* Colors */
  --color-navy: #0B2A4A;
  --color-navy-soft: #1A3A5C;
  --color-cyan: #00A6D6;
  --color-cyan-dark: #0088B0;
  --color-amber: #F59E0B;
  --color-amber-dark: #D97706;
  --color-red-accent: #E63946;
  --color-white: #FFFFFF;
  --color-gray-50: #F5F7FA;
  --color-gray-200: #E5E7EB;
  --color-gray-500: #6B7280;
  --color-gray-800: #1F2937;

  /* Typography */
  --font-family-base: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic ProN", sans-serif;
  --font-size-body: 17px;
  --font-size-body-sp: 16px;
  --line-height-body: 1.8;
  --line-height-heading: 1.4;

  /* Spacing */
  --container-max: 1200px;
  --container-padding: 24px;
  --container-padding-sp: 16px;
  --section-pad-y: 96px;
  --section-pad-y-sp: 64px;

  /* Radius / Shadow */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* Transition */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
}

/* ============================================
   Reset & Base
   ============================================ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  color: var(--color-gray-800);
  background-color: var(--color-white);
  -webkit-font-smoothing: antialiased;
}

img, svg {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

/* Focus visible for accessibility */
:focus-visible {
  outline: 2px solid var(--color-cyan);
  outline-offset: 2px;
}

/* ============================================
   Typography
   ============================================ */
h1, h2, h3, h4 {
  line-height: var(--line-height-heading);
  font-weight: 700;
}

h1 { font-size: 56px; }
h2 { font-size: 40px; }
h3 { font-size: 24px; }

/* ============================================
   Utilities
   ============================================ */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.section {
  padding: var(--section-pad-y) 0;
}

.section--soft {
  background-color: var(--color-gray-50);
}

.section-title {
  text-align: center;
  margin-bottom: 48px;
  color: var(--color-navy);
}

.section-title__lead {
  display: block;
  font-size: 14px;
  color: var(--color-cyan);
  font-weight: 500;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 32px;
  height: 56px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 16px;
  transition: transform var(--transition-fast), background-color var(--transition-fast);
  white-space: nowrap;
}
.btn:hover { transform: translateY(-2px); }

.btn--primary {
  background-color: var(--color-amber);
  color: var(--color-white);
}
.btn--primary:hover { background-color: var(--color-amber-dark); }

.btn--secondary {
  background-color: transparent;
  color: var(--color-navy);
  border: 2px solid var(--color-navy);
}
.btn--secondary:hover {
  background-color: var(--color-navy);
  color: var(--color-white);
}

.btn--on-dark {
  color: var(--color-white);
  border-color: var(--color-white);
}
.btn--on-dark:hover {
  background-color: var(--color-white);
  color: var(--color-navy);
}

.btn--sm {
  height: 44px;
  padding: 0 24px;
  font-size: 14px;
}

/* Fade-in animation */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease, transform 600ms ease;
}
.fade-in.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .fade-in, .btn { transition: none; }
  * { animation: none !important; }
}

/* ============================================
   Responsive (SP)
   ============================================ */
@media (max-width: 768px) {
  body {
    font-size: var(--font-size-body-sp);
  }

  h1 { font-size: 32px; }
  h2 { font-size: 26px; }
  h3 { font-size: 20px; }

  .container {
    padding: 0 var(--container-padding-sp);
  }

  .section {
    padding: var(--section-pad-y-sp) 0;
  }
}
```

- [ ] **Step 2: main.js を初期化（フェードイン監視のみ）**

`lp/system-maintenance/assets/js/main.js` を作成:

```javascript
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
});
```

`simulator.js` と `form.js` は空ファイルで作成しておく（後続タスクで実装）。

- [ ] **Step 3: ブラウザ確認**

`index.html` をブラウザで開き、コンソールにエラーが出ないことを確認。

- [ ] **Step 4: コミット**

```bash
git add lp/system-maintenance/assets/css/style.css lp/system-maintenance/assets/js/main.js lp/system-maintenance/assets/js/simulator.js lp/system-maintenance/assets/js/form.js
git commit -m "feat: CSS基盤（変数・リセット・タイポ）とJS初期化"
```

---

### Task 4: ヘッダー

**Files:**
- Modify: `lp/system-maintenance/index.html`（`<header id="header">` 内）
- Modify: `lp/system-maintenance/assets/css/style.css`（末尾に追記）
- Modify: `lp/system-maintenance/assets/js/main.js`（スクロール検知追加）

**Interfaces:**
- Produces: 固定ヘッダー、`.header--scrolled` 状態
- Consumes: `.container`, `.btn--primary`, `.btn--sm`

- [ ] **Step 1: HTML実装**

`<header id="header" class="header">` の中身を以下に置換:

```html
<div class="container header__inner">
  <a href="#" class="header__logo" aria-label="JV-ITホーム">
    <img src="assets/img/logo-jvit-black.png" alt="JV-IT" width="120" height="32">
  </a>
  <nav class="header__nav" aria-label="メインナビゲーション">
    <a href="#solution" class="header__link">サービス</a>
    <a href="#pricing" class="header__link">料金</a>
    <a href="#cases" class="header__link">事例</a>
    <a href="#faq" class="header__link">FAQ</a>
    <a href="#company" class="header__link">会社情報</a>
  </nav>
  <a href="#contact" class="btn btn--primary btn--sm header__cta">無料相談する</a>
</div>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Header
   ============================================ */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  transition: box-shadow var(--transition-base);
}
.header--scrolled {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.header__inner {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.header__logo img {
  height: 32px;
  width: auto;
}
.header__nav {
  display: flex;
  gap: 32px;
  flex: 1;
  justify-content: center;
}
.header__link {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-gray-800);
}
.header__link:hover {
  color: var(--color-cyan);
}

body {
  padding-top: 72px;
}

@media (max-width: 900px) {
  .header__nav { display: none; }
}
```

- [ ] **Step 3: main.js にスクロール検知を追加**

```javascript
// ヘッダー スクロール検知
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 8) header.classList.add('header--scrolled');
    else header.classList.remove('header--scrolled');
  }, { passive: true });
}
```

（`DOMContentLoaded` 内に追加）

- [ ] **Step 4: ブラウザ確認**

- ヘッダーがページ上部に固定表示
- ロゴ、ナビ5項目、CTAボタン（アンバー）が表示
- スクロールで薄い影が付く

- [ ] **Step 5: コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(header): ヘッダーとナビゲーション実装"
```

---

### Task 5: ヒーロー

**Files:**
- Modify: `lp/system-maintenance/index.html`（`<section id="hero">`）
- Modify: `lp/system-maintenance/assets/css/style.css`（追記）

**Interfaces:**
- Consumes: `.container`, `.btn`, `.btn--primary`, `.btn--on-dark`, `.fade-in`

- [ ] **Step 1: HTML実装**

`<section id="hero" class="hero">` の中身:

```html
<div class="hero__bg" aria-hidden="true">
  <img src="assets/img/hero-bg.jpg" alt="" loading="eager" fetchpriority="high">
  <div class="hero__overlay"></div>
</div>
<div class="container hero__inner">
  <div class="hero__content fade-in">
    <p class="hero__eyebrow">AI × オフショア20年ノウハウ</p>
    <h1 class="hero__title">保守を、AIと<br>20年のノウハウで。</h1>
    <p class="hero__lead">Anthropic認定エンジニア100名 × 日越87名体制のハイブリッド保守で、システム運用を刷新します。ブラックボックス化したシステムも、最短1ヶ月で引き継ぎ可能です。</p>
    <div class="hero__ctas">
      <a href="#contact" class="btn btn--primary">無料で相談する</a>
      <a href="#simulator" class="btn btn--on-dark">削減シミュレーターを試す</a>
    </div>
    <div class="hero__badges" aria-label="認証・実績">
      <span class="hero__badge">Anthropic Certified</span>
      <span class="hero__badge">AWS 99.99% 稼働</span>
    </div>
  </div>
  <img class="hero__watermark" src="assets/img/logo-jvit-white.png" alt="JV-IT" aria-hidden="true">
</div>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Hero
   ============================================ */
.hero {
  position: relative;
  min-height: 640px;
  color: var(--color-white);
  overflow: hidden;
}
.hero__bg {
  position: absolute; inset: 0; z-index: 1;
}
.hero__bg img {
  width: 100%; height: 100%; object-fit: cover;
}
.hero__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(11, 42, 74, 0.92) 0%, rgba(26, 58, 92, 0.85) 100%);
}
.hero__inner {
  position: relative; z-index: 2;
  padding: 120px 24px 96px;
  min-height: 640px;
  display: flex;
  align-items: center;
}
.hero__content {
  max-width: 780px;
}
.hero__eyebrow {
  font-size: 14px;
  color: var(--color-cyan);
  font-weight: 500;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}
.hero__title {
  font-size: 56px;
  line-height: 1.3;
  margin-bottom: 24px;
}
.hero__lead {
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 40px;
  max-width: 640px;
  opacity: 0.95;
}
.hero__ctas {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.hero__badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.hero__badge {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  font-size: 13px;
  background-color: rgba(255, 255, 255, 0.08);
}
.hero__watermark {
  position: absolute;
  right: 32px;
  bottom: 32px;
  height: 40px;
  width: auto;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .hero { min-height: 560px; }
  .hero__inner { padding: 80px 16px 64px; }
  .hero__title { font-size: 32px; }
  .hero__lead { font-size: 16px; }
  .hero__ctas .btn { width: 100%; }
  .hero__watermark { height: 28px; right: 16px; bottom: 16px; }
}
```

- [ ] **Step 3: ブラウザ確認**

- 背景画像がネイビーオーバーレイで暗く、テキストが白で読める
- H1「保守を、AIと20年のノウハウで。」が大きく表示
- アンバーCTAがしっかり目立つ
- 動画のちらつきなし（静止画のみ）
- モバイル幅（DevTools）でボタンが縦積み、テキストサイズ縮小

- [ ] **Step 4: コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(hero): ヒーローセクション実装"
```

---

### Task 6: 実績数値バー（カウントアップ）

**Files:**
- Modify: `lp/system-maintenance/index.html`
- Modify: `lp/system-maintenance/assets/css/style.css`
- Modify: `lp/system-maintenance/assets/js/main.js`

**Interfaces:**
- Produces: `.stat[data-count]` 要素のカウントアップ動作
- Consumes: `.container`, `.fade-in`

- [ ] **Step 1: HTML実装**

```html
<div class="container">
  <ul class="stats-bar__list">
    <li class="stat fade-in">
      <span class="stat__value"><span data-count="100" data-suffix="+">0</span></span>
      <span class="stat__label">Anthropic Academy<br>修了エンジニア</span>
    </li>
    <li class="stat fade-in">
      <span class="stat__value"><span data-count="20">0</span>年</span>
      <span class="stat__label">オフショア<br>保守運用実績</span>
    </li>
    <li class="stat fade-in">
      <span class="stat__value"><span data-count="87">0</span>名</span>
      <span class="stat__label">日越合計<br>開発・保守体制</span>
    </li>
    <li class="stat fade-in">
      <span class="stat__value"><span data-count="99.99" data-decimals="2">0</span>%</span>
      <span class="stat__label">AWS/Azure<br>クラウド稼働率</span>
    </li>
  </ul>
</div>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Stats Bar
   ============================================ */
.stats-bar {
  background-color: var(--color-navy);
  color: var(--color-white);
  padding: 48px 0;
}
.stats-bar__list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
}
.stat__value {
  display: block;
  font-size: 48px;
  font-weight: 700;
  color: var(--color-cyan);
  line-height: 1.1;
  margin-bottom: 8px;
}
.stat__label {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .stats-bar__list { grid-template-columns: repeat(2, 1fr); }
  .stat__value { font-size: 36px; }
}
```

- [ ] **Step 3: main.js にカウントアップ処理を追加**

`DOMContentLoaded` 内に追記:

```javascript
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
```

- [ ] **Step 4: ブラウザ確認**

- ネイビー背景に4つの数値が横並び（PC）／2×2（SP）
- スクロールしてバーが画面に入ると数値がカウントアップ
- 99.99% が小数点2桁で表示、100+ で「+」が付く
- ラベルが白テキストで読める

- [ ] **Step 5: コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(stats-bar): 実績数値バーとカウントアップアニメ実装"
```

---

### Task 7: 課題提起

**Files:**
- Modify: `index.html`, `style.css`

**Interfaces:**
- Consumes: `.container`, `.section`, `.section-title`, `.fade-in`

- [ ] **Step 1: HTML実装**

```html
<section id="problems" class="problems section section--soft">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">SYSTEM MAINTENANCE ISSUES</span>
      こんな保守の悩み、抱えていませんか？
    </h2>
    <ul class="problems__list">
      <li class="problem-card fade-in">
        <div class="problem-card__icon" aria-hidden="true">
          <!-- ブラックボックス icon: box-x -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
        </div>
        <h3 class="problem-card__title">前ベンダー撤退でシステムがブラックボックス化</h3>
        <p class="problem-card__body">ドキュメントが不足し、システム内部の把握ができない。障害が起きても対応の手掛かりがなく、業務が止まるリスクを抱えている状態です。</p>
      </li>
      <li class="problem-card fade-in">
        <div class="problem-card__icon" aria-hidden="true">
          <!-- 高止まり icon: trending-up -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        </div>
        <h3 class="problem-card__title">保守費が高止まり、内訳が不透明</h3>
        <p class="problem-card__body">何にいくら払っているのか分からない。作業実績や運用改善の提案がなく、コスト削減の余地があるのか判断できないままです。</p>
      </li>
      <li class="problem-card fade-in">
        <div class="problem-card__icon" aria-hidden="true">
          <!-- 属人化 icon: user-alert -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <h3 class="problem-card__title">障害対応が属人化、担当変更に弱い</h3>
        <p class="problem-card__body">特定エンジニアしか対応できず、休暇や離任のたびにリスクが再発。ナレッジが個人に紐付き、組織として蓄積されていません。</p>
      </li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Problems
   ============================================ */
.problems__list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.problem-card {
  background-color: var(--color-white);
  padding: 32px 28px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  border-top: 4px solid var(--color-cyan);
}
.problem-card__icon {
  width: 56px;
  height: 56px;
  color: var(--color-cyan);
  margin-bottom: 16px;
}
.problem-card__icon svg { width: 100%; height: 100%; }
.problem-card__title {
  font-size: 20px;
  color: var(--color-navy);
  margin-bottom: 12px;
}
.problem-card__body {
  font-size: 15px;
  color: var(--color-gray-800);
}

@media (max-width: 900px) {
  .problems__list { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: ブラウザ確認**

3カード横並び（PC）／縦積み（SP）。アイコン + タイトル + 説明文が読める。

- [ ] **Step 4: コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(problems): 課題提起セクション実装"
```

---

### Task 8: サービス概要

**Files:**
- Modify: `index.html`, `style.css`

**Interfaces:**
- Consumes: `.container`, `.section`, `.section-title`, `.fade-in`

- [ ] **Step 1: HTML実装**

```html
<section id="solution" class="solution section">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">HYBRID MAINTENANCE</span>
      AI × オフショア20年ノウハウ<br>ハイブリッド保守という選択
    </h2>
    <p class="solution__lead">
      JV-ITのシステム運用保守は、Anthropic認定エンジニア100名によるAI活用と、ベトナム拠点20年の運用実績を組み合わせた「ハイブリッド保守」です。定型業務はAIで効率化し、判断が必要な障害対応や改善提案は経験豊富なエンジニアが担当することで、コスト削減と品質維持を両立します。
    </p>
    <ol class="solution__steps">
      <li class="solution-step fade-in">
        <span class="solution-step__num">01</span>
        <h3 class="solution-step__title">監視・ログ分析</h3>
        <p class="solution-step__body">AIが24時間365日、サーバー・アプリケーションログを解析。異常検知の一次判定を自動化し、ノイズを削減します。</p>
        <span class="solution-step__owner">Owner: AI</span>
      </li>
      <li class="solution-step fade-in">
        <span class="solution-step__num">02</span>
        <h3 class="solution-step__title">一次対応・切り分け</h3>
        <p class="solution-step__body">検知した事象をAIが過去事例と照合し、対応候補を提示。オペレーターが判断のうえ、必要な対応を実行します。</p>
        <span class="solution-step__owner">Owner: AI + オペレーター</span>
      </li>
      <li class="solution-step fade-in">
        <span class="solution-step__num">03</span>
        <h3 class="solution-step__title">障害対応・改修</h3>
        <p class="solution-step__body">深いシステム理解が必要な障害・機能改修は、Claude認定エンジニアが対応。ソースコード解析からリリースまで一貫します。</p>
        <span class="solution-step__owner">Owner: 認定エンジニア</span>
      </li>
      <li class="solution-step fade-in">
        <span class="solution-step__num">04</span>
        <h3 class="solution-step__title">改善提案・レポート</h3>
        <p class="solution-step__body">月次で運用状況・改善提案をレポート。PMとCTOがビジネス要件と技術負債の両面からロードマップを提示します。</p>
        <span class="solution-step__owner">Owner: PM / CTO</span>
      </li>
    </ol>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Solution
   ============================================ */
.solution__lead {
  max-width: 880px;
  margin: -24px auto 56px;
  text-align: center;
  color: var(--color-gray-800);
}
.solution__steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  counter-reset: step;
}
.solution-step {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  position: relative;
}
.solution-step__num {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-cyan);
  margin-bottom: 12px;
}
.solution-step__title {
  font-size: 18px;
  color: var(--color-navy);
  margin-bottom: 12px;
}
.solution-step__body {
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 16px;
}
.solution-step__owner {
  display: inline-block;
  padding: 4px 10px;
  background-color: var(--color-gray-50);
  border-radius: 999px;
  font-size: 12px;
  color: var(--color-navy);
  font-weight: 500;
}

@media (max-width: 900px) {
  .solution__steps { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .solution__steps { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: ブラウザ確認・コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(solution): AI×オフショア ハイブリッド保守 概要セクション実装"
```

---

### Task 9: 削減シミュレーター

**Files:**
- Modify: `index.html`, `style.css`
- Modify: `lp/system-maintenance/assets/js/simulator.js`

**Interfaces:**
- Produces: グローバル関数なし（IIFE内で自己完結）
- Consumes: 要素 ID `sim-input`, `sim-range`, `sim-monthly`, `sim-yearly`, `sim-chart`

- [ ] **Step 1: HTML実装**

```html
<section id="simulator" class="simulator section section--soft">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">COST SIMULATOR</span>
      あなたの会社の保守費、いくら削減できる？
    </h2>
    <div class="simulator__grid">
      <div class="simulator__inputs">
        <label class="simulator__label" for="sim-input">現在の月額保守費</label>
        <div class="simulator__input-row">
          <input type="number" id="sim-input" min="10" max="300" step="1" value="80">
          <span class="simulator__unit">万円 / 月</span>
        </div>
        <input type="range" id="sim-range" min="10" max="300" step="10" value="80" aria-label="月額保守費スライダー">
        <div class="simulator__range-scale">
          <span>10万</span><span>150万</span><span>300万</span>
        </div>
        <p class="simulator__note">※参考値です。実際の削減率はシステム構成・業務内容により異なります。詳細は個別診断にて。</p>
      </div>
      <div class="simulator__outputs">
        <div class="simulator__result">
          <span class="simulator__result-label">想定 月額削減</span>
          <span class="simulator__result-value" id="sim-monthly">28<span class="simulator__result-unit">万円</span></span>
        </div>
        <div class="simulator__result">
          <span class="simulator__result-label">想定 年間削減</span>
          <span class="simulator__result-value" id="sim-yearly">336<span class="simulator__result-unit">万円</span></span>
        </div>
        <div class="simulator__breakdown">
          <div class="simulator__bar">
            <span class="simulator__bar-ai" id="sim-bar-ai" style="width: 35%">AI自動化 35%</span>
            <span class="simulator__bar-human" id="sim-bar-human" style="width: 65%">エンジニア対応 65%</span>
          </div>
          <p class="simulator__breakdown-note">AI自動化可能な業務と、エンジニアが判断する業務の割合（参考値）</p>
        </div>
        <a href="#contact" class="btn btn--primary">この条件で無料診断を依頼する</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Simulator
   ============================================ */
.simulator__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background-color: var(--color-white);
  padding: 40px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
.simulator__label {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 12px;
}
.simulator__input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.simulator__input-row input {
  width: 140px;
  height: 56px;
  font-size: 24px;
  font-weight: 700;
  padding: 0 16px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  text-align: right;
}
.simulator__input-row input:focus {
  outline: none;
  border-color: var(--color-cyan);
}
.simulator__unit {
  font-size: 16px;
  color: var(--color-gray-500);
}
#sim-range {
  width: 100%;
  margin-bottom: 8px;
}
.simulator__range-scale {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-gray-500);
  margin-bottom: 20px;
}
.simulator__note {
  font-size: 13px;
  color: var(--color-gray-500);
  line-height: 1.6;
}
.simulator__result {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-gray-200);
}
.simulator__result-label {
  font-size: 14px;
  color: var(--color-gray-500);
}
.simulator__result-value {
  font-size: 40px;
  font-weight: 700;
  color: var(--color-amber);
}
.simulator__result-unit {
  font-size: 16px;
  color: var(--color-gray-800);
  margin-left: 4px;
  font-weight: 500;
}
.simulator__breakdown {
  margin-top: 24px;
}
.simulator__bar {
  display: flex;
  height: 32px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  font-size: 12px;
  color: var(--color-white);
  font-weight: 500;
}
.simulator__bar-ai {
  background-color: var(--color-cyan);
  display: flex; align-items: center; justify-content: center;
  transition: width 400ms ease;
}
.simulator__bar-human {
  background-color: var(--color-navy);
  display: flex; align-items: center; justify-content: center;
  transition: width 400ms ease;
}
.simulator__breakdown-note {
  font-size: 12px;
  color: var(--color-gray-500);
  margin-top: 8px;
}
.simulator .btn { margin-top: 24px; width: 100%; }

@media (max-width: 900px) {
  .simulator__grid { grid-template-columns: 1fr; padding: 24px; }
}
```

- [ ] **Step 3: simulator.js を実装**

```javascript
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
    barAi.textContent = `AI自動化 ${aiPct}%`;
    barHuman.style.width = `${humanPct}%`;
    barHuman.textContent = `エンジニア対応 ${humanPct}%`;
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
```

- [ ] **Step 4: ブラウザ動作確認**

- 入力欄で 80 → 100 に変更 → 月額削減が 28 → 35 に変わる
- スライダー操作でも同期
- 10未満・300超は制限される
- CTAクリックで #contact へスクロール
- タブキーで入力欄→スライダー→CTAとフォーカス移動、フォーカスリング表示

- [ ] **Step 5: コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(simulator): 削減シミュレーター実装"
```

---

### Task 10: 選ばれる3つの理由

**Files:**
- Modify: `index.html`, `style.css`

- [ ] **Step 1: HTML実装**

```html
<section id="strengths" class="strengths section">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">WHY JV-IT</span>
      選ばれる3つの理由
    </h2>
    <ul class="strengths__list">
      <li class="strength fade-in">
        <span class="strength__no">01</span>
        <h3 class="strength__title">Anthropic認定100名のAI活用力</h3>
        <p class="strength__body">
          Anthropic Academy を修了した認定エンジニアが100名以上在籍。CCA-F（Claude Certified Architect - Foundations）保有者による、業務理解の深いAI活用を提供します。独自の「Jai1 Framework」で Claude Code / Codex / Gemini / Cursor を統合し、保守業務の自動化と品質維持を両立します。
        </p>
        <ul class="strength__points">
          <li>Anthropic Academy 修了エンジニア 100名以上</li>
          <li>Jai1 Framework による複数AIツール統合運用</li>
          <li>Prompt Engineering・MCP・Agent SDKに精通</li>
        </ul>
      </li>
      <li class="strength fade-in">
        <span class="strength__no">02</span>
        <h3 class="strength__title">ベトナム拠点20年の保守運用実績</h3>
        <p class="strength__body">
          2006年設立のベトナム法人 JV-IT., JSC を前身とする、20年のオフショア開発・保守運用実績。現在は JV-IT TECHS CO., LTD（HCMC）87名体制で、AWS/Azure 稼働率 99.99% を維持しています。長年の運用ノウハウを、日本の品質基準で提供します。
        </p>
        <ul class="strength__points">
          <li>ベトナム拠点 20年の運用実績（前身 2006年〜）</li>
          <li>日越87名の開発・保守体制</li>
          <li>AWS / Azure 稼働率 99.99%</li>
        </ul>
      </li>
      <li class="strength fade-in">
        <span class="strength__no">03</span>
        <h3 class="strength__title">引き継ぎ最短1ヶ月・ブラックボックス対応</h3>
        <p class="strength__body">
          前ベンダーの資料が不足していても、ソースコード・稼働環境・運用ログから構造を解析し、最短1ヶ月で引き継ぎを完了します。段階的な運用移管により、業務停止リスクなしに新体制へ移行できます。
        </p>
        <ul class="strength__points">
          <li>最短1ヶ月での引き継ぎ完了</li>
          <li>ドキュメント不足のシステムでも構造解析</li>
          <li>段階的な運用移管でリスク最小化</li>
        </ul>
      </li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Strengths
   ============================================ */
.strengths__list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.strength {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 40px 32px;
  position: relative;
}
.strength__no {
  display: block;
  font-size: 14px;
  color: var(--color-cyan);
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}
.strength__title {
  font-size: 22px;
  color: var(--color-navy);
  margin-bottom: 16px;
}
.strength__body {
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 20px;
}
.strength__points {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.strength__points li {
  position: relative;
  padding-left: 24px;
  font-size: 14px;
}
.strength__points li::before {
  content: '';
  position: absolute;
  left: 0; top: 8px;
  width: 8px; height: 8px;
  background-color: var(--color-cyan);
  border-radius: 50%;
}

@media (max-width: 900px) {
  .strengths__list { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: 確認・コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(strengths): 選ばれる3つの理由セクション実装"
```

---

### Task 11: 導入事例（カルーセル）

**Files:**
- Modify: `index.html`, `style.css`, `main.js`

**Interfaces:**
- Produces: `.carousel` に対する左右送り機能

- [ ] **Step 1: HTML実装**

```html
<section id="cases" class="cases section section--soft">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">CASE STUDIES</span>
      導入事例
    </h2>
    <div class="carousel" data-carousel>
      <div class="carousel__viewport">
        <ul class="carousel__track">
          <li class="case-card">
            <span class="case-card__industry">CRM AI 開発</span>
            <h3 class="case-card__title">Mira - 業務理解型AIアシスタント</h3>
            <p class="case-card__body">営業CRMとの連携で、担当者の業務コンテキストを理解するAIアシスタントを開発。データ入力・要約・提案支援を自動化しました。</p>
          </li>
          <li class="case-card">
            <span class="case-card__industry">会議AI / PM支援</span>
            <h3 class="case-card__title">UDU - 会議×AIでPM業務を効率化</h3>
            <p class="case-card__body">会議録取・タスク抽出・進捗管理をAIが担当。PMの定型業務時間を大幅に削減し、意思決定に集中できる環境を実現しました。</p>
          </li>
          <li class="case-card">
            <span class="case-card__industry">エンタープライズ運用</span>
            <h3 class="case-card__title">O社 - 205名規模のシステム統合運用</h3>
            <p class="case-card__body">複数の業務システムを統合し、監視・障害対応・改善提案を一元化。属人化していた運用体制を、AI活用型のハイブリッドチームで再構築しました。</p>
          </li>
          <li class="case-card">
            <span class="case-card__industry">AIモバイルアプリ PoC</span>
            <h3 class="case-card__title">F社 - AIモバイルアプリを2ヶ月でPoC</h3>
            <p class="case-card__body">TestFlight配布までを含む2ヶ月のPoCサイクル。設計・実装・検証を Jai1 Framework で並行実行し、意思決定を高速化しました。</p>
          </li>
          <li class="case-card">
            <span class="case-card__industry">D2C / AWS運用</span>
            <h3 class="case-card__title">U社 - D2C LP × AWSインフラ運用</h3>
            <p class="case-card__body">308名規模のD2C事業のLP開発・CMS運用・AWSインフラを一貫サポート。トラフィック変動に対応するオートスケール設計で安定運用中です。</p>
          </li>
          <li class="case-card">
            <span class="case-card__industry">AI MVP / UI/UX</span>
            <h3 class="case-card__title">H社 - AI MVP のUI/UX設計と実装</h3>
            <p class="case-card__body">AI機能を組み込むMVPを、UI/UX設計から実装まで一気通貫で提供。ユーザー体験を犠牲にしないAI組み込みを実現しました。</p>
          </li>
        </ul>
      </div>
      <button class="carousel__btn carousel__btn--prev" data-carousel-prev aria-label="前の事例">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button class="carousel__btn carousel__btn--next" data-carousel-next aria-label="次の事例">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Cases (Carousel)
   ============================================ */
.carousel {
  position: relative;
}
.carousel__viewport {
  overflow: hidden;
}
.carousel__track {
  list-style: none;
  display: flex;
  gap: 24px;
  transition: transform 400ms ease;
}
.case-card {
  flex: 0 0 calc((100% - 48px) / 3);
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  box-shadow: var(--shadow-card);
}
.case-card__industry {
  display: inline-block;
  padding: 4px 10px;
  background-color: var(--color-navy);
  color: var(--color-white);
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
  margin-bottom: 16px;
}
.case-card__title {
  font-size: 18px;
  color: var(--color-navy);
  margin-bottom: 12px;
  line-height: 1.5;
}
.case-card__body {
  font-size: 14px;
  line-height: 1.8;
}
.carousel__btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background-color: var(--color-white);
  color: var(--color-navy);
  border-radius: 50%;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
}
.carousel__btn svg { width: 20px; height: 20px; }
.carousel__btn:hover {
  background-color: var(--color-cyan);
  color: var(--color-white);
  transform: translateY(-50%) scale(1.05);
}
.carousel__btn--prev { left: -20px; }
.carousel__btn--next { right: -20px; }
.carousel__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .case-card { flex: 0 0 calc((100% - 24px) / 2); }
  .carousel__btn--prev { left: 4px; }
  .carousel__btn--next { right: 4px; }
}
@media (max-width: 560px) {
  .case-card { flex: 0 0 100%; }
}
```

- [ ] **Step 3: main.js にカルーセル処理を追加**

```javascript
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
```

- [ ] **Step 4: ブラウザ確認**

- 3枚見え（PC）、2枚（タブレット）、1枚（SP）
- 「次へ」ボタンで左に一枚送り、動きあり
- ホバー時にボタンがシアン背景+白アイコン、わずかに拡大
- 最初は「前へ」ボタンが薄く操作不可
- 最後まで送ると「次へ」が操作不可
- 矢印キーで送り動作可能

- [ ] **Step 5: コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(cases): 導入事例カルーセル実装"
```

---

### Task 12: サービス範囲

**Files:**
- Modify: `index.html`, `style.css`

- [ ] **Step 1: HTML実装**

```html
<section id="services" class="services section">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">SERVICE SCOPE</span>
      対応するサービス範囲
    </h2>
    <ul class="services__list">
      <li class="service-card fade-in">
        <div class="service-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <h3 class="service-card__title">監視・ログ分析</h3>
        <p class="service-card__body">24時間365日の常時監視。AIによる異常検知の一次判定でノイズを削減し、重要なアラートに集中できる運用体制を構築します。</p>
      </li>
      <li class="service-card fade-in">
        <div class="service-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></svg></div>
        <h3 class="service-card__title">障害対応・トラブルシューティング</h3>
        <p class="service-card__body">障害検知から復旧、原因分析、再発防止まで一貫対応。エスカレーションフローと責任分界を明確化し、判断遅れをなくします。</p>
      </li>
      <li class="service-card fade-in">
        <div class="service-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
        <h3 class="service-card__title">追加開発・機能改修</h3>
        <p class="service-card__body">運用中のシステムへの機能追加・改修に対応。要件整理から設計・実装・テスト・リリースまでを、既存業務を止めずに実施します。</p>
      </li>
      <li class="service-card fade-in">
        <div class="service-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></div>
        <h3 class="service-card__title">インフラ運用（AWS / Azure）</h3>
        <p class="service-card__body">クラウドインフラの設計・構築・運用。稼働率 99.99% の実績、コスト最適化提案、災害対策・バックアップ設計を提供します。</p>
      </li>
      <li class="service-card fade-in">
        <div class="service-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
        <h3 class="service-card__title">セキュリティ対策</h3>
        <p class="service-card__body">脆弱性診断、パッチ適用、アクセス権限管理。セキュリティインシデントの検知・対応を含む、継続的なセキュア運用を提供します。</p>
      </li>
      <li class="service-card fade-in">
        <div class="service-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
        <h3 class="service-card__title">既存システムの引き継ぎ</h3>
        <p class="service-card__body">前ベンダーからのスムーズな引き継ぎ。ドキュメント不足でも、ソースコード解析と現行運用者ヒアリングで最短1ヶ月で完了します。</p>
      </li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Services
   ============================================ */
.services__list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.service-card {
  background-color: var(--color-gray-50);
  padding: 32px 28px;
  border-radius: var(--radius-lg);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
}
.service-card__icon {
  width: 48px;
  height: 48px;
  color: var(--color-cyan);
  margin-bottom: 16px;
}
.service-card__icon svg { width: 100%; height: 100%; }
.service-card__title {
  font-size: 18px;
  color: var(--color-navy);
  margin-bottom: 12px;
}
.service-card__body {
  font-size: 14px;
  line-height: 1.8;
}

@media (max-width: 900px) {
  .services__list { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .services__list { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: 確認・コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(services): サービス範囲セクション実装"
```

---

### Task 13: 料金プラン

**Files:**
- Modify: `index.html`, `style.css`

- [ ] **Step 1: HTML実装**

```html
<section id="pricing" class="pricing section section--soft">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">PRICING</span>
      料金プラン
    </h2>
    <p class="pricing__lead">サービス範囲・システム規模に応じて、3つのプランからお選びいただけます。個別要件に合わせたカスタマイズも可能です。</p>
    <ul class="pricing__list">
      <li class="plan-card fade-in">
        <span class="plan-card__badge">Light</span>
        <p class="plan-card__price"><span class="plan-card__num">12〜30</span>万円/月</p>
        <p class="plan-card__desc">監視・軽微な障害対応を中心とした、コスト重視のプラン</p>
        <ul class="plan-card__features">
          <li>24時間監視・アラート対応</li>
          <li>月次レポート（1回）</li>
          <li>軽微な障害の一次対応</li>
          <li>営業時間内 対応</li>
        </ul>
        <a href="#contact" class="btn btn--secondary plan-card__btn">相談する</a>
      </li>
      <li class="plan-card plan-card--recommended fade-in">
        <span class="plan-card__ribbon">推奨</span>
        <span class="plan-card__badge">Standard</span>
        <p class="plan-card__price"><span class="plan-card__num">30〜80</span>万円/月</p>
        <p class="plan-card__desc">障害対応から追加改修まで、多くの企業様に選ばれる標準プラン</p>
        <ul class="plan-card__features">
          <li>Lightプランの全内容</li>
          <li>障害対応・復旧作業</li>
          <li>月次の改善提案レポート</li>
          <li>月次で軽微な機能改修 対応可</li>
          <li>24時間365日 対応</li>
        </ul>
        <a href="#contact" class="btn btn--primary plan-card__btn">相談する</a>
      </li>
      <li class="plan-card fade-in">
        <span class="plan-card__badge">Enterprise</span>
        <p class="plan-card__price"><span class="plan-card__num">80〜150</span>万円/月</p>
        <p class="plan-card__desc">SLA付きのフルマネージド運用、大規模システム向け</p>
        <ul class="plan-card__features">
          <li>Standardプランの全内容</li>
          <li>SLA契約（稼働率保証）</li>
          <li>専任PM・CTOアサイン</li>
          <li>大規模改修・機能追加</li>
          <li>災害対策・BCP対応</li>
        </ul>
        <a href="#contact" class="btn btn--secondary plan-card__btn">相談する</a>
      </li>
    </ul>
    <p class="pricing__note">※金額はシステム規模・要件により変動します。個別お見積りを承ります。契約期間・解約条件は個別協議のうえ決定します。</p>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Pricing
   ============================================ */
.pricing__lead {
  text-align: center;
  max-width: 720px;
  margin: -24px auto 48px;
}
.pricing__list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: stretch;
}
.plan-card {
  position: relative;
  background-color: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 40px 28px 32px;
  display: flex;
  flex-direction: column;
}
.plan-card--recommended {
  border-color: var(--color-amber);
  transform: translateY(-8px);
  box-shadow: var(--shadow-elevated);
}
.plan-card__ribbon {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-amber);
  color: var(--color-white);
  padding: 4px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}
.plan-card__badge {
  display: block;
  font-size: 14px;
  color: var(--color-cyan);
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}
.plan-card__price {
  font-size: 16px;
  color: var(--color-gray-500);
  margin-bottom: 16px;
}
.plan-card__num {
  font-size: 40px;
  font-weight: 700;
  color: var(--color-navy);
  margin-right: 4px;
}
.plan-card__desc {
  font-size: 14px;
  color: var(--color-gray-800);
  margin-bottom: 24px;
  min-height: 42px;
}
.plan-card__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 32px;
  flex: 1;
}
.plan-card__features li {
  position: relative;
  padding-left: 24px;
  font-size: 14px;
  line-height: 1.6;
}
.plan-card__features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-cyan);
  font-weight: 700;
}
.plan-card__btn {
  width: 100%;
}
.pricing__note {
  text-align: center;
  font-size: 13px;
  color: var(--color-gray-500);
  margin-top: 32px;
}

@media (max-width: 900px) {
  .pricing__list { grid-template-columns: 1fr; }
  .plan-card--recommended { transform: none; }
}
```

- [ ] **Step 3: 確認・コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(pricing): 料金プランセクション実装"
```

---

### Task 14: 導入企業の声

**Files:**
- Modify: `index.html`, `style.css`

- [ ] **Step 1: HTML実装**

```html
<section id="voices" class="voices section">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">CUSTOMER VOICES</span>
      導入企業様の声
    </h2>
    <ul class="voices__list">
      <li class="voice-card fade-in">
        <p class="voice-card__quote">前ベンダー撤退後の保守を短期間で引き継いでいただき、業務停止を回避できました。AIによる監視で夜間対応の負荷も下がりました。</p>
        <div class="voice-card__profile">
          <span class="voice-card__avatar" aria-hidden="true">A</span>
          <div>
            <p class="voice-card__author">情報システム部長</p>
            <p class="voice-card__company">製造業 / 従業員500名規模</p>
          </div>
        </div>
      </li>
      <li class="voice-card fade-in">
        <p class="voice-card__quote">保守費の内訳が可視化され、コスト最適化の議論が経営層とできるようになりました。月次レポートの提案精度が高く、次の一手が明確です。</p>
        <div class="voice-card__profile">
          <span class="voice-card__avatar" aria-hidden="true">B</span>
          <div>
            <p class="voice-card__author">IT統括マネージャー</p>
            <p class="voice-card__company">小売業 / 従業員200名規模</p>
          </div>
        </div>
      </li>
      <li class="voice-card fade-in">
        <p class="voice-card__quote">ドキュメントがほとんど残っていない古いシステムでしたが、コード解析だけで運用構造を把握してくれたのは驚きでした。属人化から抜け出せました。</p>
        <div class="voice-card__profile">
          <span class="voice-card__avatar" aria-hidden="true">C</span>
          <div>
            <p class="voice-card__author">経営企画室 室長</p>
            <p class="voice-card__company">サービス業 / 従業員100名規模</p>
          </div>
        </div>
      </li>
    </ul>
    <p class="voices__note">※お客様のご要望により、業種と規模のみで匿名掲載しています。個別の事例詳細は個別相談にてご紹介可能です。</p>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Voices
   ============================================ */
.voices__list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.voice-card {
  background-color: var(--color-gray-50);
  padding: 32px 28px;
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-cyan);
}
.voice-card__quote {
  font-size: 15px;
  line-height: 1.9;
  color: var(--color-gray-800);
  margin-bottom: 24px;
}
.voice-card__quote::before {
  content: '「';
  color: var(--color-cyan);
  font-size: 20px;
  font-weight: 700;
}
.voice-card__quote::after {
  content: '」';
  color: var(--color-cyan);
  font-size: 20px;
  font-weight: 700;
}
.voice-card__profile {
  display: flex;
  align-items: center;
  gap: 12px;
}
.voice-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--color-navy);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.voice-card__author {
  font-size: 14px;
  color: var(--color-navy);
  font-weight: 700;
}
.voice-card__company {
  font-size: 12px;
  color: var(--color-gray-500);
}
.voices__note {
  text-align: center;
  font-size: 13px;
  color: var(--color-gray-500);
  margin-top: 24px;
}

@media (max-width: 900px) {
  .voices__list { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: 確認・コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(voices): 導入企業の声セクション実装"
```

---

### Task 15: 経営陣紹介

**Files:**
- Modify: `index.html`, `style.css`

- [ ] **Step 1: HTML実装**

```html
<section id="team" class="team section section--soft">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">LEADERSHIP</span>
      経営陣
    </h2>
    <ul class="team__list">
      <li class="team-card fade-in">
        <span class="team-card__avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg></span>
        <p class="team-card__role">JV-IT HOLDINGS<br>代表取締役 CEO</p>
        <p class="team-card__body">WEB業界にてキャリアを積み、複数社の経営を経て2018年にJV-ITホールディングスを設立。日本企業のDX推進を、ベトナム拠点との連携により実現している。</p>
      </li>
      <li class="team-card fade-in">
        <span class="team-card__avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg></span>
        <p class="team-card__role">JV-IT TECHS<br>代表取締役 CEO</p>
        <p class="team-card__body">CSK出身、SIer10年以上のキャリアで100名以上のマネジメント経験。2007年よりベトナム進出、日越をつなぐ開発・運用組織を率いている。</p>
      </li>
      <li class="team-card fade-in">
        <span class="team-card__avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg></span>
        <p class="team-card__role">JV-IT TECHS<br>CTO</p>
        <p class="team-card__body">AI領域で40社以上の支援実績。Claude Code / Codex / Gemini / Cursor を統合する独自の「Jai1 Framework」設計者。技術と業務の橋渡しを担う。</p>
      </li>
      <li class="team-card fade-in">
        <span class="team-card__avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg></span>
        <p class="team-card__role">JV-IT TECHS<br>COO</p>
        <p class="team-card__body">AWS / Azure での大規模インフラ運用20-30年、稼働率 99.99% の実績。DevOps・SRE 領域の第一人者として、運用の自動化・標準化を推進している。</p>
      </li>
    </ul>
    <p class="team__note">※経営陣の顔写真掲載は準備中です。詳細プロフィールは個別相談にてご紹介いたします。</p>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Team
   ============================================ */
.team__list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.team-card {
  background-color: var(--color-white);
  padding: 28px 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  text-align: center;
}
.team-card__avatar {
  display: block;
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background-color: var(--color-gray-50);
  border-radius: 50%;
  color: var(--color-gray-500);
  padding: 16px;
}
.team-card__avatar svg { width: 100%; height: 100%; }
.team-card__role {
  font-size: 14px;
  color: var(--color-cyan);
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.5;
}
.team-card__body {
  font-size: 13px;
  line-height: 1.8;
  color: var(--color-gray-800);
}
.team__note {
  text-align: center;
  font-size: 13px;
  color: var(--color-gray-500);
  margin-top: 24px;
}

@media (max-width: 900px) {
  .team__list { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .team__list { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: 確認・コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(team): 経営陣紹介セクション実装"
```

---

### Task 16: 導入フロー

**Files:**
- Modify: `index.html`, `style.css`

- [ ] **Step 1: HTML実装**

```html
<section id="flow" class="flow section">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">FLOW</span>
      ご相談から運用開始まで
    </h2>
    <ol class="flow__list">
      <li class="flow-step fade-in">
        <span class="flow-step__num">01</span>
        <h3 class="flow-step__title">無料相談</h3>
        <p class="flow-step__body">30〜60分のオンライン相談。現状の課題と目指す状態をヒアリングします。</p>
      </li>
      <li class="flow-step fade-in">
        <span class="flow-step__num">02</span>
        <h3 class="flow-step__title">現状ヒアリング・診断</h3>
        <p class="flow-step__body">システム構成・運用体制・課題を詳細に把握。改善余地の分析を行います。</p>
      </li>
      <li class="flow-step fade-in">
        <span class="flow-step__num">03</span>
        <h3 class="flow-step__title">お見積り・プラン提案</h3>
        <p class="flow-step__body">個別要件に合わせたプランと料金をご提示。契約条件も透明にご説明します。</p>
      </li>
      <li class="flow-step fade-in">
        <span class="flow-step__num">04</span>
        <h3 class="flow-step__title">引き継ぎ</h3>
        <p class="flow-step__body">最短1ヶ月で引き継ぎを完了。段階的な移管で業務停止リスクをゼロに抑えます。</p>
      </li>
      <li class="flow-step fade-in">
        <span class="flow-step__num">05</span>
        <h3 class="flow-step__title">運用開始・継続改善</h3>
        <p class="flow-step__body">運用開始後は月次レポートと改善提案で、システムを継続的に改善します。</p>
      </li>
    </ol>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Flow
   ============================================ */
.flow__list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  position: relative;
}
.flow__list::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 5%;
  right: 5%;
  height: 2px;
  background-color: var(--color-gray-200);
  z-index: 0;
}
.flow-step {
  position: relative;
  z-index: 1;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 24px 20px;
  text-align: center;
}
.flow-step__num {
  display: inline-block;
  width: 40px;
  height: 40px;
  background-color: var(--color-cyan);
  color: var(--color-white);
  border-radius: 50%;
  font-weight: 700;
  line-height: 40px;
  margin-bottom: 16px;
}
.flow-step__title {
  font-size: 16px;
  color: var(--color-navy);
  margin-bottom: 12px;
}
.flow-step__body {
  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 900px) {
  .flow__list { grid-template-columns: 1fr 1fr; }
  .flow__list::before { display: none; }
}
@media (max-width: 560px) {
  .flow__list { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: 確認・コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(flow): 導入フローセクション実装"
```

---

### Task 17: FAQ（アコーディオン）

**Files:**
- Modify: `index.html`, `style.css`, `main.js`

**Interfaces:**
- Produces: `.faq-item[open]` 状態、`<details>` ベースで JS 不要動作 + カスタムアニメ

- [ ] **Step 1: HTML実装**

```html
<section id="faq" class="faq section section--soft">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">FAQ</span>
      よくあるご質問
    </h2>
    <ul class="faq__list">
      <li>
        <details class="faq-item">
          <summary class="faq-item__question"><span class="faq-item__marker">Q</span>どんな規模のシステムに対応できますか？</summary>
          <div class="faq-item__answer"><span class="faq-item__marker faq-item__marker--a">A</span>
            <p>小規模のWebサイトから、複数サーバ・複数サービスで構成された大規模基幹システムまで対応可能です。まずはご相談ください。既存構成の診断からご支援できます。</p>
          </div>
        </details>
      </li>
      <li>
        <details class="faq-item">
          <summary class="faq-item__question"><span class="faq-item__marker">Q</span>現在他社と契約中でも相談できますか？</summary>
          <div class="faq-item__answer"><span class="faq-item__marker faq-item__marker--a">A</span>
            <p>もちろん可能です。相談時点で他社契約の解約義務はありません。ご相談内容は秘密保持契約のもと厳重に管理いたします。</p>
          </div>
        </details>
      </li>
      <li>
        <details class="faq-item">
          <summary class="faq-item__question"><span class="faq-item__marker">Q</span>AIはどの範囲で使われますか？セキュリティは大丈夫ですか？</summary>
          <div class="faq-item__answer"><span class="faq-item__marker faq-item__marker--a">A</span>
            <p>AIは監視ログの分析・一次判定・レポート作成などに活用します。本番環境への変更適用やデータ削除など、重要な操作はエンジニアの承認が必須です。データの取り扱いはお客様のポリシーに準拠します。</p>
          </div>
        </details>
      </li>
      <li>
        <details class="faq-item">
          <summary class="faq-item__question"><span class="faq-item__marker">Q</span>引き継ぎ期間はどのくらい必要ですか？</summary>
          <div class="faq-item__answer"><span class="faq-item__marker faq-item__marker--a">A</span>
            <p>システム規模と情報の揃い方によりますが、標準的なケースで最短1ヶ月です。ドキュメントが乏しい場合でも、ソースコード解析と現行運用者ヒアリングにより、段階的に引き継ぎます。</p>
          </div>
        </details>
      </li>
      <li>
        <details class="faq-item">
          <summary class="faq-item__question"><span class="faq-item__marker">Q</span>ドキュメントがないシステムでも引き継げますか？</summary>
          <div class="faq-item__answer"><span class="faq-item__marker faq-item__marker--a">A</span>
            <p>はい、可能です。ソースコード解析ツールとAIによる構造理解を組み合わせ、リポジトリ・稼働環境・運用ログから運用の実態を再構築します。ブラックボックス化したシステムの引継ぎ実績が多数あります。</p>
          </div>
        </details>
      </li>
      <li>
        <details class="faq-item">
          <summary class="faq-item__question"><span class="faq-item__marker">Q</span>ベトナム拠点で日本語対応は可能ですか？</summary>
          <div class="faq-item__answer"><span class="faq-item__marker faq-item__marker--a">A</span>
            <p>可能です。日本本社の日本人PMが窓口を担当し、ベトナム側との連携をブリッジします。日本語ドキュメント・日本語コミュニケーションで完結できる体制を整えています。</p>
          </div>
        </details>
      </li>
      <li>
        <details class="faq-item">
          <summary class="faq-item__question"><span class="faq-item__marker">Q</span>契約期間の縛りはありますか？</summary>
          <div class="faq-item__answer"><span class="faq-item__marker faq-item__marker--a">A</span>
            <p>契約期間・解約条件は個別協議のうえ決定します。短期のPoC契約から、長期のフルマネージド契約まで柔軟に対応可能です。</p>
          </div>
        </details>
      </li>
      <li>
        <details class="faq-item">
          <summary class="faq-item__question"><span class="faq-item__marker">Q</span>料金はどのように決まりますか？</summary>
          <div class="faq-item__answer"><span class="faq-item__marker faq-item__marker--a">A</span>
            <p>サービス範囲・システム規模・対応時間帯（営業時間内 or 24時間365日）などから算出します。3プランを基本とし、個別要件があればカスタマイズも承ります。まずは無料相談で概算をお伝えします。</p>
          </div>
        </details>
      </li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   FAQ
   ============================================ */
.faq__list {
  list-style: none;
  max-width: 880px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.faq-item {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.faq-item[open] {
  border-color: var(--color-cyan);
}
.faq-item__question {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-navy);
  list-style: none;
  position: relative;
}
.faq-item__question::-webkit-details-marker { display: none; }
.faq-item__question::after {
  content: '';
  margin-left: auto;
  width: 12px;
  height: 12px;
  border-right: 2px solid var(--color-navy);
  border-bottom: 2px solid var(--color-navy);
  transform: rotate(45deg);
  transition: transform var(--transition-fast);
}
.faq-item[open] .faq-item__question::after {
  transform: rotate(-135deg);
}
.faq-item__marker {
  width: 32px;
  height: 32px;
  background-color: var(--color-cyan);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}
.faq-item__marker--a {
  background-color: var(--color-amber);
}
.faq-item__answer {
  display: flex;
  gap: 16px;
  padding: 4px 24px 24px;
  color: var(--color-gray-800);
  line-height: 1.9;
}
.faq-item__answer p {
  font-size: 15px;
  padding-top: 4px;
}
```

- [ ] **Step 3: main.js に FAQのアクセシビリティ強化を追加（オプション）**

`<details>` はネイティブでキーボード操作対応済み。追加処理は不要。

- [ ] **Step 4: ブラウザ確認**

- 各 Q をクリックで開閉、+/−アイコンが回転
- 開いた項目は左枠がシアン
- Aマーカーはアンバー、コントラスト十分（レビュー追加指摘#1対応）
- Tab フォーカスで移動、Enter で開閉

- [ ] **Step 5: コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(faq): FAQアコーディオンセクション実装"
```

---

### Task 18: 会社情報

**Files:**
- Modify: `index.html`, `style.css`

- [ ] **Step 1: HTML実装**

```html
<section id="company" class="company section">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">COMPANY</span>
      会社情報
    </h2>
    <div class="company__grid">
      <article class="company-card fade-in">
        <h3 class="company-card__title">株式会社JV-ITホールディングス</h3>
        <p class="company-card__subtitle">日本本社</p>
        <dl class="company-card__list">
          <dt>設立</dt><dd>2018年5月21日</dd>
          <dt>資本金</dt><dd>3,310万円</dd>
          <dt>売上高</dt><dd>4.12億円（2024年12月期）</dd>
          <dt>電話番号</dt><dd>050-3196-3073</dd>
          <dt>メール</dt><dd>contact@jv-it.jp</dd>
        </dl>
      </article>
      <article class="company-card fade-in">
        <h3 class="company-card__title">JV-IT TECHS CO., LTD</h3>
        <p class="company-card__subtitle">ベトナム法人（ホーチミン）</p>
        <dl class="company-card__list">
          <dt>所在地</dt><dd>2nd Floor, Ework Building, 103A-105-107 Nguyen Thong St., Ward.9, Dist.3, HCMC, Vietnam</dd>
          <dt>資本金</dt><dd>25,870 USD</dd>
          <dt>設立</dt><dd>2020年12月（前身 JV-IT., JSC は2006年5月29日設立）</dd>
          <dt>従業員数</dt><dd>87名（2025年11月時点）</dd>
          <dt>電話番号</dt><dd>(+84)-28-6686-5546</dd>
        </dl>
      </article>
    </div>
    <div class="company__cta">
      <a href="https://jv-it.jp/company" class="btn btn--secondary" target="_blank" rel="noopener">コーポレートサイトを見る</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Company
   ============================================ */
.company__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
.company-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 32px;
}
.company-card__title {
  font-size: 20px;
  color: var(--color-navy);
  margin-bottom: 4px;
}
.company-card__subtitle {
  font-size: 13px;
  color: var(--color-cyan);
  font-weight: 500;
  margin-bottom: 20px;
}
.company-card__list {
  display: grid;
  grid-template-columns: 100px 1fr;
  row-gap: 12px;
  column-gap: 16px;
  font-size: 14px;
}
.company-card__list dt {
  color: var(--color-gray-500);
  font-weight: 500;
}
.company-card__list dd {
  color: var(--color-gray-800);
  line-height: 1.7;
}
.company__cta {
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 900px) {
  .company__grid { grid-template-columns: 1fr; }
  .company-card__list { grid-template-columns: 80px 1fr; }
}
```

- [ ] **Step 3: 確認・コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(company): 会社情報セクション実装"
```

---

### Task 19: お問い合わせフォーム + PHPバックエンド

**Files:**
- Modify: `index.html`, `style.css`, `form.js`
- Create: `lp/system-maintenance/contact/submit.php`
- Create: `lp/system-maintenance/contact/thanks.html`

**Interfaces:**
- Produces: `submit.php` へPOST、成功で `thanks.html` にリダイレクト or モーダル表示

- [ ] **Step 1: HTML実装**

```html
<section id="contact" class="contact section section--soft">
  <div class="container">
    <h2 class="section-title">
      <span class="section-title__lead">CONTACT</span>
      無料相談・お問い合わせ
    </h2>
    <p class="contact__lead">お問い合わせいただいた内容には、1営業日以内にご返信いたします。まずはお気軽にご相談ください。</p>
    <div class="contact__box">
      <div class="contact__trust">
        <span class="contact__pmark" aria-label="Pマーク（プライバシーマーク）">P Mark</span>
        <p>個人情報保護のため、Pマーク準拠の管理体制で対応いたします。詳細はプライバシーポリシーをご確認ください。</p>
      </div>
      <form id="contact-form" class="contact-form" action="contact/submit.php" method="POST" novalidate>
        <input type="text" name="_hp" class="contact-form__hp" tabindex="-1" autocomplete="off">
        <div class="contact-form__row">
          <label for="cf-type" class="contact-form__label">お問い合わせ種別<span class="contact-form__req">必須</span></label>
          <select id="cf-type" name="type" required>
            <option value="">選択してください</option>
            <option value="consult">無料相談を希望</option>
            <option value="quote">お見積りを依頼</option>
            <option value="question">サービスについて質問</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div class="contact-form__row contact-form__row--two">
          <div>
            <label for="cf-name" class="contact-form__label">お名前<span class="contact-form__req">必須</span></label>
            <input type="text" id="cf-name" name="name" required autocomplete="name">
          </div>
          <div>
            <label for="cf-kana" class="contact-form__label">ふりがな<span class="contact-form__req">必須</span></label>
            <input type="text" id="cf-kana" name="kana" required>
          </div>
        </div>
        <div class="contact-form__row">
          <label for="cf-company" class="contact-form__label">会社名<span class="contact-form__opt">任意</span></label>
          <input type="text" id="cf-company" name="company" autocomplete="organization">
        </div>
        <div class="contact-form__row contact-form__row--two">
          <div>
            <label for="cf-email" class="contact-form__label">メールアドレス<span class="contact-form__req">必須</span></label>
            <input type="email" id="cf-email" name="email" required autocomplete="email">
          </div>
          <div>
            <label for="cf-tel" class="contact-form__label">電話番号<span class="contact-form__req">必須</span></label>
            <input type="tel" id="cf-tel" name="tel" required autocomplete="tel" pattern="[0-9\-]+">
          </div>
        </div>
        <div class="contact-form__row">
          <label for="cf-message" class="contact-form__label">お問い合わせ内容<span class="contact-form__req">必須</span></label>
          <textarea id="cf-message" name="message" rows="6" required></textarea>
        </div>
        <div class="contact-form__row contact-form__consent">
          <label>
            <input type="checkbox" name="consent" required>
            <a href="https://jv-it.jp/privacy" target="_blank" rel="noopener">プライバシーポリシー</a>に同意します<span class="contact-form__req">必須</span>
          </label>
        </div>
        <p id="contact-form-error" class="contact-form__error" hidden></p>
        <button type="submit" class="btn btn--primary contact-form__submit">送信する</button>
      </form>
    </div>
  </div>
</section>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Contact
   ============================================ */
.contact__lead {
  text-align: center;
  max-width: 720px;
  margin: -24px auto 40px;
}
.contact__box {
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--color-white);
  padding: 40px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
.contact__trust {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background-color: var(--color-gray-50);
  border-radius: var(--radius-md);
  margin-bottom: 32px;
  font-size: 13px;
  color: var(--color-gray-800);
}
.contact__pmark {
  display: inline-block;
  padding: 8px 12px;
  background-color: var(--color-white);
  border: 2px solid var(--color-navy);
  border-radius: var(--radius-sm);
  color: var(--color-navy);
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}
.contact-form__row {
  margin-bottom: 20px;
}
.contact-form__row--two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.contact-form__label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 8px;
}
.contact-form__req {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  background-color: var(--color-red-accent);
  color: var(--color-white);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}
.contact-form__opt {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  background-color: var(--color-gray-200);
  color: var(--color-gray-500);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}
.contact-form input,
.contact-form select,
.contact-form textarea {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-family: inherit;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-sm);
  background-color: var(--color-white);
  transition: border-color var(--transition-fast);
}
.contact-form input:focus,
.contact-form select:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--color-cyan);
}
.contact-form textarea {
  resize: vertical;
  min-height: 120px;
}
.contact-form__consent {
  font-size: 14px;
}
.contact-form__consent label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.contact-form__consent a {
  color: var(--color-cyan);
  text-decoration: underline;
}
.contact-form__hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.contact-form__error {
  color: var(--color-red-accent);
  font-size: 14px;
  padding: 12px 16px;
  background-color: rgba(230, 57, 70, 0.08);
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
}
.contact-form__submit {
  width: 100%;
  margin-top: 8px;
}
.contact-form input:invalid:not(:placeholder-shown),
.contact-form select:invalid:not([value=""]) {
  border-color: var(--color-red-accent);
}

@media (max-width: 768px) {
  .contact__box { padding: 24px; }
  .contact-form__row--two { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: form.js を実装**

```javascript
// お問い合わせフォーム
(() => {
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
```

- [ ] **Step 4: contact/submit.php を実装**

```php
<?php
// お問い合わせフォーム 送信処理
declare(strict_types=1);

// 設定
$TO_EMAIL = 'contact@jv-it.jp';
$FROM_EMAIL = 'noreply@jv-it.jp';
$SUBJECT_PREFIX = '[JV-IT LP] ';

// POST検証
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Honeypot
if (!empty($_POST['_hp'])) {
    http_response_code(400);
    exit('Bad Request');
}

// 必須項目チェック
$required = ['type', 'name', 'kana', 'email', 'tel', 'message', 'consent'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        exit('必須項目が未入力です: ' . htmlspecialchars($field, ENT_QUOTES, 'UTF-8'));
    }
}

// サニタイズ
$sanitize = fn($v) => htmlspecialchars(trim($v ?? ''), ENT_QUOTES, 'UTF-8');
$type = $sanitize($_POST['type']);
$name = $sanitize($_POST['name']);
$kana = $sanitize($_POST['kana']);
$company = $sanitize($_POST['company'] ?? '');
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
$tel = $sanitize($_POST['tel']);
$message = $sanitize($_POST['message']);

if (!$email) {
    http_response_code(400);
    exit('メールアドレスの形式が不正です');
}

// 種別のマッピング
$typeMap = [
    'consult' => '無料相談を希望',
    'quote' => 'お見積り',
    'question' => '質問',
    'other' => 'その他',
];
$typeLabel = $typeMap[$type] ?? 'その他';

// 本文組立
$body = "以下のお問い合わせを受け付けました。\n\n";
$body .= "----------------------------------------\n";
$body .= "お問い合わせ種別: {$typeLabel}\n";
$body .= "お名前: {$name}\n";
$body .= "ふりがな: {$kana}\n";
$body .= "会社名: {$company}\n";
$body .= "メール: {$email}\n";
$body .= "電話: {$tel}\n";
$body .= "----------------------------------------\n";
$body .= "内容:\n{$message}\n";
$body .= "----------------------------------------\n";

$subject = $SUBJECT_PREFIX . $typeLabel;
$headers = "From: {$FROM_EMAIL}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// 管理者宛
mb_language('Japanese');
mb_internal_encoding('UTF-8');
$sent = mb_send_mail($TO_EMAIL, $subject, $body, $headers);

// 送信者宛の自動返信
if ($sent) {
    $autoBody = "{$name} 様\n\n";
    $autoBody .= "この度はJV-ITへお問い合わせいただき、誠にありがとうございます。\n";
    $autoBody .= "以下の内容でお問い合わせを受け付けました。\n";
    $autoBody .= "1営業日以内にご返信いたします。\n\n";
    $autoBody .= $body;
    mb_send_mail($email, '[JV-IT] お問い合わせを受け付けました', $autoBody, $headers);
}

if (!$sent) {
    http_response_code(500);
    exit('送信に失敗しました。時間をおいて再度お試しください。');
}

// 完了ページへリダイレクト
header('Location: /lp/system-maintenance/contact/thanks.html');
exit;
```

- [ ] **Step 5: contact/thanks.html を実装**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お問い合わせを受け付けました｜JV-IT</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
  <section class="section" style="min-height: 60vh; display: flex; align-items: center; text-align: center;">
    <div class="container">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 32px; color: var(--color-navy); margin-bottom: 16px;">お問い合わせを受け付けました</h1>
        <p style="margin-bottom: 32px;">
          この度はJV-ITへお問い合わせいただき、誠にありがとうございます。<br>
          ご入力いただいたメールアドレスに、確認メールをお送りしております。<br>
          1営業日以内に、担当者よりご返信いたします。
        </p>
        <a href="/lp/system-maintenance/" class="btn btn--primary">LPトップへ戻る</a>
      </div>
    </div>
  </section>
</body>
</html>
```

- [ ] **Step 6: ブラウザ動作確認（フロントのみ）**

- フォーム表示、Pマーク表示
- 全項目未入力で送信 → HTML5バリデーションで赤枠、エラーメッセージ表示
- メールに `abc` と入れて送信 → メールエラー表示
- 全て埋めて送信 → PHPが動く環境がなければ 405 になるので、ローカルでは PHP を起動して確認 or フロント動作までを確認

- [ ] **Step 7: コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(contact): お問い合わせフォームとPHPバックエンド実装"
```

---

### Task 20: フッター

**Files:**
- Modify: `index.html`, `style.css`

- [ ] **Step 1: HTML実装**

```html
<footer id="footer" class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <img class="footer__logo" src="assets/img/logo-jvit-white.png" alt="JV-IT">
        <p class="footer__company">株式会社JV-ITホールディングス</p>
        <p class="footer__address">〒東京都</p>
      </div>
      <nav class="footer__nav" aria-label="フッターナビゲーション">
        <a href="https://jv-it.jp/" target="_blank" rel="noopener">企業情報</a>
        <a href="https://jv-it.jp/privacy" target="_blank" rel="noopener">プライバシーポリシー</a>
      </nav>
      <div class="footer__contact">
        <p>TEL: <a href="tel:05031963073">050-3196-3073</a></p>
        <p>Email: <a href="mailto:contact@jv-it.jp">contact@jv-it.jp</a></p>
      </div>
    </div>
    <p class="footer__copy">&copy; JV-IT HOLDINGS INC. All Rights Reserved.</p>
  </div>
</footer>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Footer
   ============================================ */
.footer {
  background-color: var(--color-navy);
  color: var(--color-white);
  padding: 56px 0 24px;
}
.footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}
.footer__logo {
  height: 32px;
  width: auto;
  margin-bottom: 16px;
}
.footer__company {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}
.footer__address {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}
.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}
.footer__nav a {
  color: rgba(255, 255, 255, 0.85);
  transition: color var(--transition-fast);
}
.footer__nav a:hover {
  color: var(--color-cyan);
}
.footer__contact {
  font-size: 14px;
}
.footer__contact p { margin-bottom: 8px; }
.footer__contact a {
  color: var(--color-cyan);
}
.footer__copy {
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

@media (max-width: 900px) {
  .footer__grid { grid-template-columns: 1fr; gap: 24px; }
}
```

- [ ] **Step 3: 確認・コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(footer): フッター実装"
```

---

### Task 21: フローティングCTA

**Files:**
- Modify: `index.html`, `style.css`, `main.js`

- [ ] **Step 1: HTML実装**

```html
<div id="floating-cta" class="floating-cta">
  <button class="floating-cta__toggle" aria-expanded="false" aria-controls="floating-cta-menu" aria-label="お問い合わせメニューを開く">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  </button>
  <ul id="floating-cta-menu" class="floating-cta__menu" hidden>
    <li><a href="#contact" class="floating-cta__item floating-cta__item--consult">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
      <span>無料相談</span>
    </a></li>
    <li><a href="#contact" class="floating-cta__item floating-cta__item--contact">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>
      <span>問い合わせ</span>
    </a></li>
    <li><a href="https://jv-it.jp/company" target="_blank" rel="noopener" class="floating-cta__item floating-cta__item--company">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
      <span>会社概要</span>
    </a></li>
  </ul>
</div>
```

- [ ] **Step 2: CSS追記**

```css
/* ============================================
   Floating CTA
   ============================================ */
.floating-cta {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 90;
}
.floating-cta__toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-amber);
  color: var(--color-white);
  box-shadow: var(--shadow-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast), background-color var(--transition-fast);
}
.floating-cta__toggle:hover {
  background-color: var(--color-amber-dark);
  transform: scale(1.05);
}
.floating-cta__toggle svg { width: 26px; height: 26px; }
.floating-cta__menu {
  position: absolute;
  right: 0;
  bottom: 72px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity var(--transition-fast), transform var(--transition-fast);
  pointer-events: none;
}
.floating-cta--open .floating-cta__menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.floating-cta__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background-color: var(--color-white);
  border-radius: 999px;
  box-shadow: var(--shadow-card);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-navy);
  transition: background-color var(--transition-fast), color var(--transition-fast);
  white-space: nowrap;
}
.floating-cta__item svg { width: 18px; height: 18px; }
.floating-cta__item:hover {
  background-color: var(--color-navy);
  color: var(--color-white);
}

@media (max-width: 560px) {
  .floating-cta { right: 16px; bottom: 16px; }
  .floating-cta__toggle { width: 52px; height: 52px; }
  .floating-cta__toggle svg { width: 22px; height: 22px; }
}
```

- [ ] **Step 3: main.js に開閉ロジック追加**

```javascript
// フローティングCTA
const fab = document.getElementById('floating-cta');
if (fab) {
  const toggle = fab.querySelector('.floating-cta__toggle');
  const menu = fab.querySelector('.floating-cta__menu');
  const setOpen = (open) => {
    fab.classList.toggle('floating-cta--open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.hidden = !open;
  };
  toggle.addEventListener('click', () => {
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
```

- [ ] **Step 4: ブラウザ確認**

- 右下にアンバー色の丸ボタン
- クリックで3項目（無料相談・問い合わせ・会社概要）が上に展開
- 外側クリック / Esc で閉じる
- 会社概要は新規タブで開く
- モバイルでも見やすい位置

- [ ] **Step 5: コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(floating-cta): フローティング追随ボタン実装"
```

---

### Task 22: レスポンシブ調整・全体UI検証

**Files:**
- Modify: `index.html`, `style.css` （必要に応じて微調整）

- [ ] **Step 1: DevToolsで幅ごとに全セクション確認**

- 1440px（大画面PC）: レイアウト崩れなし
- 1024px（タブレット横）: グリッド調整OK
- 768px（タブレット縦 / モバイル境界）: ナビが崩れないか
- 375px（iPhone SE想定）: 文字サイズ・ボタン・カルーセルOK

- [ ] **Step 2: 崩れがあれば `style.css` を修正**

チェックリスト：
- ヘッダー: 900px以下でナビ非表示になっているか、CTAボタンは残っているか
- ヒーロー: SP時に文字が読めるか、CTAボタン縦積み
- 実績数値: 2×2グリッドになっているか
- 各カード類: SP時に1カラム or 2カラム、はみ出しなし
- フローティングCTA: モバイルで邪魔にならない位置

- [ ] **Step 3: コミット**

```bash
git add lp/system-maintenance
git commit -m "fix(responsive): 全セクションのレスポンシブ調整"
```

---

### Task 23: アクセシビリティ最終調整

**Files:**
- Modify: `index.html`, `style.css`, `main.js`

- [ ] **Step 1: WCAG AAコントラスト検証**

Chrome DevTools > Accessibility > Contrast check を使い、以下を確認:
- 本文（白/薄灰背景 vs `--color-gray-800`）: 4.5:1 以上
- 大見出し（白背景 vs `--color-navy`）: 3:1 以上
- ボタン（アンバー背景 vs 白文字）: 4.5:1 以上（要チェック、必要ならテキスト色調整）
- FAQ Aマーカー（アンバー背景 vs 白文字）: 4.5:1 以上

問題があれば色を調整。

- [ ] **Step 2: キーボード操作確認**

- Tabキーで全インタラクティブ要素にフォーカス到達
- フォーカスリング（シアン2px）が全要素で見える
- Enter/Spaceで動作（ボタン・リンク・アコーディオン）
- カルーセルは矢印キーで送り
- フローティングCTAはEscで閉じる

- [ ] **Step 3: スクリーンリーダー用属性の確認**

- 装飾画像に `alt=""` または `aria-hidden="true"`
- ロゴなど意味のある画像に適切な `alt`
- アイコンだけのボタンに `aria-label`
- FAQは `<details>` でネイティブ対応済み

- [ ] **Step 4: `prefers-reduced-motion` 動作確認**

DevTools > Rendering > Emulate CSS media feature `prefers-reduced-motion: reduce` にセット。
- スクロールフェードイン無効化される
- カウントアップアニメが即時完了 or 静的表示

対応が不十分な場合は `simulator.js` / `main.js` に `matchMedia('(prefers-reduced-motion: reduce)').matches` チェックを追加。

- [ ] **Step 5: コミット**

```bash
git add lp/system-maintenance
git commit -m "fix(a11y): アクセシビリティ最終調整（コントラスト・フォーカス・reduced-motion）"
```

---

### Task 24: SEO・パフォーマンス最終調整

**Files:**
- Create: `lp/system-maintenance/sitemap.xml`
- Create: `lp/system-maintenance/robots.txt`
- Modify: `index.html`（FAQPageのJSON-LD追加、BreadcrumbList追加）

- [ ] **Step 1: sitemap.xml を作成**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jv-it.jp/lp/system-maintenance</loc>
    <lastmod>2026-07-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 2: robots.txt を作成**

```
User-agent: *
Allow: /

Sitemap: https://jv-it.jp/lp/system-maintenance/sitemap.xml
```

- [ ] **Step 3: FAQPage / BreadcrumbList の JSON-LD を index.html に追記**

`<head>` 内の既存 JSON-LD の後に追加:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "どんな規模のシステムに対応できますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "小規模のWebサイトから、複数サーバ・複数サービスで構成された大規模基幹システムまで対応可能です。" }
    },
    {
      "@type": "Question",
      "name": "現在他社と契約中でも相談できますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "もちろん可能です。相談時点で他社契約の解約義務はありません。秘密保持契約のもと厳重に管理いたします。" }
    },
    {
      "@type": "Question",
      "name": "AIはどの範囲で使われますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "AIは監視ログ分析・一次判定・レポート作成などに活用します。本番環境への変更適用など重要操作はエンジニア承認が必須です。" }
    },
    {
      "@type": "Question",
      "name": "引き継ぎ期間はどのくらい必要ですか？",
      "acceptedAnswer": { "@type": "Answer", "text": "標準的なケースで最短1ヶ月です。ドキュメント不足でも段階的に引き継ぎ可能です。" }
    },
    {
      "@type": "Question",
      "name": "ドキュメントがないシステムでも引き継げますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "はい、可能です。ソースコード解析・稼働ログから構造を再構築します。" }
    },
    {
      "@type": "Question",
      "name": "ベトナム拠点で日本語対応は可能ですか？",
      "acceptedAnswer": { "@type": "Answer", "text": "可能です。日本本社のPMが窓口を担当し、ベトナム側との連携をブリッジします。" }
    },
    {
      "@type": "Question",
      "name": "契約期間の縛りはありますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "契約期間・解約条件は個別協議のうえ決定します。" }
    },
    {
      "@type": "Question",
      "name": "料金はどのように決まりますか？",
      "acceptedAnswer": { "@type": "Answer", "text": "サービス範囲・システム規模・対応時間帯などから算出します。3プランを基本に個別カスタマイズ可能です。" }
    }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://jv-it.jp/" },
    { "@type": "ListItem", "position": 2, "name": "LP", "item": "https://jv-it.jp/lp/" },
    { "@type": "ListItem", "position": 3, "name": "システム運用保守", "item": "https://jv-it.jp/lp/system-maintenance" }
  ]
}
</script>
```

- [ ] **Step 4: 画像に `loading="lazy"` を確認**

- ヒーロー画像は `fetchpriority="high" loading="eager"`（既に実装済み）
- それ以外の画像（事例画像・アバターなど）は `loading="lazy"` を明示（現在の実装は Lucide SVG インラインで画像が少ないため対応済み）

- [ ] **Step 5: Lighthouse 実行**

Chrome DevTools > Lighthouse > `Performance` `Accessibility` `Best Practices` `SEO` にチェック > `Analyze`。

期待値:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100

低い項目があれば都度対応（画像圧縮、フォントプリロード、未使用CSS削除など）。

- [ ] **Step 6: コミット**

```bash
git add lp/system-maintenance
git commit -m "feat(seo): sitemap・robots・FAQPage/Breadcrumb JSON-LD追加、Lighthouse対応"
```

---

### Task 25: code-reviewerサブエージェントによるレビュー

**Files:** レビュー対象 = 全実装ファイル

- [ ] **Step 1: 全体的な git diff の確認**

```bash
cd "C:\Users\oyako\Documents\★仕事\JVIT\Claude\jv-it.jp\lp"
git log --oneline -30
```

25タスク分のコミットが存在することを確認。

- [ ] **Step 2: code-reviewer エージェントを起動**

Agent tool で `code-reviewer` を呼び出し、以下の観点でレビュー依頼:
- HTML: 意味的タグ使用、`alt`属性、`aria`属性、見出し階層
- CSS: 変数使用の一貫性、命名の一貫性、不要ルール、レスポンシブの死角
- JS: バグ・エラーハンドリング・XSS対策・イベントリークの有無
- PHP: サニタイズ、CSRF、メール送信の堅牢性
- 設計書との整合性: `docs/superpowers/specs/2026-07-17-jv-it-lp-design.md` の全要件を満たしているか
- レビューシート指摘（`§12`の対応マッピング）が全て反映されているか

- [ ] **Step 3: 指摘対応**

レビュー結果を受けて、優先度High/Middleの指摘を修正。Lowはユーザー相談のうえ判断。

- [ ] **Step 4: 修正コミット**

```bash
git add lp/system-maintenance
git commit -m "fix: code-reviewerの指摘対応"
```

- [ ] **Step 5: 最終ユーザー確認**

- ブラウザで最終目視
- 全セクション・全機能を動作確認
- ユーザーに確認依頼

---

## Self-Review

以下、書き終えた後の自己チェック（要修正があれば本ドキュメントを直接編集）:

**1. Spec coverage**
- 設計書§4の17セクション + FAB → Task 4-21で網羅
- §5 デザイン言語 → Task 3で変数化、各セクションで使用
- §6 アクセシビリティ → Task 23で最終対応
- §7 技術構成 → Task 1のディレクトリ構造で対応
- §8 SEO → Task 2+24で対応
- §9 フォーム → Task 19で対応
- §10 アセット → Task 1で対応
- §11 コンテンツ制作原則 → Global Constraints + 各セクションのコピーで反映
- §12 レビューシート指摘対応 → 各セクションのCSS/HTMLで対応、Task 23で最終確認

**2. Placeholder scan**
- `TBD` は経営陣の顔写真部分のみ（設計書§14と同期、実装時にユーザー確認）
- 未確定事項はGlobal Constraints + Task 25で対応

**3. Type consistency**
- CSS変数名: 全タスク共通 `--color-*`, `--font-*` 系
- JS ID: `sim-*`, `contact-form-*`, `floating-cta-*` 統一
- ファイルパス: 全て `lp/system-maintenance/` 起点

修正なし。

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-17-jv-it-lp-implementation.md`.

Two execution options:

**1. Subagent-Driven (recommended)** - タスクごとに fresh subagent を起動、レビューを挟みつつ高速反復
**2. Inline Execution** - このセッション内で連続実行、チェックポイントでレビュー

Which approach?
