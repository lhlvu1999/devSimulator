import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { splitFill, type Puzzle } from "../content/puzzles";
import { gradeFill, gradeTimed } from "../game/engine";
import type { CodeGrade } from "../game/types";

export function CodeMinigame({
  puzzle,
  seconds,
  paused,
  penaltySeconds,
  onGrade,
  onTick,
}: {
  puzzle: Puzzle;
  seconds: number;
  paused: boolean;
  penaltySeconds: number;
  onGrade: (grade: CodeGrade) => void;
  onTick: (secondsLeft: number) => void;
}) {
  const [remaining, setRemaining] = useState(seconds * 1000);
  const [answers, setAnswers] = useState<string[]>(
    puzzle.kind === "fill" ? puzzle.answers.map(() => "") : [],
  );
  const graded = useRef(false);
  const remainingRef = useRef(remaining);
  remainingRef.current = remaining;

  useEffect(() => {
    onTick(Math.ceil(remaining / 1000));
  }, [onTick, remaining]);

  const appliedPenalty = useRef(0);

  useEffect(() => {
    if (penaltySeconds <= appliedPenalty.current) return;
    const delta = penaltySeconds - appliedPenalty.current;
    appliedPenalty.current = penaltySeconds;
    setRemaining((current) => Math.max(0, current - delta * 1000));
  }, [penaltySeconds]);

  function finish(correct: boolean, ms: number) {
    if (graded.current) return;
    graded.current = true;
    onGrade(gradeTimed(correct, ms));
  }

  useEffect(() => {
    if (paused || graded.current) return;
    const id = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 200));
    }, 200);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    if (paused || remaining > 0 || graded.current) return;
    const correct =
      puzzle.kind === "fill" ? gradeFill(puzzle.answers, answers) : false;
    finish(correct, 0);
  }, [answers, paused, puzzle, remaining]);

  if (puzzle.kind === "fill") {
    const parts = splitFill(puzzle.code);
    return (
      <form
        className="puzzle"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          finish(gradeFill(puzzle.answers, answers), remainingRef.current);
        }}
      >
        <p className="puzzle-prompt">{puzzle.prompt}</p>
        <p className="code-line">
          {parts.map((part, index) =>
            part.kind === "text" ? (
              <span key={`${part.text}-${index}`}>{part.text}</span>
            ) : (
              <input
                key={`blank-${part.index}`}
                className="blank"
                aria-label={`Missing character ${part.index + 1}`}
                maxLength={1}
                value={answers[part.index] ?? ""}
                onChange={(event) => {
                  const next = [...answers];
                  next[part.index] = event.target.value.slice(-1);
                  setAnswers(next);
                }}
              />
            ),
          )}
        </p>
        <button type="submit" className="screen-action">
          Check the code
        </button>
      </form>
    );
  }

  if (puzzle.kind === "spot") {
    return (
      <div className="puzzle">
        <p className="puzzle-prompt">{puzzle.prompt}</p>
        <p className="code-line">
          {puzzle.tokens.map((token, index) => (
            <button
              key={`${token.text}-${index}`}
              type="button"
              className="token"
              onClick={() => finish(Boolean(token.bug), remainingRef.current)}
            >
              {token.text}
            </button>
          ))}
        </p>
      </div>
    );
  }

  return (
    <div className="puzzle">
      <p className="puzzle-prompt">{puzzle.prompt}</p>
      <pre className="code-block">{puzzle.code}</pre>
      <div className="trace-options">
        {puzzle.options.map((option, index) => (
          <button
            key={option}
            type="button"
            className="screen-action"
            onClick={() =>
              finish(index === puzzle.answer, remainingRef.current)
            }
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
