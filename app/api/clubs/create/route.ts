import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function POST(req: Request) {
  try {
    const { serverId, serverName, serverIcon, userId } = await req.json();

    if (!serverId || !serverName || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Vérifier si serveur déjà utilisé
    const { data: existing } = await supabase
      .from("clubs")
      .select("*")
      .eq("discord_server_id", serverId)
      .maybeSingle();

    if (existing) {
      // 🔥 Au lieu d'erreur, on retourne le club existant
      return NextResponse.json(existing);
    }

    const base = slugify(serverName);
    const slug = `${base || "club"}-${serverId.slice(-6)}`;

    const { data, error } = await supabase
      .from("clubs")
      .insert({
        name: serverName,
        slug,
        discord_server_id: serverId,
        discord_server_name: serverName,
        discord_server_icon: serverIcon,
        owner_id: userId,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 },
    );
  }
}
