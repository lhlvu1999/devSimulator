import {
  buildOffers,
  type Company,
  type CompanyType,
} from "../content/companies";
import {
  deviceById,
  lookById,
  type DeviceId,
  type LookId,
} from "../content/gear";
import { pantryById } from "../content/pantry";
import {
  FAIL_COOLDOWN_DAYS,
  emptyFeed,
  offeredCompany,
  refreshFeed,
  type Feed,
  type JobPost,
} from "./workline";
import type { CodeGrade, Stats } from "./types";
import { STAT_KEYS } from "./types";
import { fresherProfile, type PlacementOutcome } from "./placement";
import { formatMoney } from "./format";
import {
  LEVEL_GAMES,
  LEVEL_TITLE,
  emptyProgress,
  milestonesMet,
  nextLevel,
  requirements,
  type Level,
  type Progress,
  type Requirement,
  type Track,
  trackOf,
  twinOf,
} from "./ladder";
import { taskDifficulty, type Difficulty } from "./difficulty";
import { WORK_GAME_LABEL, type WorkGame } from "./workGames";
import {
  emptyHoldings,
  pushHistory,
  rollNews,
  rollPrices,
  seedHistory,
  stockForCompany,
  type Holdings,
  type MarketId,
  type PriceHistory,
  type Prices,
  type StockNews,
} from "./market";
import { payPackage, type PayPackage } from "./pay";

export type Section =
  "placement" | "offers" | "room" | "work" | "personal" | "summary";

export type CareerState = {
  section: Section;
  day: number;
  stats: Stats;
  placementLabel: string | null;
  placementBlurb: string | null;
  offers: Company[];
  company: Company | null;
  prices: Prices;
  history: PriceHistory;
  news: StockNews[];
  holdings: Holdings;
  deviceId: DeviceId;
  lookId: LookId;
  ownedDevices: DeviceId[];
  ownedLooks: LookId[];
  workDone: boolean;
  level: Level;
  /** The day this level started. */
  levelDay: number;
  /** Clean tickets per game since the last promotion. */
  progress: Progress;
  /** The last day a promotion review was tried, so a fail waits until tomorrow. */
  reviewDay: number | null;
  feed: Feed;
  /** Seed for the next work ticket. Moves on after every ticket so reopening Work deals something new. */
  ticketSeed: number;
  rngState: number;
  log: string[];
};

function clampStats(stats: Stats): Stats {
  const next = { ...stats, money: Math.max(0, Math.round(stats.money)) };
  for (const key of STAT_KEYS) {
    if (key === "money") continue;
    next[key] = Math.max(0, Math.min(100, Math.round(stats[key])));
  }
  return next;
}

export function createCareer(seed = 0x5eed): CareerState {
  const market = seedHistory(seed);
  return {
    section: "placement",
    day: 1,
    stats: {
      money: 0,
      energy: 80,
      mood: 70,
      skill: 10,
      reputation: 10,
      health: 85,
      relationship: 40,
    },
    placementLabel: null,
    placementBlurb: null,
    offers: [],
    company: null,
    prices: market.prices,
    history: market.history,
    news: market.news,
    holdings: emptyHoldings(),
    deviceId: "laptop",
    lookId: "plain",
    ownedDevices: ["laptop"],
    ownedLooks: ["plain"],
    workDone: false,
    level: "fresher",
    levelDay: 1,
    progress: emptyProgress(),
    reviewDay: null,
    feed: emptyFeed(),
    ticketSeed: (seed ^ 0x7ac1e75) >>> 0,
    rngState: seed,
    log: [],
  };
}

export function finishPlacement(
  state: CareerState,
  outcome: PlacementOutcome,
  moves: number,
): CareerState {
  if (state.section !== "placement") return state;
  const profile = fresherProfile(outcome, moves);
  const offered = buildOffers(profile.stats.skill, state.rngState);
  return {
    ...state,
    section: "offers",
    stats: profile.stats,
    placementLabel: profile.label,
    placementBlurb: profile.blurb,
    offers: offered.offers,
    rngState: offered.rngState,
    log: [`Placement: ${profile.label}.`],
  };
}

export function acceptOffer(
  state: CareerState,
  companyId: string,
): CareerState {
  if (state.section !== "offers") return state;
  const company = state.offers.find((offer) => offer.id === companyId);
  if (!company) return state;
  const refreshed = refreshFeed(state.feed, {
    day: state.day,
    companyId: company.id,
    level: state.level,
    reputation: state.stats.reputation,
    seed: state.rngState,
  });
  return {
    ...state,
    section: "room",
    company,
    workDone: false,
    levelDay: state.day,
    feed: refreshed.feed,
    rngState: refreshed.rngState,
    log: [`You join ${company.name}.`],
  };
}

/** Pay for an interview up front, like any other ticket. */
export function startInterview(
  state: CareerState,
  postId: string,
): CareerState {
  const post = state.feed.posts.find((item) => item.id === postId);
  if (!post || post.closesDay < state.day || !state.company) return state;
  const cost = ticketEnergyCost(state);
  if (state.stats.energy < cost) return state;
  return {
    ...state,
    stats: clampStats({ ...state.stats, energy: state.stats.energy - cost }),
  };
}

export function failInterview(state: CareerState, postId: string): CareerState {
  const post = state.feed.posts.find((item) => item.id === postId);
  if (!post) return state;
  const company = offeredCompany(post);
  return {
    ...state,
    feed: {
      ...state.feed,
      posts: state.feed.posts.filter((item) => item.id !== postId),
      blocked: {
        ...state.feed.blocked,
        [post.companyId]: state.day + FAIL_COOLDOWN_DAYS,
      },
    },
    log: [
      `${company?.name ?? "The company"} passed on you this time. Try them again in a few days.`,
    ],
  };
}

export function declinePost(state: CareerState, postId: string): CareerState {
  return {
    ...state,
    feed: {
      ...state.feed,
      posts: state.feed.posts.filter((item) => item.id !== postId),
    },
  };
}

/**
 * Move to the new company. The title stays unless the post was a stretch role,
 * which is a promotion. Milestone progress moves with you, except on a promotion.
 */
export function joinCompany(state: CareerState, post: JobPost): CareerState {
  const company = offeredCompany(post);
  if (!company || !state.company) return state;
  const promoted = post.level !== state.level;
  let money = state.stats.money;
  let health = state.stats.health;
  let holdings = state.holdings;
  const notes = [`You join ${company.name} as ${LEVEL_TITLE[post.level]}.`];
  if (post.benefits.includes("bonus")) {
    money += post.bonusCash;
    notes.push(`Signing bonus: +${formatMoney(post.bonusCash)}.`);
  }
  if (post.benefits.includes("stock")) {
    const listed = stockForCompany(company.id);
    if (listed) {
      holdings = {
        ...holdings,
        [listed.id]: holdings[listed.id] + post.stockUnits,
      };
      notes.push(`Sign-on shares: ${post.stockUnits} ${listed.id}.`);
    }
  }
  if (post.benefits.includes("gym")) {
    health += 15;
    notes.push("A gym membership. You feel better already.");
  }
  const joined: CareerState = {
    ...state,
    company,
    level: post.level,
    levelDay: promoted ? state.day : state.levelDay,
    progress: promoted ? emptyProgress() : state.progress,
    reviewDay: promoted ? state.day : state.reviewDay,
    holdings,
    stats: clampStats({ ...state.stats, money, health }),
    feed: {
      ...state.feed,
      posts: state.feed.posts.filter(
        (item) => item.companyId !== post.companyId,
      ),
    },
  };
  notes.push(`Payday is now ${formatMoney(paydayFor(joined))}.`);
  return { ...joined, log: notes };
}

/** Low health makes every ticket more tiring. Good health makes it a little lighter. */
export function healthScale(health: number): number {
  return Math.min(1.7, Math.max(0.8, 1 + (70 - health) / 100));
}

export function ticketEnergyCost(state: CareerState): number {
  const base = state.company?.energyCost ?? 12;
  return Math.round(base * healthScale(state.stats.health));
}

/** Pushing on while nearly empty wears the body down faster. */
const STRAIN = 1;
const OVERTIME_STRAIN = 2;
const OVERTIME_BELOW = 25;
const NIGHT_HEAL = 3;

export function recordWork(
  state: CareerState,
  grade: CodeGrade,
  bonus = 0,
  game?: WorkGame,
): CareerState {
  if (
    (state.section !== "work" && state.section !== "room") ||
    !state.company ||
    state.workDone
  )
    return state;
  const learn = state.company.learning;
  const leading = trackOf(state.level) === "manager";
  const earned =
    grade === "clear"
      ? Math.round(4 * learn)
      : grade === "late"
        ? Math.round(2 * learn)
        : 0;
  const skill = leading ? Math.floor(earned / 2) : earned;
  const reputation =
    grade === "clear" && state.company.type === "enterprise"
      ? 2
      : grade === "clear"
        ? 1
        : 0;
  const mood = grade === "miss" ? -2 : grade === "clear" ? 1 : 0;
  const relationship = grade === "clear" ? (leading ? 2 : 1) : 0;
  const note =
    grade === "clear"
      ? "The screen matches the note."
      : grade === "late"
        ? "You got there with almost no time left."
        : "The clock ran out.";
  const progress =
    grade === "clear" && game
      ? { ...state.progress, [game]: state.progress[game] + 1 }
      : state.progress;
  const energy = state.stats.energy - ticketEnergyCost(state);
  const strain = STRAIN + (energy < OVERTIME_BELOW ? OVERTIME_STRAIN : 0);
  return {
    ...state,
    progress,
    stats: clampStats({
      ...state.stats,
      skill: state.stats.skill + skill,
      reputation: state.stats.reputation + reputation,
      mood: state.stats.mood + mood,
      relationship: state.stats.relationship + relationship,
      energy,
      health: state.stats.health - strain,
      money: state.stats.money + (grade === "miss" ? 0 : bonus),
    }),
    log: [bonus > 0 ? `${note} A little extra, ${formatMoney(bonus)}.` : note],
  };
}

export type CareerStatus = {
  level: Level;
  track: Track;
  title: string;
  nextTitle: string | null;
  items: Requirement[];
  ready: boolean;
  triedToday: boolean;
  games: readonly WorkGame[];
  payday: number;
  pay: PayPackage;
  /** The level at the same height on the other track, if there is one. */
  switchTo: { level: Level; title: string } | null;
};

/**
 * Engineers face harder work as skill grows. Managers are judged on their team:
 * a close team makes the work easier, and skill only nudges it.
 */
export function difficultyFor(state: CareerState): Difficulty {
  if (trackOf(state.level) === "manager") {
    const pressure =
      22 -
      Math.floor(state.stats.relationship / 10) * 2 +
      Math.floor(state.stats.skill / 25);
    return pressure < 13 ? "easy" : pressure < 19 ? "normal" : "hard";
  }
  return taskDifficulty(state.stats.skill, state.stats.relationship);
}

export type { PayPackage } from "./pay";

export function paydayFor(state: CareerState): number {
  return payPackage(state.company, state.level).total;
}

export function careerStatus(state: CareerState): CareerStatus {
  const upcoming = nextLevel(state.level);
  const items = requirements({
    level: state.level,
    progress: state.progress,
    stats: state.stats,
    gameLabel: WORK_GAME_LABEL,
  });
  const twin = twinOf(state.level);
  return {
    level: state.level,
    track: trackOf(state.level),
    title: LEVEL_TITLE[state.level],
    nextTitle: upcoming ? LEVEL_TITLE[upcoming] : null,
    items,
    ready: upcoming !== null && milestonesMet(items),
    triedToday: state.reviewDay === state.day,
    games: LEVEL_GAMES[state.level],
    payday: paydayFor(state),
    pay: payPackage(state.company, state.level),
    switchTo: twin ? { level: twin, title: LEVEL_TITLE[twin] } : null,
  };
}

/** Move across to the twin level on the other track. Progress carries over at half. */
export function switchTrack(state: CareerState): CareerState {
  const twin = twinOf(state.level);
  if (!twin || !state.company) return state;
  const progress = emptyProgress();
  for (const game of Object.keys(progress) as WorkGame[]) {
    progress[game] = Math.floor((state.progress[game] ?? 0) / 2);
  }
  const moved: CareerState = {
    ...state,
    level: twin,
    levelDay: state.day,
    progress,
    reviewDay: null,
  };
  return {
    ...moved,
    log: [
      `You are now ${LEVEL_TITLE[twin]}. Payday is ${formatMoney(paydayFor(moved))}.`,
      trackOf(twin) === "manager"
        ? "Your work is people and plans now. Your team matters more than your code."
        : "You are back to building. Your skill matters more again.",
    ],
  };
}

/** The review is played from the next level's games. */
export function reviewGames(state: CareerState): readonly WorkGame[] {
  const upcoming = nextLevel(state.level);
  return upcoming ? LEVEL_GAMES[upcoming] : LEVEL_GAMES[state.level];
}

export function passReview(state: CareerState): CareerState {
  const status = careerStatus(state);
  const upcoming = nextLevel(state.level);
  if (!status.ready || status.triedToday || !upcoming) return state;
  const promoted: CareerState = {
    ...state,
    level: upcoming,
    levelDay: state.day,
    progress: emptyProgress(),
    reviewDay: state.day,
    stats: clampStats({
      ...state.stats,
      mood: state.stats.mood + 8,
      reputation: state.stats.reputation + 4,
    }),
  };
  const added = LEVEL_GAMES[upcoming].filter(
    (game) => !LEVEL_GAMES[state.level].includes(game),
  );
  return {
    ...promoted,
    log: [
      `You are now ${LEVEL_TITLE[upcoming]}. Payday rises to ${formatMoney(paydayFor(promoted))}.`,
      ...added.map((game) => `New work unlocked: ${WORK_GAME_LABEL[game]}.`),
    ],
  };
}

export function failReview(state: CareerState): CareerState {
  const status = careerStatus(state);
  if (!status.ready || status.triedToday) return state;
  return {
    ...state,
    reviewDay: state.day,
    log: ["The review did not pass this time. You can try again tomorrow."],
  };
}

export function finishWork(state: CareerState): CareerState {
  if (state.section !== "work" && state.section !== "room") return state;
  return {
    ...state,
    section: "room",
    workDone: true,
    log: ["Work is done for today."],
  };
}

export function consumeItem(state: CareerState, id: string): CareerState {
  if (state.section !== "personal" && state.section !== "room") return state;
  const item = pantryById(id);
  if (!item || state.stats.money < item.cost) return state;
  const next = { ...state.stats, money: state.stats.money - item.cost };
  for (const key of Object.keys(item.effects) as (keyof Stats)[]) {
    next[key] += item.effects[key] ?? 0;
  }
  return {
    ...state,
    stats: clampStats(next),
    log: [`${item.name}. ${item.blurb}`],
  };
}

export function buyGear(
  state: CareerState,
  kind: "device" | "look",
  id: string,
): CareerState {
  if (state.section !== "personal" && state.section !== "room") return state;
  if (kind === "device") {
    const device = deviceById(id);
    if (state.ownedDevices.includes(device.id)) {
      return { ...state, deviceId: device.id };
    }
    if (state.stats.money < device.cost) return state;
    return {
      ...state,
      deviceId: device.id,
      ownedDevices: [...state.ownedDevices, device.id],
      stats: { ...state.stats, money: state.stats.money - device.cost },
      log: [
        `${device.name} is on the desk. Tasks get ${device.timeBonus} extra seconds.`,
      ],
    };
  }
  const look = lookById(id);
  if (state.ownedLooks.includes(look.id)) {
    return { ...state, lookId: look.id };
  }
  if (state.stats.money < look.cost) return state;
  return {
    ...state,
    lookId: look.id,
    ownedLooks: [...state.ownedLooks, look.id],
    stats: { ...state.stats, money: state.stats.money - look.cost },
    log: [`You change into ${look.name}.`],
  };
}

export function sceneFor(
  state: CareerState,
): CompanyType | "interview" | "home" {
  if (state.section === "work" && state.company) return state.company.type;
  if (state.section === "room" && state.company) return state.company.type;
  if (state.section === "personal" || state.section === "summary")
    return "home";
  return "interview";
}

export function buyAsset(
  state: CareerState,
  id: MarketId,
  count = 1,
): CareerState {
  if (state.section !== "personal" && state.section !== "room") return state;
  const price = Math.max(1, Math.round(state.prices[id]));
  const units = Math.min(count, Math.floor(state.stats.money / price));
  if (units < 1) return state;
  return {
    ...state,
    stats: { ...state.stats, money: state.stats.money - price * units },
    holdings: { ...state.holdings, [id]: state.holdings[id] + units },
  };
}

export function sellAsset(
  state: CareerState,
  id: MarketId,
  count = 1,
): CareerState {
  const units = Math.min(count, state.holdings[id]);
  if ((state.section !== "personal" && state.section !== "room") || units < 1)
    return state;
  const gain = Math.max(1, Math.round(state.prices[id])) * units;
  return {
    ...state,
    stats: { ...state.stats, money: state.stats.money + gain },
    holdings: { ...state.holdings, [id]: state.holdings[id] - units },
  };
}

export function settleBlackjack(
  state: CareerState,
  net: number,
  note: string,
): CareerState {
  if (state.section !== "personal" && state.section !== "room") return state;
  return {
    ...state,
    stats: clampStats({ ...state.stats, money: state.stats.money + net }),
    log: [note],
  };
}

export function endDay(state: CareerState): CareerState {
  if (
    (state.section !== "personal" && state.section !== "room") ||
    !state.company
  )
    return state;
  const rolled = rollPrices(state.prices, state.rngState, state.news);
  const paper = rollNews(rolled.rngState);
  const nextDay = state.day + 1;
  const refreshed = refreshFeed(state.feed, {
    day: nextDay,
    companyId: state.company.id,
    level: state.level,
    reputation: state.stats.reputation,
    seed: paper.rngState,
  });
  let money = state.stats.money;
  let holdings = state.holdings;
  const headlines = paper.news.map((item) => item.headline);
  const notes = [
    ...rolled.notes,
    headlines.length > 0
      ? `Tomorrow's paper: ${headlines.join(" ")}`
      : "Tomorrow's paper: a quiet day in business news.",
  ];
  const fresh = refreshed.feed.posts.filter(
    (post) => !state.feed.posts.some((old) => old.id === post.id),
  ).length;
  if (fresh > 0)
    notes.push(
      `Workline: ${fresh} new job post${fresh > 1 ? "s" : ""} for you.`,
    );
  if (state.day % 5 === 0) {
    const pay = payPackage(state.company, state.level);
    money += pay.cash;
    let line = `Payday as ${LEVEL_TITLE[state.level]}. +${formatMoney(pay.cash)} cash`;
    if (pay.ticker && pay.stock > 0) {
      const price = state.prices[pay.ticker];
      const shares = Math.floor(pay.stock / price);
      money += pay.stock - shares * price;
      holdings = { ...holdings, [pay.ticker]: holdings[pay.ticker] + shares };
      line += shares > 0 ? ` and ${shares} ${pay.ticker} shares.` : ".";
    } else {
      line += ".";
    }
    notes.unshift(line);
  }
  if (state.day % 10 === 0) {
    money = Math.max(0, money - 500);
    notes.unshift("Rent clears. -500.");
  }
  return {
    ...state,
    section: "summary",
    day: nextDay,
    rngState: refreshed.rngState,
    feed: refreshed.feed,
    prices: rolled.prices,
    history: pushHistory(state.history, rolled.prices),
    news: paper.news,
    holdings,
    workDone: false,
    stats: clampStats({
      ...state.stats,
      money,
      energy: 100,
      health: state.stats.health + NIGHT_HEAL,
      mood: Math.min(100, state.stats.mood + 2),
    }),
    log: notes,
  };
}

export function nextMorning(state: CareerState): CareerState {
  if (state.section !== "summary") return state;
  return { ...state, section: "room", log: [] };
}

export function netWorth(state: CareerState): number {
  const invested = (Object.keys(state.holdings) as MarketId[]).reduce(
    (sum, id) => sum + state.holdings[id] * state.prices[id],
    0,
  );
  return Math.round(state.stats.money + invested);
}
