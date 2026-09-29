export type Difficulty = "easy" | "normal" | "hard";

/** Higher skill raises the pressure. Relationship lowers it, like a teammate helping. */
export function taskDifficulty(
  skill: number,
  relationship: number,
): Difficulty {
  const help = Math.floor(relationship / 20);
  const pressure = skill - help * 3;
  if (pressure < 13) return "easy";
  if (pressure < 19) return "normal";
  return "hard";
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
