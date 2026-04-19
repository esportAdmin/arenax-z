import { supabase } from "@/lib/supabase/client";

export async function getDashboardData(userId: string) {
  const { data, error } = await supabase.rpc("get_dashboard_data", {
    p_user_id: userId,
  });

  if (error) {
    throw error;
  }

  return data;
}
