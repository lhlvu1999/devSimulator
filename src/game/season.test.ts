import { scaleSkill } from "./skill";
import { describe, expect, it } from "vitest";
import {
  acceptOffer,
  buyGear,
  chooseGoal,
  createCareer,
  endDay,
  finishPlacement,
  gearPrice,
  nextMorning,
  resolveEvent,
  type CareerState,
} from "./career";
import { newYearBonus } from "./events";
import { RENT, nextHoliday, seasonOf } from "./life";

function hired(): CareerState {
  const goal = chooseGoal(finishPlacement(createCareer(4), "win", 4), "fire");
  const offer = goal.offers[0];
  if (!offer) throw new Error("missing offer");
  return acceptOffer(goal, offer.id);
}

describe("monthly pay", () => {
  it("pays salary and takes rent every four weeks, not in between", () => {
    const state = { ...hired(), stats: { ...hired().stats, money: 1000 } };
    const payWeek = endDay({ ...state, day: 4 });
    expect(payWeek.log.some((line) => line.startsWith("Payday"))).toBe(true);
    expect(payWeek.log.some((line) => line.includes(`${RENT}`))).toBe(true);
    const quiet = endDay({ ...state, day: 5 });
    expect(quiet.log.some((line) => line.startsWith("Payday"))).toBe(false);
    expect(quiet.stats.money).toBe(state.stats.money);
  });
});

describe("seasons and holidays", () => {
  it("knows the season and the next holiday", () => {
    expect(seasonOf(1)).toBe("Winter");
    expect(seasonOf(30)).toBe("Summer");
    expect(nextHoliday(2)).toEqual({ name: "Lunar New Year", inWeeks: 4 });
    expect(nextHoliday(52).name).toBe("New Year");
  });

  it("pays a bigger New Year bonus for longer tenure and a growing company", () => {
    expect(newYearBonus(1000, 104, 0)).toBeGreaterThan(
      newYearBonus(1000, 10, 0),
    );
    expect(newYearBonus(1000, 52, 0.4)).toBeGreaterThan(
      newYearBonus(1000, 52, 0),
    );
    expect(newYearBonus(1000, 52, -0.9)).toBe(newYearBonus(1000, 52, -0.5));
  });

  it("opens the new year with a bonus and a resolution", () => {
    const state = { ...hired(), day: 52, joinedDay: 1 };
    const night = endDay(state);
    expect(night.event?.id).toBe("newYear");
    const bonus = night.event?.amount ?? 0;
    expect(bonus).toBeGreaterThan(0);
    const morning = nextMorning(night);
    const after = resolveEvent(morning, "learn");
    expect(after.stats.money).toBe(morning.stats.money + bonus);
        expect(after.stats.skill).toBe(
      morning.stats.skill + scaleSkill({ skill: 30 }, morning.level).skill,
    );
    expect(after.event).toBeNull();
  });

  it("gives lucky money at Lunar New Year after six months at a company", () => {
    const loyal = endDay({ ...hired(), day: 57, joinedDay: 1 });
    expect(loyal.event?.id).toBe("lunarNewYear");
    expect(loyal.event?.amount).toBeGreaterThan(0);
    const fresh = endDay({ ...hired(), day: 57, joinedDay: 50 });
    expect(fresh.event?.amount).toBe(0);
  });

  it("puts the shop on sale for the Black Friday week only", () => {
    const night = endDay({
      ...hired(),
      day: 46,
      stats: { ...hired().stats, money: 5000 },
    });
    expect(night.event?.id).toBe("blackFriday");
    const sale = resolveEvent(nextMorning(night), "ok");
    expect(gearPrice(sale, 1000)).toBe(700);
    const bought = buyGear(sale, "device", "air");
    expect(bought.stats.money).toBe(sale.stats.money - gearPrice(sale, 450));
    const later = endDay(sale);
    expect(gearPrice(later, 1000)).toBe(1000);
  });
});
