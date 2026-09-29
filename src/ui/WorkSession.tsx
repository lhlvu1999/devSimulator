import { useState } from "react";
import { deviceById } from "../content/gear";
import {
  careerStatus,
  difficultyFor,
  failReview,
  passReview,
  recordWork,
  reviewGames,
  ticketEnergyCost,
  type CareerState,
} from "../game/career";
import type { Difficulty } from "../game/difficulty";
import { dealInbox } from "../game/inbox";
import { picksOwnWork } from "../game/ladder";
import { dealOneOnOne, dealRoadmap, dealSprint } from "../game/manage";
import { dealShip } from "../game/ship";
import { dealSpot } from "../game/spot";
import { dealTicket } from "../game/tidy";
import type { CodeGrade } from "../game/types";
import { dealWires } from "../game/wires";
import { WORK_GAME_LABEL, pickGame, type WorkGame } from "../game/workGames";
import { InboxTicket } from "./InboxTicket";
import { OneOnOneTicket, RoadmapTicket, SprintTicket } from "./ManageTickets";
import { ShipTicket } from "./ShipTicket";
import { SpotTicket } from "./SpotTicket";
import { TidyTicket } from "./TidyTicket";
import { WiresTicket } from "./WiresTicket";

const REVIEW_ROUNDS = 3;

export function WorkSession({
  state,
  onChange,
  onFinish,
}: {
  state: CareerState;
  onChange: (next: CareerState) => void;
  onFinish: () => void;
}) {
  const seed = state.ticketSeed;
  const [streak, setStreak] = useState(0);
  const [leaves, setLeaves] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [news, setNews] = useState<string[] | null>(null);
  const [chosen, setChosen] = useState<WorkGame | null>(null);
  const device = deviceById(state.deviceId);
  const difficulty = difficultyFor(state);
  const energyCost = ticketEnergyCost(state);
  const canStart = state.stats.energy >= energyCost;
  const status = careerStatus(state);
  const choosing = picksOwnWork(state.level);
  const random = pickGame(seed, state.company?.type, status.games);
  const game = choosing ? chosen : random.game;
  const dealSeed = choosing ? seed : random.rngState;

  function finishTicket(
    game: WorkGame,
    grade: CodeGrade,
    left: number,
    nextSeed: number,
  ) {
    const nextStreak = grade === "clear" ? streak + 1 : 0;
    const grew = nextStreak > 0 && nextStreak % 3 === 0;
    const timePay = grade === "clear" ? Math.floor(left / 2) : 0;
    const tip = grew ? 12 : 0;
    onChange({
      ...recordWork(state, grade, timePay + tip, game),
      ticketSeed: nextSeed,
    });
    setStreak(nextStreak);
    if (grew) setLeaves((count) => count + 1);
    setChosen(null);
  }

  if (reviewing) {
    return (
      <ReviewSession
        state={state}
        seed={seed}
        onDone={(passed, nextSeed) => {
          const next = passed ? passReview(state) : failReview(state);
          onChange({ ...next, ticketSeed: nextSeed });
          if (passed) setNews(next.log);
          setReviewing(false);
        }}
      />
    );
  }

  return (
    <div className="screen">
      <div className="tidy-session">
        <span className="work-title">{status.title}</span>
        <span>Streak {streak}</span>
        {leaves > 0 ? <span className="tidy-leaf">{leaves} leaves</span> : null}
        <span>
          {device.name}
          {device.timeBonus > 0 ? ` +${device.timeBonus}s` : ""}
        </span>
      </div>
      {news ? (
        <div className="review-banner promoted">
          <strong>Promoted</strong>
          {news.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <button type="button" onClick={() => setNews(null)}>
            Nice
          </button>
        </div>
      ) : null}
      {status.ready ? (
        <div className={`review-banner${status.triedToday ? " waiting" : ""}`}>
          <strong>Promotion review · {status.nextTitle}</strong>
          <span>
            {status.triedToday
              ? "You tried today. The review opens again tomorrow."
              : `Clear ${REVIEW_ROUNDS} harder tickets in a row. A miss ends the review.`}
          </span>
          {status.triedToday ? null : (
            <button type="button" onClick={() => setReviewing(true)}>
              Start review
            </button>
          )}
        </div>
      ) : null}
      {!canStart ? (
        <p className="ask">
          You need {energyCost} energy for another ticket. Finish the day, or
          grab something from the pantry.
        </p>
      ) : game ? (
        <TicketFor
          key={`${seed}-${game}`}
          game={game}
          seed={dealSeed}
          difficulty={difficulty}
          relationship={state.stats.relationship}
          bonus={device.timeBonus}
          onDone={(grade, left, nextSeed) =>
            finishTicket(game, grade, left, nextSeed)
          }
        />
      ) : (
        <TaskPicker state={state} energyCost={energyCost} onPick={setChosen} />
      )}
      <button type="button" className="primary" onClick={onFinish}>
        Finish work
      </button>
    </div>
  );
}

const GAME_BLURB: Record<WorkGame, string> = {
  tidy: "Fix a tiny screen to match a note.",
  spot: "Find what changed from the design.",
  wires: "Turn tiles until the button reaches the server.",
  ship: "Release inside the green window, three times.",
  inbox: "Send each message to now or later.",
  oneonone: "Listen to a teammate and pick the reply that fits.",
  sprint: "Fill the sprint to exactly what the team can carry.",
  roadmap: "Put each feature in now, next, or later.",
};

function TaskPicker({
  state,
  energyCost,
  onPick,
}: {
  state: CareerState;
  energyCost: number;
  onPick: (game: WorkGame) => void;
}) {
  const status = careerStatus(state);
  const needed = new Map(status.items.map((item) => [item.id, item]));
  return (
    <div className="task-picker">
      <p className="ask">
        Pick your next task. Each one costs {energyCost} energy.
      </p>
      {status.games.map((game) => {
        const goal = needed.get(game);
        return (
          <button
            key={game}
            type="button"
            className={`task-choice game-${game}`}
            onClick={() => onPick(game)}
          >
            <strong>{WORK_GAME_LABEL[game]}</strong>
            <small>{GAME_BLURB[game]}</small>
            {goal ? (
              <span
                className={
                  goal.have >= goal.need ? "task-goal met" : "task-goal"
                }
              >
                {Math.min(goal.have, goal.need)}/{goal.need} toward{" "}
                {status.nextTitle}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function ReviewSession({
  state,
  seed: startSeed,
  onDone,
}: {
  state: CareerState;
  seed: number;
  onDone: (passed: boolean, nextSeed: number) => void;
}) {
  const [round, setRound] = useState(0);
  const [seed, setSeed] = useState(startSeed);
  const [failed, setFailed] = useState(false);
  const status = careerStatus(state);
  const device = deviceById(state.deviceId);
  const difficulty: Difficulty = state.level === "fresher" ? "normal" : "hard";
  const picked = pickGame(seed, state.company?.type, reviewGames(state));

  if (failed) {
    return (
      <div className="screen review-screen">
        <p className="kicker">Promotion review</p>
        <h2>Not this time</h2>
        <p className="ask">
          The panel liked your work but wants to see a little more. The review
          opens again tomorrow.
        </p>
        <button
          type="button"
          className="primary"
          onClick={() => onDone(false, seed)}
        >
          Back to work
        </button>
      </div>
    );
  }

  return (
    <div className="screen review-screen">
      <div className="review-head">
        <p className="kicker">Promotion review · {status.nextTitle}</p>
        <div
          className="ship-lights"
          aria-label={`Round ${round + 1} of ${REVIEW_ROUNDS}`}
        >
          {Array.from({ length: REVIEW_ROUNDS }, (_, index) => (
            <span key={index} className={index < round ? "on" : ""} />
          ))}
        </div>
      </div>
      <p className="ask">
        Round {round + 1} of {REVIEW_ROUNDS}: {WORK_GAME_LABEL[picked.game]}.
      </p>
      <TicketFor
        key={seed}
        game={picked.game}
        seed={picked.rngState}
        difficulty={difficulty}
        relationship={Math.min(state.stats.relationship, 39)}
        bonus={device.timeBonus}
        onDone={(grade, _left, nextSeed) => {
          if (grade === "miss") {
            setSeed(nextSeed);
            setFailed(true);
            return;
          }
          if (round + 1 >= REVIEW_ROUNDS) {
            onDone(true, nextSeed);
            return;
          }
          setRound((value) => value + 1);
          setSeed(nextSeed);
        }}
      />
    </div>
  );
}

export function TicketFor({
  game,
  seed,
  difficulty,
  relationship,
  bonus,
  onDone,
}: {
  game: WorkGame;
  seed: number;
  difficulty: Difficulty;
  relationship: number;
  bonus: number;
  onDone: (grade: CodeGrade, left: number, nextSeed: number) => void;
}) {
  const shared = { difficulty, bonus };
  if (game === "spot") {
    const dealt = dealSpot(seed, difficulty, relationship);
    return (
      <SpotTicket
        {...shared}
        puzzle={dealt.puzzle}
        onDone={(grade, left) => onDone(grade, left, dealt.rngState)}
      />
    );
  }
  if (game === "wires") {
    const dealt = dealWires(seed, difficulty, relationship);
    return (
      <WiresTicket
        {...shared}
        puzzle={dealt.puzzle}
        onDone={(grade, left) => onDone(grade, left, dealt.rngState)}
      />
    );
  }
  if (game === "ship") {
    const dealt = dealShip(seed, difficulty, relationship);
    return (
      <ShipTicket
        {...shared}
        puzzle={dealt.puzzle}
        onDone={(grade, left) => onDone(grade, left, dealt.rngState)}
      />
    );
  }
  if (game === "inbox") {
    const dealt = dealInbox(seed, difficulty, relationship);
    return (
      <InboxTicket
        {...shared}
        puzzle={dealt.puzzle}
        onDone={(grade, left) => onDone(grade, left, dealt.rngState)}
      />
    );
  }
  if (game === "oneonone") {
    const dealt = dealOneOnOne(seed, difficulty, relationship);
    return (
      <OneOnOneTicket
        {...shared}
        puzzle={dealt.puzzle}
        onDone={(grade, left) => onDone(grade, left, dealt.rngState)}
      />
    );
  }
  if (game === "sprint") {
    const dealt = dealSprint(seed, difficulty, relationship);
    return (
      <SprintTicket
        {...shared}
        puzzle={dealt.puzzle}
        onDone={(grade, left) => onDone(grade, left, dealt.rngState)}
      />
    );
  }
  if (game === "roadmap") {
    const dealt = dealRoadmap(seed, difficulty, relationship);
    return (
      <RoadmapTicket
        {...shared}
        puzzle={dealt.puzzle}
        onDone={(grade, left) => onDone(grade, left, dealt.rngState)}
      />
    );
  }
  const dealt = dealTicket(seed, difficulty, relationship);
  return (
    <TidyTicket
      {...shared}
      ticket={dealt.ticket}
      onDone={(grade, left) => onDone(grade, left, dealt.rngState)}
    />
  );
}
