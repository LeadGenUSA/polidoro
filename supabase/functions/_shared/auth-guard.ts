import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Returns { ok: true } if request bearer token belongs to an admin user
 * or is the service role key. Returns { ok: false, status, error } otherwise.
 */
export async function requireAdminOrService(req: Request): Promise<
  { ok: true; userId: string | null; isService: boolean } | { ok: false; status: number; error: string }
> {
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  const token = authHeader.replace("Bearer ", "").trim();

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (serviceKey && token === serviceKey) {
    return { ok: true, userId: null, isService: true };
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: userErr } = await client.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  // Check admin role via service role (bypasses RLS)
  const admin = createClient(SUPABASE_URL, serviceKey!);
  const { data: roleData } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleData) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, userId: userData.user.id, isService: false };
}
