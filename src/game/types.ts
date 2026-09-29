export const STAT_KEYS = [
  "money",
  "energy",
  "mood",
  "skill",
  "reputation",
  "health",
  "relationship",
] as const;

export type StatKey = (typeof STAT_KEYS)[number];

export type Stats = Record<StatKey, number>;

export type Effect = Partial<Stats>;

export type Phase = "code" | "work" | "evening" | "summary" | "ending";

export type WorkStyle = "startup" | "bigco" | "remote";

export type RigId = "laptop" | "monitor" | "cockpit";

export type CodeGrade = "clear" | "late" | "miss";

export type EndingKind =
  "burnout" | "on_track" | "needs_improvement" | "health_warning";

export type Choice = {
  id: string;
  label: string;
  detail?: string;
  requires?: Partial<Stats>;
  effects: Effect;
  setFlags?: string[];
  outcome: string;
};

export type DayEvent = {
  day: number;
  title: string | ((flags: readonly string[]) => string);
  scene: string | ((flags: readonly string[]) => string);
  choices: Choice[] | ((flags: readonly string[]) => Choice[]);
};

export type RiskOutcome = {
  weight: number;
  delta: number;
  text: string;
};

export type Activity = {
  id: string;
  label: string;
  detail: string;
  requires?: Partial<Stats>;
  effects: Effect;
  setFlags?: string[];
  outcome: string;
  risk?: {
    stake: number;
    outcomes: RiskOutcome[];
  };
};

export type Rank = "fresher" | "mid";

export type GameState = {
  day: number;
  phase: Phase;
  rank: Rank;
  fresherReview: Exclude<EndingKind, "burnout"> | null;
  style: WorkStyle;
  rig: RigId;
  codedToday: boolean;
  disruptionHandled: boolean;
  stats: Stats;
  flags: string[];
  retirementTarget: number;
  startingMoney: number;
  notes: string[];
  ending: EndingKind | null;
  rngState: number;
};
