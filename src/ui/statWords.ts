import type { StatKey } from "../game/types";
import { t } from "../i18n";

const STAT_WORD: Record<StatKey, string> = {
  money: "money",
  energy: "energy",
  mood: "mood",
  health: "health",
  skill: "skill",
  reputation: "reputation",
  relationship: "team",
};

/** A stat as it reads in an effect tag, like "+12 energy". */
export function statWord(key: string): string {
  return t(STAT_WORD[key as StatKey] ?? key);
}

/** Effects as one line, like "+12 energy, −4 health". */
export function effectLine(effects: Partial<Record<string, number>>): string {
  return Object.entries(effects)
    .filter(([, amount]) => (amount ?? 0) !== 0)
    .map(([stat, amount]) => `${(amount ?? 0) > 0 ? "+" : "−"}${Math.abs(amount ?? 0)} ${statWord(stat)}`)
    .join(", ");
}
