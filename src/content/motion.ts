import type { EnvironmentLayer, ScenePlace } from "./entities";

/** Layers that may have a PNG frame sequence. The rest of the room stays still. */
export const MOTION_LAYERS = [
  "window",
  "cat",
  "lamp",
  "plants",
  "greenery",
] as const;

export type MotionLayer = (typeof MOTION_LAYERS)[number];

export function isMotionLayer(layer: EnvironmentLayer): layer is MotionLayer {
  return (MOTION_LAYERS as readonly string[]).includes(layer);
}

/** Starting speeds from the motion guide. Layers do not share a clock. */
export const MOTION_TIMING: Record<
  MotionLayer,
  { frames: number; duration: number; start: number }
> = {
  window: { frames: 6, duration: 420, start: 1 },
  greenery: { frames: 6, duration: 480, start: 2 },
  plants: { frames: 6, duration: 600, start: 3 },
  cat: { frames: 6, duration: 780, start: 1 },
  lamp: { frames: 4, duration: 1200, start: 1 },
};

export function motionFrameName(frame: number): string {
  return String(frame).padStart(2, "0");
}

export function environmentMotion(
  place: ScenePlace,
  layer: MotionLayer,
  frame: number,
): string {
  return `/art/environment/${place}/motion/${layer}/${motionFrameName(frame)}.png`;
}
