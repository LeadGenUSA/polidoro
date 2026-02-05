import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EstimateFormData {
  customer: string;
  email: string;
  costOfJob: string;
  boilerTypes: string[];
  boilerSize: string;
  baseboard: string;
  buriedTankSize: string[];
  pumpAndFoam: string;
  tankSand: string;
  buriedPriceAdditional: string;
  interiorTankRemoved: string;
  interiorTankBehindWall: string;
  interiorPriceAdditional: string;
  exterior275Removal: string;
  exteriorPriceAdditional: string;
  customerResponsibleForTank: string;
  tankNotes: string;
  steamSystem: string;
  thermostatsIncluded: string;
  existingChimneyLined: string;
  ventLocation: string;
  numberOfZones: string;
  zoneSize: string;
  boilerAccess: string;
  gasNeededFor: string[];
  gasInHouse: string;
  gasNotes: string;
  meterLocation: string;
  photos: string[];
}

const formatValue = (value: string | string[] | undefined): string => {
  if (!value || (Array.isArray(value) && value.length === 0)) return 'N/A';
  if (Array.isArray(value)) return value.join(', ');
  return value;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: EstimateFormData = await req.json();

    const SMTP_HOST = Deno.env.get("SMTP_HOST");
    const SMTP_PORT = Deno.env.get("SMTP_PORT");
    const SMTP_USER = Deno.env.get("SMTP_USER");
    const SMTP_PASS = Deno.env.get("SMTP_PASS");

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP configuration is missing");
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
    .header { background-color: #1e3a5f; color: white; padding: 20px; text-align: center; }
    .section { margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; }
    .section-title { color: #e67e22; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #e67e22; padding-bottom: 5px; }
    .subsection-title { color: #1e3a5f; font-size: 14px; font-weight: bold; margin: 15px 0 10px 0; }
    .field { margin: 8px 0; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .photo-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
    .photo-thumb { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Estimate Form Submission</h1>
  </div>

  <div class="section">
    <div class="section-title">CUSTOMER INFO</div>
    <div class="field"><span class="label">Customer:</span> <span class="value">${formData.customer}</span></div>
    <div class="field"><span class="label">Email:</span> <span class="value">${formData.email}</span></div>
    <div class="field"><span class="label">Cost of Job:</span> <span class="value">${formatValue(formData.costOfJob)}</span></div>
  </div>

  <div class="section">
    <div class="section-title">BOILER INFO</div>
    <div class="field"><span class="label">Boiler Type:</span> <span class="value">${formatValue(formData.boilerTypes)}</span></div>
    <div class="field"><span class="label">Boiler Size:</span> <span class="value">${formatValue(formData.boilerSize)}</span></div>
    <div class="field"><span class="label">Baseboard:</span> <span class="value">${formatValue(formData.baseboard)}</span></div>
  </div>

  <div class="section">
    <div class="section-title">OIL TANK</div>
    
    <div class="subsection-title">Buried Tanks:</div>
    <div class="field"><span class="label">Buried Tank Size:</span> <span class="value">${formatValue(formData.buriedTankSize)}</span></div>
    <div class="field"><span class="label">Pump & Foam:</span> <span class="value">${formatValue(formData.pumpAndFoam)}</span></div>
    <div class="field"><span class="label">Tank Sand:</span> <span class="value">${formatValue(formData.tankSand)}</span></div>
    <div class="field"><span class="label">Price Additional:</span> <span class="value">${formatValue(formData.buriedPriceAdditional)}</span></div>
    
    <div class="subsection-title">Interior Tanks:</div>
    <div class="field"><span class="label">Interior Tank Removed:</span> <span class="value">${formatValue(formData.interiorTankRemoved)}</span></div>
    <div class="field"><span class="label">Interior Tank Behind Wall:</span> <span class="value">${formatValue(formData.interiorTankBehindWall)}</span></div>
    <div class="field"><span class="label">Price Additional:</span> <span class="value">${formatValue(formData.interiorPriceAdditional)}</span></div>
    
    <div class="subsection-title">Exterior Tanks:</div>
    <div class="field"><span class="label">Exterior 275 Tank Removal:</span> <span class="value">${formatValue(formData.exterior275Removal)}</span></div>
    <div class="field"><span class="label">Price Additional:</span> <span class="value">${formatValue(formData.exteriorPriceAdditional)}</span></div>
    
    <div class="subsection-title">Other:</div>
    <div class="field"><span class="label">Customer Responsible For Tank Removal:</span> <span class="value">${formatValue(formData.customerResponsibleForTank)}</span></div>
    <div class="field"><span class="label">Notes:</span> <span class="value">${formatValue(formData.tankNotes)}</span></div>
  </div>

  <div class="section">
    <div class="section-title">INSTALLATION NOTES/VENTING</div>
    <div class="field"><span class="label">Steam System:</span> <span class="value">${formatValue(formData.steamSystem)}</span></div>
    <div class="field"><span class="label">Thermostats Included:</span> <span class="value">${formatValue(formData.thermostatsIncluded)}</span></div>
    <div class="field"><span class="label">Existing Chimney Lined:</span> <span class="value">${formatValue(formData.existingChimneyLined)}</span></div>
    <div class="field"><span class="label">Vent Location for Boiler:</span> <span class="value">${formatValue(formData.ventLocation)}</span></div>
    <div class="field"><span class="label">Number of Zones:</span> <span class="value">${formatValue(formData.numberOfZones)}</span></div>
    <div class="field"><span class="label">Zone Size:</span> <span class="value">${formatValue(formData.zoneSize)}</span></div>
    <div class="field"><span class="label">Boiler Access:</span> <span class="value">${formatValue(formData.boilerAccess)}</span></div>
  </div>

  <div class="section">
    <div class="section-title">GAS SERVICE/PIPING</div>
    <div class="field"><span class="label">Gas Needed For:</span> <span class="value">${formatValue(formData.gasNeededFor)}</span></div>
    <div class="field"><span class="label">Gas in House:</span> <span class="value">${formatValue(formData.gasInHouse)}</span></div>
    <div class="field"><span class="label">Notes:</span> <span class="value">${formatValue(formData.gasNotes)}</span></div>
    <div class="field"><span class="label">Meter Location:</span> <span class="value">${formatValue(formData.meterLocation)}</span></div>
  </div>

  ${formData.photos && formData.photos.length > 0 ? `
  <div class="section">
    <div class="section-title">PHOTOS</div>
    <div class="photo-grid">
      ${formData.photos.map((url, index) => `
        <a href="${url}" target="_blank">
          <img src="${url}" alt="Photo ${index + 1}" class="photo-thumb" />
        </a>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>This estimate request was submitted from the Big City Plumbing & Heating website.</p>
  </div>
</body>
</html>
    `;

    // Use nodemailer-style SMTP sending
    const emailPayload = {
      from: SMTP_USER,
      to: "mike@bigcityph.com",
      replyTo: formData.email,
      subject: `Estimate Request from ${formData.customer}`,
      html: emailHtml,
    };

    // Send email using fetch to SMTP2GO or similar API
    // For Hostgator SMTP, we'll use the raw SMTP approach
    const response = await fetch(`https://${SMTP_HOST}:${SMTP_PORT}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${SMTP_USER}:${SMTP_PASS}`)}`,
      },
      body: JSON.stringify(emailPayload),
    }).catch(async () => {
      // Fallback: Use Deno's built-in SMTP client approach via Resend or similar
      // For now, we'll use the same pattern as send-contact-form
      const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
      
      const client = new SMTPClient({
        connection: {
          hostname: SMTP_HOST,
          port: parseInt(SMTP_PORT),
          tls: true,
          auth: {
            username: SMTP_USER,
            password: SMTP_PASS,
          },
        },
      });

      await client.send({
        from: SMTP_USER,
        to: "mike@bigcityph.com",
        replyTo: formData.email,
        subject: `Estimate Request from ${formData.customer}`,
        content: "Please view this email in an HTML-capable email client.",
        html: emailHtml,
      });

      await client.close();
      return { ok: true };
    });

    return new Response(
      JSON.stringify({ success: true, message: "Estimate request sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error sending estimate form:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send estimate request" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
