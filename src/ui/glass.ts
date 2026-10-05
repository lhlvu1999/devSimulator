import type { Quad } from "../content/sceneVideo";
import type { PixelRect } from "./useFitRect";

export type PixelPoint = readonly [x: number, y: number];

/** Apple's smallest comfortable tap target, in CSS pixels. */
export const MIN_TAP = 44;

/** Where the glass corners land on screen, given where the whole video frame landed. */
export function glassOnScreen(
  glass: Quad,
  media: { width: number; height: number },
  shown: PixelRect,
): PixelPoint[] {
  return glass.map(([x, y]) => [
    shown.left + (x / media.width) * shown.width,
    shown.top + (y / media.height) * shown.height,
  ]);
}

export function boundsOf(points: readonly PixelPoint[]): PixelRect {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return {
    left,
    top,
    width: Math.max(...xs) - left,
    height: Math.max(...ys) - top,
  };
}

/**
 * Pads a glass that is thinner than a finger, evenly on both sides, by sliding it sideways (or up and down) and keeping the outline of every position.
 * Stretching instead would flatten a slanted monitor's top and bottom edges and leave its corners untappable.
 */
export function tapShape(
  points: readonly PixelPoint[],
  min = MIN_TAP,
): PixelPoint[] {
  const box = boundsOf(points);
  const padX = Math.max(0, (min - box.width) / 2);
  const padY = Math.max(0, (min - box.height) / 2);
  if (padX === 0 && padY === 0) return [...points];
  const slid = points.flatMap(([x, y]): PixelPoint[] => [
    [x - padX, y - padY],
    [x + padX, y - padY],
    [x + padX, y + padY],
    [x - padX, y + padY],
  ]);
  return convexHull(slid);
}

/** Andrew's monotone chain, starting from the leftmost point. */
function convexHull(points: readonly PixelPoint[]): PixelPoint[] {
  const sorted = [...points].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
  const turn = (o: PixelPoint, a: PixelPoint, b: PixelPoint) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (ordered: readonly PixelPoint[]) => {
    const chain: PixelPoint[] = [];
    for (const point of ordered) {
      while (
        chain.length >= 2 &&
        turn(chain[chain.length - 2]!, chain[chain.length - 1]!, point) <= 0
      )
        chain.pop();
      chain.push(point);
    }
    chain.pop();
    return chain;
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}

/** A CSS polygon() of the points, measured from an origin. */
export function polygon(
  points: readonly PixelPoint[],
  origin: { left: number; top: number } = { left: 0, top: 0 },
): string {
  const corners = points.map(
    ([x, y]) =>
      `${(x - origin.left).toFixed(1)}px ${(y - origin.top).toFixed(1)}px`,
  );
  return `polygon(${corners.join(", ")})`;
}
