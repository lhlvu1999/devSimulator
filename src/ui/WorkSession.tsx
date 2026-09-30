import { useState } from "react";
import { deviceById } from "../content/gear";
import {
  careerStatus,
  
  failReview,
  passReview,
  reviewGames,
  workTicket,
  type CareerState,
} from "../game/career";
import { DIFFICULTY_REWARD, type Difficulty } from "../game/difficulty";
import { dealInbox } from "../game/inbox";
import { dealOneOnOne, dealRoadmap, dealSprint } from "../game/manage";
import { dealShip } from "../game/ship";
import { dealSpot } from "../game/spot";
import { dealTicket } from "../game/tidy";
import type { CodeGrade } from "../game/types";
import { dealWires } from "../game/wires";
import { WORK_GAME_LABEL, pickGame, type WorkGame } from "../game/workGames";
import { WorkBoard } from "./WorkBoard";
import { moodSeconds } from "../game/life";
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
  const [reviewing, setReviewing] = useState(false);
  const [news, setNews] = useState<string[] | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const device = deviceById(state.deviceId);
  
  const status = careerStatus(state);
  const active = state.board.tickets.find((ticket) => ticket.key === activeKey) ?? null;

  if (reviewing) {
    return (
      <ReviewSession
        state={state}
        seed={state.ticketSeed}
        onDone={(passed, nextSeed) => {
          const next = passed ? passReview(state) : failReview(state);
          onChange({ ...next, ticketSeed: nextSeed });
          if (passed) setNews(next.log);
          setReviewing(false);
        }}
      />
    );
  }

  if (active) {
    return (
      <div className="screen">
        <div className="ticket-play-head">
          <span className="ticket-key">{active.key}</span>
          <strong>{active.title}</strong>
          <small>
            {active.parts > 1 ? `Part ${active.partsDone + 1} of ${active.parts} · ` : ""}
            {active.partHours}h · {device.name}
            {device.timeBonus > 0 ? ` +${device.timeBonus}s` : ""}
          </small>
        </div>
        <TicketFor
          key={`${state.ticketSeed}-${active.key}-${active.partsDone}`}
          game={active.game}
          seed={state.ticketSeed}
                    difficulty={active.difficulty}
          relationship={state.stats.relationship}
          bonus={device.timeBonus + moodSeconds(state.stats.mood)}
          onDone={(grade, left, nextSeed) => {
                        const timePay =
              grade === "clear" ? Math.floor((left / 2) * DIFFICULTY_REWARD[active.difficulty]) : 0;
            const next = workTicket(state, active.key, grade, timePay, nextSeed);
            onChange(next);
            setNotes(next.log);
            setActiveKey(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="screen">
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
              ? "You tried this week. The review opens again next week."
              : `Clear ${REVIEW_ROUNDS} harder tickets in a row. A miss ends the review.`}
          </span>
          {status.triedToday ? null : (
            <button type="button" onClick={() => setReviewing(true)}>
              Start review
            </button>
          )}
        </div>
      ) : null}
      <WorkBoard
        state={state}
        notes={notes}
        onStart={(key) => {
          setNotes([]);
          setActiveKey(key);
        }}
        onFinish={onFinish}
      />
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
          opens again next week.
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
        bonus={device.timeBonus + moodSeconds(state.stats.mood)}
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
