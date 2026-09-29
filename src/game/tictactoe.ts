import { nextUnit } from "./rng";

export type Mark = "X" | "O";
export type Cell = Mark | null;
export type Board = Cell[];

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function emptyBoard(): Board {
  return Array.from({ length: 9 }, () => null);
}

export function winner(board: Board): Mark | "draw" | null {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every((cell) => cell !== null)) return "draw";
  return null;
}

function winningMove(board: Board, mark: Mark): number | null {
  for (const [a, b, c] of LINES) {
    const line = [board[a], board[b], board[c]];
    if (line.filter((cell) => cell === mark).length !== 2) continue;
    const emptyAt = [a, b, c].find((index) => board[index] === null);
    if (emptyAt !== undefined) return emptyAt;
  }
  return null;
}

function emptyIndexes(board: Board): number[] {
  return board.flatMap((cell, index) => (cell === null ? [index] : []));
}

/** Newbie opponent: often takes a win, sometimes blocks, otherwise plays loosely. */
export function newbieMove(
  board: Board,
  seed: number,
): { index: number; rngState: number } {
  const empty = emptyIndexes(board);
  if (empty.length === 0) return { index: -1, rngState: seed };

  const win = winningMove(board, "O");
  const block = winningMove(board, "X");
  const first = nextUnit(seed);
  if (win !== null && first.value < 0.72) {
    return { index: win, rngState: first.rngState };
  }
  const second = nextUnit(first.rngState);
  if (block !== null && second.value < 0.5) {
    return { index: block, rngState: second.rngState };
  }
  const third = nextUnit(second.rngState);
  if (empty.includes(4) && third.value < 0.4) {
    return { index: 4, rngState: third.rngState };
  }
  const pick = empty[Math.floor(third.value * empty.length)] ?? empty[0];
  return { index: pick, rngState: third.rngState };
}
