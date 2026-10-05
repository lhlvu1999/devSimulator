import type { CareerState } from "./career";
import { t as tr } from "../i18n";
import type { Stats } from "./types";

/** One game day is one week of life. */
export const START_AGE = 22;
export const WEEKS_PER_YEAR = 52;
export const END_AGE = 60;
export const LAST_DAY = (END_AGE - START_AGE) * WEEKS_PER_YEAR;

export function ageOn(day: number): number {
  return START_AGE + Math.floor((day - 1) / WEEKS_PER_YEAR);
}

export function weekOfYear(day: number): number {
  return ((day - 1) % WEEKS_PER_YEAR) + 1;
}

export function isYearEnd(day: number): boolean {
  return day % WEEKS_PER_YEAR === 0;
}

/** Salary and rent both come round every four weeks, like a month. */
export const PAY_EVERY_WEEKS = 4;
export const RENT = 500;

export function isPayWeek(day: number): boolean {
  return day % PAY_EVERY_WEEKS === 0;
}

export type Season = "Winter" | "Spring" | "Summer" | "Autumn";

export function seasonOf(day: number): Season {
  const week = weekOfYear(day);
  if (week <= 9 || week >= 49) return "Winter";
  if (week <= 22) return "Spring";
  if (week <= 35) return "Summer";
  return "Autumn";
}

/** Holidays on the calendar. The event for a holiday opens on the first day of that week. */
export const HOLIDAYS: readonly { week: number; name: string }[] = [
  { week: 1, name: "New Year" },
  { week: 6, name: "Lunar New Year" },
  { week: 27, name: "Summer trip" },
  { week: 38, name: "Mid-Autumn Festival" },
  { week: 47, name: "Black Friday" },
  { week: 51, name: "Year-end party" },
];

export function nextHoliday(day: number): { name: string; inWeeks: number } {
  const week = weekOfYear(day);
  const upcoming =
    HOLIDAYS.find((holiday) => holiday.week >= week) ?? HOLIDAYS[0];
  const target = upcoming?.week ?? 1;
  const inWeeks =
    target >= week ? target - week : WEEKS_PER_YEAR - week + target;
  return { name: upcoming?.name ?? "New Year", inWeeks };
}

/* ---------- Life goals ---------- */

export type GoalId = "fire" | "home" | "top";

export const HOME_PRICE = 180_000;
export const FIRE_TARGET = 500_000;

export const GOALS: Record<
  GoalId,
  { title: string; blurb: string; target: string }
> = {
  fire: {
    title: "Retire early",
    blurb: "Save and invest until you never need to work again.",
    target: `Reach $${FIRE_TARGET.toLocaleString("en-US")} net worth`,
  },
  home: {
    title: "Own a home",
    blurb: "Buy a place of your own, with a garden for the cat.",
    target: `Buy a $${HOME_PRICE.toLocaleString("en-US")} home from the shop`,
  },
  top: {
    title: "Reach the top",
    blurb: "Climb as high as the ladder goes, on either track.",
    target: "Become Principal engineer or Director",
  },
};

export function goalProgress(state: CareerState, netWorth: number): number {
  if (state.goal === "fire") return Math.min(1, netWorth / FIRE_TARGET);
  if (state.goal === "home") {
    return state.ownsHome ? 1 : Math.min(0.99, state.stats.money / HOME_PRICE);
  }
  if (state.goal === "top") {
    const rungs: Record<string, number> = {
      fresher: 0,
      junior: 1,
      mid: 2,
      senior: 3,
      lead: 3,
      staff: 4,
      manager: 4,
      principal: 5,
      director: 5,
    };
    return (rungs[state.level] ?? 0) / 5;
  }
  return 0;
}

export function goalMet(state: CareerState, netWorth: number): boolean {
  return state.goal !== null && goalProgress(state, netWorth) >= 1;
}

/* ---------- Free time ---------- */

/** Weeknights are short evenings after work. The weekend has room for bigger things. */
export type SlotKind = "night" | "weekend";

export type ActivityId =
  | "gym"
  | "rest"
  | "friends"
  | "drinks"
  | "meetup"
  | "date"
  | "outdoors"
  | "family"
  | "hackathon"
  | "vacation";

export type Activity = {
  id: ActivityId;
  name: string;
  blurb: string;
  cost: number;
  energy: number;
  slots: number;
  when: SlotKind;
  effects: Partial<Stats>;
};

export const NIGHT_SLOTS = 2;
export const WEEKEND_SLOTS = 2;
/** Without a job, weeknights open up. */
export const JOBLESS_NIGHTS = 3;

export const ACTIVITIES: readonly Activity[] = [
  {
    id: "gym",
    name: "Gym",
    blurb: "Sweat it out.",
    cost: 15,
    energy: 15,
    slots: 1,
    when: "night",
    effects: { health: 6, mood: 2 },
  },
  {
    id: "rest",
    name: "Quiet night in",
    blurb: "Tea, blanket, the cat.",
    cost: 0,
    energy: 0,
    slots: 1,
    when: "night",
    effects: { health: 3, mood: 4 },
  },
  {
    id: "friends",
    name: "Dinner with friends",
    blurb: "Good food and bad jokes.",
    cost: 40,
    energy: 10,
    slots: 1,
    when: "night",
    effects: { mood: 8 },
  },
  {
    id: "drinks",
    name: "Team drinks",
    blurb: "Stories you can't repeat.",
    cost: 35,
    energy: 10,
    slots: 1,
    when: "night",
    effects: { relationship: 3, mood: 3, health: -2 },
  },
  {
    id: "meetup",
    name: "Tech meetup",
    blurb: "Name tags and pizza.",
    cost: 20,
    energy: 10,
    slots: 1,
    when: "night",
    effects: { reputation: 2, skill: 10 },
  },
  {
    id: "date",
    name: "Date day",
    blurb: "Brunch, a walk, something nice for two.",
    cost: 80,
    energy: 10,
    slots: 1,
    when: "weekend",
    effects: { mood: 12, health: 1 },
  },
  {
    id: "outdoors",
    name: "Get outside",
    blurb: "A hike, a bike ride, fresh air.",
    cost: 10,
    energy: 15,
    slots: 1,
    when: "weekend",
    effects: { health: 7, mood: 5 },
  },
  {
    id: "family",
    name: "Visit family",
    blurb: "Home cooking and questions about your job.",
    cost: 30,
    energy: 10,
    slots: 1,
    when: "weekend",
    effects: { mood: 10, health: 2 },
  },
  {
    id: "hackathon",
    name: "Weekend hackathon",
    blurb: "Two days, no sleep, one demo.",
    cost: 0,
    energy: 30,
    slots: 2,
    when: "weekend",
    effects: { skill: 40, reputation: 2, mood: -2, health: -3 },
  },
  {
    id: "vacation",
    name: "Vacation",
    blurb: "A long weekend far from the laptop.",
    cost: 900,
    energy: 0,
    slots: 2,
    when: "weekend",
    effects: { mood: 25, health: 10 },
  },
];

export function activityById(id: string): Activity | undefined {
  return ACTIVITIES.find((activity) => activity.id === id);
}

/* ---------- Sleep ---------- */

export type SleepMode = "early" | "normal" | "late";

/**
 * A habit for the week. Early nights cost an evening and heal the body.
 * Late nights buy an evening and start next week tired.
 */
export const SLEEP: Record<
  SleepMode,
  { label: string; blurb: string; nights: number; health: number; mood: number; energy: number }
> = {
  early: {
    label: "Early",
    blurb: "In bed by ten. One less evening, a fresher body.",
    nights: -1,
    health: 4,
    mood: 1,
    energy: 100,
  },
  normal: {
    label: "Normal",
    blurb: "Seven hours, most nights.",
    nights: 0,
    health: 0,
    mood: 0,
    energy: 100,
  },
  late: {
    label: "Late",
    blurb: "One more evening of your own. Monday will hurt.",
    nights: 1,
    health: -3,
    mood: 0,
    energy: 80,
  },
};

/* ---------- Weekly drift and stakes ---------- */

/** The grind wears mood down every week. Free time is how it comes back. */
export const WEEKLY_MOOD_DRAIN = 5;
export const WEEKLY_HEALTH_HEAL = 3;

/** Health slowly slips with age unless you look after it. */
export function agingLoss(day: number): number {
  const age = ageOn(day);
  if (age >= 55) return 2;
  if (age >= 45) return 1;
  if (age >= 35) return day % 2 === 0 ? 1 : 0;
  return 0;
}

/** Seconds added to (or taken from) every ticket by mood. */
export function moodSeconds(mood: number): number {
  if (mood < 15) return -4;
  if (mood < 30) return -2;
  if (mood >= 75) return 1;
  return 0;
}

export type OffWeek = "sick" | "burnout";

export const SICK_BELOW = 25;
export const SICK_CHANCE = 0.4;
export const SICK_BILL = 300;
export const BURNOUT_BELOW = 15;

/* ---------- Endings ---------- */

export type EndingKind = "goal" | "burnout" | "health" | "age";

export type Ending = {
  kind: EndingKind;
  title: string;
  story: string;
  age: number;
  week: number;
  netWorth: number;
  score: number;
};

export function endingFor(state: CareerState, netWorth: number): Ending | null {
  const age = ageOn(state.day);
  const base = { age, week: state.day, netWorth };
  let kind: EndingKind | null = null;
  if (goalMet(state, netWorth)) kind = "goal";
  else if (state.stats.mood <= 0) kind = "burnout";
  else if (state.stats.health <= 0) kind = "health";
  else if (state.day >= LAST_DAY) kind = "age";
  if (!kind) return null;

    const goal = (state.goal ? tr(GOALS[state.goal].title) : tr("live well")).toLowerCase();
  const text: Record<EndingKind, { title: string; story: string }> = {
    goal: {
      title: tr("You did it"),
      story: tr("You set out to {goal}, and at {age} you have. The cat approves.", { goal, age }),
    },
    burnout: {
      title: tr("Burned out"),
      story: tr(
        "One morning you could not open the laptop. You step away to rebuild. It happens to good people.",
      ),
    },
    health: {
      title: tr("Your body said stop"),
      story: tr("Years of late nights caught up. The doctor's orders come first now."),
    },
    age: {
      title: tr("Retired at 60"),
      story: tr(
        "The long road is over. You didn't quite {goal}, but you're still here, and so is the cat.",
        { goal },
      ),
    },
  };
  const kindScore: Record<EndingKind, number> = {
    goal: 2000,
    age: 600,
    burnout: 150,
    health: 150,
  };
  const early = kind === "goal" ? Math.max(0, END_AGE - age) * 60 : 0;
  const score = Math.round(
    kindScore[kind] +
      early +
      netWorth / 500 +
      state.stats.mood * 3 +
      state.stats.health * 3 +
      state.achievements.length * 100,
  );
  return { kind, ...text[kind], ...base, score };
}
