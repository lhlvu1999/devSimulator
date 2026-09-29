import type { Stats } from "../game/types";

export type PantryId = "coffee" | "drink" | "vitamins" | "recovery";

export type PantryItem = {
  id: PantryId;
  name: string;
  cost: number;
  effects: Partial<Stats>;
  blurb: string;
};

/** Small things you buy and use right away. The drink is fast energy with a cost to your body. */
export const PANTRY: readonly PantryItem[] = [
  {
    id: "coffee",
    name: "Coffee",
    cost: 6,
    effects: { energy: 12 },
    blurb: "A small lift.",
  },
  {
    id: "drink",
    name: "Energy drink",
    cost: 18,
    effects: { energy: 35, health: -4 },
    blurb: "A big lift. Your body pays a little.",
  },
  {
    id: "vitamins",
    name: "Vitamins",
    cost: 30,
    effects: { health: 10 },
    blurb: "Slowly back to normal.",
  },
  {
    id: "recovery",
    name: "Recovery pill",
    cost: 70,
    effects: { health: 25, energy: 15 },
    blurb: "Feel like yourself again.",
  },
];

export function pantryById(id: string): PantryItem | undefined {
  return PANTRY.find((item) => item.id === id);
}
