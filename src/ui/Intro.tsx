import { useEffect, useRef } from "react";
import { HOME_VIDEO } from "../content/sceneVideo";
import { LANGS, setLang, t, tc, useLang } from "../i18n";
import "./intro.css";

/** The first thing a new player sees: the room, the name, a language, and Start. */
export function TitleScreen({ onStart }: { onStart: () => void }) {
  const lang = useLang();
  const clip = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = clip.current;
    if (!element) return;
    element.playbackRate = HOME_VIDEO.playbackRate;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
      element.pause();
  }, []);
  return (
    <section className="title-screen">
      <video
        ref={clip}
        className="title-clip"
        src={HOME_VIDEO.src}
        poster={HOME_VIDEO.poster}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="title-card">
        <p className="title-kicker">{t("A cozy career game")}</p>
        <h1 className="title-name">{t("Dev Simulator")}</h1>
        <p className="title-tagline">
          {t(
            "From your first job to wherever you want to go, one week at a time.",
          )}
        </p>
        <div className="title-lang" role="group" aria-label={t("Language")}>
          {LANGS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={lang === option.id ? "on" : ""}
              aria-pressed={lang === option.id}
              onClick={() => setLang(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button type="button" className="title-start" onClick={onStart}>
          {t("Start")}
        </button>
        <p className="title-note">{t("Your progress saves on this device.")}</p>
      </div>
    </section>
  );
}

const STEPS = ["Entry test", "Your goal", "Offers"] as const;

/** Where a new player is in the first three screens. */
export function IntroSteps({ step }: { step: 1 | 2 | 3 }) {
  return (
    <ol className="intro-steps" aria-label={t("Step {n} of 3", { n: step })}>
      {STEPS.map((label, index) => (
        <li
          key={label}
          className={
            index + 1 === step ? "now" : index + 1 < step ? "done" : ""
          }
          aria-current={index + 1 === step ? "step" : undefined}
        >
          <span>{index + 1}</span>
          {tc("step", label)}
        </li>
      ))}
    </ol>
  );
}
