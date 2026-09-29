import { nextUnit } from "./rng";

export type Suit = "spade" | "heart" | "diamond" | "club";

export type Card = { label: string; rank: number; suit?: Suit };

const SUITS: readonly Suit[] = ["spade", "heart", "diamond", "club"];

export type BlackjackPhase = "player" | "done";

export type BlackjackRound = {
  deck: Card[];
  player: Card[];
  dealer: Card[];
  stake: number;
  phase: BlackjackPhase;
  outcome: "playing" | "win" | "lose" | "push" | "blackjack";
};

const LABELS = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

function shoe(seed: number): { deck: Card[]; rngState: number } {
  const deck: Card[] = [];
  for (let rank = 1; rank <= 13; rank += 1) {
    for (let suit = 0; suit < 4; suit += 1) {
      deck.push({ rank, label: LABELS[rank - 1] ?? "?", suit: SUITS[suit] });
    }
  }
  let rngState = seed;
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const roll = nextUnit(rngState);
    rngState = roll.rngState;
    const swap = Math.floor(roll.value * (index + 1));
    const current = deck[index];
    const other = deck[swap];
    if (current && other) {
      deck[index] = other;
      deck[swap] = current;
    }
  }
  return { deck, rngState };
}

export function handValue(cards: Card[]): number {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    if (card.rank === 1) {
      aces += 1;
      total += 11;
    } else if (card.rank >= 10) {
      total += 10;
    } else {
      total += card.rank;
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function draw(deck: Card[]): { card: Card; deck: Card[] } {
  const card = deck[0];
  if (!card) throw new Error("The shoe is empty");
  return { card, deck: deck.slice(1) };
}

function outcomeFor(player: Card[], dealer: Card[]): BlackjackRound["outcome"] {
  const playerTotal = handValue(player);
  const dealerTotal = handValue(dealer);
  if (playerTotal > 21) return "lose";
  if (dealerTotal > 21 || playerTotal > dealerTotal) return "win";
  if (playerTotal < dealerTotal) return "lose";
  return "push";
}

export function payout(
  outcome: BlackjackRound["outcome"],
  stake: number,
): number {
  if (outcome === "blackjack") return Math.round(stake * 1.5);
  if (outcome === "win") return stake;
  if (outcome === "lose") return -stake;
  return 0;
}

export function dealRound(
  stake: number,
  seed: number,
): { round: BlackjackRound; rngState: number } {
  const shuffled = shoe(seed);
  let deck = shuffled.deck;
  const player: Card[] = [];
  const dealer: Card[] = [];
  for (let index = 0; index < 2; index += 1) {
    const playerDraw = draw(deck);
    deck = playerDraw.deck;
    player.push(playerDraw.card);
    const dealerDraw = draw(deck);
    deck = dealerDraw.deck;
    dealer.push(dealerDraw.card);
  }
  const natural = handValue(player) === 21;
  const dealerNatural = handValue(dealer) === 21;
  let outcome: BlackjackRound["outcome"] = "playing";
  let phase: BlackjackPhase = "player";
  if (natural || dealerNatural) {
    phase = "done";
    if (natural && dealerNatural) outcome = "push";
    else if (natural) outcome = "blackjack";
    else outcome = "lose";
  }
  return {
    rngState: shuffled.rngState,
    round: { deck, player, dealer, stake, phase, outcome },
  };
}

export function hitRound(round: BlackjackRound): BlackjackRound {
  if (round.phase !== "player") return round;
  const drawn = draw(round.deck);
  const player = [...round.player, drawn.card];
  if (handValue(player) > 21) {
    return {
      ...round,
      deck: drawn.deck,
      player,
      phase: "done",
      outcome: "lose",
    };
  }
  if (handValue(player) === 21)
    return standRound({ ...round, deck: drawn.deck, player });
  return { ...round, deck: drawn.deck, player };
}

export function standRound(round: BlackjackRound): BlackjackRound {
  if (round.phase !== "player") return round;
  let deck = round.deck;
  const dealer = [...round.dealer];
  while (handValue(dealer) < 17) {
    const drawn = draw(deck);
    deck = drawn.deck;
    dealer.push(drawn.card);
  }
  return {
    ...round,
    deck,
    dealer,
    phase: "done",
    outcome: outcomeFor(round.player, dealer),
  };
}
