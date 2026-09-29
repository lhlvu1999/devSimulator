import { useEffect, useRef, useState } from "react";
import type { WorkTask } from "../content/workPool";
import {
  taskSeconds,
  teammateHelps,
  wrongTries,
  type Difficulty,
} from "../game/difficulty";
import type { CodeGrade } from "../game/types";
import { HintChip } from "./kit";

type Step = { id: string; label: string };

const STEP_SETS: Record<
  string,
  { ask: string; order: Step[]; decoys: Step[] }
> = {
  save: {
    ask: "When someone taps Save, keep their picnic and show a check.",
    order: [
      { id: "tap", label: "Someone taps Save" },
      { id: "keep", label: "Keep their picnic" },
      { id: "check", label: "Show a check" },
    ],
    decoys: [
      { id: "delete", label: "Throw the picnic away" },
      { id: "close", label: "Close the app" },
    ],
  },
  photo: {
    ask: "When someone taps the camera, take a picture and put it on the screen.",
    order: [
      { id: "tap", label: "Someone taps the camera" },
      { id: "take", label: "Take the picture" },
      { id: "show", label: "Put it on the screen" },
    ],
    decoys: [
      { id: "bin", label: "Delete the picture" },
      { id: "ask", label: "Ask for a password first" },
    ],
  },
};

export function FriendlyTask({
  task,
  difficulty,
  relationship,
  bonus,
  onGrade,
}: {
  task: WorkTask;
  difficulty: Difficulty;
  relationship: number;
  bonus: number;
  onGrade: (grade: CodeGrade) => void;
}) {
  const [left, setLeft] = useState(taskSeconds(difficulty, bonus));
  const hint = teammateHelps(relationship);
  const finished = useRef(false);
  const gradeRef = useRef(onGrade);
  gradeRef.current = onGrade;

  function finish(grade: CodeGrade) {
    if (finished.current) return;
    finished.current = true;
    gradeRef.current(grade);
  }

  useEffect(() => {
    if (finished.current) return;
    if (left <= 0) {
      finish("miss");
      return;
    }
    const id = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left]);

  return (
    <div className="screen">
      <div className="task-bar">
        <strong>{task.label}</strong>
        <span className="timer">{left}s</span>
      </div>
      {hint ? (
        <HintChip>A teammate points at the first right piece.</HintChip>
      ) : null}
      {task.kind === "glitch" ? (
        <GlitchTask
          scene={task.scene}
          difficulty={difficulty}
          hint={hint}
          onGrade={finish}
        />
      ) : null}
      {task.kind === "steps" ? (
        <StepsTask
          scene={task.scene}
          difficulty={difficulty}
          hint={hint}
          onGrade={finish}
        />
      ) : null}
      {task.kind === "request" ? (
        <RequestTask
          scene={task.scene}
          difficulty={difficulty}
          hint={hint}
          onGrade={finish}
        />
      ) : null}
    </div>
  );
}

function useStrikes(
  difficulty: Difficulty,
  onGrade: (grade: CodeGrade) => void,
) {
  const [strikes, setStrikes] = useState(0);
  const limit = wrongTries(difficulty);
  function miss() {
    const next = strikes + 1;
    setStrikes(next);
    if (next >= limit) onGrade("miss");
  }
  return { strikes, miss, limit };
}

function GlitchTask({
  scene,
  difficulty,
  hint,
  onGrade,
}: {
  scene: WorkTask["scene"];
  difficulty: Difficulty;
  hint: boolean;
  onGrade: (grade: CodeGrade) => void;
}) {
  const { miss } = useStrikes(difficulty, onGrade);
  const shop = scene === "shop";
  const target = shop
    ? difficulty === "easy"
      ? "lose"
      : difficulty === "hard"
        ? "closed"
        : "price"
    : difficulty === "easy"
      ? "break"
      : "photo";
  const ask = shop
    ? difficulty === "hard"
      ? "The shop is open and tickets are $12. Tap what is wrong."
      : difficulty === "easy"
        ? "Tap the button a customer should not press."
        : "The sign says tickets are $12. Tap what is wrong."
    : difficulty === "easy"
      ? "Tap the thing a customer should not see."
      : "The customer wants to see their picnic. Tap what is wrong.";

  function tap(id: string) {
    if (id === target) onGrade("clear");
    else miss();
  }

  return (
    <>
      <p className="ask">{ask}</p>
      <div className="fake-phone">
        <div className="fake-title">{shop ? "Ticket shop" : "Picnic"}</div>
        {shop ? (
          difficulty === "easy" ? (
            <button
              type="button"
              className={hint ? "danger hinted" : "danger"}
              onClick={() => tap("lose")}
            >
              Lose my ticket
            </button>
          ) : (
            <button
              type="button"
              className={hint ? "fake-price hinted" : "fake-price"}
              onClick={() => tap(difficulty === "hard" ? "closed" : "price")}
            >
              {difficulty === "hard" ? "Closed" : "FREE"}
            </button>
          )
        ) : (
          <button
            type="button"
            className={
              target === "photo"
                ? hint
                  ? "fake-photo empty hinted"
                  : "fake-photo empty"
                : "fake-photo"
            }
            onClick={() => tap("photo")}
          >
            {target === "photo" ? "No photo" : "Picnic"}
          </button>
        )}
        <div className="fake-actions">
          <button type="button" onClick={() => tap("home")}>
            Home
          </button>
          <button type="button" onClick={() => tap("save")}>
            {shop ? "Buy · $12" : "Save"}
          </button>
          {difficulty === "easy" && !shop ? (
            <button
              type="button"
              className={hint ? "danger hinted" : "danger"}
              onClick={() => tap("break")}
            >
              Break it
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}

function StepsTask({
  scene,
  difficulty,
  hint,
  onGrade,
}: {
  scene: WorkTask["scene"];
  difficulty: Difficulty;
  hint: boolean;
  onGrade: (grade: CodeGrade) => void;
}) {
  const set = STEP_SETS[scene] ?? STEP_SETS.save;
  if (!set) return null;
  const order = difficulty === "hard" ? set.order : set.order;
  const decoyCount =
    difficulty === "easy" ? 0 : difficulty === "normal" ? 1 : 2;
  const blocks = [...order, ...set.decoys.slice(0, decoyCount)];
  const { miss } = useStrikes(difficulty, onGrade);
  const [built, setBuilt] = useState<string[]>([]);
  const nextId = order[built.length]?.id;

  function tap(id: string) {
    if (built.includes(id)) return;
    if (id !== nextId) {
      miss();
      return;
    }
    const next = [...built, id];
    setBuilt(next);
    if (next.length === order.length) onGrade("clear");
  }

  return (
    <>
      <p className="ask">{set.ask}</p>
      <div className="built-row">
        {built.length === 0 ? (
          <span className="muted">Your steps land here.</span>
        ) : null}
        {built.map((id, index) => (
          <span key={id} className="step done">
            {index + 1}. {order.find((step) => step.id === id)?.label}
          </span>
        ))}
      </div>
      <div className="step-list">
        {blocks.map((step) => (
          <button
            key={step.id}
            type="button"
            className={
              hint && step.id === order[0]?.id && built.length === 0
                ? "step hinted"
                : "step"
            }
            disabled={built.includes(step.id)}
            onClick={() => tap(step.id)}
          >
            {step.label}
          </button>
        ))}
      </div>
    </>
  );
}

const COLORS = [
  { id: "blue", label: "Blue", swatch: "#3b82f6" },
  { id: "green", label: "Green", swatch: "#65a30d" },
  { id: "red", label: "Red", swatch: "#e11d48" },
  { id: "gray", label: "Gray", swatch: "#a8a29e" },
];

function RequestTask({
  scene,
  difficulty,
  hint,
  onGrade,
}: {
  scene: WorkTask["scene"];
  difficulty: Difficulty;
  hint: boolean;
  onGrade: (grade: CodeGrade) => void;
}) {
  const needsWord = scene === "both" || difficulty === "hard";
  const needsSize = difficulty !== "easy";
  const { miss } = useStrikes(difficulty, onGrade);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(
    difficulty === "easy" ? "big" : null,
  );
  const [word, setWord] = useState<string | null>(needsWord ? null : "Save");

  function check(next: {
    color: string | null;
    size: string | null;
    word: string | null;
  }) {
    const colorOk = next.color === "blue";
    const sizeOk = !needsSize || next.size === "big";
    const wordOk = !needsWord || next.word === "Save";
    if (
      next.color &&
      colorOk &&
      sizeOk &&
      wordOk &&
      (!needsSize || next.size) &&
      (!needsWord || next.word)
    ) {
      onGrade("clear");
      return;
    }
    const pickedSomethingWrong =
      (next.color && next.color !== "blue") ||
      (needsSize && next.size && next.size !== "big") ||
      (needsWord && next.word && next.word !== "Save");
    if (
      pickedSomethingWrong &&
      next.color &&
      (!needsSize || next.size) &&
      (!needsWord || next.word)
    ) {
      miss();
    }
  }

  const ask = needsWord
    ? "They asked for a big blue button that says Save."
    : needsSize
      ? "They asked for a big blue button."
      : "They asked for a blue button.";

  return (
    <>
      <div className="speech">{ask}</div>
      <div
        className="preview-button"
        style={{
          background:
            COLORS.find((item) => item.id === color)?.swatch ?? "#e7e5e4",
          transform: size === "big" ? "scale(1.08)" : undefined,
        }}
      >
        {word ?? "Button"}
      </div>
      <div className="swatches">
        {COLORS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              hint && item.id === "blue" && !color ? "swatch hinted" : "swatch"
            }
            style={{ background: item.swatch }}
            aria-label={item.label}
            onClick={() => {
              const next = { color: item.id, size, word };
              setColor(item.id);
              check(next);
            }}
          />
        ))}
      </div>
      {needsSize ? (
        <div className="choice-row">
          {["small", "big"].map((item) => (
            <button
              key={item}
              type="button"
              className={size === item ? "step on" : "step"}
              onClick={() => {
                const next = { color, size: item, word };
                setSize(item);
                check(next);
              }}
            >
              {item === "big" ? "Big" : "Small"}
            </button>
          ))}
        </div>
      ) : null}
      {needsWord ? (
        <div className="choice-row">
          {["Save", "Delete", "Picnic"].map((item) => (
            <button
              key={item}
              type="button"
              className={word === item ? "step on" : "step"}
              onClick={() => {
                const next = { color, size, word: item };
                setWord(item);
                check(next);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
