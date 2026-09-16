import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { requireAdminOrService } from "../_shared/auth-guard.ts";
import { escapeHtml } from "../_shared/escape-html.ts";
import { rateLimit, clientIp } from "../_shared/rate-limit.ts";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/microsoft_outlook";

const EMAIL_RE = /^[^\s@,;<>"']+@[^\s@,;<>"']+\.[^\s@,;<>"']+$/;

type Recipient = { email: string; name?: string; address?: string };

const sanitize = (s: string) =>
  s
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, "");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const auth = await requireAdminOrService(req);
    if (!auth.ok) return json({ error: auth.error }, auth.status);

    if (!rateLimit(`outlook-bulk:${clientIp(req)}`, 10, 60_000)) {
      return json({ error: "Too many send requests. Please wait a minute and try again." }, 429);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const CONNECTION_KEY = Deno.env.get("MICROSOFT_OUTLOOK_API_KEY");
    if (!LOVABLE_API_KEY || !CONNECTION_KEY) {
      return json(
        {
          error:
            "Outlook 365 is not connected yet. Connect the Microsoft Outlook account in Lovable, then try again.",
        },
        503,
      );
    }

    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") return json({ error: "Invalid request body" }, 400);

    const subjectRaw = String((payload as Record<string, unknown>).subject ?? "").trim();
    const bodyRaw = String((payload as Record<string, unknown>).body ?? "").trim();
    const recipientsRaw = (payload as Record<string, unknown>).recipients;

    if (!subjectRaw || subjectRaw.length > 255) {
      return json({ error: "Subject is required and must be under 255 characters." }, 400);
    }
    if (!bodyRaw || bodyRaw.length > 20000) {
      return json({ error: "Message is required and must be under 20000 characters." }, 400);
    }
    if (!Array.isArray(recipientsRaw) || recipientsRaw.length === 0) {
      return json({ error: "At least one recipient is required." }, 400);
    }
    if (recipientsRaw.length > 200) {
      return json({ error: "A maximum of 200 recipients can be emailed at once." }, 400);
    }

    const recipients: Recipient[] = [];
    for (const r of recipientsRaw) {
      const email = String((r as Recipient)?.email ?? "").trim();
      if (!EMAIL_RE.test(email)) {
        return json({ error: `Invalid recipient email address: ${email || "(empty)"}` }, 400);
      }
      recipients.push({
        email,
        name: String((r as Recipient)?.name ?? "").trim(),
        address: String((r as Recipient)?.address ?? "").trim(),
      });
    }

    const results: { email: string; ok: boolean; error?: string }[] = [];

    for (const r of recipients) {
      const fill = (text: string) =>
        text
          .replace(/\{\{\s*customer_name\s*\}\}/gi, r.name || "")
          .replace(/\{\{\s*address\s*\}\}/gi, r.address || "");

      const subject = sanitize(fill(subjectRaw)).slice(0, 255);
      const htmlBody =
        `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5">` +
        escapeHtml(sanitize(fill(bodyRaw))).replace(/\r?\n/g, "<br>") +
        `</div>`;

      try {
        const res = await fetch(`${GATEWAY_URL}/me/sendMail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": CONNECTION_KEY,
          },
          body: JSON.stringify({
            message: {
              subject,
              body: { contentType: "HTML", content: htmlBody },
              toRecipients: [{ emailAddress: { address: r.email } }],
            },
            saveToSentItems: true,
          }),
        });

        if (!res.ok) {
          const errBody = await res.text();
          console.error(`Outlook sendMail failed [${res.status}] for ${r.email}: ${errBody}`);
          results.push({ email: r.email, ok: false, error: `[${res.status}] ${errBody.slice(0, 300)}` });
        } else {
          results.push({ email: r.email, ok: true });
        }
      } catch (e) {
        console.error(`Outlook sendMail threw for ${r.email}:`, e);
        results.push({ email: r.email, ok: false, error: (e as Error).message });
      }

      await new Promise((resolve) => setTimeout(resolve, 120));
    }

    const sent = results.filter((r) => r.ok).length;
    return json({ sent, failed: results.length - sent, results });
  } catch (e) {
    console.error("send-outlook-bulk error:", e);
    return json({ error: (e as Error).message || "Unexpected error" }, 500);
  }
});
