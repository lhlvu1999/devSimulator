import { useState } from "react";
import { puzzleForDay } from "../content/puzzles";
import {
  applyDisruption,
  codeTimerSeconds,
  disruptionFor,
  finishCode,
  getDay,
  ignorePenaltySeconds,
  monthDay,
  requirementReason,
  resolveChoices,
  resolveScene,
  selectWork,
} from "../game/engine";
import type { Choice, GameState, Stats } from "../game/types";
import { CodeMinigame } from "./CodeMinigame";
import { Workstation } from "./Workstation";

export function WorkScreen({
  state,
  onChange,
}: {
  state: GameState;
  onChange: (next: GameState) => void;
}) {
  const title = state.phase === "code" ? "editor — ticket" : "calendar — today";
  if (state.phase === "code") {
    return <CodeScreen state={state} title={title} onChange={onChange} />;
  }
  return (
    <Workstation rig={state.rig} style={state.style} title={title}>
      <p className="puzzle-prompt">
        {state.codedToday
          ? "The editor is done. How do you leave it?"
          : resolveScene(getDay(state.day), state.flags)}
      </p>
      <ChoiceButtons state={state} onChange={onChange} />
    </Workstation>
  );
}

function CodeScreen({
  state,
  title,
  onChange,
}: {
  state: GameState;
  title: string;
  onChange: (next: GameState) => void;
}) {
  const ping = disruptionFor(state);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    codeTimerSeconds(state.style, state.rig),
  );
  const [penalty, setPenalty] = useState(0);
  const startupSkip =
    state.style === "startup" &&
    (monthDay(state.day) === 6 || monthDay(state.day) === 15);

  return (
    <Workstation
      rig={state.rig}
      style={state.style}
      title={title}
      timer={`${secondsLeft}s`}
    >
      {ping ? (
        <div className="ping" role="dialog" aria-label={ping.title}>
          <p className="ping-title">{ping.title}</p>
          <p>{ping.body}</p>
          <div className="ping-actions">
            <button
              type="button"
              className="screen-action"
              onClick={() => {
                setPenalty(ignorePenaltySeconds(state.rig));
                onChange(applyDisruption(state, "ignore"));
              }}
            >
              Ignore
            </button>
            <button
              type="button"
              className="screen-action"
              onClick={() => onChange(applyDisruption(state, "join"))}
            >
              Answer
            </button>
          </div>
        </div>
      ) : null}
      <p className="puzzle-prompt">
        {startupSkip
          ? "You skip the room and open the editor."
          : resolveScene(getDay(state.day), state.flags)}
      </p>
      <CodeMinigame
        puzzle={puzzleForDay(state.day)}
        seconds={codeTimerSeconds(state.style, state.rig)}
        paused={Boolean(ping)}
        penaltySeconds={penalty}
        onTick={setSecondsLeft}
        onGrade={(grade) => onChange(finishCode(state, grade))}
      />
    </Workstation>
  );
}

function ChoiceButtons({
  state,
  onChange,
}: {
  state: GameState;
  onChange: (next: GameState) => void;
}) {
  const choices = resolveChoices(getDay(state.day), state.flags);
  return (
    <div className="choices in-screen">
      {choices.map((choice) => (
        <ScreenChoice
          key={choice.id}
          choice={choice}
          stats={state.stats}
          onPick={() => onChange(selectWork(state, choice.id))}
        />
      ))}
    </div>
  );
}

function ScreenChoice({
  choice,
  stats,
  onPick,
}: {
  choice: Choice;
  stats: Stats;
  onPick: () => void;
}) {
  const reason = requirementReason(stats, choice.requires);
  return (
    <button
      type="button"
      className={reason ? "choice blocked" : "choice"}
      aria-disabled={reason ? true : undefined}
      onClick={() => {
        if (!reason) onPick();
      }}
    >
      <span>{choice.label}</span>
      {choice.detail ? <small>{choice.detail}</small> : null}
      {reason ? <small>{reason}</small> : null}
    </button>
  );
}
