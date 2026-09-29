import type { Track } from "./ladder";
import { nextUnit } from "./rng";
import type { Stats } from "./types";
import type { JobPost } from "./workline";

export type Ask = "small" | "big";

/** How much more the salary goes up if the company says yes. */
export const ASK_RAISE: Record<Ask, number> = { small: 0.05, big: 0.15 };

/** Chance a failed big ask makes the company walk away. */
export const PULL_CHANCE = 0.4;

/**
 * How strong your hand is, 0 to 100. Reputation matters most. Engineers lean on
 * skill, managers on how close their team is. A good mood helps you sound sure.
 */
export function leverage(stats: Stats, track: Track): number {
  const craft = track === "manager" ? stats.relationship : stats.skill;
  return Math.round(0.5 * stats.reputation + 0.3 * craft + 0.2 * stats.mood);
}

export function askChance(power: number, ask: Ask): number {
  const chance =
    ask === "small" ? 0.35 + (power / 100) * 0.6 : 0.1 + (power / 100) * 0.5;
  return Math.min(0.95, Math.max(0.05, chance));
}

export function chanceLabel(chance: number): string {
  if (chance >= 0.7) return "Likely";
  if (chance >= 0.4) return "Maybe";
  return "Long shot";
}

export function leverageLabel(power: number): string {
  if (power >= 60) return "Strong";
  if (power >= 35) return "Fair";
  return "Weak";
}

export type NegotiationResult = "raised" | "held" | "pulled";

/** One try per offer. A yes raises the pay. A no on a big ask can end the offer. */
export function negotiate(
  post: JobPost,
  power: number,
  ask: Ask,
  seed: number,
): { result: NegotiationResult; post: JobPost } {
  const first = nextUnit(seed);
  if (first.value < askChance(power, ask)) {
    const boost = Math.round((post.boost + ASK_RAISE[ask]) * 100) / 100;
    const scale = boost / post.boost;
    return {
      result: "raised",
      post: { ...post, boost, bonusCash: Math.round(post.bonusCash * scale) },
    };
  }
  if (ask === "big" && nextUnit(first.rngState).value < PULL_CHANCE) {
    return { result: "pulled", post };
  }
  return { result: "held", post };
}
