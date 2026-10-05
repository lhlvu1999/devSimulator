import { useState } from "react";
import type { Difficulty } from "../game/difficulty";
import { gameSeconds } from "../game/workGames";
import {
  SWATCH_LABEL,
  ticketSolved,
  type Swatch,
  type Ticket,
} from "../game/tidy";
import type { CodeGrade } from "../game/types";
import { useTicketClock } from "./useTicketClock";
import { t } from "../i18n";

/** A scene's everyday name: its key without the number pool scenes carry, like "office8". */
function sceneName(scene: string): string {
  return scene.replace(/\d+$/, "");
}

const SWATCHES: Swatch[] = ["cream", "sage", "clay", "blue"];

export function TidyTicket({
  ticket,
  difficulty,
  bonus,
  onDone,
}: {
  ticket: Ticket;
  difficulty: Difficulty;
  bonus: number;
  onDone: (grade: CodeGrade, left: number, total: number) => void;
}) {
  const total = gameSeconds("tidy", difficulty, bonus);
  const [removed, setRemoved] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [held, setHeld] = useState(false);
  const [color, setColor] = useState<Swatch>(ticket.paint?.start ?? "cream");
  const [wiggle, setWiggle] = useState<string | null>(null);

  const solved = ticketSolved(ticket, { removed, placed, color });
  const { left, settled, penalize } = useTicketClock(total, solved, onDone);

  function shake(id: string) {
    setWiggle(id);
    penalize();
    window.setTimeout(
      () => setWiggle((current) => (current === id ? null : current)),
      350,
    );
  }

  function tapPiece(id: string, kind: "keep" | "wrong" | "decoy") {
    if (settled) return;
    if (kind === "wrong" && ticket.goals.includes("remove")) {
      setRemoved(true);
      return;
    }
    shake(id);
  }

  return (
    <div className={`tidy scene-${ticket.scene}${settled ? " settled" : ""}`}>
      <div className="tidy-meta">
        <span>{left}s</span>
                <span>{t(sceneName(ticket.scene))}</span>
      </div>
      <p className="ask">{ticket.note}</p>
      <div className="tidy-board">
        {ticket.pieces.map((piece) =>
          piece.kind === "wrong" && removed ? null : (
            <button
              key={piece.id}
              type="button"
              className={`tidy-piece${wiggle === piece.id ? " wiggle" : ""}${
                ticket.hint === "wrong" && piece.kind === "wrong" && !removed
                  ? " hinted"
                  : ""
              }`}
              onClick={() => tapPiece(piece.id, piece.kind)}
            >
                            {t(piece.label)}
            </button>
          ),
        )}
        {ticket.goals.includes("place") ? (
          <button
            type="button"
            className={`tidy-slot${placed ? " filled" : ""}`}
            onClick={() => {
              if (held) setPlaced(true);
            }}
          >
                        {t((placed ? ticket.loose?.label : ticket.slotLabel) ?? "")}
          </button>
        ) : null}
        {ticket.paint ? (
          <span className={`tidy-paint paint-${color}`}>
                        {t(ticket.paint.label)}
          </span>
        ) : null}
      </div>
      {ticket.loose && !placed ? (
        <button
          type="button"
          className={`tidy-loose${held ? " held" : ""}${
            ticket.hint === "loose" ? " hinted" : ""
          }`}
          onClick={() => setHeld(true)}
        >
                    {t(ticket.loose.label)}
        </button>
      ) : null}
      {ticket.paint ? (
        <div className="tidy-swatches">
          {SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className={`tidy-swatch${color === swatch ? " on" : ""}${
                ticket.hint === "swatch" && swatch === ticket.paint?.want
                  ? " hinted"
                  : ""
              }`}
                            aria-label={t(SWATCH_LABEL[swatch])}
              onClick={() => setColor(swatch)}
            >
              <span className={`tidy-dot paint-${swatch}`} />
                            <span>{t(SWATCH_LABEL[swatch])}</span>
            </button>
          ))}
        </div>
      ) : null}
      {settled ? (
        <div className="tidy-payoff" aria-hidden="true">
          <span className="tidy-check" />
          <span className="tidy-coin" />
        </div>
      ) : null}
    </div>
  );
}
