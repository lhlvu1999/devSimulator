import type { CSSProperties } from "react";

export type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type SceneBoxes = Record<string, Box>;

/** Percent of the room. Dragging in the sandbox overwrites this in local storage. */
/** Percent of the room, traced from the side-view reference. */
export const DEFAULT_SCENE_BOXES: SceneBoxes = {
  wall: { left: 0, top: 0, width: 100, height: 100 },
  window: { left: 0, top: 0, width: 34, height: 58 },
  shelf: { left: 40, top: 8, width: 58, height: 28 },
  floor: { left: 0, top: 70, width: 100, height: 30 },
  lamp: { left: 32, top: 30, width: 18, height: 24 },
  plants: { left: 82, top: 24, width: 16, height: 30 },
  cat: { left: 76, top: 82, width: 16, height: 12 },
  desk: { left: 0, top: 50, width: 76, height: 46 },
  device: { left: 2, top: 36, width: 52, height: 34 },
  character: { left: 36, top: 32, width: 48, height: 44 },
  greenery: { left: 0, top: 52, width: 30, height: 36 },
};

export const LAYOUT_KEY = "dev-simulator-layout-v2";

export function boxStyle(box: Box): CSSProperties {
  return {
    left: `${box.left}%`,
    top: `${box.top}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
  };
}

export function loadSceneBoxes(): SceneBoxes {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (!raw) return { ...DEFAULT_SCENE_BOXES };
    const parsed = JSON.parse(raw) as SceneBoxes;
    return { ...DEFAULT_SCENE_BOXES, ...parsed };
  } catch {
    return { ...DEFAULT_SCENE_BOXES };
  }
}

export function roundBox(box: Box): Box {
  const round = (value: number) => Math.round(value * 10) / 10;
  return {
    left: round(box.left),
    top: round(box.top),
    width: round(Math.max(4, box.width)),
    height: round(Math.max(4, box.height)),
  };
}
