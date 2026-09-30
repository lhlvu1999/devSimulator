import { useState, type ReactNode } from "react";
import type { CareerStatus } from "../game/career";
import { formatMoney } from "../game/format";
import { skillRating, skillTier } from "../game/skill";
import type { StatKey, Stats } from "../game/types";
import { WORK_GAME_LABEL } from "../game/workGames";

const METERS: { key: StatKey; label: string; tone: string }[] = [
  { key: "energy", label: "Energy", tone: "clay" },
  { key: "mood", label: "Mood", tone: "blue" },
  { key: "health", label: "Health", tone: "rose" },
  { key: "skill", label: "Skill", tone: "sage" },
  { key: "reputation", label: "Reputation", tone: "ink" },
  { key: "relationship", label: "Relationship", tone: "clay" },
];

/** What each stat is for, without numbers. The player works out the details by playing. */
const STAT_HINT: Record<StatKey, string> = {
  money: "Pays rent and buys gear, snacks, and investments.",
  energy: "Every task uses some. It comes back each week.",
  mood: "How you feel about work and life lately.",
  health: "Your body. When it runs low, every task feels heavier.",
    skill: "What you know. It never tops out. It brings harder work and opens early promotions.",
  reputation: "How the company sees you. Bigger promotions look at it.",
  relationship:
    "How close you are with your team. Teammates help more when it is high.",
};

/** Stats, career, life, and settings: everything about you, in one tab. */
export function MeScreen({
  stats,
  career,
  lifeCard,
    onSwitchTrack,
    onRestart,
  music,
  onMusic,
}: {
  stats: Stats;
  career?: CareerStatus;
  lifeCard?: ReactNode;
  onSwitchTrack?: () => void;
    onRestart: () => void;
  music: boolean;
  onMusic: (on: boolean) => void;
}) {
  const [tip, setTip] = useState<StatKey | null>(null);
  const toggleTip = (key: StatKey) =>
    setTip((current) => (current === key ? null : key));
  return (
    <section className="screen me-screen">
      <h2 className="tab-title">Me</h2>
      <div className="me-card">
        <p className="stats-money">
          <span>
            Money
            <StatTip id="money" open={tip === "money"} onToggle={toggleTip} />
          </span>
          <strong>{formatMoney(stats.money)}</strong>
        </p>
        {tip === "money" ? (
          <p className="stat-hint">{STAT_HINT.money}</p>
        ) : null}
        <ul className="stats-list">
          {METERS.map((meter) => {
                        const value = stats[meter.key];
            const isSkill = meter.key === "skill";
            const filled = isSkill ? skillRating(value) : Math.max(0, Math.min(100, value));
            return (
              <li key={meter.key}>
                <div className="stats-row">
                  <span>
                    {meter.label}
                    <StatTip
                      id={meter.key}
                      open={tip === meter.key}
                      onToggle={toggleTip}
                    />
                  </span>
                                    <span>{isSkill ? `${value} · ${skillTier(value)}` : value}</span>
                </div>
                <span className={`stats-meter tone-${meter.tone}`}>
                  <span
                    className={filled < 30 ? "is-low" : undefined}
                    style={{ width: `${filled}%` }}
                  />
                </span>
                {tip === meter.key ? (
                  <p className="stat-hint">{STAT_HINT[meter.key]}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
      {career ? (
        <div className="me-card">
          <CareerCard career={career} onSwitchTrack={onSwitchTrack} />
        </div>
      ) : null}
      {lifeCard ? <div className="me-card">{lifeCard}</div> : null}
            <Settings onRestart={onRestart} music={music} onMusic={onMusic} />
    </section>
  );
}

function Settings({
  onRestart,
  music,
  onMusic,
}: {
  onRestart: () => void;
  music: boolean;
  onMusic: (on: boolean) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="me-card settings">
      <span className="settings-title">Settings</span>
      <button
        type="button"
        role="switch"
                aria-checked={music}
        className="settings-toggle"
        onClick={() => onMusic(!music)}
      >
        <span>
          Music
          <small>Soft keys and typing from the room.</small>
        </span>
        <i className={music ? "on" : undefined} aria-hidden="true" />
      </button>
      {confirming ? (
        <div className="settings-confirm">
          <span>Start a brand new life? This save is gone for good.</span>
          <div className="career-switch-actions">
            <button type="button" className="danger" onClick={onRestart}>
              Start over
            </button>
            <button type="button" onClick={() => setConfirming(false)}>
              Keep playing
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="settings-row"
          onClick={() => setConfirming(true)}
        >
          <span>Start a new life</span>
          <small>Erase this save and begin again at placement.</small>
        </button>
      )}
    </div>
  );
}

function StatTip({
  id,
  open,
  onToggle,
}: {
  id: StatKey;
  open: boolean;
  onToggle: (id: StatKey) => void;
}) {
  return (
    <button
      type="button"
      className={`stat-tip${open ? " on" : ""}`}
      aria-label={`What is ${id}?`}
      aria-expanded={open}
      onClick={() => onToggle(id)}
    >
      ?
    </button>
  );
}

function CareerCard({
  career,
  onSwitchTrack,
}: {
  career: CareerStatus;
  onSwitchTrack?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="career-card">
      <div className="career-head">
        <span>
          {career.track === "manager" ? "Manager track" : "Engineer track"}
        </span>
        <strong>{career.title}</strong>
        <small>Payday {formatMoney(career.payday)}</small>
        {career.pay.ticker && career.pay.stock > 0 ? (
          <small>
            {formatMoney(career.pay.cash)} cash +{" "}
            {formatMoney(career.pay.stock)} in {career.pay.ticker} stock
          </small>
        ) : null}
      </div>
      {career.nextTitle ? (
        <>
          <span className="career-next">
            Next: {career.nextTitle}
            {career.ready
              ? career.triedToday
                ? " · review next week"
                : " · review ready"
                            : ""}
          </span>
          {career.taskScale < 1 ? (
            <span className="career-discount">
              Your CV cut the tasks here by {Math.round((1 - career.taskScale) * 100)}%.
            </span>
          ) : null}
          <ul className="career-list">
            {career.items.map((item) => {
              const filled = Math.min(
                100,
                (item.have / Math.max(1, item.need)) * 100,
              );
              const met = item.have >= item.need;
              return (
                <li key={item.id} className={met ? "met" : undefined}>
                  <div className="stats-row">
                    <span>{item.label}</span>
                    <span>
                      {Math.min(item.have, item.need)}/{item.need}
                    </span>
                  </div>
                  <span className="stats-meter tone-sage">
                    <span style={{ width: `${filled}%` }} />
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <span className="career-next">
          Top of the {career.track === "manager" ? "manager" : "engineer"}{" "}
          track.
        </span>
      )}
      <span className="career-games">
        Work: {career.games.map((game) => WORK_GAME_LABEL[game]).join(", ")}
      </span>
      {career.switchTo && onSwitchTrack ? (
        <div className="career-switch">
          {confirming ? (
            <>
              <span>
                Become {career.switchTo.title}? Progress toward the next level
                carries over at half.
              </span>
              <div className="career-switch-actions">
                <button
                  type="button"
                  className="on"
                  onClick={() => {
                    setConfirming(false);
                    onSwitchTrack();
                  }}
                >
                  Switch
                </button>
                <button type="button" onClick={() => setConfirming(false)}>
                  Stay
                </button>
              </div>
            </>
          ) : (
            <button type="button" onClick={() => setConfirming(true)}>
              {career.track === "manager"
                ? `Go back to engineering as ${career.switchTo.title}`
                : `Move to managing as ${career.switchTo.title}`}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
