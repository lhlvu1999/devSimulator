import { describe, expect, it } from "vitest";
import { INBOX_POOL } from "./inboxMessages";
import {
  ONE_ON_ONE_TALKS,
  ROADMAP_FEATURES,
  SPRINT_TASK_NAMES,
} from "./manageContent";
import { EXTRA_TIDY_SCENES } from "./tidyScenesExtra";

describe("work game content pools", () => {
  it("keeps expanded content pools at the doubled targets", () => {
    expect(INBOX_POOL.length).toBeGreaterThanOrEqual(640);
    expect(ONE_ON_ONE_TALKS.length).toBeGreaterThanOrEqual(320);
    expect(SPRINT_TASK_NAMES.length).toBeGreaterThanOrEqual(440);
    expect(ROADMAP_FEATURES.length).toBeGreaterThanOrEqual(440);
    expect(Object.keys(EXTRA_TIDY_SCENES).length).toBeGreaterThanOrEqual(180);
  });
});
