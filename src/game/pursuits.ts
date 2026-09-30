import { nextUnit } from "./rng";
import type { StatKey, Stats } from "./types";

/**
 * Things that build up over many weeks outside work: courses that end in a
 * certificate, hobbies that reward keeping a streak, and a side project that
 * can grow into real income.
 */

export type CourseId = "frontend" | "systems" | "leadership";

export type Course = {
  id: CourseId;
  name: string;
  blurb: string;
  lessons: number;
  cost: number;
  energy: number;
  /** Each lesson. */
  lesson: Partial<Stats>;
  /** On the last lesson, with the certificate. */
  finish: Partial<Stats>;
};

export const COURSES: readonly Course[] = [
  {
    id: "frontend",
    name: "Frontend fundamentals",
    blurb: "Layouts, state, and the browser.",
    lessons: 6,
    cost: 60,
    energy: 12,
    lesson: { skill: 8 },
    finish: { skill: 80, reputation: 2 },
  },
  {
    id: "systems",
    name: "System design",
    blurb: "Queues, caches, and trade-offs.",
    lessons: 10,
    cost: 90,
    energy: 15,
    lesson: { skill: 12 },
    finish: { skill: 200, reputation: 4 },
  },
  {
    id: "leadership",
    name: "Leading people",
    blurb: "Feedback, one-on-ones, and hard talks.",
    lessons: 8,
    cost: 80,
    energy: 12,
    lesson: { relationship: 1 },
    finish: { relationship: 8, reputation: 4 },
  },
];

export type HobbyId = "running" | "guitar" | "cooking";

export type Hobby = {
  id: HobbyId;
  name: string;
  blurb: string;
  cost: number;
  energy: number;
  effects: Partial<Stats>;
  /** The stat a long streak adds to. */
  streakStat: StatKey;
};

export const HOBBIES: readonly Hobby[] = [
  {
    id: "running",
    name: "Running",
    blurb: "A little further each week.",
    cost: 0,
    energy: 15,
    effects: { health: 4 },
    streakStat: "health",
  },
  {
    id: "guitar",
    name: "Guitar",
    blurb: "Three chords and a dream.",
    cost: 10,
    energy: 5,
    effects: { mood: 4 },
    streakStat: "mood",
  },
  {
    id: "cooking",
    name: "Cooking",
    blurb: "Real food, made at home.",
    cost: 25,
    energy: 8,
    effects: { health: 2, mood: 2 },
    streakStat: "mood",
  },
];

/** A streak adds one point per extra week, up to this. */
export const MAX_STREAK_BONUS = 4;

export type HobbyProgress = {
  sessions: number;
  streak: number;
  lastDay: number;
};

export type SideStage = { name: string; from: number; income: number };

/** Sessions it takes to reach each stage, and what a week earns there. */
export const SIDE_STAGES: readonly SideStage[] = [
  { name: "Idea", from: 0, income: 0 },
  { name: "Prototype", from: 5, income: 0 },
  { name: "Launched", from: 12, income: 60 },
  { name: "Growing", from: 25, income: 180 },
  { name: "Thriving", from: 50, income: 450 },
];

export const SIDE_SESSION = {
  cost: 0,
  energy: 20,
  effects: { skill: 6, mood: -1 } as Partial<Stats>,
};

/** Without a session in this many weeks, users drift away and income stops. */
export const SIDE_STALL_WEEKS = 3;

export type Pursuits = {
  courses: Record<CourseId, number>;
  certificates: CourseId[];
  hobbies: Record<HobbyId, HobbyProgress>;
  side: { sessions: number; lastDay: number };
};

export function emptyPursuits(): Pursuits {
  const hobby = (): HobbyProgress => ({ sessions: 0, streak: 0, lastDay: 0 });
  return {
    courses: { frontend: 0, systems: 0, leadership: 0 },
    certificates: [],
    hobbies: { running: hobby(), guitar: hobby(), cooking: hobby() },
    side: { sessions: 0, lastDay: 0 },
  };
}

export function courseById(id: string): Course | undefined {
  return COURSES.find((course) => course.id === id);
}

export function hobbyById(id: string): Hobby | undefined {
  return HOBBIES.find((hobby) => hobby.id === id);
}

/** Keeps going if you played last week, starts over after a missed week. Twice in one week counts once. */
export function nextStreak(progress: HobbyProgress, day: number): number {
  if (progress.lastDay === day) return progress.streak;
  if (progress.lastDay === day - 1) return progress.streak + 1;
  return 1;
}

/** A streak shown to the player: it only counts if it's still alive this week or last. */
export function liveStreak(progress: HobbyProgress, day: number): number {
  return progress.lastDay >= day - 1 ? progress.streak : 0;
}

export function hobbyEffects(hobby: Hobby, streak: number): Partial<Stats> {
  const bonus = Math.min(MAX_STREAK_BONUS, Math.max(0, streak - 1));
  return {
    ...hobby.effects,
    [hobby.streakStat]: (hobby.effects[hobby.streakStat] ?? 0) + bonus,
  };
}

export function sideStage(sessions: number): {
  stage: SideStage;
  next: SideStage | null;
} {
  let index = 0;
  SIDE_STAGES.forEach((stage, at) => {
    if (sessions >= stage.from) index = at;
  });
  return { stage: SIDE_STAGES[index]!, next: SIDE_STAGES[index + 1] ?? null };
}

export function sideIsActive(side: Pursuits["side"], day: number): boolean {
  return side.sessions > 0 && side.lastDay > day - SIDE_STALL_WEEKS;
}

/** This week's side income: the stage's rate give or take a fifth, only while you keep at it. */
export function sideIncome(
  side: Pursuits["side"],
  day: number,
  seed: number,
): { income: number; note: string | null; rngState: number } {
  const { stage } = sideStage(side.sessions);
  const roll = nextUnit(seed);
  if (stage.income === 0)
    return { income: 0, note: null, rngState: roll.rngState };
  if (!sideIsActive(side, day))
    return {
      income: 0,
      note: "Your side project stalled. Users want updates.",
      rngState: roll.rngState,
    };
  const income = Math.round(stage.income * (0.8 + roll.value * 0.4));
  return {
    income,
    note: `Side project (${stage.name}): +$${income}.`,
    rngState: roll.rngState,
  };
}
