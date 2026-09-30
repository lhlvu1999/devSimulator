import { describe, expect, it } from "vitest";
import {
  acceptOffer,
  applyToPost,
  careerStatus,
  joinCompany,
  chooseGoal,
  createCareer,
  endDay,
  finishPlacement,
  nextMorning,
  playerCv,
  type CareerState,
} from "./career";
import {
  CERTIFICATE_SKILL,
  HIRING_BAR,
  cvLines,
  cvMatch,
  cvOf,
  fitOf,
  screenChance,
  taskScaleFor,
} from "./cv";
import { MILESTONES } from "./ladder";
import { interviewRounds, type JobPost } from "./workline";

function hired(): CareerState {
  const state = chooseGoal(finishPlacement(createCareer(8), "win", 3), "fire");
  const offer = state.offers[0];
  if (!offer) throw new Error("missing offer");
  return acceptOffer(state, offer.id);
}

/** A hired player with exactly one post on the feed, at the given level. */
function withPost(state: CareerState, level: JobPost["level"]): { state: CareerState; post: JobPost } {
  const base = state.feed.posts[0];
  if (!base) throw new Error("missing post");
  const post: JobPost = { ...base, level, application: undefined };
  return { state: { ...state, feed: { ...state.feed, posts: [post] } }, post };
}

describe("the CV", () => {
  it("lists what HR asks for and what you have, with certificates counting as skill", () => {
    const state = {
      ...hired(),
      experience: 20,
      stats: { ...hired().stats, skill: 150 },
      pursuits: { ...hired().pursuits, certificates: ["frontend" as const] },
    };
    const lines = cvLines(playerCv(state), "mid");
    const skill = lines.find((line) => line.id === "skill");
    expect(skill?.have).toBe(150 + CERTIFICATE_SKILL);
    expect(skill?.need).toBe(HIRING_BAR.mid.skill);
    expect(skill?.met).toBe(false);
    expect(lines.find((line) => line.id === "experience")?.met).toBe(true);
  });

  it("calls strong matches every time, close ones sometimes, and far-off ones rarely", () => {
    expect(fitOf(1)).toBe("strong");
    expect(fitOf(0.9)).toBe("close");
    expect(fitOf(0.5)).toBe("reach");
    expect(screenChance(1, false)).toBe(1);
    expect(screenChance(0.9, false)).toBeGreaterThan(screenChance(0.8, false));
    expect(screenChance(0.9, true)).toBeGreaterThan(screenChance(0.9, false));
    expect(screenChance(0.7, false)).toBeLessThanOrEqual(0.05);
    expect(screenChance(0.4, true)).toBe(0);
  });

  it("counts weeks employed as experience", () => {
    const state = hired();
    const week = nextMorning(endDay({ ...state, board: { ...state.board, tickets: [] } }));
    expect(week.experience).toBe(state.experience + 1);
  });
});

describe("applying", () => {
  it("shortlists a CV that meets the bar and asks more interview rounds for a step up", () => {
    const qualified = {
      ...hired(),
      experience: 40,
      stats: { ...hired().stats, skill: 500, reputation: 40 },
    };
    expect(cvMatch(playerCv(qualified), "mid")).toBe(1);
    const { state, post } = withPost(qualified, "mid");
    const applied = applyToPost(state, post.id);
    const result = applied.feed.posts[0];
    expect(result?.application).toBe("shortlisted");
    expect(interviewRounds(result!, "fresher")).toBe(4);
    expect(applyToPost(applied, post.id)).toBe(applied);
  });

  it("turns down a CV far below the bar and blocks that company for a while", () => {
    const { state, post } = withPost({ ...hired(), experience: 0 }, "staff");
    const applied = applyToPost(state, post.id);
    expect(applied.feed.posts[0]?.application).toBe("rejected");
    expect(applied.feed.blocked[post.companyId]).toBeGreaterThan(state.day);
  });
});

describe("promotion tasks after switching", () => {
  it("cuts tasks more the closer your CV is to the next level's bar", () => {
    const stats = hired().stats;
    const weak = cvOf({ ...stats, skill: 50 }, 2, 0);
    const halfway = cvOf({ ...stats, skill: 330, reputation: 23 }, 23, 0);
    const ready = cvOf({ ...stats, skill: 900, reputation: 60 }, 70, 0);
    expect(taskScaleFor(weak, "mid")).toBe(1);
    expect(taskScaleFor(halfway, "mid")).toBeLessThan(1);
    expect(taskScaleFor(halfway, "mid")).toBeGreaterThan(0.5);
    expect(taskScaleFor(ready, "mid")).toBe(0.5);
    expect(taskScaleFor(ready, "principal")).toBe(1);
  });

  it("resets progress on joining but asks fewer tasks of a strong CV", () => {
    const strong = {
      ...hired(),
      level: "mid" as const,
      experience: 70,
      progress: { ...hired().progress, wires: 9 },
      stats: { ...hired().stats, skill: 900, reputation: 60 },
    };
    const post: JobPost = { ...strong.feed.posts[0]!, level: "mid", companyId: "atlas" };
    const joined = joinCompany(strong, post);
    expect(joined.progress.wires).toBe(0);
    expect(joined.taskScale).toBe(0.5);
    const wires = careerStatus(joined).items.find((item) => item.id === "wires");
    expect(wires?.need).toBe(Math.ceil((MILESTONES.mid?.tickets.wires ?? 0) * 0.5));
    const gate = careerStatus(joined).items.find((item) => item.id === "gate");
    expect(gate?.need).toBe(MILESTONES.mid?.gate.value);
  });
});
