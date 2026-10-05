import { useState } from "react";
import type { Difficulty } from "../game/difficulty";
import type { CodeGrade } from "../game/types";
import {
  openings,
  traceWires,
  turnPipe,
  type Pipe,
  type WirePuzzle,
} from "../game/wires";
import { gameSeconds } from "../game/workGames";
import { useTicketClock } from "./useTicketClock";
import { t } from "../i18n";

export function WiresTicket({
  puzzle: dealt,
  difficulty,
  bonus,
  onDone,
}: {
  puzzle: WirePuzzle;
  difficulty: Difficulty;
  bonus: number;
  onDone: (grade: CodeGrade, left: number, total: number) => void;
}) {
  const total = gameSeconds("wires", difficulty, bonus);
  const [puzzle, setPuzzle] = useState(dealt);
  const trace = traceWires(puzzle);
  const { left, settled } = useTicketClock(total, trace.connected, onDone);
  const helped = puzzle.pipes.some((pipe) => pipe.locked);

  return (
    <div className={`tidy wires${settled ? " settled" : ""}`}>
      <div className="tidy-meta">
        <span>{left}s</span>
        <span>{t("Connect the wires")}</span>
      </div>
      <p className="ask">
                {t("Tap tiles to turn them. Connect the button to the server.")}
        {helped ? ` ${t("A teammate already set the first pieces.")}` : ""}
      </p>
      <div className="wires-board">
        <div className="wires-rail left">
          {Array.from({ length: puzzle.size }, (_, row) => (
            <span
              key={row}
              className={
                row === puzzle.startRow ? "wires-end button" : "wires-end"
              }
            >
                            {row === puzzle.startRow ? t("Button") : ""}
            </span>
          ))}
        </div>
        <div
          className="wires-grid"
          style={{ gridTemplateColumns: `repeat(${puzzle.size}, 1fr)` }}
        >
          {puzzle.pipes.map((pipe, cell) => (
            <button
              key={cell}
              type="button"
              className={`wire-cell${trace.lit.includes(cell) ? " lit" : ""}${
                pipe.locked ? " locked" : ""
              }`}
                            aria-label={t("Pipe {n}", { n: cell + 1 })}
              disabled={settled || pipe.locked}
              onClick={() => setPuzzle((current) => turnPipe(current, cell))}
            >
              <PipeGlyph pipe={pipe} />
            </button>
          ))}
        </div>
        <div className="wires-rail right">
          {Array.from({ length: puzzle.size }, (_, row) => (
            <span
              key={row}
              className={
                row === puzzle.endRow ? "wires-end server" : "wires-end"
              }
            >
                            {row === puzzle.endRow ? t("Server") : ""}
            </span>
          ))}
        </div>
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

const ARM: Record<number, string> = {
  0: "M20 20 L20 0",
  1: "M20 20 L40 20",
  2: "M20 20 L20 40",
  3: "M20 20 L0 20",
};

function PipeGlyph({ pipe }: { pipe: Pipe }) {
  const arms = openings(pipe);
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      {arms.map((dir) => (
        <path key={`under-${dir}`} d={ARM[dir]} className="pipe-under" />
      ))}
      {arms.map((dir) => (
        <path key={`top-${dir}`} d={ARM[dir]} className="pipe-line" />
      ))}
      <circle cx="20" cy="20" r="4.5" className="pipe-joint" />
    </svg>
  );
}
