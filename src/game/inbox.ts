import type { Difficulty } from "./difficulty";
import { shuffleWith } from "./workGames";

export type Lane = "now" | "later";

export type InboxMessage = {
  id: string;
  from: string;
  text: string;
  lane: Lane;
};

export type InboxPuzzle = { messages: InboxMessage[]; hint: boolean };

export const INBOX_RULE =
  "Now: anything that stops customers. Later: anything that can wait.";

const POOL: readonly InboxMessage[] = [
  { id: "pay", from: "Support", text: "Customers can't pay at checkout.", lane: "now" },
  { id: "open", from: "Support", text: "The app won't open on some phones.", lane: "now" },
  { id: "login", from: "Ops", text: "Nobody can log in right now.", lane: "now" },
  { id: "price", from: "Shop team", text: "The shop shows the wrong price.", lane: "now" },
  { id: "orders", from: "Sales", text: "New orders are not arriving.", lane: "now" },
  { id: "reset", from: "Support", text: "Password reset emails never arrive.", lane: "now" },
  { id: "charged", from: "Support", text: "A customer was charged twice.", lane: "now" },
  { id: "blank", from: "Ops", text: "The home page is completely blank.", lane: "now" },
  { id: "cart", from: "Shop team", text: "Carts empty themselves at random.", lane: "now" },
  { id: "search", from: "Support", text: "Search shows nothing for every word.", lane: "now" },
  { id: "leak", from: "Security", text: "Other people's orders are visible.", lane: "now" },
  { id: "signup", from: "Growth", text: "The sign-up button does nothing.", lane: "now" },
  { id: "refund", from: "Support", text: "Refunds are stuck for everyone.", lane: "now" },
  { id: "map", from: "Delivery", text: "Drivers can't see the delivery map.", lane: "now" },
  { id: "logo", from: "Design", text: "Could the logo be a little bigger?", lane: "later" },
  { id: "font", from: "Design", text: "Let's try a new font in the footer.", lane: "later" },
  { id: "menu", from: "Product", text: "Rename 'Settings' to 'Preferences'.", lane: "later" },
  { id: "dark", from: "Product", text: "Dark mode would be nice someday.", lane: "later" },
  { id: "lunch", from: "Team", text: "Who's in for team lunch Friday?", lane: "later" },
  { id: "photos", from: "Marketing", text: "Tidy the old photos in the folder.", lane: "later" },
  { id: "icons", from: "Design", text: "The icons could be a bit rounder.", lane: "later" },
  { id: "survey", from: "HR", text: "Please fill in the happiness survey.", lane: "later" },
  { id: "idea", from: "CEO", text: "Idea: what if the app had a mascot?", lane: "later" },
  { id: "docs", from: "Team", text: "The old docs could use a cleanup.", lane: "later" },
  { id: "emoji", from: "Marketing", text: "Add a party emoji to the welcome email.", lane: "later" },
  { id: "desk", from: "Office", text: "New desks arrive next month.", lane: "later" },
  { id: "color", from: "Design", text: "Maybe the footer should be green?", lane: "later" },
  { id: "badge", from: "Product", text: "Let's add a badge for 100 orders.", lane: "later" },
];

export function dealInbox(
  seed: number,
  difficulty: Difficulty,
  relationship: number,
): { puzzle: InboxPuzzle; rngState: number } {
  const count = difficulty === "easy" ? 4 : difficulty === "normal" ? 6 : 8;
  const urgent = shuffleWith(
    POOL.filter((message) => message.lane === "now"),
    seed,
  );
  const calm = shuffleWith(
    POOL.filter((message) => message.lane === "later"),
    urgent.rngState,
  );
  const half = Math.ceil(count / 2);
  const mixed = shuffleWith(
    [...urgent.items.slice(0, half), ...calm.items.slice(0, count - half)],
    calm.rngState,
  );
  return {
    puzzle: { messages: mixed.items, hint: relationship >= 40 },
    rngState: mixed.rngState,
  };
}
