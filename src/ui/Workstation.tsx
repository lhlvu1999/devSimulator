import type { ReactNode } from "react";
import type { RigId, WorkStyle } from "../game/types";

export function Workstation({
  rig,
  style,
  title,
  timer,
  children,
}: {
  rig: RigId;
  style: WorkStyle;
  title: string;
  timer?: string;
  children: ReactNode;
}) {
  return (
    <div className={`desk style-${style} rig-${rig}`}>
      <div className="station">
        {rig === "cockpit" ? (
          <div className="side-screen" aria-hidden="true">
            <span>tests</span>
            <span>passing</span>
          </div>
        ) : null}
        <div className="machine">
          <div className="bezel">
            <div className="camera" aria-hidden="true" />
            <div className="screen-glass">
              <div className="screen-bar">
                <span>{title}</span>
                {timer ? <span className="timer">{timer}</span> : <span />}
              </div>
              <div className="screen-body">{children}</div>
            </div>
          </div>
          <div className={rig === "laptop" ? "deck" : "stand"} />
        </div>
      </div>
    </div>
  );
}
