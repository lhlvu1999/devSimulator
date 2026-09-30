import { STAT_KEYS, type Stats } from "./types";

/** Money and skill never go negative and have no ceiling. Every other stat stays between 0 and 100. */
export function clampStats(stats: Stats): Stats {
  const next = {
    ...stats,
    money: Math.max(0, Math.round(stats.money)),
    skill: Math.max(0, Math.round(stats.skill)),
  };
  for (const key of STAT_KEYS) {
    if (key === "money" || key === "skill") continue;
    next[key] = Math.max(0, Math.min(100, Math.round(stats[key])));
  }
  return next;
}

export function addStats(stats: Stats, effects: Partial<Stats>): Stats {
  const next = { ...stats };
  for (const key of Object.keys(effects) as (keyof Stats)[]) {
    next[key] += effects[key] ?? 0;
  }
  return clampStats(next);
}
