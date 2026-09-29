import { describe, expect, it } from "vitest";
import { careerStatus, createCareer, passReview } from "./career";
import { jumpToLevel, meetMilestones, topUp } from "./sandbox";

describe("sandbox career tools", () => {
  it("skips placement and lands on any level with a job", () => {
    const lead = jumpToLevel(createCareer(4), "lead");
    expect(lead.company).not.toBeNull();
    expect(lead.section).toBe("room");
    expect(lead.level).toBe("lead");
    expect(careerStatus(lead).track).toBe("manager");
  });

  it("opens the promotion review in one tap", () => {
    const ready = meetMilestones(jumpToLevel(createCareer(4), "manager"));
    expect(careerStatus(ready).ready).toBe(true);
    expect(passReview(ready).level).toBe("director");
  });

  it("tops up money, energy, and health", () => {
    const start = jumpToLevel(createCareer(4), "senior");
    const topped = topUp({
      ...start,
      stats: { ...start.stats, energy: 5, health: 20 },
    });
    expect(topped.stats.energy).toBe(100);
    expect(topped.stats.health).toBe(100);
    expect(topped.stats.money).toBe(start.stats.money + 1000);
  });
});
