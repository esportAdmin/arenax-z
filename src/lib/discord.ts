export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export async function fetchUserGuilds(
  accessToken: string,
): Promise<DiscordGuild[]> {
  const response = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Discord guilds");
  }

  const guilds: DiscordGuild[] = await response.json();

  // Filtrer uniquement les serveurs où l'utilisateur est owner ou admin
  return guilds.filter((guild) => {
    const permissions = BigInt(guild.permissions);
    const ADMINISTRATOR = BigInt(0x8);
    return guild.owner || (permissions & ADMINISTRATOR) === ADMINISTRATOR;
  });
}
