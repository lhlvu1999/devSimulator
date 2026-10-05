import { useEffect, useRef, useState } from "react";
import { formatMoney } from "../game/format";
import { fresherProfile, type PlacementOutcome } from "../game/placement";
import {
  emptyBoard,
  newbieMove,
  winner,
  winningLine,
  type Board,
  type Mark,
} from "../game/tictactoe";
import { t } from "../i18n";
import { IntroSteps } from "./Intro";
import "./intro.css";

const NAMES = [
  "Top left",
  "Top",
  "Top right",
  "Left",
  "Center",
  "Right",
  "Bottom left",
  "Bottom",
  "Bottom right",
];

/** How many moves a win took, and the fresher level it earns. */
const TIERS = [
  { label: "High fresher", rule: "Win in 3" },
  { label: "Mid fresher", rule: "Win in 4" },
  { label: "Low fresher", rule: "Anything else" },
] as const;

/** What the interviewer says as the game goes. */
function interviewerLine(
  finished: PlacementOutcome | null,
  moves: number,
): string {
  if (finished === "win")
    return moves <= 3
      ? t('That was fast. I\'m writing "sharp" on your form.')
      : t("Nicely done. I'll pass your name along.");
  if (finished === "draw") return t("A draw. Solid, but I've seen sharper.");
  if (finished === "loss")
    return t("Got you this time. Everyone starts somewhere.");
  if (moves === 0)
    return t(
      "Hi! A quick warm-up before we talk jobs. You're X, so you go first.",
    );
  if (moves === 1) return t("Interesting opening.");
  if (moves === 2) return t("Hmm. Let me think about that one.");
  return t("Still anyone's game.");
}

export function Placement({
  onDone,
}: {
  onDone: (outcome: PlacementOutcome, moves: number) => void;
}) {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [seed, setSeed] = useState(0x71c7ac);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState<PlacementOutcome | null>(null);
  const line = winningLine(board);

  function play(index: number) {
    if (finished || board[index]) return;
    const next = board.slice();
    next[index] = "X";
    const playerMoves = moves + 1;
    const playerResult = winner(next);
    if (playerResult) {
      setBoard(next);
      setMoves(playerMoves);
      setFinished(playerResult === "X" ? "win" : "draw");
      return;
    }
    const ai = newbieMove(next, seed);
    if (ai.index >= 0) next[ai.index] = "O";
    const afterAi = winner(next);
    setBoard(next);
    setSeed(ai.rngState);
    setMoves(playerMoves);
    if (afterAi === "O") setFinished("loss");
    else if (afterAi === "draw") setFinished("draw");
  }

  return (
    <section className="screen entry-test">
      <IntroSteps step={1} />
      <p className="kicker">{t("Job fair")}</p>
      <h1>{t("Entry test")}</h1>
      <p className="prose">
        {t(
          "Beat the interviewer at tic-tac-toe. The faster you win, the higher your fresher level, and the better your first offers.",
        )}
      </p>

      <div className="interviewer">
        <span className="interviewer-face" aria-hidden="true">
          M
        </span>
        <div>
          <strong>{t("Mai, tech lead")}</strong>
          <p className="interviewer-says" aria-live="polite">
            {interviewerLine(finished, moves)}
          </p>
        </div>
      </div>

      <div className="ttt" role="grid" aria-label={t("Tic-tac-toe")}>
        {board.map((cell, index) => (
          <button
            key={NAMES[index]}
            type="button"
            className={`ttt-cell${line?.includes(index) ? " in-line" : ""}`}
            aria-label={
              cell
                ? t("{place}: {mark}", {
                    place: t(NAMES[index] ?? ""),
                    mark: cell,
                  })
                : t(NAMES[index] ?? "")
            }
            data-mark={cell ?? undefined}
            disabled={Boolean(finished) || cell !== null}
            onClick={() => play(index)}
          >
            {cell ? <MarkArt mark={cell} /> : null}
          </button>
        ))}
      </div>

      {finished ? (
        <PlacementResult outcome={finished} moves={moves} onDone={onDone} />
      ) : (
        <ul className="ttt-tiers" aria-label={t("Fresher levels")}>
          {TIERS.map((tier) => (
            <li key={tier.label}>
              <b>{t(tier.rule)}</b>
              {t(tier.label)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Hand-drawn marks that draw themselves in. */
function MarkArt({ mark }: { mark: Mark }) {
  return mark === "X" ? (
    <svg className="mark mark-x" viewBox="0 0 40 40" aria-hidden="true">
      <path d="M10 10 30 30" />
      <path d="M30 10 10 30" />
    </svg>
  ) : (
    <svg className="mark mark-o" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="11" />
    </svg>
  );
}

function PlacementResult({
  outcome,
  moves,
  onDone,
}: {
  outcome: PlacementOutcome;
  moves: number;
  onDone: (outcome: PlacementOutcome, moves: number) => void;
}) {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    card.current?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }, []);
  const profile = fresherProfile(outcome, moves);
  const rank =
    profile.label === "High fresher"
      ? 3
      : profile.label === "Mid fresher"
        ? 2
        : 1;
  return (
    <div ref={card} className={`entry-result rank-${rank}`} role="status">
      <div className="entry-result-head">
        <span className="entry-rank" aria-hidden="true">
          {[1, 2, 3].map((dot) => (
            <i key={dot} className={dot <= rank ? "on" : ""} />
          ))}
        </span>
        <strong>{t(profile.label)}</strong>
      </div>
      <p>{profile.blurb}</p>
      <p className="entry-start">
        {t(
          "You start with {money}, skill {skill}, and reputation {reputation}.",
          {
            money: formatMoney(profile.stats.money),
            skill: profile.stats.skill,
            reputation: profile.stats.reputation,
          },
        )}
      </p>
      <button
        type="button"
        className="primary"
        onClick={() => onDone(outcome, moves)}
      >
        {t("Next: choose your goal")}
      </button>
    </div>
  );
}
