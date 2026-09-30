import {
  acceptOffer,
  chooseGoal,
  finishPlacement,
  freshBoard,
  type CareerState,
} from "./career";
import { MILESTONES, emptyProgress, type Level } from "./ladder";
import type { WorkGame } from "./workGames";
import { emptyFeed, refreshFeed } from "./workline";

/** Testing shortcuts for the Sandbox tab. None of these are reachable from normal play. */

function hired(state: CareerState): CareerState {
  let next = state;
  if (next.section === "placement") next = chooseGoal(finishPlacement(next, "win", 4), "fire");
  if (next.section === "goal") next = chooseGoal(next, "fire");
  if (next.section === "offers") {
    const offer = next.offers[0];
    if (offer) next = acceptOffer(next, offer.id);
  }
  return next.company ? { ...next, section: "room" } : next;
}

export function jumpToLevel(state: CareerState, level: Level): CareerState {
  const next = hired(state);
  const refreshed = refreshFeed(emptyFeed(), {
    day: next.day,
    companyId: next.company?.id ?? null,
    level,
    reputation: next.stats.reputation,
    seed: (next.rngState ^ 0x51f15e) >>> 0,
  });
  return freshBoard(
    {
      ...next,
      level,
      levelDay: next.day,
      progress: emptyProgress(),
      reviewDay: null,
      workDone: false,
      feed: refreshed.feed,
      log: [`Sandbox: you are now at ${level}.`],
    },
    0,
  );
}

export function meetMilestones(state: CareerState): CareerState {
  const next = hired(state);
  const milestone = MILESTONES[next.level];
  if (!milestone) return next;
  const progress = { ...next.progress };
  for (const game of Object.keys(milestone.tickets) as WorkGame[]) {
    progress[game] = Math.max(progress[game], milestone.tickets[game] ?? 0);
  }
  const { stat, value } = milestone.gate;
  return {
    ...next,
    progress,
    reviewDay: null,
    stats: { ...next.stats, [stat]: Math.max(next.stats[stat], value) },
    log: ["Sandbox: milestones met. The promotion review is open."],
  };
}

export function topUp(state: CareerState): CareerState {
  const next = hired(state);
  return {
    ...next,
    workDone: false,
    board: { ...next.board, hour: 0 },
    stats: {
      ...next.stats,
      money: next.stats.money + 1000,
      energy: 100,
      health: 100,
    },
    log: ["Sandbox: +$1,000, full energy, full health, and a fresh work week."],
  };
}
