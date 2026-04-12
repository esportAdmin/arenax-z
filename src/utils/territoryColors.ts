export function getTerritoryColor(
  controllingClubId: string | null,
  myClubId: string,
) {
  if (!controllingClubId) return "#6b7280"; // gris neutre

  if (controllingClubId === myClubId) return "#3b82f6"; // bleu joueur

  return "#ef4444"; // rouge ennemi
}
