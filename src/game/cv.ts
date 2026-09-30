import { nextLevel, type Level } from "./ladder";
import type { Stats } from "./types";

/**
 * What HR sees when you apply. Skill and experience open most doors;
 * senior roles also look at reputation, and manager roles at how you lead a team.
 */
export type Cv = {
  skill: number;
  reputation: number;
  relationship: number;
  /** Weeks employed, anywhere. */
  experience: number;
  certificates: number;
};

/** Each certificate reads like this much extra skill on paper. */
export const CERTIFICATE_SKILL = 50;

type Bar = {
  skill?: number;
  experience: number;
  reputation?: number;
  relationship?: number;
};

/**
 * The bar for each level. Set close to where the same player would be when
 * promoted in-house, so switching jobs is a real alternative, not a shortcut.
 */
export const HIRING_BAR: Record<Level, Bar> = {
  fresher: { experience: 0 },
  junior: { skill: 80, experience: 4 },
  mid: { skill: 220, experience: 14 },
  senior: { skill: 420, experience: 30, reputation: 30 },
  staff: { skill: 800, experience: 60, reputation: 50 },
  principal: { skill: 1300, experience: 100, reputation: 65 },
  lead: { skill: 350, experience: 30, relationship: 50 },
  manager: { experience: 55, relationship: 60, reputation: 45 },
  director: { experience: 95, relationship: 65, reputation: 60 },
};

export type CvLine = {
  id: keyof Bar;
  label: string;
  have: number;
  need: number;
  met: boolean;
};

export function cvOf(
  stats: Stats,
  experience: number,
  certificates: number,
): Cv {
  return {
    skill: stats.skill,
    reputation: stats.reputation,
    relationship: stats.relationship,
    experience,
    certificates,
  };
}

/** The requirements a post lists, checked against your CV. */
export function cvLines(cv: Cv, level: Level): CvLine[] {
  const bar = HIRING_BAR[level];
  const lines: CvLine[] = [];
  const add = (
    id: keyof Bar,
    label: string,
    have: number,
    need: number | undefined,
  ) => {
    if (need === undefined || need <= 0) return;
    lines.push({ id, label, have, need, met: have >= need });
  };
  add(
    "skill",
    "Skill",
    cv.skill + cv.certificates * CERTIFICATE_SKILL,
    bar.skill,
  );
  add("experience", "Experience", cv.experience, bar.experience);
  add("reputation", "Reputation", cv.reputation, bar.reputation);
  add("relationship", "Leadership", cv.relationship, bar.relationship);
  return lines;
}

/** How well the CV matches: the weakest requirement, as a share of what's asked. 1 means every box is ticked. */
export function cvMatch(cv: Cv, level: Level): number {
  const lines = cvLines(cv, level);
  if (lines.length === 0) return 1;
  return Math.min(1, ...lines.map((line) => line.have / line.need));
}

export type Fit = "strong" | "close" | "reach";

export const FIT_LABEL: Record<Fit, string> = {
  strong: "You match",
  close: "Close match",
  reach: "Long shot",
};

const CLOSE_FROM = 0.8;
const REACH_FROM = 0.6;
/** A friend at the company puts in a word. */
const REFERRAL_BONUS = 0.15;

export function fitOf(match: number): Fit {
  if (match >= 1) return "strong";
  if (match >= CLOSE_FROM) return "close";
  return "reach";
}

/**
 * The chance HR calls you in. Meeting every requirement always gets an interview.
 * Close enough is a coin flip that improves as you get closer. Far off rarely works.
 */
export function screenChance(match: number, referred: boolean): number {
  if (match >= 1) return 1;
  const base =
    match >= CLOSE_FROM
      ? 0.25 + ((match - CLOSE_FROM) / (1 - CLOSE_FROM)) * 0.45
      : match >= REACH_FROM
        ? 0.05
        : 0;
  return Math.min(0.95, base + (referred && base > 0 ? REFERRAL_BONUS : 0));
}

/** The most a strong CV can take off a new company's promotion tasks. */
export const MAX_TASK_DISCOUNT = 0.5;

/**
 * Joining with a CV already close to the next level's bar means fewer tasks to prove it.
 * Halfway to that bar or less: full counts. Meeting it: half. Rounded to 5%.
 * The top of each track has nothing to discount.
 */
export function taskScaleFor(cv: Cv, level: Level): number {
  const upcoming = nextLevel(level);
  if (!upcoming) return 1;
  const lead = Math.min(1, Math.max(0, (cvMatch(cv, upcoming) - 0.5) / 0.5));
  return Math.round((1 - MAX_TASK_DISCOUNT * lead) * 20) / 20;
}
