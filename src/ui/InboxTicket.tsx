import { useRef, useState, type PointerEvent } from "react";
import type { Difficulty } from "../game/difficulty";
import { INBOX_RULE, type InboxPuzzle, type Lane } from "../game/inbox";
import type { CodeGrade } from "../game/types";
import { gameSeconds } from "../game/workGames";
import { useTicketClock } from "./useTicketClock";
import { t } from "../i18n";

const SWIPE = 60;

export function InboxTicket({
  puzzle,
  difficulty,
  bonus,
  onDone,
}: {
  puzzle: InboxPuzzle;
  difficulty: Difficulty;
  bonus: number;
  onDone: (grade: CodeGrade, left: number, total: number) => void;
}) {
  const total = gameSeconds("inbox", difficulty, bonus);
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [wrong, setWrong] = useState(false);
  const origin = useRef<number | null>(null);
  const solved = index >= puzzle.messages.length;
  const { left, settled, penalize } = useTicketClock(total, solved, onDone);
  const message = puzzle.messages[index];

  function sort(lane: Lane) {
    if (settled || !message) return;
    if (message.lane === lane) {
      setIndex((value) => value + 1);
      return;
    }
    penalize();
    setWrong(true);
    window.setTimeout(() => setWrong(false), 350);
  }

  function down(event: PointerEvent) {
    origin.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function move(event: PointerEvent) {
    if (origin.current == null) return;
    setDrag(event.clientX - origin.current);
  }

  function up() {
    const distance = drag;
    origin.current = null;
    setDrag(0);
    if (distance > SWIPE) sort("now");
    else if (distance < -SWIPE) sort("later");
  }

  return (
    <div className={`tidy inbox${settled ? " settled" : ""}`}>
      <div className="tidy-meta">
        <span>{left}s</span>
        <span>
                    {t("Sort the inbox")} · {Math.min(index, puzzle.messages.length)}/{puzzle.messages.length}
        </span>
      </div>
            <p className="ask">{t(INBOX_RULE)}</p>
      <div className="inbox-stack">
        <span className="inbox-lane later">{t("← Later")}</span>
        {message ? (
          <div
            className={`inbox-card${wrong ? " wiggle" : ""}${
              drag > SWIPE ? " to-now" : drag < -SWIPE ? " to-later" : ""
            }`}
            style={{
              transform: `translateX(${drag}px) rotate(${drag / 18}deg)`,
            }}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
          >
                        <span className="inbox-from">{t(message.from)}</span>
            <strong>{t(message.text)}</strong>
            {puzzle.hint && index === 0 ? (
              <span className="inbox-hint">
                                {message.lane === "now"
                  ? t("Teammate: this one is urgent.")
                  : t("Teammate: this one is not urgent.")}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="inbox-card empty">{t("Inbox zero.")}</div>
        )}
        <span className="inbox-lane now">{t("Now →")}</span>
      </div>
      <div className="market-trade">
        <button type="button" disabled={settled} onClick={() => sort("later")}>
          {t("Later")}</button>
        <button type="button" disabled={settled} onClick={() => sort("now")}>
          {t("Now")}</button>
      </div>
      {settled ? (
        <div className="tidy-payoff" aria-hidden="true">
          <span className="tidy-check" />
          <span className="tidy-coin" />
        </div>
      ) : null}
    </div>
  );
}
