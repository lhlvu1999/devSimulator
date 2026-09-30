import { describe, expect, it } from "vitest";
import {
  acceptOffer,
  createCareer,
  endDay,
  failInterview,
  chooseGoal,
  finishPlacement,
  joinCompany,
  nextMorning,
  startInterview,
  ticketEnergyCost,
  type CareerState,
} from "./career";
import {
  emptyFeed,
  feedSize,
  offeredCompany,
  postPayday,
  refreshFeed,
  type JobPost,
} from "./workline";
import { payPackage } from "./pay";

function hired(reputation = 10): CareerState {
  const state = chooseGoal(finishPlacement(createCareer(4), "win", 4), "fire");
  const offer = state.offers[0];
  if (!offer) throw new Error("missing offer");
  const joined = acceptOffer(state, offer.id);
  return { ...joined, stats: { ...joined.stats, reputation } };
}

function firstPost(state: CareerState): JobPost {
  const post = state.feed.posts[0];
  if (!post) throw new Error("missing post");
  return post;
}

describe("workline feed", () => {
  it("draws job posts from a large employer pool", () => {
    const seen = new Set<string>();
    let seed = 1;
    for (let day = 0; day < 80; day += 1) {
      const refreshed = refreshFeed(emptyFeed(), {
        day,
        companyId: "spark",
        level: "junior",
        reputation: 80,
        seed,
      });
      seed = refreshed.rngState;
      for (const post of refreshed.feed.posts) seen.add(post.companyId);
    }
    expect(seen.size).toBeGreaterThanOrEqual(8);
  });

  it("fills with posts from other companies after the first job", () => {
    const state = hired();
    expect(state.feed.posts.length).toBeGreaterThan(0);
    expect(
      state.feed.posts.every((post) => post.companyId !== state.company?.id),
    ).toBe(true);
    expect(state.feed.social.length).toBe(3);
  });

    it("shows more posts with a better reputation, some of them above your level", () => {
    expect(feedSize(90)).toBeGreaterThan(feedSize(10));
    const refreshed = refreshFeed(emptyFeed(), {
      day: 3,
      companyId: null,
      level: "junior",
      reputation: 95,
      seed: 11,
    }).feed;
    expect(refreshed.posts).toHaveLength(5);
    expect(
      refreshed.posts.some((post) => post.stretch && post.level === "mid"),
    ).toBe(true);
  });

  it("closes posts after their last day", () => {
    const state = hired();
    const post = firstPost(state);
    const later = refreshFeed(state.feed, {
      day: post.closesDay + 1,
      companyId: state.company?.id ?? null,
      level: state.level,
      reputation: state.stats.reputation,
      seed: 5,
    }).feed;
    expect(later.posts.some((item) => item.id === post.id)).toBe(false);
  });

    it("charges energy for an interview and blocks the company after a fail", () => {
    const hiredState = hired();
    const post = firstPost(hiredState);
    expect(startInterview(hiredState, post.id)).toBe(hiredState);
    const state = {
      ...hiredState,
      feed: {
        ...hiredState.feed,
        posts: hiredState.feed.posts.map((item) =>
          item.id === post.id ? { ...item, application: "shortlisted" as const } : item,
        ),
      },
    };
    const started = startInterview(state, post.id);
    expect(started.stats.energy).toBe(
      state.stats.energy - ticketEnergyCost(state),
    );
    const failed = failInterview(started, post.id);
    expect(failed.feed.posts.some((item) => item.id === post.id)).toBe(false);
    expect(failed.feed.blocked[post.companyId]).toBe(state.day + 5);
    const tomorrow = nextMorning(endDay(failed));
    expect(
      tomorrow.feed.posts.some((item) => item.companyId === post.companyId),
    ).toBe(false);
  });

    it("joins the new company at the same title, starts progress fresh, and applies benefits", () => {
    const state = { ...hired(), progress: { ...hired().progress, tidy: 3 } };
    const post: JobPost = {
      ...firstPost(state),
      companyId: "atlas",
      level: state.level,
      stretch: false,
      stockPercent: 0.2,
      benefits: ["bonus", "stock"],
    };
    const joined = joinCompany(state, post);
    expect(joined.company?.id).toBe("atlas");
    expect(joined.level).toBe(state.level);
        expect(joined.progress.tidy).toBe(0);
    expect(joined.stats.money).toBe(state.stats.money + post.bonusCash);
    expect(joined.holdings.ATLS).toBe(state.holdings.ATLS + post.stockUnits);
    expect(joined.company?.salary).toBe(offeredCompany(post)?.salary);
    expect(postPayday(post)).toBeGreaterThan(0);
  });

  it("pays each payday in cash plus shares of a listed employer", () => {
    const state = hired();
    const atlas = offeredCompany({
      ...firstPost(state),
      companyId: "atlas",
      stockPercent: 0.2,
    });
    if (!atlas) throw new Error("missing atlas");
    const pay = payPackage(atlas, "fresher");
    expect(pay.ticker).toBe("ATLS");
    expect(pay.stock).toBe(Math.round(pay.cash * 0.2));
    expect(pay.total).toBe(pay.cash + pay.stock);
    const payday = endDay({ ...state, day: 4, company: atlas });
    const shares = Math.floor(pay.stock / state.prices.ATLS);
    expect(payday.holdings.ATLS).toBe(state.holdings.ATLS + shares);
    expect(payday.costBasis.ATLS).toBeCloseTo(
      state.costBasis.ATLS + shares * state.prices.ATLS,
    );
    const loft = offeredCompany({
      ...firstPost(state),
      companyId: "loft",
      stockPercent: 0,
    });
    expect(payPackage(loft, "fresher").stock).toBe(0);
  });

  it("promotes on a stretch post and starts fresh milestones", () => {
    const state = { ...hired(), progress: { ...hired().progress, tidy: 5 } };
    const post: JobPost = {
      ...firstPost(state),
      level: "junior",
      stretch: true,
      benefits: ["remote"],
    };
    const joined = joinCompany(state, post);
    expect(joined.level).toBe("junior");
    expect(joined.progress.tidy).toBe(0);
    expect(joined.company?.energyCost).toBeLessThan(
      offeredCompany({ ...post, benefits: [] })?.energyCost ?? 0,
    );
  });
});
