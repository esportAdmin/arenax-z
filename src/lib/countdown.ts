export function getNextUtcMidnight(from = new Date()) {
  const target = new Date(from);
  target.setUTCHours(24, 0, 0, 0);
  return target;
}

export function getNextWeeklyReset(day = 1, hourUtc = 18, from = new Date()) {
  const target = new Date(from);
  const currentDay = target.getUTCDay();
  const daysUntil = (day - currentDay + 7) % 7 || 7;

  target.setUTCDate(target.getUTCDate() + daysUntil);
  target.setUTCHours(hourUtc, 0, 0, 0);

  return target;
}

export function getHoursFromNow(hours: number, from = new Date()) {
  return new Date(from.getTime() + hours * 60 * 60 * 1000);
}
