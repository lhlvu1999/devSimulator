import type { Stats } from "./types";

export type PlacementOutcome = "win" | "loss" | "draw";

export type FresherProfile = {
  label: "Low fresher" | "Mid fresher" | "High fresher";
  blurb: string;
  stats: Stats;
};

function stats(partial: Stats): Stats {
  return partial;
}

/** Placement only moves stats inside the fresher band. */
export function fresherProfile(
  outcome: PlacementOutcome,
  moves: number,
): FresherProfile {
  if (outcome === "loss") {
    return {
      label: "Low fresher",
      blurb:
        "The placement game went to the other side. Offers stay at the low end of fresher work: more guidance, less scope.",
      stats: stats({
        money: 600,
        energy: 74,
        mood: 62,
        skill: 8,
        reputation: 10,
        health: 82,
        relationship: 34,
      }),
    };
  }
  if (outcome === "draw") {
    return {
      label: "Low fresher",
      blurb:
        "A draw is a low fresher result. Companies will offer supervised work more often than ownership.",
      stats: stats({
        money: 700,
        energy: 78,
        mood: 66,
        skill: 11,
        reputation: 13,
        health: 84,
        relationship: 36,
      }),
    };
  }
  if (moves <= 3) {
    return {
      label: "High fresher",
      blurb: `You won in ${moves} moves. That is the top of the fresher band: faster learning, more energy expected, still not a mid-level hire.`,
      stats: stats({
        money: 900,
        energy: 90,
        mood: 78,
        skill: 22,
        reputation: 24,
        health: 90,
        relationship: 46,
      }),
    };
  }
  if (moves === 4) {
    return {
      label: "Mid fresher",
      blurb:
        "You won in 4 moves. Offers sit in the middle of fresher work: real tickets, a manager nearby.",
      stats: stats({
        money: 800,
        energy: 84,
        mood: 72,
        skill: 16,
        reputation: 18,
        health: 86,
        relationship: 40,
      }),
    };
  }
  return {
    label: "Low fresher",
    blurb: `You won in ${moves} moves. A win, and still the low fresher band. The first offers will be narrower.`,
    stats: stats({
      money: 720,
      energy: 78,
      mood: 68,
      skill: 12,
      reputation: 14,
      health: 84,
      relationship: 36,
    }),
  };
}
