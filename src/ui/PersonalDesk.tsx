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
  buyHome,
  consumeItem,
  gearPrice,
  sellAsset,
  settleBlackjack,
  type CareerState,
} from "../game/career";
import { DEVICES } from "../content/gear";
import { PANTRY } from "../content/pantry";
import { HOME_PRICE } from "../game/life";
import { formatMoney } from "../game/format";
import {
  MARKET_IDS,
  STOCKS,
  STOCK_IDS,
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
import { portfolioOf, positionOf } from "../game/portfolio";
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
  const stocks = portfolioOf(state, STOCK_IDS);
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
          <span className="news-line">A quiet week in business news.</span>
        )}
        <span className="invest-card-foot">
          <span>
            Yours {formatMoney(stocks.value)}
            {stocks.positions.length > 0 ? (
              <>
                {" "}in {stocks.positions.length}{" "}
                {stocks.positions.length === 1 ? "company" : "companies"}{" "}
                <span className={`change ${changeTone(stocks.gain)}`}>{signedMoney(stocks.gain)}</span>
              </>
            ) : null}
          </span>
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

/** One color per company, so the allocation bar and its rows match. */
const STOCK_TONE: Record<StockId, string> = Object.fromEntries(
  STOCKS.map((stock, index) => [
    stock.id,
    ["#7fa7c9", "#e39b7a", "#6f8f5b", "#c9a14a", "#9b86c4", "#e07a7a", "#5b8f8a", "#a8764f", "#d18ab0", "#6b7f99"][
      index % 10
    ],
  ]),
) as Record<StockId, string>;

function signedMoney(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return "$0";
  return `${rounded > 0 ? "+" : "-"}${formatMoney(Math.abs(rounded))}`;
}

function TickerBadge({ id }: { id: StockId }) {
  return (
    <span className="ticker-badge" style={{ background: STOCK_TONE[id] }}>
      {id}
    </span>
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
  const book = portfolioOf(state, STOCK_IDS);
  return (
    <section className="screen stocks-screen">
      <div className="screen-title">
        <InvestIcon id="stock" size={44} />
        <p className="kicker">Stocks</p>
      </div>

      <div className="portfolio-card">
        <span className="portfolio-kicker">Your stocks</span>
        <strong className="portfolio-value">{formatMoney(book.value)}</strong>
        {book.positions.length > 0 ? (
          <>
            <span className="portfolio-moves">
              <span className={`change ${changeTone(book.gain)}`}>
                {signedMoney(book.gain)} ({formatChange(book.gainPercent)}) since you bought
              </span>
              <span className={`change ${changeTone(book.weekChange)}`}>
                {signedMoney(book.weekChange)} last week
              </span>
            </span>
            <span className="alloc-bar" aria-hidden="true">
              {book.positions.map((position) => (
                <i
                  key={position.id}
                  style={{ flexGrow: position.value, background: STOCK_TONE[position.id as StockId] }}
                />
              ))}
            </span>
            <ul className="holding-list">
              {book.positions.map((position) => {
                const id = position.id as StockId;
                const stock = STOCKS.find((item) => item.id === id);
                const weight = book.value > 0 ? Math.round((position.value / book.value) * 100) : 0;
                return (
                  <li key={id}>
                    <button type="button" className="holding-row" onClick={() => onOpenMarket(id)}>
                      <TickerBadge id={id} />
                      <span className="holding-name">
                        <strong>{stock?.name ?? id}</strong>
                        <small>
                          {position.shares} {position.shares === 1 ? "share" : "shares"} · paid{" "}
                          {formatMoney(position.avgCost)} avg
                        </small>
                        <small>
                          {weight}% of your stocks
                          {employer?.id === id ? " · your employer" : ""}
                        </small>
                      </span>
                      <span className="holding-value">
                        <strong>{formatMoney(position.value)}</strong>
                        <span className={`change ${changeTone(position.gain)}`}>
                          {signedMoney(position.gain)}
                        </span>
                        <small className={`change ${changeTone(position.gainPercent)}`}>
                          {formatChange(position.gainPercent)}
                        </small>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="portfolio-empty">
            You don't own any stocks yet. Pick a company below to buy.
            {employer ? ` Paydays add ${employer.id} shares here on their own.` : ""}
          </p>
        )}
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
          <span className="news-line">A quiet week in business news.</span>
        )}
        <span className="news-lean">Headlines are right about 3 times in 4.</span>
      </div>

      <h3 className="list-title">All companies</h3>
      <div className="stock-list">
        {STOCKS.map((stock) => {
          const change = dayChange(state.history[stock.id]);
          const inNews = newsFor(state.news, stock.id);
          const owned = state.holdings[stock.id];
          return (
            <button
              key={stock.id}
              type="button"
              className={`stock-row${owned > 0 ? " owned" : ""}`}
              onClick={() => onOpenMarket(stock.id)}
            >
              <TickerBadge id={stock.id} />
              <span className="stock-name">
                <strong>{stock.name}</strong>
                <small>{stock.sector}</small>
                <span className="stock-tags">
                  {owned > 0 ? (
                    <i className="own-tag">
                      You own {owned} · {formatMoney(owned * state.prices[stock.id])}
                    </i>
                  ) : null}
                  {employer?.id === stock.id ? <i className="employer-tag">Your employer</i> : null}
                  {hiring.has(stock.id) ? <i className="hiring-tag">Hiring on Workline</i> : null}
                  {inNews ? <i className={`paper-tag tone-${inNews.tone}`}>In the paper</i> : null}
                </span>
              </span>
              <span className="stock-spark">
                <PriceChart series={state.history[stock.id]} />
              </span>
              <span className="stock-price">
                <strong>{formatMoney(state.prices[stock.id])}</strong>
                <span className={`change ${changeTone(change)}`}>{formatChange(change)}</span>
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
  const position = positionOf(state, id);
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
      <div className="market-holding">
        <div>
          <span>You own</span>
          <strong>{owned}</strong>
        </div>
        <div>
          <span>Worth</span>
          <strong>{formatMoney(position.value)}</strong>
        </div>
        <div>
          <span>Paid avg</span>
          <strong>{owned > 0 ? formatMoney(position.avgCost) : "—"}</strong>
        </div>
        <div>
          <span>Gain</span>
          <strong className={owned > 0 ? `change ${changeTone(position.gain)}` : undefined}>
            {owned > 0 ? `${signedMoney(position.gain)} (${formatChange(position.gainPercent)})` : "—"}
          </strong>
        </div>
      </div>
      <PriceChart series={series} large />
      <div className="market-range">
        <span>{series.length} weeks</span>
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
      <p className="projection">Prices move when the week ends.</p>
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
    news.tone === "good" ? "Leans up next week" : "Leans down next week";
  return (
    <div className={`news-card tone-${news.tone}`}>
      <span className="news-kicker">Today's paper</span>
      <strong>{news.headline}</strong>
      <span className="news-lean">{lean}. Right about 3 times in 4.</span>
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

type ShopTab = "pantry" | "machines" | "home";

const SHOP_TABS: { id: ShopTab; label: string }[] = [
  { id: "pantry", label: "Pantry" },
  { id: "machines", label: "Machines" },
  { id: "home", label: "Home" },
];

function effectText(effects: Partial<Record<string, number>>): string {
  return Object.entries(effects)
    .map(([stat, amount]) => `${(amount ?? 0) > 0 ? "+" : "−"}${Math.abs(amount ?? 0)} ${stat}`)
    .join(", ");
}

/**
 * One tab at a time, every item a row with a clear button on the right,
 * and a receipt after each purchase so the player sees what changed.
 */
export function ShopDesk({
  state,
  onChange,
}: {
  state: CareerState;
  onChange: (next: CareerState) => void;
}) {
  const [tab, setTab] = useState<ShopTab>("pantry");
  const [receipt, setReceipt] = useState<{ id: number; text: string } | null>(null);
  const onSale = state.saleWeek === state.day;

  function buy(next: CareerState, text: string) {
    if (next === state) return;
    onChange(next);
    const id = Date.now();
    setReceipt({ id, text });
    window.setTimeout(() => setReceipt((current) => (current?.id === id ? null : current)), 2600);
  }

  return (
    <section className="screen shop-screen">
      <div className="shop-head">
        <h2 className="tab-title">Shop</h2>
        <span className="cash-chip">{formatMoney(state.stats.money)}</span>
      </div>
      <div className="segmented" role="tablist">
        {SHOP_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={tab === item.id ? "on" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {receipt ? (
        <p key={receipt.id} className="receipt" role="status">
          {receipt.text}
        </p>
      ) : null}
      {onSale && tab === "machines" ? (
        <p className="sale-banner">Black Friday: 30% off machines this week.</p>
      ) : null}

      {tab === "pantry" ? (
        <>
          <p className="shop-note">
            Used right away. Energy {state.stats.energy} · Health {state.stats.health}
          </p>
          <ul className="shop-list">
            {PANTRY.map((item) => {
              const short = state.stats.money < item.cost;
              return (
                <li key={item.id} className="shop-row">
                  <span className={`pantry-icon item-${item.id}`} aria-hidden="true" />
                  <span className="shop-info">
                    <strong>{item.name}</strong>
                    <small>{item.blurb}</small>
                    <span className="pantry-effects">
                      {(Object.keys(item.effects) as (keyof typeof item.effects)[]).map((stat) => {
                        const amount = item.effects[stat] ?? 0;
                        return (
                          <span key={stat} className={`pantry-effect ${amount > 0 ? "up" : "down"}`}>
                            {amount > 0 ? "+" : "−"}
                            {Math.abs(amount)} {stat}
                          </span>
                        );
                      })}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="shop-buy"
                    disabled={short}
                    onClick={() =>
                      buy(consumeItem(state, item.id), `${item.name}: ${effectText(item.effects)}.`)
                    }
                  >
                    {formatMoney(item.cost)}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      {tab === "machines" ? (
        <>
          <p className="shop-note">A better machine gives every task more time.</p>
          <ul className="shop-list">
            {DEVICES.map((device) => {
              const owned = state.ownedDevices.includes(device.id);
              const using = state.deviceId === device.id;
              const price = gearPrice(state, device.cost);
              const short = !owned && state.stats.money < price;
              return (
                <li key={device.id} className={`shop-row${using ? " using" : ""}`}>
                  <span className={`machine-icon machine-${device.id}`} aria-hidden="true" />
                  <span className="shop-info">
                    <strong>{device.name}</strong>
                    <small>{device.timeBonus > 0 ? `+${device.timeBonus}s on every task` : "Base time"}</small>
                    {onSale && !owned && price < device.cost ? (
                      <small className="was-price">Was {formatMoney(device.cost)}</small>
                    ) : null}
                  </span>
                  <button
                    type="button"
                    className={`shop-buy${using ? " using" : owned ? " owned" : ""}`}
                    disabled={using || short}
                    onClick={() =>
                      buy(
                        buyGear(state, "device", device.id),
                        owned
                          ? `Switched to the ${device.name.toLowerCase()}.`
                          : `${device.name} is on your desk.`,
                      )
                    }
                  >
                    {using ? "In use" : owned ? "Use" : formatMoney(price)}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      {tab === "home" ? (
        <div className={`home-offer${state.ownsHome ? " owned" : ""}`}>
          <span className="home-mark" aria-hidden="true" />
          <span className="home-text">
            <strong>{state.ownsHome ? "Your own home" : "A house with a garden"}</strong>
            <small>
              {state.ownsHome
                ? "The keys are on the hook by the door."
                : state.goal === "home"
                  ? "This is your life goal."
                  : "Room for the cat to roam."}
            </small>
            {state.ownsHome ? null : (
              <>
                <span className="stats-meter tone-sage home-save">
                  <span style={{ width: `${Math.min(100, (state.stats.money / HOME_PRICE) * 100)}%` }} />
                </span>
                <small>
                  {formatMoney(Math.min(state.stats.money, HOME_PRICE))} of {formatMoney(HOME_PRICE)} saved
                </small>
              </>
            )}
          </span>
          {state.ownsHome ? null : (
            <button
              type="button"
              className="shop-buy"
              disabled={state.stats.money < HOME_PRICE}
              onClick={() => buy(buyHome(state), "You bought a home. Welcome in.")}
            >
              {formatMoney(HOME_PRICE)}
            </button>
          )}
        </div>
      ) : null}
    </section>
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
