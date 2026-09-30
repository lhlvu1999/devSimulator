import type { Level } from "./ladder";

export type Difficulty = "easy" | "normal" | "hard";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
};

/**
 * The mix of work each title is handed. Freshers mostly get easy tickets and
 * never hard ones; the top of each track mostly gets hard ones and never easy.
 */
export const LEVEL_DIFFICULTY: Record<Level, Record<Difficulty, number>> = {
  fresher: { easy: 70, normal: 30, hard: 0 },
  junior: { easy: 45, normal: 45, hard: 10 },
  mid: { easy: 25, normal: 50, hard: 25 },
  senior: { easy: 10, normal: 50, hard: 40 },
  staff: { easy: 5, normal: 35, hard: 60 },
  principal: { easy: 0, normal: 30, hard: 70 },
  lead: { easy: 20, normal: 50, hard: 30 },
  manager: { easy: 10, normal: 45, hard: 45 },
  director: { easy: 5, normal: 35, hard: 60 },
};

/** Harder work teaches and impresses more: stat gains and time pay are scaled by this. */
export const DIFFICULTY_REWARD: Record<Difficulty, number> = {
  easy: 0.75,
  normal: 1,
  hard: 1.5,
};

/**
 * Picks a ticket's difficulty from the title's mix. Urgent or critical work is
 * never easy: an easy draw becomes normal.
 */
export function rollDifficulty(level: Level, roll: number, pressing = false): Difficulty {
  const mix = LEVEL_DIFFICULTY[level];
  const total = mix.easy + mix.normal + mix.hard;
  const mark = roll * total;
  const picked: Difficulty =
    mark < mix.easy ? "easy" : mark < mix.easy + mix.normal ? "normal" : "hard";
  return pressing && picked === "easy" ? "normal" : picked;
}

/** The difficulty a title sees most. Ties go to the harder one. */
export function typicalDifficulty(level: Level): Difficulty {
  const mix = LEVEL_DIFFICULTY[level];
  if (mix.hard >= mix.normal && mix.hard >= mix.easy) return "hard";
  if (mix.normal >= mix.easy) return "normal";
  return "easy";
}

export function difficultyStars(difficulty: Difficulty): number {
  if (difficulty === "easy") return 1;
  if (difficulty === "normal") return 2;
  return 3;
}

export function taskSeconds(difficulty: Difficulty, deviceBonus = 0): number {
  const base = difficulty === "easy" ? 24 : difficulty === "normal" ? 18 : 14;
  return base + deviceBonus;
}

export function wrongTries(difficulty: Difficulty): number {
  if (difficulty === "easy") return 99;
  if (difficulty === "normal") return 3;
  return 1;
}

export function teammateHelps(relationship: number): boolean {
  return relationship >= 40;
}
