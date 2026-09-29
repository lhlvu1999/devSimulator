import { describe, expect, it } from "vitest";
import {
  acceptOffer,
  careerStatus,
  createCareer,
  difficultyFor,
  finishPlacement,
  passReview,
  recordWork,
  switchTrack,
  type CareerState,
} from "./career";
import { LEVEL_GAMES, nextLevel, picksOwnWork, twinOf } from "./ladder";
import {
  dealOneOnOne,
  dealRoadmap,
  dealSprint,
  slotFor,
  sprintSolved,
} from "./manage";

function senior(): CareerState {
  const state = finishPlacement(createCareer(4), "win", 4);
  const offer = state.offers[0];
  if (!offer) throw new Error("missing offer");
  const hired = acceptOffer(state, offer.id);
  return {
    ...hired,
    level: "senior",
    progress: { ...hired.progress, ship: 4, inbox: 3 },
    stats: { ...hired.stats, skill: 70, relationship: 40, reputation: 40 },
  };
}

describe("manager track", () => {
  it("pairs levels across the two tracks", () => {
    expect(twinOf("senior")).toBe("lead");
    expect(twinOf("director")).toBe("principal");
    expect(twinOf("mid")).toBeNull();
    expect(nextLevel("lead")).toBe("manager");
    expect(nextLevel("staff")).toBe("principal");
    expect(nextLevel("director")).toBeNull();
  });

  it("switches to team lead with half the progress and back again", () => {
    const lead = switchTrack(senior());
    expect(lead.level).toBe("lead");
    expect(lead.progress.ship).toBe(2);
    expect(lead.progress.inbox).toBe(1);
    expect(careerStatus(lead).track).toBe("manager");
    expect(careerStatus(lead).games).toEqual(LEVEL_GAMES.lead);
    expect(picksOwnWork("lead")).toBe(true);
    expect(switchTrack(lead).level).toBe("senior");
  });

  it("trades skill for relationship on manager work", () => {
    const lead = switchTrack(senior());
    const worked = recordWork(lead, "clear", 0, "oneonone");
    expect(worked.stats.relationship).toBe(lead.stats.relationship + 2);
    expect(worked.progress.oneonone).toBe(1);
    const engineer = recordWork(senior(), "clear", 0, "ship");
    expect(worked.stats.skill - lead.stats.skill).toBeLessThan(
      engineer.stats.skill - senior().stats.skill,
    );
  });

  it("makes a close team matter more than skill for a manager's difficulty", () => {
    const base = senior();
    expect(difficultyFor(base)).toBe("hard");
    const lead = switchTrack(base);
    expect(difficultyFor(lead)).not.toBe("hard");
  });

  it("promotes a team lead to engineering manager", () => {
    const lead = switchTrack(senior());
    const ready: CareerState = {
      ...lead,
      progress: { ...lead.progress, oneonone: 6, inbox: 4 },
      stats: { ...lead.stats, relationship: 65 },
    };
    const promoted = passReview(ready);
    expect(promoted.level).toBe("manager");
    expect(careerStatus(promoted).games).toContain("sprint");
  });
});

describe("manager games", () => {
  it("deals one-on-ones with exactly one right reply each", () => {
    const { puzzle } = dealOneOnOne(3, "hard", 0);
    expect(puzzle.rounds).toHaveLength(4);
    for (const round of puzzle.rounds) {
      expect(round.replies.filter((reply) => reply.right)).toHaveLength(1);
    }
  });

  it("deals sprints that can be filled exactly", () => {
    for (let seed = 1; seed < 40; seed += 1) {
      const { puzzle } = dealSprint(seed, "hard", 0);
      const plan = puzzle.tasks
        .filter((task) => task.inPlan)
        .map((task) => task.id);
      expect(sprintSolved(puzzle, plan)).toBe(true);
      expect(puzzle.tasks.some((task) => task.must && task.inPlan)).toBe(true);
    }
  });

  it("sorts big impact with small effort into now", () => {
    expect(slotFor({ impact: "big", effort: "small" })).toBe("now");
    expect(slotFor({ impact: "small", effort: "big" })).toBe("later");
    expect(slotFor({ impact: "big", effort: "big" })).toBe("next");
    expect(dealRoadmap(2, "normal", 0).puzzle.features).toHaveLength(5);
  });
});
