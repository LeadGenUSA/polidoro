import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SurveyData {
  customerName: string;
  email: string;
  phone?: string;
  serviceDate?: string;
  technicianName?: string;
  overallSatisfaction?: string;
  qualityOfWork?: string;
  timeliness?: string;
  professionalism?: string;
  communication?: string;
  valueForMoney?: string;
  wouldRecommend?: string;
  useAgain?: string;
  whatDidWell?: string;
  areasToImprove?: string;
  additionalComments?: string;
}

const formatRating = (value?: string): string => {
  if (!value) return 'Not rated';
  return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatYesNoMaybe = (value?: string): string => {
  if (!value) return 'Not answered';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Customer survey submission received");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: SurveyData = await req.json();
    console.log("Processing survey from:", data.customerName);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
          .section { background: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .section-title { color: #1e3a5f; font-weight: bold; margin-bottom: 10px; font-size: 16px; border-bottom: 2px solid #f97316; padding-bottom: 5px; }
          .field { margin: 8px 0; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .rating-excellent, .rating-very_satisfied { color: #22c55e; font-weight: bold; }
          .rating-good, .rating-satisfied { color: #84cc16; }
          .rating-average, .rating-neutral { color: #eab308; }
          .rating-below_average, .rating-dissatisfied { color: #f97316; }
          .rating-poor, .rating-very_dissatisfied { color: #ef4444; font-weight: bold; }
          .feedback { background: white; padding: 10px; border-left: 3px solid #f97316; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Customer Survey Submission</h1>
          </div>
          
          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="field"><span class="label">Name:</span> <span class="value">${data.customerName}</span></div>
            <div class="field"><span class="label">Email:</span> <span class="value">${data.email}</span></div>
            ${data.phone ? `<div class="field"><span class="label">Phone:</span> <span class="value">${data.phone}</span></div>` : ''}
            ${data.serviceDate ? `<div class="field"><span class="label">Service Date:</span> <span class="value">${data.serviceDate}</span></div>` : ''}
            ${data.technicianName ? `<div class="field"><span class="label">Technician:</span> <span class="value">${data.technicianName}</span></div>` : ''}
          </div>
          
          <div class="section">
            <div class="section-title">Overall Satisfaction</div>
            <div class="field">
              <span class="label">Rating:</span> 
              <span class="value rating-${data.overallSatisfaction || ''}">${formatRating(data.overallSatisfaction)}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Service Ratings</div>
            <div class="field">
              <span class="label">Quality of Work:</span> 
              <span class="value rating-${data.qualityOfWork || ''}">${formatRating(data.qualityOfWork)}</span>
            </div>
            <div class="field">
              <span class="label">Timeliness:</span> 
              <span class="value rating-${data.timeliness || ''}">${formatRating(data.timeliness)}</span>
            </div>
            <div class="field">
              <span class="label">Professionalism:</span> 
              <span class="value rating-${data.professionalism || ''}">${formatRating(data.professionalism)}</span>
            </div>
            <div class="field">
              <span class="label">Communication:</span> 
              <span class="value rating-${data.communication || ''}">${formatRating(data.communication)}</span>
            </div>
            <div class="field">
              <span class="label">Value for Money:</span> 
              <span class="value rating-${data.valueForMoney || ''}">${formatRating(data.valueForMoney)}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Recommendations</div>
            <div class="field">
              <span class="label">Would Recommend:</span> 
              <span class="value">${formatYesNoMaybe(data.wouldRecommend)}</span>
            </div>
            <div class="field">
              <span class="label">Would Use Again:</span> 
              <span class="value">${formatYesNoMaybe(data.useAgain)}</span>
            </div>
          </div>
          
          ${data.whatDidWell || data.areasToImprove || data.additionalComments ? `
          <div class="section">
            <div class="section-title">Additional Feedback</div>
            ${data.whatDidWell ? `
              <div class="field">
                <span class="label">What We Did Well:</span>
                <div class="feedback">${data.whatDidWell}</div>
              </div>
            ` : ''}
            ${data.areasToImprove ? `
              <div class="field">
                <span class="label">Areas to Improve:</span>
                <div class="feedback">${data.areasToImprove}</div>
              </div>
            ` : ''}
            ${data.additionalComments ? `
              <div class="field">
                <span class="label">Additional Comments:</span>
                <div class="feedback">${data.additionalComments}</div>
              </div>
            ` : ''}
          </div>
          ` : ''}
          
          <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            This survey was submitted via the Big City Plumbing & Heating website.
          </p>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Big City Plumbing <noreply@bigcityph.com>",
      to: ["mike@bigcityph.com"],
      subject: `Customer Survey from ${data.customerName}`,
      html: emailHtml,
      reply_to: data.email,
    });

    // Check for Resend errors
    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      throw new Error(emailResponse.error.message);
    }

    console.log("Survey email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error processing customer survey:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
