/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { App } from "../App";
import {
  acceptOffer,
  applyToPost,
  careerStatus,
  chooseGoal,
  createCareer,
  doActivity,
  endDay,
  finishPlacement,
  finishWork,
  joinCompany,
  nextMorning,
  passReview,
  practiceHobby,
  resolveEvent,
  setSleep,
  takeLesson,
  workOnSide,
  workTicket,
  type CareerState,
} from "../game/career";
import { ACTIVITIES } from "../game/life";
import { dealInbox } from "../game/inbox";
import { dealOneOnOne, dealRoadmap, dealSprint } from "../game/manage";
import { saveGame } from "../game/save";
import { dealTicket } from "../game/tidy";
import { jumpToCompanyType, jumpToLevel, topUp } from "../game/sandbox";
import { workplaceCandidates } from "../game/workplaceEvents";
import type { CodeGrade } from "../game/types";
import { missing, setLang, t } from "./index";

/**
 * Plays the game in Vietnamese and fails on any text the translator didn't know.
 * This catches what a source scan can't: text put together while playing.
 */

const GRADES: readonly CodeGrade[] = ["clear", "clear", "late", "miss"];

function playWeek(state: CareerState, week: number, steady = true): CareerState {
  let next = steady
    ? { ...state, stats: { ...state.stats, mood: Math.max(state.stats.mood, 60), health: Math.max(state.stats.health, 60) } }
    : state;
  for (let part = 0; part < 6; part += 1) {
    const ticket = next.board.tickets[0];
    if (!ticket || next.workDone) break;
    next = workTicket(
      { ...next, stats: { ...next.stats, energy: 100 } },
      ticket.key,
      GRADES[(week + part) % GRADES.length] ?? "clear",
      part,
      week * 31 + part,
    );
  }
  if (careerStatus(next).ready) next = passReview(next);
  next = finishWork(next);
  const rich = { ...next, stats: { ...next.stats, money: next.stats.money + 3000, energy: 100 } };
  next = setSleep(rich, week % 3 === 0 ? "late" : week % 3 === 1 ? "early" : "normal");
  const activity = ACTIVITIES[week % ACTIVITIES.length];
  if (activity) next = doActivity(next, activity.id);
  next = takeLesson(next, (["frontend", "systems", "leadership"] as const)[week % 3]!);
  next = practiceHobby(next, (["running", "guitar", "cooking"] as const)[week % 3]!, "weekend");
  next = workOnSide(next, "weekend");
  const post = next.feed.posts[0];
  if (post && week % 9 === 4) {
    next = applyToPost(next, post.id);
    const applied = next.feed.posts.find((item) => item.id === post.id);
    if (applied?.application === "shortlisted") next = joinCompany(next, applied);
  }
  next = endDay(next);
  if (next.section === "ending") return next;
  next = nextMorning(next);
  if (next.event) next = resolveEvent(next, next.event.choices[week % next.event.choices.length]?.id ?? "");
  return next;
}

describe("playing in Vietnamese", () => {
  beforeAll(() => {
    localStorage.clear();
    setLang("vi");
    missing.clear();
  });
  afterAll(() => {
    cleanup();
    setLang("en");
  });

  it("knows every line of two years of play", () => {
    let state = chooseGoal(finishPlacement(createCareer(21), "win", 3), "fire");
    state = acceptOffer(state, state.offers[0]!.id);
        for (let week = 1; week <= 104 && state.section !== "ending"; week += 1) {
      state = playWeek(state, week);
    }
            expect(state.day).toBeGreaterThan(100);
        let rough = chooseGoal(finishPlacement(createCareer(3), "loss", 5), "home");
    rough = acceptOffer(rough, rough.offers[0]!.id);
    for (let week = 1; week <= 80 && rough.section !== "ending"; week += 1) {
      rough = playWeek(rough, week, false);
    }
    for (const level of ["senior", "lead", "manager"] as const) {
      let manager = jumpToLevel(createCareer(5), level);
      for (let week = 1; week <= 12; week += 1) manager = playWeek(manager, week);
    }
    expect([...missing]).toEqual([]);
  });

  it("knows every workplace event and outcome", () => {
    for (const type of ["startup", "agency", "product", "enterprise", "remote"] as const) {
      const state = topUp(jumpToCompanyType(createCareer(7), type));
      for (const candidate of workplaceCandidates(state)) {
        const event = candidate.make();
        for (const choice of event.choices) resolveEvent({ ...state, event }, choice.id);
      }
    }
    expect([...missing]).toEqual([]);
  });

  it("knows every mini-game it can deal", () => {
    for (let seed = 1; seed <= 400; seed += 1) {
      for (const difficulty of ["easy", "normal", "hard"] as const) {
        dealTicket(seed, difficulty, 0);
        for (const message of dealInbox(seed, difficulty, 0).puzzle.messages) {
          t(message.from);
          t(message.text);
        }
        for (const round of dealOneOnOne(seed, difficulty, 0).puzzle.rounds) {
          t(round.says);
          for (const reply of round.replies) t(reply.text);
        }
        for (const task of dealSprint(seed, difficulty, 0).puzzle.tasks) t(task.name);
        for (const feature of dealRoadmap(seed, difficulty, 0).puzzle.features) t(feature.name);
      }
    }
    expect([...missing]).toEqual([]);
  });

  it("shows every main screen without English left over", () => {
    saveGame(topUp(jumpToLevel(createCareer(9), "mid")));
    render(<App />);
    for (const tab of ["Cửa hàng", "Đầu tư", "Việc làm", "Tôi", "Nhà"]) {
      fireEvent.click(screen.getByRole("button", { name: tab }));
    }
    fireEvent.click(screen.getByRole("button", { name: "Làm việc" }));
    fireEvent.click(screen.getByRole("button", { name: "Chốt tuần" }));
    fireEvent.click(screen.getByRole("button", { name: "Thời gian rảnh" }));
    fireEvent.click(screen.getByRole("tab", { name: "Theo đuổi" }));
    expect([...missing]).toEqual([]);
  });
});
