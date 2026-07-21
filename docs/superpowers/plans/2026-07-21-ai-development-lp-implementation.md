# AI駆動開発 × オフショア受託 新規LP 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `lp/ai-development/` に、AIネイティブ開発を看板・「AI駆動開発／オフショア受託開発会社」をSEO軸に据えた新規LP（ハイブリッドデザイン）を、保守LPのSEO/構造/PHPフォームの型を踏襲して構築する。

**Architecture:** 単一 `index.html` ＋ `assets/css/style.css`（3層トークン）＋ `assets/js/main.js`（挙動）＋ `assets/js/form.js`（フォーム2ステップ）＋ `contact/` のPHP（保守LP複製）。ヒーロー/要所はダーク、ボディはライトの2層構成。デザインskillで実装 → `design-audit`→`design-elevation`で磨き込み。

**Tech Stack:** セマンティックHTML5 / CSS（カスタムプロパティ・Grid/Flex）/ バニラJS（IIFE・IntersectionObserver）/ PHP（mb_send_mail・CSRF）/ Google Fonts（Noto Sans JP・Space Grotesk・JetBrains Mono）/ JSON-LD。

**参照実装（複製・パターン元）:** `lp/system-maintenance/`
**内容ソース:** 営業資料テキスト抽出済み（設計書 §7 に数値の正を記載）。

## Global Constraints

- 対象ディレクトリは `lp/ai-development/`。保守LP（`system-maintenance/`）は改修しない。
- title: `AI駆動開発に強いオフショア受託開発会社｜動くデモを最短数日でMVPへ｜JV-IT`
- H1: `構想を、動くデモへ。最短数日で。`
- canonical: `https://jv-it.jp/lp/ai-development`
- 色: 雰囲気=インディゴ`#4F46E5`↔シアン`#06B6D4` / CTA=橙`#C2410C` / 本文ライト`#0F172A`・ダーク`#E2E8F0` / サーフェス`#FFFFFF`,`#F8FAFC`,`#0B1020`,`#111827`。全テキスト4.5:1以上。
- タイポ: 本文=Noto Sans JP / 数字英字=Space Grotesk / 英字ラベル=JetBrains Mono。本文16px下限・行間1.7目安。約物は`typography`スキル準拠。
- モーション: 全アニメは `@media (prefers-reduced-motion: reduce)` で停止。統計カウンターは非JSフォールバック（初期テキストに最終値）。
- 数値の正: 離職率「業界平均20%に対し3%」／AI活用率「50%以上」／取引企業「300社以上」／Claude公式認定「100名体制・全社員Anthropic Academy修了100%」。
- 9235文言: 「東証グロース市場 上場『売れるネット広告社グループ（証券コード：9235）』と戦略的業務提携。」英略号（TSE等）禁止・JV-IT自身が上場と誤読させない・IR PDFは別タブ・主CTAにしない。
- IR PDF: `https://contents.xj-storage.jp/xcontents/AS04786/703c35fc/6003/450d/bd35/4101dc521b66/140120260515537812.pdf`
- 許諾: 取引先ロゴ=伏せ構造／9235提携先ロゴ=コメントアウト構造。
- フッター住所: `〒160-0004 東京都新宿区四谷3-11 光徳ビル201`。privacy=`https://jv-it.jp/privacy/`、コーポレート=`https://jv-it.jp/`。
- H2に「AI駆動開発」「オフショア（受託）開発」を最低1回。キーワード詰め込み禁止。
- 各タスク末尾でコミット（`feat(lp)`/`style(lp)`/`ci`等）。

**検証について:** テスト自動化は行わず、各タスクの検証は (a) ブラウザ表示（playwright MCP または手動）、(b) HTML/JSON-LD構文チェック、(c) コントラスト/レスポンシブ目視、で行う。最終盤に `code-reviewer` サブエージェント（CLAUDE.md §5）を実行。

---

## ファイル構成

| ファイル | 責務 |
|---|---|
| `lp/ai-development/index.html` | 全セクションのマークアップ・head/SEO・JSON-LD |
| `lp/ai-development/assets/css/style.css` | 3層デザイントークン＋全セクションのスタイル |
| `lp/ai-development/assets/js/main.js` | フェードイン・ヘッダースクロール・カウントアップ・カルーセル・FAB |
| `lp/ai-development/assets/js/form.js` | フォーム2ステップ・カスタム複数選択・CSRF注入 |
| `lp/ai-development/contact/submit.php` | メール送信・CSRF検証・種別許可リスト（複製・パス修正） |
| `lp/ai-development/contact/token.php` | CSRFトークン発行（複製そのまま） |
| `lp/ai-development/contact/thanks.html` | 送信完了ページ（複製・文言/パス調整） |
| `lp/ai-development/assets/img/` | ロゴ・clients・OG画像 |
| `lp/ai-development/favicon.ico`,`robots.txt`,`sitemap.xml` | 補助ファイル |
| `.github/workflows/pages-ai-development.yml` | 新LPのGitHub Pages公開 |

---

### Task 1: ディレクトリ雛形・アセット複製・head/SEO骨格

**Files:**
- Create: `lp/ai-development/index.html`
- Create: `lp/ai-development/assets/css/style.css`（空でよい・link確認用）
- Copy: `lp/system-maintenance/assets/img/logo-jvit-black.png` → `lp/ai-development/assets/img/logo-jvit-black.png`
- Copy: `logo-jvit-white.png`、`clients/client-01..06.png`、`favicon.ico`、`og-image.jpg`（暫定）を同様に複製
- Create: `lp/ai-development/robots.txt`, `lp/ai-development/sitemap.xml`

**Interfaces:**
- Produces: `index.html` の `<head>`（title/description/canonical/OGP/Twitter/Fonts/JSON-LD×4の枠）。後続タスクは `<body>` 内にセクションを追加していく。

- [ ] **Step 1: ディレクトリとアセットを複製**

```bash
cd "C:/Users/oyako/Documents/★仕事/JVIT/Claude/jv-it.jp/lp"
mkdir -p ai-development/assets/{css,js,img/clients} ai-development/contact
cp system-maintenance/assets/img/logo-jvit-black.png ai-development/assets/img/
cp system-maintenance/assets/img/logo-jvit-white.png ai-development/assets/img/
cp system-maintenance/assets/img/clients/client-0{1,2,3,4,5,6}.png ai-development/assets/img/clients/
cp system-maintenance/assets/img/og-image.jpg ai-development/assets/img/   # 暫定・後日差替
cp system-maintenance/favicon.ico ai-development/
```

- [ ] **Step 2: `index.html` の head と JSON-LD 骨格を作成**

`<head>` に以下を実装（Global Constraints の値を使用）:
- `<html lang="ja">`、charset、viewport
- title / meta description（設計書 §5 の推奨文）
- `<meta name="robots" content="index, follow">`、canonical `https://jv-it.jp/lp/ai-development`
- OGP（og:type/title/description/url/image=`https://jv-it.jp/lp/ai-development/assets/img/og-image.jpg`）、Twitter summary_large_image
- favicon `/lp/ai-development/favicon.ico`
- Fonts（preconnect + 1本の css2 リンクで Noto Sans JP 400;500;700 / Space Grotesk 500;700 / JetBrains Mono 500 を `display=swap`）
- `<link rel="stylesheet" href="assets/css/style.css">`
- JSON-LD ①Organization（保守LPと同じ・logoパスを ai-development に）
- JSON-LD ②Service（`serviceType`="AI駆動開発／オフショア受託開発"、`alternateName` に9語: `AI駆動開発, AIネイティブ開発, オフショア開発, 受託開発, オフショア開発会社, 受託開発会社, AI開発会社, MVP開発, ラボ型開発`、provider=JV-IT、areaServed=JP。※offersのpriceは付けない＝金額断定回避）
- JSON-LD ③FAQPage（枠のみ。Task 14 で6問投入）
- JSON-LD ④BreadcrumbList（Home `https://jv-it.jp/` → AI開発（受託）`https://jv-it.jp/lp/ai-development`）
- `<body>` は空の骨格（`<header>` `<main>` `<footer>` のプレースホルダのみ）

- [ ] **Step 3: robots.txt / sitemap.xml を作成**

`robots.txt`（保守LP準拠、Sitemap行を ai-development に）、`sitemap.xml`（`https://jv-it.jp/lp/ai-development` 1 URL）。

- [ ] **Step 4: 検証**

- ブラウザで `index.html` を開き、コンソールエラーなし・fontsロード確認。
- JSON-LD×4を https://validator.schema.org 相当のパーサ（またはJSON.parse）で構文検証。`node -e "JSON.parse(...)"` 等で各scriptを検証。
- 期待: HTMLパースエラーなし、4つのJSON-LDが有効JSON。

- [ ] **Step 5: コミット**

```bash
git add lp/ai-development
git commit -m "feat(lp): AI開発LPの雛形・アセット複製・head/SEO/JSON-LD骨格"
```

---

### Task 2: デザイントークン（3層）とベーススタイル

**Files:**
- Modify: `lp/ai-development/assets/css/style.css`

**Interfaces:**
- Produces: CSSカスタムプロパティ群（色・スペース・タイポ・半径・影・コンテナ幅）、リセット、`.section`/`.container`/`.btn`/`.btn--cta`/`.btn--ghost`/`.fade-in`/`.section--dark`/`.section--soft` の共通クラス。後続の全セクションがこれらを利用。

- [ ] **Step 1: `design-system` と `typography` スキルを参照しトークンを定義**

`:root` に3層トークン（primitive→semantic→component）:
- primitive: `--indigo-600:#4F46E5; --cyan-500:#06B6D4; --orange-cta:#C2410C; --ink:#0F172A; --ink-invert:#E2E8F0; --surface:#FFFFFF; --surface-soft:#F8FAFC; --surface-dark:#0B1020; --surface-dark-2:#111827;` ほかグレースケール。
- semantic: `--color-text`, `--color-text-invert`, `--color-bg`, `--color-bg-soft`, `--color-bg-dark`, `--color-accent`(indigo), `--color-accent-2`(cyan), `--color-cta`, `--grad-ai:linear-gradient(...indigo→cyan)`。
- spacing: 8pxベース `--space-1..--space-16`。type scale（`--fs-hero`,`--fs-h2`,`--fs-h3`,`--fs-body:1rem`,`--fs-sm`）。`--lh-body:1.7`。`--radius`,`--shadow`,`--container:1120px`。
- 本文16px下限・行間1.7。ダッシュ・引用符など約物は typography 準拠。

- [ ] **Step 2: リセット・ベース・共通コンポーネントを実装**

- `*{box-sizing}`、`html{scroll-behavior:smooth}`（reduced-motionで無効）、`body{font-family:"Noto Sans JP"; color:var(--color-text); line-height:1.7}`。
- 数字/英字ラベル用 `.font-tech{font-family:"Space Grotesk"}`、`.font-mono{font-family:"JetBrains Mono"}`。
- `.container{max-width:var(--container);margin-inline:auto;padding-inline:clamp(20px,5vw,40px)}`
- `.section{padding-block:clamp(56px,8vw,104px)}`、`.section--soft{background:var(--color-bg-soft)}`、`.section--dark{background:var(--color-bg-dark);color:var(--color-text-invert)}`
- `.btn`（基本）、`.btn--cta{background:var(--color-cta);color:#fff}`（hover/focus-visible・4.5:1確認）、`.btn--ghost`（枠線・ダーク上で可読）。
- `.fade-in{opacity:0;transform:translateY(16px);transition:.6s} .fade-in.is-visible{opacity:1;transform:none}`。`@media (prefers-reduced-motion:reduce){.fade-in{opacity:1;transform:none;transition:none}}`

- [ ] **Step 3: 検証**

- ブラウザで空ページに一時的なテスト要素（`.btn--cta`等）を置き、色・フォントが適用されるか確認（確認後は削除）。
- コントラスト: `--color-cta`#C2410C on #fff、`--color-text`#0F172A on #fff、`--color-text-invert`#E2E8F0 on #0B1020 が各4.5:1以上か算出して確認。
- 期待: 3組すべて4.5:1以上。

- [ ] **Step 4: コミット**

```bash
git add lp/ai-development/assets/css/style.css
git commit -m "style(lp): デザイントークン(3層)とベース/共通コンポーネント"
```

---

### Task 3: ヘッダー ＋ ヒーロー（ダーク）＋ 信頼スタッツ帯

**Files:**
- Modify: `lp/ai-development/index.html`（`<header>`, `#hero`, `#stats-bar`）
- Modify: `lp/ai-development/assets/css/style.css`

**Interfaces:**
- Consumes: Task 2 のトークン・共通クラス。
- Produces: `#header`（`.header--scrolled`トグル対象）、`#hero`、`#stats-bar`（`[data-count]`要素）。Task 17 の main.js がこれらを制御。CTAアンカーは `#contact` を指す。

- [ ] **Step 1: ヘッダー実装**

固定ヘッダー `<header id="header">`：左にロゴ（`logo-jvit-white.png`＝ダーク背景用。スクロールで白背景化する場合は黒ロゴへ切替 or 常時ダークヘッダー）、右にナビ（開発の流れ/事例/選ばれる理由/FAQ）＋ CTAボタン「無料相談」（`.btn--cta` → `#contact`）。モバイルはCTAのみ表示可。

- [ ] **Step 2: ヒーロー（ダーク）実装**

`<section id="hero" class="section--dark">`：
- 背景=濃紺→黒グラデ＋微光グリッド（CSSの`radial-gradient`/`linear-gradient`＋擬似要素のgridパターン。画像不使用）。
- H1: `構想を、動くデモへ。最短数日で。`
- サブコピー(可視・拾わせ語): `AI駆動開発 × 20年のオフショア受託で、新規開発・PoC・MVPを最短数日の"動くデモ"から形にする開発会社、JV-IT。`
- 主CTA `.btn--cta`「無料で相談する」→`#contact`、サブCTA `.btn--ghost`「開発の流れを見る」→`#flow`。
- reduced-motion時はグリッドアニメ停止。

- [ ] **Step 3: 信頼スタッツ帯実装**

`<section id="stats-bar">`：5項目、各 `<span class="stat__value"><span data-count="X" ...>X</span>単位</span>`：
- Claude認定 `data-count="100" data-suffix="名"`（→100名）
- 離職率 `data-count="3"`（→3%）＋補足「業界平均20%」
- AI活用率 `data-count="50" data-suffix="%〜"`（→50%〜）
- 稼働 `data-count="20"`（→20年）
- 取引企業 `data-count="300" data-suffix="社+"`（→300社+）
- 非JS時も初期テキストで最終値が見えるようにする。

- [ ] **Step 4: 検証**

- ブラウザ幅 375 / 768 / 1280px でヒーロー・スタッツの折返し・可読性を目視。
- ダーク背景上のテキスト（#E2E8F0）とCTA（#C2410C）のコントラストOK確認。
- 期待: 横スクロール発生なし、H1/サブ/CTA/スタッツが全幅で崩れない。

- [ ] **Step 5: コミット**

```bash
git add lp/ai-development
git commit -m "feat(lp): ヘッダー・ダークヒーロー・信頼スタッツ帯"
```

---

### Task 4: 9235提携ブロック

**Files:**
- Modify: `index.html`（`#trust`）, `style.css`

**Interfaces:**
- Consumes: Task 2 トークン。Produces: `#trust` セクション。

- [ ] **Step 1: マークアップ実装（保守LP `#trust` を範とする）**

`<section id="trust" class="section--dark" aria-label="上場企業との業務提携">`：
- バッジ（例「戦略的業務提携」）
- 提携先ロゴは**コメントアウト構造**（許諾前）:
```html
<!-- 業務提携先ロゴ：相手先の許諾が確認できたら assets/img/partners/ に配置し、この figure を有効化
<figure class="trust-band__partner">
  <img src="assets/img/partners/urerunet-group.png" alt="売れるネット広告社グループ ロゴ" width="160" height="48" loading="lazy">
  <figcaption>業務提携先</figcaption>
</figure>
-->
```
- 本文（Global Constraints の9235文言を厳守）:
  `東証グロース市場 上場「売れるネット広告社グループ（証券コード：9235）」と戦略的業務提携。上場企業に選ばれる技術力と信頼性で、新規開発・PoC・MVPをお任せください。`
- 控えめIRリンク: `<a href="[IR PDF]" target="_blank" rel="noopener">プレスリリースを見る（PDF）</a>`（`.btn--cta`にしない）。

- [ ] **Step 2: 検証**

- 「JV-IT自身が上場」と誤読しない文か目視。英略号(TSE等)不使用を確認。
- リンクが別タブ・`rel="noopener"`付きか、主CTA色でないか確認。
- 期待: 文言・リンク仕様が Global Constraints と一致。

- [ ] **Step 3: コミット**

```bash
git add lp/ai-development
git commit -m "feat(lp): 9235提携ブロック(誤読回避・ロゴはコメントアウト構造)"
```

---

### Task 5: 「こんな課題はありませんか？」

**Files:** Modify `index.html`（`#problems`）, `style.css`

- [ ] **Step 1: 実装**

`<section id="problems" class="section section--soft">`：H2「新規開発・PoC・MVP、こんな不安はありませんか？」＋課題カード4枚:
1. 要件が固まらない／作ってみないと分からない
2. 仕様書だけでは完成イメージが共有できない
3. オフショアは品質・コミュニケーションが不安
4. 開発スピードが出ず、意思決定が遅れる
各カードにアイコン（インライン SVG）＋一言。

- [ ] **Step 2: 検証** — 4カードのレスポンシブ（1/2/4列）目視、横スクロールなし。
- [ ] **Step 3: コミット** `feat(lp): 課題提起セクション`

---

### Task 6: AIネイティブ開発フロー（DAY0/DAY3/WEEK2/MONTH1）＝看板

**Files:** Modify `index.html`（`#flow`）, `style.css`

**Interfaces:** Produces `#flow`（ヒーローのサブCTAリンク先）。

- [ ] **Step 1: 実装（PDF準拠）**

`<section id="flow" class="section--dark">`：H2「作る前に"動くデモ"で確かめる、AIネイティブ開発」。4ステップのタイムライン、各ステップに monospace ラベル：
- `DAY 0` / 60-90分 / PMによる直接ヒアリング / 業務課題・KPI・世界観をその場で整理し実装可能性を即判断
- `DAY 3` / 3営業日 / AIモック・UIプロトタイプ / 主要画面と画面遷移を生成し社内合意を加速
- `WEEK 2` / 2週間 / 動くデモ・サービス世界観 / 実データに近いデモでUXまで含めた世界観を提示
- `MONTH 1` / 1ヶ月 / MVP β版・KPI設定 / 本番投入可能なMVPを構築し成功指標を定義
下部に効果3点: 想像で議論しない／本気度の証明／認識齟齬ゼロ。

- [ ] **Step 2: 検証** — モバイルで縦タイムライン、PCで横フロー。矢印/番号の視線誘導が機能するか目視。
- [ ] **Step 3: コミット** `feat(lp): AIネイティブ開発フロー(看板)`

---

### Task 7: 2つの開発スタイル併記

**Files:** Modify `index.html`（`#styles`）, `style.css`

- [ ] **Step 1: 実装（H2に「AI駆動開発」を含める）**

`<section id="styles" class="section">`：H2「新規もこれからも。AI駆動開発とAIネイティブ開発を使い分け」。2カラム比較:
- **AIネイティブ開発（主・強調）**: 新規開発/PoC/MVP・スピード重視。フロー「PMヒアリング ▸ AI動的デモ生成 ▸ MVP直結」。効果「仕上がりに近いデモを最短数日で提示」。
- **AI駆動開発（従）**: 中〜大規模/既存改修・機能追加/品質・SLA重視。フロー「要件定義 ▸ 設計 ▸ 開発 ▸ テスト ▸ リリース」。効果「開発スピード10〜50%向上・手戻り削減」。
- 下部に活用ツール帯: Claude Code・Codex・Gemini・Cursor・Jai1 Framework（JV-IT独自）。

- [ ] **Step 2: 検証** — 主従の視覚的優先度（ネイティブ側が主役）が伝わるか、2カラム→1カラム崩れなし。
- [ ] **Step 3: コミット** `feat(lp): 2つの開発スタイル併記`

---

### Task 8: 開発体制（AIネイティブ）図

**Files:** Modify `index.html`（`#team`）, `style.css`

- [ ] **Step 1: 実装（H2に「オフショア（受託）開発」を含める）**

`<section id="team" class="section section--soft">`：H2「日本人PM直轄のオフショア受託開発体制」。簡潔な体制図（CSS/inline SVG）：お客様 ⇄ 日本人PM（全体統括・窓口）→ 上級エンジニア＋QC（コードレビュー・テスト）／CMチーム（翻訳・進捗）／インフラ。説明: 日本人PMがヒアリング〜デモ〜MVP開発を担当、上級エンジニアとQCが品質担保。

- [ ] **Step 2: 検証** — 図のラベル可読性・モバイル縦積み・矢印の意味が通るか目視。
- [ ] **Step 3: コミット** `feat(lp): 開発体制図(AIネイティブ)`

---

### Task 9: 選ばれる3つの理由

**Files:** Modify `index.html`（`#reasons`）, `style.css`

- [ ] **Step 1: 実装**

`<section id="reasons" class="section">`：H2「JV-ITが選ばれる3つの理由」。3カード:
1. 離職率3%（業界平均20%）— 担当が変わらない業務継続性（5年維持）
2. 日本人PM直轄体制 — ブリッジSE任せにせず日本基準の品質管理
3. AI活用率50%以上 — 全工程でAI活用しスピーディなMVP開発
各カードに大きな数値（Space Grotesk）。

- [ ] **Step 2: 検証** — 数値の視認性・3→1列レスポンシブ・離職率の但し書き（業界平均20%）明記を確認。
- [ ] **Step 3: コミット** `feat(lp): 選ばれる3つの理由`

---

### Task 10: 取引先ロゴ帯

**Files:** Modify `index.html`（`#clients`）, `style.css`

- [ ] **Step 1: 実装（保守LP `#clients` を範とする）**

`<section id="clients" class="section section--soft" aria-labelledby="clients-heading">`：見出し「取引企業300社以上」、リード短文。`client-01..06.png` を alt付きで並べる。7枚目以降は**伏せ構造**（許諾確認後に有効化するコメント）:
```html
<!-- 許諾確認後に追加：
<li class="clients__logo"><img src="assets/img/clients/client-07.png" alt="○○株式会社" width="180" height="84" loading="lazy"></li>
-->
```

- [ ] **Step 2: 検証** — ロゴのグレースケール/整列、`loading="lazy"`、alt有りを確認。
- [ ] **Step 3: コミット** `feat(lp): 取引先ロゴ帯(300社+・伏せ構造)`

---

### Task 11: 導入事例（カルーセル）

**Files:** Modify `index.html`（`#cases`）, `style.css`

**Interfaces:** Produces `#cases` に `[data-carousel]`（Task 17 main.js が制御）。DOM構造は保守LPのカルーセル（`.carousel__viewport/.carousel__track/[data-carousel-prev]/[data-carousel-next]/[data-carousel-dots]`）に一致させる。

- [ ] **Step 1: 実装（各カード=課題/対応/成果、数値必須）**

`<section id="cases" class="section">`：H2「AI開発の導入事例」。カルーセルに事例カード:
- **F社（首都圏大学共同）メンタルケアアプリ（主役）**: 課題=短期で検証したい／対応=AI駆動型アジャイル・週次デモ(TestFlight)で要件変更を即反映／成果=**企画から2ヶ月でPoC版デプロイ・複数企業展開可能な基盤**。
- **H社 飲食店予約管理**: 対応=AI駆動・機能別フェーズ分割で検証／成果=短期間でMVP完成・要望反映で高精度UI/UX・既存アプリ連動で段階拡張。
- **O社 オンライン診療**: 最大20名ラボ・5年継続。既存システムを全面引継ぎ再構築（継続力の裏付け）。
- **U社 広告配信**: 最大30名ラボ・8年継続。大規模AWS基盤の開発・運用・監視（継続力の裏付け）。
- 各カードは `課題(BEFORE) / JV-ITの対応 / 成果` の3ブロック＋数値・期間。

- [ ] **Step 2: 検証** — カルーセルDOMが main.js セレクタと一致、各カードに数値/期間あり、F社が先頭（主役）。
- [ ] **Step 3: コミット** `feat(lp): 導入事例カルーセル(F社2ヶ月PoC主役)`

---

### Task 12: Claude公式認定の体制

**Files:** Modify `index.html`（`#certification`）, `style.css`

- [ ] **Step 1: 実装**

`<section id="certification" class="section section--dark">`：H2「Claude公式認定100名体制」。2認定:
- CERT 01: Anthropic Academy 修了 — 全社員100%（Claude API・Agent SDK・Claude Code・MCP・Prompt Engineering）
- CERT 02: CCA-F（Claude Certified Architect – Foundations）— 上位メンバーが取得
価値3点: 最新のClaude活用／属人化しない品質／第三者認定の信頼。

- [ ] **Step 2: 検証** — ダーク上の可読性・認定バッジ配置・数値表現の正確性を確認。
- [ ] **Step 3: コミット** `feat(lp): Claude公式認定の体制`

---

### Task 13: 料金・進め方（金額断定なし）

**Files:** Modify `index.html`（`#pricing`）, `style.css`

- [ ] **Step 1: 実装**

`<section id="pricing" class="section">`：H2「料金・進め方」。固定料金表は作らない。
- 「PoC/MVPの進め方」ステップ（相談→小さくPoC→デモ確認→MVP拡張）。
- 「お見積もりの考え方」＝対応範囲・規模・スピードで算出する旨（金額は書かない）。
- 「まず小さくPoCから始められます」を明記＋CTA「無料で相談する」→`#contact`。

- [ ] **Step 2: 検証** — 金額の断定表現が無いこと、"小さく始められる"訴求とCTAがあることを確認。
- [ ] **Step 3: コミット** `feat(lp): 料金・進め方(金額断定なし)`

---

### Task 14: FAQ ＋ FAQPage JSON-LD

**Files:** Modify `index.html`（`#faq` と head の FAQPage）, `style.css`

**Interfaces:** Consumes Task 1 の FAQPage 枠。可視FAQのQ&AとJSON-LDの内容を一致させる。

- [ ] **Step 1: 可視FAQ（`<details>`/`<summary>` でJS不要開閉）を実装**

`<section id="faq" class="section section--soft">`：H2「よくあるご質問」。6問（設計書 §6）:
1. AIネイティブ開発とAI駆動開発は何が違いますか？ → AIネイティブは新規/PoC/MVPを動くデモから最短で形にする手法。AI駆動は中〜大規模・既存改修で従来フローを高速化する手法。案件特性で使い分け。
2. 動くデモはどのくらいの期間で出てきますか？ → 最短数日でAIモック、2週間で実データに近い動くデモを提示します。
3. 小さくPoCだけ依頼することはできますか？ → 可能です。まずPoCから始め、成果を見て段階的にMVP・本開発へ広げられます。
4. オフショアですが品質・コミュニケーションは大丈夫ですか？ → 日本人PMが直接窓口・指揮し、離職率3%で担当が変わりません。全社員がClaude公式認定を取得しています。
5. 費用はどのように決まりますか？ → 対応範囲・規模・スピードに応じて個別に算出します。まずは無料相談でご要望をお聞かせください。
6. 既存システムの改修・追加開発も頼めますか？ → 可能です。中〜大規模・既存改修はAI駆動開発で品質・SLAを重視して対応します。

- [ ] **Step 2: head の FAQPage JSON-LD に同じ6問を投入（Q名・回答テキストを可視FAQと一致）**

- [ ] **Step 3: 検証** — 可視Q&AとJSON-LDのテキスト一致、JSON-LDが有効JSON、`<details>`がJSなしで開閉することを確認。
- [ ] **Step 4: コミット** `feat(lp): FAQ + FAQPage構造化データ`

---

### Task 15: 会社情報 ＋ フッター

**Files:** Modify `index.html`（`#company`, `<footer>`）, `style.css`

- [ ] **Step 1: 実装**

`<section id="company" class="section">`：日本法人（株式会社JV-ITホールディングス／東京都新宿区四谷3-11 光徳ビル201／設立2018/売上4.12億円等）とベトナム法人（JV-IT TECHS CO., LTD／ホーチミン／87名）を2カラムで。
`<footer>`：ロゴ、住所 `〒160-0004 東京都新宿区四谷3-11 光徳ビル201`、コーポレートリンク `https://jv-it.jp/`、プライバシー `https://jv-it.jp/privacy/`、コピーライト。

- [ ] **Step 2: 検証** — 住所・リンクが Global Constraints と一致、フッター2/1列レスポンシブ確認。
- [ ] **Step 3: コミット** `feat(lp): 会社情報・フッター`

---

### Task 16: お問い合わせフォーム（HTML＋form.js＋PHP複製）

**Files:**
- Modify: `index.html`（`#contact`）
- Create: `lp/ai-development/assets/js/form.js`
- Create: `lp/ai-development/contact/submit.php`, `token.php`, `thanks.html`
- Modify: `style.css`（フォーム・カスタムセレクト・確認画面スタイル）

**Interfaces:**
- Consumes: なし（自己完結）。Produces: `#contact-form`（action=`contact/submit.php`）、CSRF hidden `#cf-csrf`、`[data-step="input"]`/`[data-step="confirm"]`、カスタムセレクト、`#cf-message`。

- [ ] **Step 1: PHP を複製・パス修正**

- `token.php` はそのまま複製。
- `submit.php` を複製し、`$SUBJECT_PREFIX` を `'[JV-IT AI開発LP] '` に、リダイレクト先を `/lp/ai-development/contact/thanks.html` に変更。種別許可リスト（`$allowedServices`）は保守LPと同一（システム開発／アプリ開発／DX支援／UI/UXデザイン／運用保守／オフショア開発について／採用について／取材・登壇・営業について／業務提携・協業について／その他）。
- `thanks.html` を複製し、パス・文言を ai-development 向けに調整（トップへ戻るリンク `../index.html`）。

- [ ] **Step 2: フォームHTMLを実装（保守LP `#contact` の form 構造に一致）**

`<section id="contact" class="section section--soft">`：H2「無料相談・お問い合わせ」。
`<form id="contact-form" action="contact/submit.php" method="POST" novalidate>` に:
- ハニーポット（`.contact-form__hp` aria-hidden, `input name="_hp" tabindex="-1"`）
- `<input type="hidden" name="csrf_token" id="cf-csrf">`
- `data-step="input"`: カスタム複数選択（`data-custom-select` / `#cf-type-trigger` / `.custom-select__panel#cf-type-panel` / `input[name="service[]"]` チェック群＝許可リストと同じ値・**既定はシステム開発が先頭で選ばれやすい配置**）、お名前(必須)、ふりがな(必須)、会社名(任意)、メール(必須,type=email)、電話(必須,type=tel)、内容(必須,`#cf-message`)、同意チェック(`input[name="consent"]`必須, privacyリンク別タブ)、確認ボタン `#cf-confirm-btn`。
- `data-step="confirm" hidden`: `#cf-review`（dl）、戻る `#cf-back-btn`、送信ボタン（submit）。
- エラー領域 `#contact-form-error`。

- [ ] **Step 3: form.js を複製・パス確認**

保守LPの `form.js` をそのまま複製（`fetch('contact/token.php')` 相対パスが ai-development でも正しいことを確認）。

- [ ] **Step 4: 検証**

- ブラウザで: 種別未選択→確認でエラー、必須未入力→エラー、正常入力→確認画面に全項目表示、戻る→入力復帰。
- `contact/token.php` がJSON返却しCSRF hiddenに注入されるか（ローカルPHP: `php -S localhost:8000 -t lp/ai-development` で確認）。
- 期待: 2ステップ遷移・バリデーション・CSRF注入が動作。

- [ ] **Step 5: コミット** `feat(lp): お問い合わせフォーム(2ステップ・PHP複製・CSRF)`

---

### Task 17: main.js（挙動）

**Files:** Create `lp/ai-development/assets/js/main.js`、Modify `index.html`（`<script defer>` 参照追加）, `style.css`（`#floating-cta`）

**Interfaces:** Consumes 既存 DOM（`.fade-in`,`#header`,`[data-count]`,`[data-carousel]`,`#floating-cta`）。

- [ ] **Step 1: 実装（保守LPの main.js を範とし、本LPで使う機能に整理）**

- フェードイン（IntersectionObserver、非対応時は即表示）
- ヘッダースクロール（`.header--scrolled`）
- カウントアップ（`[data-count]`・`data-suffix`/`data-decimals`対応・reduced-motionで即値）
- カルーセル（`#cases` 用・保守LPロジック流用）
- フローティングCTA `#floating-cta`（無料相談/電話メニュー・自動クローズ・Esc・外側クリック）
- ※料金プラン自動入力(`lpSetAutofill`)は本LPで不要なら省略（YAGNI）。

- [ ] **Step 2: `index.html` に `<script defer src="assets/js/main.js"></script>` と `form.js` を追加。FAB要素を追加。**

- [ ] **Step 3: 検証** — スクロールでヘッダー変化・スタッツがカウントアップ・カルーセル送り/ドット・FAB開閉。reduced-motion（OS設定 or DevTools）でアニメ停止＆数値即表示。
- [ ] **Step 4: コミット** `feat(lp): main.js(フェードイン/カウントアップ/カルーセル/FAB)`

---

### Task 18: GitHub Pages 公開ワークフロー追加

**Files:** Create `.github/workflows/pages-ai-development.yml`

**Interfaces:** 既存 `pages.yml`（system-maintenance公開）を壊さない。

- [ ] **Step 1: 実装上の注意を確認**

GitHub Pages は1リポジトリ1サイトのため、既存 `pages.yml` と同時に別ジョブで別パスを publish すると競合する。**方針**: 既存 `pages.yml` を1本に統合し、`system-maintenance/` と `ai-development/` の両方を1つのアーティファクト（親ディレクトリ構成）としてアップロードする。具体的には publish 用に一時ディレクトリへ両フォルダをコピーし、`system-maintenance/` と `ai-development/` がそれぞれサブパスで公開される構成にする。paths トリガーに `ai-development/**` を追加。

- [ ] **Step 2: `pages.yml` を統合改修（別案の採否はユーザー確認）**

`on.push.paths` に `ai-development/**` を追加。ビルドステップで:
```yaml
- name: Assemble site
  run: |
    mkdir -p _site/system-maintenance _site/ai-development
    cp -r system-maintenance/* _site/system-maintenance/
    cp -r ai-development/* _site/ai-development/
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: _site
```
※公開URLのサブパスが `/<repo>/system-maintenance/` `/<repo>/ai-development/` になる点、相対パス（`assets/...`）で動作することを確認。

- [ ] **Step 3: 検証** — `.yml` の構文（`python -c "import yaml,sys;yaml.safe_load(open(...))"` 相当 or `yamllint`）、push後に Actions が成功し両LPが表示されること（ユーザー環境で確認）。
- [ ] **Step 4: コミット** `ci(pages): ai-development をPages公開対象に追加(既存統合)`

---

### Task 19: design-audit セルフレビュー

**Files:** レビュー対象=`lp/ai-development/*`（修正は index.html/style.css 中心）

- [ ] **Step 1: `design-audit` スキルを起動し、全体を点検**

コントラスト・余白リズム・視線誘導・階層（H1>H2>本文）・一貫性（トークン逸脱）・レスポンシブ（375/768/1280）・ダーク/ライト境界・CTAの目立ち・フォント級数を体系的に監査。指摘を一覧化。

- [ ] **Step 2: 指摘のうち Global Constraints/SEO/アクセシビリティを害さないものを修正**

- [ ] **Step 3: 検証** — 修正後に主要ブレークポイントで再目視、コントラスト再確認。
- [ ] **Step 4: コミット** `style(lp): design-audit指摘の反映`

---

### Task 20: design-elevation 磨き込み

**Files:** `index.html`, `style.css`（微調整）

- [ ] **Step 1: `design-elevation` スキルを起動し、質を引き上げる**

マイクロインタラクション（hover/focus）、余白の詰め、タイポの階層強化、アクセントグラデの効かせどころ、セクション間リズムを磨く。速度・可読性を犠牲にしない。

- [ ] **Step 2: 検証** — Lighthouse相当の目視（不要JS/大画像なし）、reduced-motion維持、コントラスト維持。
- [ ] **Step 3: コミット** `style(lp): design-elevationによる磨き込み`

---

### Task 21: 最終チェック・コードレビュー・報告

**Files:** なし（レビューと報告）

- [ ] **Step 1: 設計書 §13 セルフチェック9項目を1つずつ確認**（title/H1・JSON-LD4種・フロー/2スタイル・9235/ロゴ/離職率・事例/料金・フォーム・アクセシビリティ・アセット出所・使用skill）

- [ ] **Step 2: `code-reviewer` サブエージェント（CLAUDE.md §5）を起動**し、HTML/CSS/JS/PHP をレビュー。指摘があれば修正しユーザーに報告・続行確認。

- [ ] **Step 3: 最終ブラウザ確認**（playwright MCP で 375/768/1280 のスクリーンショット、コンソールエラーなし）。

- [ ] **Step 4: ユーザー報告** — 変更点・新規アセットの出所（許諾要否）・使用skill・design-audit指摘と対応を箇条書きで。

- [ ] **Step 5: コミット（未コミット差分があれば）** `chore(lp): 最終チェック反映`

---

## Self-Review（計画→設計書の突合）

- **§1-2 目的/方針**: Task 1(SEO軸)・Task 3/6(看板)・Task 19-20(skill工程)でカバー。
- **§3 トークン**: Task 2 でカバー（色/タイポ/余白/モーション/画像方針）。
- **§4 構成14セクション**: Task 3(1)・4(2)・5(3)・6(4)・7(5)・8(6)・9(7)・10(8)・11(9)・12(10)・13(11)・14(12)・15(13)・16(14) で全て対応。
- **§5 SEO**: Task 1(head/JSON-LD/canonical/OGP)・Task 7/8(H2キーワード)・Task 14(FAQPage)。
- **§6 FAQ6問**: Task 14 に全文記載。
- **§7 信頼資産/数値**: Task 3(スタッツ)・4(9235)・9(離職率)・10(300社)・12(Claude認定)。数値の正は Global Constraints に固定。
- **§8 フォーム**: Task 16（PHP複製・確認画面・同意・ハニーポット・CSRF・種別許可リスト一致）。
- **§9 品質**: Task 2/3(コントラスト/16px/1.7)・Task 17(reduced-motion/非JSフォールバック)・Task 15(住所)。
- **§10 公開**: Task 18。
- **§11 アセット出所**: Task 1(複製)・4(9235コメントアウト)・10(clients伏せ)・21(報告)。OG画像=暫定流用を報告に明記。
- **§13 セルフチェック**: Task 21。

**Placeholder scan**: 主要コピー（H1/サブ/スタッツ/FAQ全文/9235文言/事例数値）は本文に記載済み。CSS詳細はデザインskillが生成（トークン値は固定済み）。TBD/TODO なし。

**Type/セレクタ整合**: `#contact-form`/`#cf-csrf`/`data-step`/`.custom-select`/`[data-carousel]`/`[data-count]`/`#floating-cta` は保守LPの form.js/main.js と同一名で統一（Task 16/17）。
