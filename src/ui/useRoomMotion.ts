import { useEffect, useState } from "react";
import {
  MOTION_LAYERS,
  MOTION_TIMING,
  type MotionLayer,
} from "../content/motion";

export type RoomFrames = Record<MotionLayer, number>;

function stillFrames(): RoomFrames {
  return { window: 1, cat: 1, lamp: 1, plants: 1, greenery: 1 };
}

function startingFrames(): RoomFrames {
  return {
    window: MOTION_TIMING.window.start,
    greenery: MOTION_TIMING.greenery.start,
    plants: MOTION_TIMING.plants.start,
    cat: MOTION_TIMING.cat.start,
    lamp: MOTION_TIMING.lamp.start,
  };
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Each ambient layer advances on its own timer. Reduced motion keeps frame 01, except the cat. */
export function useRoomMotion(): RoomFrames {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  const [frames, setFrames] = useState<RoomFrames>(startingFrames);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const timers = MOTION_LAYERS.filter(
      (layer) => !(reduced && layer !== "cat"),
    ).map((layer) => {
      const timing = MOTION_TIMING[layer];
      return window.setInterval(() => {
        setFrames((current) => ({
          ...current,
          [layer]: (current[layer] % timing.frames) + 1,
        }));
      }, timing.duration);
    });
    return () => {
      for (const timer of timers) window.clearInterval(timer);
    };
  }, [reduced]);

  if (!reduced) return frames;
  return { ...stillFrames(), cat: frames.cat };
}
