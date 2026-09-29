import { isStock, type MarketId } from "../game/market";

export type InvestIconId = "stock" | "crypto" | "gold" | "blackjack";

export function iconFor(id: MarketId): InvestIconId {
  return isStock(id) ? "stock" : id;
}

/** Small flat badges in the room palette. */
export function InvestIcon({
  id,
  size = 36,
}: {
  id: InvestIconId;
  size?: number;
}) {
  return (
    <svg
      className={`invest-icon icon-${id}`}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        fill={BADGE[id]}
        stroke="#3f342c"
        strokeWidth="2"
      />
      {id === "stock" ? <StockMark /> : null}
      {id === "crypto" ? <CryptoMark /> : null}
      {id === "gold" ? <GoldMark /> : null}
      {id === "blackjack" ? <CardsMark /> : null}
    </svg>
  );
}

const BADGE: Record<InvestIconId, string> = {
  stock: "#dbe7f0",
  crypto: "#f4dccf",
  gold: "#f3e3bd",
  blackjack: "#dde7d6",
};

function StockMark() {
  return (
    <g stroke="#3f342c" strokeWidth="2" strokeLinejoin="round">
      <rect x="9" y="22" width="5" height="9" rx="1" fill="#7fa7c9" />
      <rect x="17.5" y="17" width="5" height="14" rx="1" fill="#7fa7c9" />
      <rect x="26" y="11" width="5" height="20" rx="1" fill="#7fa7c9" />
      <polyline
        points="8,18 16,12 22,15 32,7"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function CryptoMark() {
  return (
    <g stroke="#3f342c" strokeWidth="2" strokeLinejoin="round">
      <polygon
        points="20,7 31,13.5 31,26.5 20,33 9,26.5 9,13.5"
        fill="#e39b7a"
      />
      <polygon
        points="20,13 25.5,16.5 25.5,23.5 20,27 14.5,23.5 14.5,16.5"
        fill="#f6efe6"
      />
      <line x1="20" y1="13" x2="20" y2="27" strokeLinecap="round" />
    </g>
  );
}

function GoldMark() {
  return (
    <g stroke="#3f342c" strokeWidth="2" strokeLinejoin="round">
      <polygon points="7,31 11,24 20,24 24,31" fill="#e6c48a" />
      <polygon points="16,31 20,24 29,24 33,31" fill="#e6c48a" />
      <polygon points="11.5,23 15.5,16 24.5,16 28.5,23" fill="#f0d49b" />
      <line x1="14" y1="11" x2="15.5" y2="13.5" strokeLinecap="round" />
      <line x1="20" y1="9" x2="20" y2="12" strokeLinecap="round" />
      <line x1="26" y1="11" x2="24.5" y2="13.5" strokeLinecap="round" />
    </g>
  );
}

function CardsMark() {
  return (
    <g stroke="#3f342c" strokeWidth="2" strokeLinejoin="round">
      <rect
        x="8"
        y="11"
        width="14"
        height="20"
        rx="2.5"
        fill="#f6efe6"
        transform="rotate(-12 15 21)"
      />
      <rect
        x="18"
        y="9"
        width="14"
        height="20"
        rx="2.5"
        fill="#ffffff"
        transform="rotate(10 25 19)"
      />
      <path
        d="M25 14 C22 17.5 21.5 19 23 20.5 C24 21.4 25 21 25 20 C25 21 26 21.4 27 20.5 C28.5 19 28 17.5 25 14 Z"
        fill="#3f342c"
        strokeWidth="1"
        transform="rotate(10 25 19)"
      />
    </g>
  );
}
