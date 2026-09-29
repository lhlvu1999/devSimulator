import { describe, expect, it } from "vitest";
import { dealTicket, gradeFor, ticketSolved } from "./tidy";

describe("tidy tickets", () => {
  it("deals the same ticket from the same seed", () => {
    const first = dealTicket(4, "normal", 10);
    const second = dealTicket(4, "normal", 10);
    expect(second.ticket).toEqual(first.ticket);
    expect(first.ticket.goals).toHaveLength(2);
  });

  it("uses one change on easy and three on hard", () => {
    expect(dealTicket(8, "easy", 0).ticket.goals).toHaveLength(1);
    const hard = dealTicket(8, "hard", 0).ticket;
    expect(hard.goals).toHaveLength(3);
    expect(hard.pieces.some((piece) => piece.kind === "decoy")).toBe(true);
  });

  it("drops the decoy when a teammate is close, and marks a hint when closer", () => {
    const helped = dealTicket(8, "hard", 24).ticket;
    expect(helped.pieces.some((piece) => piece.kind === "decoy")).toBe(false);
    expect(dealTicket(8, "hard", 40).ticket.hint).not.toBeNull();
  });

  it("is solved only when every asked change is done", () => {
    const { ticket } = dealTicket(2, "hard", 40);
    const color = ticket.paint?.want ?? "sage";
    expect(ticketSolved(ticket, { removed: false, placed: false, color })).toBe(
      false,
    );
    expect(ticketSolved(ticket, { removed: true, placed: true, color })).toBe(
      true,
    );
  });

  it("pays a clear grade when half the clock is left", () => {
    expect(gradeFor(12, 24)).toBe("clear");
    expect(gradeFor(4, 24)).toBe("late");
    expect(gradeFor(0, 24)).toBe("miss");
  });
});
