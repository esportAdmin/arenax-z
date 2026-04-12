export type CommandType = "move" | "attack" | "hold";

export function resolveCommand(target: any, myClubId: string): CommandType {
  if (!target) return "move";

  if (!target.club_id) return "move";

  if (target.club_id !== myClubId) {
    return "attack";
  }

  return "move";
}
