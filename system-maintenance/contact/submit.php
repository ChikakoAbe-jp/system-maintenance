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
// ヘッダーインジェクション対策：CRLF・NULLバイトを除去
$email = str_replace(["\r", "\n", "\0"], '', $email);

// 種別のマッピング
$typeMap = [
    'consult' => '無料相談を希望',
    'quote' => 'お見積り',
    'question' => '質問',
    'other' => 'その他',
];
// 許可された種別以外は拒否
if (!array_key_exists($type, $typeMap)) {
    http_response_code(400);
    exit('不正なお問い合わせ種別です');
}
$typeLabel = $typeMap[$type];

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
header('Location: /lp/system-maintenance/contact/thanks.html');
exit;
