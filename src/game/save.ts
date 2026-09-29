import type { DeviceId, LookId } from "../content/gear";
import { COMPANIES } from "../content/companies";
import type { CareerState, Section } from "./career";
import { ALL_LEVELS, emptyProgress } from "./ladder";
import { emptyFeed, refreshFeed } from "./workline";
import {
  MARKET_IDS,
  START_PRICES,
  STOCK_IDS,
  backfillHistory,
  emptyHoldings,
  type Holdings,
  type PriceHistory,
  type Prices,
  type StockNews,
} from "./market";
import { STAT_KEYS } from "./types";

const SAVE_KEY = "dev-simulator-career-v1";
const SECTIONS: readonly Section[] = [
  "placement",
  "offers",
  "room",
  "work",
  "personal",
  "summary",
];
/** Present in every save since investing started. */
const CORE_MARKETS = ["crypto", "gold"] as const;
/** The single stock market from older saves becomes shares of this company. */
const LEGACY_STOCK = "ATLS";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCareer(value: unknown): value is CareerState {
  if (!isRecord(value)) return false;
  const stats = value.stats;
  const prices = value.prices;
  const holdings = value.holdings;
  if (!isRecord(stats) || !isRecord(prices) || !isRecord(holdings))
    return false;
  return (
    typeof value.section === "string" &&
    SECTIONS.includes(value.section as Section) &&
    typeof value.day === "number" &&
    typeof value.rngState === "number" &&
    Array.isArray(value.offers) &&
    Array.isArray(value.log) &&
    STAT_KEYS.every((key) => typeof stats[key] === "number") &&
    CORE_MARKETS.every(
      (id) =>
        typeof prices[id] === "number" && typeof holdings[id] === "number",
    )
  );
}

function isNews(value: unknown): value is StockNews {
  return (
    isRecord(value) &&
    typeof value.headline === "string" &&
    (value.tone === "good" || value.tone === "bad") &&
    STOCK_IDS.includes(value.stockId as never)
  );
}

/** Brings prices, holdings, and history up to the current list of markets. */
function withMarkets(state: CareerState): CareerState {
  const oldPrices = state.prices as Record<string, number>;
  const oldHoldings = state.holdings as Record<string, number>;
  const prices = { ...START_PRICES } as Prices;
  const holdings = emptyHoldings() as Holdings;
  for (const id of MARKET_IDS) {
    if (typeof oldPrices[id] === "number") prices[id] = oldPrices[id];
    if (typeof oldHoldings[id] === "number") holdings[id] = oldHoldings[id];
  }
  let money = state.stats.money;
  const legacyUnits = oldHoldings.stock ?? 0;
  if (legacyUnits > 0) {
    const value = legacyUnits * (oldPrices.stock ?? 0);
    const shares = Math.floor(value / prices[LEGACY_STOCK]);
    holdings[LEGACY_STOCK] += shares;
    money += Math.round(value - shares * prices[LEGACY_STOCK]);
  }
  const oldHistory = (state.history ?? {}) as Record<string, number[]>;
  const kept: Partial<PriceHistory> = {};
  for (const id of MARKET_IDS) {
    if (Array.isArray(oldHistory[id])) kept[id] = oldHistory[id];
  }
  return {
    ...state,
    prices,
    holdings,
    stats: { ...state.stats, money },
    history: backfillHistory(kept, state.rngState, undefined, prices),
    news: Array.isArray(state.news) ? state.news.filter(isNews) : [],
  };
}

function withGear(state: CareerState): CareerState {
  const deviceId: DeviceId =
    state.deviceId === "air" ||
    state.deviceId === "monitor" ||
    state.deviceId === "rig"
      ? state.deviceId
      : "laptop";
  const lookId: LookId =
    state.lookId === "bun" ||
    state.lookId === "curls" ||
    state.lookId === "cap" ||
    state.lookId === "navy" ||
    state.lookId === "green"
      ? state.lookId
      : "plain";
  return {
    ...state,
    deviceId,
    lookId,
    ownedDevices: state.ownedDevices?.length ? state.ownedDevices : ["laptop"],
    ownedLooks: state.ownedLooks?.length ? state.ownedLooks : ["plain"],
    workDone: state.workDone === true,
    level: ALL_LEVELS.includes(state.level) ? state.level : "fresher",
    levelDay: typeof state.levelDay === "number" ? state.levelDay : state.day,
    progress: {
      ...emptyProgress(),
      ...(state.progress && typeof state.progress === "object"
        ? state.progress
        : {}),
    },
    reviewDay: typeof state.reviewDay === "number" ? state.reviewDay : null,
    ticketSeed:
      typeof state.ticketSeed === "number"
        ? state.ticketSeed
        : (state.rngState ^ 0x7ac1e75 ^ state.day) >>> 0,
    feed:
      state.feed && Array.isArray(state.feed.posts)
        ? {
            ...emptyFeed(),
            ...state.feed,
            posts: state.feed.posts.map((post) => ({
              ...post,
              stockPercent:
                typeof post.stockPercent === "number"
                  ? post.stockPercent
                  : (COMPANIES.find((item) => item.id === post.companyId)
                      ?.stockPercent ?? 0),
            })),
            blocked: state.feed.blocked ?? {},
            social: state.feed.social ?? [],
          }
        : emptyFeed(),
    company: state.company
      ? {
          ...state.company,
          stockPercent:
            typeof state.company.stockPercent === "number"
              ? state.company.stockPercent
              : (COMPANIES.find((item) => item.id === state.company?.id)
                  ?.stockPercent ?? 0),
        }
      : null,
  };
}

/** A save from before Workline gets its first posts right away. */
function ensureFeed(state: CareerState): CareerState {
  if (!state.company || state.feed.posts.length > 0) return state;
  const refreshed = refreshFeed(state.feed, {
    day: state.day,
    companyId: state.company.id,
    level: state.level,
    reputation: state.stats.reputation,
    seed: (state.rngState ^ state.day) >>> 0,
  });
  return { ...state, feed: refreshed.feed };
}

export function loadGame(): CareerState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isCareer(parsed) ? ensureFeed(withMarkets(withGear(parsed))) : null;
  } catch {
    return null;
  }
}

export function saveGame(state: CareerState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function clearGame(): void {
  localStorage.removeItem(SAVE_KEY);
}
