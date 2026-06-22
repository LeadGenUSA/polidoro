import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendEmail } from "../_shared/send-email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

const compactHtml = (h: string) =>
  h.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").replace(/\n{2,}/g, "\n").replace(/\n/g, "").trim();

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// In-memory rate limiter: 5 requests / minute / IP (per instance)
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;
const buckets = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= RATE_LIMIT) {
    buckets.set(ip, arr);
    return true;
  }
  arr.push(now);
  buckets.set(ip, arr);
  return false;
}

interface Payload {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  serviceType?: string;
  message?: string;
  secret?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  if (rateLimited(ip)) return json(429, { ok: false, error: "rate_limited" });

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  const expected = Deno.env.get("APP_FORM_SECRET");
  if (!expected) {
    console.error("APP_FORM_SECRET not configured");
    return json(500, { ok: false, error: "server_misconfigured" });
  }
  if (!body.secret || !constantTimeEqual(body.secret, expected)) {
    return json(401, { ok: false, error: "unauthorized" });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const address = (body.address ?? "").trim();
  const serviceType = (body.serviceType ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || name.length > 200) return json(400, { ok: false, error: "invalid_name" });
  if (!phone || phone.length > 50) return json(400, { ok: false, error: "invalid_phone" });
  if (!email || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return json(400, { ok: false, error: "invalid_email" });
  if (!address || address.length > 500) return json(400, { ok: false, error: "invalid_address" });
  if (!message || message.length > 5000) return json(400, { ok: false, error: "invalid_message" });
  if (serviceType.length > 200) return json(400, { ok: false, error: "invalid_service_type" });

  const serviceRow = serviceType
    ? `<div class="field"><span class="label">Service type:</span> <span class="value">${escapeHtml(serviceType)}</span></div>`
    : "";

  const html = compactHtml(`
<!DOCTYPE html>
<html><head><style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
.header h1 { margin: 0; font-size: 24px; }
.section { background: #f9f9f9; padding: 20px; margin: 15px 0; border-radius: 5px; }
.section-title { color: #1e3a5f; font-weight: bold; margin-bottom: 10px; font-size: 16px; border-bottom: 2px solid #f97316; padding-bottom: 5px; }
.field { margin: 10px 0; }
.label { font-weight: bold; color: #555; }
.value { color: #333; }
.message-box { background: white; padding: 15px; border-left: 3px solid #f97316; margin-top: 10px; white-space: pre-wrap; }
.footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; }
</style></head><body>
<div class="container">
<div class="header"><h1>New App Service Request</h1></div>
<div class="section">
<div class="section-title">Customer Information</div>
<div class="field"><span class="label">Name:</span> <span class="value">${escapeHtml(name)}</span></div>
<div class="field"><span class="label">Phone:</span> <span class="value">${escapeHtml(phone)}</span></div>
<div class="field"><span class="label">Email:</span> <span class="value">${escapeHtml(email)}</span></div>
<div class="field"><span class="label">Address:</span> <span class="value">${escapeHtml(address)}</span></div>
${serviceRow}
</div>
<div class="section">
<div class="section-title">Message</div>
<div class="message-box">${escapeHtml(message)}</div>
</div>
<div class="footer">Submitted via the Big City Plumbing and Heating mobile app.</div>
</div>
</body></html>
  `);

  const subject = serviceType
    ? `App Service Request (${serviceType}): ${name}`
    : `App Service Request: ${name}`;

  try {
    await sendEmail({
      to: ["mike@bigcityplumbing.com"],
      subject,
      html,
      replyTo: email,
    });
  } catch (e) {
    console.error("Email send failed:", e);
    return json(500, { ok: false, error: "email_send_failed" });
  }

  return json(200, { ok: true });
};

serve(handler);
