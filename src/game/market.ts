import { t } from "../i18n";
import { nextUnit } from "./rng";

/** Listed companies. Many also hire on Workline; the rest are invest-only names on the market. */
export type StockId =
  | "SPRK"
  | "NWND"
  | "HRBR"
  | "LUMN"
  | "KEEL"
  | "ATLS"
  | "BREW"
  | "VOLT"
  | "PIXL"
  | "LEAF"
  | "FORG"
  | "DRFT"
  | "QURY"
  | "TIDE"
  | "NOOK"
  | "SMMT"
  | "SOLR"
  | "FARM"
  | "MESH"
  | "BOOK";

export type MarketId = StockId | "crypto" | "gold";

export type Prices = Record<MarketId, number>;
export type Holdings = Record<MarketId, number>;
export type PriceHistory = Record<MarketId, number[]>;

export type Risk = "Low" | "Medium" | "High";

export type Stock = {
  id: StockId;
  name: string;
  sector: string;
  /** The Workline company behind this stock, if it hires. */
  companyId?: string;
  start: number;
  risk: Risk;
  /** Nightly range on a day without news. */
  quiet: [number, number];
  /** Size of a move when the news turns out right or wrong. */
  move: [number, number];
};

const STEADY = {
  quiet: [0.988, 1.018] as [number, number],
  move: [0.01, 0.04] as [number, number],
};
const NORMAL = {
  quiet: [0.975, 1.03] as [number, number],
  move: [0.015, 0.07] as [number, number],
};
const JUMPY = {
  quiet: [0.955, 1.05] as [number, number],
  move: [0.03, 0.11] as [number, number],
};

export const STOCKS: readonly Stock[] = [
  {
    id: "SPRK",
    name: "Spark",
    sector: "Startup software",
    companyId: "spark",
    start: 24,
    risk: "High",
    ...JUMPY,
  },
  {
    id: "NWND",
    name: "Northwind",
    sector: "Product apps",
    companyId: "northwind",
    start: 62,
    risk: "Medium",
    ...NORMAL,
  },
  {
    id: "HRBR",
    name: "Harbor",
    sector: "Remote tools",
    companyId: "harbor",
    start: 48,
    risk: "Medium",
    ...NORMAL,
  },
  {
    id: "LUMN",
    name: "Lumen",
    sector: "Product apps",
    companyId: "lumen",
    start: 95,
    risk: "Medium",
    ...NORMAL,
  },
  {
    id: "KEEL",
    name: "Keel Systems",
    sector: "Business software",
    companyId: "keel",
    start: 140,
    risk: "Low",
    ...STEADY,
  },
  {
    id: "ATLS",
    name: "Atlas",
    sector: "Big tech",
    companyId: "atlas",
    start: 310,
    risk: "Low",
    ...STEADY,
  },
  {
    id: "BREW",
    name: "Brewly",
    sector: "Coffee shops",
    start: 36,
    risk: "Medium",
    ...NORMAL,
  },
  {
    id: "VOLT",
    name: "Voltcar",
    sector: "Electric cars",
    start: 18,
    risk: "High",
    ...JUMPY,
  },
  {
    id: "PIXL",
    name: "Pixelplay",
    sector: "Video games",
    start: 12,
    risk: "High",
    ...JUMPY,
  },
  {
    id: "LEAF",
    name: "Greenleaf",
    sector: "Groceries",
    start: 54,
    risk: "Low",
    ...STEADY,
  },
  {
    id: "FORG",
    name: "Forge Labs",
    sector: "Hardware",
    companyId: "forge",
    start: 21,
    risk: "High",
    ...JUMPY,
  },
  {
    id: "DRFT",
    name: "Driftware",
    sector: "Mobile apps",
    companyId: "drift",
    start: 44,
    risk: "Medium",
    ...NORMAL,
  },
  {
    id: "QURY",
    name: "Quarry Data",
    sector: "Data platforms",
    companyId: "quarry",
    start: 88,
    risk: "Low",
    ...STEADY,
  },
  {
    id: "TIDE",
    name: "Tideframe",
    sector: "Remote tools",
    companyId: "tide",
    start: 58,
    risk: "Medium",
    ...NORMAL,
  },
  {
    id: "NOOK",
    name: "Nook Remote",
    sector: "Collaboration",
    companyId: "nook",
    start: 39,
    risk: "Medium",
    ...NORMAL,
  },
  {
    id: "SMMT",
    name: "Summit Digital",
    sector: "Consumer apps",
    companyId: "summit",
    start: 275,
    risk: "Low",
    ...STEADY,
  },
  {
    id: "SOLR",
    name: "Sunrail Energy",
    sector: "Solar power",
    start: 27,
    risk: "High",
    ...JUMPY,
  },
  {
    id: "FARM",
    name: "Farmstead Foods",
    sector: "Organic food",
    start: 46,
    risk: "Medium",
    ...NORMAL,
  },
  {
    id: "MESH",
    name: "MeshNet",
    sector: "Telecom",
    start: 72,
    risk: "Low",
    ...STEADY,
  },
  {
    id: "BOOK",
    name: "Bookstack",
    sector: "Publishing",
    start: 33,
    risk: "Medium",
    ...NORMAL,
  },
];

export const STOCK_IDS: readonly StockId[] = STOCKS.map((stock) => stock.id);

export const MARKET_IDS: readonly MarketId[] = [...STOCK_IDS, "crypto", "gold"];

export const HISTORY_DAYS = 30;

export function isStock(id: MarketId): id is StockId {
  return id !== "crypto" && id !== "gold";
}

export function stockById(id: StockId): Stock {
  return STOCKS.find((stock) => stock.id === id) ?? (STOCKS[0] as Stock);
}

export function stockForCompany(
  companyId: string | undefined,
): Stock | undefined {
  return companyId
    ? STOCKS.find((stock) => stock.companyId === companyId)
    : undefined;
}

export function marketLabel(id: MarketId): string {
  if (id === "crypto") return t("Crypto");
  if (id === "gold") return t("Gold");
  return stockById(id).name;
}

export function marketRisk(id: MarketId): Risk {
  if (id === "crypto") return "High";
  if (id === "gold") return "Low";
  return stockById(id).risk;
}

export const MARKET_BLURB = {
  stock:
    "Read the paper. Good news usually lifts a company the next week, bad news usually drops it. Usually, not always.",
  crypto:
    "The biggest swings. Most weeks wobble. Some weeks crash hard, some shoot up. Over time it roughly holds its value, so luck matters more than patience.",
  gold: "Steady. Small moves, slowly upward. It tends to rise when crypto crashes.",
} as const;

export function marketBlurb(id: MarketId): string {
    if (id === "crypto") return t(MARKET_BLURB.crypto);
  if (id === "gold") return t(MARKET_BLURB.gold);
  const risk = stockById(id).risk;
  const feel =
    risk === "High"
      ? "It moves a lot."
      : risk === "Low"
        ? "It barely moves in a quiet week."
        : "It moves a little most days.";
    return `${t(MARKET_BLURB.stock)} ${t(feel)}`;
}

export type NewsTone = "good" | "bad";

export type StockNews = {
  stockId: StockId;
  tone: NewsTone;
  /** The headline in English, as it was printed. */
  headline: string;
  /** The template it came from, so it can be shown in another language. Missing on older saves. */
  template?: string;
};

/** The headline in the player's language. */
export function newsHeadline(news: StockNews): string {
  if (!news.template) return news.headline;
  return t(news.template, { name: stockById(news.stockId).name });
}

/** English templates; {name} is the company. Shown in the player's language when read. */
const HEADLINES: Record<NewsTone, readonly string[]> = {
  good: [
    "{name} signs a big three-year deal.",
    "{name}'s new app update gets great reviews.",
    "{name} sales beat what everyone expected.",
    "A famous investor buys a large stake in {name}.",
    "{name} opens a second office.",
    "{name} wins an award for its product.",
    "{name} lands its biggest customer yet.",
    "{name} raises guidance for the year.",
    "{name} launches in a new country.",
    "{name} partners with a major platform.",
    "{name} reports record quarterly profit.",
    "{name}'s new hire gets glowing press.",
  ],
  bad: [
    "{name} recalls a product.",
    "{name}'s CEO leaves without a clear reason.",
    "{name} sales come in below what was promised.",
    "A big customer leaves {name} for a rival.",
    "{name}'s app is down for most of the day.",
    "{name} is fined for a data mistake.",
    "{name} delays its next product launch.",
    "{name} cuts staff after a weak quarter.",
    "{name} faces a lawsuit from a rival.",
    "{name}'s supply chain hits a snag.",
    "{name} loses a key patent case.",
    "{name} warns profits will be lower this year.",
  ],
};

export const HEADLINE_TEMPLATE_COUNT = {
  good: HEADLINES.good.length,
  bad: HEADLINES.bad.length,
} as const;

/** How often a headline turns out right the next day. */
export const NEWS_ACCURACY = 0.75;

/** Next week's paper: zero to three companies in the news. */
export function rollNews(seed: number): {
  news: StockNews[];
  rngState: number;
} {
  let rngState = seed;
  const next = () => {
    const value = nextUnit(rngState);
    rngState = value.rngState;
    return value.value;
  };
  const countRoll = next();
  const count =
    countRoll < 0.15 ? 0 : countRoll < 0.55 ? 1 : countRoll < 0.9 ? 2 : 3;
  const pool = [...STOCKS];
  const news: StockNews[] = [];
  for (let index = 0; index < count && pool.length > 0; index += 1) {
    const stock = pool.splice(Math.floor(next() * pool.length), 1)[0];
    if (!stock) break;
    const tone: NewsTone = next() < 0.5 ? "good" : "bad";
    const lines = HEADLINES[tone];
    const line = lines[Math.floor(next() * lines.length)] ?? lines[0];
    news.push({
      stockId: stock.id,
      tone,
                        headline: line ? line.replace("{name}", stock.name) : "",
            template: line,
    });
  }
  return { news, rngState };
}

export function newsFor(
  news: readonly StockNews[],
  id: MarketId,
): StockNews | undefined {
  return news.find((item) => item.stockId === id);
}

export const START_PRICES: Prices = {
  ...(Object.fromEntries(
    STOCKS.map((stock) => [stock.id, stock.start]),
  ) as Record<StockId, number>),
  crypto: 40,
  gold: 180,
};

export function emptyHoldings(): Holdings {
  return Object.fromEntries(MARKET_IDS.map((id) => [id, 0])) as Holdings;
}

function between(value: number, low: number, high: number): number {
  return low + value * (high - low);
}

function stockFactor(
  stock: Stock,
  news: StockNews | undefined,
  first: number,
  second: number,
): number {
  if (!news) return between(first, stock.quiet[0], stock.quiet[1]);
  const right = second < NEWS_ACCURACY;
  const rise = news.tone === "good" ? right : !right;
  const size = between(first, stock.move[0], stock.move[1]);
  return rise ? 1 + size : 1 - size;
}

type CryptoDay = "crash" | "spike" | "normal";

/**
 * Crypto is a gamble, not a savings account: on average it roughly holds its value,
 * but a crash or a spike can arrive any week.
 */
function cryptoFactor(
  first: number,
  second: number,
): { factor: number; day: CryptoDay } {
  if (second < 0.1) return { factor: between(first, 0.55, 0.75), day: "crash" };
  if (second < 0.19) return { factor: between(first, 1.3, 1.7), day: "spike" };
  return { factor: between(first, 0.83, 1.15), day: "normal" };
}

function settle(price: number, factor: number): number {
  return Math.min(5000, Math.max(1, Math.round(price * factor * 100) / 100));
}

/**
 * One night of prices. Companies in yesterday's paper follow the headline most of the time.
 * Crypto has rare crashes and spikes. Gold creeps up and gains a little on a crypto crash.
 */
export function rollPrices(
  prices: Prices,
  seed: number,
  news: readonly StockNews[] = [],
): { prices: Prices; rngState: number; notes: string[] } {
  let rngState = seed;
  const next = () => {
    const value = nextUnit(rngState);
    rngState = value.rngState;
    return value.value;
  };
  const moved = { ...prices };
  for (const stock of STOCKS) {
    moved[stock.id] = settle(
      prices[stock.id] ?? stock.start,
      stockFactor(stock, newsFor(news, stock.id), next(), next()),
    );
  }
  const crypto = cryptoFactor(next(), next());
  moved.crypto = settle(prices.crypto, crypto.factor);
  moved.gold = settle(
    prices.gold,
    between(next(), 0.996, 1.006) * (crypto.day === "crash" ? 1.02 : 1),
  );

  const changes = STOCKS.map((stock) => ({
    stock,
    change: moved[stock.id] / (prices[stock.id] ?? stock.start) - 1,
  }));
  const up = changes.filter((item) => item.change > 0).length;
  const biggest = [...changes].sort(
    (a, b) => Math.abs(b.change) - Math.abs(a.change),
  )[0];
    const notes = [
    `${t("Stocks: {up} up, {down} down.", { up, down: STOCKS.length - up })}${
      biggest
                ? ` ${t("Biggest move: {name} {percent}%.", {
            name: biggest.stock.name,
            percent: `${biggest.change > 0 ? "+" : ""}${Math.round(biggest.change * 1000) / 10}`,
          })}`
        : ""
    }`,
        `${t(moved.crypto >= prices.crypto ? "Crypto is up at {price}." : "Crypto is down at {price}.", {
      price: moved.crypto.toFixed(2),
    })} ${t(moved.gold >= prices.gold ? "Gold is up at {price}." : "Gold is down at {price}.", {
      price: moved.gold.toFixed(2),
    })}`,
  ];
  if (crypto.day === "crash")
        notes.push(t("Crypto crashed overnight. Gold picked up a little."));
  if (crypto.day === "spike") notes.push(t("Crypto shot up overnight."));
  return { prices: moved, rngState, notes };
}

export function pushHistory(
  history: PriceHistory,
  prices: Prices,
): PriceHistory {
  const next = {} as PriceHistory;
  for (const id of MARKET_IDS) {
    next[id] = [...(history[id] ?? []), prices[id]].slice(-HISTORY_DAYS);
  }
  return next;
}

function singleDay(prices: Prices): PriceHistory {
  return Object.fromEntries(
    MARKET_IDS.map((id) => [id, [prices[id]]]),
  ) as PriceHistory;
}

/** A past so the first day already has a full chart. Uses its own seed so offers stay the same. */
export function seedHistory(
  seed: number,
  days = HISTORY_DAYS,
): { prices: Prices; history: PriceHistory; news: StockNews[] } {
  let prices = { ...START_PRICES };
  let history = singleDay(prices);
  let rngState = (seed ^ 0x9e3779b9) >>> 0;
  let paper = rollNews(rngState);
  rngState = paper.rngState;
    for (let day = 1; day < days; day += 1) {
    const rolled = rollPrices(prices, rngState, paper.news);
    prices = rolled.prices;
    history = pushHistory(history, prices);
    paper = rollNews(rolled.rngState);
    rngState = paper.rngState;
  }
  return { prices, history, news: paper.news };
}

function roughRange(id: MarketId): [number, number] {
  if (id === "crypto") return [0.82, 1.24];
  if (id === "gold") return [0.996, 1.006];
  const stock = stockById(id);
  return [1 - stock.move[1] / 2, 1 + stock.move[1] / 2];
}

/**
 * Makes up earlier days for a short series by walking backward from its oldest price.
 * The newest prices stay exactly as they are.
 */
export function backfillHistory(
  history: Partial<PriceHistory>,
  seed: number,
  days = HISTORY_DAYS,
  prices: Prices = START_PRICES,
): PriceHistory {
  let rngState = (seed ^ 0x85ebca6b) >>> 0;
  const next = {} as PriceHistory;
  for (const id of MARKET_IDS) {
    const series = history[id] ?? [prices[id] ?? START_PRICES[id]];
    const earlier: number[] = [];
    let price = series[0] ?? START_PRICES[id];
    const [low, high] = roughRange(id);
    for (let day = series.length; day < days; day += 1) {
      const roll = nextUnit(rngState);
      rngState = roll.rngState;
      const factor = low + roll.value * (high - low);
      price = Math.min(
        5000,
        Math.max(1, Math.round((price / factor) * 100) / 100),
      );
      earlier.unshift(price);
    }
    next[id] = [...earlier, ...series].slice(-days);
  }
  return next;
}

export function dayChange(series: readonly number[]): number {
  const last = series[series.length - 1];
  const before = series[series.length - 2];
  if (last == null || before == null || before === 0) return 0;
  return (last - before) / before;
}
