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

const ALL_SHAPES: readonly SpotShape[] = [
  "circle",
  "square",
  "pill",
  "ring",
  "diamond",
  "bar",
];
const ALL_COLORS: readonly SpotColor[] = ["sage", "clay", "blue", "ink"];

/** Twenty layout presets — multiplies visual variety from the same RNG seed space. */
const LAYOUTS: readonly {
  columns: number;
  rows: number;
  shapes: readonly SpotShape[];
  colors: readonly SpotColor[];
}[] = [
  { columns: 2, rows: 3, shapes: ALL_SHAPES, colors: ALL_COLORS },
  { columns: 2, rows: 4, shapes: ALL_SHAPES, colors: ALL_COLORS },
  { columns: 3, rows: 3, shapes: ALL_SHAPES, colors: ALL_COLORS },
  {
    columns: 2,
    rows: 3,
    shapes: ["circle", "square", "pill", "ring"],
    colors: ALL_COLORS,
  },
  {
    columns: 2,
    rows: 4,
    shapes: ["diamond", "bar", "square", "circle"],
    colors: ALL_COLORS,
  },
  { columns: 3, rows: 2, shapes: ALL_SHAPES, colors: ["sage", "clay", "blue"] },
  { columns: 2, rows: 3, shapes: ["ring", "pill", "bar"], colors: ALL_COLORS },
  {
    columns: 3,
    rows: 3,
    shapes: ["circle", "square", "diamond"],
    colors: ALL_COLORS,
  },
  { columns: 2, rows: 4, shapes: ALL_SHAPES, colors: ["clay", "blue", "ink"] },
  {
    columns: 3,
    rows: 3,
    shapes: ["bar", "pill", "ring", "square"],
    colors: ALL_COLORS,
  },
  { columns: 2, rows: 5, shapes: ALL_SHAPES, colors: ALL_COLORS },
  { columns: 3, rows: 4, shapes: ALL_SHAPES, colors: ["sage", "ink", "blue"] },
  {
    columns: 2,
    rows: 3,
    shapes: ["circle", "diamond", "bar"],
    colors: ["clay", "blue", "ink"],
  },
  {
    columns: 3,
    rows: 2,
    shapes: ["square", "pill", "ring"],
    colors: ALL_COLORS,
  },
  { columns: 2, rows: 4, shapes: ["ring", "circle"], colors: ["sage", "clay"] },
  {
    columns: 3,
    rows: 3,
    shapes: ALL_SHAPES,
    colors: ["sage", "clay", "blue", "ink"],
  },
  {
    columns: 2,
    rows: 3,
    shapes: ["pill", "square", "diamond", "bar"],
    colors: ["blue", "ink"],
  },
  { columns: 3, rows: 3, shapes: ["circle", "ring"], colors: ALL_COLORS },
  {
    columns: 2,
    rows: 4,
    shapes: ["bar", "diamond", "pill"],
    colors: ["sage", "blue", "ink"],
  },
  {
    columns: 3,
    rows: 3,
    shapes: ["square", "circle", "pill", "ring", "bar"],
    colors: ["clay", "ink"],
  },
];

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
  let rngState = seed;
  const roll = () => {
    const next = nextUnit(rngState);
    rngState = next.rngState;
    return next.value;
  };

  const layoutIndex = Math.floor(roll() * LAYOUTS.length);
  const layout = LAYOUTS[layoutIndex] ??
    LAYOUTS[0] ?? {
      columns: 2,
      rows: 3,
      shapes: ALL_SHAPES,
      colors: ALL_COLORS,
    };
  const columns =
    difficulty === "hard"
      ? Math.max(layout.columns, 3)
      : difficulty === "normal"
        ? layout.columns
        : Math.min(layout.columns, 2);
  const rows =
    difficulty === "easy"
      ? Math.min(layout.rows, 3)
      : difficulty === "hard"
        ? Math.max(layout.rows, 3)
        : layout.rows;
  const SHAPES = layout.shapes;
  const COLORS = layout.colors;
  const count = columns * rows;
  const bugCount = difficulty === "easy" ? 1 : difficulty === "normal" ? 2 : 3;

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
