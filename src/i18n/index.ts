import { useSyncExternalStore } from "react";
import { VI, VI_PATTERNS } from "./vi";

/**
 * Translation keyed by the English text. English needs no dictionary;
 * other languages look the sentence up, then try patterns for generated
 * text like "Urgent: <message>", then fall back to English.
 *
 * Placeholders use braces: t("{company} wants to talk.", { company: name }).
 */

export type Lang = "en" | "vi";
export type Params = Record<string, string | number>;

export const LANGS: readonly { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "vi", label: "Tiếng Việt" },
];

const LANG_KEY = "dev-simulator-lang";

function detect(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "vi") return saved;
  } catch {
    // Storage blocked: fall through to the device language.
  }
  const device =
    typeof navigator === "undefined"
      ? ""
      : (navigator.languages?.[0] ?? navigator.language ?? "");
  return device.toLowerCase().startsWith("vi") ? "vi" : "en";
}

let current: Lang = detect();
const listeners = new Set<() => void>();

export function getLang(): Lang {
  return current;
}

export function setLang(next: Lang): void {
  if (next === current) return;
  current = next;
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {
    // The choice lasts for this session only.
  }
  if (typeof document !== "undefined") document.documentElement.lang = next;
  for (const listener of listeners) listener();
}

/** Re-renders the caller when the language changes. */
export function useLang(): Lang {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getLang,
    getLang,
  );
}

function fill(text: string, params?: Params): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in params ? String(params[name]) : whole,
  );
}

/** Strings with no translation yet, collected while playing in another language. */
export const missing = new Set<string>();

/** The text in the dictionary or a pattern, or null if neither knows it. */
export function lookup(text: string, lang: Lang = current): string | null {
  if (lang === "en") return text;
  const exact = VI[text];
  if (exact !== undefined) return exact;
  for (const [pattern, build] of VI_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
            const built = build(match, (part) => lookup(part, lang));
      if (built !== null) return built;
    }
  }
  return null;
}

export function t(text: string, params?: Params): string {
  if (current === "en" || text === "") return fill(text, params);
  const found = lookup(text);
  if (found === null) {
    missing.add(text);
    return fill(text, params);
  }
  return fill(found, params);
}

/**
 * A word that means different things in different places, like Blackjack's "Stand"
 * and a museum stand. Looks up "text|context" first; English shows the plain text.
 */
export function tc(context: string, text: string, params?: Params): string {
  if (current !== "en") {
    const found = lookup(`${text}|${context}`);
    if (found !== null) return fill(found, params);
  }
  return t(text, params);
}

/** English plural for a count. Languages without plurals map both forms to one. */
export function tn(
  count: number,
  one: string,
  many: string,
  params?: Params,
): string {
  return t(count === 1 ? one : many, { n: count, ...params });
}

if (typeof document !== "undefined") document.documentElement.lang = current;
