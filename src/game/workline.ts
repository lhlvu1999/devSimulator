import { COMPANIES, type Company } from "../content/companies";
import { levelGap, nextLevel, type Level } from "./ladder";
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
  /** Above your level when it was posted. Joining is a step up. */
  stretch: boolean;
  /** What HR said about your CV. Unset until you apply. */
  application?: "shortlisted" | "rejected";
  /** Salary compared with the company's usual pay. */
  boost: number;
  /** Share of each payday paid in company stock. Zero for private companies. */
  stockPercent: number;
  benefits: Benefit[];
  bonusCash: number;
  stockUnits: number;
  postedDay: number;
  closesDay: number;
  /** Set when the player talked the pay up before accepting. */
  negotiated?: boolean;
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

/** More reputation brings more posts. */
export function feedSize(reputation: number): number {
  return Math.min(5, 2 + Math.floor(reputation / 25));
}

/** Most posts are at your level or one up. A few reach two up, for a CV that's ahead of its title. */
function postLevel(current: Level, roll: number): Level {
  const one = nextLevel(current);
  const two = one ? nextLevel(one) : null;
  if (two && roll >= 0.85) return two;
  if (one && roll >= 0.45) return one;
  return current;
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
  { name: "Riley C.", role: "Staff engineer" },
  { name: "Noah F.", role: "VP Engineering" },
  { name: "Elena V.", role: "People ops" },
  { name: "Chris D.", role: "DevRel" },
  { name: "Hana Y.", role: "QA lead" },
  { name: "Omar J.", role: "Security engineer" },
  { name: "Zoe M.", role: "Product manager" },
  { name: "Ben R.", role: "Founder, Series A" },
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
  "Shipped a one-line fix. Writing the post-mortem took longer than the fix.",
  "Anyone else feel like Slack is just a to-do list that talks back?",
  "We migrated to the cloud. The bill migrated upward too.",
  "Interview tip: when they ask about weakness, say you care too much. They love that.",
  "My standup update: still blocked. My blocker: physics.",
  "New job! Grateful for this journey. (Translation: I survived onboarding.)",
  "If AI replaces engineers, who will fix the AI's CSS?",
  "Remote work pro: no commute. Remote work con: the commute from bed to desk.",
  "We hit 99.9% uptime. The 0.1% was during my demo.",
  "Just learned our prod database is named after someone's cat. Respect.",
  "Three reverts later, I am once again at peace with main.",
  "Posting to stay visible. Visibility does not equal productivity, but here we are.",
  "Our intern fixed the bug senior engineers missed. Intern is going places.",
  "Budget season means one thing: free lunch in exchange for your honest feedback.",
  "I code in dark mode because my bugs feel less scary that way.",
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

type FeedInput = {
  day: number;
  companyId: string | null;
  level: Level;
  reputation: number;
  seed: number;
  /** A close team refers you: one more post, and HR looks kindlier at your CV. */
  relationship?: number;
  /** Skill lifts how high a post's pay can go. */
  skill?: number;
};

/** Relationship at or above this brings referrals. */
export const REFERRAL_RELATIONSHIP = 60;

type Dice = ReturnType<typeof roll>;

function makePost(
  company: (typeof COMPANIES)[number],
  input: FeedInput,
  level: Level,
  id: number,
  dice: Dice,
): JobPost {
  const reach = Math.min(0.25, (input.skill ?? 0) / 400);
  const boost = Math.round((1 + dice.next() * (0.25 + reach)) * 20) / 20;
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
  return {
    id: `post-${id}`,
    companyId: company.id,
        level,
    stretch: levelGap(input.level, level) > 0,
    boost,
    stockPercent,
    benefits,
    bonusCash: Math.round((company.salary * boost) / 2),
    stockUnits: 3 + Math.floor(dice.next() * 6),
    postedDay: input.day,
    closesDay: input.day + 2 + Math.floor(dice.next() * 4),
  };
}

function openCompanies(
  posts: readonly JobPost[],
  blocked: Record<string, number>,
  companyId: string | null,
) {
  return COMPANIES.filter(
    (company) =>
      company.id !== companyId &&
      !blocked[company.id] &&
      !posts.some((post) => post.companyId === company.id),
  );
}

/**
 * Drops closed posts, lifts expired cooldowns, and fills the feed back up.
 * Posts never come from your current company or one that turned you down recently.
 */
export function refreshFeed(
  feed: Feed,
  input: FeedInput,
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
    const referred = (input.relationship ?? 0) >= REFERRAL_RELATIONSHIP;
  const target = feedSize(input.reputation) + (referred ? 1 : 0);

  while (posts.length < target) {
    const open = openCompanies(posts, blocked, input.companyId);
    if (open.length === 0) break;
    const company = open[Math.floor(dice.next() * open.length)] ?? open[0];
    if (!company) break;
    posts.push(
            makePost(company, input, postLevel(input.level, dice.next()), nextId, dice),
    );
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

/** Interviews are a short chain of tickets: two, plus one for every level the role sits above yours. */
export function interviewRounds(post: JobPost, current: Level): number {
  return 2 + levelGap(current, post.level);
}

/** A recruiter reaches out with one role above yours, from a company not already posting. They skip the CV screen. */
export function recruiterPost(
  feed: Feed,
  input: FeedInput,
): { feed: Feed; rngState: number; post: JobPost | null } {
  const dice = roll(input.seed);
  const open = openCompanies(feed.posts, feed.blocked, input.companyId);
  const company = open[Math.floor(dice.next() * open.length)];
  if (!company) return { feed, rngState: dice.state, post: null };
    const post = makePost(company, input, nextLevel(input.level) ?? input.level, feed.nextId, dice);
  const lasting: JobPost = { ...post, closesDay: input.day + 4, application: "shortlisted" };
  return {
    feed: { ...feed, posts: [lasting, ...feed.posts], nextId: feed.nextId + 1 },
    rngState: dice.state,
    post: lasting,
  };
}
