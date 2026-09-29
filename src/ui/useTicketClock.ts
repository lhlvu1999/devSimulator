import { useEffect, useRef, useState } from "react";
import { gradeFor } from "../game/tidy";
import type { CodeGrade } from "../game/types";

/**
 * One countdown per ticket. Reports once: a miss when time runs out,
 * or a grade shortly after the puzzle is solved so the payoff can play.
 */
export function useTicketClock(
  total: number,
  solved: boolean,
  onDone: (grade: CodeGrade, left: number, total: number) => void,
) {
  const [left, setLeft] = useState(total);
  const [settled, setSettled] = useState(false);
  const done = useRef(false);
  const report = useRef(onDone);
  report.current = onDone;
  const leftRef = useRef(left);
  leftRef.current = left;

  useEffect(() => {
    if (done.current || settled) return;
    if (left <= 0) {
      done.current = true;
      report.current("miss", 0, total);
      return;
    }
    const id = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left, settled, total]);

  useEffect(() => {
    if (!solved || done.current) return;
    setSettled(true);
    const remaining = leftRef.current;
    const id = window.setTimeout(() => {
      if (done.current) return;
      done.current = true;
      report.current(gradeFor(remaining, total), remaining, total);
    }, 700);
    return () => window.clearTimeout(id);
  }, [solved, total]);

  function penalize() {
    if (settled) return;
    setLeft((value) => Math.max(0, value - 1));
  }

  return { left, settled, penalize };
}
