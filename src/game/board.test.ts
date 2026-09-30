import { describe, expect, it } from "vitest";
import {
  WEEK_HOURS,
  assignedTicket,
  canStart,
  closeWeek,
  emptyBoard,
  hourLabel,
  openWeek,
  refillBoard,
  slotChange,
  workPart,
  type Board,
  type BoardContext,
  type BoardTicket,
} from "./board";
import {
  acceptOffer,
  chooseGoal,
  createCareer,
  endDay,
  finishPlacement,
  finishWork,
  partPlan,
  workTicket,
  type CareerState,
} from "./career";
import { LEVEL_GAMES } from "./ladder";

const ctx = (patch: Partial<BoardContext> = {}): BoardContext => ({
  companyName: "Keel Systems",
  companyType: "enterprise",
  level: "mid",
  stats: { skill: 0, reputation: 20, relationship: 40 },
  day: 1,
  ...patch,
});

function ticket(patch: Partial<BoardTicket> = {}): BoardTicket {
  return {
    key: "KEEL-1",
    title: "Test ticket",
    game: "tidy",
    priority: "medium",
    size: "M",
    parts: 1,
    partsDone: 0,
    partHours: 4,
    createdAt: 0,
    dueAt: 20,
    overdue: false,
    urgent: false,
    parent: null,
    ...patch,
  };
}

const boardWith = (tickets: BoardTicket[], hour = 0): Board => ({
  tickets,
  nextNumber: 200,
  hour,
});

describe("dealing the board", () => {
  it("gives a fresher three small tickets from their own games", () => {
    const dealt = refillBoard(emptyBoard(), ctx({ level: "fresher" }), 0, 7);
    expect(dealt.board.tickets).toHaveLength(3);
    for (const item of dealt.board.tickets) {
      expect(LEVEL_GAMES.fresher).toContain(item.game);
      expect(["S", "M"]).toContain(item.size);
      expect(item.key.startsWith("KEEL-")).toBe(true);
      expect(item.dueAt).toBeGreaterThan(item.partHours * item.parts);
    }
  });

  it("makes juniors take the lead's order and lets engineers pick", () => {
    const board = boardWith([
      ticket({ key: "A", dueAt: 30 }),
      ticket({ key: "B", dueAt: 10 }),
    ]);
    expect(assignedTicket(board, "junior")?.key).toBe("B");
    expect(assignedTicket(board, "mid")).toBeNull();
  });

  it("labels the week clock like a work calendar", () => {
    expect(hourLabel(0)).toBe("Mon 9:00");
    expect(hourLabel(13)).toBe("Tue 14:00");
    expect(hourLabel(WEEK_HOURS)).toBe("Fri 17:00");
    expect(hourLabel(WEEK_HOURS + 3)).toBe("Overtime +3h");
  });
});

describe("working a ticket", () => {
  it("needs every part of a big ticket, and a miss keeps the part open", () => {
    const big = ticket({ size: "L", parts: 2, partHours: 4, dueAt: 60 });
    const first = workPart(boardWith([big]), big.key, "clear", ctx(), 3);
    expect(first?.finished).toBe(false);
    expect(first?.board.hour).toBe(4);
    const missed = workPart(first!.board, big.key, "miss", ctx(), 5);
    expect(missed?.ticket.partsDone).toBe(1);
    expect(missed?.board.hour).toBe(8);
    const late = workPart(missed!.board, big.key, "late", ctx(), 9);
    expect(late?.finished).toBe(true);
    expect(late?.spent).toBe(6);
    expect(late?.board.tickets.some((item) => item.key === big.key)).toBe(
      false,
    );
  });

  it("stops at 40 hours, except at startups which can push into overtime", () => {
    const late = boardWith([ticket()], 38);
    expect(canStart(late, late.tickets[0]!, "enterprise")).toBe(false);
    expect(canStart(late, late.tickets[0]!, "startup")).toBe(true);
    const pushed = workPart(
      late,
      "KEEL-1",
      "clear",
      ctx({ companyType: "startup" }),
      1,
    );
    expect(pushed?.overtime).toBe(2);
  });

  it("calls a finish early, on time, or late against the deadline", () => {
    const early = workPart(
      boardWith([ticket({ dueAt: 40 })]),
      "KEEL-1",
      "clear",
      ctx(),
      1,
    );
    expect(early?.timing).toBe("early");
    const tight = workPart(
      boardWith([ticket({ dueAt: 20 })], 14),
      "KEEL-1",
      "clear",
      ctx(),
      1,
    );
    expect(tight?.timing).toBe("onTime");
    const missed = workPart(
      boardWith([ticket({ dueAt: 6 })], 4),
      "KEEL-1",
      "clear",
      ctx(),
      1,
    );
    expect(missed?.timing).toBe("late");
    expect(missed?.newlyOverdue.map((item) => item.key)).toContain("KEEL-1");
  });
});

describe("the week turning over", () => {
  it("marks late work at Friday and hands off work two weeks late", () => {
    const board = boardWith([
      ticket({ key: "DUE", dueAt: 30 }),
      ticket({ key: "OLD", dueAt: 0, overdue: true }),
      ticket({ key: "LATER", dueAt: 100 }),
    ]);
    const closed = closeWeek(board, 2);
    expect(closed.newlyOverdue.map((item) => item.key)).toEqual(["DUE"]);
    expect(closed.reassigned.map((item) => item.key)).toEqual(["OLD"]);
    expect(closed.board.hour).toBe(0);
    expect(closed.board.tickets.map((item) => item.key)).toEqual([
      "DUE",
      "LATER",
    ]);
  });

  it("moves every deadline a week when you're off sick", () => {
    const opened = openWeek(
      boardWith([ticket({ dueAt: 50 })]),
      ctx({ day: 2 }),
      1,
      true,
    );
    expect(opened.board.tickets[0]?.dueAt).toBe(50 + WEEK_HOURS);
    expect(opened.arrived).toHaveLength(0);
  });

  it("turns unused hours into free time and overtime into less", () => {
    expect(slotChange(0)).toBe(2);
    expect(slotChange(30)).toBe(1);
    expect(slotChange(40)).toBe(0);
    expect(slotChange(49)).toBe(-2);
  });
});

function hired(): CareerState {
  const state = chooseGoal(finishPlacement(createCareer(8), "win", 3), "fire");
  const offer = state.offers[0];
  if (!offer) throw new Error("missing offer");
  return acceptOffer(state, offer.id);
}

describe("the board in a career", () => {
  it("deals a board on joining and spends hours and energy per part", () => {
    const state = hired();
    expect(state.board.tickets.length).toBeGreaterThan(0);
    const first = state.board.tickets[0]!;
    const plan = partPlan(state, first);
    const worked = workTicket(state, first.key, "clear", 0, 42);
    expect(worked.board.hour).toBe(plan.hours);
    expect(worked.stats.energy).toBe(state.stats.energy - plan.energy);
  });

  it("gives free time back for stopping early", () => {
    const state = hired();
    expect(finishWork(state).nightSlots).toBe(state.nightSlots + 2);
  });

  it("costs reputation when a deadline passes at the end of the week", () => {
    const state = hired();
    const due = {
      ...state,
      board: boardWith([ticket({ priority: "high", dueAt: 10 })]),
    };
    const skipped = endDay(due);
    expect(skipped.stats.reputation).toBeLessThan(state.stats.reputation);
    expect(skipped.log.join(" ")).toContain("Missed deadlines");
  });
});
