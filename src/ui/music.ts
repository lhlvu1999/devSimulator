import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Two background layers the player can mix: lofi music and keyboard typing.
 * Either, both, or none. Each is saved on the device.
 */
export type SoundLayer = "lofi" | "keys";

export const SOUND_LAYERS: readonly SoundLayer[] = ["lofi", "keys"];

export type SoundMix = Record<SoundLayer, boolean>;

/**
 * Both files are loudness-matched when encoded (lofi −20 LUFS, keys −25), so these set the mix:
 * typing sits under the music. Rate slows a layer without changing its pitch.
 */
const LAYERS: Record<
  SoundLayer,
  { src: string; volume: number; rate: number; key: string }
> = {
  lofi: {
    src: "./art/audio/lofi.m4a?v=1",
    volume: 0.45,
    rate: 1,
    key: "dev-simulator-sound-lofi",
  },
  keys: {
    src: "./art/audio/keyboard.m4a?v=1",
    volume: 0.14,
    rate: 0.6,
    key: "dev-simulator-sound-keys",
  },
};

/** Seconds for fades in and out. */
const FADE = 0.4;
/** The single "Music" switch from before. Off there means both layers start off. */
const OLD_MUSIC_KEY = "dev-simulator-music";
const OLDER_SOUND_KEY = "dev-simulator-sound";

type Track = { element: HTMLAudioElement; gain: GainNode };

let context: AudioContext | null = null;
const tracks: Partial<Record<SoundLayer, Track>> = {};
/** Which layers should be audible right now. A fade-out only pauses if its layer is still unwanted. */
const wanted: SoundMix = { lofi: false, keys: false };

/**
 * The tracks are minutes long, so they stream from audio elements instead of being decoded
 * into memory. Web Audio sits behind them only for gain, because iOS ignores element volume.
 * The context and elements are created inside a tap, which iOS requires before any sound.
 */
function trackFor(layer: SoundLayer): Track | null {
  const ready = tracks[layer];
  if (ready) return ready;
  if (typeof AudioContext === "undefined" || typeof Audio === "undefined")
    return null;
  context ??= new AudioContext();
  const element = new Audio(LAYERS[layer].src);
  element.loop = true;
  element.preload = "auto";
  element.defaultPlaybackRate = LAYERS[layer].rate;
  element.playbackRate = LAYERS[layer].rate;
  element.preservesPitch = true;
  const gain = context.createGain();
  gain.gain.value = 0;
  context.createMediaElementSource(element).connect(gain);
  gain.connect(context.destination);
  const track = { element, gain };
  tracks[layer] = track;
  return track;
}

function fade(track: Track, target: number): void {
  if (!context) return;
  track.gain.gain.cancelScheduledValues(context.currentTime);
  track.gain.gain.setTargetAtTime(target, context.currentTime, FADE / 3);
}

function play(layer: SoundLayer): void {
  wanted[layer] = true;
  const track = trackFor(layer);
  if (!track || !context) return;
  void context.resume();
  void track.element.play().catch(() => undefined);
  fade(track, LAYERS[layer].volume);
}

/** Fade out, then pause the layer. With nothing playing, suspend the context to save battery. */
function stop(layer: SoundLayer): void {
  wanted[layer] = false;
  const track = tracks[layer];
  if (!track) return;
  fade(track, 0);
  window.setTimeout(
    () => {
      if (wanted[layer]) return;
      track.element.pause();
      if (!SOUND_LAYERS.some((each) => wanted[each])) void context?.suspend();
    },
    FADE * 1000 * 2,
  );
}

function readMix(): SoundMix {
  try {
    const old =
      localStorage.getItem(OLD_MUSIC_KEY) ??
      localStorage.getItem(OLDER_SOUND_KEY);
    const fallback = old !== "off";
    const read = (layer: SoundLayer) => {
      const saved = localStorage.getItem(LAYERS[layer].key);
      return saved === null ? fallback : saved === "on";
    };
    return { lofi: read("lofi"), keys: read("keys") };
  } catch {
    return { lofi: true, keys: true };
  }
}

/**
 * The background sound mix: both layers on by default. Browsers only allow
 * sound after a tap, so it starts on the player's first tap or key press.
 */
export function useSoundMix(): [
  SoundMix,
  (layer: SoundLayer, on: boolean) => void,
] {
  const [mix, setMix] = useState(readMix);
  const mixRef = useRef(mix);
  useEffect(() => {
    mixRef.current = mix;
  }, [mix]);

  const update = useCallback((layer: SoundLayer, on: boolean) => {
    setMix((current) => ({ ...current, [layer]: on }));
    try {
      localStorage.setItem(LAYERS[layer].key, on ? "on" : "off");
    } catch {
      // Private mode or full storage: the choice lasts for this session only.
    }
    if (on) play(layer);
    else stop(layer);
  }, []);

  useEffect(() => {
    const first = () => {
      for (const layer of SOUND_LAYERS) if (mixRef.current[layer]) play(layer);
    };
    window.addEventListener("pointerdown", first, { once: true });
    window.addEventListener("keydown", first, { once: true });
    return () => {
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("keydown", first);
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (!context) return;
      if (document.hidden) void context.suspend();
      else if (SOUND_LAYERS.some((layer) => wanted[layer]))
        void context.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return [mix, update];
}
