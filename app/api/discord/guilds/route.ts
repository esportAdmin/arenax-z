import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 400 },
      );
    }

    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch guilds from Discord" },
        { status: 400 },
      );
    }

    const guilds = await response.json();

    // Filtrer admin / owner
    const ADMINISTRATOR = BigInt(0x8);

    const filtered = guilds.filter((guild: any) => {
      const permissions = BigInt(guild.permissions);
      return guild.owner || (permissions & ADMINISTRATOR) === ADMINISTRATOR;
    });

    return NextResponse.json(filtered);
  } catch {
    return NextResponse.json(
      { error: "Server error fetching guilds" },
      { status: 500 },
    );
  }
}
