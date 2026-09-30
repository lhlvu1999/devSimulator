import { useCallback, useEffect, useRef, useState } from "react";

/** Bump when the track changes so browsers and the iOS web view fetch the new one. */
const MUSIC_SRC = "./art/audio/room-theme.m4a?v=1";
const MUSIC_VOLUME = 0.35;
/** Seconds for fades in and out. */
const FADE = 0.4;
const MUSIC_KEY = "dev-simulator-music";
/** The earlier "room sound" setting, read once so a player's choice carries over. */
const OLD_SOUND_KEY = "dev-simulator-sound";

type Player = { context: AudioContext; gain: GainNode };

let player: Player | null = null;
let starting: Promise<Player | null> | null = null;
/** Whether music should be audible right now. A fade-out only suspends if this is still false. */
let wanted = false;

/**
 * Web Audio loops the track with no gap, which a media element can't promise.
 * The context has to be created inside a tap on iOS, so this does that before its first await.
 */
function startPlayer(): Promise<Player | null> {
  if (player) {
    void player.context.resume();
    return Promise.resolve(player);
  }
  if (starting) return starting;
  if (typeof AudioContext === "undefined") return Promise.resolve(null);
  const context = new AudioContext();
  void context.resume();
  const gain = context.createGain();
  gain.gain.value = 0;
  gain.connect(context.destination);
  starting = fetch(MUSIC_SRC)
    .then((response) => response.arrayBuffer())
    .then((data) => context.decodeAudioData(data))
    .then((buffer) => {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      player = { context, gain };
      return player;
    })
    .catch(() => {
      starting = null;
      void context.close();
      return null;
    });
  return starting;
}

function fadeTo(target: number): void {
  if (!player) return;
  const { gain, context } = player;
  gain.gain.cancelScheduledValues(context.currentTime);
  gain.gain.setTargetAtTime(target, context.currentTime, FADE / 3);
}

function playMusic(): void {
  wanted = true;
  void startPlayer().then((ready) => {
    if (ready && wanted) fadeTo(MUSIC_VOLUME);
  });
}

/** Fade out, then suspend the audio so it stops using the CPU and battery. */
function stopMusic(): void {
  wanted = false;
  fadeTo(0);
  window.setTimeout(() => {
    if (!wanted && player) void player.context.suspend();
  }, FADE * 1000 * 2);
}

function readSetting(): boolean {
  try {
    const saved =
      localStorage.getItem(MUSIC_KEY) ?? localStorage.getItem(OLD_SOUND_KEY);
    return saved !== "off";
  } catch {
    return true;
  }
}

/**
 * The game's music: on by default, saved on the device. Browsers only allow
 * sound after a tap, so it starts on the player's first tap or key press.
 */
export function useMusic(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(readSetting);
  const onRef = useRef(on);
  useEffect(() => {
    onRef.current = on;
  }, [on]);

  const update = useCallback((next: boolean) => {
    setOn(next);
    try {
      localStorage.setItem(MUSIC_KEY, next ? "on" : "off");
    } catch {
      // Private mode or full storage: the choice lasts for this session only.
    }
    if (next) playMusic();
    else stopMusic();
  }, []);

  useEffect(() => {
    const first = () => {
      if (onRef.current) playMusic();
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
      if (!player) return;
            if (document.hidden) void player.context.suspend();
      else if (wanted) void player.context.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return [on, update];
}
