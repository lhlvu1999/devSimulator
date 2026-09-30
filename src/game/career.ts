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
  REFERRAL_RELATIONSHIP,
  companyById,
  emptyFeed,
  offeredCompany,
  refreshFeed,
  type Feed,
  type JobPost,
} from "./workline";
import type { CodeGrade, Stats } from "./types";
import { fresherProfile, type PlacementOutcome } from "./placement";
import { formatMoney } from "./format";
import { checkAchievements } from "./achievements";
import {
  applyEvent,
  rollEvent,
  seasonalEvent,
  SALE_PRICE,
  type LifeEvent,
} from "./events";
import {
  BURNOUT_BELOW,
  
  HOME_PRICE,
    JOBLESS_NIGHTS,
  NIGHT_SLOTS,
  SLEEP,
  WEEKEND_SLOTS,
  RENT,
  SICK_BELOW,
  SICK_BILL,
  SICK_CHANCE,
  
  WEEKLY_HEALTH_HEAL,
  WEEKLY_MOOD_DRAIN,
    activityById,
  agingLoss,
  endingFor,
  isPayWeek,
  isYearEnd,
  type Ending,
  type GoalId,
    type OffWeek,
  type SleepMode,
  type SlotKind,
} from "./life";
import { nextUnit, roundByChance } from "./rng";
import { skillRating } from "./skill";
import { cvMatch, cvOf, screenChance, taskScaleFor, type Cv } from "./cv";
import {
  SIDE_SESSION,
  courseById,
  emptyPursuits,
  hobbyById,
  hobbyEffects,
  nextStreak,
  sideIncome,
  sideStage,
  type CourseId,
  type HobbyId,
  type Pursuits,
} from "./pursuits";
import { addStats, clampStats } from "./stats";
import {
  LEVEL_GAMES,
  LEVEL_TITLE,
  emptyProgress,
  milestonesMet,
    levelGap,
  nextLevel,
  requirements,
  type Level,
  type Progress,
  type Requirement,
  type Track,
  trackOf,
  twinOf,
} from "./ladder";
import { DIFFICULTY_REWARD, typicalDifficulty, type Difficulty } from "./difficulty";
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
import { addShares, bookOf, removeShares } from "./portfolio";
import {
  OVERDUE_HIT,
  REASSIGNED_HIT,
  STILL_OVERDUE_HIT,
  WEEK_HOURS,
  closeWeek,
  doneReward,
  emptyBoard,
  openWeek,
  refillBoard,
  slotChange,
  clockAt,
  workPart,
  type Board,
  type BoardContext,
  type BoardTicket,
} from "./board";

export type Section =
  | "placement"
  | "goal"
  | "offers"
  | "room"
  | "work"
  | "personal"
  | "summary"
  | "ending";

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
  /** What was paid for the shares still held, per market. */
  costBasis: Holdings;
  /** Shares held when prices last moved. Only these count toward the weekly change. */
  heldAtRoll: Holdings;
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
  /** Share of the usual promotion tasks this company asks for, set from your CV when you joined. */
  taskScale: number;
  /** The last day a promotion review was tried, so a fail waits until tomorrow. */
  reviewDay: number | null;
  feed: Feed;
  /** Seed for the next work ticket. Moves on after every ticket so reopening Work deals something new. */
  ticketSeed: number;
  /** This week's tickets and the hours already worked. */
  board: Board;
  /** What this life is for. Chosen after placement. */
  goal: GoalId | null;
  ownsHome: boolean;
    /** Weeknight evenings left this week. */
  nightSlots: number;
  /** Weekend days left this week. */
  weekendSlots: number;
  /** This week's sleep habit. */
  sleep: SleepMode;
  /** Courses, hobbies, and the side project. */
  pursuits: Pursuits;
  /** A week you cannot work: too sick or burned out. */
  offWeek: OffWeek | null;
  /** Waiting for the player to choose, shown over the room. */
  event: LifeEvent | null;
  /** Running tallies for the yearly review and achievements. */
  counters: Record<string, number>;
  achievements: string[];
  ending: Ending | null;
    /** The week you joined your current company, for tenure. */
  joinedDay: number;
  /** Weeks employed anywhere. Goes on your CV. */
  experience: number;
    /** Prices on the first week of the year, to measure how the company grew. */
  yearOpen: Prices;
  
  /** The week a shop sale runs, if any. */
  saleWeek: number | null;
  rngState: number;
  log: string[];
};

function bumpCounter(
  counters: Record<string, number>,
  key: string,
  by = 1,
): Record<string, number> {
  return { ...counters, [key]: (counters[key] ?? 0) + by };
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
    costBasis: emptyHoldings(),
    heldAtRoll: emptyHoldings(),
    deviceId: "laptop",
    lookId: "plain",
    ownedDevices: ["laptop"],
    ownedLooks: ["plain"],
    workDone: false,
    level: "fresher",
    levelDay: 1,
        progress: emptyProgress(),
    taskScale: 1,
    reviewDay: null,
    feed: emptyFeed(),
    ticketSeed: (seed ^ 0x7ac1e75) >>> 0,
    board: emptyBoard(),
    goal: null,
    ownsHome: false,
        nightSlots: NIGHT_SLOTS,
    weekendSlots: WEEKEND_SLOTS,
    sleep: "normal",
    pursuits: emptyPursuits(),
    offWeek: null,
    event: null,
    counters: {},
    achievements: [],
    ending: null,
        joinedDay: 1,
    experience: 0,
        yearOpen: market.prices,
    
    saleWeek: null,
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
    section: "goal",
    stats: profile.stats,
    placementLabel: profile.label,
    placementBlurb: profile.blurb,
    offers: offered.offers,
    rngState: offered.rngState,
    log: [`Placement: ${profile.label}.`],
  };
}

/** Pick what this life is for. New players go on to offers; older saves go back to the room. */
export function chooseGoal(state: CareerState, goal: GoalId): CareerState {
  if (state.section !== "goal") return state;
  return { ...state, goal, section: state.company ? "room" : "offers" };
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
  const hired: CareerState = {
    ...state,
    section: "room",
    company,
    workDone: false,
    levelDay: state.day,
    joinedDay: state.day,
    feed: refreshed.feed,
    rngState: refreshed.rngState,
    log: [`You join ${company.name}.`],
  };
  return freshBoard(hired, 0);
}

/** Pay for an interview up front, like any other ticket. */
export function startInterview(
  state: CareerState,
  postId: string,
): CareerState {
    const post = state.feed.posts.find((item) => item.id === postId);
  if (!post || post.closesDay < state.day || post.application !== "shortlisted") return state;
  const cost = ticketEnergyCost(state);
  if (state.stats.energy < cost) return state;
  return {
    ...state,
    stats: clampStats({ ...state.stats, energy: state.stats.energy - cost }),
  };
}

/** What HR sees when you apply. */
export function playerCv(state: CareerState): Cv {
  return cvOf(state.stats, state.experience, state.pursuits.certificates.length);
}

/**
 * Send your CV. HR always calls if you meet every requirement, sometimes if
 * you're close, and rarely if you're far off. A turned-down CV blocks that
 * company for a few days, like a failed interview.
 */
export function applyToPost(state: CareerState, postId: string): CareerState {
  const post = state.feed.posts.find((item) => item.id === postId);
  if (!post || post.application || post.closesDay < state.day) return state;
  const company = companyById(post.companyId);
  const referred = state.stats.relationship >= REFERRAL_RELATIONSHIP;
  const chance = screenChance(cvMatch(playerCv(state), post.level), referred);
  const roll = nextUnit(state.rngState);
  const shortlisted = roll.value < chance;
  return {
    ...state,
    rngState: roll.rngState,
    feed: {
      ...state.feed,
      posts: state.feed.posts.map((item) =>
        item.id === postId
          ? { ...item, application: shortlisted ? "shortlisted" : "rejected" }
          : item,
      ),
      blocked: shortlisted
        ? state.feed.blocked
        : { ...state.feed.blocked, [post.companyId]: state.day + FAIL_COOLDOWN_DAYS },
    },
    counters: bumpCounter(state.counters, "applications"),
    log: [
      shortlisted
        ? `${company?.name ?? "The company"} wants to talk. You're shortlisted.`
        : `${company?.name ?? "The company"} is moving forward with other candidates.`,
    ],
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
 * Move to the new company at the post's level. A higher post is a step up.
 * Promotion progress never carries over: every company counts your work from zero.
 */
export function joinCompany(state: CareerState, post: JobPost): CareerState {
  const company = offeredCompany(post);
  if (!company) return state;
    const wasJobless = state.company === null;
  const stepUp = levelGap(state.level, post.level) > 0;
  let money = state.stats.money;
  let health = state.stats.health;
  let book = bookOf(state);
      const taskScale = taskScaleFor(playerCv(state), post.level);
  const notes = [
    `You join ${company.name} as ${LEVEL_TITLE[post.level]}.${stepUp ? " A step up." : ""}`,
    taskScale < 1
      ? `Promotion progress starts fresh, but your CV counts: ${Math.round((1 - taskScale) * 100)}% fewer tasks to your next promotion.`
      : "Promotion progress starts fresh here.",
  ];
  if (post.benefits.includes("bonus")) {
    money += post.bonusCash;
    notes.push(`Signing bonus: +${formatMoney(post.bonusCash)}.`);
  }
  if (post.benefits.includes("stock")) {
    const listed = stockForCompany(company.id);
    if (listed) {
      book = addShares(
        book,
        listed.id,
        post.stockUnits,
        state.prices[listed.id],
      );
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
    joinedDay: state.day,
        level: post.level,
        levelDay: state.day,
    progress: emptyProgress(),
    taskScale,
    reviewDay: null,
    ...book,
    workDone: wasJobless ? state.offWeek !== null : state.workDone,
        counters: bumpCounter(
      bumpCounter(
        bumpCounter(state.counters, "jobs"),
        "negotiated",
        post.negotiated ? 1 : 0,
      ),
      "promotions",
      stepUp ? 1 : 0,
    ),
    stats: clampStats({ ...state.stats, money, health }),
    feed: {
      ...state.feed,
      posts: state.feed.posts.filter(
        (item) => item.companyId !== post.companyId,
      ),
    },
  };
  notes.push(`Payday is now ${formatMoney(paydayFor(joined))}.`);
  return { ...freshBoard(joined, state.board.hour), log: notes };
}

export function boardContext(
  state: CareerState,
  day = state.day,
): BoardContext | null {
  if (!state.company) return null;
  return {
    companyName: state.company.name,
    companyType: state.company.type,
    level: state.level,
    stats: state.stats,
    day,
  };
}

/** A new board for a new job, starting from the hours already used this week. */
export function freshBoard(state: CareerState, hour: number): CareerState {
  const ctx = boardContext(state);
  if (!ctx) return { ...state, board: emptyBoard() };
  const filled = refillBoard(
    { ...emptyBoard(), hour },
    ctx,
    clockAt(state.day, hour),
    state.ticketSeed,
  );
  return { ...state, board: filled.board, ticketSeed: filled.rngState };
}

/** Low health makes every ticket more tiring. Good health makes it a little lighter. */
export function healthScale(health: number): number {
  return Math.min(1.7, Math.max(0.8, 1 + (70 - health) / 100));
}

export function ticketEnergyCost(state: CareerState): number {
  const base = state.company?.energyCost ?? 12;
  return Math.round(base * healthScale(state.stats.health));
}

/**
 * A company's energy cost is for a half-day block. A full week costs about 100
 * at a typical job, more at a startup, and less somewhere calm.
 */
const HOURS_PER_BLOCK = 4;

export function energyForHours(state: CareerState, hours: number): number {
  return Math.round((hours * ticketEnergyCost(state)) / HOURS_PER_BLOCK);
}

export type PartPlan = { hours: number; overtime: number; energy: number };

/** What the next part of a ticket will cost if it finishes on time. Overtime hours count twice. */
export function partPlan(state: CareerState, ticket: BoardTicket): PartPlan {
  const start = state.board.hour;
  const overtime = Math.max(
    0,
    start + ticket.partHours - Math.max(start, WEEK_HOURS),
  );
  return {
    hours: ticket.partHours,
    overtime,
    energy: energyForHours(state, ticket.partHours + overtime),
  };
}

function sumEffects(effects: readonly Partial<Stats>[]): Partial<Stats> {
  const total: Partial<Stats> = {};
  for (const effect of effects) {
    for (const key of Object.keys(effect) as (keyof Stats)[]) {
      total[key] = (total[key] ?? 0) + (effect[key] ?? 0);
    }
  }
  return total;
}

const TIMING_NOTE = {
  early: "well before the deadline",
  onTime: "on time",
  late: "late",
} as const;

/**
 * Play one part of a board ticket. Time and energy are spent either way;
 * only a clean or late finish moves the ticket forward.
 */
export function workTicket(
  state: CareerState,
  key: string,
  grade: CodeGrade,
  bonus: number,
  seed: number,
): CareerState {
  if ((state.section !== "work" && state.section !== "room") || state.workDone)
    return state;
  const ctx = boardContext(state);
  const ticket = state.board.tickets.find((item) => item.key === key);
  if (!ctx || !ticket || !state.company) return state;
  if (state.stats.energy < partPlan(state, ticket).energy) return state;
  const result = workPart(state.board, key, grade, ctx, seed);
  if (!result) return state;

  const energy = energyForHours(state, result.spent + result.overtime);
  const worked = recordWork(
    state,
    grade,
    bonus,
    ticket.game,
        energy,
    result.overtime > 0,
    ticket.difficulty,
  );
  const notes: string[] = [];
  const effects: Partial<Stats>[] = [];
  let counters = worked.counters;

  if (grade === "miss") {
    notes.push(
      `${key}: the clock ran out. ${result.spent}h gone, and the part is still open.`,
    );
  } else if (!result.finished) {
    notes.push(
      `${key}: part ${result.ticket.partsDone} of ${result.ticket.parts} done in ${result.spent}h.`,
    );
  } else if (result.timing) {
    const reward = doneReward(
      ticket.priority,
      result.timing,
      state.company.salary,
    );
    effects.push(reward);
    notes.push(
      `${key} done ${TIMING_NOTE[result.timing]}.` +
        (reward.money ? ` Bonus ${formatMoney(reward.money)}.` : ""),
    );
    counters = bumpCounter(counters, "ticketsDone");
    if (result.timing === "early")
      counters = bumpCounter(counters, "ticketsEarly");
  }
  if (grade !== "miss" && bonus > 0)
    notes.push(`Quick work: +${formatMoney(bonus)}.`);
  for (const late of result.newlyOverdue) {
    effects.push(OVERDUE_HIT[late.priority]);
    notes.push(`${late.key} is overdue. The team noticed.`);
  }
  if (result.newlyOverdue.length > 0)
    counters = bumpCounter(counters, "overdue", result.newlyOverdue.length);
  for (const fresh of result.arrived) {
    notes.push(
      fresh.urgent
        ? `Urgent: ${fresh.key} ${fresh.title}.`
        : `New: ${fresh.key} ${fresh.title}.`,
    );
  }
  if (result.overtime > 0) notes.push(`${result.overtime}h of overtime.`);

        return {
    ...worked,
    stats: addStats(worked.stats, sumEffects(effects)),
    board: result.board,
    ticketSeed: result.rngState,
    counters,
    log: notes,
  };
}

/** Drop tickets the level can no longer do and top the board back up. */
function refitBoard(state: CareerState): CareerState {
  const ctx = boardContext(state);
  if (!ctx) return state;
  const games = LEVEL_GAMES[state.level];
  const kept = {
    ...state.board,
    tickets: state.board.tickets.filter((ticket) =>
      games.includes(ticket.game),
    ),
  };
  const filled = refillBoard(
    kept,
    ctx,
    clockAt(state.day, kept.hour),
    state.ticketSeed,
  );
  return { ...state, board: filled.board, ticketSeed: filled.rngState };
}

/** Overtime wears the body down on top of the usual strain. */
const OVERTIME_HEALTH = 2;

/**
 * What one mini-game is worth on average. Skill is scaled by the company's learning,
 * and halved on the manager track. Reputation doubles at an enterprise; relationship
 * doubles on the manager track. Fractions land by chance, so they add up over weeks.
 */
const WORK_GAINS = {
    clear: { skill: 2, reputation: 0.1, relationship: 0.2 },
  late: { skill: 1, reputation: 0, relationship: 0 },
  miss: { skill: 0, reputation: 0, relationship: 0 },
} as const;

/** Pushing on while nearly empty wears the body down faster. */
const STRAIN = 1;
const OVERTIME_STRAIN = 2;
const OVERTIME_BELOW = 25;

export function recordWork(
  state: CareerState,
  grade: CodeGrade,
  bonus = 0,
  game?: WorkGame,
    energyCost = ticketEnergyCost(state),
  overtime = false,
  difficulty: Difficulty = "normal",
): CareerState {
  if (
    (state.section !== "work" && state.section !== "room") ||
    !state.company ||
    state.workDone
  )
    return state;
    const learn = state.company.learning;
  const leading = trackOf(state.level) === "manager";
  const clean = grade === "clear";
    const expected = WORK_GAINS[grade === "miss" ? "miss" : grade];
  const reward = DIFFICULTY_REWARD[difficulty];
  const skillRoll = roundByChance(
    expected.skill * learn * (leading ? 0.5 : 1) * reward,
    state.rngState,
  );
  const repRoll = roundByChance(
    clean ? expected.reputation * (state.company.type === "enterprise" ? 2 : 1) * reward : 0,
    skillRoll.rngState,
  );
  const relRoll = roundByChance(
    clean ? expected.relationship * (leading ? 2 : 1) * reward : 0,
    repRoll.rngState,
  );
  const skill = skillRoll.value;
  const reputation = repRoll.value;
  const relationship = relRoll.value;
  const mood = grade === "miss" ? -2 : 0;
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
  const energy = state.stats.energy - energyCost;
  const strain =
    STRAIN +
    (energy < OVERTIME_BELOW ? OVERTIME_STRAIN : 0) +
    (overtime ? OVERTIME_HEALTH : 0);
    return {
    ...state,
    progress,
    rngState: relRoll.rngState,
    counters:
      grade === "clear"
        ? bumpCounter(state.counters, "yearClean")
        : state.counters,
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
  /** Below 1 when a strong CV cut this company's promotion tasks. */
  taskScale: number;
};

/** The difficulty this title usually faces. Board tickets roll their own from the title's mix. */
export function difficultyFor(state: CareerState): Difficulty {
  return typicalDifficulty(state.level);
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
    taskScale: state.taskScale,
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
    taskScale: state.taskScale,
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
  const moved: CareerState = refitBoard({
    ...state,
        level: twin,
    levelDay: state.day,
    progress,
    taskScale: 1,
    reviewDay: null,
  });
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
    taskScale: 1,
    reviewDay: state.day,
    counters: bumpCounter(state.counters, "promotions"),
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
    log: ["The review did not pass this time. You can try again next week."],
  };
}

/** Close the laptop for the week. Unused hours become free time; overtime eats it. */
export function finishWork(state: CareerState): CareerState {
  if (state.section !== "work" && state.section !== "room") return state;
  const change =
    state.company && !state.workDone ? slotChange(state.board.hour) : 0;
  const notes = ["Work is done for this week."];
  if (change > 0)
    notes.push(
      `You wrapped up early: +${change} free-time slot${change > 1 ? "s" : ""}.`,
    );
  if (change < 0)
    notes.push(
      `Overtime ate ${-change} free-time slot${change < -1 ? "s" : ""}.`,
    );
        return {
    ...state,
    section: "room",
    workDone: true,
        ...withSlotChange(state, change),
    log: notes,
  };
}

/** Unused work hours add weeknights. Overtime takes weeknights first, then the weekend. */
function withSlotChange(
  state: CareerState,
  change: number,
): Pick<CareerState, "nightSlots" | "weekendSlots"> {
  if (change >= 0) return { nightSlots: state.nightSlots + change, weekendSlots: state.weekendSlots };
  const fromNights = Math.min(state.nightSlots, -change);
  return {
    nightSlots: state.nightSlots - fromNights,
    weekendSlots: Math.max(0, state.weekendSlots + change + fromNights),
  };
}

export function slotsLeft(state: CareerState, kind: SlotKind): number {
  return kind === "night" ? state.nightSlots : state.weekendSlots;
}

type Spend = { cost: number; energy: number; slots: number; kind: SlotKind };

function canSpend(state: CareerState, spend: Spend): boolean {
  return (
    state.section === "room" &&
    slotsLeft(state, spend.kind) >= spend.slots &&
    state.stats.money >= spend.cost &&
    state.stats.energy >= spend.energy
  );
}

function spend(state: CareerState, cost: Spend, effects: Partial<Stats>): CareerState {
  return {
    ...state,
    stats: addStats(state.stats, { ...effects, money: -cost.cost + (effects.money ?? 0), energy: -cost.energy + (effects.energy ?? 0) }),
    nightSlots: cost.kind === "night" ? state.nightSlots - cost.slots : state.nightSlots,
    weekendSlots: cost.kind === "weekend" ? state.weekendSlots - cost.slots : state.weekendSlots,
  };
}

/** A one-off evening or weekend plan. */
export function doActivity(state: CareerState, id: string): CareerState {
  const activity = activityById(id);
  if (!activity) return state;
  const cost = { ...activity, kind: activity.when };
  if (!canSpend(state, cost)) return state;
  return {
    ...spend(state, cost, activity.effects),
    counters: bumpCounter(state.counters, activity.id),
    log: [`${activity.name}. ${activity.blurb}`],
  };
}

/** One lesson of a course, on a weeknight. The last lesson brings the certificate. */
export function takeLesson(state: CareerState, id: CourseId): CareerState {
  const course = courseById(id);
  if (!course) return state;
  const done = state.pursuits.courses[id];
  if (done >= course.lessons) return state;
  const cost = { cost: course.cost, energy: course.energy, slots: 1, kind: "night" as const };
  if (!canSpend(state, cost)) return state;
  const finished = done + 1 >= course.lessons;
  const effects = finished ? addEffects(course.lesson, course.finish) : course.lesson;
  return {
    ...spend(state, cost, effects),
    pursuits: {
      ...state.pursuits,
      courses: { ...state.pursuits.courses, [id]: done + 1 },
      certificates: finished ? [...state.pursuits.certificates, id] : state.pursuits.certificates,
    },
    counters: bumpCounter(state.counters, finished ? "certificates" : "lessons"),
    log: [
      finished
        ? `Certificate earned: ${course.name}. That's worth something.`
        : `${course.name}: lesson ${done + 1} of ${course.lessons}.`,
    ],
  };
}

/** A hobby session on a weeknight or at the weekend. Playing every week keeps a streak. */
export function practiceHobby(state: CareerState, id: HobbyId, kind: SlotKind): CareerState {
  const hobby = hobbyById(id);
  if (!hobby) return state;
  const cost = { cost: hobby.cost, energy: hobby.energy, slots: 1, kind };
  if (!canSpend(state, cost)) return state;
  const progress = state.pursuits.hobbies[id];
  const streak = nextStreak(progress, state.day);
  return {
    ...spend(state, cost, hobbyEffects(hobby, streak)),
    pursuits: {
      ...state.pursuits,
      hobbies: {
        ...state.pursuits.hobbies,
        [id]: { sessions: progress.sessions + 1, streak, lastDay: state.day },
      },
    },
    log: [
      streak > 1
        ? `${hobby.name}: ${streak}-week streak. It shows.`
        : `${hobby.name}. ${hobby.blurb}`,
    ],
  };
}

/** Build the side project. Enough sessions launch it, and a live project pays each week. */
export function workOnSide(state: CareerState, kind: SlotKind): CareerState {
  const cost = { cost: SIDE_SESSION.cost, energy: SIDE_SESSION.energy, slots: 1, kind };
  if (!canSpend(state, cost)) return state;
  const sessions = state.pursuits.side.sessions + 1;
  const before = sideStage(sessions - 1).stage;
  const after = sideStage(sessions).stage;
  return {
    ...spend(state, cost, SIDE_SESSION.effects),
    pursuits: { ...state.pursuits, side: { sessions, lastDay: state.day } },
    counters: bumpCounter(state.counters, "side"),
    log: [
      after.name !== before.name
        ? `Your side project is now ${after.name}.${after.income > 0 ? " It earns a little each week while you keep at it." : ""}`
        : "Side project: another evening of commits.",
    ],
  };
}

/** Change this week's sleep habit. Going to early nights needs an unused weeknight to give up. */
export function setSleep(state: CareerState, mode: SleepMode): CareerState {
  if (state.section !== "room" || mode === state.sleep) return state;
  const nightSlots = state.nightSlots + SLEEP[mode].nights - SLEEP[state.sleep].nights;
  if (nightSlots < 0) return state;
  return { ...state, sleep: mode, nightSlots };
}

function addEffects(a: Partial<Stats>, b: Partial<Stats>): Partial<Stats> {
  const total: Partial<Stats> = { ...a };
  for (const key of Object.keys(b) as (keyof Stats)[]) {
    total[key] = (total[key] ?? 0) + (b[key] ?? 0);
  }
  return total;
}

export function resolveEvent(
  state: CareerState,
  choiceId: string,
): CareerState {
  if (!state.event) return state;
  const outcome = applyEvent(state, choiceId, state.rngState);
  if (outcome.state === state) return state;
  return {
    ...outcome.state,
    rngState: nextUnit(state.rngState).rngState,
        nightSlots: outcome.laidOff ? JOBLESS_NIGHTS : outcome.state.nightSlots,
    log: [outcome.note],
  };
}

export function buyHome(state: CareerState): CareerState {
  if (state.section !== "room" || state.ownsHome) return state;
  if (state.stats.money < HOME_PRICE) return state;
  return {
    ...state,
    ownsHome: true,
    stats: addStats(state.stats, { money: -HOME_PRICE, mood: 15 }),
    log: ["You got the keys. It's yours."],
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

/** Shop price for this week, with the Black Friday discount when it's on. */
export function gearPrice(state: CareerState, cost: number): number {
  return state.saleWeek === state.day ? Math.round(cost * SALE_PRICE) : cost;
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
    const devicePrice = gearPrice(state, device.cost);
    if (state.stats.money < devicePrice) return state;
    return {
      ...state,
      deviceId: device.id,
      ownedDevices: [...state.ownedDevices, device.id],
      stats: { ...state.stats, money: state.stats.money - devicePrice },
      log: [
        `${device.name} is on the desk. Tasks get ${device.timeBonus} extra seconds.`,
      ],
    };
  }
  const look = lookById(id);
  if (state.ownedLooks.includes(look.id)) {
    return { ...state, lookId: look.id };
  }
  const lookPrice = gearPrice(state, look.cost);
  if (state.stats.money < lookPrice) return state;
  return {
    ...state,
    lookId: look.id,
    ownedLooks: [...state.ownedLooks, look.id],
    stats: { ...state.stats, money: state.stats.money - lookPrice },
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
    ...addShares(bookOf(state), id, units, price),
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
    ...removeShares(bookOf(state), id, units),
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
  if (state.section !== "personal" && state.section !== "room") return state;
        const rolled = rollPrices(state.prices, state.rngState, state.news);
  const paper = rollNews(rolled.rngState);
  const nextDay = state.day + 1;
  const refreshed = refreshFeed(state.feed, {
    day: nextDay,
    companyId: state.company?.id ?? null,
    level: state.level,
    reputation: state.stats.reputation,
        relationship: state.stats.relationship,
    skill: skillRating(state.stats.skill),
    seed: paper.rngState,
  });
  let money = state.stats.money;
  let book = bookOf(state);
  const headlines = paper.news.map((item) => item.headline);
    const notes = [
            ...rolled.notes,
    headlines.length > 0
      ? `Next week's paper: ${headlines.join(" ")}`
      : "Next week's paper: a quiet week in business news.",
  ];
  const fresh = refreshed.feed.posts.filter(
    (post) => !state.feed.posts.some((old) => old.id === post.id),
  ).length;
  if (fresh > 0)
    notes.push(
      `Workline: ${fresh} new job post${fresh > 1 ? "s" : ""} for you.`,
    );
  if (state.company && isPayWeek(state.day)) {
    const pay = payPackage(state.company, state.level);
    money += pay.cash;
    let line = `Payday as ${LEVEL_TITLE[state.level]}. +${formatMoney(pay.cash)} cash`;
    if (pay.ticker && pay.stock > 0) {
                  const price = state.prices[pay.ticker];
      const shares = Math.floor(pay.stock / price);
      money += pay.stock - shares * price;
      book = addShares(book, pay.ticker, shares, price);
      line += shares > 0 ? ` and ${shares} ${pay.ticker} shares.` : ".";
    } else {
      line += ".";
    }
    notes.unshift(line);
  }
  if (isPayWeek(state.day)) {
    money = Math.max(0, money - RENT);
    notes.unshift(`Rent for the month: -${formatMoney(RENT)}.`);
  }

  let counters = state.counters;
  let yearOpen = state.yearOpen;
  let growth = 0;
  let rngAfterYear = refreshed.rngState;
  if (isYearEnd(state.day)) {
    const listed = stockForCompany(state.company?.id);
    if (listed) {
      growth =
                        rolled.prices[listed.id] /
          (state.yearOpen[listed.id] || rolled.prices[listed.id]) -
        1;
    } else if (state.company) {
      const roll = nextUnit(rngAfterYear);
      rngAfterYear = roll.rngState;
      growth = -0.2 + roll.value * 0.6;
    }
            yearOpen = rolled.prices;
    const clean = counters.yearClean ?? 0;
    if (state.company) {
      const factor =
        Math.min(1.5, clean / 400) * (0.5 + state.stats.reputation / 100);
      const bonus = Math.round(
        payPackage(state.company, state.level).cash * factor,
      );
      money += bonus;
      notes.unshift(
        bonus > 0
          ? `Year-end review: ${clean} clean tickets this year. Bonus +${formatMoney(bonus)}.`
          : "Year-end review: not much to show this year. No bonus.",
      );
    }
    counters = { ...counters, yearClean: 0 };
  }

  let board = state.company ? state.board : emptyBoard();
  const boardHits: Partial<Stats>[] = [];
  if (state.company) {
    const closed = closeWeek(board, state.day);
    board = closed.board;
    for (const ticket of closed.newlyOverdue)
      boardHits.push(OVERDUE_HIT[ticket.priority]);
    boardHits.push(
      ...closed.stillOverdue.slice(0, 3).map(() => STILL_OVERDUE_HIT),
    );
    boardHits.push(...closed.reassigned.map(() => REASSIGNED_HIT));
    if (closed.newlyOverdue.length > 0) {
      counters = bumpCounter(counters, "overdue", closed.newlyOverdue.length);
      notes.push(
        `Missed deadlines: ${closed.newlyOverdue.map((ticket) => ticket.key).join(", ")}. Your reputation took a hit.`,
      );
    }
    if (closed.stillOverdue.length > 0)
      notes.push(
        `${closed.stillOverdue.length} ticket${closed.stillOverdue.length > 1 ? "s are" : " is"} still overdue from before.`,
      );
    if (closed.reassigned.length > 0)
      notes.push(
        `${closed.reassigned.map((ticket) => ticket.key).join(", ")} went to someone else. It was late too long.`,
      );
  }
  const boardHit = sumEffects(boardHits);

    const sleep = SLEEP[state.sleep];
  let mood = state.stats.mood - WEEKLY_MOOD_DRAIN + (boardHit.mood ?? 0) + sleep.mood;
  let health =
    state.stats.health + WEEKLY_HEALTH_HEAL - agingLoss(nextDay) + sleep.health;
  if (state.sleep === "late") notes.push("Late nights caught up with you. You start Monday tired.");
  if (state.sleep === "early") notes.push("Early nights all week. You feel it.");
    const side = sideIncome(state.pursuits.side, state.day, (state.rngState ^ 0x51de5eed) >>> 0);
  money += side.income;
  if (side.note) notes.push(side.note);
  if (state.company)
    notes.push("A long week of work wore your mood down a little.");
  if (agingLoss(nextDay) > 0)
    notes.push("You're not 22 anymore. Your body needs more care.");
  const sick = nextUnit(rngAfterYear);
  let offWeek: OffWeek | null = null;
  if (mood < BURNOUT_BELOW && mood > 0) {
    offWeek = "burnout";
    notes.unshift("You're running on empty. Next week you can't work. Rest.");
  } else if (health < SICK_BELOW && health > 0 && sick.value < SICK_CHANCE) {
    offWeek = "sick";
    money = Math.max(0, money - SICK_BILL);
    health += 4;
    mood -= 2;
    notes.unshift(
      `You're sick next week. Doctor's bill: -${formatMoney(SICK_BILL)}.`,
    );
  }

  const reputation = state.stats.reputation + (boardHit.reputation ?? 0);
  const relationship = state.stats.relationship + (boardHit.relationship ?? 0);
  let boardSeed = state.ticketSeed;
  const nextContext = boardContext(
    { ...state, stats: { ...state.stats, reputation, relationship } },
    nextDay,
  );
  if (nextContext) {
    const opened = openWeek(board, nextContext, boardSeed, offWeek !== null);
    board = opened.board;
    boardSeed = opened.rngState;
    if (opened.helped)
      notes.push(
        `A teammate picked up ${opened.helped.key} for you. Good team.`,
      );
    if (offWeek)
      notes.push("Your team covers for you. Every deadline moves a week.");
  }

  const settled: CareerState = {
    ...state,
    day: nextDay,
    board,
        ticketSeed: boardSeed,
    experience: state.experience + (state.company && !state.offWeek ? 1 : 0),
    rngState: sick.rngState,
    feed: refreshed.feed,
            prices: rolled.prices,
    history: pushHistory(state.history, rolled.prices),
    heldAtRoll: book.holdings,
    news: paper.news,
    ...book,
    workDone: false,
    offWeek,
    counters,
    yearOpen,
    saleWeek: null,
    stats: clampStats({
      ...state.stats,
            money,
      energy: sleep.energy,
      health,
      mood,
      reputation,
      relationship,
    }),
  };
  const worth = netWorth(settled);
  const earned = checkAchievements(settled, worth);
  for (const title of earned.unlocked) notes.push(`Achievement: ${title}.`);
  const withAchievements = { ...settled, achievements: earned.achievements };

  const ending = endingFor(withAchievements, worth);
  if (ending) {
    return {
      ...withAchievements,
      section: "ending",
      ending,
      event: null,
      log: notes,
    };
  }
  const holiday = seasonalEvent(withAchievements, growth);
  const upcoming = holiday
    ? { event: holiday, rngState: withAchievements.rngState }
    : rollEvent(withAchievements, withAchievements.rngState);
  return {
    ...withAchievements,
    section: "summary",
    event: upcoming.event,
    rngState: upcoming.rngState,
    log: notes,
  };
}

export function nextMorning(state: CareerState): CareerState {
  if (state.section !== "summary") return state;
  const blocked = state.company === null || state.offWeek !== null;
  return {
    ...state,
    section: "room",
    workDone: blocked,
        nightSlots: Math.max(
      0,
      (state.company ? NIGHT_SLOTS : JOBLESS_NIGHTS) +
        (state.offWeek ? 1 : 0) +
        SLEEP[state.sleep].nights,
    ),
    weekendSlots: WEEKEND_SLOTS,
    log: [],
  };
}

export function netWorth(state: CareerState): number {
  const invested = (Object.keys(state.holdings) as MarketId[]).reduce(
    (sum, id) => sum + state.holdings[id] * state.prices[id],
    0,
  );
  return Math.round(state.stats.money + invested);
}
