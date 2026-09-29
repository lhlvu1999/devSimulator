import type { CompanyType } from "./companies";
import type { DeviceId, LookId } from "./gear";

export type ScenePlace =
  CompanyType | "interview" | "home" | "loft" | "cabin" | "campus";

export const SCENE_PLACES: ScenePlace[] = [
  "home",
  "remote",
  "startup",
  "product",
  "agency",
  "enterprise",
  "interview",
  "loft",
  "cabin",
  "campus",
];

/**
 * Paint order for the room. Device and character are inserted after desk.
 * There is no chair. The cat is its own layer. Greenery paints in front.
 */
export const ENVIRONMENT_LAYERS = [
  "wall",
  "window",
  "shelf",
  "floor",
  "cat",
  "lamp",
  "plants",
  "desk",
  "greenery",
] as const;

export const CHARACTER_LAYERS = ["body", "head", "hair", "shirt"] as const;

/** The screen is drawn by the game. These are the frame around it. */
export const DEVICE_LAYERS = ["stand", "bezel", "keyboard"] as const;

export type EnvironmentLayer = (typeof ENVIRONMENT_LAYERS)[number];
export type CharacterLayer = (typeof CHARACTER_LAYERS)[number];
export type DeviceLayer = (typeof DEVICE_LAYERS)[number];

export function environmentArt(
  place: ScenePlace,
  layer: EnvironmentLayer,
): string {
  return `/art/environment/${place}/${layer}.png`;
}

export function characterArt(look: LookId, layer: CharacterLayer): string {
  return `/art/character/${look}/${layer}.png`;
}

export function deviceArt(device: DeviceId, layer: DeviceLayer): string {
  return `/art/device/${device}/${layer}.png`;
}

export function iconArt(stat: string): string {
  return `/art/icons/${stat}.png`;
}
