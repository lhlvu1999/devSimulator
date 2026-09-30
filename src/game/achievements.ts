import type { CareerState } from "./career";
import { ageOn } from "./life";
import { trackOf } from "./ladder";

export type Achievement = {
  id: string;
  title: string;
  blurb: string;
  met: (state: CareerState, netWorth: number) => boolean;
};

const count = (state: CareerState, key: string) => state.counters[key] ?? 0;

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "promoted",
    title: "Moving up",
    blurb: "Get your first promotion.",
    met: (s) => count(s, "promotions") >= 1,
  },
  {
    id: "manager",
    title: "People person",
    blurb: "Move to the manager track.",
    met: (s) => trackOf(s.level) === "manager",
  },
  {
    id: "topEarly",
    title: "Top before 30",
    blurb: "Reach Principal or Director before 30.",
    met: (s) =>
      (s.level === "principal" || s.level === "director") && ageOn(s.day) < 30,
  },
  {
    id: "sixFigures",
    title: "Six figures",
    blurb: "Reach $100,000 net worth.",
    met: (_s, worth) => worth >= 100_000,
  },
  {
    id: "millionaire",
    title: "Millionaire",
    blurb: "Reach $1,000,000 net worth.",
    met: (_s, worth) => worth >= 1_000_000,
  },
  {
    id: "survivor",
    title: "Survivor",
    blurb: "Make it through a layoff wave.",
    met: (s) => count(s, "layoffsSurvived") >= 1,
  },
  {
    id: "hopper",
    title: "Job hopper",
    blurb: "Change jobs three times.",
    met: (s) => count(s, "jobs") >= 3,
  },
  {
    id: "negotiator",
    title: "Negotiator",
    blurb: "Talk an offer up.",
    met: (s) => count(s, "negotiated") >= 1,
  },
  {
    id: "vacation",
    title: "Out of office",
    blurb: "Take a vacation.",
    met: (s) => count(s, "vacation") >= 1,
  },
  {
    id: "gym",
    title: "Gym regular",
    blurb: "Go to the gym 20 times.",
    met: (s) => count(s, "gym") >= 20,
  },
  {
    id: "healthy50",
    title: "Healthy at 50",
    blurb: "Turn 50 with health at 70 or more.",
    met: (s) => ageOn(s.day) >= 50 && s.stats.health >= 70,
  },
  {
    id: "homeowner",
    title: "Homeowner",
    blurb: "Buy your own home.",
    met: (s) => s.ownsHome,
  },
];

/** Adds any newly met achievements and returns their titles for the log. */
export function checkAchievements(
  state: CareerState,
  netWorth: number,
): { achievements: string[]; unlocked: string[] } {
  const unlocked = ACHIEVEMENTS.filter(
    (item) =>
      !state.achievements.includes(item.id) && item.met(state, netWorth),
  );
  return {
    achievements: [...state.achievements, ...unlocked.map((item) => item.id)],
    unlocked: unlocked.map((item) => item.title),
  };
}
