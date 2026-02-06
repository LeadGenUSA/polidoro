import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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
  ccName?: string;
  ccAddress?: string;
  ccZip?: string;
  ccNumber?: string;
  ccExpiration?: string;
  ccSecurityCode?: string;
  photos?: string[];
}

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

// Keep HTML to a single compact line to avoid transport re-wrapping that can
// show up as quoted-printable artifacts (e.g. "=20") in some mail clients.
const compactEmailHtml = (html: string) =>
  html
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/\n/g, "")
    .trim();

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: WorkOrderData = await req.json();
    console.log("Processing work order for:", data.customerName);

    // Mask credit card number for email (show only last 4 digits)
    const maskedCCNumber = data.ccNumber 
      ? `****-****-****-${data.ccNumber.slice(-4)}` 
      : 'Not provided';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #1e3a5f; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
          Work Order Submission
        </h1>
        
        <h2 style="color: #1e3a5f; margin-top: 24px;">Customer Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Customer Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.customerName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.streetAddress}${data.aptNumber ? `, Apt ${data.aptNumber}` : ''}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Zip Code:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.zipCode}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
        </table>

        <h2 style="color: #1e3a5f; margin-top: 24px;">Job Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Error Code:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.errorCode || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Make & Model:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.makeModel || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Serial #:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.serialNumber || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>RGA# & Navien Tech:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.rgaNavienTech || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Water Sampling PH:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.waterSamplingPH || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Parts Under Warranty:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.partsUnderWarranty ? data.partsUnderWarranty.toUpperCase() : 'N/A'}</td></tr>
        </table>
        
        <h3 style="color: #1e3a5f; margin-top: 16px;">Job Description</h3>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${data.jobDescription}</div>
        
        ${data.recommendations ? `
        <h3 style="color: #1e3a5f; margin-top: 16px;">Recommendations</h3>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${data.recommendations}</div>
        ` : ''}

        ${data.photos && data.photos.length > 0 ? `
        <h3 style="color: #1e3a5f; margin-top: 16px;">Photos</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          ${data.photos.map((url, index) => `
            <a href="${url}" target="_blank" style="display: inline-block;">
              <img src="${url}" alt="Work order photo ${index + 1}" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid #ddd;" />
            </a>
          `).join('')}
        </div>
        ` : ''}

        <h2 style="color: #1e3a5f; margin-top: 24px;">Technician Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tech On Job:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.techOnJob || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Hours On Job:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.hoursOnJob || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.jobDate || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Job Completed:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.jobCompleted ? data.jobCompleted.toUpperCase() : 'N/A'}</td></tr>
        </table>

        <h2 style="color: #1e3a5f; margin-top: 24px;">Billing Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Method:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formatPaymentMethod(data.paymentMethod)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Billing Status:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formatBillingStatus(data.billingStatus)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Charges:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.totalCharges || 'N/A'}</td></tr>
        </table>

        ${data.ccName ? `
        <h2 style="color: #1e3a5f; margin-top: 24px;">Credit Card Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name on Card:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.ccName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Billing Address:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.ccAddress || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Billing Zip:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.ccZip || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Card Number:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${maskedCCNumber}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Expiration:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.ccExpiration || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Security Code:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.ccSecurityCode ? '***' : 'N/A'}</td></tr>
        </table>
        ` : ''}

        <div style="margin-top: 24px; padding: 16px; background: #e8f5e9; border-radius: 8px;">
          <p style="margin: 0; color: #2e7d32;"><strong>✓ Customer has accepted the terms and authorized this work order.</strong></p>
        </div>

        <hr style="margin-top: 32px; border: none; border-top: 1px solid #ddd;" />
        <p style="color: #666; font-size: 12px;">
          This work order was submitted via the Big City Plumbing & Heating website.
        </p>
      </div>
    `;

    // Build recipient list
    const recipients = ['mike@bigcityph.com'];
    if (data.emailTo) {
      recipients.push(data.emailTo);
    }

    // Create SMTP client using Hostgator credentials
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get("SMTP_HOST")!,
        port: parseInt(Deno.env.get("SMTP_PORT") || "465"),
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USER")!,
          password: Deno.env.get("SMTP_PASS")!,
        },
      },
    });

    await client.send({
      from: Deno.env.get("SMTP_USER")!,
      to: recipients,
      subject: `Work Order - ${data.customerName} - ${data.streetAddress}`,
      content: "Please view this email in an HTML-compatible email client.",
      html: compactEmailHtml(emailHtml),
    });

    await client.close();

    console.log("Work order email sent successfully via SMTP");

    // Save submission to database (excluding credit card data for security)
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
        status: 'new'
        // NOTE: Credit card data (ccName, ccAddress, ccZip, ccNumber, ccExpiration, ccSecurityCode) 
        // is intentionally NOT stored in the database for security compliance
      });

      if (dbError) {
        console.error("Error saving work order to database:", dbError);
      } else {
        console.log("Work order submission saved to database");
      }
    } catch (dbErr) {
      console.error("Database save failed:", dbErr);
      // Don't fail the request if DB save fails - email was already sent
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending work order email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
