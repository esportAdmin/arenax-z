export interface War {
  id: string;
  territory_name: string;
  coordinates: [number, number];
  attacker_club: string;
  defender_club: string;
  status: "active" | "completed" | "pending";
  created_at: string;
  updated_at?: string;
}

export interface Territory {
  id: string;
  country_code: string;
  country_name: string;
  owner_club_id: string | null;
  club_color: string;
  points: number;
}

export interface Club {
  id: string;
  name: string;
  color: string;
  logo_url: string;
  total_territories: number;
  total_points: number;
}
