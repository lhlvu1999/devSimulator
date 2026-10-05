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
import { DIFFICULTY_LABEL } from "../game/difficulty";
import { WORK_GAME_LABEL } from "../game/workGames";
import { getLang, t, tn } from "../i18n";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

/** One letter per day in English; Vietnamese days are short already (T2–T6). */
function dayMark(index: number): string {
  const day = t(WEEKDAYS[index] ?? "Mon");
  return getLang() === "en" ? day.charAt(0) : day;
}

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
                ? t("{n}h of overtime left", { n: Math.max(0, WEEK_HOURS + OVERTIME_HOURS - hour) })
                : t("The week is over")
              : t("{n}h left this week", { n: WEEK_HOURS - hour })}
          </span>
          <span>{t("Energy {n}", { n: state.stats.energy })}</span>
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
                                {dayMark(index)}
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
            ? t("Your lead sets the order. Take the top ticket.")
            : t("Pick what to work on. Watch the deadlines.")}
          {overtime ? ` ${t("Startups can push into overtime, at a cost.")}` : ""}
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
          {t("The board is clear. Wrap up early and enjoy the free time.")}</p>
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
          {t("Wrap up the week")}</button>
        <small>
                    {slots > 0
            ? tn(slots, "Stopping now gives +{n} free-time slot.", "Stopping now gives +{n} free-time slots.")
            : slots < 0
              ? tn(-slots, "Overtime has cost {n} free-time slot.", "Overtime has cost {n} free-time slots.")
              : t("No extra free time this week.")}
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
    const verb =
    ticket.parts > 1
      ? t(ticket.partsDone > 0 ? "Continue part {part}/{parts}" : "Start part {part}/{parts}", {
          part: ticket.partsDone + 1,
          parts: ticket.parts,
        })
      : t(ticket.partsDone > 0 ? "Continue" : "Start");
  const action = locked
    ? t("Queued by your lead")
    : !fits
      ? t("Not enough time left this week")
      : !enough
        ? t("Needs {n} energy", { n: plan.energy })
        : `${verb} · ${plan.hours}h${plan.overtime > 0 ? ` ${t("overtime")}` : ""} · ${t("{n} energy", { n: plan.energy })}`;

  return (
    <li
      className={`board-ticket prio-${ticket.priority}${ticket.overdue ? " is-overdue" : ""}${
        locked ? " locked" : ""
      }`}
    >
      <div className="ticket-top">
        <span className="ticket-key">{ticket.key}</span>
                <span className={`ticket-type game-${ticket.game}`}>
                    {t(WORK_GAME_LABEL[ticket.game])}
        </span>
        <span className={`diff-chip diff-${ticket.difficulty}`}>
                    {t(DIFFICULTY_LABEL[ticket.difficulty])}
        </span>
        <span className={`prio-pill prio-${ticket.priority}`}>
                    {t(PRIORITY_LABEL[ticket.priority])}
        </span>
      </div>
            <strong className="ticket-title">{t(ticket.title)}</strong>
      <div className="ticket-meta">
        <span className="ticket-size">
          {ticket.size} ·{" "}
          {ticket.parts > 1
                        ? t("{n} parts × {hours}h", { n: ticket.parts, hours: ticket.partHours })
            : `${ticket.partHours}h`}
        </span>
        {ticket.parts > 1 ? (
          <span
            className="part-dots"
                        aria-label={t("{done} of {parts} parts done", { done: ticket.partsDone, parts: ticket.parts })}
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
            ? t("Dropped in mid-week")
            : t("Follow-up to {key}", { key: ticket.parent ?? "" })}
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
