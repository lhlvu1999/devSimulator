import type { CompanyType } from "../content/companies";
import type { Difficulty } from "./difficulty";
import { nextUnit } from "./rng";

export type WorkGame =
  | "tidy"
  | "spot"
  | "wires"
  | "ship"
  | "inbox"
  | "oneonone"
  | "sprint"
  | "roadmap";

export const WORK_GAMES: readonly WorkGame[] = [
  "tidy",
  "spot",
  "wires",
  "ship",
  "inbox",
  "oneonone",
  "sprint",
  "roadmap",
];

export const WORK_GAME_LABEL: Record<WorkGame, string> = {
  tidy: "Tidy the screen",
  spot: "Spot the bug",
  wires: "Connect the wires",
  ship: "Ship it",
  inbox: "Sort the inbox",
  oneonone: "One-on-one",
  sprint: "Sprint planning",
  roadmap: "Roadmap",
};

/** People and product games weigh the same everywhere. */
const PEOPLE = { oneonone: 30, sprint: 30, roadmap: 30 };

/** Startups ship fast and break things. Big companies triage. Remote work is calm and focused. */
const WEIGHTS: Record<CompanyType, Record<WorkGame, number>> = {
  startup: { spot: 30, tidy: 20, wires: 10, ship: 30, inbox: 10, ...PEOPLE },
  agency: { spot: 30, tidy: 25, wires: 10, ship: 20, inbox: 15, ...PEOPLE },
  product: { spot: 20, tidy: 20, wires: 20, ship: 20, inbox: 20, ...PEOPLE },
  enterprise: { spot: 25, tidy: 25, wires: 10, ship: 10, inbox: 30, ...PEOPLE },
  remote: { wires: 35, tidy: 25, spot: 15, ship: 10, inbox: 15, ...PEOPLE },
};

const EVEN: Record<WorkGame, number> = {
  tidy: 20,
  spot: 20,
  wires: 20,
  ship: 20,
  inbox: 20,
  ...PEOPLE,
};

/** Only games unlocked at the player's level can be dealt. */
export function pickGame(
  seed: number,
  companyType: CompanyType | null | undefined,
  unlocked: readonly WorkGame[] = WORK_GAMES,
): { game: WorkGame; rngState: number } {
  const roll = nextUnit(seed);
  const weights = companyType ? WEIGHTS[companyType] : EVEN;
  const games = WORK_GAMES.filter((game) => unlocked.includes(game));
  const total = games.reduce((sum, game) => sum + weights[game], 0);
  let mark = roll.value * total;
  for (const game of games) {
    mark -= weights[game];
    if (mark < 0) return { game, rngState: roll.rngState };
  }
  return { game: games[games.length - 1] ?? "tidy", rngState: roll.rngState };
}

/** Seconds per game before the device bonus. Tidy and Spot are quick taps; wires and the inbox need reading. */
const BASE_SECONDS: Record<WorkGame, Record<Difficulty, number>> = {
  tidy: { easy: 12, normal: 12, hard: 13 },
  spot: { easy: 10, normal: 12, hard: 14 },
  wires: { easy: 32, normal: 26, hard: 28 },
  ship: { easy: 24, normal: 18, hard: 14 },
  inbox: { easy: 28, normal: 24, hard: 22 },
  oneonone: { easy: 16, normal: 20, hard: 24 },
  sprint: { easy: 20, normal: 24, hard: 28 },
  roadmap: { easy: 16, normal: 20, hard: 24 },
};

export function gameSeconds(
  game: WorkGame,
  difficulty: Difficulty,
  deviceBonus = 0,
): number {
  return Math.max(6, BASE_SECONDS[game][difficulty] + deviceBonus);
}

export function shuffleWith<T>(
  items: readonly T[],
  seed: number,
): { items: T[]; rngState: number } {
  const next = [...items];
  let rngState = seed;
  for (let index = next.length - 1; index > 0; index -= 1) {
    const rolled = nextUnit(rngState);
    rngState = rolled.rngState;
    const swap = Math.floor(rolled.value * (index + 1));
    const current = next[index] as T;
    next[index] = next[swap] as T;
    next[swap] = current;
  }
  return { items: next, rngState };
}
