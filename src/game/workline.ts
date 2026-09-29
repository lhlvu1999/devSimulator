import { COMPANIES, type Company } from "../content/companies";
import { nextLevel, type Level } from "./ladder";
import { stockForCompany } from "./market";
import { payPackage, type PayPackage } from "./pay";
import { nextUnit } from "./rng";

export type Benefit = "remote" | "learning" | "bonus" | "stock" | "gym";

export const BENEFIT_LABEL: Record<Benefit, string> = {
  remote: "Remote days",
  learning: "Learning budget",
  bonus: "Signing bonus",
  stock: "Sign-on shares",
  gym: "Gym membership",
};

/** What each benefit means to the player, without numbers. */
export const BENEFIT_HINT: Record<Benefit, string> = {
  remote: "Work feels lighter.",
  learning: "You learn faster.",
  bonus: "Cash on your first day.",
  stock: "Company shares on your first day.",
  gym: "A healthier start.",
};

export type JobPost = {
  id: string;
  companyId: string;
  level: Level;
  /** A role one level above yours. Passing its interview is a promotion. */
  stretch: boolean;
  /** Salary compared with the company's usual pay. */
  boost: number;
  /** Share of each payday paid in company stock. Zero for private companies. */
  stockPercent: number;
  benefits: Benefit[];
  bonusCash: number;
  stockUnits: number;
  postedDay: number;
  closesDay: number;
};

export type SocialPost = {
  id: string;
  author: string;
  role: string;
  text: string;
  likes: number;
};

export type Feed = {
  posts: JobPost[];
  social: SocialPost[];
  /** Company id to the first day it will talk to you again. */
  blocked: Record<string, number>;
  nextId: number;
};

export const FAIL_COOLDOWN_DAYS = 5;

export function emptyFeed(): Feed {
  return { posts: [], social: [], blocked: {}, nextId: 1 };
}

export function companyById(id: string): Company | undefined {
  return COMPANIES.find((company) => company.id === id);
}

/** The company as it would be after joining through this post. */
export function offeredCompany(post: JobPost): Company | null {
  const base = companyById(post.companyId);
  if (!base) return null;
  return {
    ...base,
    salary: Math.round(base.salary * post.boost),
    energyCost: post.benefits.includes("remote")
      ? Math.max(4, base.energyCost - 3)
      : base.energyCost,
    learning: post.benefits.includes("learning")
      ? Math.round((base.learning + 0.2) * 10) / 10
      : base.learning,
    stockPercent: post.stockPercent ?? base.stockPercent,
  };
}

export function postPay(post: JobPost): PayPackage {
  return payPackage(offeredCompany(post), post.level);
}

export function postPayday(post: JobPost): number {
  return postPay(post).total;
}

export function daysLeft(post: JobPost, day: number): number {
  return post.closesDay - day;
}

/** More reputation brings more posts and more stretch roles. */
export function feedSize(reputation: number): number {
  return Math.min(5, 2 + Math.floor(reputation / 25));
}

export function stretchChance(reputation: number): number {
  return Math.min(0.6, reputation / 100);
}

const AUTHORS: readonly { name: string; role: string }[] = [
  { name: "Priya N.", role: "Senior engineer" },
  { name: "Tom W.", role: "Founder, stealth startup" },
  { name: "Mai L.", role: "Recruiter" },
  { name: "Leo K.", role: "Engineering manager" },
  { name: "Jun P.", role: "Junior engineer" },
  { name: "Ari S.", role: "Product designer" },
  { name: "Morgan B.", role: "Director" },
  { name: "Sam O.", role: "Growth hacker" },
];

const SOCIAL_LINES: readonly string[] = [
  "I'm humbled to announce I renamed a variable. Thank you to everyone who believed in me.",
  "Hot take: this meeting could have been an email.",
  "We just raised money! Now hiring a Senior Fresher with 10 years of experience.",
  "Layoffs at a big company today. Be kind to the people around you.",
  "Day 400 of trying to center a box on a page.",
  "I asked my manager for feedback and got a calendar invite.",
  "Reminder: drink water. The bug will still be there after.",
  "Five things my cat taught me about shipping on time.",
  "My uncle says crypto is going up. My uncle also says a lot of things.",
  "Proud of the team for fixing the checkout on a Friday night. Please let us sleep.",
  "Just finished my 3rd coffee before 9am. Hiring? DM me.",
  "Unpopular opinion: the old design was fine.",
  "Promoted to Team lead! My first task: learning everyone's coffee order.",
  "Our office plant has more uptime than our app.",
];

function roll(seed: number) {
  let rngState = seed;
  return {
    next() {
      const value = nextUnit(rngState);
      rngState = value.rngState;
      return value.value;
    },
    get state() {
      return rngState;
    },
  };
}

/**
 * Drops closed posts, lifts expired cooldowns, and fills the feed back up.
 * Posts never come from your current company or one that turned you down recently.
 */
export function refreshFeed(
  feed: Feed,
  input: {
    day: number;
    companyId: string | null;
    level: Level;
    reputation: number;
    seed: number;
  },
): { feed: Feed; rngState: number } {
  const dice = roll(input.seed);
  const blocked: Record<string, number> = {};
  for (const [id, until] of Object.entries(feed.blocked)) {
    if (until > input.day) blocked[id] = until;
  }
  const posts = feed.posts.filter(
    (post) => post.closesDay >= input.day && post.companyId !== input.companyId,
  );
  let nextId = feed.nextId;
  const target = feedSize(input.reputation);
  const upper = nextLevel(input.level);

  while (posts.length < target) {
    const open = COMPANIES.filter(
      (company) =>
        company.id !== input.companyId &&
        !blocked[company.id] &&
        !posts.some((post) => post.companyId === company.id),
    );
    if (open.length === 0) break;
    const company = open[Math.floor(dice.next() * open.length)] ?? open[0];
    if (!company) break;
    const stretch =
      upper !== null && dice.next() < stretchChance(input.reputation);
    const boost = Math.round((1 + dice.next() * 0.25) * 20) / 20;
    const listed = stockForCompany(company.id) !== undefined;
    const stockPercent = listed
      ? Math.round(company.stockPercent * (0.8 + dice.next() * 0.6) * 20) / 20
      : 0;
    const pool: Benefit[] = listed
      ? ["remote", "learning", "bonus", "stock", "gym"]
      : ["remote", "learning", "bonus", "gym"];
    const benefits: Benefit[] = [];
    const count = dice.next() < 0.4 ? 2 : 1;
    while (benefits.length < count) {
      const pick = pool.splice(Math.floor(dice.next() * pool.length), 1)[0];
      if (pick) benefits.push(pick);
    }
    posts.push({
      id: `post-${nextId}`,
      companyId: company.id,
      level: stretch && upper ? upper : input.level,
      stretch,
      boost,
      stockPercent,
      benefits,
      bonusCash: Math.round((company.salary * boost) / 2),
      stockUnits: 3 + Math.floor(dice.next() * 6),
      postedDay: input.day,
      closesDay: input.day + 2 + Math.floor(dice.next() * 4),
    });
    nextId += 1;
  }

  const social: SocialPost[] = [];
  const lines = [...SOCIAL_LINES];
  for (let index = 0; index < 3 && lines.length > 0; index += 1) {
    const text =
      lines.splice(Math.floor(dice.next() * lines.length), 1)[0] ?? "";
    const author =
      AUTHORS[Math.floor(dice.next() * AUTHORS.length)] ?? AUTHORS[0];
    social.push({
      id: `social-${input.day}-${index}`,
      author: author?.name ?? "Someone",
      role: author?.role ?? "",
      text,
      likes: 3 + Math.floor(dice.next() * 480),
    });
  }

  return { feed: { posts, social, blocked, nextId }, rngState: dice.state };
}

/** Interviews are a short chain of tickets. Stretch roles ask for one more. */
export function interviewRounds(post: JobPost): number {
  return post.stretch ? 3 : 2;
}
