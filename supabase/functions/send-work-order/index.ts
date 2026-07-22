import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { verifyTurnstile } from "../_shared/verify-turnstile.ts";
import { sendEmail } from "../_shared/send-email.ts";
import { escapeHtml, escapeUrl } from "../_shared/escape-html.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WorkOrderData {
  customerName: string;
  streetAddress: string;
  aptNumber?: string;
  phone: string;
  zipCode: string;
  email: string;
  emailTo?: string;
  calendarInfo?: string;
  boilerType?: string;
  errorCode?: string;
  makeModel?: string;
  serialNumber?: string;
  jobDescription: string;
  recommendations?: string;
  rgaNavienTech?: string;
  waterSamplingPH?: string;
  partsUnderWarranty?: string;
  techOnJob?: string;
  hoursOnJob?: string;
  jobDate?: string;
  jobCompleted?: string;
  paymentMethod?: string;
  billingStatus?: string;
  totalCharges?: string;
  photos?: string[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatPaymentMethod = (method?: string): string => {
  const methods: Record<string, string> = {
    check: 'Check',
    cash: 'Cash',
    credit_card: 'Credit Card',
    bill_navien: 'Bill Navien',
  };
  return method ? methods[method] || method : 'Not specified';
};

const formatBillingStatus = (status?: string): string => {
  const statuses: Record<string, string> = {
    estimate_needed: 'Estimate Needed',
    email_paid_invoice: 'Email Paid Invoice',
    bill_customer: 'Bill Customer',
    parts_ordered: 'Parts Ordered - Make Appointment',
  };
  return status ? statuses[status] || status : 'Not specified';
};

const compactEmailHtml = (html: string) =>
  html
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/\n/g, "")
    .trim();

const cap = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { turnstileToken, ...raw }: WorkOrderData & { turnstileToken?: string } = await req.json();

    const data: WorkOrderData = {
      customerName: cap(raw.customerName, 200),
      streetAddress: cap(raw.streetAddress, 300),
      aptNumber: cap(raw.aptNumber, 50) || undefined,
      phone: cap(raw.phone, 50),
      zipCode: cap(raw.zipCode, 20),
      email: cap(raw.email, 255),
      emailTo: cap(raw.emailTo, 255) || undefined,
      calendarInfo: cap(raw.calendarInfo, 2000) || undefined,
      boilerType: cap(raw.boilerType, 100) || undefined,
      errorCode: cap(raw.errorCode, 100) || undefined,
      makeModel: cap(raw.makeModel, 200) || undefined,
      serialNumber: cap(raw.serialNumber, 100) || undefined,
      jobDescription: cap(raw.jobDescription, 5000),
      recommendations: cap(raw.recommendations, 5000) || undefined,
      rgaNavienTech: cap(raw.rgaNavienTech, 200) || undefined,
      waterSamplingPH: cap(raw.waterSamplingPH, 100) || undefined,
      partsUnderWarranty: cap(raw.partsUnderWarranty, 20) || undefined,
      techOnJob: cap(raw.techOnJob, 200) || undefined,
      hoursOnJob: cap(raw.hoursOnJob, 50) || undefined,
      jobDate: cap(raw.jobDate, 50) || undefined,
      jobCompleted: cap(raw.jobCompleted, 20) || undefined,
      paymentMethod: cap(raw.paymentMethod, 50) || undefined,
      billingStatus: cap(raw.billingStatus, 50) || undefined,
      totalCharges: cap(raw.totalCharges, 50) || undefined,
      photos: Array.isArray(raw.photos)
        ? raw.photos.filter((u) => typeof u === "string" && /^https?:\/\//i.test(u)).slice(0, 20)
        : [],
    };

    if (!data.customerName || !data.streetAddress || !data.phone || !data.email || !data.jobDescription) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!EMAIL_RE.test(data.email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    // Strict allowlist for optional additional recipient — only Big City company mailboxes.
    if (data.emailTo) {
      const okDomain = /@bigcityplumbing\.com$/i.test(data.emailTo);
      if (!EMAIL_RE.test(data.emailTo) || !okDomain) {
        return new Response(JSON.stringify({ error: "Invalid additional recipient" }), {
          status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    console.log("Processing work order for:", data.customerName);

    const isValid = await verifyTurnstile(turnstileToken);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Bot verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #1e3a5f; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
          Work Order Submission
        </h1>

        <h2 style="color: #1e3a5f; margin-top: 24px;">Customer Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Customer Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.customerName)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.streetAddress)}${data.aptNumber ? `, Apt ${escapeHtml(data.aptNumber)}` : ''}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.phone)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Zip Code:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.zipCode)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.email)}</td></tr>
          ${data.calendarInfo ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Calendar Info:</strong></td><td style="padding: 8px; border: 1px solid #ddd; white-space: pre-wrap;">${escapeHtml(data.calendarInfo)}</td></tr>` : ''}
        </table>

        <h2 style="color: #1e3a5f; margin-top: 24px;">Job Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Boiler Type:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.boilerType || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Error Code:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.errorCode || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Make & Model:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.makeModel || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Serial #:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.serialNumber || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>RGA# & Navien Tech:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.rgaNavienTech || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Water Sampling PH:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.waterSamplingPH || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Parts Under Warranty:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.partsUnderWarranty ? data.partsUnderWarranty.toUpperCase() : 'N/A')}</td></tr>
        </table>

        <h3 style="color: #1e3a5f; margin-top: 16px;">Job Description</h3>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${escapeHtml(data.jobDescription)}</div>

        ${data.recommendations ? `
        <h3 style="color: #1e3a5f; margin-top: 16px;">Recommendations</h3>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${escapeHtml(data.recommendations)}</div>
        ` : ''}

        ${data.photos && data.photos.length > 0 ? `
        <h3 style="color: #1e3a5f; margin-top: 16px;">Photos</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          ${data.photos.map((url, index) => {
            const safeUrl = escapeUrl(url);
            if (!safeUrl) return '';
            return `<a href="${safeUrl}" target="_blank" style="display: inline-block;">
              <img src="${safeUrl}" alt="Work order photo ${index + 1}" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #ddd;" />
            </a>`;
          }).join('')}
        </div>
        ` : ''}

        <h2 style="color: #1e3a5f; margin-top: 24px;">Technician Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tech On Job:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.techOnJob || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Hours On Job:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.hoursOnJob || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.jobDate || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Job Completed:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.jobCompleted ? data.jobCompleted.toUpperCase() : 'N/A')}</td></tr>
        </table>

        <h2 style="color: #1e3a5f; margin-top: 24px;">Billing Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Method:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formatPaymentMethod(data.paymentMethod))}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Billing Status:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(formatBillingStatus(data.billingStatus))}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Charges:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.totalCharges || 'N/A')}</td></tr>
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #e8f5e9; border-radius: 8px;">
          <p style="margin: 0; color: #2e7d32;"><strong>Customer has accepted the terms and authorized this work order.</strong></p>
        </div>

        <hr style="margin-top: 32px; border: none; border-top: 1px solid #ddd;" />
        <p style="color: #666; font-size: 12px;">
          This work order was submitted via the Big City Plumbing & Heating website.
        </p>
      </div>
    `;

    const recipients = [
      'mike@bigcityplumbing.com',
      'diane@bigcityplumbing.com',
      'info@bigcityplumbing.com',
    ];
    if (data.emailTo) recipients.push(data.emailTo);

    await sendEmail({
      to: recipients,
      subject: `Work Order - ${data.customerName} - ${data.streetAddress}`,
      html: compactEmailHtml(emailHtml),
    });

    console.log("Work order email sent successfully via Resend");

    try {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      const { error: dbError } = await supabaseAdmin.from('work_order_submissions').insert({
        customer_name: data.customerName,
        street_address: data.streetAddress,
        apt_number: data.aptNumber || null,
        phone: data.phone,
        zip_code: data.zipCode,
        email: data.email,
        email_to: data.emailTo || null,
        error_code: data.errorCode || null,
        make_model: data.makeModel || null,
        serial_number: data.serialNumber || null,
        job_description: data.jobDescription,
        recommendations: data.recommendations || null,
        rga_navien_tech: data.rgaNavienTech || null,
        water_sampling_ph: data.waterSamplingPH || null,
        parts_under_warranty: data.partsUnderWarranty || null,
        tech_on_job: data.techOnJob || null,
        hours_on_job: data.hoursOnJob || null,
        job_date: data.jobDate || null,
        job_completed: data.jobCompleted || null,
        payment_method: data.paymentMethod || null,
        billing_status: data.billingStatus || null,
        total_charges: data.totalCharges || null,
        photos: data.photos || [],
        calendar_info: data.calendarInfo || null,
        boiler_type: data.boilerType || null,
        status: 'new'
      });

      if (dbError) {
        console.error("Error saving work order to database:", dbError);
      } else {
        console.log("Work order submission saved to database");
      }
    } catch (dbErr) {
      console.error("Database save failed:", dbErr);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending work order email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to submit work order" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
