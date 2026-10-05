import { useState } from "react";
import type { Difficulty } from "../game/difficulty";
import { spotSolved, type SpotPuzzle, type SpotTile } from "../game/spot";
import type { CodeGrade } from "../game/types";
import { gameSeconds } from "../game/workGames";
import { useTicketClock } from "./useTicketClock";
import { t } from "../i18n";

export function SpotTicket({
  puzzle,
  difficulty,
  bonus,
  onDone,
}: {
  puzzle: SpotPuzzle;
  difficulty: Difficulty;
  bonus: number;
  onDone: (grade: CodeGrade, left: number, total: number) => void;
}) {
  const total = gameSeconds("spot", difficulty, bonus);
  const [found, setFound] = useState<number[]>([]);
  const [miss, setMiss] = useState<number | null>(null);
  const solved = spotSolved(puzzle, found);
  const { left, settled, penalize } = useTicketClock(total, solved, onDone);
  const remaining = puzzle.bugs.length - found.length;

  function tap(index: number) {
    if (settled || found.includes(index)) return;
    if (puzzle.bugs.includes(index)) {
      setFound((current) => [...current, index]);
      return;
    }
    setMiss(index);
    penalize();
    window.setTimeout(
      () => setMiss((current) => (current === index ? null : current)),
      350,
    );
  }

  return (
    <div className={`tidy spot${settled ? " settled" : ""}`}>
      <div className="tidy-meta">
        <span>{left}s</span>
        <span>{t("Spot the bug")}</span>
      </div>
      <p className="ask">
                {t("Tap what changed between the design and the app.")}{" "}
        <strong>{remaining > 0 ? t("{n} left", { n: remaining }) : t("All found")}</strong>
      </p>
      <div className="spot-boards">
        <SpotBoard
                    label={t("Design")}
          tiles={puzzle.design}
          columns={puzzle.columns}
          found={found}
          miss={miss}
          hint={puzzle.hint}
          onTap={tap}
        />
        <SpotBoard
                    label={t("The app")}
          tiles={puzzle.shipped}
          columns={puzzle.columns}
          found={found}
          miss={miss}
          hint={puzzle.hint}
          onTap={tap}
        />
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

function SpotBoard({
  label,
  tiles,
  columns,
  found,
  miss,
  hint,
  onTap,
}: {
  label: string;
  tiles: readonly SpotTile[];
  columns: number;
  found: readonly number[];
  miss: number | null;
  hint: number | null;
  onTap: (index: number) => void;
}) {
  return (
    <div className="spot-phone">
      <span className="spot-label">{label}</span>
      <span className="spot-bar" aria-hidden="true" />
      <div
        className="spot-grid"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {tiles.map((tile, index) => (
          <button
            key={index}
            type="button"
            className={`spot-cell${found.includes(index) ? " found" : ""}${
              miss === index ? " wiggle" : ""
            }${hint === index && !found.includes(index) ? " hinted" : ""}`}
                        aria-label={t("{board} tile {n}", { board: label, n: index + 1 })}
            onClick={() => onTap(index)}
          >
            {tile ? (
              <span
                className={`spot-shape shape-${tile.shape} color-${tile.color}`}
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
