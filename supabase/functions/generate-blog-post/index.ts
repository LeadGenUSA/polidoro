import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSeason(): string {
  const month = new Date().getMonth();
  if (month >= 11 || month <= 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  return "fall";
}

function getSeasonalTopics(season: string): string[] {
  const topics: Record<string, string[]> = {
    winter: [
      "How to prevent frozen pipes in Long Island homes during winter",
      "Why is my boiler not heating evenly in my Nassau County home",
      "Emergency plumbing tips for NYC homeowners during a cold snap",
      "How much does emergency heating repair cost on Long Island",
      "Signs your boiler needs replacement before winter in New York",
    ],
    spring: [
      "How to prepare your sump pump for spring rain on Long Island",
      "Spring water heater maintenance tips for Nassau and Suffolk County homeowners",
      "Why do drains clog more in spring in New York homes",
      "When should Long Island homeowners flush their water heater",
      "How to check for hidden water damage after winter in NYC apartments",
    ],
    summer: [
      "Common sewer line problems in Long Island homes during summer",
      "How to conserve water during summer in Nassau County",
      "Outdoor plumbing maintenance tips for Suffolk County homeowners",
      "Why does my water pressure drop in summer on Long Island",
      "Signs of a failing sewer line in older New York homes",
    ],
    fall: [
      "Fall heating system tune-up checklist for Long Island homeowners",
      "How to bleed radiators in older NYC and Long Island homes",
      "Winterization plumbing tips for Nassau and Suffolk County",
      "When should you schedule a boiler inspection on Long Island",
      "How to prevent costly plumbing emergencies this winter in New York",
    ],
  };
  return topics[season] || topics.winter;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractJsonFromResponse(response: string): Record<string, unknown> {
  let cleaned = response
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No JSON object found in response");
  }
  cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(cleaned);
  } catch {
    cleaned = cleaned
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/[\x00-\x1F\x7F]/g, (ch) => ch === "\n" || ch === "\t" ? ch : "");
    return JSON.parse(cleaned);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check settings for a requested topic
    const { data: settings } = await supabase
      .from("blog_settings")
      .select("*")
      .limit(1)
      .single();

    let topic: string;
    if (settings?.next_topic) {
      topic = settings.next_topic;
      // Clear the next_topic after using it
      await supabase
        .from("blog_settings")
        .update({ next_topic: null })
        .eq("id", settings.id);
    } else {
      const season = getSeason();
      const topics = getSeasonalTopics(season);
      topic = topics[Math.floor(Math.random() * topics.length)];
    }

    console.log("Generating blog post for topic:", topic);

    // Generate the blog content using AI
    const contentResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert local SEO strategist and plumbing industry content writer for a licensed plumbing company based in Long Island, New York. Write authoritative, answer-first blog posts optimized for SEO, AEO, and GEO.`,
          },
          {
            role: "user",
            content: `Write a comprehensive blog post about: "${topic}"

Follow this EXACT structure:

1. TITLE: A clear, SEO-optimized title (under 60 characters if possible)

2. META_DESCRIPTION: A compelling meta description under 160 characters

3. DIRECT_ANSWER: A 40-70 word direct answer that fully answers the main question. Neutral, factual, concise. No marketing language.

4. EXPANDED_EXPLANATION: Explain causes, risks, and outcomes in clear sections with bullet points. Write for homeowners with no technical background.

5. LOCAL_CONTEXT: Why this issue is especially common in Long Island / Nassau County / Suffolk County / NYC. Reference seasonal weather, older housing stock, local water systems.

6. HOMEOWNER_GUIDANCE: Clearly separate what homeowners can safely check vs when to call a licensed plumber. Avoid unsafe repair instructions.

7. EXPERT_VOICE: One short section framed as "From a Long Island plumber's perspective..." Keep it informational.

8. FAQS: Exactly 5 FAQs, each with a full question and 1-2 sentence answer. Format as JSON array: [{"question":"...","answer":"..."}]

9. SOFT_CTA: A short helpful paragraph encouraging readers to contact a local Long Island plumbing professional. Trust-based, not salesy.

FORMAT YOUR RESPONSE AS JSON with these exact keys:
{
  "title": "...",
  "meta_description": "...",
  "content": "... (full article in Markdown, including all sections above except FAQs)",
  "faqs": [{"question":"...","answer":"..."}]
}

IMPORTANT: Return ONLY valid JSON. No markdown code fences.`,
          },
        ],
      }),
    });

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text();
      console.error("AI content generation error:", contentResponse.status, errorText);
      throw new Error(`AI content generation failed: ${contentResponse.status}`);
    }

    const contentData = await contentResponse.json();
    let rawContent = contentData.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("No content returned from AI");
    }

    let blogData;
    try {
      blogData = extractJsonFromResponse(rawContent);
    } catch (e) {
      console.error("Failed to parse AI response:", rawContent.substring(0, 500));
      throw new Error("Failed to parse AI-generated content as JSON");
    }

    const { title, meta_description, content, faqs } = blogData;
    const slug = slugify(title);

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();

    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    // Generate featured image
    let featuredImageUrl: string | null = null;
    try {
      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: `Generate a professional, high-quality photograph-style image for a plumbing company blog post titled: "${title}". The image should show realistic plumbing work, tools, or home plumbing scenarios relevant to Long Island, New York. No text or watermarks. Clean, well-lit, professional look. 16:9 aspect ratio.`,
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        const base64Image = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (base64Image) {
          // Extract base64 data and upload to storage
          const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
          const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          const fileName = `${finalSlug}-${Date.now()}.png`;

          const { error: uploadError } = await supabase.storage
            .from("blog-images")
            .upload(fileName, imageBytes, { contentType: "image/png" });

          if (!uploadError) {
            const { data: publicUrl } = supabase.storage
              .from("blog-images")
              .getPublicUrl(fileName);
            featuredImageUrl = publicUrl.publicUrl;
          } else {
            console.error("Image upload error:", uploadError);
          }
        }
      }
    } catch (imgErr) {
      console.error("Image generation error:", imgErr);
      // Continue without image
    }

    // Insert the blog post
    const { data: post, error: insertError } = await supabase
      .from("blog_posts")
      .insert({
        title,
        slug: finalSlug,
        meta_description,
        content,
        featured_image_url: featuredImageUrl,
        status: "draft",
        faqs,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`Failed to save blog post: ${insertError.message}`);
    }

    // Update last_generated_at
    if (settings?.id) {
      await supabase
        .from("blog_settings")
        .update({ last_generated_at: new Date().toISOString() })
        .eq("id", settings.id);
    }

    console.log("Blog post generated successfully:", post.id);

    return new Response(JSON.stringify({ success: true, post }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-blog-post error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
