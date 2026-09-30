import type { Difficulty } from "./difficulty";
import { INBOX_POOL } from "./pools/inboxMessages";
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

const POOL: readonly InboxMessage[] = INBOX_POOL.map((message) => ({
  id: message.id,
  from: message.from,
  text: message.text,
  lane: message.lane,
}));

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
