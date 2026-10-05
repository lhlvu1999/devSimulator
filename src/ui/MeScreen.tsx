import { useState, type ReactNode } from "react";
import { SOUND_LAYERS, type SoundLayer, type SoundMix } from "./music";
import type { CareerStatus } from "../game/career";
import { formatMoney } from "../game/format";
import { skillRating, skillTier } from "../game/skill";
import type { StatKey, Stats } from "../game/types";
import { WORK_GAME_LABEL } from "../game/workGames";
import { LANGS, setLang, t, useLang } from "../i18n";

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
  skill:
    "What you know. It never tops out. It brings harder work and opens early promotions.",
  reputation: "How the company sees you. Bigger promotions look at it.",
  relationship:
    "How close you are with your team. Teammates help more when it is high.",
};

const STAT_NAME: Record<StatKey, string> = {
  money: "Money",
  energy: "Energy",
  mood: "Mood",
  health: "Health",
  skill: "Skill",
  reputation: "Reputation",
  relationship: "Relationship",
};

const SOUND_LABEL: Record<SoundLayer, { name: string; blurb: string }> = {
  lofi: { name: "Lofi music", blurb: "A slow beat in the background." },
  keys: { name: "Keyboard sounds", blurb: "Typing from the desk." },
};

/** Stats, career, life, and settings: everything about you, in one tab. */
export function MeScreen({
  stats,
  career,
  lifeCard,
  onSwitchTrack,
  onRestart,
  sound,
  onSound,
}: {
  stats: Stats;
  career?: CareerStatus;
  lifeCard?: ReactNode;
  onSwitchTrack?: () => void;
  onRestart: () => void;
  sound: SoundMix;
  onSound: (layer: SoundLayer, on: boolean) => void;
}) {
  const [tip, setTip] = useState<StatKey | null>(null);
  const toggleTip = (key: StatKey) =>
    setTip((current) => (current === key ? null : key));
  return (
    <section className="screen me-screen">
      <h2 className="tab-title">{t("Me")}</h2>
      <div className="me-card">
        <p className="stats-money">
          <span>
            {t("Money")}
            <StatTip id="money" open={tip === "money"} onToggle={toggleTip} />
          </span>
          <strong>{formatMoney(stats.money)}</strong>
        </p>
        {tip === "money" ? (
          <p className="stat-hint">{t(STAT_HINT.money)}</p>
        ) : null}
        <ul className="stats-list">
          {METERS.map((meter) => {
            const value = stats[meter.key];
            const isSkill = meter.key === "skill";
            const filled = isSkill
              ? skillRating(value)
              : Math.max(0, Math.min(100, value));
            return (
              <li key={meter.key}>
                <div className="stats-row">
                  <span>
                    {t(meter.label)}
                    <StatTip
                      id={meter.key}
                      open={tip === meter.key}
                      onToggle={toggleTip}
                    />
                  </span>
                  <span>
                    {isSkill ? `${value} · ${t(skillTier(value))}` : value}
                  </span>
                </div>
                <span className={`stats-meter tone-${meter.tone}`}>
                  <span
                    className={filled < 30 ? "is-low" : undefined}
                    style={{ width: `${filled}%` }}
                  />
                </span>
                {tip === meter.key ? (
                  <p className="stat-hint">{t(STAT_HINT[meter.key])}</p>
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
      <Settings onRestart={onRestart} sound={sound} onSound={onSound} />
    </section>
  );
}

function Settings({
  onRestart,
  sound,
  onSound,
}: {
  onRestart: () => void;
  sound: SoundMix;
  onSound: (layer: SoundLayer, on: boolean) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const lang = useLang();
  return (
    <div className="me-card settings">
      <span className="settings-title">{t("Settings")}</span>
      <div className="settings-lang">
        <span>
          {t("Language")}
          <small>{t("Changes every screen right away.")}</small>
        </span>
        <div className="segmented" role="radiogroup" aria-label={t("Language")}>
          {LANGS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={lang === option.id}
              className={lang === option.id ? "on" : ""}
              onClick={() => setLang(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-sound" role="group" aria-label={t("Background sound")}>
        <span className="settings-sound-title">
          {t("Background sound")}
          <small>{t("Pick one, both, or none.")}</small>
        </span>
        {SOUND_LAYERS.map((layer) => (
          <button
            key={layer}
            type="button"
            role="switch"
            aria-checked={sound[layer]}
            className="settings-toggle"
            onClick={() => onSound(layer, !sound[layer])}
          >
            <span>
              {t(SOUND_LABEL[layer].name)}
              <small>{t(SOUND_LABEL[layer].blurb)}</small>
            </span>
            <i className={sound[layer] ? "on" : undefined} aria-hidden="true" />
          </button>
        ))}
      </div>
      {confirming ? (
        <div className="settings-confirm">
          <span>
            {t("Start a brand new life? This save is gone for good.")}
          </span>
          <div className="career-switch-actions">
            <button type="button" className="danger" onClick={onRestart}>
              {t("Start over")}
            </button>
            <button type="button" onClick={() => setConfirming(false)}>
              {t("Keep playing")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="settings-row"
          onClick={() => setConfirming(true)}
        >
          <span>{t("Start a new life")}</span>
          <small>{t("Erase this save and begin again at placement.")}</small>
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
      aria-label={t("What is {stat}?", { stat: t(STAT_NAME[id]) })}
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
  const switchTitle = career.switchTo ? t(career.switchTo.title) : "";
  return (
    <div className="career-card">
      <div className="career-head">
        <span>
          {career.track === "manager"
            ? t("Manager track")
            : t("Engineer track")}
        </span>
        <strong>{t(career.title)}</strong>
        <small>
          {t("Payday {amount}", { amount: formatMoney(career.payday) })}
        </small>
        {career.pay.ticker && career.pay.stock > 0 ? (
          <small>
            {t("{cash} cash + {stock} in {ticker} stock", {
              cash: formatMoney(career.pay.cash),
              stock: formatMoney(career.pay.stock),
              ticker: career.pay.ticker,
            })}
          </small>
        ) : null}
      </div>
      {career.nextTitle ? (
        <>
          <span className="career-next">
            {t("Next: {title}", { title: t(career.nextTitle) })}
            {career.ready
              ? career.triedToday
                ? ` · ${t("review next week")}`
                : ` · ${t("review ready")}`
              : ""}
          </span>
          {career.taskScale < 1 ? (
            <span className="career-discount">
              {t("Your CV cut the tasks here by {percent}%.", {
                percent: Math.round((1 - career.taskScale) * 100),
              })}
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
          {career.track === "manager"
            ? t("Top of the manager track.")
            : t("Top of the engineer track.")}
        </span>
      )}
      <span className="career-games">
        {t("Work: {games}", {
          games: career.games
            .map((game) => t(WORK_GAME_LABEL[game]))
            .join(", "),
        })}
      </span>
      {career.switchTo && onSwitchTrack ? (
        <div className="career-switch">
          {confirming ? (
            <>
              <span>
                {t(
                  "Become {title}? Progress toward the next level carries over at half.",
                  {
                    title: switchTitle,
                  },
                )}
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
                  {t("Switch")}
                </button>
                <button type="button" onClick={() => setConfirming(false)}>
                  {t("Stay")}
                </button>
              </div>
            </>
          ) : (
            <button type="button" onClick={() => setConfirming(true)}>
              {career.track === "manager"
                ? t("Go back to engineering as {title}", { title: switchTitle })
                : t("Move to managing as {title}", { title: switchTitle })}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
