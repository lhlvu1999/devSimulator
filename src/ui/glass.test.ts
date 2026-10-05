import { describe, expect, it } from "vitest";
import { COMPANIES } from "../content/companies";
import { HOME_VIDEO, videoFor } from "../content/sceneVideo";
import {
  MIN_TAP,
  boundsOf,
  glassOnScreen,
  polygon,
  tapShape,
  type PixelPoint,
} from "./glass";

/** On or inside a convex polygon, whichever way it winds. */
function inside(shape: readonly PixelPoint[], [x, y]: PixelPoint): boolean {
  const sides = shape.map(([ax, ay], index) => {
    const [bx, by] = shape[(index + 1) % shape.length]!;
    return Math.sign((bx - ax) * (y - ay) - (by - ay) * (x - ax));
  });
  return sides.every((side) => side >= 0) || sides.every((side) => side <= 0);
}

describe("glass", () => {
  it("lands the corners where the frame landed", () => {
    const shown = { left: 10, top: 100, width: 360, height: 640 };
    const corners = glassOnScreen(
      [
        [0, 0],
        [720, 0],
        [720, 1280],
        [0, 1280],
      ],
      { width: 720, height: 1280 },
      shown,
    );
    expect(corners).toEqual([
      [10, 100],
      [370, 100],
      [370, 740],
      [10, 740],
    ]);
  });

  it("pads a side-on monitor to a finger, evenly, without losing any of the glass", () => {
    const sliver = [
      [100, 120],
      [110, 100],
      [110, 180],
      [100, 200],
    ] as const;
    const tap = tapShape(sliver);
    const before = boundsOf(sliver);
    const after = boundsOf(tap);
    expect(after.width).toBeCloseTo(MIN_TAP);
    expect(after.height).toBe(before.height);
    expect(after.left + after.width / 2).toBeCloseTo(
      before.left + before.width / 2,
    );
    for (const corner of sliver) expect(inside(tap, corner)).toBe(true);
    expect(inside(tap, [105, 195])).toBe(true);
    expect(inside(tap, [80, 100])).toBe(false);
  });

  it("leaves a big enough glass alone", () => {
    const glass = [
      [0, 0],
      [100, 0],
      [100, 80],
      [0, 80],
    ] as const;
    expect(tapShape(glass)).toEqual(glass);
  });

  it("writes a polygon measured from an origin", () => {
    expect(
      polygon(
        [
          [12, 30],
          [40, 30],
          [40, 60],
        ],
        { left: 10, top: 20 },
      ),
    ).toBe("polygon(2.0px 10.0px, 30.0px 10.0px, 30.0px 40.0px)");
  });

  it("keeps every clip's glass inside the frame and boxed by its screen", () => {
    const clips = [
      HOME_VIDEO,
      ...COMPANIES.map(videoFor),
    ];
    for (const clip of clips) {
      for (const [x, y] of clip.glass) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(clip.width);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(clip.height);
        expect((x / clip.width) * 100).toBeGreaterThanOrEqual(
          clip.screen.left - 1e-9,
        );
        expect((x / clip.width) * 100).toBeLessThanOrEqual(
          clip.screen.left + clip.screen.width + 1e-9,
        );
        expect((y / clip.height) * 100).toBeGreaterThanOrEqual(
          clip.screen.top - 1e-9,
        );
        expect((y / clip.height) * 100).toBeLessThanOrEqual(
          clip.screen.top + clip.screen.height + 1e-9,
        );
      }
    }
  });
});
