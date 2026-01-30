import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: WorkOrderData = await req.json();

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

    // Send to main email
    const recipients = ['mike@bigcityplumbing.com'];
    
    // Also send a copy to the emailTo field if provided
    if (data.emailTo) {
      recipients.push(data.emailTo);
    }

    const emailResponse = await resend.emails.send({
      from: "Big City Plumbing <noreply@bigcityplumbing.com>",
      to: recipients,
      subject: `Work Order - ${data.customerName} - ${data.streetAddress}`,
      html: emailHtml,
    });

    console.log("Work order email sent successfully:", emailResponse);

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
