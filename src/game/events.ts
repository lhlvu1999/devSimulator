import type { CareerState } from "./career";
import { nextLevel } from "./ladder";
import { weekOfYear } from "./life";
import { emptyBoard } from "./board";
import { MARKET_IDS, STOCK_IDS, emptyHoldings, stockForCompany, type Prices } from "./market";
import { payPackage } from "./pay";
import { nextUnit } from "./rng";
import { skillRating } from "./skill";
import { addStats } from "./stats";
import type { Stats } from "./types";
import { recruiterPost } from "./workline";

export type EventId =
  | "layoffs"
  | "startupFolds"
  | "acquisition"
  | "newManager"
  | "family"
  | "wedding"
  | "conference"
  | "recruiter"
  | "crash"
  | "phone"
  | "vet"
  | "raffle"
  | "newYear"
  | "lunarNewYear"
  | "summerTrip"
  | "midAutumn"
  | "blackFriday"
  | "yearParty";

export type EventChoice = {
  id: string;
  label: string;
  detail: string;
  cost: number;
};

export type LifeEvent = {
  id: EventId;
  kind: "company" | "life" | "season";
  title: string;
  body: string;
  choices: EventChoice[];
  /** Money asked for or paid out, when the event names an amount. */
  amount?: number;
};

/** Share of a shop price you pay during the Black Friday week. */
export const SALE_PRICE = 0.7;

/**
 * New Year bonus: longer tenure and a growing company both pay more.
 * Tenure adds half a payday per year (a quarter to start), up to 1.5.
 * Company growth over the year scales it, from half (a bad year) to double.
 */
export function newYearBonus(
  cash: number,
  tenureWeeks: number,
  growth: number,
): number {
  const tenure = Math.min(1.5, 0.25 + 0.5 * (tenureWeeks / 52));
  const scale = 1 + Math.max(-0.5, Math.min(1, growth));
  return Math.max(0, Math.round(cash * tenure * scale));
}

/** Holidays land on fixed weeks of the year and replace any random event that week. */
export function seasonalEvent(
  state: CareerState,
  growth: number,
): LifeEvent | null {
  const week = weekOfYear(state.day);
  const company = state.company;
  const cash = payPackage(company, state.level).cash;
  const tenure = company ? state.day - state.joinedDay : 0;

  if (week === 1) {
    const bonus = company ? newYearBonus(cash, tenure, growth) : 0;
    const direction = growth >= 0 ? "grew" : "shrank";
    const body = company
      ? `Fireworks over the city. You've been at ${company.name} for ${tenure} weeks, and the company ${direction} ${Math.abs(Math.round(growth * 100))}% last year. Your New Year bonus is $${bonus.toLocaleString("en-US")}. Pick a resolution.`
      : "Fireworks over the city. No company to thank this year, but a fresh start. Pick a resolution.";
    return {
      id: "newYear",
      kind: "season",
      title: "Happy New Year",
      body,
      amount: bonus,
      choices: [
        {
          id: "health",
          label: "Get healthier",
          detail: "More walks, fewer snacks.",
          cost: 0,
        },
        {
          id: "learn",
          label: "Learn something new",
          detail: "One course, finished this time.",
          cost: 0,
        },
        {
          id: "friends",
          label: "See friends more",
          detail: "Put dinners in the calendar.",
          cost: 0,
        },
        {
          id: "brave",
          label: "Speak up at work",
          detail: "Share the idea in the meeting.",
          cost: 0,
        },
      ],
    };
  }
  if (week === 6) {
    const lucky = company && tenure >= 26 ? Math.round(cash * 0.5) : 0;
    return {
      id: "lunarNewYear",
      kind: "season",
      title: "Lunar New Year",
      body: lucky
        ? `Red envelopes and family dinners. ${company?.name} gives you $${lucky.toLocaleString("en-US")} in lucky money.`
        : "Red envelopes and family dinners. Stay six months at a company to get lucky money.",
      amount: lucky,
      choices: [
        {
          id: "home",
          label: "Go home for the holiday",
          detail: "Long trip, full heart.",
          cost: 300,
        },
        {
          id: "stay",
          label: "Stay in the city",
          detail: "Quiet streets for once.",
          cost: 0,
        },
      ],
    };
  }
  if (week === 27) {
    return company
      ? {
          id: "summerTrip",
          kind: "season",
          title: "Company summer trip",
          body: `${company.name} is taking everyone to the beach for two days.`,
          choices: [
            {
              id: "go",
              label: "Go on the trip",
              detail: "Sunburn and team games.",
              cost: 0,
            },
            {
              id: "skip",
              label: "Skip it",
              detail: "Two quiet days at home.",
              cost: 0,
            },
          ],
        }
      : {
          id: "summerTrip",
          kind: "season",
          title: "Summer is here",
          body: "Everyone is posting beach photos.",
          choices: [
            {
              id: "beach",
              label: "Go to the beach",
              detail: "Worth it.",
              cost: 400,
            },
            {
              id: "stay",
              label: "Stay home",
              detail: "A fan and a book.",
              cost: 0,
            },
          ],
        };
  }
  if (week === 38) {
    return {
      id: "midAutumn",
      kind: "season",
      title: "Mid-Autumn Festival",
      body: "Lanterns in the street and mooncakes in every shop.",
      choices: company
        ? [
            {
              id: "share",
              label: "Bring mooncakes for the team",
              detail: "Everyone loves the lotus ones.",
              cost: 60,
            },
            {
              id: "keep",
              label: "Keep them for yourself",
              detail: "No regrets.",
              cost: 25,
            },
          ]
        : [
            {
              id: "keep",
              label: "Buy a box of mooncakes",
              detail: "No regrets.",
              cost: 25,
            },
          ],
    };
  }
  if (week === 47) {
    return {
      id: "blackFriday",
      kind: "season",
      title: "Black Friday",
      body: `Machines in the Shop are ${Math.round((1 - SALE_PRICE) * 100)}% off this week only.`,
      choices: [
        {
          id: "ok",
          label: "Good to know",
          detail: "The sale ends when the week does.",
          cost: 0,
        },
      ],
    };
  }
  if (week === 51) {
    return {
      id: "yearParty",
      kind: "season",
      title: company ? "Year-end party" : "Holiday parties",
      body: company
        ? `${company.name} rents a hall. There's karaoke. There's always karaoke.`
        : "Friends are throwing a holiday party.",
      choices: company
        ? [
            {
              id: "go",
              label: "Go and sing",
              detail: "Pick the song carefully.",
              cost: 0,
            },
            { id: "skip", label: "Skip it", detail: "Early night.", cost: 0 },
          ]
        : [
            { id: "go", label: "Go", detail: "Bring snacks.", cost: 20 },
            { id: "skip", label: "Stay in", detail: "Early night.", cost: 0 },
          ],
    };
  }
  return null;
}

/** Chance a new week starts with an event, once the first month is over. */
export const EVENT_CHANCE = 0.35;
const FIRST_EVENT_DAY = 5;

export function layoffRisk(stats: Stats): number {
  return Math.min(
    0.4,
    Math.max(0.05, 0.35 - stats.reputation / 250 - stats.relationship / 400),
  );
}

type Candidate = { weight: number; make: () => LifeEvent };

function candidates(state: CareerState): Candidate[] {
  const company = state.company;
  const listed = stockForCompany(company?.id);
  const invested = MARKET_IDS.some((id) => state.holdings[id] > 0);
  const familyAsk = Math.max(
    500,
    Math.round((state.stats.money * 0.1) / 50) * 50,
  );
  const list: Candidate[] = [];

  if (company && company.tier !== "seed") {
    list.push({
      weight:
        company.tier === "giant" || company.tier === "established" ? 3 : 1,
      make: () => ({
        id: "layoffs",
        kind: "company",
        title: "Layoffs announced",
        body: `${company.name} is cutting teams this week. Everyone waits for an email. A good reputation and a close team make you harder to cut.`,
        choices: [
          {
            id: "wait",
            label: "Wait for the email",
            detail: "Nothing to do but hope.",
            cost: 0,
          },
        ],
      }),
    });
  }
  if (company?.tier === "seed") {
    list.push({
      weight: 1,
      make: () => ({
        id: "startupFolds",
        kind: "company",
        title: "The startup ran out of money",
        body: `${company.name} could not raise its next round. The office closes on Friday.`,
        choices: [
          {
            id: "pack",
            label: "Pack your desk",
            detail: "Time to find something new.",
            cost: 0,
          },
        ],
      }),
    });
  }
  if (company && listed) {
    list.push({
      weight: 1,
      make: () => ({
        id: "acquisition",
        kind: "company",
        title: `${company.name} is being bought`,
        body: `A bigger company is buying ${company.name}. ${listed.id} jumps on the news.`,
        choices: [
          {
            id: "cheer",
            label: "Celebrate",
            detail: "Your shares just got more valuable.",
            cost: 0,
          },
        ],
      }),
    });
  }
  if (company) {
    list.push({
      weight: 2,
      make: () => ({
        id: "newManager",
        kind: "company",
        title: "A new manager",
        body: "Your manager moved on. The new one doesn't know you yet.",
        choices: [
          {
            id: "coffee",
            label: "Book a coffee chat",
            detail: "Start on the right foot.",
            cost: 10,
          },
          {
            id: "quiet",
            label: "Keep your head down",
            detail: "Let the work speak.",
            cost: 0,
          },
        ],
      }),
    });
    list.push({
      weight: 2,
      make: () => ({
        id: "conference",
        kind: "company",
        title: "Conference invite",
        body: "You're invited to speak at a small conference. The company won't pay for it.",
        choices: [
          {
            id: "go",
            label: "Go and speak",
            detail: "Learn a lot and get noticed.",
            cost: 400,
          },
          { id: "skip", label: "Skip it", detail: "Maybe next year.", cost: 0 },
        ],
      }),
    });
  }
  if (company && nextLevel(state.level) && state.stats.reputation >= 25) {
    list.push({
      weight: 2,
      make: () => ({
        id: "recruiter",
        kind: "company",
        title: "A recruiter messaged you",
        body: '"I came across your profile and think you\'d be perfect for a role one step up."',
        choices: [
          {
            id: "look",
            label: "Take a look",
            detail: "It goes to the top of Workline.",
            cost: 0,
          },
          {
            id: "no",
            label: "Not now",
            detail: "You're happy where you are.",
            cost: 0,
          },
        ],
      }),
    });
  }
  if (invested) {
    list.push({
      weight: 1,
      make: () => ({
        id: "crash",
        kind: "life",
        title: "Market crash",
        body: "Every screen is red. Stocks fall hard and crypto falls harder.",
        choices: [
          {
            id: "hold",
            label: "Hold on",
            detail: "It usually comes back. Usually.",
            cost: 0,
          },
          {
            id: "sell",
            label: "Sell everything",
            detail: "Turn it all into cash at today's low prices.",
            cost: 0,
          },
        ],
      }),
    });
  }
  list.push({
    weight: state.stats.money >= 500 ? 2 : 0,
    make: () => ({
      id: "family",
      kind: "life",
      title: "Family needs help",
      body: `A relative is short on rent this month and asks for $${familyAsk.toLocaleString("en-US")}.`,
      amount: familyAsk,
      choices: [
        {
          id: "give",
          label: "Send the money",
          detail: "It feels right.",
          cost: familyAsk,
        },
        { id: "no", label: "Say no", detail: "You need it too.", cost: 0 },
      ],
    }),
  });
  list.push({
    weight: 2,
    make: () => ({
      id: "wedding",
      kind: "life",
      title: "A friend's wedding",
      body: "An old friend is getting married. Flights, a gift, a suit.",
      choices: [
        {
          id: "go",
          label: "Go",
          detail: "Dance badly and cry a little.",
          cost: 300,
        },
        {
          id: "skip",
          label: "Send your regrets",
          detail: "They'll understand. Mostly.",
          cost: 0,
        },
      ],
    }),
  });
  list.push({
    weight: 2,
    make: () => ({
      id: "phone",
      kind: "life",
      title: "Your phone broke",
      body: "It slipped out of your pocket at the worst angle.",
      choices: [
        {
          id: "buy",
          label: "Buy a new one",
          detail: "Back to normal.",
          cost: 300,
        },
        {
          id: "without",
          label: "Live without it",
          detail: "A cracked screen for a while.",
          cost: 0,
        },
      ],
    }),
  });
  list.push({
    weight: 1,
    make: () => ({
      id: "vet",
      kind: "life",
      title: "The cat is sick",
      body: "The cat won't eat and keeps sleeping in odd places.",
      choices: [
        {
          id: "vet",
          label: "Go to the vet",
          detail: "Peace of mind.",
          cost: 250,
        },
        {
          id: "wait",
          label: "Wait and see",
          detail: "Probably nothing.",
          cost: 0,
        },
      ],
    }),
  });
  list.push({
    weight: 1,
    make: () => ({
      id: "raffle",
      kind: "life",
      title: "You won the office raffle",
      body: "A gift card you never entered for. Someone put your name in.",
      choices: [
        { id: "claim", label: "Claim it", detail: "A small treat.", cost: 0 },
      ],
    }),
  });
  return list.filter((item) => item.weight > 0);
}

/** Maybe start the week with an event. */
export function rollEvent(
  state: CareerState,
  seed: number,
): { event: LifeEvent | null; rngState: number } {
  const chance = nextUnit(seed);
  if (state.day < FIRST_EVENT_DAY || chance.value >= EVENT_CHANCE) {
    return { event: null, rngState: chance.rngState };
  }
  const pool = candidates(state);
  const total = pool.reduce((sum, item) => sum + item.weight, 0);
  const pick = nextUnit(chance.rngState);
  let mark = pick.value * total;
  for (const item of pool) {
    mark -= item.weight;
    if (mark < 0) return { event: item.make(), rngState: pick.rngState };
  }
  return { event: null, rngState: pick.rngState };
}

function crashPrices(prices: Prices): Prices {
  const next = { ...prices };
  for (const id of STOCK_IDS)
    next[id] = Math.max(1, Math.round(prices[id] * 0.85 * 100) / 100);
  next.crypto = Math.max(1, Math.round(prices.crypto * 0.65 * 100) / 100);
  return next;
}

/**
 * Apply the player's choice. Returns the new state and a line for the log.
 * Layoffs and the startup folding take the job away.
 */
export function applyEvent(
  state: CareerState,
  choiceId: string,
  seed: number,
): { state: CareerState; note: string; laidOff: boolean } {
  const event = state.event;
  if (!event) return { state, note: "", laidOff: false };
  const choice = event.choices.find((item) => item.id === choiceId);
  if (!choice || state.stats.money < choice.cost)
    return { state, note: "", laidOff: false };

  const paid = {
    ...state,
    event: null,
    stats: addStats(state.stats, { money: -choice.cost }),
  };
  const bump = (effects: Partial<Stats>, note: string) => ({
    state: { ...paid, stats: addStats(paid.stats, effects) },
    note,
    laidOff: false,
  });
  const loseJob = (severance: number, note: string) => ({
    state: {
      ...paid,
      company: null,
      board: emptyBoard(),
      workDone: true,
      stats: addStats(paid.stats, { money: severance, mood: -10 }),
    },
    note,
    laidOff: true,
  });

  switch (event.id) {
    case "layoffs": {
      if (nextUnit(seed).value < layoffRisk(state.stats)) {
        const severance = payPackage(state.company, state.level).cash * 2;
        return loseJob(
          severance,
          `You were laid off. Severance: $${severance.toLocaleString("en-US")}. Workline is the next stop.`,
        );
      }
      const safe = bump(
        { mood: -4 },
        "You made it through. The office is very quiet.",
      );
      return {
        ...safe,
        state: {
          ...safe.state,
          counters: {
            ...safe.state.counters,
            layoffsSurvived: (safe.state.counters.layoffsSurvived ?? 0) + 1,
          },
        },
      };
    }
    case "startupFolds":
      return loseJob(
        0,
        "The startup closed. No severance. Workline is the next stop.",
      );
    case "acquisition": {
      const listed = stockForCompany(state.company?.id);
      const prices = { ...paid.prices };
      if (listed)
        prices[listed.id] = Math.round(prices[listed.id] * 1.3 * 100) / 100;
      return {
        state: { ...paid, prices, stats: addStats(paid.stats, { mood: 5 }) },
        note: `${listed?.id ?? "The stock"} jumped 30% on the news.`,
        laidOff: false,
      };
    }
    case "newManager":
      return choice.id === "coffee"
        ? bump(
            { relationship: -4, mood: 2 },
            "The coffee chat went well. A good start.",
          )
        : bump(
            { relationship: -12 },
            "The new manager doesn't really know what you do yet.",
          );
    case "conference":
      return choice.id === "go"
        ? bump(
                        { skill: 40, reputation: 4, mood: 3 },
            "Your talk went well. People want to connect.",
          )
        : bump({}, "Maybe next year.");
    case "recruiter": {
      if (choice.id !== "look") return bump({}, "You let it pass.");
      const added = recruiterPost(paid.feed, {
        day: state.day,
        companyId: state.company?.id ?? null,
        level: state.level,
        reputation: state.stats.reputation,
                relationship: state.stats.relationship,
        skill: skillRating(state.stats.skill),
        seed,
      });
      return {
        state: { ...paid, feed: added.feed },
        note: added.post
          ? "A stretch role is waiting at the top of Workline."
          : "The role was already filled.",
        laidOff: false,
      };
    }
    case "crash": {
      const prices = crashPrices(paid.prices);
      if (choice.id === "sell") {
        let cash = 0;
        const holdings = { ...paid.holdings };
        for (const id of MARKET_IDS) {
          cash += holdings[id] * Math.max(1, Math.round(prices[id]));
          holdings[id] = 0;
        }
        return {
          state: {
            ...paid,
            prices,
            holdings,
            costBasis: emptyHoldings(),
            stats: addStats(paid.stats, { money: cash, mood: -2 }),
          },
          note: `You sold everything for $${cash.toLocaleString("en-US")}.`,
          laidOff: false,
        };
      }
      return {
        state: { ...paid, prices, stats: addStats(paid.stats, { mood: -3 }) },
        note: "You held on and tried not to look.",
        laidOff: false,
      };
    }
    case "family":
      return choice.id === "give"
        ? bump({ mood: 6 }, "They're grateful. You feel good about it.")
        : bump({ mood: -8 }, "It was the right call for you, but it stings.");
    case "wedding":
      return choice.id === "go"
        ? bump({ mood: 8, health: -1 }, "A beautiful day. Your feet hurt.")
        : bump({ mood: -4 }, "You watch the photos from home.");
    case "phone":
      return choice.id === "buy"
        ? bump({}, "A new phone. Same notifications.")
        : bump({ mood: -6 }, "Squinting at a cracked screen gets old.");
    case "vet":
      return choice.id === "vet"
        ? bump({ mood: 2 }, "Just a tummy bug. The cat is fine.")
        : bump({ mood: -6 }, "The cat recovers slowly. You worried all week.");
    case "raffle":
      return bump({ money: 200, mood: 3 }, "A $200 gift card. Nice.");
    case "newYear": {
      const bonus = event.amount ?? 0;
      const resolutions: Record<
        string,
        { effects: Partial<Stats>; note: string }
      > = {
        health: { effects: { health: 5 }, note: "Resolution: get healthier." },
        learn: {
                    effects: { skill: 30 },
          note: "Resolution: learn something new.",
        },
        friends: {
          effects: { mood: 6 },
          note: "Resolution: see friends more.",
        },
        brave: {
          effects: { reputation: 3 },
          note: "Resolution: speak up at work.",
        },
      };
      const pick = resolutions[choice.id] ?? resolutions.health;
      return bump(
        { ...pick?.effects, money: bonus },
        bonus > 0
          ? `${pick?.note} New Year bonus: $${bonus.toLocaleString("en-US")}.`
          : (pick?.note ?? ""),
      );
    }
    case "lunarNewYear": {
      const lucky = event.amount ?? 0;
      const extra =
        lucky > 0 ? ` Lucky money: $${lucky.toLocaleString("en-US")}.` : "";
      return choice.id === "home"
        ? bump({ money: lucky, mood: 12 }, `Home for the holiday.${extra}`)
        : bump(
            { money: lucky, mood: 3 },
            `A quiet holiday in the city.${extra}`,
          );
    }
    case "summerTrip":
      if (choice.id === "go")
        return bump(
          { mood: 10, relationship: 5, health: 2 },
          "Sunburned and closer to the team.",
        );
      if (choice.id === "beach")
        return bump({ mood: 12, health: 3 }, "Salt air helps.");
      return bump(
        choice.id === "skip" ? { relationship: -2 } : {},
        "A quiet summer week.",
      );
    case "midAutumn":
      return choice.id === "share"
        ? bump(
            { relationship: 4, mood: 2 },
            "The team fights over the last lotus mooncake.",
          )
        : bump({ mood: 3 }, "You eat the whole box. No regrets.");
    case "blackFriday":
      return {
        state: { ...paid, saleWeek: state.day },
        note: "The Shop sale is on until the week ends.",
        laidOff: false,
      };
    case "yearParty":
      if (choice.id === "go") {
        return bump(
          state.company
            ? { relationship: 6, mood: 6, health: -2 }
            : { mood: 6 },
          state.company
            ? "You sang. People will talk about it."
            : "A good night with friends.",
        );
      }
      return bump(state.company ? { relationship: -2 } : {}, "An early night.");
  }
}
