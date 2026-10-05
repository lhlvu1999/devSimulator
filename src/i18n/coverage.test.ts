import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { COMPANIES } from "../content/companies";
import { STOCKS } from "../game/market";
import { lookup } from "./index";
import { SKIPPED_FILES, findText, type Found } from "./scan";
import { VI_CONTENT } from "./vi/content";
import { VI_GAME } from "./vi/game";
import { VI_POOLS } from "./vi/pools";
import { VI_UI } from "./vi/ui";

/** Names stay as they are in every language: companies, stocks, and the people in talks and the feed. */
const NAMES = new Set<string>([
  ...COMPANIES.map((company) => company.name),
  ...STOCKS.map((stock) => stock.name),
  ...["Jun", "Morgan", "Sam", "Ari", "Priya", "Leo", "Mai", "Tom"],
  ...["Priya N.", "Tom W.", "Mai L.", "Leo K.", "Jun P.", "Ari S.", "Morgan B.", "Sam O."],
  ...["Riley C.", "Noah F.", "Elena V.", "Chris D.", "Hana Y.", "Omar J.", "Zoe M.", "Ben R."],
  "Tiếng Việt",
  "English",
]);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory())
      return name === "i18n" ? [] : sourceFiles(path);
    if (!/\.tsx?$/.test(name) || /\.test\.tsx?$/.test(name)) return [];
    return SKIPPED_FILES.includes(path) ? [] : [path];
  });
}



describe("Vietnamese coverage", () => {
  it("gives each English key one meaning across the dictionary files", () => {
    const files = { VI_UI, VI_GAME, VI_CONTENT, VI_POOLS };
    const seen = new Map<string, { file: string; text: string }>();
    const clashes: string[] = [];
    for (const [file, dict] of Object.entries(files)) {
      for (const [key, text] of Object.entries(dict)) {
        const before = seen.get(key);
        if (before && before.text !== text)
          clashes.push(`${key}: ${before.file} "${before.text}" vs ${file} "${text}"`);
        seen.set(key, { file, text });
      }
    }
    expect(clashes).toEqual([]);
  });
  it("has a translation for every player-facing string in the game", () => {
    const missing: Found[] = [];
    for (const file of sourceFiles("src")) {
      for (const item of findText(file, readFileSync(file, "utf8"))) {
        const text = item.text.replace(/^JSX: /, "");
        if (item.text.startsWith("JSX: ")) {
          missing.push(item);
          continue;
        }
                if (NAMES.has(text)) continue;
        const key = item.context ? `${text}|${item.context}` : text;
        if (lookup(key, "vi") === null) missing.push(item);
      }
    }
    if (process.env.I18N_REPORT) {
      writeFileSync(
        process.env.I18N_REPORT,
        JSON.stringify([...new Set(missing.map((item) => item.text))], null, 1),
      );
    }
    expect(
      missing
        .slice(0, 40)
        .map((item) => `${item.file}:${item.line} ${item.text}`),
    ).toEqual([]);
  });
});
