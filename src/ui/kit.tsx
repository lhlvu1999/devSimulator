import type { ReactNode } from "react";
import type { Company } from "../content/companies";
import { TIER_LABEL, TYPE_LABEL } from "../content/companies";
import { difficultyStars, type Difficulty } from "../game/difficulty";
import { formatMoney } from "../game/format";
import type { StatKey, Stats } from "../game/types";
import { STAT_KEYS } from "../game/types";

const STAT_LABELS: Record<StatKey, string> = {
  money: "Money",
  energy: "Energy",
  mood: "Mood",
  skill: "Skill",
  reputation: "Reputation",
  health: "Health",
  relationship: "Relationship",
};

export function StatBoard({ stats }: { stats: Stats }) {
  return (
    <div className="stat-board">
      <div className="money-chip">
        <span>Money</span>
        <strong>{formatMoney(stats.money)}</strong>
      </div>
      {STAT_KEYS.filter((key) => key !== "money").map((key) => (
        <Meter key={key} label={STAT_LABELS[key]} value={stats[key]} />
      ))}
    </div>
  );
}

export function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="meter">
      <div className="meter-label">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="meter-track" aria-hidden="true">
        <div
          className="meter-fill"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

export function Stars({ count }: { count: number }) {
  return (
    <span className="stars" aria-label={`${count} of 3 difficulty`}>
      {[1, 2, 3].map((star) => (
        <i key={star} className={star <= count ? "star on" : "star"} />
      ))}
    </span>
  );
}

export function OfferCard({
  company,
  note,
  onPick,
}: {
  company: Company;
  note: string;
  onPick: () => void;
}) {
  const learn = Math.round(company.learning * 4);
  const ease = Math.max(1, 6 - Math.round(company.energyCost / 4));
  return (
    <button type="button" className="offer-card" onClick={onPick}>
      <div className="offer-top">
        <strong>{company.name}</strong>
        <span className="badge">{TIER_LABEL[company.tier]}</span>
      </div>
      <span className="type-chip">{TYPE_LABEL[company.type]}</span>
      <div className="offer-meters">
        <MiniMeter
          label="Pay"
          value={Math.min(5, Math.round(company.salary / 450))}
        />
        <MiniMeter label="Learn" value={Math.min(5, learn)} />
        <MiniMeter label="Easy days" value={ease} />
      </div>
      <p>{note}</p>
    </button>
  );
}

function MiniMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="mini-meter">
      <span>{label}</span>
      <span className="pips">
        {[1, 2, 3, 4, 5].map((pip) => (
          <i key={pip} className={pip <= value ? "pip on" : "pip"} />
        ))}
      </span>
    </div>
  );
}

export function TaskCard({
  label,
  detail,
  difficulty,
  disabled,
  onPick,
}: {
  label: string;
  detail: string;
  difficulty: Difficulty;
  disabled: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      className={disabled ? "task-card blocked" : "task-card"}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) onPick();
      }}
    >
      <div className="offer-top">
        <strong>{label}</strong>
        <Stars count={difficultyStars(difficulty)} />
      </div>
      <p>{detail}</p>
    </button>
  );
}

export function HintChip({ children }: { children: ReactNode }) {
  return <div className="hint-chip">{children}</div>;
}
