import { formatMoney } from "../game/format";
import { ACHIEVEMENTS } from "../game/achievements";
import { useState } from "react";
import {
  doActivity,
  netWorth,
  practiceHobby,
  setSleep,
  slotsLeft,
  takeLesson,
  workOnSide,
  type CareerState,
} from "../game/career";
import type { LifeEvent } from "../game/events";
import {
  ACTIVITIES,
  GOALS,
  SLEEP,
  ageOn,
  goalProgress,
  moodSeconds,
  nextHoliday,
  seasonOf,
  weekOfYear,
  type GoalId,
  type SleepMode,
  type SlotKind,
} from "../game/life";
import {
  COURSES,
  HOBBIES,
  SIDE_SESSION,
  hobbyEffects,
  liveStreak,
  nextStreak,
  sideIsActive,
  sideStage,
} from "../game/pursuits";
import type { StatKey } from "../game/types";

const STAT_WORD: Partial<Record<StatKey, string>> = {
  energy: "energy",
  mood: "mood",
  health: "health",
  skill: "skill",
  reputation: "reputation",
  relationship: "team",
  money: "money",
};

function EffectTags({
  effects,
}: {
  effects: Partial<Record<StatKey, number>>;
}) {
  return (
    <span className="pantry-effects">
      {(Object.keys(effects) as StatKey[]).map((key) => {
        const amount = effects[key] ?? 0;
        if (amount === 0) return null;
        return (
          <span
            key={key}
            className={`pantry-effect ${amount > 0 ? "up" : "down"}`}
          >
            {amount > 0 ? "+" : "−"}
            {Math.abs(amount)} {STAT_WORD[key] ?? key}
          </span>
        );
      })}
    </span>
  );
}

export function GoalPicker({ onPick }: { onPick: (goal: GoalId) => void }) {
  return (
    <section className="screen life-screen">
      <p className="kicker">Age 22 · A whole career ahead</p>
      <h1>What is this life for?</h1>
      <p className="ask">
        Every day in the game is a week of your life. The run ends when you
        reach your goal, burn out, or turn 60.
      </p>
      {(Object.keys(GOALS) as GoalId[]).map((id) => (
        <button
          key={id}
          type="button"
          className={`goal-card goal-${id}`}
          onClick={() => onPick(id)}
        >
          <strong>{GOALS[id].title}</strong>
          <span>{GOALS[id].blurb}</span>
          <small>{GOALS[id].target}</small>
        </button>
      ))}
    </section>
  );
}

type FreeTab = "night" | "weekend" | "pursuits";

const FREE_TABS: { id: FreeTab; label: string }[] = [
  { id: "night", label: "Weeknights" },
  { id: "weekend", label: "Weekend" },
  { id: "pursuits", label: "Pursuits" },
];

type Spend = { cost: number; energy: number; slots: number; kind: SlotKind };

/** Why a plan can't happen right now, or null if it can. */
function blockedBy(state: CareerState, spend: Spend): string | null {
  if (slotsLeft(state, spend.kind) < spend.slots)
    return spend.kind === "night" ? "No weeknights left" : "No weekend left";
  if (state.stats.money < spend.cost) return `Needs ${formatMoney(spend.cost)}`;
  if (state.stats.energy < spend.energy) return "Too tired";
  return null;
}

function spendLabel(spend: Spend): string {
  const parts = [spend.cost > 0 ? formatMoney(spend.cost) : "Free"];
  if (spend.slots > 1) parts.push(`${spend.slots} ${spend.kind === "night" ? "nights" : "days"}`);
  return parts.join(" · ");
}

export function FreeTime({
  state,
  onChange,
  onWorkline,
  onEndWeek,
}: {
  state: CareerState;
  onChange: (next: CareerState) => void;
  onWorkline: () => void;
  onEndWeek: () => void;
}) {
  const [tab, setTab] = useState<FreeTab>("night");
  const note = state.log[0];
  const jobless = state.company === null;
  const timing = moodSeconds(state.stats.mood);
  return (
    <section className="screen life-screen">
      <p className="kicker">
        Week {weekOfYear(state.day)} · Age {ageOn(state.day)}
      </p>
      <h2>Free time</h2>
      {jobless ? (
        <p className="life-warning">
          No job right now. Look for one on Workline, and use the time to
          recover.
        </p>
      ) : null}
      {state.offWeek === "sick" ? (
        <p className="life-warning">
          You're sick this week and can't work. Rest up.
        </p>
      ) : null}
      {state.offWeek === "burnout" ? (
        <p className="life-warning">
          You burned out. No work this week. Do something that fills you back
          up.
        </p>
      ) : null}
      {timing < 0 ? (
        <p className="life-warning">
          Your mood is low, so work feels slower and every ticket has less time.
        </p>
      ) : null}

      <div className="time-pools">
        <SlotPool label="Weeknights" count={state.nightSlots} />
        <SlotPool label="Weekend" count={state.weekendSlots} />
      </div>

      <div className="sleep-pick">
        <span className="sleep-label">Sleep this week</span>
        <div className="segmented" role="radiogroup" aria-label="Sleep this week">
          {(Object.keys(SLEEP) as SleepMode[]).map((mode) => {
            const next = setSleep(state, mode);
            return (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={state.sleep === mode}
                className={state.sleep === mode ? "on" : ""}
                disabled={state.sleep !== mode && next === state}
                onClick={() => onChange(next)}
              >
                {SLEEP[mode].label}
              </button>
            );
          })}
        </div>
        <small>{SLEEP[state.sleep].blurb}</small>
      </div>

      {note ? <p className="projection">{note}</p> : null}

      <div className="segmented" role="tablist">
        {FREE_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={tab === item.id ? "on" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "pursuits" ? (
        <PursuitList state={state} onChange={onChange} />
      ) : (
        <ul className="shop-list">
          {ACTIVITIES.filter((activity) => activity.when === tab).map((activity) => {
            const cost = { ...activity, kind: activity.when };
            const blocked = blockedBy(state, cost);
            return (
              <li key={activity.id} className="shop-row">
                <span className="shop-info">
                  <strong>{activity.name}</strong>
                  <small>{activity.blurb}</small>
                  <EffectTags
                    effects={{
                      ...activity.effects,
                      ...(activity.energy ? { energy: -activity.energy } : {}),
                    }}
                  />
                </span>
                <button
                  type="button"
                  className="shop-buy"
                  disabled={blocked !== null}
                  onClick={() => onChange(doActivity(state, activity.id))}
                >
                  {blocked ?? spendLabel(cost)}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {jobless ? (
        <button type="button" className="offer-secondary" onClick={onWorkline}>
          Open Workline
        </button>
      ) : null}
      <button type="button" className="primary" onClick={onEndWeek}>
        End the week
      </button>
    </section>
  );
}

function SlotPool({ label, count }: { label: string; count: number }) {
  return (
    <div className="slot-row" aria-label={`${label}: ${count} left`}>
      <span>{label}</span>
      {Array.from({ length: Math.max(count, 0) }, (_, index) => (
        <i key={index} />
      ))}
      {count === 0 ? <em>None</em> : null}
    </div>
  );
}

/** Weeknight or weekend buttons for things that fit either. */
function WhenButtons({
  state,
  spend,
  onPick,
}: {
  state: CareerState;
  spend: Omit<Spend, "kind">;
  onPick: (kind: SlotKind) => void;
}) {
  return (
    <span className="when-buttons">
      {(["night", "weekend"] as const).map((kind) => {
        const blocked = blockedBy(state, { ...spend, kind });
        return (
          <button
            key={kind}
            type="button"
            className="shop-buy"
            disabled={blocked !== null}
            title={blocked ?? undefined}
            onClick={() => onPick(kind)}
          >
            {kind === "night" ? "Weeknight" : "Weekend"}
          </button>
        );
      })}
    </span>
  );
}

function PursuitList({
  state,
  onChange,
}: {
  state: CareerState;
  onChange: (next: CareerState) => void;
}) {
  const { pursuits } = state;
  const side = sideStage(pursuits.side.sessions);
  const sideLive = sideIsActive(pursuits.side, state.day);
  return (
    <div className="pursuits">
      <h3 className="list-title">Courses</h3>
      <p className="pursuit-note">One lesson per weeknight. Finish for a certificate.</p>
      <ul className="shop-list">
        {COURSES.map((course) => {
          const done = pursuits.courses[course.id];
          const finished = done >= course.lessons;
          const cost = { cost: course.cost, energy: course.energy, slots: 1, kind: "night" as const };
          const blocked = finished ? "Certified" : blockedBy(state, cost);
          return (
            <li key={course.id} className={`shop-row${finished ? " using" : ""}`}>
              <span className="shop-info">
                <strong>{course.name}</strong>
                <small>{course.blurb}</small>
                <span className="stats-meter tone-sage">
                  <span style={{ width: `${(done / course.lessons) * 100}%` }} />
                </span>
                <small>
                  {finished ? "Certificate earned" : `Lesson ${done} of ${course.lessons}`}
                </small>
                {finished ? null : <EffectTags effects={done + 1 >= course.lessons ? { ...course.lesson, ...course.finish } : course.lesson} />}
              </span>
              <button
                type="button"
                className={`shop-buy${finished ? " using" : ""}`}
                disabled={blocked !== null}
                onClick={() => onChange(takeLesson(state, course.id))}
              >
                {blocked ?? `Lesson · ${formatMoney(course.cost)}`}
              </button>
            </li>
          );
        })}
      </ul>

      <h3 className="list-title">Hobbies</h3>
      <p className="pursuit-note">Keep it up every week to build a streak. Streaks add up.</p>
      <ul className="shop-list">
        {HOBBIES.map((hobby) => {
          const progress = pursuits.hobbies[hobby.id];
          const streak = liveStreak(progress, state.day);
          return (
            <li key={hobby.id} className="shop-row pursuit-row">
              <span className="shop-info">
                <strong>{hobby.name}</strong>
                <small>{hobby.blurb}</small>
                <small className="streak">
                  {streak > 1 ? `${streak}-week streak` : streak === 1 ? "Started this streak" : "No streak yet"}
                </small>
                <EffectTags effects={{ ...hobbyEffects(hobby, nextStreak(progress, state.day)), energy: -hobby.energy }} />
              </span>
              <WhenButtons
                state={state}
                spend={{ cost: hobby.cost, energy: hobby.energy, slots: 1 }}
                onPick={(kind) => onChange(practiceHobby(state, hobby.id, kind))}
              />
            </li>
          );
        })}
      </ul>

      <h3 className="list-title">Side project</h3>
      <ul className="shop-list">
        <li className="shop-row pursuit-row">
          <span className="shop-info">
            <strong>{side.stage.name}</strong>
            <small>
              {side.next
                ? `${pursuits.side.sessions} sessions · ${side.next.from - pursuits.side.sessions} more to ${side.next.name}`
                : `${pursuits.side.sessions} sessions · as big as it gets`}
            </small>
            <span className="stats-meter tone-clay">
              <span
                style={{
                  width: `${side.next ? ((pursuits.side.sessions - side.stage.from) / (side.next.from - side.stage.from)) * 100 : 100}%`,
                }}
              />
            </span>
            <small>
              {side.stage.income > 0
                ? sideLive
                  ? `Earns about ${formatMoney(side.stage.income)} a week while you keep at it.`
                  : "Stalled. Work on it to win users back."
                : "Earns nothing yet. Launch comes at 12 sessions."}
            </small>
            <EffectTags effects={{ ...SIDE_SESSION.effects, energy: -SIDE_SESSION.energy }} />
          </span>
          <WhenButtons
            state={state}
            spend={{ cost: SIDE_SESSION.cost, energy: SIDE_SESSION.energy, slots: 1 }}
            onPick={(kind) => onChange(workOnSide(state, kind))}
          />
        </li>
      </ul>
    </div>
  );
}

export function EventCard({
  event,
  money,
  onChoose,
}: {
  event: LifeEvent;
  money: number;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <div
      className="event-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      <div className={`event-card kind-${event.kind}`}>
        <span className="news-kicker">
          {event.kind === "company"
            ? "At work"
            : event.kind === "season"
              ? "Holiday"
              : "In life"}
        </span>
        <h2>{event.title}</h2>
        <p>{event.body}</p>
        <div className="event-choices">
          {event.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="event-choice"
              disabled={money < choice.cost}
              onClick={() => onChoose(choice.id)}
            >
              <strong>{choice.label}</strong>
              <small>
                {choice.detail}
                {choice.cost > 0 ? ` · ${formatMoney(choice.cost)}` : ""}
              </small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EndingScreen({
  state,
  onRestart,
}: {
  state: CareerState;
  onRestart: () => void;
}) {
  const ending = state.ending;
  if (!ending) return null;
  return (
    <section className={`screen life-screen ending-${ending.kind}`}>
      <p className="kicker">
        Age {ending.age} · Week {ending.week}
      </p>
      <h1>{ending.title}</h1>
      <p className="ask">{ending.story}</p>
      <div className="ending-score">
        <span>Score</span>
        <strong>{ending.score.toLocaleString("en-US")}</strong>
      </div>
      <div className="offer-summary">
        <span>Net worth</span>
        <strong>{formatMoney(ending.netWorth)}</strong>
        <span>Goal</span>
        <strong>{state.goal ? GOALS[state.goal].title : "None"}</strong>
        <span>Health</span>
        <strong>{state.stats.health}</strong>
        <span>Mood</span>
        <strong>{state.stats.mood}</strong>
      </div>
      <AchievementList earned={state.achievements} />
      <button type="button" className="primary" onClick={onRestart}>
        Start a new life
      </button>
    </section>
  );
}

function AchievementList({ earned }: { earned: readonly string[] }) {
  return (
    <ul className="achievement-list">
      {ACHIEVEMENTS.map((item) => {
        const done = earned.includes(item.id);
        return (
          <li key={item.id} className={done ? "done" : undefined}>
            <strong>{item.title}</strong>
            <small>{item.blurb}</small>
          </li>
        );
      })}
    </ul>
  );
}

/** Age, goal progress, and achievements, for the stats panel. */
function nextHolidayText(day: number): string {
  const holiday = nextHoliday(day);
  if (holiday.inWeeks === 0) return `${holiday.name} this week`;
  if (holiday.inWeeks === 1) return `${holiday.name} next week`;
  return `${holiday.name} in ${holiday.inWeeks} weeks`;
}

export function LifeCard({ state }: { state: CareerState }) {
  const worth = netWorth(state);
  const progress = goalProgress(state, worth);
  return (
    <div className="career-card life-card">
      <div className="career-head">
        <span>Life</span>
        <strong>
          Age {ageOn(state.day)} · Week {weekOfYear(state.day)}
        </strong>
        <small>
          {seasonOf(state.day)} · {nextHolidayText(state.day)}
        </small>
        <small>Net worth {formatMoney(worth)}</small>
      </div>
      {state.goal ? (
        <div className="goal-progress">
          <div className="stats-row">
            <span>{GOALS[state.goal].title}</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <span className="stats-meter tone-clay">
            <span style={{ width: `${Math.round(progress * 100)}%` }} />
          </span>
          <small>{GOALS[state.goal].target}</small>
        </div>
      ) : null}
      <span className="career-games">
        Achievements {state.achievements.length}/{ACHIEVEMENTS.length}
      </span>
    </div>
  );
}
