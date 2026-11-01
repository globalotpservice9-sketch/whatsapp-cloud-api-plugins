# 5MinutesAPI - Odoo ERP Action
import json, urllib.request

API_KEY = "YOUR_5MINUTESAPI_KEY_HERE"
TEMPLATE_NAME = "invoice_billing_notice" # <-- Ensure this matches Meta
ENDPOINT = "https://api.5minutesapi.com/v1/send-message"

for record in records:
    raw_phone = getattr(record, "mobile", "") or getattr(record, "phone", "")
    if not raw_phone and hasattr(record, "partner_id"):
        raw_phone = record.partner_id.mobile or record.partner_id.phone or ""
        
    clean_phone = "".join([c for c in str(raw_phone) if c.isdigit()])

    if clean_phone:
        payload = json.dumps({"to": clean_phone, "whatsapp_template": TEMPLATE_NAME}).encode("utf-8")
        req = urllib.request.Request(ENDPOINT, data=payload, headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }, method="POST")
        try:
            urllib.request.urlopen(req, timeout=5)
        except:
            pass