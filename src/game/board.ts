import type { CompanyType } from "../content/companies";
import { TICKET_TITLES, URGENT_TITLES } from "../content/ticketTitles";
import { LEVEL_GAMES, picksOwnWork, type Level } from "./ladder";
import { rollDifficulty, type Difficulty } from "./difficulty";
import { nextUnit } from "./rng";
import { skillRating } from "./skill";
import type { CodeGrade, Stats } from "./types";
import { pickGame, type WorkGame } from "./workGames";

/**
 * The work board. Each week has 40 work hours. Tickets have a size in hours,
 * a priority, and a deadline on that same clock. Playing a mini-game spends
 * one part of a ticket's hours.
 */

export type Priority = "low" | "medium" | "high" | "critical";
export type TicketSize = "S" | "M" | "L" | "XL";
export type Timing = "early" | "onTime" | "late";

export type BoardTicket = {
  key: string;
  title: string;
  game: WorkGame;
  priority: Priority;
  size: TicketSize;
  parts: number;
  partsDone: number;
  partHours: number;
  /** Absolute work hour the ticket arrived. */
  createdAt: number;
  /** Absolute work hour it is due. */
  dueAt: number;
  /** The overdue hit has been applied. */
  overdue: boolean;
  urgent: boolean;
    /** The ticket this one came out of. */
  parent: string | null;
  /** How hard its mini-games are, from the title's mix of work. */
  difficulty: Difficulty;
};

export type Board = {
  tickets: BoardTicket[];
  nextNumber: number;
  /** Work hours used this week. */
  hour: number;
};

export type BoardContext = {
  companyName: string;
  companyType: CompanyType;
  level: Level;
  stats: Pick<Stats, "skill" | "reputation" | "relationship">;
  day: number;
};

export const WEEK_HOURS = 40;
export const OVERTIME_HOURS = 16;
export const HOURS_PER_SLOT = 8;
export const MAX_EARLY_SLOTS = 2;
export const SIZE_HOURS: Record<TicketSize, number> = {
  S: 2,
  M: 4,
  L: 8,
  XL: 16,
};
export const SIZE_PARTS: Record<TicketSize, number> = {
  S: 1,
  M: 1,
  L: 2,
  XL: 3,
};
const LATE_FACTOR = 1.5;
const FOLLOW_UP_CHANCE = 0.35;
const HELP_RELATIONSHIP = 60;
const HELP_CHANCE = 0.3;
/** Past this, an overdue ticket is taken off your board. */
const REASSIGN_AFTER = WEEK_HOURS * 2;

/** How often something urgent lands mid-week. Startups are loud, remote teams are calm. */
const INTERRUPT_CHANCE: Record<CompanyType, number> = {
  startup: 0.2,
  agency: 0.14,
  product: 0.1,
  enterprise: 0.1,
  remote: 0.05,
};

const PRIORITY_RANK: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

/** Hours from arrival to deadline, before priority tightens it. */
const DUE_WINDOW: Record<TicketSize, [number, number]> = {
  S: [8, 24],
  M: [16, 40],
  L: [32, 64],
  XL: [56, 96],
};

const PRIORITY_SQUEEZE: Record<Priority, number> = {
  low: 1.2,
  medium: 1,
  high: 0.8,
  critical: 0.6,
};

export const OVERDUE_HIT: Record<Priority, Partial<Stats>> = {
  low: { reputation: -1 },
  medium: { reputation: -2, mood: -1 },
  high: { reputation: -3, mood: -2, relationship: -1 },
  critical: { reputation: -5, mood: -3, relationship: -2 },
};
export const STILL_OVERDUE_HIT: Partial<Stats> = { reputation: -1, mood: -1 };
export const REASSIGNED_HIT: Partial<Stats> = { reputation: -2 };

export function emptyBoard(): Board {
  return { tickets: [], nextNumber: 101, hour: 0 };
}

/** Only startups let you push past Friday evening. */
export function allowsOvertime(type: CompanyType): boolean {
  return type === "startup";
}

export function hourLimit(type: CompanyType): number {
  return WEEK_HOURS + (allowsOvertime(type) ? OVERTIME_HOURS : 0);
}

export function clockAt(day: number, hour: number): number {
  return (day - 1) * WEEK_HOURS + hour;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

/** "Tue 14:00" for an hour inside the work week. */
export function hourLabel(hour: number): string {
  if (hour > WEEK_HOURS) return `Overtime +${hour - WEEK_HOURS}h`;
  if (hour === WEEK_HOURS) return "Fri 17:00";
  return `${WEEKDAYS[Math.floor(hour / 8)]} ${9 + (hour % 8)}:00`;
}

function spanLabel(hours: number): string {
  if (hours < 8) return `${hours}h`;
  if (hours < WEEK_HOURS) {
    const days = Math.round(hours / 8);
    return `${days} day${days === 1 ? "" : "s"}`;
  }
  const weeks = Math.round(hours / WEEK_HOURS);
  return `${weeks} week${weeks === 1 ? "" : "s"}`;
}

export type DueTone = "overdue" | "soon" | "ok";

export function dueInfo(
  ticket: BoardTicket,
  day: number,
  hour: number,
): { label: string; tone: DueTone } {
  const now = clockAt(day, hour);
  if (ticket.dueAt < now)
    return {
      label: `Overdue ${spanLabel(now - ticket.dueAt)}`,
      tone: "overdue",
    };
  const weekOffset = Math.floor(ticket.dueAt / WEEK_HOURS) - (day - 1);
  const inWeek =
    ticket.dueAt - Math.floor(ticket.dueAt / WEEK_HOURS) * WEEK_HOURS;
  const label =
    weekOffset <= 0
      ? `Due ${hourLabel(inWeek)}`
      : weekOffset === 1
        ? `Due next ${hourLabel(inWeek)}`
        : `Due in ${weekOffset} weeks`;
  return { label, tone: ticket.dueAt - now <= 8 ? "soon" : "ok" };
}

/** Overdue first, then the nearest deadline, then the most important. */
export function sortTickets(tickets: readonly BoardTicket[]): BoardTicket[] {
  return [...tickets].sort(
    (a, b) =>
      Number(b.overdue) - Number(a.overdue) ||
      a.dueAt - b.dueAt ||
      PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
  );
}

/** Freshers and juniors work the lead's order. Everyone else picks. */
export function assignedTicket(board: Board, level: Level): BoardTicket | null {
  if (picksOwnWork(level)) return null;
  return sortTickets(board.tickets)[0] ?? null;
}

export function canStart(
  board: Board,
  ticket: BoardTicket,
  companyType: CompanyType,
): boolean {
  return board.hour + ticket.partHours <= hourLimit(companyType);
}

/** Hours a part takes after the clock grade. A late finish runs over. */
export function hoursSpent(ticket: BoardTicket, grade: CodeGrade): number {
  return grade === "late"
    ? Math.ceil(ticket.partHours * LATE_FACTOR)
    : ticket.partHours;
}

function openTarget(level: Level): number {
  if (level === "fresher") return 3;
  if (level === "junior") return 4;
  return 5;
}

function sizeWeights(level: Level): Record<TicketSize, number> {
  if (level === "fresher") return { S: 50, M: 50, L: 0, XL: 0 };
  if (level === "junior") return { S: 30, M: 50, L: 20, XL: 0 };
  if (level === "mid") return { S: 20, M: 40, L: 30, XL: 10 };
  return { S: 15, M: 35, L: 30, XL: 20 };
}

function priorityWeights(reputation: number): Record<Priority, number> {
  const trusted = reputation >= 50;
  return {
    low: 25,
    medium: 45,
    high: trusted ? 32 : 22,
    critical: trusted ? 12 : 8,
  };
}

function pickWeighted<T extends string>(
  weights: Record<T, number>,
  value: number,
): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let mark = value * total;
  for (const [key, weight] of entries) {
    mark -= weight;
    if (mark < 0 && weight > 0) return key;
  }
  return (
    entries.filter(([, weight]) => weight > 0).at(-1)?.[0] ?? entries[0]![0]
  );
}

function keyPrefix(companyName: string): string {
  return (
    companyName
      .replace(/[^A-Za-z]/g, "")
      .slice(0, 4)
      .toUpperCase() || "TASK"
  );
}

/** Skill makes every ticket a little faster, up to a quarter at the top rating. */
function partHoursFor(size: TicketSize, skill: number): number {
  const speed = 1 - Math.min(0.25, skillRating(skill) / 400);
  return Math.max(1, Math.round((SIZE_HOURS[size] / SIZE_PARTS[size]) * speed));
}

type Kind = "normal" | "urgent" | "followUp";

function dealOne(
  board: Board,
  ctx: BoardContext,
  now: number,
  seed: number,
  kind: Kind,
  parent: BoardTicket | null = null,
): { board: Board; ticket: BoardTicket; rngState: number } {
  const games = LEVEL_GAMES[ctx.level];
  const urgentGames = games.filter(
    (game) => game === "spot" || game === "ship" || game === "inbox",
  );
  const pickFrom =
    kind === "urgent" && urgentGames.length > 0 ? urgentGames : games;
  const picked = pickGame(seed, ctx.companyType, pickFrom);
  const sizeRoll = nextUnit(picked.rngState);
  const priorityRoll = nextUnit(sizeRoll.rngState);
  const dueRoll = nextUnit(priorityRoll.rngState);
    const titleRoll = nextUnit(dueRoll.rngState);
  const difficultyRoll = nextUnit(titleRoll.rngState);

  const size: TicketSize =
    kind === "urgent"
      ? sizeRoll.value < 0.6
        ? "S"
        : "M"
      : pickWeighted(sizeWeights(ctx.level), sizeRoll.value);
  const priority: Priority =
    kind === "urgent"
      ? priorityRoll.value < 0.6
        ? "critical"
        : "high"
      : pickWeighted(priorityWeights(ctx.stats.reputation), priorityRoll.value);
  const partHours = partHoursFor(size, ctx.stats.skill);
  const parts = SIZE_PARTS[size];
  const [low, high] = kind === "urgent" ? [4, 8] : DUE_WINDOW[size];
  const squeeze = kind === "urgent" ? 1 : PRIORITY_SQUEEZE[priority];
  const window = Math.max(
    partHours * parts + 2,
    Math.round((low + dueRoll.value * (high - low)) * squeeze),
  );

  const open = new Set(board.tickets.map((ticket) => ticket.title));
  const pool = kind === "urgent" ? URGENT_TITLES : TICKET_TITLES[picked.game];
  let index = Math.floor(titleRoll.value * pool.length);
  for (
    let tries = 0;
    tries < pool.length && open.has(pool[index]!);
    tries += 1
  ) {
    index = (index + 1) % pool.length;
  }

  const ticket: BoardTicket = {
    key: `${keyPrefix(ctx.companyName)}-${board.nextNumber}`,
    title: pool[index] ?? "Untitled task",
    game: picked.game,
    priority,
    size,
    parts,
    partsDone: 0,
    partHours,
    createdAt: now,
    dueAt: now + window,
    overdue: false,
        urgent: kind === "urgent",
    parent: parent?.key ?? null,
    difficulty: rollDifficulty(
      ctx.level,
      difficultyRoll.value,
      kind === "urgent" || priority === "critical",
    ),
  };
  return {
    board: {
      ...board,
      tickets: [...board.tickets, ticket],
      nextNumber: board.nextNumber + 1,
    },
        ticket,
    rngState: difficultyRoll.rngState,
  };
}

/** Tops the board up to what the level usually carries. */
export function refillBoard(
  board: Board,
  ctx: BoardContext,
  now: number,
  seed: number,
): { board: Board; arrived: BoardTicket[]; rngState: number } {
  let next = board;
  let rngState = seed;
  const arrived: BoardTicket[] = [];
  while (next.tickets.length < openTarget(ctx.level)) {
    const dealt = dealOne(next, ctx, now, rngState, "normal");
    next = dealt.board;
    rngState = dealt.rngState;
    arrived.push(dealt.ticket);
  }
  return { board: next, arrived, rngState };
}

function markOverdue(
  tickets: BoardTicket[],
  now: number,
): { tickets: BoardTicket[]; hit: BoardTicket[] } {
  const hit: BoardTicket[] = [];
  const marked = tickets.map((ticket) => {
    if (ticket.overdue || ticket.dueAt >= now) return ticket;
    const late = { ...ticket, overdue: true };
    hit.push(late);
    return late;
  });
  return { tickets: marked, hit };
}

export type PartResult = {
  board: Board;
  ticket: BoardTicket;
  spent: number;
  /** Hours of this part worked past Friday evening. */
  overtime: number;
  finished: boolean;
  timing: Timing | null;
  arrived: BoardTicket[];
  newlyOverdue: BoardTicket[];
  rngState: number;
};

/**
 * One mini-game on one ticket. A miss spends the hours and leaves the part open.
 * Finishing may bring a follow-up, and any part may be interrupted by something urgent.
 */
export function workPart(
  board: Board,
  key: string,
  grade: CodeGrade,
  ctx: BoardContext,
  seed: number,
): PartResult | null {
  const ticket = board.tickets.find((item) => item.key === key);
  if (!ticket || !canStart(board, ticket, ctx.companyType)) return null;
  const limit = hourLimit(ctx.companyType);
  const spent = hoursSpent(ticket, grade);
  const hour = Math.min(limit, board.hour + spent);
  const overtime = Math.max(0, hour - Math.max(board.hour, WEEK_HOURS));
  const now = clockAt(ctx.day, hour);

  const worked: BoardTicket = {
    ...ticket,
    partsDone: grade === "miss" ? ticket.partsDone : ticket.partsDone + 1,
  };
  const finished = worked.partsDone >= worked.parts;
  let timing: Timing | null = null;
  if (finished) {
    const window = ticket.dueAt - ticket.createdAt;
    timing =
      now > ticket.dueAt
        ? "late"
        : ticket.dueAt - now >= window / 2
          ? "early"
          : "onTime";
  }

  let next: Board = {
    ...board,
    hour,
    tickets: finished
      ? board.tickets.filter((item) => item.key !== key)
      : board.tickets.map((item) => (item.key === key ? worked : item)),
  };
  let rngState = seed;
  const arrived: BoardTicket[] = [];

  const followRoll = nextUnit(rngState);
  rngState = followRoll.rngState;
  if (finished && followRoll.value < FOLLOW_UP_CHANCE) {
    const dealt = dealOne(next, ctx, now, rngState, "followUp", ticket);
    next = dealt.board;
    rngState = dealt.rngState;
    arrived.push(dealt.ticket);
  }
  const interruptRoll = nextUnit(rngState);
  rngState = interruptRoll.rngState;
  if (hour < limit && interruptRoll.value < INTERRUPT_CHANCE[ctx.companyType]) {
    const dealt = dealOne(next, ctx, now, rngState, "urgent");
    next = dealt.board;
    rngState = dealt.rngState;
    arrived.push(dealt.ticket);
  }

  const marked = markOverdue(next.tickets, now);
  const newlyOverdue = [...marked.hit];
  if (timing === "late" && !ticket.overdue)
    newlyOverdue.push({ ...ticket, overdue: true });

  return {
    board: { ...next, tickets: marked.tickets },
    ticket: worked,
    spent,
    overtime,
    finished,
    timing,
    arrived,
    newlyOverdue,
    rngState,
  };
}

/** Friday evening: whatever passed its deadline is now late, and old late work is handed off. */
export function closeWeek(
  board: Board,
  day: number,
): {
  board: Board;
  newlyOverdue: BoardTicket[];
  stillOverdue: BoardTicket[];
  reassigned: BoardTicket[];
} {
  const now = clockAt(day + 1, 0);
  const stillOverdue = board.tickets.filter((ticket) => ticket.overdue);
  const marked = markOverdue(board.tickets, now);
  const reassigned = marked.tickets.filter(
    (ticket) => ticket.overdue && now - ticket.dueAt >= REASSIGN_AFTER,
  );
  return {
    board: {
      ...board,
      hour: 0,
      tickets: marked.tickets.filter((ticket) => !reassigned.includes(ticket)),
    },
    newlyOverdue: marked.hit,
    stillOverdue: stillOverdue.filter(
      (ticket) => !reassigned.some((gone) => gone.key === ticket.key),
    ),
    reassigned,
  };
}

/**
 * Monday morning. A close team sometimes takes the most pressing ticket.
 * On a week off, the team covers and every deadline moves a week.
 */
export function openWeek(
  board: Board,
  ctx: BoardContext,
  seed: number,
  offWeek: boolean,
): {
  board: Board;
  helped: BoardTicket | null;
  arrived: BoardTicket[];
  rngState: number;
} {
  if (offWeek) {
    return {
      board: {
        ...board,
        tickets: board.tickets.map((ticket) => ({
          ...ticket,
          dueAt: ticket.dueAt + WEEK_HOURS,
        })),
      },
      helped: null,
      arrived: [],
      rngState: seed,
    };
  }
  let next = board;
  let helped: BoardTicket | null = null;
  const helpRoll = nextUnit(seed);
  if (
    ctx.stats.relationship >= HELP_RELATIONSHIP &&
    helpRoll.value < HELP_CHANCE
  ) {
    helped = sortTickets(next.tickets)[0] ?? null;
    if (helped) {
      const gone = helped.key;
      next = {
        ...next,
        tickets: next.tickets.filter((ticket) => ticket.key !== gone),
      };
    }
  }
  const filled = refillBoard(next, ctx, clockAt(ctx.day, 0), helpRoll.rngState);
  return {
    board: filled.board,
    helped,
    arrived: filled.arrived,
    rngState: filled.rngState,
  };
}

/** What finishing a ticket earns, on top of the work itself. */
export function doneReward(
  priority: Priority,
  timing: Timing,
  salary: number,
): Partial<Stats> {
    if (timing === "late") return {};
  if (timing === "onTime") return priority === "critical" ? { reputation: 1 } : {};
  const reputation = { low: 0, medium: 0, high: 1, critical: 2 }[priority];
  const cash =
    priority === "critical"
      ? Math.round(salary * 0.08)
      : priority === "high"
        ? Math.round(salary * 0.04)
        : 0;
    return { reputation, mood: 1, money: cash };
}

/** Unused hours become free time. Overtime eats it. */
export function slotChange(hour: number): number {
  if (hour > WEEK_HOURS)
    return -Math.ceil((hour - WEEK_HOURS) / HOURS_PER_SLOT);
  return Math.min(
    MAX_EARLY_SLOTS,
    Math.floor((WEEK_HOURS - hour) / HOURS_PER_SLOT),
  );
}
