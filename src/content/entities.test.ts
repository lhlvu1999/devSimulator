import { describe, expect, it } from "vitest";
import { characterArt, deviceArt, environmentArt } from "./entities";
import { environmentMotion } from "./motion";

describe("scene entities", () => {
  it("builds one file path per layer", () => {
    expect(environmentArt("startup", "desk")).toBe(
      "/art/environment/startup/desk.png",
    );
    expect(environmentArt("home", "cat")).toBe("/art/environment/home/cat.png");
    expect(environmentArt("home", "greenery")).toBe(
      "/art/environment/home/greenery.png",
    );
    expect(environmentMotion("home", "greenery", 3)).toBe(
      "/art/environment/home/motion/greenery/03.png",
    );
    expect(characterArt("bun", "hair")).toBe("/art/character/bun/hair.png");
    expect(deviceArt("rig", "bezel")).toBe("/art/device/rig/bezel.png");
  });
});
