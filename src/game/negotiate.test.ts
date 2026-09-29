import { describe, expect, it } from "vitest";
import { createCareer } from "./career";
import { ASK_RAISE, askChance, leverage, negotiate } from "./negotiate";
import type { JobPost } from "./workline";

const POST: JobPost = {
  id: "post-1",
  companyId: "atlas",
  level: "junior",
  stretch: false,
  boost: 1.1,
  stockPercent: 0.2,
  benefits: ["bonus"],
  bonusCash: 1000,
  stockUnits: 4,
  postedDay: 1,
  closesDay: 4,
};

describe("negotiating an offer", () => {
  it("builds leverage from reputation, craft, and mood", () => {
    const stats = createCareer(1).stats;
    const low = leverage(
      { ...stats, reputation: 10, skill: 10, mood: 20 },
      "engineer",
    );
    const high = leverage(
      { ...stats, reputation: 80, skill: 60, mood: 80 },
      "engineer",
    );
    expect(high).toBeGreaterThan(low);
    const manager = leverage(
      { ...stats, reputation: 50, skill: 0, relationship: 90, mood: 50 },
      "manager",
    );
    expect(manager).toBeGreaterThan(
      leverage(
        { ...stats, reputation: 50, skill: 0, relationship: 90, mood: 50 },
        "engineer",
      ),
    );
  });

  it("makes a small ask safer than a big one", () => {
    expect(askChance(50, "small")).toBeGreaterThan(askChance(50, "big"));
    expect(askChance(100, "small")).toBeLessThanOrEqual(0.95);
    expect(askChance(0, "big")).toBeGreaterThanOrEqual(0.05);
  });

  it("raises pay on a yes, and can end the offer on a failed big ask", () => {
    const results = { raised: 0, held: 0, pulled: 0 };
    for (let seed = 1; seed < 400; seed += 1) {
      const small = negotiate(POST, 60, "small", seed);
      expect(small.result).not.toBe("pulled");
      const big = negotiate(POST, 20, "big", seed);
      results[big.result] += 1;
      if (small.result === "raised") {
        expect(small.post.boost).toBeCloseTo(POST.boost + ASK_RAISE.small);
        expect(small.post.bonusCash).toBeGreaterThan(POST.bonusCash);
      }
    }
    expect(results.pulled).toBeGreaterThan(0);
    expect(results.raised).toBeGreaterThan(0);
    expect(results.held).toBeGreaterThan(0);
  });
});
