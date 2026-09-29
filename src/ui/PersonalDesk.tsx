import { useState } from "react";
import {
  dealRound,
  handValue,
  hitRound,
  payout,
  standRound,
  type BlackjackRound,
  type Card,
  type Suit,
} from "../game/blackjack";
import {
  buyAsset,
  buyGear,
  consumeItem,
  sellAsset,
  settleBlackjack,
  type CareerState,
} from "../game/career";
import { DEVICES, LOOKS } from "../content/gear";
import { PANTRY } from "../content/pantry";
import { formatMoney } from "../game/format";
import {
  MARKET_IDS,
  STOCKS,
  dayChange,
  isStock,
  marketBlurb,
  marketLabel,
  marketRisk,
  newsFor,
  stockForCompany,
  type MarketId,
  type StockId,
  type StockNews,
} from "../game/market";
import { InvestIcon, iconFor } from "./InvestIcon";
import { PriceChart } from "./PriceChart";

const MIN_BET = 10;
const BET_STEP = 10;
const CHIPS = [10, 50, 100, 500] as const;

function formatChange(change: number): string {
  const percent = Math.round(change * 1000) / 10;
  if (percent === 0) return "0%";
  return `${percent > 0 ? "+" : ""}${percent}%`;
}

function changeTone(change: number): string {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "flat";
}

export function InvestDesk({
  state,
  onOpenMarket,
  onOpenStocks,
  onOpenBlackjack,
}: {
  state: CareerState;
  onOpenMarket: (id: MarketId) => void;
  onOpenStocks: () => void;
  onOpenBlackjack: () => void;
}) {
  const invested = MARKET_IDS.reduce(
    (sum, id) => sum + state.holdings[id] * state.prices[id],
    0,
  );
  const stockValue = STOCKS.reduce(
    (sum, stock) => sum + state.holdings[stock.id] * state.prices[stock.id],
    0,
  );
  const employer = stockForCompany(state.company?.id);
  const movers = [...STOCKS]
    .map((stock) => ({ stock, change: dayChange(state.history[stock.id]) }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 2);
  return (
    <div className="screen invest-hub">
      <div className="invest-summary">
        <div>
          <span>Cash</span>
          <strong>{formatMoney(state.stats.money)}</strong>
        </div>
        <div>
          <span>Invested</span>
          <strong>{formatMoney(invested)}</strong>
        </div>
      </div>
      <button
        type="button"
        className="invest-card card-stock"
        onClick={onOpenStocks}
      >
        <span className="invest-card-head">
          <span className="invest-title">
            <InvestIcon id="stock" />
            <strong>Stocks</strong>
          </span>
          <span className="change flat">{STOCKS.length} companies</span>
        </span>
        <span className="mover-list">
          {movers.map(({ stock, change }) => (
            <span key={stock.id} className="mover">
              <b>{stock.id}</b>
              <span className={`change ${changeTone(change)}`}>
                {formatChange(change)}
              </span>
            </span>
          ))}
        </span>
        {state.news.length > 0 ? (
          <span className="news-line tone-good">
            In the paper:{" "}
            {state.news.map((item) => marketLabel(item.stockId)).join(", ")}
          </span>
        ) : (
          <span className="news-line">A quiet day in business news.</span>
        )}
        <span className="invest-card-foot">
          <span>Yours {formatMoney(stockValue)}</span>
          {employer ? (
            <span className="employer-tag">Paid partly in {employer.id}</span>
          ) : null}
        </span>
      </button>
      {(["crypto", "gold"] as const).map((id) => {
        const change = dayChange(state.history[id]);
        return (
          <button
            key={id}
            type="button"
            className={`invest-card card-${id}`}
            onClick={() => onOpenMarket(id)}
          >
            <span className="invest-card-head">
              <span className="invest-title">
                <InvestIcon id={id} />
                <strong>{marketLabel(id)}</strong>
              </span>
              <span className={`change ${changeTone(change)}`}>
                {formatChange(change)}
              </span>
            </span>
            <PriceChart series={state.history[id]} />
            <span className="invest-card-foot">
              <span>{formatMoney(state.prices[id])}</span>
              <span className={`risk risk-${marketRisk(id).toLowerCase()}`}>
                {marketRisk(id)} risk
              </span>
              <span>Owned {state.holdings[id]}</span>
            </span>
          </button>
        );
      })}
      <button
        type="button"
        className="invest-card card-blackjack"
        onClick={onOpenBlackjack}
      >
        <span className="invest-card-head">
          <span className="invest-title">
            <InvestIcon id="blackjack" />
            <strong>Blackjack</strong>
          </span>
          <span className="change flat">One hand at a time</span>
        </span>
      </button>
    </div>
  );
}

export function StocksScreen({
  state,
  onOpenMarket,
}: {
  state: CareerState;
  onOpenMarket: (id: StockId) => void;
}) {
  const employer = stockForCompany(state.company?.id);
  const hiring = new Set(
    state.feed.posts
      .map((post) => stockForCompany(post.companyId)?.id)
      .filter((id): id is StockId => Boolean(id)),
  );
  return (
    <section className="screen stocks-screen">
      <div className="screen-title">
        <InvestIcon id="stock" size={44} />
        <p className="kicker">Stocks</p>
      </div>
      <div className="news-card">
        <span className="news-kicker">Today's paper</span>
        {state.news.length > 0 ? (
          state.news.map((item) => (
            <span key={item.stockId} className={`news-line tone-${item.tone}`}>
              {item.headline}
            </span>
          ))
        ) : (
          <span className="news-line">A quiet day in business news.</span>
        )}
        <span className="news-lean">
          Headlines are right about 3 days in 4.
        </span>
      </div>
      <div className="stock-list">
        {STOCKS.map((stock) => {
          const change = dayChange(state.history[stock.id]);
          const inNews = newsFor(state.news, stock.id);
          return (
            <button
              key={stock.id}
              type="button"
              className="stock-row"
              onClick={() => onOpenMarket(stock.id)}
            >
              <span className="stock-ticker">{stock.id}</span>
              <span className="stock-name">
                <strong>{stock.name}</strong>
                <small>{stock.sector}</small>
                <span className="stock-tags">
                  {employer?.id === stock.id ? (
                    <i className="employer-tag">Your employer</i>
                  ) : null}
                  {hiring.has(stock.id) ? (
                    <i className="hiring-tag">Hiring on Workline</i>
                  ) : null}
                  {inNews ? (
                    <i className={`paper-tag tone-${inNews.tone}`}>
                      In the paper
                    </i>
                  ) : null}
                </span>
              </span>
              <span className="stock-spark">
                <PriceChart series={state.history[stock.id]} />
              </span>
              <span className="stock-price">
                <strong>{formatMoney(state.prices[stock.id])}</strong>
                <span className={`change ${changeTone(change)}`}>
                  {formatChange(change)}
                </span>
                {state.holdings[stock.id] > 0 ? (
                  <small>Own {state.holdings[stock.id]}</small>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function MarketScreen({
  state,
  id,
  onChange,
}: {
  state: CareerState;
  id: MarketId;
  onChange: (next: CareerState) => void;
}) {
  const series = state.history[id];
  const price = state.prices[id];
  const change = dayChange(series);
  const owned = state.holdings[id];
  const high = Math.max(...series);
  const low = Math.min(...series);
  const unit = Math.max(1, Math.round(price));
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState(1);
  const maxBuy = unit > 0 ? Math.floor(state.stats.money / unit) : 0;
  const max = mode === "buy" ? maxBuy : owned;
  const count = Math.max(0, Math.min(amount, max));
  const total = count * unit;

  function pick(next: number) {
    setAmount(Math.max(1, Math.floor(next)));
  }

  function switchMode(next: "buy" | "sell") {
    setMode(next);
    setAmount(1);
  }

  function confirm() {
    if (count < 1) return;
    onChange(
      mode === "buy" ? buyAsset(state, id, count) : sellAsset(state, id, count),
    );
    setAmount(1);
  }

  return (
    <section className="screen market-screen">
      <div className="screen-title">
        <InvestIcon id={iconFor(id)} size={44} />
        <p className="kicker">
          {marketLabel(id)}
          {isStock(id) ? ` · ${id}` : ""}
        </p>
        <span className={`risk risk-${marketRisk(id).toLowerCase()}`}>
          {marketRisk(id)} risk
        </span>
      </div>
      <div className="market-price">
        <strong>{formatMoney(price)}</strong>
        <span className={`change ${changeTone(change)}`}>
          {formatChange(change)} today
        </span>
      </div>
      <PriceChart series={series} large />
      <div className="market-range">
        <span>{series.length} days</span>
        <span>
          Low {formatMoney(low)} · High {formatMoney(high)}
        </span>
      </div>
      <p className="prose">{marketBlurb(id)}</p>
      {isStock(id) && stockForCompany(state.company?.id)?.id === id ? (
        <p className="employer-note">
          Part of every payday arrives as this stock.
        </p>
      ) : null}
      {isStock(id) ? <NewsCard news={newsFor(state.news, id)} /> : null}
      <div className="market-holding">
        <div>
          <span>You own</span>
          <strong>{owned}</strong>
        </div>
        <div>
          <span>Worth</span>
          <strong>{formatMoney(owned * price)}</strong>
        </div>
        <div>
          <span>Cash</span>
          <strong>{formatMoney(state.stats.money)}</strong>
        </div>
      </div>
      <div className="trade-panel">
        <div className="trade-mode" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "buy"}
            className={mode === "buy" ? "on" : ""}
            onClick={() => switchMode("buy")}
          >
            Buy
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "sell"}
            className={mode === "sell" ? "on" : ""}
            onClick={() => switchMode("sell")}
          >
            Sell
          </button>
        </div>
        <div className="trade-amount">
          <button
            type="button"
            aria-label="One less"
            disabled={count <= 1}
            onClick={() => pick(count - 1)}
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={Math.max(1, max)}
            value={max < 1 ? 0 : count}
            disabled={max < 1}
            aria-label="Amount"
            onChange={(event) => pick(Number(event.target.value) || 1)}
          />
          <button
            type="button"
            aria-label="One more"
            disabled={count >= max}
            onClick={() => pick(count + 1)}
          >
            +
          </button>
        </div>
        <div className="trade-quick">
          {[0.25, 0.5, 0.75].map((share) => (
            <button
              key={share}
              type="button"
              disabled={max < 1}
              onClick={() => pick(Math.max(1, max * share))}
            >
              {share * 100}%
            </button>
          ))}
          <button type="button" disabled={max < 1} onClick={() => pick(max)}>
            Max {max}
          </button>
        </div>
        <p className="trade-total">
          {max < 1
            ? mode === "buy"
              ? `You need ${formatMoney(unit)} for one.`
              : "You have none to sell."
            : mode === "buy"
              ? `Pay ${formatMoney(total)} · Cash after ${formatMoney(state.stats.money - total)}`
              : `Get ${formatMoney(total)} · ${owned - count} left`}
        </p>
        <button
          type="button"
          className={`trade-confirm ${mode}`}
          disabled={count < 1}
          onClick={confirm}
        >
          {mode === "buy" ? "Buy" : "Sell"} {count}
        </button>
      </div>
      <p className="projection">Prices move overnight.</p>
    </section>
  );
}

export function BlackjackScreen({
  state,
  onChange,
}: {
  state: CareerState;
  onChange: (next: CareerState) => void;
}) {
  const [round, setRound] = useState<BlackjackRound | null>(null);
  const [seed, setSeed] = useState(state.rngState);
  const [bet, setBet] = useState(() =>
    Math.max(MIN_BET, Math.min(50, state.stats.money)),
  );
  const [rules, setRules] = useState(false);
  const cash = state.stats.money;
  const stake = Math.max(MIN_BET, Math.min(bet, cash));
  const canDeal = cash >= MIN_BET;

  function settle(next: BlackjackRound) {
    setRound(next);
    if (next.phase !== "done") return;
    onChange(
      settleBlackjack(
        state,
        payout(next.outcome, next.stake),
        blackjackNote(next.outcome, next.stake),
      ),
    );
  }

  function start() {
    if (!canDeal || round?.phase === "player") return;
    const dealt = dealRound(stake, seed);
    setSeed(dealt.rngState);
    settle(dealt.round);
  }

  function setStake(next: number) {
    setBet(
      Math.max(MIN_BET, Math.min(Math.round(next), Math.max(MIN_BET, cash))),
    );
  }

  const done = round?.phase === "done";
  const playing = round?.phase === "player";
  const dealer = round ? (done ? round.dealer : round.dealer.slice(0, 1)) : [];

  return (
    <section className="screen blackjack-screen">
      <div className="screen-title">
        <InvestIcon id="blackjack" size={44} />
        <p className="kicker">Blackjack</p>
        <button
          type="button"
          className={`rules-tip${rules ? " on" : ""}`}
          aria-label="How to play"
          aria-expanded={rules}
          onClick={() => setRules((value) => !value)}
        >
          ?
        </button>
      </div>
      {rules ? (
        <div className="rules-card" role="note">
          <strong>How to play</strong>
          <ul>
            <li>Get closer to 21 than the dealer without going over.</li>
            <li>2 to 10 count as shown. J, Q, K count 10. A counts 11 or 1.</li>
            <li>
              <b>Hit</b> takes one more card. <b>Stand</b> stops, then the
              dealer draws until 17 or more.
            </li>
            <li>
              A win pays your bet. 21 with your first two cards is a blackjack
              and pays 1.5×. A tie gives the bet back.
            </li>
          </ul>
          <button type="button" onClick={() => setRules(false)}>
            Got it
          </button>
        </div>
      ) : null}
      <div className="felt">
        <Hand
          label="Dealer"
          cards={dealer}
          hidden={playing ? 1 : 0}
          total={round && done ? handValue(round.dealer) : null}
        />
        <Hand
          label="You"
          cards={round?.player ?? []}
          hidden={0}
          total={round ? handValue(round.player) : null}
        />
        {round && done ? (
          <p className={`felt-result ${round.outcome}`}>
            {blackjackNote(round.outcome, round.stake)}
          </p>
        ) : null}
        {playing ? (
          <p className="felt-stake">On the table {formatMoney(round.stake)}</p>
        ) : null}
      </div>
      {playing ? (
        <div className="market-trade">
          <button type="button" onClick={() => settle(hitRound(round))}>
            Hit
          </button>
          <button type="button" onClick={() => settle(standRound(round))}>
            Stand
          </button>
        </div>
      ) : (
        <div className="trade-panel bet-panel">
          <div className="bet-head">
            <span>Your bet</span>
            <span>Cash {formatMoney(cash)}</span>
          </div>
          <div className="trade-amount">
            <button
              type="button"
              aria-label="Lower the bet"
              disabled={!canDeal || stake <= MIN_BET}
              onClick={() => setStake(stake - BET_STEP)}
            >
              −
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={MIN_BET}
              max={Math.max(MIN_BET, cash)}
              step={BET_STEP}
              value={canDeal ? stake : 0}
              disabled={!canDeal}
              aria-label="Bet"
              onChange={(event) =>
                setStake(Number(event.target.value) || MIN_BET)
              }
            />
            <button
              type="button"
              aria-label="Raise the bet"
              disabled={!canDeal || stake >= cash}
              onClick={() => setStake(stake + BET_STEP)}
            >
              +
            </button>
          </div>
          <div className="bet-chips">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className={`chip-coin chip-${chip}`}
                disabled={!canDeal || stake >= cash}
                onClick={() => setStake(stake + chip)}
              >
                +{chip}
              </button>
            ))}
          </div>
          <div className="trade-quick">
            <button
              type="button"
              disabled={!canDeal}
              onClick={() => setStake(MIN_BET)}
            >
              Min
            </button>
            <button
              type="button"
              disabled={!canDeal}
              onClick={() => setStake(cash / 4)}
            >
              ¼
            </button>
            <button
              type="button"
              disabled={!canDeal}
              onClick={() => setStake(cash / 2)}
            >
              ½
            </button>
            <button
              type="button"
              disabled={!canDeal}
              onClick={() => setStake(cash)}
            >
              All in
            </button>
          </div>
          <button
            type="button"
            className="trade-confirm buy"
            disabled={!canDeal}
            onClick={start}
          >
            {canDeal
              ? `${done ? "Deal again" : "Deal"} · ${formatMoney(stake)}`
              : `You need ${formatMoney(MIN_BET)} to play`}
          </button>
        </div>
      )}
    </section>
  );
}

function NewsCard({ news }: { news: StockNews | undefined }) {
  if (!news) {
    return (
      <div className="news-card">
        <span className="news-kicker">Today's paper</span>
        <strong>Nothing about this company today.</strong>
        <span className="news-lean">Without news it drifts a little.</span>
      </div>
    );
  }
  const lean =
    news.tone === "good" ? "Leans up tomorrow" : "Leans down tomorrow";
  return (
    <div className={`news-card tone-${news.tone}`}>
      <span className="news-kicker">Today's paper</span>
      <strong>{news.headline}</strong>
      <span className="news-lean">{lean}. Right about 3 days in 4.</span>
    </div>
  );
}

function Hand({
  label,
  cards,
  hidden,
  total,
}: {
  label: string;
  cards: readonly Card[];
  hidden: number;
  total: number | null;
}) {
  return (
    <div className="hand">
      <span className="hand-label">
        {label}
        {total != null ? ` · ${total}` : ""}
      </span>
      <div className="hand-cards">
        {cards.length === 0 && hidden === 0 ? (
          <span className="play-card empty" />
        ) : null}
        {cards.map((card, index) => (
          <PlayingCard
            key={`${card.label}-${card.suit ?? ""}-${index}`}
            card={card}
            index={index}
          />
        ))}
        {Array.from({ length: hidden }, (_, index) => (
          <span key={`hidden-${index}`} className="play-card back">
            <span className="back-mark" />
          </span>
        ))}
      </div>
    </div>
  );
}

const SUIT_GLYPH: Record<Suit, string> = {
  spade: "♠",
  heart: "♥",
  diamond: "♦",
  club: "♣",
};

function PlayingCard({ card, index }: { card: Card; index: number }) {
  const suit = card.suit ?? "spade";
  const glyph = SUIT_GLYPH[suit];
  const red = suit === "heart" || suit === "diamond";
  const royal = card.rank >= 11;
  return (
    <span
      className={`play-card face${red ? " red" : ""}${royal ? " royal" : ""}`}
      style={{ animationDelay: `${index * 90}ms` }}
      aria-label={`${card.label} of ${suit}s`}
    >
      <span className="pc-corner top">
        <b>{card.label}</b>
        <i>{glyph}</i>
      </span>
      <span className="pc-pip">{royal ? card.label : glyph}</span>
      <span className="pc-corner bottom">
        <b>{card.label}</b>
        <i>{glyph}</i>
      </span>
    </span>
  );
}

export function ShopDesk({
  state,
  onChange,
}: {
  state: CareerState;
  onChange: (next: CareerState) => void;
}) {
  return (
    <div className="screen">
      <h2>Pantry</h2>
      <div className="pantry-row">
        {PANTRY.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`pantry-item item-${item.id}`}
            disabled={state.stats.money < item.cost}
            onClick={() => onChange(consumeItem(state, item.id))}
          >
            <span className="pantry-icon" aria-hidden="true" />
            <strong>{item.name}</strong>
            <small>{item.blurb}</small>
            <span className="pantry-effects">
              {(Object.keys(item.effects) as (keyof typeof item.effects)[]).map(
                (stat) => {
                  const amount = item.effects[stat] ?? 0;
                  return (
                    <span
                      key={stat}
                      className={`pantry-effect ${amount > 0 ? "up" : "down"}`}
                    >
                      {amount > 0 ? "+" : "−"}
                      {Math.abs(amount)} {stat}
                    </span>
                  );
                },
              )}
            </span>
            <span className="pantry-cost">{formatMoney(item.cost)}</span>
          </button>
        ))}
      </div>
      <h2>Machines</h2>
      <div className="gear-row">
        {DEVICES.map((device) => (
          <button
            key={device.id}
            type="button"
            className={state.deviceId === device.id ? "gear on" : "gear"}
            onClick={() => onChange(buyGear(state, "device", device.id))}
          >
            <span>{device.name}</span>
            <small>
              {state.ownedDevices.includes(device.id)
                ? "Owned"
                : formatMoney(device.cost)}
              {" · "}+{device.timeBonus}s
            </small>
          </button>
        ))}
      </div>
      <h2>Looks</h2>
      <div className="gear-row">
        {LOOKS.map((look) => (
          <button
            key={look.id}
            type="button"
            className={state.lookId === look.id ? "gear on" : "gear"}
            onClick={() => onChange(buyGear(state, "look", look.id))}
          >
            <span>{look.name}</span>
            <small>
              {state.ownedLooks.includes(look.id)
                ? "Wear"
                : formatMoney(look.cost)}
            </small>
          </button>
        ))}
      </div>
      {state.log[0] ? <p className="projection">{state.log[0]}</p> : null}
    </div>
  );
}

function blackjackNote(
  outcome: BlackjackRound["outcome"],
  stake: number,
): string {
  if (outcome === "blackjack")
    return `Blackjack. You take ${formatMoney(Math.round(stake * 1.5))}.`;
  if (outcome === "win") return `The hand wins ${formatMoney(stake)}.`;
  if (outcome === "lose") return `The hand loses ${formatMoney(stake)}.`;
  if (outcome === "push") return "Push. The stake comes back.";
  return "The hand is still open.";
}
