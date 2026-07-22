import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdminOrService } from "../_shared/auth-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FREQUENCY_DAYS: Record<string, number> = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
  quarterly: 90,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const auth = await requireAdminOrService(req);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }


  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: settings, error } = await supabase
      .from("blog_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !settings) {
      console.log("No blog settings found, skipping.");
      return new Response(JSON.stringify({ skipped: true, reason: "no settings" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const frequency = settings.generation_frequency || "monthly";
    const intervalDays = FREQUENCY_DAYS[frequency] || 30;
    const lastGenerated = settings.last_generated_at
      ? new Date(settings.last_generated_at)
      : null;

    const now = new Date();
    const daysSinceLastGeneration = lastGenerated
      ? (now.getTime() - lastGenerated.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    console.log(`Frequency: ${frequency}, Days since last: ${daysSinceLastGeneration.toFixed(1)}, Interval: ${intervalDays}`);

    if (daysSinceLastGeneration >= intervalDays) {
      console.log("Time to generate a new blog post!");
      
      // Call the generate-blog-post function with the service role so it authenticates as an internal caller.
      const generateResponse = await fetch(`${SUPABASE_URL}/functions/v1/generate-blog-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({}),
      });

      const result = await generateResponse.json();
      console.log("Generation result:", JSON.stringify(result));

      return new Response(JSON.stringify({ generated: true, result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Not yet time to generate. Skipping.");
    return new Response(
      JSON.stringify({
        skipped: true,
        reason: "not yet due",
        days_since_last: Math.round(daysSinceLastGeneration),
        interval_days: intervalDays,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("check-blog-schedule error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to run schedule check" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
