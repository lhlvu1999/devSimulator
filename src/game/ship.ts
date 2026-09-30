import type { Difficulty } from "./difficulty";
import { nextUnit } from "./rng";

export type ShipZone = { start: number; width: number };

export type ShipPuzzle = {
  zones: ShipZone[];
  /** Full sweeps across the bar per second. */
  speed: number;
};

/** Twenty timing profiles — picked from the seed so ship-it runs feel distinct. */
const SHIP_PROFILES: readonly {
  speedScale: number;
  widthScale: number;
  shrink: number;
}[] = [
  { speedScale: 0.92, widthScale: 1.08, shrink: 0.84 },
  { speedScale: 1.0, widthScale: 1.0, shrink: 0.82 },
  { speedScale: 0.88, widthScale: 1.12, shrink: 0.8 },
  { speedScale: 1.05, widthScale: 0.95, shrink: 0.85 },
  { speedScale: 0.95, widthScale: 1.05, shrink: 0.83 },
  { speedScale: 1.08, widthScale: 0.9, shrink: 0.81 },
  { speedScale: 0.9, widthScale: 1.1, shrink: 0.86 },
  { speedScale: 1.02, widthScale: 0.98, shrink: 0.82 },
  { speedScale: 0.86, widthScale: 1.14, shrink: 0.79 },
  { speedScale: 1.1, widthScale: 0.88, shrink: 0.87 },
  { speedScale: 0.94, widthScale: 1.06, shrink: 0.835 },
  { speedScale: 1.03, widthScale: 0.97, shrink: 0.825 },
  { speedScale: 0.89, widthScale: 1.11, shrink: 0.805 },
  { speedScale: 1.06, widthScale: 0.93, shrink: 0.845 },
  { speedScale: 0.97, widthScale: 1.04, shrink: 0.815 },
  { speedScale: 1.07, widthScale: 0.91, shrink: 0.795 },
  { speedScale: 0.91, widthScale: 1.09, shrink: 0.855 },
  { speedScale: 1.01, widthScale: 0.99, shrink: 0.828 },
  { speedScale: 0.87, widthScale: 1.13, shrink: 0.785 },
  { speedScale: 1.09, widthScale: 0.89, shrink: 0.865 },
];

/** Several releases in a row. Each safe window is a little narrower than the last. */
export function dealShip(
  seed: number,
  difficulty: Difficulty,
  relationship: number,
): { puzzle: ShipPuzzle; rngState: number } {
  let rngState = seed;
  const profileRoll = nextUnit(rngState);
  rngState = profileRoll.rngState;
  const profile =
    SHIP_PROFILES[Math.floor(profileRoll.value * SHIP_PROFILES.length)] ??
    SHIP_PROFILES[0];
  const base = difficulty === "easy" ? 26 : difficulty === "normal" ? 20 : 15;
  const help = relationship >= 40 ? 6 : 0;
  const baseSpeed =
    difficulty === "easy" ? 0.55 : difficulty === "normal" ? 0.75 : 0.95;
  const speed = baseSpeed * (profile?.speedScale ?? 1);
  const releases = difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 4;
  const zones: ShipZone[] = [];
  let width = (base + help) * (profile?.widthScale ?? 1);
  for (let index = 0; index < releases; index += 1) {
    const roll = nextUnit(rngState);
    rngState = roll.rngState;
    const start = 6 + roll.value * (88 - width);
    zones.push({
      start: Math.round(start * 10) / 10,
      width: Math.round(width * 10) / 10,
    });
    width *= profile?.shrink ?? 0.82;
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
