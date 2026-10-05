import { useState } from "react";
import { TIER_LABEL, WORKPLACE_LABEL, workplaceOf } from "../content/companies";
import { deviceById } from "../content/gear";
import {
    careerStatus,
  difficultyFor,
  paydayFor,
  playerCv,
  ticketEnergyCost,
  type CareerState,
} from "../game/career";
import { FIT_LABEL, cvLines, cvMatch, fitOf, taskScaleFor, type Cv, type Fit } from "../game/cv";
import type { Difficulty } from "../game/difficulty";
import { formatMoney } from "../game/format";
import { LEVEL_GAMES, LEVEL_TITLE, levelGap, type Level } from "../game/ladder";
import { pickGame, WORK_GAME_LABEL } from "../game/workGames";
import {
  BENEFIT_HINT,
  BENEFIT_LABEL,
  companyById,
  daysLeft,
  interviewRounds,
  offeredCompany,
  postPay,
  type JobPost,
  type SocialPost,
} from "../game/workline";
import type { PayPackage } from "../game/pay";
import {
  ASK_RAISE,
  askChance,
  chanceLabel,
  leverage,
  leverageLabel,
  negotiate,
  type Ask,
  type NegotiationResult,
} from "../game/negotiate";
import { trackOf } from "../game/ladder";
import { moodSeconds } from "../game/life";
import { TicketFor } from "./WorkSession";
import { t, tn } from "../i18n";

/** Cash and stock parts of one payday, as a small bar and a line of text. */
export function PaySplit({ pay }: { pay: PayPackage }) {
  if (!pay.ticker || pay.stock <= 0) {
    return (
      <span className="pay-split">{t("All cash. This company is not listed.")}</span>
    );
  }
  const cashShare = Math.round((pay.cash / pay.total) * 100);
  return (
    <span className="pay-split">
      <span className="pay-bar" aria-hidden="true">
        <i style={{ width: `${cashShare}%` }} />
      </span>
            {t("{cash} cash + {stock} in {ticker} stock", {
        cash: formatMoney(pay.cash),
        stock: formatMoney(pay.stock),
        ticker: pay.ticker,
      })}
    </span>
  );
}

function closesText(left: number): string {
    if (left <= 0) return t("Closes today");
  if (left === 1) return t("Closes tomorrow");
  return t("Closes in {n} days", { n: left });
}

function CompanyBadge({ companyId }: { companyId: string }) {
  const company = companyById(companyId);
  return (
    <span
      className={`company-badge type-${company?.type ?? "startup"}`}
      aria-hidden="true"
    >
      {company?.name.charAt(0) ?? "?"}
    </span>
  );
}

export function WorklineFeed({
  state,
  onApply,
  onInterview,
}: {
  state: CareerState;
  onApply: (post: JobPost) => void;
  onInterview: (post: JobPost) => void;
}) {
  const status = careerStatus(state);
  const cost = ticketEnergyCost(state);
  const cv = playerCv(state);
  const current = paydayFor(state);
  const posts = state.feed.posts;
  const social = state.feed.social;
  const items: (
    { kind: "job"; post: JobPost } | { kind: "social"; post: SocialPost }
  )[] = [];
  const longest = Math.max(posts.length, social.length);
  for (let index = 0; index < longest; index += 1) {
    const job = posts[index];
    const note = social[index];
    if (job) items.push({ kind: "job", post: job });
    if (note) items.push({ kind: "social", post: note });
  }

  return (
    <section className="screen workline">
      <div className="workline-head">
        <span className="workline-logo">{t("Workline")}</span>
        <span className="workline-sub">
          {t("Jobs and news from people you might know")}</span>
      </div>
      <div className="workline-me">
                <strong>{t(status.title)}</strong>
        <span>
          {state.company?.name} · {t("Payday {amount}", { amount: formatMoney(current) })}
        </span>
                <span className="workline-cv">
                    {tn(
            cv.experience,
            "Your CV: skill {skill} · {n} week of experience · reputation {reputation}",
            "Your CV: skill {skill} · {n} weeks of experience · reputation {reputation}",
            { skill: cv.skill, reputation: cv.reputation },
          )}
          {cv.certificates > 0
            ? ` · ${tn(cv.certificates, "{n} certificate", "{n} certificates")}`
            : ""}
        </span>
        <span className="workline-count">
                    {tn(
            posts.length,
            "{n} job picked for you. HR reads your CV first.",
            "{n} jobs picked for you. HR reads your CV first.",
          )}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="ask">{t("Nothing new yet. New posts show up each morning.")}</p>
      ) : null}
      {items.map((item) =>
        item.kind === "job" ? (
                    <JobCard
            key={item.post.id}
            post={item.post}
            day={state.day}
            currentPay={current}
            currentLevel={state.level}
            cv={cv}
            energy={state.stats.energy}
            cost={cost}
            onApply={() => onApply(item.post)}
            onInterview={() => onInterview(item.post)}
          />
        ) : (
          <article key={item.post.id} className="social-post">
            <div className="social-author">
              <span className="avatar" aria-hidden="true">
                {item.post.author.charAt(0)}
              </span>
              <span>
                <strong>{item.post.author}</strong>
                                <small>{t(item.post.role)}</small>
              </span>
            </div>
            <p>{t(item.post.text)}</p>
            <span className="social-likes">{t("{n} likes", { n: item.post.likes })}</span>
          </article>
        ),
      )}
    </section>
  );
}

const FIT_NOTE: Record<Fit, string> = {
  strong: "You meet every requirement. HR will call.",
  close: "Close. HR might call.",
  reach: "A long shot. HR rarely calls this far off.",
};

function JobCard({
  post,
  day,
  currentPay,
  currentLevel,
  cv,
  energy,
  cost,
  onApply,
  onInterview,
}: {
  post: JobPost;
  day: number;
  currentPay: number;
  currentLevel: Level;
  cv: Cv;
  energy: number;
  cost: number;
  onApply: () => void;
  onInterview: () => void;
}) {
  const lines = cvLines(cv, post.level);
  const fit = fitOf(cvMatch(cv, post.level));
  const gap = levelGap(currentLevel, post.level);
  const company = offeredCompany(post);
  if (!company) return null;
  const pay = postPay(post);
  const raise =
    currentPay > 0
      ? Math.round(((pay.total - currentPay) / currentPay) * 100)
      : 0;
  const left = daysLeft(post, day);
  const tired = energy < cost;
  return (
    <article className="job-post">
      <div className="job-top">
        <CompanyBadge companyId={post.companyId} />
        <span className="job-company">
          <strong>{company.name}</strong>
          <small>
                        {t(TIER_LABEL[company.tier])} · {t(WORKPLACE_LABEL[workplaceOf(company)])}
          </small>
        </span>
        <span className={`job-closes${left <= 1 ? " soon" : ""}`}>
          {closesText(left)}
        </span>
      </div>
            <h3 className="job-role">
                {t(LEVEL_TITLE[post.level])}
        {gap > 0 ? (
          <span className="stretch-tag">
            {gap === 1 ? t("Step up") : t("{n} levels up", { n: gap })}
          </span>
        ) : null}
      </h3>
      <p className="job-pay">
                {t("Payday {amount}", { amount: formatMoney(pay.total) })}
        <span className={raise >= 0 ? "change up" : "change down"}>
          {t("{percent}% vs now", { percent: `${raise >= 0 ? "+" : ""}${raise}` })}
        </span>
      </p>
      <PaySplit pay={pay} />
      <div className="job-benefits">
        {post.benefits.map((benefit) => (
          <span
            key={benefit}
            className={`benefit benefit-${benefit}`}
                        title={t(BENEFIT_HINT[benefit])}
          >
            {t(BENEFIT_LABEL[benefit])}
          </span>
        ))}
      </div>
      <p className="job-work">
                {t("Work: {games}", {
          games: LEVEL_GAMES[post.level].map((game) => t(WORK_GAME_LABEL[game])).join(", "),
        })}
      </p>
            {lines.length > 0 ? (
        <div className="job-needs">
          <span className="job-needs-head">
                        {t("HR is looking for")}
            {post.application ? null : <b className={`fit-badge fit-${fit}`}>{t(FIT_LABEL[fit])}</b>}
          </span>
          <ul>
            {lines.map((line) => (
              <li key={line.id} className={line.met ? "met" : "short"}>
                <span aria-hidden="true">{line.met ? "✓" : "✗"}</span>
                                {line.id === "experience"
                  ? t("{label} {n} weeks", { label: t(line.label), n: line.need })
                  : `${t(line.label)} ${line.need}`}
                {line.met ? null : <small> · {t("you have {n}", { n: line.have })}</small>}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {post.application === "rejected" ? (
        <button type="button" className="job-apply" disabled>
          {t("Not moving forward")}</button>
      ) : post.application === "shortlisted" ? (
        <button type="button" className="job-apply" disabled={tired} onClick={onInterview}>
                    {tired
            ? t("Interview needs {n} energy", { n: cost })
            : t("Shortlisted · Interview, {n} rounds", { n: interviewRounds(post, currentLevel) })}
        </button>
      ) : (
        <>
          <button type="button" className="job-apply" onClick={onApply}>
            {t("Send CV")}</button>
                    <small className={`fit-note fit-${fit}`}>{t(FIT_NOTE[fit])}</small>
        </>
      )}
    </article>
  );
}

const OUTCOME_TEXT: Record<NegotiationResult, string> = {
  raised: "They said yes. The new pay is below.",
  held: "They held firm. The offer stays the same.",
  pulled: "They felt pushed and pulled the offer.",
};

function OfferScreen({
  state,
  post,
  seed,
  onAccept,
  onReject,
  onPulled,
}: {
  state: CareerState;
  post: JobPost;
  seed: number;
  onAccept: (offer: JobPost) => void;
  onReject: () => void;
  onPulled: () => void;
}) {
  const [offer, setOffer] = useState(post);
  const [outcome, setOutcome] = useState<NegotiationResult | null>(null);
  const [asking, setAsking] = useState(false);
  const company = offeredCompany(offer);
  const track = trackOf(state.level);
  const power = leverage(state.stats, track);
    const pay = postPay(offer);
  const before = postPay(post);
  const taskScale = taskScaleFor(playerCv(state), offer.level);
  if (!company) return null;

  function ask(size: Ask) {
    const next = negotiate(offer, power, size, (seed ^ 0x5bd1e995) >>> 0);
    setOutcome(next.result);
    setOffer(next.post);
    setAsking(false);
  }

  if (outcome === "pulled") {
    return (
      <section className="screen interview">
                <p className="kicker">{t("Offer · {company}", { company: company.name })}</p>
        <h2>{t("The offer is gone")}</h2>
        <p className="ask">
          {t(OUTCOME_TEXT.pulled)}{" "}
          {t("{company} won't talk to you for a few days.", { company: company.name })}
        </p>
        <button type="button" className="primary" onClick={onPulled}>
          {t("Back to Workline")}</button>
      </section>
    );
  }

  return (
    <section className="screen interview">
            <p className="kicker">{t("Offer · {company}", { company: company.name })}</p>
      <h2>{t("You got the offer")}</h2>
      <div className="offer-summary">
        <span>{t("Role")}</span>
                <strong>{t(LEVEL_TITLE[offer.level])}</strong>
        <span>{t("Payday")}</span>
        <strong>
          {formatMoney(pay.total)}
          {pay.total > before.total ? (
            <span className="change up">
              {" "}
              +{formatMoney(pay.total - before.total)}
            </span>
          ) : null}
          <PaySplit pay={pay} />
        </strong>
                <span>{t("Place")}</span>
        <strong>
                    {t(TIER_LABEL[company.tier])} · {t(WORKPLACE_LABEL[workplaceOf(company)])}
        </strong>
        <span>{t("Next promotion")}</span>
        <strong>
          {taskScale < 1
            ? t("{percent}% fewer tasks, thanks to your CV", {
                percent: Math.round((1 - taskScale) * 100),
              })
            : t("Tasks start from zero")}
        </strong>
      </div>
      <div className="job-benefits">
        {offer.benefits.map((benefit) => (
          <span key={benefit} className={`benefit benefit-${benefit}`}>
                        {t(BENEFIT_LABEL[benefit])} · {t(BENEFIT_HINT[benefit])}
          </span>
        ))}
      </div>
      {outcome ? (
        <p className={`negotiate-result result-${outcome}`}>
                    {t(OUTCOME_TEXT[outcome])}
        </p>
      ) : null}
      {!outcome && asking ? (
        <div className="negotiate">
          <div className="leverage">
            <span>{t("Your leverage")}</span>
                        <strong>{t(leverageLabel(power))}</strong>
            <span className="leverage-bar" aria-hidden="true">
              <i style={{ width: `${Math.min(100, power)}%` }} />
            </span>
                        <small>
              {track === "manager"
                ? t("Built from your reputation, your team relationship, and your mood.")
                : t("Built from your reputation, your skill, and your mood.")}
            </small>
          </div>
          {(["small", "big"] as const).map((size) => {
            const chance = askChance(power, size);
            return (
              <button
                key={size}
                type="button"
                className={`negotiate-ask ask-${size}`}
                onClick={() => ask(size)}
              >
                <strong>
                                    {size === "small" ? t("Ask for a little more") : t("Ask for a lot more")}
                </strong>
                <small>
                                    {t("+{percent}% salary", { percent: Math.round(ASK_RAISE[size] * 100) })} ·{" "}
                  {t(chanceLabel(chance))}
                  {size === "big" ? ` · ${t("they may walk away")}` : ""}
                </small>
              </button>
            );
          })}
          <button
            type="button"
            className="text-button"
            onClick={() => setAsking(false)}
          >
            {t("Never mind")}</button>
        </div>
      ) : null}
      <div className="offer-actions">
        <button
          type="button"
          className="primary"
          onClick={() => onAccept(offer)}
        >
                    {t("Accept and join {company}", { company: company.name })}
        </button>
        {!outcome && !asking ? (
          <button
            type="button"
            className="offer-secondary"
            onClick={() => setAsking(true)}
          >
            {t("Negotiate")}</button>
        ) : null}
        <button
          type="button"
          className="offer-secondary reject"
          onClick={onReject}
        >
          {t("Reject offer")}</button>
      </div>
    </section>
  );
}

export function InterviewSession({
  state,
  post,
  onPass,
  onFail,
  onReject,
  onPulled,
}: {
  state: CareerState;
  post: JobPost;
  onPass: (offer: JobPost) => void;
  onFail: () => void;
  onReject: () => void;
  onPulled: () => void;
}) {
  const [round, setRound] = useState(0);
  const [seed, setSeed] = useState(
    (state.rngState ^ (Number(post.id.replace(/\D/g, "")) * 2654435761)) >>> 0,
  );
  const [result, setResult] = useState<"pass" | "fail" | null>(null);
  const company = offeredCompany(post);
  const device = deviceById(state.deviceId);
    const rounds = interviewRounds(post, state.level);
  const base = difficultyFor(state);
  const difficulty: Difficulty =
    levelGap(state.level, post.level) > 0 ? "hard" : base === "easy" ? "normal" : base;
  const picked = pickGame(seed, company?.type, LEVEL_GAMES[post.level]);

  if (result === "fail") {
    return (
      <section className="screen interview">
                <p className="kicker">{t("Interview · {company}", { company: company?.name ?? "" })}</p>
        <h2>{t("They went another way")}</h2>
        <p className="ask">
          {t("{company} will not look at you again for a few days. Other posts are still open.", {
            company: company?.name ?? "",
          })}
        </p>
        <button type="button" className="primary" onClick={onFail}>
          {t("Back to Workline")}</button>
      </section>
    );
  }

  if (result === "pass" && company) {
    return (
      <OfferScreen
        state={state}
        post={post}
        seed={seed}
        onAccept={onPass}
        onReject={onReject}
        onPulled={onPulled}
      />
    );
  }

  return (
    <section className="screen interview">
      <div className="review-head">
        <p className="kicker">
                    {t("Interview · {company}", { company: company?.name ?? "" })} ·{" "}
          {t(LEVEL_TITLE[post.level])}
        </p>
        <div
          className="ship-lights"
                    aria-label={t("Round {round} of {rounds}", { round: round + 1, rounds })}
        >
          {Array.from({ length: rounds }, (_, index) => (
            <span key={index} className={index < round ? "on" : ""} />
          ))}
        </div>
      </div>
      <p className="ask">
                {t("Round {round} of {rounds}: {game}. A miss ends the interview.", {
          round: round + 1,
          rounds,
          game: t(WORK_GAME_LABEL[picked.game]),
        })}
      </p>
      <TicketFor
        key={seed}
        game={picked.game}
        seed={picked.rngState}
        difficulty={difficulty}
        relationship={Math.min(state.stats.relationship, 39)}
        bonus={device.timeBonus + moodSeconds(state.stats.mood)}
        onDone={(grade, _left, nextSeed) => {
          if (grade === "miss") {
            setResult("fail");
            return;
          }
          if (round + 1 >= rounds) {
            setResult("pass");
            return;
          }
          setRound((value) => value + 1);
          setSeed(nextSeed);
        }}
      />
    </section>
  );
}
