import type { Difficulty } from "./difficulty";
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

const TALKS: readonly {
  mood: Mood;
  says: string;
  right: string;
  wrong: [string, string];
}[] = [
  {
    mood: "stressed",
    says: "I'm drowning in tickets this week.",
    right: "Let's move two of them to next week.",
    wrong: ["Great, I'll add one more.", "Just work a bit faster."],
  },
  {
    mood: "bored",
    says: "I've done the same fix ten times now.",
    right: "Want to try the new payment feature?",
    wrong: ["That's just the job.", "Take a longer lunch."],
  },
  {
    mood: "proud",
    says: "I shipped the login page!",
    right: "Nice work. Show it at the team demo.",
    wrong: ["Took you long enough.", "Okay. What's next?"],
  },
  {
    mood: "stuck",
    says: "I can't figure out this bug.",
    right: "Let's look at it together for twenty minutes.",
    wrong: ["Figure it out yourself.", "Just skip it."],
  },
  {
    mood: "tired",
    says: "I stayed late three nights in a row.",
    right: "Take tomorrow morning off.",
    wrong: ["Keep it up!", "Everyone does that."],
  },
  {
    mood: "unsure",
    says: "Am I doing okay here?",
    right: "Yes. Here's what you did well this month.",
    wrong: ["Hard to say.", "Why do you ask?"],
  },
  {
    mood: "upset",
    says: "Someone keeps changing my work without asking.",
    right: "Let's all agree on a plan together.",
    wrong: ["Just ignore them.", "Change their work back."],
  },
  {
    mood: "leaving",
    says: "I got another job offer.",
    right: "Thanks for telling me. What would make you stay?",
    wrong: ["Good luck, bye.", "You can't leave."],
  },
  {
    mood: "stressed",
    says: "The launch date feels impossible.",
    right: "Let's cut the plan down to what matters most.",
    wrong: ["It's fine, just stay late.", "Launches are always like that."],
  },
  {
    mood: "bored",
    says: "Meetings take up my whole week.",
    right: "Let's drop the ones you don't need to be in.",
    wrong: ["Meetings build character.", "Try to enjoy them more."],
  },
  {
    mood: "proud",
    says: "A customer wrote to thank me!",
    right: "That's great. Share it with the whole team.",
    wrong: ["Customers say lots of things.", "Back to work, then."],
  },
  {
    mood: "stuck",
    says: "I don't understand the new tool.",
    right: "Let's book an hour with someone who knows it.",
    wrong: ["Read the manual again.", "Everyone else gets it."],
  },
  {
    mood: "tired",
    says: "My baby kept me up all night.",
    right: "Take it easy today. Start late if you need to.",
    wrong: ["That's not a work problem.", "Coffee fixes that."],
  },
  {
    mood: "unsure",
    says: "Should I try for a promotion?",
    right: "Yes. Let's write down what you need together.",
    wrong: ["Maybe in a few years.", "Why would you want that?"],
  },
  {
    mood: "upset",
    says: "I wasn't invited to the big planning meeting.",
    right: "You should be there. I'll add you now.",
    wrong: ["It wasn't that important.", "You're too busy anyway."],
  },
  {
    mood: "leaving",
    says: "I'm thinking about moving to another team.",
    right: "Let's talk about what you'd like to work on.",
    wrong: ["Do what you want.", "No one leaves my team."],
  },
];

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

const TASK_NAMES = [
  "Checkout fix",
  "New onboarding",
  "Dark mode",
  "Faster search",
  "Update icons",
  "Refund button",
  "Email receipts",
  "Bug bash",
  "Clean old code",
  "Help page",
  "Login with phone",
  "Order history",
  "Gift wrap option",
  "Speed up photos",
  "Coupon codes",
  "Push alerts",
  "Accessibility pass",
  "Translate to French",
  "New pricing page",
  "Fix crash on start",
];

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

const FEATURES = [
  "Saved carts",
  "Team chat",
  "Offline mode",
  "New logo",
  "Gift cards",
  "Price alerts",
  "Voice search",
  "Photo filters",
  "Referral bonus",
  "Weekly report",
  "One-tap reorder",
  "Birthday discount",
  "Smart watch app",
  "Shared wishlists",
  "Live chat help",
  "3D product view",
  "Split payments",
  "Loyalty points",
  "Night delivery",
  "Recipe ideas",
];

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
