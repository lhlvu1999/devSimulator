export type FillPuzzle = {
  kind: "fill";
  prompt: string;
  /** □ marks one missing character, in order. */
  code: string;
  answers: string[];
};

export type SpotPuzzle = {
  kind: "spot";
  prompt: string;
  tokens: { text: string; bug?: boolean }[];
};

export type TracePuzzle = {
  kind: "trace";
  prompt: string;
  code: string;
  options: string[];
  answer: number;
};

export type Puzzle = FillPuzzle | SpotPuzzle | TracePuzzle;

const PUZZLES: Record<number, Puzzle> = {
  2: {
    kind: "fill",
    prompt:
      "The setup script dies on the home path. Fill the missing characters.",
    code: 'const root = process.en□.HOME ?? "/tm□"',
    answers: ["v", "p"],
  },
  4: {
    kind: "fill",
    prompt: "The button ticket is vague. The class name is not. Finish it.",
    code: 'button.classLis□.add("primar□")',
    answers: ["t", "y"],
  },
  6: {
    kind: "fill",
    prompt:
      "You skipped the meeting. The on-call check still needs a character.",
    code: "return day % 7 ==□ 0",
    answers: ["="],
  },
  7: {
    kind: "spot",
    prompt: "This retry never retries. Click the broken token.",
    tokens: [
      { text: "if" },
      { text: " (" },
      { text: "status" },
      { text: " =", bug: true },
      { text: ' "error"' },
      { text: ") " },
      { text: "retry" },
      { text: "()" },
    ],
  },
  8: {
    kind: "trace",
    prompt: "Staging or not? What does flag(1) return?",
    code: 'function flag(n) {\n  return n > 2 ? "page" : "quiet"\n}',
    options: ["page", "quiet", "undefined"],
    answer: 1,
  },
  9: {
    kind: "spot",
    prompt: "The review found a real bug. Click it.",
    tokens: [
      { text: "users" },
      { text: ".filter" },
      { text: "((user) => " },
      { text: "user.active" },
      { text: " =", bug: true },
      { text: " true)" },
    ],
  },
  11: {
    kind: "trace",
    prompt: "Production is climbing. What does clamp(14) return?",
    code: "function clamp(n) {\n  if (n < 0) return 0\n  if (n > 10) return 10\n  return n\n}",
    options: ["14", "10", "0"],
    answer: 1,
  },
  12: {
    kind: "fill",
    prompt: "The branch is close. Two characters and it slices.",
    code: "return items.sli□e(0, limi□)",
    answers: ["c", "t"],
  },
  14: {
    kind: "fill",
    prompt: "An easy ticket. Your eyes are the hard part.",
    code: 'console.lo□(ready ? "shi□" : "wait")',
    answers: ["g", "p"],
  },
  15: {
    kind: "spot",
    prompt: "The demo check is lying. Click the broken token.",
    tokens: [
      { text: "if" },
      { text: " (ready" },
      { text: " ==", bug: true },
      { text: " true)" },
      { text: " showDemo" },
      { text: "()" },
    ],
  },
  18: {
    kind: "trace",
    prompt: "What does left(10) return when the day was eight hours?",
    code: "function left(hours) {\n  return Math.max(0, 8 - hours)\n}",
    options: ["-2", "0", "8"],
    answer: 1,
  },
  22: {
    kind: "fill",
    prompt: "The ownerless ticket needs a guard. Fill the missing characters.",
    code: "if (owner == n□ll) retu□n unassigned",
    answers: ["u", "r"],
  },
  24: {
    kind: "spot",
    prompt:
      "Ari's short path assigns when it should compare. Click the broken token.",
    tokens: [
      { text: "if" },
      { text: " (flag" },
      { text: " =", bug: true },
      { text: " true)" },
      { text: " ship" },
      { text: "()" },
    ],
  },
  26: {
    kind: "fill",
    prompt: "Skip the meeting. Finish the contract check.",
    code: 'return api.versio□ === □2"',
    answers: ["n", '"'],
  },
  27: {
    kind: "trace",
    prompt: "Production is yours. What does rolledBack(true) return?",
    code: 'function rolledBack(flag) {\n  return flag ? "safe" : "live"\n}',
    options: ["safe", "live", "undefined"],
    answer: 0,
  },
  28: {
    kind: "spot",
    prompt: "The third path sneaks in through a default. Click it.",
    tokens: [
      { text: "switch" },
      { text: " (path) {\n" },
      { text: "default", bug: true },
      { text: ": " },
      { text: "shipAll" },
      { text: "()" },
    ],
  },
  29: {
    kind: "trace",
    prompt: "What does waiting(0) return while the other team has not merged?",
    code: 'function waiting(merges) {\n  if (merges > 0) return "go"\n  return "hold"\n}',
    options: ["go", "hold", "0"],
    answer: 1,
  },
  31: {
    kind: "fill",
    prompt: "Ari's function does three jobs. Finish the smaller one.",
    code: "return items.filt□r((item) => item.rea□y)",
    answers: ["e", "d"],
  },
  32: {
    kind: "trace",
    prompt: "If Ari lands it, what does handedOff(true) return?",
    code: 'function handedOff(ari) {\n  return ari ? "team" : "you"\n}',
    options: ["you", "team", "false"],
    answer: 1,
  },
  34: {
    kind: "fill",
    prompt: "One easy ticket. Two characters.",
    code: 'console.debu□(done ? "sto□" : "more")',
    answers: ["g", "p"],
  },
  35: {
    kind: "spot",
    prompt: "The demo hides the unfinished edge. Click the broken token.",
    tokens: [
      { text: "if" },
      { text: " (ready" },
      { text: " ||", bug: true },
      { text: " true)" },
      { text: " showDemo" },
      { text: "()" },
    ],
  },
  38: {
    kind: "trace",
    prompt: "What does cut(3, 5) return when you keep the boundary?",
    code: "function cut(done, asked) {\n  return Math.min(done, asked)\n}",
    options: ["5", "3", "8"],
    answer: 1,
  },
};

export function puzzleForDay(day: number): Puzzle {
  if (PUZZLES[day]) return PUZZLES[day];
  const today = ((day - 1) % 20) + 1;
  return PUZZLES[today] ?? PUZZLES[4];
}

export function splitFill(
  code: string,
): Array<{ kind: "text"; text: string } | { kind: "blank"; index: number }> {
  const chunks = code.split("□");
  const parts: Array<
    { kind: "text"; text: string } | { kind: "blank"; index: number }
  > = [];
  let blank = 0;
  chunks.forEach((text, index) => {
    if (text) parts.push({ kind: "text", text });
    if (index < chunks.length - 1) {
      parts.push({ kind: "blank", index: blank });
      blank += 1;
    }
  });
  return parts;
}
