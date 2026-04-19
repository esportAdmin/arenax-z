export type Territory = {
  id: string;
  name: string;
  map_x: number;
  map_y: number;
  controlling_club_id: string | null;
  clubs?: {
    name: string;
  } | null;
};
