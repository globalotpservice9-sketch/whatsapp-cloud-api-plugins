export async function POST(request) {
  try {
    const body = await request.json();
    const rawPhone = body?.user?.phone || body?.phone || body?.to || "";
    const cleanPhone = String(rawPhone).replace(/[^0-9]/g, "");
    if (!cleanPhone) return Response.json({ error: "Missing phone" }, { status: 400 });

    const res = await fetch("https://api.5minutesapi.com/v1/send-message", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_5MINUTESAPI_KEY_HERE",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: cleanPhone,
        whatsapp_template: "global_otp_auth" // Use your OTP template
      }),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}