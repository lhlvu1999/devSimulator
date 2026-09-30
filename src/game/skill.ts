/**
 * Skill is open-ended, like experience. Systems that need a 0–100 feel,
 * such as ticket difficulty or negotiation, read this rating instead.
 * The rating rises fast at first and flattens out, reaching 100 at 1,600 skill.
 */
export function skillRating(skill: number): number {
  return Math.min(100, Math.round(Math.sqrt(Math.max(0, skill)) * 2.5));
}

const TIERS: readonly [number, string][] = [
  [80, "Expert"],
  [60, "Seasoned"],
  [40, "Solid"],
  [20, "Capable"],
  [0, "Beginner"],
];

export function skillTier(skill: number): string {
  const rating = skillRating(skill);
  return TIERS.find(([floor]) => rating >= floor)?.[1] ?? "Beginner";
}
