import type { ReactNode } from "react";
import { ROOM_ART } from "../content/art";
import type { CompanyType } from "../content/companies";
import { formatMoney } from "../game/format";
import type { StatKey, Stats } from "../game/types";

const ICONS: { key: StatKey; mark: string }[] = [
  { key: "money", mark: "$" },
  { key: "energy", mark: "E" },
  { key: "mood", mark: "M" },
  { key: "skill", mark: "S" },
  { key: "reputation", mark: "R" },
  { key: "health", mark: "H" },
  { key: "relationship", mark: "P" },
];

export function RoomView({
  environment,
  stats,
  panel,
  onWork,
  onInvest,
  onClose,
  children,
}: {
  environment: CompanyType | "interview" | "home";
  stats: Stats | null;
  panel: "work" | "invest" | "screen" | null;
  onWork: () => void;
  onInvest: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const art = ROOM_ART[environment];
  return (
    <div
      className={`stage room-${environment}${art ? " has-art" : ""}`}
      style={art ? { backgroundImage: `url(${art})` } : undefined}
    >
      {stats ? <IconBar stats={stats} /> : null}
      {panel === "work" || panel === "invest" || panel === "screen" ? (
        <div className={`monitor-zoom monitor-${panel}`}>
          {panel === "screen" ? null : (
            <button type="button" className="monitor-close" onClick={onClose}>
              Back to the room
            </button>
          )}
          <div className="monitor-glass">{children}</div>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="hotspot hotspot-work"
            onClick={onWork}
          >
            Work
          </button>
          <button
            type="button"
            className="hotspot hotspot-invest"
            onClick={onInvest}
          >
            Invest
          </button>
        </>
      )}
    </div>
  );
}

function IconBar({ stats }: { stats: Stats }) {
  return (
    <div className="icon-bar">
      {ICONS.map((icon) => (
        <span key={icon.key} className="icon-pill" aria-label={icon.key}>
          <i>{icon.mark}</i>
          {icon.key === "money"
            ? formatMoney(stats[icon.key])
            : stats[icon.key]}
        </span>
      ))}
    </div>
  );
}
