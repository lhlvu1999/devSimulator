import type { Difficulty } from "./difficulty";
import {
  ONE_ON_ONE_TALKS,
  ROADMAP_FEATURES,
  SPRINT_TASK_NAMES,
} from "./pools/manageContent";
import { nextUnit } from "./rng";
import { shuffleWith } from "./workGames";

export type Mood =
  | "stressed"
  | "bored"
  | "proud"
  | "stuck"
  | "tired"
  | "unsure"
  | "upset"
  | "leaving";

export type OneOnOneRound = {
  name: string;
  mood: Mood;
  says: string;
  replies: { text: string; right: boolean }[];
};

export type OneOnOnePuzzle = { rounds: OneOnOneRound[]; hint: boolean };

const NAMES = ["Jun", "Morgan", "Sam", "Ari", "Priya", "Leo", "Mai", "Tom"];

const TALKS = ONE_ON_ONE_TALKS;

/** A teammate says how they feel. The right reply fits the feeling. */
export function dealOneOnOne(
  seed: number,
  difficulty: Difficulty,
  relationship: number,
): { puzzle: OneOnOnePuzzle; rngState: number } {
  const count = difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 4;
  const talks = shuffleWith(TALKS, seed);
  const names = shuffleWith(NAMES, talks.rngState);
  let rngState = names.rngState;
  const rounds = talks.items.slice(0, count).map((talk, index) => {
    const replies = shuffleWith(
      [
        { text: talk.right, right: true },
        { text: talk.wrong[0], right: false },
        { text: talk.wrong[1], right: false },
      ],
      rngState,
    );
    rngState = replies.rngState;
    return {
      name: names.items[index] ?? "Sam",
      mood: talk.mood,
      says: talk.says,
      replies: replies.items,
    };
  });
  return { puzzle: { rounds, hint: relationship >= 40 }, rngState };
}

export type SprintTask = {
  id: string;
  name: string;
  points: number;
  must: boolean;
  inPlan: boolean;
  locked: boolean;
};

export type SprintPuzzle = { capacity: number; tasks: SprintTask[] };

const TASK_NAMES = SPRINT_TASK_NAMES;

/**
 * Fill the sprint exactly to the team's capacity. Some cards are a real plan,
 * the rest are distractions. On hard, one card must be in the plan.
 */
export function dealSprint(
  seed: number,
  difficulty: Difficulty,
  relationship: number,
): { puzzle: SprintPuzzle; rngState: number } {
  const planned = difficulty === "easy" ? 2 : 3;
  const extra = difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 4;
  const names = shuffleWith(TASK_NAMES, seed);
  let rngState = names.rngState;
  const roll = () => {
    const next = nextUnit(rngState);
    rngState = next.rngState;
    return next.value;
  };
  const points = () => 1 + Math.floor(roll() * 5);
  const tasks: SprintTask[] = names.items
    .slice(0, planned + extra)
    .map((name, index) => ({
      id: `task-${index}`,
      name,
      points: points(),
      must: difficulty === "hard" && index === 0,
      inPlan: index < planned,
      locked: false,
    }));
  const capacity = tasks
    .filter((task) => task.inPlan)
    .reduce((sum, task) => sum + task.points, 0);
  const helper =
    relationship >= 40
      ? tasks.find((task) => task.inPlan && !task.must)
      : undefined;
  if (helper) helper.locked = true;
  const mixed = shuffleWith(tasks, rngState);
  return { puzzle: { capacity, tasks: mixed.items }, rngState: mixed.rngState };
}

export function sprintSolved(
  puzzle: SprintPuzzle,
  picked: readonly string[],
): boolean {
  const chosen = puzzle.tasks.filter((task) => picked.includes(task.id));
  const total = chosen.reduce((sum, task) => sum + task.points, 0);
  const mustIn = puzzle.tasks.every(
    (task) => !task.must || picked.includes(task.id),
  );
  return total === puzzle.capacity && mustIn;
}

export type Size = "small" | "big";
export type Slot = "now" | "next" | "later";

export type Feature = { id: string; name: string; impact: Size; effort: Size };

export type RoadmapPuzzle = { features: Feature[]; hint: boolean };

export const ROADMAP_RULE =
  "Now: big impact, small effort. Later: small impact, big effort. Next: everything else.";

const FEATURES = ROADMAP_FEATURES;

export function slotFor(feature: Pick<Feature, "impact" | "effort">): Slot {
  if (feature.impact === "big" && feature.effort === "small") return "now";
  if (feature.impact === "small" && feature.effort === "big") return "later";
  return "next";
}

/** Place each feature on the roadmap by how much it helps and how much it costs. */
export function dealRoadmap(
  seed: number,
  difficulty: Difficulty,
  relationship: number,
): { puzzle: RoadmapPuzzle; rngState: number } {
  const count = difficulty === "easy" ? 3 : difficulty === "normal" ? 5 : 6;
  const names = shuffleWith(FEATURES, seed);
  let rngState = names.rngState;
  const roll = () => {
    const next = nextUnit(rngState);
    rngState = next.rngState;
    return next.value;
  };
  const features = names.items.slice(0, count).map((name, index) => {
    const impact: Size = roll() < 0.5 ? "big" : "small";
    const effort: Size = roll() < 0.5 ? "big" : "small";
    return { id: `feature-${index}`, name, impact, effort };
  });
  return { puzzle: { features, hint: relationship >= 40 }, rngState };
}
