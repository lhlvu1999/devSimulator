import { useState } from "react";
import { isSeniorOrAbove, LEVEL_TITLE, type Level } from "../game/ladder";
import { t } from "../i18n";
import "./support.css";

export const FEEDBACK_EMAIL = "minotaurebh.mofish@gmail.com";
const QR_SRC = "./art/support/donate-qr.png";
const FEEDBACK_LINK = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent("Dev Simulator feedback")}`;

/** A thank-you from the developer, with a coffee QR and a way to send feedback. Opens at Senior. */
export function SupportPanel({ level }: { level: Level }) {
  const [copied, setCopied] = useState(false);

  if (!isSeniorOrAbove(level)) {
    return (
      <div className="support-locked">
        <LockIcon />
        <strong>{t("Unlocks at Senior engineer")}</strong>
        <p>
          {t("A thank-you from the person who made this game is waiting here.")}
        </p>
        <small>
          {t("You're {title} now.", { title: t(LEVEL_TITLE[level]) })}
        </small>
      </div>
    );
  }

  async function copyEmail() {
    try {
      await navigator.clipboard?.writeText(FEEDBACK_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="support-card">
      <h3>{t("Thank you for playing")}</h3>
      <p>
        {t(
          "You made it to Senior. Thank you for spending so much of your time here. Dev Simulator is a small game made with a lot of love, and if it gave you a few good evenings, you can buy me a coffee ♥",
        )}
      </p>
      <figure className="support-qr">
        <img src={QR_SRC} alt={t("Bank transfer QR code for a coffee")} />
        <figcaption>
          {t("Scan with any banking app that supports VietQR.")}
        </figcaption>
      </figure>
      <p className="support-hint">
        {t(
          "Playing on the phone you bank with? Save the QR to your photos, then open it from the scan screen in your banking app.",
        )}{" "}
        <a href={QR_SRC} download="dev-simulator-coffee-qr.png">
          {t("Save the QR")}
        </a>
      </p>
      <div className="support-feedback">
        <p>
          {t(
            "Have feedback, an idea, or found a bug? I'd love to hear from you:",
          )}
        </p>
        <a className="support-email" href={FEEDBACK_LINK}>
          {FEEDBACK_EMAIL}
        </a>
        <button type="button" className="text-button" onClick={copyEmail}>
          {copied ? t("Copied") : t("Copy email")}
        </button>
      </div>
    </article>
  );
}

function LockIcon() {
  return (
    <svg className="support-lock" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </svg>
  );
}
