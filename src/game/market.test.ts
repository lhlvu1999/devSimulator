import { describe, expect, it } from "vitest";
import {
  NEWS_ACCURACY,
  STOCKS,
  START_PRICES,
  rollNews,
  rollPrices,
  type StockId,
  type StockNews,
} from "./market";

function nights(count: number, news: StockNews[] = []) {
  const moves: Record<string, number[]> = { crypto: [], gold: [] };
  for (const stock of STOCKS) moves[stock.id] = [];
  let seed = 1;
  for (let index = 0; index < count; index += 1) {
    const rolled = rollPrices(START_PRICES, seed, news);
    seed = rolled.rngState;
    for (const id of Object.keys(moves)) {
      const key = id as StockId | "crypto" | "gold";
      moves[id]?.push(rolled.prices[key] / START_PRICES[key] - 1);
    }
  }
  return moves;
}

function spread(values: number[]): number {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length,
  );
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

describe("market rules", () => {
  it("lets a company in the paper follow its headline about three days in four", () => {
    const good: StockNews[] = [
      { stockId: "LUMN", tone: "good", headline: "Good" },
    ];
    const bad: StockNews[] = [
      { stockId: "LUMN", tone: "bad", headline: "Bad" },
    ];
    const up =
      (nights(2000, good).LUMN ?? []).filter((move) => move > 0).length / 2000;
    const down =
      (nights(2000, bad).LUMN ?? []).filter((move) => move < 0).length / 2000;
    expect(up).toBeGreaterThan(NEWS_ACCURACY - 0.05);
    expect(up).toBeLessThan(NEWS_ACCURACY + 0.05);
    expect(down).toBeGreaterThan(NEWS_ACCURACY - 0.05);
  });

  it("makes jumpy stocks swing more than steady ones, and crypto the most", () => {
    const moves = nights(2000);
    expect(spread(moves.PIXL ?? [])).toBeGreaterThan(spread(moves.ATLS ?? []));
    expect(spread(moves.crypto ?? [])).toBeGreaterThan(
      spread(moves.PIXL ?? []) * 2,
    );
    expect(Math.min(...(moves.gold ?? []))).toBeGreaterThan(-0.005);
  });

  it("keeps crypto roughly flat on average so it can't be farmed", () => {
    const moves = nights(8000);
    const cryptoAverage = average(moves.crypto ?? []);
    expect(cryptoAverage).toBeGreaterThan(-0.01);
    expect(cryptoAverage).toBeLessThan(0.01);
    expect(average(moves.gold ?? [])).toBeLessThan(0.003);
    expect(average(moves.gold ?? [])).toBeGreaterThan(0);
  });

  it("puts up to three different companies in each paper", () => {
    let seed = 3;
    for (let index = 0; index < 200; index += 1) {
      const paper = rollNews(seed);
      seed = paper.rngState;
      expect(paper.news.length).toBeLessThanOrEqual(3);
      expect(new Set(paper.news.map((item) => item.stockId)).size).toBe(
        paper.news.length,
      );
    }
  });
});
