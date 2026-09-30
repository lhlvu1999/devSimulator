import { describe, expect, it } from "vitest";
import {
  dealRound,
  handValue,
  hitRound,
  payout,
  standRound,
} from "./blackjack";
import {
  acceptOffer,
  buyAsset,
  buyGear,
  createCareer,
  endDay,
  chooseGoal,
  finishPlacement,
  finishWork,
  recordWork,
  sellAsset,
} from "./career";
import { taskDifficulty, taskSeconds } from "./difficulty";
import { gameSeconds } from "./workGames";
import { fresherProfile } from "./placement";
import { emptyBoard, newbieMove, winner } from "./tictactoe";
import { backfillHistory, rollPrices, START_PRICES } from "./market";

describe("placement and the day", () => {
  it("makes work easier when relationship is high and harder when skill is high", () => {
    expect(taskDifficulty(10, 20)).toBe("easy");
    expect(taskDifficulty(22, 10)).toBe("hard");
    expect(taskDifficulty(22, 46)).not.toBe("hard");
    expect(taskSeconds("easy", 14)).toBe(38);
    expect(gameSeconds("tidy", "easy", 6)).toBe(18);
    expect(gameSeconds("spot", "hard")).toBeLessThan(
      gameSeconds("wires", "hard"),
    );
  });

  it("keeps a fast win inside the high fresher band", () => {
    const fast = fresherProfile("win", 3);
    const slow = fresherProfile("win", 5);
    const lost = fresherProfile("loss", 4);
    expect(fast.label).toBe("High fresher");
    expect(fast.stats.skill).toBeGreaterThan(slow.stats.skill);
    expect(slow.stats.skill).toBeGreaterThan(lost.stats.skill);
    expect(fast.stats.skill).toBeLessThanOrEqual(22);
    expect(lost.stats.skill).toBeGreaterThanOrEqual(8);
  });

  it("detects a three-move win and a newbie move on an empty square", () => {
    const board = emptyBoard();
    board[0] = "X";
    board[1] = "X";
    board[2] = "X";
    expect(winner(board)).toBe("X");
    const move = newbieMove(emptyBoard(), 3);
    expect(move.index).toBeGreaterThanOrEqual(0);
    expect(move.index).toBeLessThan(9);
  });

  it("turns placement into offers, then work you can leave without a story choice", () => {
    let state = chooseGoal(finishPlacement(createCareer(4), "win", 3), "fire");
    expect(state.section).toBe("offers");
    expect(state.offers).toHaveLength(3);
    const offer = state.offers[0];
    if (!offer) throw new Error("missing offer");
    state = acceptOffer(state, offer.id);
    expect(state.section).toBe("room");
    state = finishWork(state);
    expect(state.section).toBe("room");
    expect(state.workDone).toBe(true);
    expect(recordWork(state, "clear")).toBe(state);
  });

  it("ends the day with full energy and a fresh work day", () => {
    let state = chooseGoal(finishPlacement(createCareer(4), "win", 4), "fire");
    const offer = state.offers[0];
    if (!offer) throw new Error("missing offer");
            state = finishWork(recordWork(acceptOffer(state, offer.id), "clear"));
    const night = endDay(state);
    expect(night.stats.energy).toBe(100);
    expect(night.workDone).toBe(false);
    expect(night.history.crypto).toHaveLength(30);
    expect(night.history.crypto.at(-2)).toBe(state.prices.crypto);
    expect(night.history.crypto.at(-1)).toBe(night.prices.crypto);
  });

  it("records a work block without leaving the work section", () => {
    let state = chooseGoal(finishPlacement(createCareer(4), "win", 4), "fire");
    const offer = state.offers[0];
    if (!offer) throw new Error("missing offer");
    state = acceptOffer(state, offer.id);
    const worked = recordWork(state, "clear");
    expect(worked.section).toBe("room");
    expect(worked.stats.skill).toBeGreaterThan(state.stats.skill);
    expect(worked.stats.energy).toBeLessThan(state.stats.energy);
  });

  it("fills earlier days so every chart has a full month", () => {
    const filled = backfillHistory(
      { ATLS: [320], crypto: [30, 34], gold: [190] },
      7,
    );
    expect(filled.ATLS).toHaveLength(30);
    expect(filled.ATLS.at(-1)).toBe(320);
    expect(filled.PIXL).toHaveLength(30);
    expect(filled.crypto.at(-1)).toBe(34);
    expect(filled.gold.at(-1)).toBe(190);
    expect(createCareer(4).history.SPRK).toHaveLength(30);
  });

  it("moves prices after the day and lets cash buy a share", () => {
    const first = rollPrices(START_PRICES, 11);
    const second = rollPrices(START_PRICES, 11);
    expect(first.prices).toEqual(second.prices);
    expect(first.prices).not.toEqual(START_PRICES);

    let state = chooseGoal(finishPlacement(createCareer(8), "win", 3), "fire");
    const offer = state.offers[0];
    if (!offer) throw new Error("missing offer");
    state = finishWork(acceptOffer(state, offer.id));
    const bought = buyAsset(state, "gold");
    expect(bought.holdings.gold).toBe(1);
    expect(bought.stats.money).toBeLessThan(state.stats.money);
    const sold = sellAsset(bought, "gold");
    expect(sold.holdings.gold).toBe(0);
    const night = endDay(bought);
    expect(night.section).toBe("summary");
    expect(night.day).toBe(2);
    const rich = { ...bought, stats: { ...bought.stats, money: 2000 } };
    const upgraded = buyGear(rich, "device", "monitor");
    expect(upgraded.deviceId).toBe("monitor");
    expect(upgraded.stats.money).toBe(1100);
  });

  it("pays a winning blackjack stake and busts a player over 21", () => {
    expect(payout("win", 50)).toBe(50);
    expect(payout("lose", 50)).toBe(-50);
    expect(
      handValue([
        { rank: 1, label: "A" },
        { rank: 13, label: "K" },
      ]),
    ).toBe(21);
    const dealt = dealRound(20, 5);
    expect(dealt.round.player).toHaveLength(2);
    let round = dealt.round;
    if (round.phase === "player") {
      while (round.phase === "player" && handValue(round.player) < 21) {
        round = hitRound(round);
        if (round.player.length > 8) break;
      }
    }
    expect(["playing", "win", "lose", "push", "blackjack"]).toContain(
      round.outcome,
    );
    if (round.phase === "player") round = standRound(round);
    expect(round.phase).toBe("done");
  });
});
