import {
  MARKET_IDS,
  type Holdings,
  type MarketId,
  type PriceHistory,
  type Prices,
} from "./market";

/** What the player holds, what they paid for it, and how it moved. */
export type Position = {
  id: MarketId;
  shares: number;
  price: number;
  value: number;
  /** Total paid for the shares still held. Grants count at the price on the day they arrived. */
  cost: number;
  avgCost: number;
  gain: number;
  gainPercent: number;
  weekChange: number;
};

export type Portfolio = {
  positions: Position[];
  value: number;
  cost: number;
  gain: number;
  gainPercent: number;
  weekChange: number;
};

type Shares = { holdings: Holdings; costBasis: Holdings };

type Book = {
  holdings: Holdings;
  costBasis?: Holdings;
  heldAtRoll?: Holdings;
  prices: Prices;
  history: PriceHistory;
};

/** Trades settle at whole dollars, so value is counted the same way. */
export function tradePrice(prices: Prices, id: MarketId): number {
  return Math.max(1, Math.round(prices[id]));
}

/**
 * Holdings with their cost. A state from before cost tracking has no basis,
 * so its shares count as bought at today's price.
 */
export function bookOf(
  state: Pick<Book, "holdings" | "costBasis" | "prices">,
): Shares {
  if (state.costBasis)
    return { holdings: state.holdings, costBasis: state.costBasis };
  const costBasis = Object.fromEntries(
    MARKET_IDS.map((id) => [
      id,
      state.holdings[id] * tradePrice(state.prices, id),
    ]),
  ) as Holdings;
  return { holdings: state.holdings, costBasis };
}

/**
 * What the last price move did to this holding. Shares bought since then
 * were bought at today's price, so they haven't moved yet.
 */
function lastMove(book: Book, id: MarketId, price: number): number {
  const series = book.history[id];
  const before = series[series.length - 2];
  if (before == null) return 0;
  const held = Math.min(
    book.heldAtRoll?.[id] ?? book.holdings[id],
    book.holdings[id],
  );
  if (held <= 0) return 0;
  return held * (price - Math.max(1, Math.round(before)));
}

export function positionOf(book: Book, id: MarketId): Position {
  const shares = book.holdings[id];
  const price = tradePrice(book.prices, id);
  const value = shares * price;
  const cost = shares > 0 ? bookOf(book).costBasis[id] : 0;
  const gain = value - cost;
  return {
    id,
    shares,
    price,
    value,
    cost,
    avgCost: shares > 0 ? cost / shares : 0,
    gain,
    gainPercent: cost > 0 ? gain / cost : 0,
    weekChange: lastMove(book, id, price),
  };
}

/** Positions the player actually holds among `ids`, biggest first. */
export function portfolioOf(
  book: Book,
  ids: readonly MarketId[] = MARKET_IDS,
): Portfolio {
  const positions = ids
    .map((id) => positionOf(book, id))
    .filter((position) => position.shares > 0)
    .sort((a, b) => b.value - a.value);
  const value = positions.reduce((sum, p) => sum + p.value, 0);
  const cost = positions.reduce((sum, p) => sum + p.cost, 0);
  return {
    positions,
    value,
    cost,
    gain: value - cost,
    gainPercent: cost > 0 ? (value - cost) / cost : 0,
    weekChange: positions.reduce((sum, p) => sum + p.weekChange, 0),
  };
}

/** Adds shares and what they cost, whether bought or granted. */
export function addShares(
  { holdings, costBasis }: Shares,
  id: MarketId,
  units: number,
  costEach: number,
): Shares {
  if (units <= 0) return { holdings, costBasis };
  return {
    holdings: { ...holdings, [id]: holdings[id] + units },
    costBasis: { ...costBasis, [id]: costBasis[id] + units * costEach },
  };
}

/** Removes shares at their average cost, so the gain on the rest stays honest. */
export function removeShares(
  { holdings, costBasis }: Shares,
  id: MarketId,
  units: number,
): Shares {
  const held = holdings[id];
  const sold = Math.min(units, held);
  if (sold <= 0) return { holdings, costBasis };
  const left = held - sold;
  return {
    holdings: { ...holdings, [id]: left },
    costBasis: {
      ...costBasis,
      [id]: left > 0 ? costBasis[id] * (left / held) : 0,
    },
  };
}
