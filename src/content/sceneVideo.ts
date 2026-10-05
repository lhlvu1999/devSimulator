import { workplaceOf, type Company } from "./companies";
import type { Box } from "./sceneLayout";

export type Point = readonly [x: number, y: number];

/** Four corners of a screen, clockwise from the top-left, in pixels of the video frame. */
export type Quad = readonly [Point, Point, Point, Point];

/** A silent looping clip used as the whole room, with the character's main monitor marked so the game can sit on it. Music plays separately. */
export type SceneVideo = {
  src: string;
  poster: string;
  width: number;
  height: number;
  /** 1 is normal speed. Lower is calmer. */
  playbackRate: number;
  /** The glass of the main monitor. Angled monitors aren't rectangles, so the corners are kept as measured. */
  glass: Quad;
  /** The box around the glass, in percent of the video frame. */
  screen: Box;
};

/** Bump when a clip file changes so browsers and the iOS web view fetch the new one. */
const CLIP_VERSION = "5";
const WIDTH = 720;
const HEIGHT = 1280;

function boundsOf(glass: Quad): Box {
  const xs = glass.map(([x]) => x);
  const ys = glass.map(([, y]) => y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return {
    left: (left / WIDTH) * 100,
    top: (top / HEIGHT) * 100,
    width: ((Math.max(...xs) - left) / WIDTH) * 100,
    height: ((Math.max(...ys) - top) / HEIGHT) * 100,
  };
}

function clip(name: string, glass: Quad): SceneVideo {
  return {
    src: `./art/video/${name}.mp4?v=${CLIP_VERSION}`,
    poster: `./art/video/${name}-poster.jpg?v=${CLIP_VERSION}`,
    width: WIDTH,
    height: HEIGHT,
    playbackRate: 0.75,
    glass,
    screen: boundsOf(glass),
  };
}

/**
 * Each glass was read off a zoomed grid of the frame and checked at the start, middle, and end of the loop, so it holds while the camera drifts.
 * The main monitor is the one the character faces.
 */
export const HOME_VIDEO = clip("home", [
  [72, 490],
  [255, 479],
  [255, 680],
  [71, 682],
]);

/** Every startup-style job, agencies and young product companies too: small team, plants, a client wall. */
const STARTUP_VIDEO = clip("startup", [
  [204, 642],
  [248, 585],
  [248, 688],
  [204, 786],
]);

/** An established product company. The right-hand monitor of the two, the one he's reading. */
const PRODUCT_VIDEO = clip("product", [
  [337, 743],
  [418, 714],
  [418, 800],
  [337, 832],
]);

const ENTERPRISE_VIDEO = clip("enterprise", [
  [241, 806],
  [268, 754],
  [268, 862],
  [241, 928],
]);

const REMOTE_VIDEO = clip("remote", [
  [190, 592],
  [357, 530],
  [356, 640],
  [191, 734],
]);

/** The office matches the working style in the top bar. Big companies come in two offices. */
export function videoFor(company: Company | null): SceneVideo {
  if (!company) return HOME_VIDEO;
  switch (workplaceOf(company)) {
    case "startup":
      return STARTUP_VIDEO;
    case "remote":
      return REMOTE_VIDEO;
    case "big":
      return company.type === "product" ? PRODUCT_VIDEO : ENTERPRISE_VIDEO;
  }
}
