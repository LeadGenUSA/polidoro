import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://www.bigcityplumbing.com";

const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/services", changefreq: "monthly", priority: "0.9" },
  { loc: "/plumbing-services", changefreq: "monthly", priority: "0.8" },
  { loc: "/heating-services", changefreq: "monthly", priority: "0.8" },
  { loc: "/about-us", changefreq: "monthly", priority: "0.7" },
  { loc: "/contact-us", changefreq: "monthly", priority: "0.7" },
  { loc: "/free-estimate", changefreq: "monthly", priority: "0.7" },
  { loc: "/work-order", changefreq: "monthly", priority: "0.6" },
  { loc: "/customer-survey", changefreq: "monthly", priority: "0.5" },
  { loc: "/reviews", changefreq: "weekly", priority: "0.7" },
  { loc: "/projects-gallery", changefreq: "weekly", priority: "0.6" },
  { loc: "/how-to-videos", changefreq: "weekly", priority: "0.6" },
  { loc: "/blog", changefreq: "daily", priority: "0.8" },
  { loc: "/financing", changefreq: "monthly", priority: "0.6" },
  { loc: "/sitemap", changefreq: "monthly", priority: "0.3" },
  { loc: "/privacy-policy", changefreq: "yearly", priority: "0.2" },
  { loc: "/terms-of-service", changefreq: "yearly", priority: "0.2" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, published_at, updated_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    if (posts) {
      for (const post of posts) {
        const lastmod = post.updated_at
          ? post.updated_at.split("T")[0]
          : post.published_at
          ? post.published_at.split("T")[0]
          : today;
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
