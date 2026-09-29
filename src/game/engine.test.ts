import { describe, expect, it } from "vitest";
import { ACTIVITIES } from "../content/activities";
import {
  MID_SALARY,
  MONTH_LENGTH,
  RENT,
  REVIEW,
  SALARY,
  STARTING_STATS,
  TOTAL_DAYS,
} from "../content/config";
import { DAYS } from "../content/days";
import { formatMoney } from "./format";
import {
  continueFromSummary,
  createNewGame,
  finishCode,
  getDay,
  gradeFill,
  gradeTimed,
  isCodeDay,
  nextUnit,
  pickWeighted,
  projectRetirement,
  requirementReason,
  resolveChoices,
  resolveReview,
  selectEvening,
  selectWork,
} from "./engine";
import type { GameState } from "./types";

const BALANCED = [
  "d1-jun",
  "d2-tickets",
  "d3-truth",
  "d4-ask",
  "d5-lunch",
  "d6-notes",
  "d7-channel",
  "d8-check",
  "d9-thanks",
  "d10-deploy",
  "d11-pair",
  "d12-pause",
  "d13-daylight",
  "d14-easy",
  "d15-honest",
  "d16-prep",
  "d17-mid",
  "d18-slice",
  "d19-note",
  "d20-examples",
];

const COAST = [
  "d1-jun",
  "d2-wait",
  "d3-none",
  "d4-guess",
  "d5-walk",
  "d6-leave",
  "d7-logs",
  "d8-page",
  "d9-argue",
  "d10-normal",
  "d11-quiet",
  "d12-half",
  "d13-later",
  "d14-slow",
  "d15-main",
  "d16-wing",
  "d17-fine",
  "d18-jun",
  "d19-leave",
  "d20-listen",
];

const CRUNCH = [
  "d1-morgan",
  "d2-tickets",
  "d3-truth",
  "d4-ask",
  "d5-ticket",
  "d6-notes",
  "d7-fix",
  "d8-check",
  "d9-thanks",
  "d10-visible",
  "d11-call",
  "d12-late",
  "d13-post",
  "d14-second",
  "d15-demo",
  "d16-prep",
  "d17-fine",
  "d18-sprint",
  "d19-polish",
  "d20-sprint",
];

const MISERY = [
  "d1-alone",
  "d2-wait",
  "d3-spike",
  "d4-guess",
  "d5-ticket",
  "d6-corner",
  "d7-logs",
  "d8-page",
  "d9-argue",
  "d10-visible",
  "d11-quiet",
  "d12-half",
  "d13-later",
  "d14-second",
  "d15-main",
  "d16-script",
  "d17-fine",
  "d18-sprint",
  "d19-polish",
  "d20-sprint",
];

function throughWork(state: GameState, choiceId: string): GameState {
  const ready = state.phase === "code" ? finishCode(state, "late") : state;
  return selectWork(ready, choiceId);
}

function play(choiceIds: string[], activityId: string, seed = 1): GameState {
  let state = createNewGame(100_000, seed);
  for (let index = 0; index < choiceIds.length; index += 1) {
    if (state.phase === "ending") return state;
    if (state.phase === "code") state = finishCode(state, "late");
    if (state.phase === "ending") return state;
    const choiceId = choiceIds[index];
    if (!choiceId) break;
    const blocked = requirementReason(
      state.stats,
      resolveChoices(getDay(state.day), state.flags).find(
        (choice) => choice.id === choiceId,
      )?.requires,
    );
    if (blocked) {
      throw new Error(
        `Day ${state.day} choice ${choiceId} blocked: ${blocked} (energy ${state.stats.energy})`,
      );
    }
    state = selectWork(state, choiceId);
    if (state.phase === "ending") return state;
    const eveningBlocked = requirementReason(
      state.stats,
      ACTIVITIES.find((activity) => activity.id === activityId)?.requires,
    );
    const evening = eveningBlocked ? "rest" : activityId;
    state = selectEvening(state, evening);
    if (state.phase === "ending") return state;
    state = continueFromSummary(state);
  }
  return state;
}

describe("fresher day loop", () => {
  it("charges rent on the first morning and keeps the month baseline", () => {
    const state = createNewGame(250_000);
    expect(state.day).toBe(1);
    expect(state.phase).toBe("work");
    expect(state.stats.money).toBe(STARTING_STATS.money - RENT);
    expect(state.startingMoney).toBe(STARTING_STATS.money);
    expect(state.notes[0]).toContain(String(RENT));
  });

  it("authors 20 days with at least two choices on each branch", () => {
    expect(DAYS).toHaveLength(TOTAL_DAYS);
    for (let day = 1; day <= TOTAL_DAYS; day += 1) {
      expect(resolveChoices(getDay(day), []).length).toBeGreaterThanOrEqual(2);
      expect(
        resolveChoices(getDay(day), ["stayedLate"]).length,
      ).toBeGreaterThanOrEqual(2);
    }
    expect(ACTIVITIES.map((activity) => activity.id)).toEqual([
      "rest",
      "see-someone",
      "study",
      "savings",
      "upgrade-monitor",
      "upgrade-cockpit",
    ]);
  });

  it("ignores choices in the wrong phase and blocks low energy", () => {
    const state = createNewGame(100_000);
    expect(selectEvening(state, "rest")).toBe(state);
    const tired = {
      ...state,
      day: 12,
      stats: { ...state.stats, energy: 10 },
      notes: [],
    };
    expect(selectWork(tired, "d12-late")).toBe(tired);
    expect(requirementReason(tired.stats, { energy: 24 })).toMatch(/energy/);
  });

  it("pays salary when day 10 begins", () => {
    let state = createNewGame(100_000);
    for (let day = 1; day < 10; day += 1) {
      const choice = resolveChoices(getDay(state.day), state.flags)[0];
      state = throughWork(state, choice.id);
      state = selectEvening(state, "rest");
      state = continueFromSummary(state);
    }
    expect(state.day).toBe(10);
    expect(state.notes.some((note) => note.includes(formatMoney(SALARY)))).toBe(
      true,
    );
  });

  it("pays the mid-level salary after promotion", () => {
    let state = createNewGame(100_000);
    for (let day = 1; day < 30; day += 1) {
      if (state.ending) break;
      const choice = resolveChoices(getDay(state.day), state.flags)[0];
      state = throughWork(state, choice.id);
      if (state.phase === "ending") break;
      state = selectEvening(state, "rest");
      if (state.phase === "ending") break;
      state = continueFromSummary(state);
    }
    expect(state.day).toBe(30);
    expect(state.rank).toBe("mid");
    expect(
      state.notes.some((note) => note.includes(formatMoney(MID_SALARY))),
    ).toBe(true);
    expect(MONTH_LENGTH).toBe(20);
  });

  it("reviews a balanced month as on track and promotes", () => {
    const state = play(BALANCED, "rest");
    expect(state.ending).toBeNull();
    expect(state.day).toBe(21);
    expect(state.rank).toBe("mid");
    expect(state.fresherReview).toBe("on_track");
    expect(state.stats.skill).toBeGreaterThanOrEqual(REVIEW.skill);
    expect(state.stats.reputation).toBeGreaterThanOrEqual(REVIEW.reputation);
    expect(state.stats.health).toBeGreaterThan(REVIEW.healthViable);
    expect(projectRetirement(state).years).not.toBeNull();
  });

  it("reviews a coasting month as needs improvement and still promotes", () => {
    const state = play(COAST, "rest");
    expect(state.fresherReview).toBe("needs_improvement");
    expect(state.rank).toBe("mid");
  });

  it("reviews a crunch month as a health warning without burning out", () => {
    const state = play(CRUNCH, "study");
    expect(state.ending).toBeNull();
    expect(state.fresherReview).toBe("health_warning");
    expect(state.day).toBe(21);
    expect(state.stats.health).toBeLessThanOrEqual(REVIEW.healthViable);
    expect(state.stats.health).toBeGreaterThan(0);
  });

  it("can burn out when mood is spent", () => {
    const state = play(MISERY, "study");
    expect(state.ending).toBe("burnout");
  });

  it("projects years from this month’s savings rate", () => {
    const saving = projectRetirement({
      stats: { ...STARTING_STATS, money: 2_800 },
      startingMoney: 800,
      retirementTarget: 100_000,
    });
    expect(saving.years).toBeGreaterThan(0);
    expect(saving.line).toMatch(/years out/);

    const stuck = projectRetirement({
      stats: { ...STARTING_STATS, money: 100 },
      startingMoney: 800,
      retirementTarget: 100_000,
    });
    expect(stuck.years).toBeNull();
  });

  it("resolves the same savings roll from the same seed", () => {
    let state = createNewGame(100_000, 7);
    for (let day = 1; day < 10; day += 1) {
      const choice = resolveChoices(getDay(state.day), state.flags)[0];
      state = throughWork(state, choice.id);
      state = selectEvening(state, "rest");
      state = continueFromSummary(state);
    }
    state = throughWork(state, resolveChoices(getDay(10), state.flags)[0].id);
    const first = selectEvening(state, "savings");
    const second = selectEvening(state, "savings");
    expect(first.stats.money).toBe(second.stats.money);
    expect(first.notes.at(-1)).toBe(second.notes.at(-1));
    expect(first.flags).toContain("tookRisk");
  });

  it("picks weighted risk outcomes inside the table", () => {
    const outcomes = [
      { weight: 30, id: "up" },
      { weight: 40, id: "flat" },
      { weight: 30, id: "down" },
    ];
    expect(pickWeighted(outcomes, 0).id).toBe("up");
    expect(pickWeighted(outcomes, 0.5).id).toBe("flat");
    expect(pickWeighted(outcomes, 0.99).id).toBe("down");
    const roll = nextUnit(1);
    expect(roll.value).toBeGreaterThanOrEqual(0);
    expect(roll.value).toBeLessThan(1);
    expect(nextUnit(1)).toEqual(roll);
  });

  it("prioritizes a health warning over a strong review", () => {
    expect(
      resolveReview({
        ...STARTING_STATS,
        skill: 90,
        reputation: 90,
        health: REVIEW.healthViable,
      }),
    ).toBe("health_warning");
  });

  it("gives startup more editor days than a big company", () => {
    const days = Array.from({ length: TOTAL_DAYS }, (_, index) => index + 1);
    const startup = days.filter((day) => isCodeDay(day, "startup"));
    const remote = days.filter((day) => isCodeDay(day, "remote"));
    const bigco = days.filter((day) => isCodeDay(day, "bigco"));
    expect(startup.length).toBeGreaterThan(remote.length);
    expect(remote.length).toBeGreaterThan(bigco.length);
    expect(isCodeDay(6, "startup")).toBe(true);
    expect(isCodeDay(6, "bigco")).toBe(false);
  });

  it("pays startup coding with more skill and more energy than remote", () => {
    const base = {
      ...createNewGame(100_000, 1, "startup"),
      day: 4,
      phase: "code" as const,
      notes: [],
    };
    const startup = finishCode(base, "clear");
    const remote = finishCode({ ...base, style: "remote" }, "clear");
    expect(startup.stats.skill).toBeGreaterThan(remote.stats.skill);
    expect(startup.stats.energy).toBeLessThan(remote.stats.energy);
    expect(startup.phase).toBe("work");
    expect(startup.codedToday).toBe(true);
  });

  it("skips the meeting when a startup codes through it", () => {
    const state = finishCode(
      {
        ...createNewGame(100_000, 1, "startup"),
        day: 6,
        phase: "code",
        notes: [],
      },
      "clear",
    );
    expect(state.phase).toBe("evening");
  });

  it("buys a monitor only from the starter laptop", () => {
    let state: GameState = {
      ...createNewGame(100_000),
      phase: "evening",
      stats: { ...createNewGame(100_000).stats, money: 2000 },
    };
    state = selectEvening(state, "upgrade-monitor");
    expect(state.rig).toBe("monitor");
    expect(state.stats.money).toBe(1550);
    const again = selectEvening(
      { ...state, phase: "evening" },
      "upgrade-monitor",
    );
    expect(again.rig).toBe("monitor");
  });

  it("grades a fill and a timed clear", () => {
    expect(gradeFill(["v", "p"], ["v", "p"])).toBe(true);
    expect(gradeFill(["v"], ["x"])).toBe(false);
    expect(gradeTimed(true, 1000)).toBe("clear");
    expect(gradeTimed(true, 0)).toBe("late");
    expect(gradeTimed(false, 1000)).toBe("miss");
  });
});
