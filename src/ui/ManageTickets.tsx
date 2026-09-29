import { useState } from "react";
import type { Difficulty } from "../game/difficulty";
import {
  ROADMAP_RULE,
  slotFor,
  sprintSolved,
  type OneOnOnePuzzle,
  type RoadmapPuzzle,
  type Slot,
  type SprintPuzzle,
} from "../game/manage";
import type { CodeGrade } from "../game/types";
import { gameSeconds } from "../game/workGames";
import { useTicketClock } from "./useTicketClock";

type TicketProps<P> = {
  puzzle: P;
  difficulty: Difficulty;
  bonus: number;
  onDone: (grade: CodeGrade, left: number, total: number) => void;
};

function Payoff() {
  return (
    <div className="tidy-payoff" aria-hidden="true">
      <span className="tidy-check" />
      <span className="tidy-coin" />
    </div>
  );
}

export function OneOnOneTicket({
  puzzle,
  difficulty,
  bonus,
  onDone,
}: TicketProps<OneOnOnePuzzle>) {
  const total = gameSeconds("oneonone", difficulty, bonus);
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const solved = index >= puzzle.rounds.length;
  const { left, settled, penalize } = useTicketClock(total, solved, onDone);
  const round = puzzle.rounds[index];

  function reply(text: string, right: boolean) {
    if (settled) return;
    if (right) {
      setIndex((value) => value + 1);
      return;
    }
    penalize();
    setWrong(text);
    window.setTimeout(
      () => setWrong((current) => (current === text ? null : current)),
      350,
    );
  }

  return (
    <div className={`tidy oneonone${settled ? " settled" : ""}`}>
      <div className="tidy-meta">
        <span>{left}s</span>
        <span>
          One-on-one · {Math.min(index + 1, puzzle.rounds.length)}/
          {puzzle.rounds.length}
        </span>
      </div>
      <p className="ask">Pick the reply that fits how they feel.</p>
      {round ? (
        <>
          <div className="talk">
            <span className={`face mood-${round.mood}`} aria-hidden="true">
              <i />
              <i />
              <b />
            </span>
            <div className="bubble">
              <span className="talk-name">{round.name}</span>
              <strong>{round.says}</strong>
            </div>
          </div>
          <div className="reply-list">
            {round.replies.map((choice) => (
              <button
                key={choice.text}
                type="button"
                className={`reply${wrong === choice.text ? " wiggle" : ""}${
                  puzzle.hint && index === 0 && choice.right ? " hinted" : ""
                }`}
                onClick={() => reply(choice.text, choice.right)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="ask">Everyone feels heard.</p>
      )}
      {settled ? <Payoff /> : null}
    </div>
  );
}

export function SprintTicket({
  puzzle,
  difficulty,
  bonus,
  onDone,
}: TicketProps<SprintPuzzle>) {
  const total = gameSeconds("sprint", difficulty, bonus);
  const [picked, setPicked] = useState<string[]>(() =>
    puzzle.tasks.filter((task) => task.locked).map((task) => task.id),
  );
  const solved = sprintSolved(puzzle, picked);
  const { left, settled } = useTicketClock(total, solved, onDone);
  const used = puzzle.tasks
    .filter((task) => picked.includes(task.id))
    .reduce((sum, task) => sum + task.points, 0);
  const over = used > puzzle.capacity;
  const helped = puzzle.tasks.some((task) => task.locked);

  function toggle(id: string, locked: boolean) {
    if (settled || locked) return;
    setPicked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div className={`tidy sprint${settled ? " settled" : ""}`}>
      <div className="tidy-meta">
        <span>{left}s</span>
        <span>Sprint planning</span>
      </div>
      <p className="ask">
        Fill the sprint exactly to the team's capacity.
        {puzzle.tasks.some((task) => task.must)
          ? " The starred task must be in."
          : ""}
        {helped ? " A teammate already added one." : ""}
      </p>
      <div
        className={`capacity${over ? " over" : used === puzzle.capacity ? " full" : ""}`}
      >
        <div className="capacity-bar">
          {Array.from(
            { length: Math.max(puzzle.capacity, used) },
            (_, index) => (
              <span
                key={index}
                className={`${index < used ? "used" : ""}${index >= puzzle.capacity ? " spill" : ""}`}
              />
            ),
          )}
        </div>
        <span>
          {used} / {puzzle.capacity} points
        </span>
      </div>
      <div className="sprint-cards">
        {puzzle.tasks.map((task) => {
          const on = picked.includes(task.id);
          return (
            <button
              key={task.id}
              type="button"
              className={`sprint-card${on ? " on" : ""}${task.locked ? " locked" : ""}`}
              onClick={() => toggle(task.id, task.locked)}
            >
              <span className="sprint-name">
                {task.must ? "★ " : ""}
                {task.name}
              </span>
              <span className="sprint-points">
                {Array.from({ length: task.points }, (_, index) => (
                  <i key={index} />
                ))}
              </span>
            </button>
          );
        })}
      </div>
      {settled ? <Payoff /> : null}
    </div>
  );
}

const SLOT_LABEL: Record<Slot, string> = {
  now: "Now",
  next: "Next",
  later: "Later",
};

export function RoadmapTicket({
  puzzle,
  difficulty,
  bonus,
  onDone,
}: TicketProps<RoadmapPuzzle>) {
  const total = gameSeconds("roadmap", difficulty, bonus);
  const [placed, setPlaced] = useState<Record<string, Slot>>({});
  const [wrong, setWrong] = useState<Slot | null>(null);
  const index = Object.keys(placed).length;
  const feature = puzzle.features[index];
  const solved = index >= puzzle.features.length;
  const { left, settled, penalize } = useTicketClock(total, solved, onDone);

  function place(slot: Slot) {
    if (settled || !feature) return;
    if (slotFor(feature) === slot) {
      setPlaced((current) => ({ ...current, [feature.id]: slot }));
      return;
    }
    penalize();
    setWrong(slot);
    window.setTimeout(() => setWrong(null), 350);
  }

  return (
    <div className={`tidy roadmap${settled ? " settled" : ""}`}>
      <div className="tidy-meta">
        <span>{left}s</span>
        <span>
          Roadmap · {Math.min(index, puzzle.features.length)}/
          {puzzle.features.length}
        </span>
      </div>
      <p className="ask">{ROADMAP_RULE}</p>
      {feature ? (
        <div className="feature-card">
          <strong>{feature.name}</strong>
          <span className={`size impact-${feature.impact}`}>
            {feature.impact === "big" ? "Big" : "Small"} impact
          </span>
          <span className={`size effort-${feature.effort}`}>
            {feature.effort === "big" ? "Big" : "Small"} effort
          </span>
          {puzzle.hint && index === 0 ? (
            <span className="inbox-hint">
              Teammate: this goes in {SLOT_LABEL[slotFor(feature)]}.
            </span>
          ) : null}
        </div>
      ) : (
        <div className="feature-card">
          <strong>The roadmap is set.</strong>
        </div>
      )}
      <div className="roadmap-columns">
        {(["now", "next", "later"] as const).map((slot) => (
          <button
            key={slot}
            type="button"
            className={`roadmap-column slot-${slot}${wrong === slot ? " wiggle" : ""}`}
            disabled={settled}
            onClick={() => place(slot)}
          >
            <span className="roadmap-title">{SLOT_LABEL[slot]}</span>
            {puzzle.features
              .filter((item) => placed[item.id] === slot)
              .map((item) => (
                <span key={item.id} className="roadmap-chip">
                  {item.name}
                </span>
              ))}
          </button>
        ))}
      </div>
      {settled ? <Payoff /> : null}
    </div>
  );
}
