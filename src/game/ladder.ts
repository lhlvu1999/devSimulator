import type { Stats } from "./types";
import type { WorkGame } from "./workGames";

export type Level =
  | "fresher"
  | "junior"
  | "mid"
  | "senior"
  | "staff"
  | "principal"
  | "lead"
  | "manager"
  | "director";

export type Track = "engineer" | "manager";

/** The engineer track, bottom to top. */
export const LEVELS: readonly Level[] = [
  "fresher",
  "junior",
  "mid",
  "senior",
  "staff",
  "principal",
];

/** The manager track starts beside Senior. */
export const MANAGER_LEVELS: readonly Level[] = ["lead", "manager", "director"];

export const ALL_LEVELS: readonly Level[] = [...LEVELS, ...MANAGER_LEVELS];

export const LEVEL_TITLE: Record<Level, string> = {
  fresher: "Fresher",
  junior: "Junior engineer",
  mid: "Engineer",
  senior: "Senior engineer",
  staff: "Staff engineer",
  principal: "Principal engineer",
  lead: "Team lead",
  manager: "Engineering manager",
  director: "Director",
};

/** Payday is the company salary times this. Manager rungs pay a little more than their engineer twins. */
export const LEVEL_PAY: Record<Level, number> = {
  fresher: 1,
  junior: 1.3,
  mid: 1.7,
  senior: 2.2,
  staff: 2.8,
  principal: 3.5,
  lead: 2.4,
  manager: 3,
  director: 3.8,
};

/**
 * Engineer levels add one game each. Manager levels trade engineering work
 * for people and product work, a little more at every rung.
 */
export const LEVEL_GAMES: Record<Level, readonly WorkGame[]> = {
  fresher: ["tidy", "spot"],
  junior: ["tidy", "spot", "wires"],
  mid: ["tidy", "spot", "wires", "ship"],
  senior: ["tidy", "spot", "wires", "ship", "inbox"],
  staff: ["tidy", "spot", "wires", "ship", "inbox"],
  principal: ["tidy", "spot", "wires", "ship", "inbox"],
  lead: ["oneonone", "spot", "inbox"],
  manager: ["oneonone", "sprint", "inbox"],
  director: ["oneonone", "sprint", "roadmap"],
};

/** Levels at the same height on both tracks. Switching moves across, not up or down. */
const TWIN: Partial<Record<Level, Level>> = {
  senior: "lead",
  staff: "manager",
  principal: "director",
  lead: "senior",
  manager: "staff",
  director: "principal",
};

export function trackOf(level: Level): Track {
  return MANAGER_LEVELS.includes(level) ? "manager" : "engineer";
}

export function twinOf(level: Level): Level | null {
  return TWIN[level] ?? null;
}

export type Milestone = {
  tickets: Partial<Record<WorkGame, number>>;
  gate: { stat: keyof Stats; value: number };
};

/** What it takes to leave each level. Principal and Director are the top of their tracks. */
/**
 * Tuned for about 10 clean mini-games in a full work week: roughly 4 weeks as a
 * Fresher, 10 as a Junior, 20 as an Engineer, 35 as a Senior, and 50 as Staff.
 * Counts assume the company deals the game less often than the others.
 */
export const MILESTONES: Partial<Record<Level, Milestone>> = {
  fresher: {
        tickets: { tidy: 15, spot: 15 },
    gate: { stat: "skill", value: 80 },
  },
  junior: {
        tickets: { spot: 30, wires: 15 },
    gate: { stat: "skill", value: 220 },
  },
  mid: {
        tickets: { wires: 30, ship: 30 },
    gate: { stat: "reputation", value: 30 },
  },
  senior: {
        tickets: { ship: 40, inbox: 40 },
    gate: { stat: "reputation", value: 50 },
  },
  staff: {
        tickets: { wires: 55, inbox: 55 },
    gate: { stat: "reputation", value: 65 },
  },
  lead: {
    tickets: { oneonone: 60, inbox: 25 },
    gate: { stat: "relationship", value: 60 },
  },
  manager: {
    tickets: { oneonone: 90, sprint: 90 },
    gate: { stat: "reputation", value: 60 },
  },
};

/** From Engineer up, and on the whole manager track, the player chooses each ticket. */
export function picksOwnWork(level: Level): boolean {
  if (trackOf(level) === "manager") return true;
  return LEVELS.indexOf(level) >= LEVELS.indexOf("mid");
}

export type Progress = Record<WorkGame, number>;

export function emptyProgress(): Progress {
  return {
    tidy: 0,
    spot: 0,
    wires: 0,
    ship: 0,
    inbox: 0,
    oneonone: 0,
    sprint: 0,
    roadmap: 0,
  };
}

export function nextLevel(level: Level): Level | null {
  const track = trackOf(level) === "manager" ? MANAGER_LEVELS : LEVELS;
  return track[track.indexOf(level) + 1] ?? null;
}

export type Requirement = {
  id: string;
  label: string;
  have: number;
  need: number;
};

export function requirements(input: {
  level: Level;
  progress: Progress;
  stats: Stats;
  gameLabel: Record<WorkGame, string>;
}): Requirement[] {
  const milestone = MILESTONES[input.level];
  if (!milestone) return [];
  const tickets = (Object.keys(milestone.tickets) as WorkGame[]).map(
    (game) => ({
      id: game,
      label: `Clean ${input.gameLabel[game]}`,
      have: input.progress[game],
      need: milestone.tickets[game] ?? 0,
    }),
  );
  const gateLabel =
    milestone.gate.stat.charAt(0).toUpperCase() + milestone.gate.stat.slice(1);
  return [
    ...tickets,
    {
      id: "gate",
      label: gateLabel,
      have: input.stats[milestone.gate.stat],
      need: milestone.gate.value,
    },
  ];
}

export function milestonesMet(list: readonly Requirement[]): boolean {
  return list.length > 0 && list.every((item) => item.have >= item.need);
}
