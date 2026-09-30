import type { Difficulty } from "./difficulty";
import { nextUnit } from "./rng";

/** 0 north, 1 east, 2 south, 3 west. */
export type Dir = 0 | 1 | 2 | 3;
export type PipeKind = "straight" | "corner";

export type Pipe = {
  kind: PipeKind;
  rotation: number;
  answer: number;
  onPath: boolean;
  locked: boolean;
};

export type WirePuzzle = {
  size: number;
  startRow: number;
  endRow: number;
  pipes: Pipe[];
};

const BASE: Record<PipeKind, readonly Dir[]> = {
  straight: [0, 2],
  corner: [0, 1],
};

export function openings(pipe: Pick<Pipe, "kind" | "rotation">): Dir[] {
  return BASE[pipe.kind].map((dir) => ((dir + pipe.rotation) % 4) as Dir);
}

function opposite(dir: Dir): Dir {
  return ((dir + 2) % 4) as Dir;
}

const STEP: Record<Dir, [number, number]> = {
  0: [-1, 0],
  1: [0, 1],
  2: [1, 0],
  3: [0, -1],
};

/** The rotation that makes this kind of pipe join these two sides. */
function rotationFor(kind: PipeKind, sides: readonly Dir[]): number {
  for (let rotation = 0; rotation < 4; rotation += 1) {
    const open = openings({ kind, rotation });
    if (sides.every((side) => open.includes(side))) return rotation;
  }
  return 0;
}

/**
 * A path from the button on the left to the server on the right.
 * Each column is crossed once, so the path never loops back on itself.
 */
export function dealWires(
  seed: number,
  difficulty: Difficulty,
  relationship: number,
): { puzzle: WirePuzzle; rngState: number } {
  const sizePool: Record<Difficulty, readonly number[]> = {
    easy: [3, 3, 3, 4, 4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 4, 3, 4, 3, 4, 4],
    normal: [4, 4, 4, 5, 5, 4, 5, 4, 5, 5, 4, 5, 4, 5, 5, 4, 4, 5, 5, 4],
    hard: [5, 5, 5, 6, 6, 5, 6, 5, 6, 6, 5, 6, 5, 6, 6, 5, 5, 6, 6, 5],
  };
  let rngState = seed;
  const roll = () => {
    const next = nextUnit(rngState);
    rngState = next.rngState;
    return next.value;
  };

  const sizes = sizePool[difficulty];
  const size =
    sizes[Math.floor(roll() * sizes.length)] ??
    (difficulty === "easy" ? 3 : difficulty === "normal" ? 4 : 5);

  const startRow = Math.floor(roll() * size);
  const endRow = Math.floor(roll() * size);
  const route = new Map<number, Dir[]>();
  const order: number[] = [];
  let row = startRow;
  for (let column = 0; column < size; column += 1) {
    const target = column === size - 1 ? endRow : Math.floor(roll() * size);
    const step = target > row ? 1 : -1;
    const rows: number[] = [row];
    while (rows[rows.length - 1] !== target)
      rows.push((rows[rows.length - 1] ?? row) + step);
    rows.forEach((current, index) => {
      const into: Dir = index === 0 ? 3 : step > 0 ? 0 : 2;
      const out: Dir = index === rows.length - 1 ? 1 : step > 0 ? 2 : 0;
      const cell = current * size + column;
      route.set(cell, [into, out]);
      order.push(cell);
    });
    row = target;
  }

  const helped = relationship >= 40 ? order.slice(0, 2) : [];
  const pipes: Pipe[] = Array.from({ length: size * size }, (_, cell) => {
    const sides = route.get(cell);
    if (sides) {
      const kind: PipeKind =
        sides[0] === opposite(sides[1] as Dir) ? "straight" : "corner";
      const solved = rotationFor(kind, sides);
      const locked = helped.includes(cell);
      return {
        kind,
        rotation: locked ? solved : Math.floor(roll() * 4),
        answer: solved,
        onPath: true,
        locked,
      };
    }
    const rotation = Math.floor(roll() * 4);
    return {
      kind: roll() < 0.5 ? "straight" : "corner",
      rotation,
      answer: rotation,
      onPath: false,
      locked: false,
    };
  });

  const puzzle = { size, startRow, endRow, pipes };
  if (wiresSolved(puzzle)) {
    const first = order.find((cell) => !helped.includes(cell));
    const pipe = first != null ? pipes[first] : undefined;
    if (pipe) pipe.rotation = (pipe.rotation + 1) % 4;
  }
  return { puzzle, rngState };
}

/** Cells lit from the button, following open pipe ends. */
export function traceWires(puzzle: WirePuzzle): {
  lit: number[];
  connected: boolean;
} {
  const { size, pipes } = puzzle;
  const lit: number[] = [];
  let row = puzzle.startRow;
  let column = 0;
  let from: Dir = 3;
  for (let steps = 0; steps < size * size; steps += 1) {
    const cell = row * size + column;
    const pipe = pipes[cell];
    if (!pipe || lit.includes(cell)) break;
    const open = openings(pipe);
    if (!open.includes(from)) break;
    lit.push(cell);
    const out = open.find((dir) => dir !== from) as Dir;
    if (out === 1 && column === size - 1) {
      return { lit, connected: row === puzzle.endRow };
    }
    const [dRow, dColumn] = STEP[out];
    row += dRow;
    column += dColumn;
    if (row < 0 || row >= size || column < 0 || column >= size) break;
    from = opposite(out);
  }
  return { lit, connected: false };
}

export function wiresSolved(puzzle: WirePuzzle): boolean {
  return traceWires(puzzle).connected;
}

export function turnPipe(puzzle: WirePuzzle, cell: number): WirePuzzle {
  const pipe = puzzle.pipes[cell];
  if (!pipe || pipe.locked) return puzzle;
  return {
    ...puzzle,
    pipes: puzzle.pipes.map((current, index) =>
      index === cell
        ? { ...current, rotation: (current.rotation + 1) % 4 }
        : current,
    ),
  };
}
