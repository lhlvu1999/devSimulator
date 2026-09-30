import type { ReactNode } from "react";
import { hourLabel } from "../game/board";
import type { CareerState } from "../game/career";
import { formatMoney } from "../game/format";
import { LEVEL_TITLE } from "../game/ladder";
import { ageOn, weekOfYear } from "../game/life";

const ICONS: Record<"energy" | "mood" | "health", ReactNode> = {
  energy: <path d="M9 1 3 9h4l-1 6 6-8H8l1-6Z" />,
  mood: (
    <>
      <circle cx="8" cy="8" r="6.2" fill="none" strokeWidth="1.6" />
      <path
        d="M5.2 9.4c1.5 1.9 4.1 1.9 5.6 0"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="5.8" cy="6.4" r="0.9" />
      <circle cx="10.2" cy="6.4" r="0.9" />
    </>
  ),
  health: (
    <path d="M8 14.2S1.8 10.3 1.8 5.9A3.3 3.3 0 0 1 8 4.3a3.3 3.3 0 0 1 6.2 1.6C14.2 10.3 8 14.2 8 14.2Z" />
  ),
};

const STATS = [
  { key: "energy", label: "Energy", tone: "clay" },
  { key: "mood", label: "Mood", tone: "blue" },
  { key: "health", label: "Health", tone: "rose" },
] as const;

/** Where the week stands: the work clock while working, then the evening. */
function momentOf(state: CareerState): string {
  if (!state.company) return "Job hunt";
  if (state.offWeek)
    return state.offWeek === "sick" ? "Sick week" : "Burnout week";
  if (state.workDone) return "Free time";
  return hourLabel(state.board.hour);
}

/**
 * The strip above the room: when it is, who you are, how you're doing, and money.
 * It lays itself out by its own height: three rows when there's room, two when tight.
 * Tap it for the full stats.
 */
export function TopHud({
  state,
  onOpen,
}: {
  state: CareerState;
  onOpen: () => void;
}) {
  const title = state.company
    ? `${LEVEL_TITLE[state.level]} · ${state.company.name}`
    : "Between jobs";
  const when = `Week ${weekOfYear(state.day)} · Age ${ageOn(state.day)} · ${momentOf(state)}`;
  return (
    <button
      type="button"
      className="top-hud"
      onClick={onOpen}
      aria-label="Open your stats"
    >
      <span className="hud-head">
        <span className="hud-when">{when}</span>
        <strong className="hud-money">{formatMoney(state.stats.money)}</strong>
      </span>
      <strong className="hud-title">
        <span className="hud-when-inline">{momentOf(state)} · </span>
        {title}
      </strong>
      <span className="hud-stats">
        {STATS.map((stat) => {
          const value = state.stats[stat.key];
          return (
            <span
              key={stat.key}
              className={`hud-stat hud-tone-${stat.tone}${value < 30 ? " is-low" : ""}`}
              aria-label={`${stat.label} ${value}`}
            >
              <span className="hud-stat-head">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  {ICONS[stat.key]}
                </svg>
                <span className="hud-stat-label">{stat.label}</span>
                <b>{value}</b>
              </span>
              <span className="hud-bar">
                <i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
              </span>
            </span>
          );
        })}
      </span>
    </button>
  );
}
