import { useEffect, useRef, useState } from "react";
import type { Difficulty } from "../game/difficulty";
import { inZone, markerAt, type ShipPuzzle } from "../game/ship";
import type { CodeGrade } from "../game/types";
import { gameSeconds } from "../game/workGames";
import { useTicketClock } from "./useTicketClock";

export function ShipTicket({
  puzzle,
  difficulty,
  bonus,
  onDone,
}: {
  puzzle: ShipPuzzle;
  difficulty: Difficulty;
  bonus: number;
  onDone: (grade: CodeGrade, left: number, total: number) => void;
}) {
  const total = gameSeconds("ship", difficulty, bonus);
  const [hits, setHits] = useState(0);
  const [position, setPosition] = useState(0);
  const [flash, setFlash] = useState<"hit" | "miss" | null>(null);
  const started = useRef(performance.now());
  const solved = hits >= puzzle.zones.length;
  const { left, settled, penalize } = useTicketClock(total, solved, onDone);
  const zone = puzzle.zones[Math.min(hits, puzzle.zones.length - 1)];

  useEffect(() => {
    if (settled) return;
    let frame = 0;
    const tick = (now: number) => {
      setPosition(markerAt(now - started.current, puzzle.speed));
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [puzzle.speed, settled]);

  function ship() {
    if (settled || !zone) return;
    const now = markerAt(performance.now() - started.current, puzzle.speed);
    if (inZone(now, zone)) {
      setHits((count) => count + 1);
      setFlash("hit");
    } else {
      penalize();
      setFlash("miss");
    }
    window.setTimeout(() => setFlash(null), 260);
  }

  return (
    <div className={`tidy ship${settled ? " settled" : ""}`}>
      <div className="tidy-meta">
        <span>{left}s</span>
        <span>Ship it</span>
      </div>
      <p className="ask">
        Tap <strong>Ship</strong> while the marker is in the green window. Three
        releases in a row.
      </p>
      <div className="ship-lights" aria-label={`${hits} of 3 released`}>
        {puzzle.zones.map((_, index) => (
          <span key={index} className={index < hits ? "on" : ""} />
        ))}
      </div>
      <div className={`ship-bar${flash ? ` ${flash}` : ""}`}>
        {zone && !solved ? (
          <span
            className="ship-zone"
            style={{ left: `${zone.start}%`, width: `${zone.width}%` }}
          />
        ) : null}
        <span className="ship-marker" style={{ left: `${position}%` }} />
      </div>
      <button
        type="button"
        className="trade-confirm buy ship-button"
        disabled={settled}
        onClick={ship}
      >
        Ship
      </button>
      {settled ? (
        <div className="tidy-payoff" aria-hidden="true">
          <span className="tidy-check" />
          <span className="tidy-coin" />
        </div>
      ) : null}
    </div>
  );
}
