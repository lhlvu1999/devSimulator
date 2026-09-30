import { useState } from "react";
import { TIER_LABEL, TYPE_LABEL } from "../content/companies";
import { deviceById } from "../content/gear";
import {
  careerStatus,
  difficultyFor,
  paydayFor,
  ticketEnergyCost,
  type CareerState,
} from "../game/career";
import type { Difficulty } from "../game/difficulty";
import { formatMoney } from "../game/format";
import { LEVEL_GAMES, LEVEL_TITLE } from "../game/ladder";
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

/** Cash and stock parts of one payday, as a small bar and a line of text. */
export function PaySplit({ pay }: { pay: PayPackage }) {
  if (!pay.ticker || pay.stock <= 0) {
    return (
      <span className="pay-split">All cash. This company is not listed.</span>
    );
  }
  const cashShare = Math.round((pay.cash / pay.total) * 100);
  return (
    <span className="pay-split">
      <span className="pay-bar" aria-hidden="true">
        <i style={{ width: `${cashShare}%` }} />
      </span>
      {formatMoney(pay.cash)} cash + {formatMoney(pay.stock)} in {pay.ticker}{" "}
      stock
    </span>
  );
}

function closesText(left: number): string {
  if (left <= 0) return "Closes today";
  if (left === 1) return "Closes tomorrow";
  return `Closes in ${left} days`;
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
}: {
  state: CareerState;
  onApply: (post: JobPost) => void;
}) {
  const status = careerStatus(state);
  const cost = ticketEnergyCost(state);
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
        <span className="workline-logo">Workline</span>
        <span className="workline-sub">
          Jobs and news from people you might know
        </span>
      </div>
      <div className="workline-me">
        <strong>{status.title}</strong>
        <span>
          {state.company?.name} · Payday {formatMoney(current)}
        </span>
        <span className="workline-count">
          {posts.length} job{posts.length === 1 ? "" : "s"} picked for you
        </span>
      </div>
      {items.length === 0 ? (
        <p className="ask">Nothing new yet. New posts show up each morning.</p>
      ) : null}
      {items.map((item) =>
        item.kind === "job" ? (
          <JobCard
            key={item.post.id}
            post={item.post}
            day={state.day}
            currentPay={current}
            energy={state.stats.energy}
            cost={cost}
            onApply={() => onApply(item.post)}
          />
        ) : (
          <article key={item.post.id} className="social-post">
            <div className="social-author">
              <span className="avatar" aria-hidden="true">
                {item.post.author.charAt(0)}
              </span>
              <span>
                <strong>{item.post.author}</strong>
                <small>{item.post.role}</small>
              </span>
            </div>
            <p>{item.post.text}</p>
            <span className="social-likes">{item.post.likes} likes</span>
          </article>
        ),
      )}
    </section>
  );
}

function JobCard({
  post,
  day,
  currentPay,
  energy,
  cost,
  onApply,
}: {
  post: JobPost;
  day: number;
  currentPay: number;
  energy: number;
  cost: number;
  onApply: () => void;
}) {
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
            {TIER_LABEL[company.tier]} · {TYPE_LABEL[company.type]}
          </small>
        </span>
        <span className={`job-closes${left <= 1 ? " soon" : ""}`}>
          {closesText(left)}
        </span>
      </div>
      <h3 className="job-role">
        {LEVEL_TITLE[post.level]}
        {post.stretch ? (
          <span className="stretch-tag">Stretch role</span>
        ) : null}
      </h3>
      <p className="job-pay">
        Payday {formatMoney(pay.total)}
        <span className={raise >= 0 ? "change up" : "change down"}>
          {raise >= 0 ? "+" : ""}
          {raise}% vs now
        </span>
      </p>
      <PaySplit pay={pay} />
      <div className="job-benefits">
        {post.benefits.map((benefit) => (
          <span
            key={benefit}
            className={`benefit benefit-${benefit}`}
            title={BENEFIT_HINT[benefit]}
          >
            {BENEFIT_LABEL[benefit]}
          </span>
        ))}
      </div>
      <p className="job-work">
        Work:{" "}
        {LEVEL_GAMES[post.level]
          .map((game) => WORK_GAME_LABEL[game])
          .join(", ")}
      </p>
      <button
        type="button"
        className="job-apply"
        disabled={tired}
        onClick={onApply}
      >
        {tired
          ? `Interview needs ${cost} energy`
          : `Interview · ${interviewRounds(post)} rounds`}
      </button>
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
        <p className="kicker">Offer · {company.name}</p>
        <h2>The offer is gone</h2>
        <p className="ask">
          {OUTCOME_TEXT.pulled} {company.name} won't talk to you for a few days.
        </p>
        <button type="button" className="primary" onClick={onPulled}>
          Back to Workline
        </button>
      </section>
    );
  }

  return (
    <section className="screen interview">
      <p className="kicker">Offer · {company.name}</p>
      <h2>You got the offer</h2>
      <div className="offer-summary">
        <span>Role</span>
        <strong>{LEVEL_TITLE[offer.level]}</strong>
        <span>Payday</span>
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
        <span>Place</span>
        <strong>
          {TIER_LABEL[company.tier]} · {TYPE_LABEL[company.type]}
        </strong>
      </div>
      <div className="job-benefits">
        {offer.benefits.map((benefit) => (
          <span key={benefit} className={`benefit benefit-${benefit}`}>
            {BENEFIT_LABEL[benefit]} · {BENEFIT_HINT[benefit]}
          </span>
        ))}
      </div>
      {outcome ? (
        <p className={`negotiate-result result-${outcome}`}>
          {OUTCOME_TEXT[outcome]}
        </p>
      ) : null}
      {!outcome && asking ? (
        <div className="negotiate">
          <div className="leverage">
            <span>Your leverage</span>
            <strong>{leverageLabel(power)}</strong>
            <span className="leverage-bar" aria-hidden="true">
              <i style={{ width: `${Math.min(100, power)}%` }} />
            </span>
            <small>
              Built from your reputation, your{" "}
              {track === "manager" ? "team relationship" : "skill"}, and your
              mood.
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
                  {size === "small"
                    ? "Ask for a little more"
                    : "Ask for a lot more"}
                </strong>
                <small>
                  +{Math.round(ASK_RAISE[size] * 100)}% salary ·{" "}
                  {chanceLabel(chance)}
                  {size === "big" ? " · they may walk away" : ""}
                </small>
              </button>
            );
          })}
          <button
            type="button"
            className="text-button"
            onClick={() => setAsking(false)}
          >
            Never mind
          </button>
        </div>
      ) : null}
      <div className="offer-actions">
        <button
          type="button"
          className="primary"
          onClick={() => onAccept(offer)}
        >
          Accept and join {company.name}
        </button>
        {!outcome && !asking ? (
          <button
            type="button"
            className="offer-secondary"
            onClick={() => setAsking(true)}
          >
            Negotiate
          </button>
        ) : null}
        <button
          type="button"
          className="offer-secondary reject"
          onClick={onReject}
        >
          Reject offer
        </button>
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
  const rounds = interviewRounds(post);
  const base = difficultyFor(state);
  const difficulty: Difficulty = post.stretch
    ? "hard"
    : base === "easy"
      ? "normal"
      : base;
  const picked = pickGame(seed, company?.type, LEVEL_GAMES[post.level]);

  if (result === "fail") {
    return (
      <section className="screen interview">
        <p className="kicker">Interview · {company?.name}</p>
        <h2>They went another way</h2>
        <p className="ask">
          {company?.name} will not look at you again for a few days. Other posts
          are still open.
        </p>
        <button type="button" className="primary" onClick={onFail}>
          Back to Workline
        </button>
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
          Interview · {company?.name} · {LEVEL_TITLE[post.level]}
        </p>
        <div
          className="ship-lights"
          aria-label={`Round ${round + 1} of ${rounds}`}
        >
          {Array.from({ length: rounds }, (_, index) => (
            <span key={index} className={index < round ? "on" : ""} />
          ))}
        </div>
      </div>
      <p className="ask">
        Round {round + 1} of {rounds}: {WORK_GAME_LABEL[picked.game]}. A miss
        ends the interview.
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
