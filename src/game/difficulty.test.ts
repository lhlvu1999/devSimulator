import { describe, expect, it } from "vitest";
import { refillBoard, emptyBoard, type BoardContext } from "./board";
import {
  acceptOffer,
  chooseGoal,
  createCareer,
  finishPlacement,
  recordWork,
  type CareerState,
} from "./career";
import { LEVEL_DIFFICULTY, rollDifficulty, type Difficulty } from "./difficulty";
import type { Level } from "./ladder";

const ctx = (level: Level): BoardContext => ({
  companyName: "Keel Systems",
  companyType: "product",
  level,
  stats: { skill: 0, reputation: 20, relationship: 40 },
  day: 1,
});

/** Deals many boards and counts the difficulty of every ticket. */
function mix(level: Level): Record<Difficulty, number> {
  const counts: Record<Difficulty, number> = { easy: 0, normal: 0, hard: 0 };
  for (let seed = 1; seed <= 200; seed += 1) {
    for (const ticket of refillBoard(emptyBoard(), ctx(level), 0, seed).board.tickets) {
      counts[ticket.difficulty] += 1;
    }
  }
  return counts;
}

describe("difficulty by title", () => {
  it("never hands a fresher hard work or a principal easy work", () => {
    expect(mix("fresher").hard).toBe(0);
    expect(mix("principal").easy).toBe(0);
    expect(LEVEL_DIFFICULTY.fresher.hard).toBe(0);
  });

  it("gives higher titles more hard work", () => {
    const share = (level: Level) => {
      const counts = mix(level);
      return counts.hard / (counts.easy + counts.normal + counts.hard);
    };
    expect(share("junior")).toBeLessThan(share("mid"));
    expect(share("mid")).toBeLessThan(share("senior"));
    expect(share("senior")).toBeLessThan(share("staff"));
  });

  it("never makes urgent or critical work easy", () => {
    for (let roll = 0; roll < 1; roll += 0.05) {
      expect(rollDifficulty("fresher", roll, true)).not.toBe("easy");
    }
  });
});

function hired(): CareerState {
  const state = chooseGoal(finishPlacement(createCareer(8), "win", 3), "fire");
  const offer = state.offers[0];
  if (!offer) throw new Error("missing offer");
  return acceptOffer(state, offer.id);
}

describe("rewards by difficulty", () => {
  it("pays more skill and reputation for hard work than easy work", () => {
    const total = (difficulty: Difficulty) => {
      let skill = 0;
      let reputation = 0;
      for (let seed = 1; seed <= 400; seed += 1) {
        const before = { ...hired(), rngState: seed };
        const after = recordWork(before, "clear", 0, "tidy", 0, false, difficulty);
        skill += after.stats.skill - before.stats.skill;
        reputation += after.stats.reputation - before.stats.reputation;
      }
      return { skill, reputation };
    };
    const easy = total("easy");
    const hard = total("hard");
    expect(hard.skill).toBeGreaterThan(easy.skill * 1.6);
    expect(hard.reputation).toBeGreaterThan(easy.reputation);
  });
});
