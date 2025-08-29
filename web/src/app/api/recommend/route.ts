// web/src/app/api/recommend/route.ts
import { createClient } from "@supabase/supabase-js";
export async function GET(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Solo en servidor
  const supa = createClient(url, key);
  const { searchParams } = new URL(req.url);
  const specialty = searchParams.get("specialty");

  const { data, error } = await supa
    .from("doctors")
    .select("*")
    .eq("specialty", specialty)
    .order("rating_avg", { ascending: false })
    .limit(10);

  if (error) return new Response(error.message, { status: 500 });
  return Response.json(data);
}

