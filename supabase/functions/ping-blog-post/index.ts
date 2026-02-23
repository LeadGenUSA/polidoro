import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://www.bigcityplumbing.com";
const INDEXNOW_KEY = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json();
    if (!slug) {
      throw new Error("Missing slug parameter");
    }

    const postUrl = `${SITE_URL}/blog/${slug}`;
    console.log("Pinging for URL:", postUrl);

    const results: Record<string, string> = {};

    // 1. IndexNow ping (Bing, Yandex, Seznam, Naver)
    try {
      const indexNowResponse = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "www.bigcityplumbing.com",
          key: INDEXNOW_KEY,
          keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
          urlList: [postUrl],
        }),
      });
      results.indexNow = `${indexNowResponse.status} ${indexNowResponse.statusText}`;
      await indexNowResponse.text(); // consume body
      console.log("IndexNow ping result:", results.indexNow);
    } catch (e) {
      results.indexNow = `error: ${e instanceof Error ? e.message : String(e)}`;
      console.error("IndexNow ping failed:", e);
    }

    // 2. Google sitemap ping
    try {
      const sitemapUrl = `${SITE_URL}/sitemap.xml`;
      const googleResponse = await fetch(
        `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
      );
      results.google = `${googleResponse.status} ${googleResponse.statusText}`;
      await googleResponse.text(); // consume body
      console.log("Google ping result:", results.google);
    } catch (e) {
      results.google = `error: ${e instanceof Error ? e.message : String(e)}`;
      console.error("Google ping failed:", e);
    }

    return new Response(JSON.stringify({ success: true, url: postUrl, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ping-blog-post error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
