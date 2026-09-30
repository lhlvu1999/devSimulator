import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
    type ReactNode,
  type RefObject,
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
import { useRoomMotion } from "./useRoomMotion";
import { useFitRect } from "./useFitRect";
import "./scene.css";


export type ScenePanel =
  | "work"
  | "invest"
  | "shop"
  | "market"
  | "blackjack"
  | "workline"
  | "interview"
  | "stocks"
  | "free"
  | "me"
  | null;

/** Panels that take over the whole room instead of opening a card. */
const FULL_SCREEN: readonly ScenePanel[] = [
  "work",
  "market",
  "blackjack",
  "workline",
  "interview",
  "stocks",
  "free",
  "invest",
  "shop",
  "me",
];

export type NavTab = "home" | "invest" | "jobs" | "shop" | "me";

/** Screens where the bottom bar steps aside so the task has the whole phone. */
const NO_NAV: readonly ScenePanel[] = ["work", "free", "interview"];

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "invest", label: "Invest" },
  { id: "jobs", label: "Jobs" },
  { id: "shop", label: "Shop" },
  { id: "me", label: "Me" },
];

export function GameView({
  environment,
  deviceId,
  lookId,
  locked,
  panel,
  workDone,
  onWork,
  onEndDay,
  onBack,
  onClose,
  hidden,
  layout,
  boxes,
  onEdit,
  screenTone,
        video,
  hud,
  nav,
  glassLabel,
  overlay,
  children,
}: {
  environment: ScenePlace;
  deviceId: string;
  lookId: string;
  locked: boolean;
  panel: ScenePanel;
  workDone: boolean;
  onWork: () => void;
  onEndDay: () => void;
  /** Where Back goes from a screen inside a tab, like one market inside Invest. */
  onBack?: () => void;
  onClose: () => void;
  hidden?: ReadonlySet<string>;
  layout?: boolean;
  boxes: SceneBoxes;
  onEdit?: (id: string, box: Box) => void;
  screenTone?: string;
  /** When set, the clip is the whole room and the layered entities are skipped. */
    video?: SceneVideo;
  
    /** The strip above the room. Sandbox leaves it out. */
  hud?: ReactNode;
  /** The bottom tab bar. Sandbox leaves it out. */
  nav?: { active: NavTab; jobCount: number; onTab: (tab: NavTab) => void };
  /** What the monitor says once work is off the table: free time, job hunt, a sick week. */
  glassLabel?: string;
  /** Shown over everything, such as an event that needs an answer. */
  overlay?: ReactNode;
  children: ReactNode;
}) {
  const look = lookById(lookId);
  const device = deviceById(deviceId);
  const dual = device.id === "rig" || device.id === "studio";
  const open = locked || panel !== null;
  const frames = useRoomMotion();
    const worldRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
    const fitted = useFitRect(frameRef, video ?? null, video?.screen ?? null);
  const glass = fitted?.box ?? null;
  const glassStyle = fitted
    ? ({
        "--glass-left": `${fitted.box.left}px`,
        "--glass-top": `${fitted.box.top}px`,
        "--glass-width": `${fitted.box.width}px`,
        "--glass-height": `${fitted.box.height}px`,
        "--clip-top": `${Math.max(0, fitted.shown.top)}px`,
      } as CSSProperties)
    : undefined;

  return (
    <div
      ref={worldRef}
            className={`world env-${environment}${open ? " focus" : ""}${layout ? " show-layout" : ""}${video ? " has-video" : ""}${nav ? " with-nav" : ""}`}
      style={glassStyle}
    >
      {video ? (
                <SceneClip video={video} frameRef={frameRef} />
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
          aria-label={workDone ? (glassLabel ?? "Free time") : "Work"}
          style={{
            left: glass.left,
            top: glass.top,
            width: glass.width,
            height: glass.height,
          }}
          onClick={workDone ? onEndDay : onWork}
        >
          {workDone ? <span>{glassLabel ?? "Free time"}</span> : null}
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
          {workDone ? (glassLabel ?? "Free time") : "Work"}
        </button>
      )}
      {FULL_SCREEN.includes(panel) || locked ? (
        <div
          className={`work-screen${screenTone ? ` tone-${screenTone}` : ""}${
            nav && !locked && !NO_NAV.includes(panel) ? " with-nav" : ""
          }${
            video && glass && (panel === "work" || panel === "free")
              ? " from-glass"
              : ""
          }`}
        >
          {!locked && (panel === "work" || panel === "free") ? (
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
              onClick={onBack ?? onClose}
            >
              Back
            </button>
          ) : null}
          {children}
        </div>
      ) : null}
            {hud && !locked ? <div className="scene-hud">{hud}</div> : null}
      {nav && !locked && !layout && !NO_NAV.includes(panel) ? (
        <BottomNav nav={nav} />
      ) : null}
      {overlay}
    </div>
  );
}

function BottomNav({
  nav,
}: {
  nav: { active: NavTab; jobCount: number; onTab: (tab: NavTab) => void };
}) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav-tab tab-${item.id}${nav.active === item.id ? " on" : ""}`}
          aria-current={nav.active === item.id ? "page" : undefined}
          onClick={() => nav.onTab(item.id)}
        >
          <span className="nav-icon" aria-hidden="true">
            <i />
            {item.id === "jobs" && nav.jobCount > 0 ? <b>{nav.jobCount}</b> : null}
          </span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

/**
 * The whole 9:16 clip, never cropped, resting on the tab bar. Any spare space
 * above it is filled with a soft blur of the same scene.
 */
function SceneClip({
  video,
  frameRef,
}: {
  video: SceneVideo;
  frameRef: RefObject<HTMLDivElement | null>;
}) {
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
  
  useEffect(() => {
    const element = ref.current;
    if (!element || still) return;
    const onVisibility = () => {
      if (document.hidden) element.pause();
      else void element.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [still]);
    return (
    <>
      <img className="scene-backdrop" src={video.poster} alt="" aria-hidden="true" />
      <div ref={frameRef} className="scene-frame">
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
      </div>
    </>
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
