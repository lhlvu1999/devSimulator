import type { Box } from "./sceneLayout";

/** A looping clip used as the whole room, with the monitor glass marked so the game can sit on it. */
export type SceneVideo = {
  src: string;
  poster: string;
  width: number;
  height: number;
  /** 1 is normal speed. Lower is calmer. */
  playbackRate: number;
  /** The monitor glass, in percent of the video frame. */
  screen: Box;
};

/** Bump when the clip file changes so browsers and the iOS web view fetch the new one. */
const CLIP_VERSION = "2";

/** Home desk clip. The glass was measured from the solid dark screen across frames, so it holds while the camera drifts. */
export const HOME_VIDEO: SceneVideo = {
  src: `./art/video/home.mp4?v=${CLIP_VERSION}`,
  poster: `./art/video/home-poster.jpg?v=${CLIP_VERSION}`,
  width: 720,
  height: 1280,
  playbackRate: 0.75,
  screen: { left: 10.2, top: 37.6, width: 24.6, height: 15.4 },
};
