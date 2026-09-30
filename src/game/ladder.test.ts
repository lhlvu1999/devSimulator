import { describe, expect, it } from "vitest";
import {
  acceptOffer,
  careerStatus,
  createCareer,
  endDay,
  failReview,
  chooseGoal,
  finishPlacement,
  nextMorning,
  passReview,
  paydayFor,
  recordWork,
  type CareerState,
} from "./career";
import { dealInbox } from "./inbox";
import { LEVEL_GAMES, MILESTONES } from "./ladder";
import { dealShip, inZone, markerAt } from "./ship";
import { pickGame } from "./workGames";

function hired(): CareerState {
  const state = chooseGoal(finishPlacement(createCareer(4), "win", 4), "fire");
  const offer = state.offers[0];
  if (!offer) throw new Error("missing offer");
  return acceptOffer(state, offer.id);
}

function readyFresher(): CareerState {
  const state = hired();
  return {
    ...state,
    day: state.levelDay + 5,
        progress: { ...state.progress, ...MILESTONES.fresher?.tickets },
    stats: { ...state.stats, skill: MILESTONES.fresher?.gate.value ?? 0 },
  };
}

describe("career ladder", () => {
  it("counts clean tickets per game and ignores misses", () => {
    let state = hired();
    state = recordWork(state, "clear", 0, "tidy");
    state = recordWork(state, "miss", 0, "spot");
    expect(state.progress.tidy).toBe(1);
    expect(state.progress.spot).toBe(0);
  });

  it("opens the review only when every milestone is met", () => {
    expect(careerStatus(hired()).ready).toBe(false);
    const ready = careerStatus(readyFresher());
    expect(ready.ready).toBe(true);
    expect(ready.nextTitle).toBe("Junior engineer");
  });

  it("promotes, raises pay, unlocks a game, and resets progress", () => {
    const before = readyFresher();
    const after = passReview(before);
    expect(after.level).toBe("junior");
    expect(paydayFor(after)).toBeGreaterThan(paydayFor(before));
    expect(careerStatus(after).games).toContain("wires");
    expect(after.progress.tidy).toBe(0);
  });

  it("makes a failed review wait until the next day", () => {
    const failed = failReview(readyFresher());
    expect(careerStatus(failed).triedToday).toBe(true);
    expect(passReview(failed)).toBe(failed);
    const tomorrow = nextMorning(endDay(failed));
    expect(careerStatus(tomorrow).triedToday).toBe(false);
    expect(passReview(tomorrow).level).toBe("junior");
  });

  it("only deals games unlocked at the current level", () => {
    let seed = 3;
    for (let index = 0; index < 400; index += 1) {
      const picked = pickGame(seed, "startup", LEVEL_GAMES.fresher);
      expect(LEVEL_GAMES.fresher).toContain(picked.game);
      seed = picked.rngState;
    }
  });
});

describe("ship it", () => {
  it("narrows the window each release and bounces the marker", () => {
    const { puzzle } = dealShip(7, "normal", 0);
    expect(puzzle.zones).toHaveLength(3);
    expect(puzzle.zones[2]?.width).toBeLessThan(puzzle.zones[0]?.width ?? 0);
    expect(markerAt(0, 1)).toBe(0);
    expect(Math.round(markerAt(500, 1))).toBe(100);
    const zone = puzzle.zones[0];
    if (!zone) throw new Error("missing zone");
    expect(inZone(zone.start + zone.width / 2, zone)).toBe(true);
  });
});

describe("sort the inbox", () => {
  it("deals a mix of urgent and calm messages", () => {
    const { puzzle } = dealInbox(5, "hard", 0);
    expect(puzzle.messages).toHaveLength(8);
    expect(
      puzzle.messages.filter((message) => message.lane === "now"),
    ).toHaveLength(4);
  });
});
