import { describe, expect, it } from "vitest";
import {
  acceptOffer,
  chooseGoal,
  createCareer,
  doActivity,
  endDay,
  finishPlacement,
  joinCompany,
  nextMorning,
    resolveEvent,
  setSleep,
  type CareerState,
} from "./career";
import { rollEvent, type LifeEvent } from "./events";
import {
  FIRE_TARGET,
  LAST_DAY,
  WEEKLY_MOOD_DRAIN,
  ageOn,
  moodSeconds,
  weekOfYear,
} from "./life";
import { recruiterPost } from "./workline";

function hired(): CareerState {
  const placed = finishPlacement(createCareer(4), "win", 4);
  expect(placed.section).toBe("goal");
  const goal = chooseGoal(placed, "fire");
  expect(goal.section).toBe("offers");
  const offer = goal.offers[0];
  if (!offer) throw new Error("missing offer");
  return acceptOffer(goal, offer.id);
}

function week(state: CareerState): CareerState {
  const next = endDay(state);
  return next.section === "summary"
    ? nextMorning({ ...next, event: null })
    : next;
}

describe("life clock and goals", () => {
  it("turns each day into a week of life", () => {
    expect(ageOn(1)).toBe(22);
    expect(ageOn(53)).toBe(23);
    expect(weekOfYear(53)).toBe(1);
    expect(ageOn(LAST_DAY)).toBe(59);
  });

  it("ends the run when the goal is met", () => {
    const rich = {
      ...hired(),
      stats: { ...hired().stats, money: FIRE_TARGET },
    };
    const done = endDay(rich);
    expect(done.section).toBe("ending");
    expect(done.ending?.kind).toBe("goal");
    expect(done.ending?.score).toBeGreaterThan(2000);
  });

  it("ends in burnout at zero mood and at 60 when time runs out", () => {
    const empty = { ...hired(), stats: { ...hired().stats, mood: 3 } };
    expect(endDay(empty).ending?.kind).toBe("burnout");
    const old = { ...hired(), day: LAST_DAY - 1 };
    expect(endDay(old).ending?.kind).toBe("age");
  });
});

describe("free time", () => {
  it("spends slots, money, and energy for stat changes", () => {
    const state = { ...hired(), stats: { ...hired().stats, money: 2000 } };
    const gym = doActivity(state, "gym");
    expect(gym.nightSlots).toBe(state.nightSlots - 1);
    expect(gym.stats.health).toBeGreaterThan(state.stats.health);
    expect(gym.stats.money).toBe(state.stats.money - 15);
        const vacation = doActivity(state, "vacation");
    expect(vacation.weekendSlots).toBe(state.weekendSlots - 2);
    expect(vacation.nightSlots).toBe(state.nightSlots);
    expect(doActivity(vacation, "outdoors")).toBe(vacation);
    expect(doActivity(vacation, "rest").nightSlots).toBe(state.nightSlots - 1);
  });

  it("trades an evening for health with early nights, and the reverse with late ones", () => {
    const state = hired();
    const early = setSleep(state, "early");
    expect(early.nightSlots).toBe(state.nightSlots - 1);
    const late = setSleep(state, "late");
    expect(late.nightSlots).toBe(state.nightSlots + 1);
    const tired = week({ ...late, board: { ...late.board, tickets: [] } });
    expect(tired.stats.energy).toBe(80);
    const rested = week({ ...early, board: { ...early.board, tickets: [] } });
    expect(rested.stats.health).toBeGreaterThan(tired.stats.health);
  });
});

describe("weekly stakes", () => {
  it("wears mood down each week and resets free time", () => {
    const hiredState = hired();
    const state = {
      ...hiredState,
      board: { ...hiredState.board, tickets: [] },
    };
    const next = week(state);
    expect(next.stats.mood).toBe(state.stats.mood - WEEKLY_MOOD_DRAIN);
    expect(next.nightSlots).toBe(2);
  });

  it("forces a burnout week when mood runs low", () => {
    const low = { ...hired(), stats: { ...hired().stats, mood: 18 } };
    const next = week(low);
    expect(next.offWeek).toBe("burnout");
    expect(next.workDone).toBe(true);
    expect(next.nightSlots).toBe(3);
    expect(moodSeconds(10)).toBeLessThan(0);
  });

  it("sometimes makes a run-down body take a sick week", () => {
    let sick = false;
    for (let seed = 1; seed < 40 && !sick; seed += 1) {
      const frail = {
        ...hired(),
        rngState: seed,
        stats: { ...hired().stats, health: 12 },
      };
      sick = endDay(frail).offWeek === "sick";
    }
    expect(sick).toBe(true);
  });

  it("pays a year-end bonus for a year of clean work", () => {
    const state = {
      ...hired(),
      day: 52,
      counters: { yearClean: 120 },
      stats: { ...hired().stats, reputation: 50 },
    };
    const next = endDay(state);
    expect(next.log.some((line) => line.startsWith("Year-end review"))).toBe(
      true,
    );
    expect(next.counters.yearClean).toBe(0);
  });
});

describe("events", () => {
  it("starts some weeks with an event once the first month is over", () => {
    let found = false;
    for (let seed = 1; seed < 60 && !found; seed += 1) {
      found = rollEvent({ ...hired(), day: 10 }, seed).event !== null;
    }
    expect(found).toBe(true);
    expect(rollEvent({ ...hired(), day: 2 }, 1).event).toBeNull();
  });

  it("can lay you off, and you can still live and find a new job", () => {
    const layoffs: LifeEvent = {
      id: "layoffs",
      kind: "company",
      title: "Layoffs",
      body: "",
      choices: [{ id: "wait", label: "Wait", detail: "", cost: 0 }],
    };
    let laidOff: CareerState | null = null;
    for (let seed = 1; seed < 80 && !laidOff; seed += 1) {
      const exposed = {
        ...hired(),
        rngState: seed,
        event: layoffs,
        stats: { ...hired().stats, reputation: 0, relationship: 0 },
      };
      const after = resolveEvent(exposed, "wait");
      if (after.company === null) laidOff = after;
    }
    if (!laidOff) throw new Error("never laid off");
    expect(laidOff.event).toBeNull();
    expect(laidOff.workDone).toBe(true);
    const nextWeek = week(laidOff);
    expect(nextWeek.company).toBeNull();
    expect(nextWeek.nightSlots).toBe(3);
    const post = nextWeek.feed.posts[0];
    if (!post) throw new Error("no posts while jobless");
    const rehired = joinCompany(nextWeek, post);
    expect(rehired.company?.id).toBe(post.companyId);
    expect(rehired.workDone).toBe(false);
  });

  it("puts a recruiter's stretch role at the top of Workline", () => {
    const state = { ...hired(), stats: { ...hired().stats, reputation: 40 } };
    const added = recruiterPost(state.feed, {
      day: state.day,
      companyId: state.company?.id ?? null,
      level: state.level,
      reputation: 40,
      seed: 9,
    });
    expect(added.post?.stretch).toBe(true);
    expect(added.feed.posts[0]?.id).toBe(added.post?.id);
  });
});

describe("achievements", () => {
  it("unlocks at the end of the week when the condition is met", () => {
    const state = { ...hired(), stats: { ...hired().stats, money: 3000 } };
    const next = endDay(doActivity(state, "vacation"));
    expect(next.achievements).toContain("vacation");
    expect(next.log.some((line) => line.includes("Out of office"))).toBe(true);
  });
});
