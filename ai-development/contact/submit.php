<?php
// お問い合わせフォーム 送信処理
declare(strict_types=1);

session_start();

// 設定
$TO_EMAIL = 'contact@jv-it.jp';
$FROM_EMAIL = 'noreply@jv-it.jp';
$SUBJECT_PREFIX = '[JV-IT AI開発LP] ';

// POST検証
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// CSRFトークン検証
if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token']) ||
    !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    exit('セッションが無効です。ページを再読み込みしてください。');
}

// Honeypot
if (!empty($_POST['_hp'])) {
    http_response_code(400);
    exit('Bad Request');
}

// 必須項目チェック（種別 service[] は配列のため別途検証）
$required = ['name', 'kana', 'email', 'tel', 'message', 'consent'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        exit('必須項目が未入力です: ' . htmlspecialchars($field, ENT_QUOTES, 'UTF-8'));
    }
}

// サニタイズ
$sanitize = fn($v) => htmlspecialchars(trim($v ?? ''), ENT_QUOTES, 'UTF-8');
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
// ヘッダーインジェクション対策：CRLF・NULLバイトを除去
$email = str_replace(["\r", "\n", "\0"], '', $email);
$name = str_replace(["\r", "\n", "\0"], '', $name);
$kana = str_replace(["\r", "\n", "\0"], '', $kana);
$company = str_replace(["\r", "\n", "\0"], '', $company);
$tel = str_replace(["\r", "\n", "\0"], '', $tel);
// message: 改行は保持、\r と \0 のみ除去
$message = str_replace(["\r", "\0"], '', $message);

// お問い合わせ種別（複数選択 service[]）。許可された値のみ受理
$allowedServices = [
    'システム開発', 'アプリ開発', 'DX支援', 'UI/UXデザイン', '運用保守',
    'オフショア開発について', '採用について', '取材・登壇・営業について',
    '業務提携・協業について', 'その他',
];
$services = $_POST['service'] ?? [];
if (!is_array($services)) {
    $services = [$services];
}
// 文字列要素のみ受理（不正な多次元POSTで警告→ヘッダー送信失敗になるのを防ぐ）
$services = array_filter($services, 'is_string');
// 許可リストに含まれる値だけ残し、重複を除去
$services = array_values(array_unique(array_filter(
    $services,
    fn($s) => in_array($s, $allowedServices, true)
)));
if (count($services) === 0) {
    http_response_code(400);
    exit('お問い合わせ種別が選択されていません');
}
// 表示用にサニタイズして連結
$typeLabel = implode('、', array_map($sanitize, $services));

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

    // 自動返信用ヘッダー（管理者メールのヘッダーとは別変数で管理）
    $autoHeaders  = "From: {$FROM_EMAIL}\r\n";
    $autoHeaders .= "Reply-To: {$TO_EMAIL}\r\n"; // 返信先は管理者アドレス
    $autoHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";

    mb_send_mail($email, '[JV-IT] お問い合わせを受け付けました', $autoBody, $autoHeaders);
}

if (!$sent) {
    http_response_code(500);
    exit('送信に失敗しました。時間をおいて再度お試しください。');
}

// 完了ページへリダイレクト
header('Location: /lp/ai-development/contact/thanks.html');
exit;
