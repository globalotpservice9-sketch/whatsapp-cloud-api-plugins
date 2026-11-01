<?php
/**
 * Plugin Name: 5MinutesAPI - WooCommerce 2-Way COD Verification
 * Description: Sends a Meta-approved WhatsApp Template. Requires a configured 2-Way Button in 5MinutesAPI Dashboard.
 */
if (!defined('ABSPATH')) exit;

define('FIVEMIN_WABA_KEY', 'YOUR_5MINUTESAPI_KEY_HERE');

add_action('woocommerce_new_order', 'fivemin_waba_send_order_alert', 10, 1);

function fivemin_waba_send_order_alert($order_id) {
    if (!$order_id) return;
    $order = wc_get_order($order_id);
    $phone = preg_replace('/[^0-9]/', '', $order->get_billing_phone());
    if (empty($phone)) return;

    $payload = json_encode([
        'to' => $phone,
        'whatsapp_template' => 'order_update_verify',
        'record_id' => (string)$order_id,
        'callback_url' => get_site_url() . '/wp-json/5min/v1/callback' // WooCommerce API Endpoint for callback
    ]);

    wp_remote_post('https://api.5minutesapi.com/v1/send-message', [
        'method'  => 'POST',
        'headers' => [ 'Authorization' => 'Bearer ' . FIVEMIN_WABA_KEY, 'Content-Type'  => 'application/json' ],
        'body' => $payload,
    ]);
}
// Note: Create a REST endpoint in WP to handle the callback and update order status.
