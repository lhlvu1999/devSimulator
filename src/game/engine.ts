import {
  BIGCO_CODE_DAYS,
  CODE_DAYS,
  MID_SALARY,
  MONTH_LENGTH,
  PAY_DAYS,
  RENT,
  RENT_DAYS,
  REVIEW,
  SALARY,
  SENIOR_REVIEW,
  SLEEP_ENERGY,
  STARTING_STATS,
  STARTUP_CODE_DAYS,
  TOTAL_DAYS,
} from "../content/config";
import { ACTIVITIES } from "../content/activities";
import { DAYS } from "../content/days";
import { formatMoney } from "./format";
import type {
  Activity,
  Choice,
  CodeGrade,
  DayEvent,
  Effect,
  EndingKind,
  GameState,
  Rank,
  RigId,
  RiskOutcome,
  StatKey,
  Stats,
  WorkStyle,
} from "./types";
import { STAT_KEYS } from "./types";

const BOUNDED: StatKey[] = [
  "energy",
  "mood",
  "skill",
  "reputation",
  "health",
  "relationship",
];

export function resolveTitle(day: DayEvent, flags: readonly string[]): string {
  return typeof day.title === "string" ? day.title : day.title(flags);
}

export function resolveScene(day: DayEvent, flags: readonly string[]): string {
  return typeof day.scene === "string" ? day.scene : day.scene(flags);
}

export function resolveChoices(
  day: DayEvent,
  flags: readonly string[],
): Choice[] {
  return Array.isArray(day.choices) ? day.choices : day.choices(flags);
}

export function getDay(day: number): DayEvent {
  const found = DAYS.find((entry) => entry.day === day);
  if (!found) {
    throw new Error(`Missing day ${day}`);
  }
  return found;
}

export function requirementReason(
  stats: Stats,
  requires?: Partial<Stats>,
): string | null {
  if (!requires) return null;
  for (const key of STAT_KEYS) {
    const need = requires[key];
    if (need == null || stats[key] >= need) continue;
    if (key === "money") return `Needs ${formatMoney(need)}`;
    if (key === "energy") return `Needs ${need} energy`;
    return `Needs more ${key}`;
  }
  return null;
}

export function clampStats(stats: Stats): Stats {
  const next: Stats = { ...stats, money: Math.max(0, Math.round(stats.money)) };
  for (const key of BOUNDED) {
    next[key] = Math.max(0, Math.min(100, Math.round(stats[key])));
  }
  return next;
}

function applyEffect(stats: Stats, effect: Effect): Stats {
  const next = { ...stats };
  for (const key of STAT_KEYS) {
    const delta = effect[key];
    if (delta) next[key] += delta;
  }
  return clampStats(next);
}

function addFlags(flags: string[], setFlags?: string[]): string[] {
  if (!setFlags?.length) return flags;
  const next = [...flags];
  for (const flag of setFlags) {
    if (!next.includes(flag)) next.push(flag);
  }
  return next;
}

function cashflow(
  day: number,
  rank: Rank,
): { effect: Effect; note: string } | null {
  const today = monthDay(day);
  if (RENT_DAYS.includes(today)) {
    return {
      effect: { money: -RENT },
      note: `Rent clears. -${formatMoney(RENT)}`,
    };
  }
  if (PAY_DAYS.includes(today)) {
    const salary = rank === "mid" ? MID_SALARY : SALARY;
    return {
      effect: { money: salary },
      note: `Payday lands. +${formatMoney(salary)}`,
    };
  }
  return null;
}

function withCashflow(state: GameState): GameState {
  const flow = cashflow(state.day, state.rank);
  if (!flow) return state;
  return {
    ...state,
    stats: applyEffect(state.stats, flow.effect),
    notes: [...state.notes, flow.note],
  };
}

function maybeBurnout(state: GameState): GameState {
  if (state.stats.health === 0 || state.stats.mood === 0) {
    return { ...state, phase: "ending", ending: "burnout" };
  }
  return state;
}

export function monthDay(day: number): number {
  return ((day - 1) % MONTH_LENGTH) + 1;
}

export function isCodeDay(day: number, style: WorkStyle): boolean {
  const today = monthDay(day);
  if (style === "bigco") return BIGCO_CODE_DAYS.includes(today);
  if (style === "startup") {
    return CODE_DAYS.includes(today) || STARTUP_CODE_DAYS.includes(today);
  }
  return CODE_DAYS.includes(today);
}

export function activeReview(day: number): typeof REVIEW | null {
  if (monthDay(day) < 16) return null;
  return day <= MONTH_LENGTH ? REVIEW : SENIOR_REVIEW;
}

export function openPhase(day: number, style: WorkStyle): "code" | "work" {
  return isCodeDay(day, style) ? "code" : "work";
}

export function codeTimerSeconds(style: WorkStyle, rig: RigId): number {
  const base = style === "startup" ? 20 : style === "bigco" ? 26 : 32;
  if (rig === "monitor") return base + 5;
  if (rig === "cockpit") return base + 3;
  return base;
}

export function gradeTimed(correct: boolean, remainingMs: number): CodeGrade {
  if (!correct) return "miss";
  if (remainingMs > 0) return "clear";
  return "late";
}

export function gradeFill(
  expected: readonly string[],
  given: readonly string[],
): boolean {
  return (
    given.length === expected.length &&
    expected.every((character, index) => given[index]?.trim() === character)
  );
}

const CODE_NOTES: Record<WorkStyle, Record<CodeGrade, string>> = {
  startup: {
    clear: "Inside the timer. The shortcut sticks, and so does the cost.",
    late: "It compiles, late. You learned something and spent the afternoon.",
    miss: "The timer wins. The ticket is still red, and you are still tired.",
  },
  bigco: {
    clear: "You got a rare hour in the editor, and the diff is clean.",
    late: "The change lands after the calendar wanted you back.",
    miss: "The editor loses to the clock. The meeting will ask anyway.",
  },
  remote: {
    clear: "Quiet hour, clean diff. The apartment cooperated.",
    late: "You finish after the tea goes cold. It still ships.",
    miss: "The hour scattered. The ticket looks the way you left it.",
  },
};

function codeBonus(style: WorkStyle, grade: CodeGrade, rig: RigId): Effect {
  const cockpit = rig === "cockpit" && grade === "clear" ? 1 : 0;
  if (style === "startup") {
    if (grade === "clear") return { skill: 6 + cockpit, energy: -12 };
    if (grade === "late") return { skill: 3, energy: -12 };
    return { skill: 1, energy: -8, mood: -3 };
  }
  if (style === "bigco") {
    if (grade === "clear")
      return { skill: 3 + cockpit, energy: -5, reputation: 1 };
    if (grade === "late") return {};
    return { energy: -3, mood: -2 };
  }
  if (grade === "clear") return { skill: 4 + cockpit, energy: -6 };
  if (grade === "late") return { skill: 2, energy: -5 };
  return { energy: -4, mood: -1 };
}

export function finishCode(state: GameState, grade: CodeGrade): GameState {
  if (state.phase !== "code" || state.ending) return state;
  const skipMeeting =
    state.style === "startup" &&
    STARTUP_CODE_DAYS.includes(monthDay(state.day));
  const next = maybeBurnout({
    ...state,
    stats: applyEffect(state.stats, codeBonus(state.style, grade, state.rig)),
    notes: [...state.notes, CODE_NOTES[state.style][grade]],
    codedToday: !skipMeeting,
    phase: skipMeeting ? "evening" : "work",
  });
  return next;
}

export type Disruption = {
  title: string;
  body: string;
};

const PINGS: Disruption[] = [
  {
    title: "Standup in 2 min",
    body: "Morgan started the room. Your editor is still the foreground.",
  },
  {
    title: "Sam",
    body: "You alive, or is the laptop?",
  },
  {
    title: "#incidents",
    body: "Can someone look at this real quick?",
  },
  {
    title: "Doorbell",
    body: "The hallway is loud. Your focus is not.",
  },
];

export function disruptionFor(state: GameState): Disruption | null {
  if (state.phase !== "code" || state.disruptionHandled || state.ending)
    return null;
  const { value } = nextUnit(state.rngState + state.day * 17);
  const chance =
    state.style === "remote" ? 0.62 : state.style === "bigco" ? 0.22 : 0.12;
  if (value > chance) return null;
  return PINGS[state.day % PINGS.length];
}

export function ignorePenaltySeconds(rig: RigId): number {
  return rig === "cockpit" ? 1 : 5;
}

export function applyDisruption(
  state: GameState,
  response: "ignore" | "join",
): GameState {
  if (
    (state.phase !== "code" && state.phase !== "work") ||
    state.disruptionHandled
  ) {
    return state;
  }
  const shield = state.rig === "cockpit";
  const effects: Effect =
    response === "join"
      ? {
          energy: shield ? -2 : -5,
          reputation: state.style === "bigco" ? 2 : 0,
          relationship: state.style === "remote" ? 2 : 1,
        }
      : { mood: shield ? -1 : -2 };
  const note =
    response === "join"
      ? "You answered the ping. The code waited."
      : "You left the ping on read. The screen is yours again.";
  return maybeBurnout({
    ...state,
    stats: applyEffect(state.stats, effects),
    disruptionHandled: true,
    notes: [...state.notes, note],
  });
}

export function createNewGame(
  retirementTarget: number,
  rngState = 0x5eed,
  style: WorkStyle = "bigco",
): GameState {
  return withCashflow({
    day: 1,
    phase: openPhase(1, style),
    rank: "fresher",
    fresherReview: null,
    style,
    rig: "laptop",
    codedToday: false,
    disruptionHandled: false,
    stats: { ...STARTING_STATS },
    flags: [],
    retirementTarget,
    startingMoney: STARTING_STATS.money,
    notes: [],
    ending: null,
    rngState,
  });
}

export function selectWork(state: GameState, choiceId: string): GameState {
  if (state.phase !== "work" || state.ending) return state;
  const choice = resolveChoices(getDay(state.day), state.flags).find(
    (entry) => entry.id === choiceId,
  );
  if (!choice || requirementReason(state.stats, choice.requires)) return state;
  return maybeBurnout({
    ...state,
    stats: applyEffect(state.stats, choice.effects),
    flags: addFlags(state.flags, choice.setFlags),
    notes: [...state.notes, choice.outcome],
    phase: "evening",
  });
}

export function selectEvening(state: GameState, activityId: string): GameState {
  if (state.phase !== "evening" || state.ending) return state;
  const activity = ACTIVITIES.find((entry) => entry.id === activityId);
  if (!activity || requirementReason(state.stats, activity.requires))
    return state;

  if (activity.id === "upgrade-monitor" && state.rig !== "laptop") return state;
  if (activity.id === "upgrade-cockpit" && state.rig !== "monitor")
    return state;

  const resolved = resolveActivity(activity, state.rngState);
  const rig: RigId =
    activity.id === "upgrade-monitor"
      ? "monitor"
      : activity.id === "upgrade-cockpit"
        ? "cockpit"
        : state.rig;
  return maybeBurnout({
    ...state,
    rig,
    rngState: resolved.rngState,
    stats: applyEffect(applyEffect(state.stats, resolved.effects), {
      energy: SLEEP_ENERGY,
    }),
    flags: addFlags(state.flags, activity.setFlags),
    notes: [...state.notes, resolved.outcome],
    phase: "summary",
  });
}

export function continueFromSummary(state: GameState): GameState {
  if (state.phase !== "summary" || state.ending) return state;
  if (state.day >= TOTAL_DAYS) {
    return {
      ...state,
      phase: "ending",
      ending: resolveReview(state.stats, SENIOR_REVIEW),
    };
  }
  const day = state.day + 1;
  const promoting = state.day === MONTH_LENGTH;
  const fresherReview = promoting
    ? resolveReview(state.stats, REVIEW)
    : state.fresherReview;
  const notes = promoting ? [promotionNote(fresherReview)] : [];
  return withCashflow({
    ...state,
    day,
    rank: promoting ? "mid" : state.rank,
    fresherReview,
    phase: openPhase(day, state.style),
    notes,
    codedToday: false,
    disruptionHandled: false,
    flags: promoting
      ? addFlags(state.flags, [`fresher:${fresherReview}`])
      : state.flags,
  });
}

function promotionNote(review: Exclude<EndingKind, "burnout"> | null): string {
  if (review === "on_track") {
    return "Morgan promotes you to mid-level. The next month is yours to run, not only to survive.";
  }
  if (review === "health_warning") {
    return "The level change lands with a pace plan. Mid-level starts, and so does the warning.";
  }
  return "You are mid-level on paper, and on a performance note. Morgan is watching this month.";
}

export function resolveReview(
  stats: Stats,
  bar: typeof REVIEW = REVIEW,
): Exclude<EndingKind, "burnout"> {
  if (stats.health <= bar.healthViable) return "health_warning";
  if (stats.skill >= bar.skill && stats.reputation >= bar.reputation) {
    return "on_track";
  }
  return "needs_improvement";
}

export function projectRetirement(
  state: Pick<GameState, "stats" | "startingMoney" | "retirementTarget">,
): {
  years: number | null;
  line: string;
} {
  const { money } = state.stats;
  const target = state.retirementTarget;
  if (money >= target) {
    return {
      years: 0,
      line: "The retirement number is already in the account.",
    };
  }
  const net = money - state.startingMoney;
  if (net <= 0) {
    return {
      years: null,
      line: "This month did not add savings. At this pace the target stays put.",
    };
  }
  const years = Math.round(((target - money) / net / 12) * 10) / 10;
  const shown = Number.isInteger(years) ? years.toFixed(0) : years.toFixed(1);
  return {
    years,
    line: `If every month went like this one, the target is about ${shown} years out.`,
  };
}

export function nextUnit(seed: number): { rngState: number; value: number } {
  const rngState = (seed + 0x6d2b79f5) >>> 0;
  let t = rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { rngState, value };
}

export function pickWeighted<T extends { weight: number }>(
  items: readonly T[],
  unit: number,
): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = unit * total;
  for (const item of items) {
    cursor -= item.weight;
    if (cursor < 0) return item;
  }
  return items[items.length - 1];
}

function resolveActivity(
  activity: Activity,
  rngState: number,
): { effects: Effect; outcome: string; rngState: number } {
  if (!activity.risk) {
    return { effects: activity.effects, outcome: activity.outcome, rngState };
  }
  const roll = nextUnit(rngState);
  const picked: RiskOutcome = pickWeighted(activity.risk.outcomes, roll.value);
  return {
    effects: { money: picked.delta },
    outcome: picked.text,
    rngState: roll.rngState,
  };
}
