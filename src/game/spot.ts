import type { Difficulty } from "./difficulty";
import { nextUnit } from "./rng";
import { shuffleWith } from "./workGames";

export type SpotShape =
  "circle" | "square" | "pill" | "ring" | "diamond" | "bar";
export type SpotColor = "sage" | "clay" | "blue" | "ink";

export type SpotTile = { shape: SpotShape; color: SpotColor } | null;

export type SpotPuzzle = {
  columns: number;
  design: SpotTile[];
  shipped: SpotTile[];
  bugs: number[];
  hint: number | null;
};

const SHAPES: readonly SpotShape[] = [
  "circle",
  "square",
  "pill",
  "ring",
  "diamond",
  "bar",
];
const COLORS: readonly SpotColor[] = ["sage", "clay", "blue", "ink"];

function pick<T>(items: readonly T[], value: number): T {
  return items[Math.floor(value * items.length)] as T;
}

function other<T>(items: readonly T[], current: T, value: number): T {
  const rest = items.filter((item) => item !== current);
  return pick(rest, value);
}

/** Two copies of a tiny app. The shipped copy has one to three changes to find. */
export function dealSpot(
  seed: number,
  difficulty: Difficulty,
  relationship: number,
): { puzzle: SpotPuzzle; rngState: number } {
  const columns = difficulty === "hard" ? 3 : 2;
  const rows = 3;
  const count = columns * rows;
  const bugCount = difficulty === "easy" ? 1 : difficulty === "normal" ? 2 : 3;
  let rngState = seed;
  const roll = () => {
    const next = nextUnit(rngState);
    rngState = next.rngState;
    return next.value;
  };

  const design: SpotTile[] = Array.from({ length: count }, () => ({
    shape: pick(SHAPES, roll()),
    color: pick(COLORS, roll()),
  }));

  const order = shuffleWith(
    Array.from({ length: count }, (_, index) => index),
    rngState,
  );
  rngState = order.rngState;
  const bugs = order.items.slice(0, bugCount).sort((a, b) => a - b);

  const shipped = design.map((tile, index) => {
    if (!bugs.includes(index) || !tile) return tile;
    const kind = roll();
    if (kind < 0.4)
      return { ...tile, color: other(COLORS, tile.color, roll()) };
    if (kind < 0.8)
      return { ...tile, shape: other(SHAPES, tile.shape, roll()) };
    return null;
  });

  return {
    rngState,
    puzzle: {
      columns,
      design,
      shipped,
      bugs,
      hint: relationship >= 40 ? (bugs[0] ?? null) : null,
    },
  };
}

export function spotSolved(
  puzzle: SpotPuzzle,
  found: readonly number[],
): boolean {
  return puzzle.bugs.every((index) => found.includes(index));
}
