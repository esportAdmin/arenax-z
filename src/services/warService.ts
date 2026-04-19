import { supabase } from "@/integrations/supabase/client";

export async function attackTerritory(territoryId: string, clubId: string) {
  const { data, error } = await supabase.rpc("start_territory_war", {
    p_attacker_club: clubId,
    p_territory: territoryId,
  });

  if (error) {
    console.error("War error:", error);
    return null;
  }

  return data;
}
