import type { ReactNode } from "react";
import type { CompanyType } from "../content/companies";
import { deviceById, lookById } from "../content/gear";

export function DeskScene({
  environment,
  deviceId,
  lookId,
  children,
}: {
  environment: CompanyType | "interview" | "home";
  deviceId: string;
  lookId: string;
  children: ReactNode;
}) {
  const device = deviceById(deviceId);
  const look = lookById(lookId);
  return (
    <div className={`room room-${environment}`}>
      <div
        className={`person hair-${look.hair} shirt-${look.shirt}`}
        aria-hidden="true"
      >
        <div className="hair" />
        <div className="head" />
        <div className="shoulders" />
      </div>
      <div className={`device device-${device.id}`}>
        <div className="bezel">
          <div className="glass">{children}</div>
        </div>
        {device.id === "laptop" || device.id === "air" ? (
          <div className="keys" />
        ) : (
          <div className="stand" />
        )}
        {device.id === "rig" ? <div className="side-glow" /> : null}
      </div>
    </div>
  );
}
