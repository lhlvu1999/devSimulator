import { describe, expect, it } from "vitest";
import {
  acceptOffer,
  careerStatus,
  chooseGoal,
  createCareer,
  finishPlacement,
  practiceHobby,
  recordWork,
  doActivity,
  takeLesson,
  workOnSide,
  type CareerState,
} from "./career";
import { LEVEL_GAMES } from "./ladder";
import { COURSES, SIDE_STAGES, sideIncome, sideStage } from "./pursuits";
import { scaleSkill, skillRating, skillTier } from "./skill";
import { activityById } from "./life";
import { pickGame } from "./workGames";

function hired(): CareerState {
  const state = chooseGoal(finishPlacement(createCareer(8), "win", 3), "fire");
  const offer = state.offers[0];
  if (!offer) throw new Error("missing offer");
  const joined = acceptOffer(state, offer.id);
  return { ...joined, stats: { ...joined.stats, money: 5000 } };
}

/** Plenty of evenings, so a test can run a whole course or streak in one go. */
const roomy = (state: CareerState): CareerState => ({
  ...state,
  nightSlots: 50,
  weekendSlots: 50,
  stats: { ...state.stats, energy: 100, money: 5000 },
});

describe("skill outside work", () => {
  it("grows with your title, so a hackathon doesn't carry a fresher to junior", () => {
    const fresher = roomy(hired());
    expect(fresher.level).toBe("fresher");
    const hackathon = activityById("hackathon")!;
    const after = doActivity(fresher, "hackathon");
    expect(after.stats.skill - fresher.stats.skill).toBe(12);
    const senior = roomy({ ...hired(), level: "senior" });
    expect(doActivity(senior, "hackathon").stats.skill - senior.stats.skill).toBe(hackathon.effects.skill);
  });

  it("never rounds a small gain down to nothing, or touches other stats", () => {
    expect(scaleSkill({ skill: 1, mood: 3 }, "fresher")).toEqual({ skill: 1, mood: 3 });
    expect(scaleSkill({ skill: 0, mood: 3 }, "fresher")).toEqual({ skill: 0, mood: 3 });
    expect(scaleSkill({ skill: 10 }, "staff")).toEqual({ skill: 14 });
  });
});

describe("courses", () => {
  it("takes a weeknight per lesson and pays out a certificate at the end", () => {
    const course = COURSES.find((item) => item.id === "frontend")!;
    let state = roomy(hired());
    const start = state.stats.skill;
    for (let lesson = 0; lesson < course.lessons; lesson += 1) {
      state = takeLesson(
        { ...state, stats: { ...state.stats, energy: 100 } },
        "frontend",
      );
    }
    expect(state.pursuits.courses.frontend).toBe(course.lessons);
    expect(state.pursuits.certificates).toEqual(["frontend"]);
    const lesson = scaleSkill(course.lesson, state.level).skill ?? 0;
    const certificate =
      scaleSkill({ skill: (course.lesson.skill ?? 0) + (course.finish.skill ?? 0) }, state.level).skill ?? 0;
    expect(state.stats.skill).toBe(start + lesson * (course.lessons - 1) + certificate);
    expect(takeLesson(state, "frontend")).toBe(state);
  });
});

describe("hobbies", () => {
  it("builds a streak week over week and resets after a missed week", () => {
    let state = roomy(hired());
    state = practiceHobby(state, "running", "night");
    expect(state.pursuits.hobbies.running.streak).toBe(1);
    state = practiceHobby(
      { ...state, day: state.day + 1 },
      "running",
      "weekend",
    );
    expect(state.pursuits.hobbies.running.streak).toBe(2);
    state = practiceHobby({ ...state, day: state.day + 3 }, "running", "night");
    expect(state.pursuits.hobbies.running.streak).toBe(1);
  });
});

describe("side project", () => {
  it("launches after enough sessions and only pays while you keep at it", () => {
    let state = roomy(hired());
    const launch = SIDE_STAGES.find((stage) => stage.name === "Launched")!;
    for (let session = 0; session < launch.from; session += 1) {
      state = workOnSide(
        { ...state, stats: { ...state.stats, energy: 100 } },
        "night",
      );
    }
    expect(sideStage(state.pursuits.side.sessions).stage.name).toBe("Launched");
    expect(
      sideIncome(state.pursuits.side, state.day, 1).income,
    ).toBeGreaterThan(0);
    expect(sideIncome(state.pursuits.side, state.day + 5, 1).income).toBe(0);
  });
});

describe("skill and pace", () => {
  it("rates open-ended skill on a 0 to 100 curve", () => {
    expect(skillRating(0)).toBe(0);
    expect(skillRating(100)).toBe(25);
    expect(skillRating(1600)).toBe(100);
    expect(skillRating(5000)).toBe(100);
    expect(skillTier(10)).toBe("Beginner");
    expect(skillTier(2000)).toBe("Expert");
  });

  it("takes a fresher a few full weeks of clean work to reach the review", () => {
    let state = hired();
    let seed = 11;
    let weeks = 0;
    while (!careerStatus(state).ready && weeks < 20) {
      weeks += 1;
      for (let part = 0; part < 10; part += 1) {
        const picked = pickGame(seed, state.company?.type, LEVEL_GAMES.fresher);
        seed = picked.rngState;
        state = recordWork(
          { ...state, stats: { ...state.stats, energy: 100 } },
          "clear",
          0,
          picked.game,
        );
      }
    }
    expect(weeks).toBeGreaterThanOrEqual(3);
    expect(weeks).toBeLessThanOrEqual(7);
  });
});
