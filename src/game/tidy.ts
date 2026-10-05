import type { CodeGrade } from "./types";
import type { Difficulty } from "./difficulty";
import { EXTRA_TIDY_SCENES } from "./pools/tidyScenesExtra";
import { nextUnit } from "./rng";
import { t } from "../i18n";
export type TidyGoal = "remove" | "place" | "color";
export type Swatch = "cream" | "sage" | "clay" | "blue";

export type TidyPiece = {
  id: string;
  label: string;
  kind: "keep" | "wrong" | "decoy";
};

export type Ticket = {
  scene: string;
  note: string;
  goals: TidyGoal[];
  pieces: TidyPiece[];
  loose: { id: string; label: string } | null;
  slotLabel: string;
  paint: { label: string; start: Swatch; want: Swatch } | null;
  hint: "wrong" | "loose" | "swatch" | null;
};

const SWATCHES: Swatch[] = ["cream", "sage", "clay", "blue"];

/** Everyday names for the palette, so the note reads like normal words. */
export const SWATCH_LABEL: Record<Swatch, string> = {
  cream: "white",
  sage: "green",
  clay: "orange",
  blue: "blue",
};

type SceneDef = {
  keep: TidyPiece[];
  wrong: TidyPiece;
  decoy: TidyPiece;
  loose: { id: string; label: string };
  slotLabel: string;
  paintLabel: string;
  removeNote: string;
  placeNote: string;
  colorNote: (want: Swatch) => string;
};

const BASE_SCENES: Record<string, SceneDef> = {
  picnic: {
    keep: [
      { id: "basket", label: "Basket", kind: "keep" },
      { id: "sandwich", label: "Sandwich", kind: "keep" },
    ],
    wrong: { id: "ant", label: "Ant", kind: "wrong" },
    decoy: { id: "ball", label: "Ball", kind: "decoy" },
    loose: { id: "napkin", label: "Napkin" },
    slotLabel: "Empty spot",
    paintLabel: "Cloth",
    removeNote: "Take the ant off the blanket.",
    placeNote: "Put the napkin on the empty spot.",
    colorNote: (want) => `Make the cloth ${SWATCH_LABEL[want]}.`,
  },
  shop: {
    keep: [
      { id: "popcorn", label: "Popcorn", kind: "keep" },
      { id: "map", label: "Map", kind: "keep" },
    ],
    wrong: { id: "sign", label: "Wrong sign", kind: "wrong" },
    decoy: { id: "cup", label: "Cup", kind: "decoy" },
    loose: { id: "ticket", label: "Ticket" },
    slotLabel: "Window",
    paintLabel: "Tag",
    removeNote: "Take down the wrong sign.",
    placeNote: "Put the ticket in the window.",
    colorNote: (want) => `Make the tag ${SWATCH_LABEL[want]}.`,
  },
  photo: {
    keep: [
      { id: "frame", label: "Frame", kind: "keep" },
      { id: "lens", label: "Lens", kind: "keep" },
    ],
    wrong: { id: "trash", label: "Trash", kind: "wrong" },
    decoy: { id: "cord", label: "Cord", kind: "decoy" },
    loose: { id: "photo", label: "Photo" },
    slotLabel: "Open frame",
    paintLabel: "Button",
    removeNote: "Take the trash out of the picture.",
    placeNote: "Put the photo in the frame.",
    colorNote: (want) => `Make the button ${SWATCH_LABEL[want]}.`,
  },
  music: {
    keep: [
      { id: "play", label: "Play", kind: "keep" },
      { id: "song", label: "Song title", kind: "keep" },
    ],
    wrong: { id: "static", label: "Static noise", kind: "wrong" },
    decoy: { id: "volume", label: "Volume", kind: "decoy" },
    loose: { id: "cover", label: "Album cover" },
    slotLabel: "Cover spot",
    paintLabel: "Player",
    removeNote: "Remove the static noise.",
    placeNote: "Put the album cover in its spot.",
    colorNote: (want) => `Make the player ${SWATCH_LABEL[want]}.`,
  },
  weather: {
    keep: [
      { id: "sun", label: "Sun", kind: "keep" },
      { id: "temp", label: "24°", kind: "keep" },
    ],
    wrong: { id: "snowman", label: "Snowman in July", kind: "wrong" },
    decoy: { id: "cloud", label: "Cloud", kind: "decoy" },
    loose: { id: "umbrella", label: "Umbrella tip" },
    slotLabel: "Tip box",
    paintLabel: "Sky",
    removeNote: "Remove the snowman. It's July.",
    placeNote: "Put the umbrella tip in the tip box.",
    colorNote: (want) => `Make the sky ${SWATCH_LABEL[want]}.`,
  },
  pet: {
    keep: [
      { id: "dog", label: "Dog photo", kind: "keep" },
      { id: "adopt", label: "Adopt", kind: "keep" },
    ],
    wrong: { id: "price", label: "Price: $0,00.0", kind: "wrong" },
    decoy: { id: "bone", label: "Bone", kind: "decoy" },
    loose: { id: "name", label: "Name tag" },
    slotLabel: "Collar",
    paintLabel: "Card",
    removeNote: "Remove the broken price.",
    placeNote: "Put the name tag on the collar.",
    colorNote: (want) => `Make the card ${SWATCH_LABEL[want]}.`,
  },
  recipe: {
    keep: [
      { id: "steps", label: "Steps", kind: "keep" },
      { id: "timer", label: "Timer", kind: "keep" },
    ],
    wrong: { id: "sock", label: "Sock", kind: "wrong" },
    decoy: { id: "spoon", label: "Spoon", kind: "decoy" },
    loose: { id: "dish", label: "Dish photo" },
    slotLabel: "Photo spot",
    paintLabel: "Header",
    removeNote: "Take the sock out of the ingredients.",
    placeNote: "Put the dish photo on top.",
    colorNote: (want) => `Make the header ${SWATCH_LABEL[want]}.`,
  },
  chat: {
    keep: [
      { id: "hello", label: "Hello!", kind: "keep" },
      { id: "send", label: "Send", kind: "keep" },
    ],
    wrong: { id: "dup", label: "Hello! Hello!", kind: "wrong" },
    decoy: { id: "emoji", label: "Smile", kind: "decoy" },
    loose: { id: "avatar", label: "Avatar" },
    slotLabel: "Profile circle",
    paintLabel: "Bubble",
    removeNote: "Remove the doubled message.",
    placeNote: "Put the avatar in the profile circle.",
    colorNote: (want) => `Make the bubble ${SWATCH_LABEL[want]}.`,
  },
  bank: {
    keep: [
      { id: "balance", label: "Balance", kind: "keep" },
      { id: "transfer", label: "Transfer", kind: "keep" },
    ],
    wrong: { id: "minus", label: "−$1,000,000", kind: "wrong" },
    decoy: { id: "coin", label: "Coin", kind: "decoy" },
    loose: { id: "card", label: "Bank card" },
    slotLabel: "Wallet",
    paintLabel: "Top bar",
    removeNote: "Remove the scary wrong balance.",
    placeNote: "Put the bank card in the wallet.",
    colorNote: (want) => `Make the top bar ${SWATCH_LABEL[want]}.`,
  },
  map: {
    keep: [
      { id: "pin", label: "Pin", kind: "keep" },
      { id: "route", label: "Route", kind: "keep" },
    ],
    wrong: { id: "ocean", label: "Road in the ocean", kind: "wrong" },
    decoy: { id: "tree", label: "Tree", kind: "decoy" },
    loose: { id: "home", label: "Home icon" },
    slotLabel: "Start point",
    paintLabel: "Route line",
    removeNote: "Remove the road in the ocean.",
    placeNote: "Put the home icon at the start point.",
    colorNote: (want) => `Make the route line ${SWATCH_LABEL[want]}.`,
  },
};

const SCENES: Record<string, SceneDef> = {
  ...BASE_SCENES,
  ...EXTRA_TIDY_SCENES,
};

export type TidyScene = keyof typeof SCENES;

function pull(seed: number): { rngState: number; value: number } {
  return nextUnit(seed);
}

function shuffle<T>(
  items: readonly T[],
  seed: number,
): { items: T[]; rngState: number } {
  const next = [...items];
  let rngState = seed;
  for (let index = next.length - 1; index > 0; index -= 1) {
    const rolled = pull(rngState);
    rngState = rolled.rngState;
    const swap = Math.floor(rolled.value * (index + 1));
    const current = next[index];
    next[index] = next[swap] as T;
    next[swap] = current as T;
  }
  return { items: next, rngState };
}

export function gradeFor(left: number, total: number): CodeGrade {
  if (left <= 0) return "miss";
  if (left * 2 >= total) return "clear";
  return "late";
}

export function dealTicket(
  seed: number,
  difficulty: Difficulty,
  relationship: number,
): { ticket: Ticket; rngState: number } {
  const sceneRoll = pull(seed);
  const scenes = Object.keys(SCENES) as TidyScene[];
  const sceneId =
    scenes[Math.floor(sceneRoll.value * scenes.length)] ?? "picnic";
  const scene = SCENES[sceneId];
  const goalCount = difficulty === "easy" ? 1 : difficulty === "normal" ? 2 : 3;
  const mixed = shuffle(
    ["remove", "place", "color"] as const,
    sceneRoll.rngState,
  );
  const goals = mixed.items.slice(0, goalCount);
  const colorRoll = pull(mixed.rngState);
  const startRoll = pull(colorRoll.rngState);
  const want =
    SWATCHES[Math.floor(colorRoll.value * SWATCHES.length)] ?? "sage";
  const start =
    SWATCHES.find(
      (_, index) =>
        index === Math.floor(startRoll.value * 3) && SWATCHES[index] !== want,
    ) ??
    SWATCHES.find((swatch) => swatch !== want) ??
    "cream";
  const pieces = [...scene.keep];
  if (goals.includes("remove")) pieces.push(scene.wrong);
  if (difficulty === "hard" && relationship < 20) pieces.push(scene.decoy);
  const notes = [
    goals.includes("remove") ? scene.removeNote : "",
    goals.includes("place") ? scene.placeNote : "",
    goals.includes("color") ? scene.colorNote(want) : "",
  ].filter(Boolean);
  const first = goals[0];
  const hint =
    relationship >= 40
      ? first === "remove"
        ? "wrong"
        : first === "place"
          ? "loose"
          : "swatch"
      : null;
  return {
    rngState: startRoll.rngState,
    ticket: {
      scene: sceneId,
            note: notes.map((line) => t(line)).join(" "),
      goals,
      pieces,
      loose: goals.includes("place") ? scene.loose : null,
      slotLabel: scene.slotLabel,
      paint: goals.includes("color")
        ? { label: scene.paintLabel, start, want }
        : null,
      hint,
    },
  };
}

export function ticketSolved(
  ticket: Ticket,
  progress: { removed: boolean; placed: boolean; color: Swatch },
): boolean {
  if (ticket.goals.includes("remove") && !progress.removed) return false;
  if (ticket.goals.includes("place") && !progress.placed) return false;
  if (ticket.goals.includes("color") && progress.color !== ticket.paint?.want)
    return false;
  return true;
}
