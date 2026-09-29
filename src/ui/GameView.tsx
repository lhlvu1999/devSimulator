import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { boxStyle, type Box, type SceneBoxes } from "../content/sceneLayout";
import type { SceneVideo } from "../content/sceneVideo";
import {
  CHARACTER_LAYERS,
  DEVICE_LAYERS,
  characterArt,
  deviceArt,
  environmentArt,
  type EnvironmentLayer,
  type ScenePlace,
} from "../content/entities";
import { deviceById, lookById, type DeviceId } from "../content/gear";
import { environmentMotion, isMotionLayer } from "../content/motion";
import { formatMoney } from "../game/format";
import type { CareerStatus } from "../game/career";
import type { StatKey, Stats } from "../game/types";
import { WORK_GAME_LABEL } from "../game/workGames";
import { useRoomMotion } from "./useRoomMotion";
import { useCoverRect } from "./useCoverRect";
import "./scene.css";

const METERS: { key: StatKey; label: string; tone: string }[] = [
  { key: "energy", label: "Energy", tone: "clay" },
  { key: "mood", label: "Mood", tone: "blue" },
  { key: "health", label: "Health", tone: "rose" },
  { key: "skill", label: "Skill", tone: "sage" },
  { key: "reputation", label: "Reputation", tone: "ink" },
  { key: "relationship", label: "Relationship", tone: "clay" },
];

export type ScenePanel =
  | "work"
  | "invest"
  | "shop"
  | "market"
  | "blackjack"
  | "workline"
  | "interview"
  | "stocks"
  | null;

/** Panels that take over the whole room instead of opening a card. */
const FULL_SCREEN: readonly ScenePanel[] = [
  "work",
  "market",
  "blackjack",
  "workline",
  "interview",
  "stocks",
];

export function GameView({
  environment,
  deviceId,
  lookId,
  stats,
  locked,
  panel,
  workDone,
  onWork,
  onEndDay,
  onInvest,
  onShop,
  onWorkline,
  jobCount,
  onBack,
  onClose,
  hidden,
  layout,
  boxes,
  onEdit,
  screenTone,
  video,
  career,
  onSwitchTrack,
  children,
}: {
  environment: ScenePlace;
  deviceId: string;
  lookId: string;
  stats: Stats | null;
  locked: boolean;
  panel: ScenePanel;
  workDone: boolean;
  onWork: () => void;
  onEndDay: () => void;
  onInvest: () => void;
  onShop: () => void;
  onWorkline?: () => void;
  jobCount?: number;
  /** Where Back goes from an investing screen. Defaults to the invest hub. */
  onBack?: () => void;
  onClose: () => void;
  hidden?: ReadonlySet<string>;
  layout?: boolean;
  boxes: SceneBoxes;
  onEdit?: (id: string, box: Box) => void;
  screenTone?: string;
  /** When set, the clip is the whole room and the layered entities are skipped. */
  video?: SceneVideo;
  career?: CareerStatus;
  onSwitchTrack?: () => void;
  children: ReactNode;
}) {
  const look = lookById(lookId);
  const device = deviceById(deviceId);
  const dual = device.id === "rig" || device.id === "studio";
  const open = locked || panel !== null;
  const frames = useRoomMotion();
  const worldRef = useRef<HTMLDivElement>(null);
  const glass = useCoverRect(worldRef, video ?? null, video?.screen ?? null);
  const glassStyle = glass
    ? ({
        "--glass-left": `${glass.left}px`,
        "--glass-top": `${glass.top}px`,
        "--glass-width": `${glass.width}px`,
        "--glass-height": `${glass.height}px`,
      } as CSSProperties)
    : undefined;

  return (
    <div
      ref={worldRef}
      className={`world env-${environment}${open ? " focus" : ""}${layout ? " show-layout" : ""}${video ? " has-video" : ""}`}
      style={glassStyle}
    >
      {video ? (
        <SceneClip video={video} />
      ) : (
        <>
          {(
            [
              "wall",
              "window",
              "shelf",
              "floor",
              "cat",
              "lamp",
              "plants",
              "desk",
            ] as const
          ).map((layer) =>
            hidden?.has(`environment:${layer}`) ? null : (
              <RoomLayer
                key={layer}
                place={environment}
                layer={layer}
                frame={isMotionLayer(layer) ? frames[layer] : undefined}
                box={boxes[layer]}
              />
            ),
          )}
          <div
            className={`device device-${device.id}`}
            data-slot={
              onEdit
                ? `device ${boxes.device.left},${boxes.device.top} ${boxes.device.width}×${boxes.device.height}`
                : "device"
            }
            style={boxStyle(boxes.device)}
          >
            {onEdit ? (
              <LayoutHandles id="device" box={boxes.device} onEdit={onEdit} />
            ) : null}
            {DEVICE_LAYERS.filter(
              (layer) => !hidden?.has(`device:${layer}`),
            ).map((layer) => (
              <ArtSlot
                key={layer}
                name={layer}
                className={`slot slot-${layer}`}
                src={deviceArt(device.id as DeviceId, layer)}
              />
            ))}
            <div className="screens" aria-hidden="true">
              <div className="screen-slot" data-slot="screen" />
              {dual ? <div className="screen-slot" data-slot="screen" /> : null}
            </div>
          </div>
          <div
            className={`character hair-${look.hair} shirt-${look.shirt}`}
            data-slot={
              onEdit
                ? `character ${boxes.character.left},${boxes.character.top} ${boxes.character.width}×${boxes.character.height}`
                : "character"
            }
            style={boxStyle(boxes.character)}
            aria-hidden="true"
          >
            {onEdit ? (
              <LayoutHandles
                id="character"
                box={boxes.character}
                onEdit={onEdit}
              />
            ) : null}
            {CHARACTER_LAYERS.filter(
              (layer) => !hidden?.has(`character:${layer}`),
            ).map((layer) => (
              <ArtSlot
                key={layer}
                name={layer}
                className={`slot slot-${layer}`}
                src={characterArt(look.id, layer)}
              />
            ))}
          </div>
          {hidden?.has("environment:greenery") ? null : (
            <RoomLayer
              place={environment}
              layer="greenery"
              frame={frames.greenery}
              box={boxes.greenery}
            />
          )}
        </>
      )}
      {locked || layout || FULL_SCREEN.includes(panel) ? null : video &&
        glass ? (
        <button
          type="button"
          className={`glass-option${workDone ? " done" : ""}`}
          aria-label={workDone ? "End the day" : "Work"}
          style={{
            left: glass.left,
            top: glass.top,
            width: glass.width,
            height: glass.height,
          }}
          onClick={workDone ? onEndDay : onWork}
        >
          {workDone ? <span>End the day</span> : null}
        </button>
      ) : (
        <button
          type="button"
          className="work-option"
          style={{
            left: `${boxes.device.left + boxes.device.width * (dual ? 0.28 : 0.5)}%`,
            top: `${boxes.device.top + boxes.device.height * 0.46}%`,
          }}
          onClick={workDone ? onEndDay : onWork}
        >
          {workDone ? "End the day" : "Work"}
        </button>
      )}
      {locked || layout ? null : (
        <CornerEntity
          kind="chart"
          label="Invest"
          open={panel === "invest"}
          onOpen={onInvest}
          onClose={onClose}
        >
          {panel === "invest" ? children : null}
        </CornerEntity>
      )}
      {locked || layout ? null : (
        <CornerEntity
          kind="shop"
          label="Shop"
          open={panel === "shop"}
          onOpen={onShop}
          onClose={onClose}
        >
          {panel === "shop" ? children : null}
        </CornerEntity>
      )}
      {locked || layout || !onWorkline ? null : (
        <button
          type="button"
          className={`corner-entity corner-phone${panel === "workline" ? " on" : ""}`}
          aria-label="Workline"
          onClick={onWorkline}
        >
          <span className="phone-mark" aria-hidden="true">
            <i />
            {jobCount ? <b>{jobCount}</b> : null}
          </span>
        </button>
      )}
      {stats && !layout ? (
        <StatsEntity
          stats={stats}
          career={career}
          onSwitchTrack={onSwitchTrack}
        />
      ) : null}
      {FULL_SCREEN.includes(panel) || locked ? (
        <div
          className={`work-screen${screenTone ? ` tone-${screenTone}` : ""}${
            video && glass && panel === "work" ? " from-glass" : ""
          }`}
        >
          {!locked && (panel === "work" || panel === "workline") ? (
            <button type="button" className="monitor-close" onClick={onClose}>
              Desk
            </button>
          ) : null}
          {!locked &&
          (panel === "market" ||
            panel === "blackjack" ||
            panel === "stocks") ? (
            <button
              type="button"
              className="monitor-close"
              onClick={onBack ?? onInvest}
            >
              Back
            </button>
          ) : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}

function SceneClip({ video }: { video: SceneVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(
    () =>
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const onChange = () => setStill(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.playbackRate = video.playbackRate;
    if (still) element.pause();
    else void element.play().catch(() => undefined);
  }, [still, video.playbackRate, video.src]);
  return (
    <video
      ref={ref}
      className="scene-clip"
      src={video.src}
      poster={video.poster}
      autoPlay={!still}
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onLoadedMetadata={(event) => {
        event.currentTarget.playbackRate = video.playbackRate;
      }}
    />
  );
}

function CornerEntity({
  kind,
  label,
  open,
  onOpen,
  onClose,
  children,
}: {
  kind: "chart" | "shop";
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        className={`corner-entity corner-${kind}${open ? " on" : ""}`}
        aria-label={label}
        onClick={open ? onClose : onOpen}
      >
        {kind === "chart" ? (
          <span className="chart-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : (
          <span className="shop-bag" aria-hidden="true">
            <i />
          </span>
        )}
      </button>
      {open ? (
        <div className="chart-panel">
          <button type="button" className="monitor-close" onClick={onClose}>
            Desk
          </button>
          {children}
        </div>
      ) : null}
    </>
  );
}

function StatsEntity({
  stats,
  career,
  onSwitchTrack,
}: {
  stats: Stats;
  career?: CareerStatus;
  onSwitchTrack?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState<StatKey | null>(null);
  const toggleTip = (key: StatKey) =>
    setTip((current) => (current === key ? null : key));
  return (
    <>
      <button
        type="button"
        className={`stats-entity${open ? " on" : ""}`}
        aria-label="Stats"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="stats-mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>
      {open ? (
        <div className="stats-panel">
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
              const filled = Math.max(0, Math.min(100, value));
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
                    <span>{value}</span>
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
          {career ? (
            <CareerCard career={career} onSwitchTrack={onSwitchTrack} />
          ) : null}
        </div>
      ) : null}
    </>
  );
}

/** What each stat is for, without numbers. The player works out the details by playing. */
const STAT_HINT: Record<StatKey, string> = {
  money: "Pays rent and buys gear, snacks, and investments.",
  energy: "Every task uses some. It comes back overnight.",
  mood: "How you feel about work and life lately.",
  health: "Your body. When it runs low, every task feels heavier.",
  skill: "What you know. It brings harder work and opens early promotions.",
  reputation: "How the company sees you. Bigger promotions look at it.",
  relationship:
    "How close you are with your team. Teammates help more when it is high.",
};

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
                ? " · review tomorrow"
                : " · review ready"
              : ""}
          </span>
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

function RoomLayer({
  place,
  layer,
  frame,
  box,
}: {
  place: ScenePlace;
  layer: EnvironmentLayer;
  frame?: number;
  box?: Box;
}) {
  const motion = frame != null && isMotionLayer(layer);
  return (
    <ArtSlot
      name={`room ${layer}`}
      className={`slot slot-${layer}`}
      src={
        motion
          ? environmentMotion(place, layer, frame)
          : environmentArt(place, layer)
      }
      fallbackSrc={motion ? environmentArt(place, layer) : undefined}
      box={box}
      framed
    />
  );
}

function ArtSlot({
  className,
  src,
  fallbackSrc,
  name,
  box,
  framed,
  editing,
  onEdit,
}: {
  className: string;
  src: string;
  fallbackSrc?: string;
  name: string;
  box?: Box;
  framed?: boolean;
  editing?: boolean;
  onEdit?: (id: string, box: Box) => void;
}) {
  const [stage, setStage] = useState<"primary" | "fallback" | "empty">(
    "primary",
  );
  useEffect(() => {
    setStage("primary");
  }, [name, fallbackSrc]);
  const shown = stage === "fallback" ? fallbackSrc : src;
  const filled = stage !== "empty" && Boolean(shown);
  const useFrame = Boolean(framed && filled);
  const id = name.replace("room ", "");
  return (
    <div
      className={`${className}${useFrame ? " frame-layer" : ""}`}
      data-slot={
        box && editing
          ? `${name} ${box.left},${box.top} ${box.width}×${box.height}`
          : name
      }
      style={useFrame || !box ? undefined : boxStyle(box)}
    >
      {filled ? (
        <img
          src={shown}
          alt=""
          onError={() =>
            setStage((current) =>
              current === "primary" && fallbackSrc ? "fallback" : "empty",
            )
          }
        />
      ) : null}
      {box && editing && onEdit && !useFrame ? (
        <LayoutHandles id={id} box={box} onEdit={onEdit} />
      ) : null}
    </div>
  );
}

function LayoutHandles({
  id,
  box,
  onEdit,
}: {
  id: string;
  box: Box;
  onEdit: (id: string, box: Box) => void;
}) {
  function begin(event: ReactPointerEvent, mode: "move" | "resize") {
    event.preventDefault();
    event.stopPropagation();
    const world = event.currentTarget.closest(".world");
    if (!world) return;
    const bounds = world.getBoundingClientRect();
    const originX = event.clientX;
    const originY = event.clientY;
    const start = box;
    function move(next: PointerEvent) {
      const dx = ((next.clientX - originX) / bounds.width) * 100;
      const dy = ((next.clientY - originY) / bounds.height) * 100;
      if (mode === "move") {
        onEdit(id, {
          ...start,
          left: Math.round((start.left + dx) * 10) / 10,
          top: Math.round((start.top + dy) * 10) / 10,
        });
      } else {
        onEdit(id, {
          ...start,
          width: Math.max(4, Math.round((start.width + dx) * 10) / 10),
          height: Math.max(4, Math.round((start.height + dy) * 10) / 10),
        });
      }
    }
    function end() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  }

  return (
    <>
      <button
        type="button"
        className="layout-grip"
        aria-label={`Move ${id}`}
        onPointerDown={(event) => begin(event, "move")}
      />
      <button
        type="button"
        className="layout-resize"
        aria-label={`Resize ${id}`}
        onPointerDown={(event) => begin(event, "resize")}
      />
    </>
  );
}
