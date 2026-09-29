import type { CompanyType } from "./companies";

/** Drop a file at `public` + path and it shows up. `null` means the painted room is used until art exists. */
export const ROOM_ART: Record<
  CompanyType | "interview" | "home",
  string | null
> = {
  home: "/art/rooms/home.png",
  remote: "/art/rooms/home.png",
  startup: "/art/rooms/home.png",
  product: "/art/rooms/home.png",
  agency: "/art/rooms/home.png",
  enterprise: "/art/rooms/home.png",
  interview: "/art/rooms/home.png",
};

export const ICON_ART: Record<string, string | null> = {
  money: "/art/icons/money.png",
  energy: "/art/icons/energy.png",
  mood: "/art/icons/mood.png",
  skill: "/art/icons/skill.png",
  reputation: "/art/icons/reputation.png",
  health: "/art/icons/health.png",
  relationship: "/art/icons/relationship.png",
};
