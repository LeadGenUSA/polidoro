import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { verifyTurnstile } from "../_shared/verify-turnstile.ts";
import { sendEmail } from "../_shared/send-email.ts";
import { escapeHtml } from "../_shared/escape-html.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const compactEmailHtml = (html: string) =>
  html
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/\n/g, "")
    .trim();

interface ContactFormData {
  service?: string;
  name: string;
  city?: string;
  email: string;
  phone: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Contact form submission received");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { turnstileToken, ...raw }: ContactFormData & { turnstileToken?: string } = await req.json();

    // Basic validation
    const data: ContactFormData = {
      name: String(raw.name ?? "").trim().slice(0, 100),
      email: String(raw.email ?? "").trim().slice(0, 255),
      phone: String(raw.phone ?? "").trim().slice(0, 50),
      message: String(raw.message ?? "").trim().slice(0, 2000),
      service: raw.service ? String(raw.service).trim().slice(0, 100) : undefined,
      city: raw.city ? String(raw.city).trim().slice(0, 100) : undefined,
    };

    if (!data.name || !data.email || !data.phone || !data.message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Processing contact form from:", data.name);

    const isValid = await verifyTurnstile(turnstileToken);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Bot verification failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const serviceRow = data.service
      ? `<div class="field"><span class="label">Service Needed:</span> <span class="value">${escapeHtml(data.service)}</span></div>`
      : "";

    const cityRow = data.city
      ? `<div class="field"><span class="label">City:</span> <span class="value">${escapeHtml(data.city)}</span></div>`
      : "";

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
<style>
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
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>New Contact Form Submission</h1>
</div>
<div class="section">
<div class="section-title">Customer Information</div>
${serviceRow}
<div class="field"><span class="label">Name:</span> <span class="value">${escapeHtml(data.name)}</span></div>
${cityRow}
<div class="field"><span class="label">Email:</span> <span class="value">${escapeHtml(data.email)}</span></div>
<div class="field"><span class="label">Phone:</span> <span class="value">${escapeHtml(data.phone)}</span></div>
</div>
<div class="section">
<div class="section-title">Message</div>
<div class="message-box">${escapeHtml(data.message)}</div>
</div>
<div class="footer">
This message was submitted via the Big City Plumbing & Heating website contact form.
</div>
</div>
</body>
</html>
    `;

    const subject = data.service
      ? `Website Contact (${data.service}): ${data.name}`
      : `Website Contact: ${data.name}`;

    await sendEmail({
      to: ["mike@bigcityplumbing.com", "diane@bigcityplumbing.com", "info@bigcityplumbing.com"],
      subject,
      html: compactEmailHtml(emailHtml),
      replyTo: data.email,
    });

    console.log("Contact form email sent successfully via Resend");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send message" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
