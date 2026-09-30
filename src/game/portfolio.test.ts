import { describe, expect, it } from "vitest";
import {
  acceptOffer,
  buyAsset,
  chooseGoal,
  createCareer,
  endDay,
  finishPlacement,
  finishWork,
  nextMorning,
  sellAsset,
  type CareerState,
} from "./career";
import { portfolioOf, positionOf } from "./portfolio";
import { STOCK_IDS } from "./market";

function hired(): CareerState {
  const state = chooseGoal(finishPlacement(createCareer(8), "win", 3), "fire");
  const offer = state.offers[0];
  if (!offer) throw new Error("missing offer");
  const joined = finishWork(acceptOffer(state, offer.id));
  return { ...joined, stats: { ...joined.stats, money: 10_000 } };
}

describe("portfolio", () => {
  it("remembers what was paid and shows the gain when the price moves", () => {
    const state = hired();
    const price = Math.round(state.prices.PIXL);
    const bought = buyAsset(state, "PIXL", 10);
    expect(bought.costBasis.PIXL).toBe(price * 10);
    const doubled = {
      ...bought,
      prices: { ...bought.prices, PIXL: price * 2 },
    };
    const position = positionOf(doubled, "PIXL");
    expect(position.shares).toBe(10);
    expect(position.avgCost).toBe(price);
    expect(position.gain).toBe(price * 10);
    expect(position.gainPercent).toBe(1);
  });

  it("keeps the average cost after selling part and clears it after selling all", () => {
    const bought = buyAsset(hired(), "BREW", 8);
    const avg = positionOf(bought, "BREW").avgCost;
    const half = sellAsset(bought, "BREW", 4);
    expect(positionOf(half, "BREW").avgCost).toBeCloseTo(avg);
    const none = sellAsset(half, "BREW", 4);
    expect(none.costBasis.BREW).toBe(0);
  });

  it("still buys and sells on a state from before cost tracking", () => {
    const legacy = {
      ...hired(),
      costBasis: undefined,
    } as unknown as CareerState;
    const bought = buyAsset(legacy, "BREW", 3);
    expect(bought.holdings.BREW).toBe(legacy.holdings.BREW + 3);
    expect(bought.costBasis.BREW).toBeGreaterThan(0);
    expect(sellAsset(legacy, "BREW", 1)).toBe(legacy);
  });

  it("values a fresh buy at what was paid, so it shows no gain", () => {
    const bought = buyAsset(hired(), "BREW", 1);
    const position = positionOf(bought, "BREW");
    expect(position.gain).toBe(0);
    expect(position.gainPercent).toBe(0);
  });

  it("counts the weekly move only for shares held when prices moved", () => {
    const state = hired();
    const bought = buyAsset(state, "ATLS", 5);
    expect(positionOf(bought, "ATLS").weekChange).toBe(0);

    const week = nextMorning(endDay(bought));
    const moved =
      5 *
      (Math.max(1, Math.round(week.prices.ATLS)) -
        Math.max(1, Math.round(bought.prices.ATLS)));
    expect(moved).not.toBe(0);
    expect(positionOf(week, "ATLS").weekChange).toBe(moved);

    const more = buyAsset(week, "ATLS", 5);
    expect(positionOf(more, "ATLS").weekChange).toBe(moved);
    const sold = sellAsset(more, "ATLS", 8);
    expect(positionOf(sold, "ATLS").weekChange).toBeCloseTo(moved * (2 / 5));
  });

  it("lists only held stocks, biggest first", () => {
    let state = buyAsset(hired(), "BREW", 1);
    state = buyAsset(state, "VOLT", 20);
    const book = portfolioOf(state, STOCK_IDS);
    expect(book.positions.map((p) => p.id)).toEqual(["VOLT", "BREW"]);
    expect(book.value).toBe(
      state.holdings.VOLT * Math.round(state.prices.VOLT) +
        Math.round(state.prices.BREW),
    );
  });
});
