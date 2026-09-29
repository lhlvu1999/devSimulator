import type { RigId, Stats, WorkStyle } from "../game/types";

export const MONTH_LENGTH = 20;
export const TOTAL_DAYS = 40;

export const STARTING_STATS: Stats = {
  money: 800,
  energy: 80,
  mood: 70,
  skill: 15,
  reputation: 20,
  health: 85,
  relationship: 40,
};

export const RENT = 700;
export const SALARY = 1800;
export const MID_SALARY = 2600;
export const RENT_DAYS = [1, 15];
export const PAY_DAYS = [10, 20];

/** Sleep still happens after every evening. Rest, study, and people add on top. */
export const SLEEP_ENERGY = 12;

export const SAVINGS_STAKE = 200;

export const REVIEW = {
  skill: 36,
  reputation: 40,
  healthViable: 40,
};

export const SENIOR_REVIEW = {
  skill: 72,
  reputation: 78,
  healthViable: 40,
};

export const MONITOR_COST = 450;
export const COCKPIT_COST = 750;

/** Days that are editor time unless a big company turns them into meetings. */
export const CODE_DAYS = [2, 4, 7, 8, 9, 11, 12, 14, 18];

/** Meetings a startup skips and replaces with code. */
export const STARTUP_CODE_DAYS = [6, 15];

/** The few days a big company still lets a fresher touch the editor. */
export const BIGCO_CODE_DAYS = [4, 9, 11, 18];

export const WORK_STYLES: {
  id: WorkStyle;
  label: string;
  blurb: string;
}[] = [
  {
    id: "startup",
    label: "Startup",
    blurb:
      "Fewer meetings. More time in the editor. It costs energy, and you learn faster.",
  },
  {
    id: "bigco",
    label: "Big company",
    blurb:
      "The calendar is the job. Coding is rarer, and someone is always aligning.",
  },
  {
    id: "remote",
    label: "Remote",
    blurb:
      "Quieter days and a longer timer. Pings and doorbells still find you.",
  },
];

export const RIG_LABELS: Record<RigId, string> = {
  laptop: "Starter laptop",
  monitor: "External monitor",
  cockpit: "Home cockpit",
};

export const RETIREMENT_PRESETS = [
  {
    id: "soon",
    amount: 100_000,
    label: "Retire sooner",
    blurb: "100,000. A short number, if the months cooperate.",
  },
  {
    id: "solid",
    amount: 250_000,
    label: "A solid number",
    blurb: "250,000. A long stretch of ordinary months.",
  },
  {
    id: "long",
    amount: 500_000,
    label: "A long game",
    blurb: "500,000. The job has to last.",
  },
] as const;
