import type { Difficulty } from "./difficulty";
import { nextUnit } from "./rng";

export type ShipZone = { start: number; width: number };

export type ShipPuzzle = {
  zones: ShipZone[];
  /** Full sweeps across the bar per second. */
  speed: number;
};

/** Three releases in a row. Each safe window is a little narrower than the last. */
export function dealShip(
  seed: number,
  difficulty: Difficulty,
  relationship: number,
): { puzzle: ShipPuzzle; rngState: number } {
  const base = difficulty === "easy" ? 26 : difficulty === "normal" ? 20 : 15;
  const help = relationship >= 40 ? 6 : 0;
  const speed =
    difficulty === "easy" ? 0.55 : difficulty === "normal" ? 0.75 : 0.95;
  let rngState = seed;
  const zones: ShipZone[] = [];
  let width = base + help;
  for (let index = 0; index < 3; index += 1) {
    const roll = nextUnit(rngState);
    rngState = roll.rngState;
    const start = 6 + roll.value * (88 - width);
    zones.push({
      start: Math.round(start * 10) / 10,
      width: Math.round(width * 10) / 10,
    });
    width *= 0.82;
  }
  return { puzzle: { zones, speed }, rngState };
}

/** Where the marker is, 0 to 100, bouncing end to end. */
export function markerAt(elapsedMs: number, speed: number): number {
  const phase = (elapsedMs / 1000) * speed * 2;
  const bounce = phase % 2;
  return (bounce <= 1 ? bounce : 2 - bounce) * 100;
}

export function inZone(position: number, zone: ShipZone): boolean {
  return position >= zone.start && position <= zone.start + zone.width;
}
