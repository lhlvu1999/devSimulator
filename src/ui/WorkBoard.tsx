import {
  OVERTIME_HOURS,
  PRIORITY_LABEL,
  WEEK_HOURS,
  allowsOvertime,
  assignedTicket,
  canStart,
  dueInfo,
  hourLabel,
  slotChange,
  sortTickets,
  type BoardTicket,
} from "../game/board";
import { partPlan, type CareerState } from "../game/career";
import { WORK_GAME_LABEL } from "../game/workGames";

export function WorkBoard({
  state,
  notes,
  onStart,
  onFinish,
}: {
  state: CareerState;
  notes: readonly string[];
  onStart: (key: string) => void;
  onFinish: () => void;
}) {
  const company = state.company;
  if (!company) return null;
  const hour = state.board.hour;
  const overtime = allowsOvertime(company.type);
  const tickets = sortTickets(state.board.tickets);
  const assigned = assignedTicket(state.board, state.level);
  const slots = slotChange(hour);
  const dayMarks = Array.from({ length: WEEK_HOURS / 8 }, (_, index) => index);

  return (
    <div className="work-board">
      <div className="week-clock">
        <div className="clock-head">
          <strong className="clock-now">{hourLabel(hour)}</strong>
          <span>
            {hour >= WEEK_HOURS
              ? overtime
                ? `${Math.max(0, WEEK_HOURS + OVERTIME_HOURS - hour)}h of overtime left`
                : "The week is over"
              : `${WEEK_HOURS - hour}h left this week`}
          </span>
          <span>Energy {state.stats.energy}</span>
        </div>
        <div className="clock-track" aria-hidden="true">
          <div className="clock-week">
            <span
              className="clock-fill"
              style={{
                width: `${(Math.min(hour, WEEK_HOURS) / WEEK_HOURS) * 100}%`,
              }}
            />
            {dayMarks.map((index) => (
              <i
                key={index}
                style={{ left: `${(index / dayMarks.length) * 100}%` }}
              >
                {["M", "T", "W", "T", "F"][index]}
              </i>
            ))}
          </div>
          {overtime ? (
            <div className="clock-overtime">
              <span
                className="clock-fill"
                style={{
                  width: `${(Math.max(0, hour - WEEK_HOURS) / OVERTIME_HOURS) * 100}%`,
                }}
              />
            </div>
          ) : null}
        </div>
        <p className="board-hint">
          {assigned
            ? "Your lead sets the order. Take the top ticket."
            : "Pick what to work on. Watch the deadlines."}
          {overtime ? " Startups can push into overtime, at a cost." : ""}
        </p>
      </div>

      {notes.length > 0 ? (
        <ul className="board-notes" role="status">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}

      {tickets.length === 0 ? (
        <p className="board-empty">
          The board is clear. Wrap up early and enjoy the free time.
        </p>
      ) : (
        <ul className="ticket-list">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.key}
              ticket={ticket}
              state={state}
              locked={assigned !== null && assigned.key !== ticket.key}
              onStart={() => onStart(ticket.key)}
            />
          ))}
        </ul>
      )}

      <div className="board-footer">
        <button type="button" className="primary" onClick={onFinish}>
          Wrap up the week
        </button>
        <small>
          {slots > 0
            ? `Stopping now gives +${slots} free-time slot${slots > 1 ? "s" : ""}.`
            : slots < 0
              ? `Overtime has cost ${-slots} free-time slot${slots < -1 ? "s" : ""}.`
              : "No extra free time this week."}
        </small>
      </div>
    </div>
  );
}

function TicketCard({
  ticket,
  state,
  locked,
  onStart,
}: {
  ticket: BoardTicket;
  state: CareerState;
  locked: boolean;
  onStart: () => void;
}) {
  const company = state.company;
  if (!company) return null;
  const plan = partPlan(state, ticket);
  const due = dueInfo(ticket, state.day, state.board.hour);
  const fits = canStart(state.board, ticket, company.type);
  const enough = state.stats.energy >= plan.energy;
  const part =
    ticket.parts > 1 ? ` part ${ticket.partsDone + 1}/${ticket.parts}` : "";
  const action = locked
    ? "Queued by your lead"
    : !fits
      ? "Not enough time left this week"
      : !enough
        ? `Needs ${plan.energy} energy`
        : `${ticket.partsDone > 0 ? "Continue" : "Start"}${part} · ${plan.hours}h${
            plan.overtime > 0 ? " overtime" : ""
          } · ${plan.energy} energy`;

  return (
    <li
      className={`board-ticket prio-${ticket.priority}${ticket.overdue ? " is-overdue" : ""}${
        locked ? " locked" : ""
      }`}
    >
      <div className="ticket-top">
        <span className="ticket-key">{ticket.key}</span>
        <span className={`ticket-type game-${ticket.game}`}>
          {WORK_GAME_LABEL[ticket.game]}
        </span>
        <span className={`prio-pill prio-${ticket.priority}`}>
          {PRIORITY_LABEL[ticket.priority]}
        </span>
      </div>
      <strong className="ticket-title">{ticket.title}</strong>
      <div className="ticket-meta">
        <span className="ticket-size">
          {ticket.size} ·{" "}
          {ticket.parts > 1
            ? `${ticket.parts} parts × ${ticket.partHours}h`
            : `${ticket.partHours}h`}
        </span>
        {ticket.parts > 1 ? (
          <span
            className="part-dots"
            aria-label={`${ticket.partsDone} of ${ticket.parts} parts done`}
          >
            {Array.from({ length: ticket.parts }, (_, index) => (
              <i
                key={index}
                className={index < ticket.partsDone ? "on" : undefined}
              />
            ))}
          </span>
        ) : null}
        <span className={`due-chip due-${due.tone}`}>{due.label}</span>
      </div>
      {ticket.urgent || ticket.parent ? (
        <span className="ticket-origin">
          {ticket.urgent
            ? "Dropped in mid-week"
            : `Follow-up to ${ticket.parent}`}
        </span>
      ) : null}
      <button
        type="button"
        className="ticket-start"
        disabled={locked || !fits || !enough}
        onClick={onStart}
      >
        {action}
      </button>
    </li>
  );
}
