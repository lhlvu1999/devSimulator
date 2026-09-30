import { useEffect, useState, type ReactNode } from "react";
import type { Box, SceneBoxes } from "../content/sceneLayout";
import {
  CHARACTER_LAYERS,
  ENVIRONMENT_LAYERS,
  SCENE_PLACES,
  characterArt,
  deviceArt,
  environmentArt,
  type CharacterLayer,
  type DeviceLayer,
  type EnvironmentLayer,
  type ScenePlace,
  DEVICE_LAYERS,
} from "../content/entities";
import {
  LOOKS,
  PREVIEW_DEVICES,
  type DeviceId,
  type LookId,
} from "../content/gear";
import { careerStatus, type CareerState } from "../game/career";
import { ALL_LEVELS, LEVEL_TITLE, trackOf } from "../game/ladder";
import { jumpToLevel, meetMilestones, topUp } from "../game/sandbox";
import { GameView } from "./GameView";

type SlotKey =
  | `environment:${EnvironmentLayer}`
  | `character:${CharacterLayer}`
  | `device:${DeviceLayer}`;

export function Sandbox({
  boxes,
  onEdit,
  onReset,
  career,
  onCareer,
  onPlay,
}: {
  boxes: SceneBoxes;
  onEdit: (id: string, box: Box) => void;
  onReset: () => void;
  career: CareerState;
  onCareer: (next: CareerState) => void;
  onPlay: () => void;
}) {
  const [place, setPlace] = useState<ScenePlace>("home");
  const [look, setLook] = useState<LookId>("plain");
  const [device, setDevice] = useState<DeviceId>("laptop");
  const [panel, setPanel] = useState<
    "work" | "invest" | "shop" | "market" | "blackjack" | null
  >(null);
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
  const [layout, setLayout] = useState(true);

  function toggle(key: SlotKey) {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="sandbox">
      <div className="sandbox-stage">
        <GameView
          environment={place}
          deviceId={device}
          lookId={look}
          locked={false}
          panel={panel}
          hidden={hidden}
          layout={layout}
          boxes={boxes}
          onEdit={layout ? onEdit : undefined}
          onWork={() => setPanel("work")}
          workDone={false}
          onEndDay={() => setPanel(null)}
          onClose={() => setPanel(null)}
        >
          {panel === "work" ? (
            <p className="ask">
              Sample task. A real job would fill this screen.
            </p>
          ) : null}
          {panel === "invest" ? (
            <p className="ask">Sample investments on the glass.</p>
          ) : null}
          {panel === "shop" ? <p className="ask">Sample shop shelf.</p> : null}
        </GameView>
      </div>
      <aside className="sandbox-dock">
        <ChipRow label="View">
          <Chip on={layout} onClick={() => setLayout((value) => !value)}>
            Layout
          </Chip>
          <Chip on={false} onClick={onReset}>
            Reset
          </Chip>
          <Chip
            on={false}
            onClick={() => {
              void navigator.clipboard.writeText(
                JSON.stringify(boxes, null, 2),
              );
            }}
          >
            Copy
          </Chip>
        </ChipRow>
        <CareerTools career={career} onCareer={onCareer} onPlay={onPlay} />
        <ChipRow label="Room">
          {SCENE_PLACES.map((id) => (
            <Chip key={id} on={place === id} onClick={() => setPlace(id)}>
              {id}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label="Character">
          {LOOKS.map((item) => (
            <Chip
              key={item.id}
              on={look === item.id}
              onClick={() => setLook(item.id)}
            >
              {item.id}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label="Device">
          {PREVIEW_DEVICES.map((item) => (
            <Chip
              key={item.id}
              on={device === item.id}
              onClick={() => setDevice(item.id)}
            >
              {item.id}
            </Chip>
          ))}
        </ChipRow>
        <LayerGroup
          title="Environment"
          layers={ENVIRONMENT_LAYERS}
          hidden={hidden}
          src={(layer) => environmentArt(place, layer)}
          onToggle={(layer) => toggle(`environment:${layer}`)}
        />
        <LayerGroup
          title="Character"
          layers={CHARACTER_LAYERS}
          hidden={hidden}
          src={(layer) => characterArt(look, layer)}
          onToggle={(layer) => toggle(`character:${layer}`)}
        />
        <LayerGroup
          title="Device"
          layers={DEVICE_LAYERS}
          hidden={hidden}
          src={(layer) => deviceArt(device, layer)}
          onToggle={(layer) => toggle(`device:${layer}`)}
        />
      </aside>
    </div>
  );
}

function CareerTools({
  career,
  onCareer,
  onPlay,
}: {
  career: CareerState;
  onCareer: (next: CareerState) => void;
  onPlay: () => void;
}) {
  const status = career.company ? careerStatus(career) : null;
  return (
    <div className="career-tools">
      <ChipRow label="Career (changes your Play save)">
        {ALL_LEVELS.map((level) => (
          <Chip
            key={level}
            on={career.company !== null && career.level === level}
            onClick={() => onCareer(jumpToLevel(career, level))}
          >
            {trackOf(level) === "manager" ? "◆ " : ""}
            {LEVEL_TITLE[level]}
          </Chip>
        ))}
      </ChipRow>
      <ChipRow label="Shortcuts">
        <Chip on={false} onClick={() => onCareer(meetMilestones(career))}>
          Meet milestones
        </Chip>
        <Chip on={false} onClick={() => onCareer(topUp(career))}>
          +$1,000, full energy
        </Chip>
        <Chip on={false} onClick={onPlay}>
          Go to Play
        </Chip>
      </ChipRow>
      <p className="career-tools-note">
        {status
          ? `${status.title} at ${career.company?.name}. ${
              status.nextTitle
                ? status.ready
                  ? `Review for ${status.nextTitle} is ready.`
                  : `Next: ${status.nextTitle}.`
                : "Top of this track."
            }`
          : "No job yet. Picking a level skips placement and takes the first offer."}
      </p>
    </div>
  );
}

function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="chip-row">
      <span>{label}</span>
      <div>{children}</div>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className={on ? "chip on" : "chip"} onClick={onClick}>
      {children}
    </button>
  );
}

function LayerGroup<T extends string>({
  title,
  layers,
  hidden,
  src,
  onToggle,
}: {
  title: string;
  layers: readonly T[];
  hidden: ReadonlySet<string>;
  src: (layer: T) => string;
  onToggle: (layer: T) => void;
}) {
  return (
    <div className="layer-group">
      <span>{title}</span>
      {layers.map((layer) => (
        <LayerToggle
          key={layer}
          name={layer}
          file={src(layer)}
          off={hidden.has(`${title.toLowerCase()}:${layer}`)}
          onToggle={() => onToggle(layer)}
        />
      ))}
    </div>
  );
}

function LayerToggle({
  name,
  file,
  off,
  onToggle,
}: {
  name: string;
  file: string;
  off: boolean;
  onToggle: () => void;
}) {
  const status = useFileStatus(file);
  return (
    <button
      type="button"
      className={off ? "layer-toggle off" : "layer-toggle"}
      onClick={onToggle}
    >
      <i className={`dot ${status}`} />
      <span>{name}</span>
      <small>
        {status === "ok"
          ? "applied"
          : status === "missing"
            ? "placeholder"
            : "…"}
      </small>
    </button>
  );
}

function useFileStatus(file: string): "loading" | "ok" | "missing" {
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");
  useEffect(() => {
    let alive = true;
    setStatus("loading");
    const image = new Image();
    image.onload = () => {
      if (alive) setStatus("ok");
    };
    image.onerror = () => {
      if (alive) setStatus("missing");
    };
    image.src = file;
    return () => {
      alive = false;
    };
  }, [file]);
  return status;
}
