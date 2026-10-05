import { VI_CONTENT } from "./content";
import { VI_GAME } from "./game";
import { VI_POOLS, VI_POOL_PATTERNS } from "./pools";
import { VI_UI } from "./ui";

/** Looks up a smaller piece of a generated sentence: its translation, or null if unknown. */
export type Translate = (part: string) => string | null;
export type Pattern = readonly [
  RegExp,
  (match: RegExpMatchArray, translate: Translate) => string | null,
];

/** Vietnamese, keyed by the English text. Split by area so each file can be reviewed on its own. */
export const VI: Readonly<Record<string, string>> = {
  ...VI_UI,
  ...VI_GAME,
  ...VI_CONTENT,
  ...VI_POOLS,
};

export const VI_PATTERNS: readonly Pattern[] = VI_POOL_PATTERNS;
