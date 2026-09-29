import { describe, expect, it } from "vitest";
import {
  acceptOffer,
  consumeItem,
  createCareer,
  endDay,
  finishPlacement,
  healthScale,
  recordWork,
  ticketEnergyCost,
  type CareerState,
} from "./career";
import { picksOwnWork } from "./ladder";

function hired(): CareerState {
  const state = finishPlacement(createCareer(4), "win", 4);
  const offer = state.offers[0];
  if (!offer) throw new Error("missing offer");
  return acceptOffer(state, offer.id);
}

describe("health and energy", () => {
  it("makes tasks heavier as health drops", () => {
    expect(healthScale(100)).toBeLessThan(healthScale(70));
    expect(healthScale(70)).toBe(1);
    expect(healthScale(20)).toBeGreaterThan(healthScale(50));
    const state = hired();
    const tired = { ...state, stats: { ...state.stats, health: 20 } };
    expect(ticketEnergyCost(tired)).toBeGreaterThan(ticketEnergyCost(state));
  });

  it("wears health down with work, more when running on empty, and heals a little overnight", () => {
    const state = hired();
    const worked = recordWork(state, "clear", 0, "tidy");
    expect(worked.stats.health).toBe(state.stats.health - 1);
    const empty = { ...state, stats: { ...state.stats, energy: 20 } };
    expect(recordWork(empty, "clear", 0, "tidy").stats.health).toBe(
      state.stats.health - 3,
    );
    expect(endDay(worked).stats.health).toBe(worked.stats.health + 3);
  });

  it("sells pantry items that change energy and health right away", () => {
    const state = hired();
    const low = {
      ...state,
      stats: { ...state.stats, energy: 30, health: 60, money: 200 },
    };
    const drink = consumeItem(low, "drink");
    expect(drink.stats.energy).toBe(65);
    expect(drink.stats.health).toBe(56);
    expect(drink.stats.money).toBe(182);
    expect(
      consumeItem({ ...low, stats: { ...low.stats, money: 5 } }, "drink").stats
        .energy,
    ).toBe(30);
  });
});

describe("choosing work", () => {
  it("lets engineers and above pick their tasks", () => {
    expect(picksOwnWork("fresher")).toBe(false);
    expect(picksOwnWork("junior")).toBe(false);
    expect(picksOwnWork("mid")).toBe(true);
    expect(picksOwnWork("staff")).toBe(true);
  });
});
