import { describe, expect, it } from "vitest";
import { COMPANIES, workplaceOf } from "../content/companies";
import { videoFor } from "../content/sceneVideo";
import {
  createCareer,
  endDay,
  joinCompany,
  nextMorning,
  resolveEvent,
  type CareerState,
} from "./career";
import { isPayWeek } from "./life";
import { payPackage } from "./pay";
import { jumpToCompany } from "./sandbox";
import { offeredCompany } from "./workline";
import {
  BOLD_REVIEW_REPUTATION,
  OWED_PAY,
  PAY_LATE,
  REORG_RELATIONSHIP,
  ROUND_RAISE,
  workplaceCandidates,
  type WorkplaceEventId,
} from "./workplaceEvents";

/** loft: seed startup, relay: agency, northwind: young product, lumen: established product, keel: enterprise, harbor: remote. */
function at(companyId: string): CareerState {
  const state = jumpToCompany(createCareer(4), companyId);
  expect(state.company?.id).toBe(companyId);
  return state;
}

function eventIds(state: CareerState): WorkplaceEventId[] {
  return workplaceCandidates(state).map(
    (candidate) => candidate.make().id as WorkplaceEventId,
  );
}

function choose(
  state: CareerState,
  id: WorkplaceEventId,
  choiceId: string,
): CareerState {
  const event = workplaceCandidates(state)
    .map((candidate) => candidate.make())
    .find((made) => made.id === id);
  if (!event) throw new Error(`${id} is not offered here`);
  return resolveEvent({ ...state, event }, choiceId);
}

describe("workplace events", () => {
  it("treats a product company as a startup until it's established, office included", () => {
    for (const company of COMPANIES.filter((each) => each.type === "product")) {
      const young = company.tier === "seed" || company.tier === "growth";
      expect(workplaceOf(company), company.name).toBe(young ? "startup" : "big");
      expect(videoFor(company).src, company.name).toContain(young ? "startup.mp4" : "product.mp4");
    }
    expect(workplaceOf(COMPANIES.find((company) => company.id === "quarry")!)).toBe("big");
  });

  it("only offers each workplace its own events", () => {
    const startup = ["demoDay", "latePay", "devOps", "lateMessage", "roundClosed"];
    const big = ["reorg", "calibration", "compliance", "teamBuilding", "healthCheck"];
    expect(eventIds(at("loft"))).toEqual(startup);
    expect(eventIds(at("relay"))).toEqual(["demoDay", "devOps", "lateMessage"]);
    expect(eventIds(at("northwind"))).toEqual(startup);
    expect(eventIds(at("lumen"))).toEqual(big);
    expect(eventIds(at("keel"))).toEqual(big);
    expect(eventIds(at("harbor"))).toEqual(["lateCall", "cableCut", "lonely", "stipend", "drilling"]);
    expect(workplaceCandidates(createCareer(4))).toEqual([]);
  });

  it("resolves every choice with a note and clears the event", () => {
    for (const id of ["loft", "relay", "northwind", "lumen", "harbor"]) {
      const state = { ...at(id), stats: { ...at(id).stats, money: 1000 } };
      for (const candidate of workplaceCandidates(state)) {
        const event = candidate.make();
        for (const choice of event.choices) {
          const after = resolveEvent({ ...state, event }, choice.id);
          expect(after.event, `${event.id}/${choice.id}`).toBeNull();
          expect(after.log[0], `${event.id}/${choice.id}`).toBeTruthy();
          expect(after.stats.money).toBe(
            state.stats.money -
              choice.cost +
              (event.id === "stipend" && choice.id === "keep" ? 150 : 0),
          );
        }
      }
    }
  });

  it("holds a late payday back a week, then pays it", () => {
    const waiting = choose(at("loft"), "latePay", "wait");
    expect(waiting.counters[PAY_LATE]).toBe(1);
    let state: CareerState = {
      ...waiting,
      day: 4 * Math.ceil(waiting.day / 4),
      workDone: true,
    };
    expect(isPayWeek(state.day)).toBe(true);
    const payday = payPackage(state.company, state.level).total;

    const onTime = endDay({ ...state, counters: {} });
    const late = endDay(state);
    expect(late.stats.money).toBeLessThan(onTime.stats.money);
    expect(late.counters[OWED_PAY]).toBe(payday);
    expect(late.counters[PAY_LATE]).toBeUndefined();

    state = nextMorning({ ...late, event: null });
    const before = state.stats.money;
    const settled = endDay({ ...state, workDone: true });
    expect(settled.counters[OWED_PAY]).toBeUndefined();
    expect(settled.stats.money).toBeGreaterThanOrEqual(before + payday - 50);
  });

  it("loses what's owed if the job is gone before the late pay arrives", () => {
    const owed = {
      ...at("loft"),
      company: null,
      counters: { [OWED_PAY]: 900 },
      workDone: true,
    };
    const after = endDay({ ...owed, day: 5 });
    expect(after.counters[OWED_PAY]).toBeUndefined();
    expect(after.stats.money).toBeLessThanOrEqual(owed.stats.money);
  });

  it("gives a raise when the round closes, which stays with that company only", () => {
    const state = at("loft");
    const raised = choose(state, "roundClosed", "celebrate");
    expect(raised.company?.salary).toBe(
      Math.round((state.company?.salary ?? 0) * (1 + ROUND_RAISE)),
    );
    const elsewhere = COMPANIES.find((company) => company.type === "remote")!;
    const post = { ...raised.feed.posts[0]!, companyId: elsewhere.id };
    const moved = joinCompany(raised, post);
    expect(moved.company?.salary).toBe(offeredCompany(post)?.salary);
  });

  it("takes hours or a weekend day for big company chores", () => {
    const state = at("keel");
    expect(choose(state, "compliance", "now").board.hour).toBe(
      state.board.hour + 4,
    );
    expect(choose(state, "compliance", "weekend").weekendSlots).toBe(
      state.weekendSlots - 1,
    );
    expect(choose(at("harbor"), "cableCut", "slow").board.hour).toBe(
      state.board.hour + 8,
    );
  });

  it("rewards a bold self-review and a reorg plea only when you've earned them", () => {
    const state = at("lumen");
    const known = {
      ...state,
      stats: { ...state.stats, reputation: BOLD_REVIEW_REPUTATION },
    };
    const unknown = {
      ...state,
      stats: { ...state.stats, reputation: BOLD_REVIEW_REPUTATION - 1 },
    };
    expect(
      choose(known, "calibration", "bold").stats.reputation,
    ).toBeGreaterThan(known.stats.reputation);
    expect(
      choose(unknown, "calibration", "bold").stats.reputation,
    ).toBeLessThan(unknown.stats.reputation);
    const close = {
      ...state,
      stats: { ...state.stats, relationship: REORG_RELATIONSHIP },
    };
    const distant = {
      ...state,
      stats: { ...state.stats, relationship: REORG_RELATIONSHIP - 1 },
    };
    expect(
      close.stats.relationship -
        choose(close, "reorg", "stay").stats.relationship,
    ).toBe(2);
    expect(
      distant.stats.relationship -
        choose(distant, "reorg", "stay").stats.relationship,
    ).toBe(10);
  });
});
