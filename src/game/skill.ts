import type { Level } from "./ladder";

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

/**
 * Skill from outside tickets (free time, courses, events) is set at Senior and scaled by title.
 * Each title needs more skill than the last (80 to leave Fresher, 380 to leave Senior), so a flat
 * amount would carry a fresher half a promotion and barely register at Staff.
 */
export const OFF_WORK_SKILL_SCALE: Record<Level, number> = {
  fresher: 0.3,
  junior: 0.5,
  mid: 0.75,
  senior: 1,
  staff: 1.4,
  principal: 1.8,
  lead: 0.9,
  manager: 1,
  director: 1.2,
};

/** The same effects with skill scaled to the title. A positive gain never rounds down to nothing. */
export function scaleSkill<T extends { skill?: number }>(effects: T, level: Level): T {
  const skill = effects.skill;
  if (!skill) return effects;
  const scaled = Math.round(skill * OFF_WORK_SKILL_SCALE[level]);
  return { ...effects, skill: skill > 0 ? Math.max(1, scaled) : scaled };
}
