<?php
if (!defined("WHMCS")) die("This file cannot be accessed directly");
add_hook('InvoiceCreated', 1, function($vars) {
    $apiKey = 'YOUR_5MINUTESAPI_KEY_HERE';
    $template = 'invoice_billing_notice';
    $phone = preg_replace('/[^0-9]/', '', $vars['phonenumber'] ?? '');
    if (empty($phone)) return;
    
    $ch = curl_init('https://api.5minutesapi.com/v1/send-message');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['to' => $phone, 'whatsapp_template' => $template]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_exec($ch);
    curl_close($ch);
});