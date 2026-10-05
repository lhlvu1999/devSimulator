import { useState } from "react";
import { emptyBoard, newbieMove, winner, type Board } from "../game/tictactoe";
import type { PlacementOutcome } from "../game/placement";
import { t } from "../i18n";

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

export function Placement({
  onDone,
}: {
  onDone: (outcome: PlacementOutcome, moves: number) => void;
}) {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [seed, setSeed] = useState(0x71c7ac);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState<PlacementOutcome | null>(null);

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
    <section className="screen">
      <p className="kicker">{t("Dev Simulator")}</p>
      <h1>{t("Placement")}</h1>
      <p className="prose">
        {t("Play tic-tac-toe against a new opponent. A faster win sets a higher fresher profile. The result stays inside the fresher band.")}</p>
      <div className="board" role="grid" aria-label={t("Tic-tac-toe")}>
        {board.map((cell, index) => (
          <button
            key={NAMES[index]}
            type="button"
            className="cell"
            aria-label={t(NAMES[index] ?? "")}
            disabled={Boolean(finished) || cell !== null}
            onClick={() => play(index)}
          >
            {cell ?? ""}
          </button>
        ))}
      </div>
      {finished ? (
        <PlacementResult outcome={finished} moves={moves} onDone={onDone} />
      ) : (
        <p className="prose muted">
                    {t("You are X.")}{" "}
          {moves === 0 ? t("Your move.") : t("{n} moves so far.", { n: moves })}
        </p>
      )}
    </section>
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
  const line =
    outcome === "win"
            ? t("You won in {n} moves.", { n: moves })
      : outcome === "draw"
        ? t("The board filled. That is a draw.")
        : t("The other side won.");
  return (
    <>
      <p className="projection">{line}</p>
      <button
        type="button"
        className="primary"
        onClick={() => onDone(outcome, moves)}
      >
        {t("See job offers")}</button>
    </>
  );
}
