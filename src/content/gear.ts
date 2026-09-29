export type DeviceId =
  | "laptop"
  | "air"
  | "monitor"
  | "rig"
  | "tablet"
  | "ultrawide"
  | "mini"
  | "loftbook"
  | "studio"
  | "glass";
export type LookId =
  | "plain"
  | "bun"
  | "curls"
  | "cap"
  | "navy"
  | "green"
  | "hoodie"
  | "sweater"
  | "cardigan"
  | "clip";

export type Device = {
  id: DeviceId;
  name: string;
  cost: number;
  timeBonus: number;
  blurb: string;
};

export type Look = {
  id: LookId;
  name: string;
  cost: number;
  hair: "short" | "bun" | "curls" | "cap";
  shirt: "rust" | "navy" | "green" | "black" | "cream";
};

export const DEVICES: Device[] = [
  {
    id: "laptop",
    name: "Starter laptop",
    cost: 0,
    timeBonus: 0,
    blurb: "Thick bezel. Tasks get the base time.",
  },
  {
    id: "air",
    name: "Thin laptop",
    cost: 450,
    timeBonus: 2,
    blurb: "Lighter glass. Every task gets 2 more seconds.",
  },
  {
    id: "monitor",
    name: "Desk monitor",
    cost: 900,
    timeBonus: 4,
    blurb: "The work sits on a bigger screen. 4 extra seconds.",
  },
  {
    id: "rig",
    name: "Home rig",
    cost: 1600,
    timeBonus: 6,
    blurb: "Wide glass in front of you. 6 extra seconds.",
  },
];

export const LOOKS: Look[] = [
  {
    id: "plain",
    name: "Short hair, rust shirt",
    cost: 0,
    hair: "short",
    shirt: "rust",
  },
  { id: "bun", name: "Bun, rust shirt", cost: 120, hair: "bun", shirt: "rust" },
  {
    id: "curls",
    name: "Curls, black shirt",
    cost: 160,
    hair: "curls",
    shirt: "black",
  },
  { id: "cap", name: "Cap, navy shirt", cost: 180, hair: "cap", shirt: "navy" },
  {
    id: "navy",
    name: "Short hair, navy shirt",
    cost: 80,
    hair: "short",
    shirt: "navy",
  },
  {
    id: "green",
    name: "Bun, green shirt",
    cost: 140,
    hair: "bun",
    shirt: "green",
  },
  {
    id: "hoodie",
    name: "Messy hair, sage hoodie",
    cost: 150,
    hair: "short",
    shirt: "green",
  },
  {
    id: "sweater",
    name: "Curls, cream sweater",
    cost: 160,
    hair: "curls",
    shirt: "cream",
  },
  {
    id: "cardigan",
    name: "Low bun, ink cardigan",
    cost: 200,
    hair: "bun",
    shirt: "black",
  },
  {
    id: "clip",
    name: "Clip, soft blue shirt",
    cost: 170,
    hair: "short",
    shirt: "navy",
  },
];

export const PREVIEW_DEVICES: Device[] = [
  ...DEVICES,
  {
    id: "tablet",
    name: "Tablet",
    cost: 700,
    timeBonus: 2,
    blurb: "A small folio. Pool piece.",
  },
  {
    id: "ultrawide",
    name: "Ultrawide",
    cost: 1200,
    timeBonus: 5,
    blurb: "One long screen. Pool piece.",
  },
  {
    id: "mini",
    name: "Side screen",
    cost: 300,
    timeBonus: 1,
    blurb: "A tiny extra glass. Pool piece.",
  },
  {
    id: "loftbook",
    name: "Loft laptop",
    cost: 520,
    timeBonus: 2,
    blurb: "Chunky keys. Pool piece.",
  },
  {
    id: "studio",
    name: "Studio rig",
    cost: 1800,
    timeBonus: 6,
    blurb: "Two screens on a wood stand. Pool piece.",
  },
  {
    id: "glass",
    name: "Thin monitor",
    cost: 1100,
    timeBonus: 4,
    blurb: "A pale thin frame. Pool piece.",
  },
];

export function deviceById(id: string): Device {
  return (
    PREVIEW_DEVICES.find((device) => device.id === id) ?? PREVIEW_DEVICES[0]
  );
}

export function lookById(id: string): Look {
  return LOOKS.find((look) => look.id === id) ?? LOOKS[0];
}
