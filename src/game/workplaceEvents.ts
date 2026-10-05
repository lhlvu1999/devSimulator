import { workplaceOf, type Workplace } from "../content/companies";
import { t as tr, type Params } from "../i18n";
import { WEEK_HOURS } from "./board";
import type { CareerState } from "./career";
import type { EventOutcome, LifeEvent } from "./events";
import { formatMoney } from "./format";
import { payPackage } from "./pay";
import { addStats } from "./stats";
import type { Stats } from "./types";
import { recruiterPost } from "./workline";
import { scaleSkill, skillRating } from "./skill";

/** Events that only happen at one kind of workplace, so a startup week feels different from a big company or a remote one. */
export type WorkplaceEventId =
  | "demoDay"
  | "latePay"
  | "devOps"
  | "lateMessage"
  | "roundClosed"
  | "reorg"
  | "calibration"
  | "compliance"
  | "teamBuilding"
  | "healthCheck"
  | "lateCall"
  | "cableCut"
  | "lonely"
  | "stipend"
  | "drilling";

/** Raise for everyone when a startup closes its round. */
export const ROUND_RAISE = 0.08;
export const STIPEND = 150;
/** Self-reviews that sound big only land when people already know your work. */
export const BOLD_REVIEW_REPUTATION = 50;
/** Your old lead can keep you through a reorg if you're close. */
export const REORG_RELATIONSHIP = 60;
const CAFE_DAY = 40;
const CAFE_QUIET = 30;
const COWORKING = 60;

/** While set, the next payday is held back a week. Kept in counters so saves need no new field. */
export const PAY_LATE = "payLate";
/** Pay held back from a late payday, paid at the end of the next week. */
export const OWED_PAY = "owedPay";

type Candidate = { weight: number; make: () => LifeEvent };

export function workplaceCandidates(state: CareerState): Candidate[] {
  const company = state.company;
  if (!company) return [];
  const workplace: Workplace = workplaceOf(company);
  const once = (make: () => LifeEvent): Candidate => ({ weight: 1, make });
  const named = { company: company.name };

  if (workplace === "startup") {
    /** Agencies live on client work, not funding rounds. */
    const raising = company.type !== "agency";
    const payPending =
      (state.counters[PAY_LATE] ?? 0) > 0 ||
      (state.counters[OWED_PAY] ?? 0) > 0;
    return [
      once(() => ({
        id: "demoDay",
        kind: "company",
        title: "Demo day crunch",
        body: tr("The big demo is on Friday and half of it doesn't work yet."),
        choices: [
          {
            id: "crunch",
            label: "Pull an all-nighter",
            detail: "Make it work. Feel it tomorrow.",
            cost: 0,
          },
          {
            id: "scope",
            label: "Cut the scope",
            detail: "Show less, but show it working.",
            cost: 0,
          },
        ],
      })),
      ...(raising && !payPending
        ? [
            once(() => ({
              id: "latePay" as const,
              kind: "company" as const,
              title: "Payday is late",
              body: tr(
                "{company}'s next funding round is slipping. The founder asks if everyone can wait an extra week for this month's pay.",
                named,
              ),
              choices: [
                {
                  id: "wait",
                  label: "Wait for it",
                  detail: "Next payday comes a week late.",
                  cost: 0,
                },
                {
                  id: "look",
                  label: "Quietly start looking",
                  detail: "A new role goes to the top of Workline.",
                  cost: 0,
                },
              ],
            })),
          ]
        : []),
      once(() => ({
        id: "devOps",
        kind: "company",
        title: "You're also DevOps now",
        body: tr(
          "The only person who knew the servers just left. Someone has to keep them running.",
        ),
        choices: [
          {
            id: "take",
            label: "Take it on",
            detail: "Learn a lot, sleep less.",
            cost: 0,
          },
          {
            id: "decline",
            label: "Say it's not your job",
            detail: "Someone else can learn it.",
            cost: 0,
          },
        ],
      })),
      once(() => ({
        id: "lateMessage",
        kind: "company",
        title: "A message at 11pm",
        body: tr(
          'The founder: "Quick question, are you up?" It is never a quick question.',
        ),
        choices: [
          {
            id: "answer",
            label: "Answer now",
            detail: "Fix it tonight.",
            cost: 0,
          },
          {
            id: "morning",
            label: "Reply in the morning",
            detail: "Sleep first.",
            cost: 0,
          },
        ],
      })),
      ...(raising
        ? [
            once(() => ({
              id: "roundClosed" as const,
              kind: "company" as const,
              title: "The round closed",
              body: tr(
                "{company} raised its next round. Pizza, a toast, and a raise for the whole team.",
                named,
              ),
              choices: [
                {
                  id: "celebrate",
                  label: "Celebrate",
                  detail: "Your pay goes up.",
                  cost: 0,
                },
              ],
            })),
          ]
        : []),
    ];
  }

  if (workplace === "big") {
    return [
      once(() => ({
        id: "reorg",
        kind: "company",
        title: "Reorg",
        body: tr(
          "Your team is being merged with another one. New manager, new process, same work.",
        ),
        choices: [
          {
            id: "adapt",
            label: "Roll with it",
            detail: "Get to know the new people.",
            cost: 0,
          },
          {
            id: "stay",
            label: "Ask to stay with your old lead",
            detail: "Works if you're close.",
            cost: 0,
          },
        ],
      })),
      once(() => ({
        id: "calibration",
        kind: "company",
        title: "Performance calibration",
        body: tr(
          "Managers are ranking everyone this week. Your self-review is due Friday.",
        ),
        choices: [
          {
            id: "bold",
            label: "Write a bold self-review",
            detail: "Pays off if people already know your work.",
            cost: 0,
          },
          {
            id: "modest",
            label: "Keep it modest",
            detail: "Safe and forgettable.",
            cost: 0,
          },
        ],
      })),
      once(() => ({
        id: "compliance",
        kind: "company",
        title: "Compliance training",
        body: tr(
          "Four hours of required videos about passwords and gifts. There's a quiz at the end.",
        ),
        choices: [
          {
            id: "now",
            label: "Click through it at work",
            detail: "Uses 4 hours of this week.",
            cost: 0,
          },
          {
            id: "weekend",
            label: "Do it on Saturday",
            detail: "Keeps your hours, costs a weekend day.",
            cost: 0,
          },
        ],
      })),
      once(() => ({
        id: "teamBuilding",
        kind: "company",
        title: "Team building weekend",
        body: tr(
          "{company} booked a resort for team games and a gala dinner. Coming is optional, officially.",
          named,
        ),
        choices: [
          { id: "go", label: "Go", detail: "Uses a weekend day.", cost: 0 },
          { id: "skip", label: "Skip it", detail: "A quiet weekend.", cost: 0 },
        ],
      })),
      once(() => ({
        id: "healthCheck",
        kind: "company",
        title: "Yearly health check",
        body: tr(
          "A big company perk: a free health check at a hospital across town.",
        ),
        choices: [
          {
            id: "go",
            label: "Go",
            detail: "Uses 4 hours of this week.",
            cost: 0,
          },
          { id: "skip", label: "Skip it", detail: "Maybe next year.", cost: 0 },
        ],
      })),
    ];
  }

  return [
    once(() => ({
      id: "lateCall",
      kind: "company",
      title: "A 10pm call with the US team",
      body: tr("The only time that works in both timezones is 10pm for you."),
      choices: [
        {
          id: "join",
          label: "Join the call",
          detail: "Be there when it's decided.",
          cost: 0,
        },
        {
          id: "notes",
          label: "Ask for notes",
          detail: "Sleep instead.",
          cost: 0,
        },
      ],
    })),
    once(() => ({
      id: "cableCut",
      kind: "company",
      title: "The undersea cable is cut",
      body: tr(
        "The internet to the rest of the world crawls. Your calls freeze mid-sentence.",
      ),
      choices: [
        {
          id: "cafe",
          label: "Work from a café",
          detail: "Better Wi-Fi, a lot of coffee.",
          cost: CAFE_DAY,
        },
        {
          id: "slow",
          label: "Push through at home",
          detail: "Uses 8 hours of this week.",
          cost: 0,
        },
      ],
    })),
    once(() => ({
      id: "lonely",
      kind: "company",
      title: "A lonely week",
      body: tr("You haven't said a word out loud since Monday."),
      choices: [
        {
          id: "cowork",
          label: "Rent a coworking desk",
          detail: "Other people, real ones.",
          cost: COWORKING,
        },
        {
          id: "friend",
          label: "Call a friend",
          detail: "An hour on the phone.",
          cost: 0,
        },
      ],
    })),
    once(() => ({
      id: "stipend",
      kind: "company",
      title: "Home office stipend",
      body: tr("{company} sends {amount} to set up your home office.", {
        ...named,
        amount: formatMoney(STIPEND),
      }),
      amount: STIPEND,
      choices: [
        {
          id: "chair",
          label: "Buy a good chair",
          detail: "Your back will thank you.",
          cost: 0,
        },
        {
          id: "keep",
          label: "Keep the cash",
          detail: "The old chair is fine. Probably.",
          cost: 0,
        },
      ],
    })),
    once(() => ({
      id: "drilling",
      kind: "company",
      title: "The neighbor is drilling",
      body: tr(
        "Next door is renovating. The drill starts at 8am and doesn't stop.",
      ),
      choices: [
        {
          id: "cafe",
          label: "Go to a café",
          detail: "A quiet corner.",
          cost: CAFE_QUIET,
        },
        {
          id: "headphones",
          label: "Put on headphones",
          detail: "You can still feel it.",
          cost: 0,
        },
      ],
    })),
  ];
}

/** Outcome of a workplace event, or null when the event isn't one of these. `paid` already has the choice's cost taken. */
export function applyWorkplaceEvent(
  paid: CareerState,
  event: LifeEvent,
  choiceId: string,
  seed: number,
): EventOutcome | null {
  const done = (
    next: CareerState,
    note: string,
    params?: Params,
  ): EventOutcome => ({
    state: next,
    note: tr(note, params),
    laidOff: false,
  });
  const bump = (effects: Partial<Stats>, note: string, params?: Params) =>
    done(withStats(paid, effects), note, params);
  const withStats = (
    state: CareerState,
    effects: Partial<Stats>,
  ): CareerState => ({
    ...state,
    stats: addStats(state.stats, scaleSkill(effects, paid.level)),
  });
  const loseHours = (state: CareerState, hours: number): CareerState => ({
    ...state,
    board: {
      ...state.board,
      hour: Math.min(WEEK_HOURS, state.board.hour + hours),
    },
  });
  const loseWeekendDay = (state: CareerState): CareerState => ({
    ...state,
    weekendSlots: Math.max(0, state.weekendSlots - 1),
  });

  switch (event.id) {
    case "demoDay":
      return choiceId === "crunch"
        ? bump(
            { skill: 30, reputation: 4, health: -6, energy: -15, mood: -2 },
            "The demo worked. You slept through Saturday.",
          )
        : bump(
            { relationship: -3, reputation: 1 },
            "A smaller demo, but nothing crashed. The founder wanted more.",
          );
    case "latePay": {
      if (choiceId === "wait") {
        const waiting = withStats(paid, { reputation: 3, relationship: 6 });
        return done(
          { ...waiting, counters: { ...waiting.counters, [PAY_LATE]: 1 } },
          "The founder thanks you in front of everyone. Next payday will be a week late.",
        );
      }
      const added = recruiterPost(paid.feed, {
        day: paid.day,
        companyId: paid.company?.id ?? null,
        level: paid.level,
        reputation: paid.stats.reputation,
        relationship: paid.stats.relationship,
        skill: skillRating(paid.stats.skill),
        seed,
      });
      return done(
        { ...paid, feed: added.feed },
        added.post
          ? "You start looking. A new role is waiting at the top of Workline."
          : "You look around. Nothing good this week.",
      );
    }
    case "devOps":
      return choiceId === "take"
        ? bump(
            { skill: 45, energy: -12, mood: -2 },
            "You learned more about servers this week than in four years of college.",
          )
        : bump(
            { relationship: -6, mood: 2 },
            "Someone else took the pager. The team noticed.",
          );
    case "lateMessage":
      return choiceId === "answer"
        ? bump(
            { relationship: 5, health: -3, mood: -3 },
            "An hour later it was fixed. The founder sent a heart.",
          )
        : bump(
            { relationship: -3, mood: 3 },
            "You slept. In the morning it was already fine.",
          );
    case "roundClosed": {
      const company = paid.company;
      if (!company) return bump({ mood: 4 }, "Pizza for everyone.");
      const raised = {
        ...company,
        salary: Math.round(company.salary * (1 + ROUND_RAISE)),
      };
      const pay = payPackage(raised, paid.level).cash;
      return done(
        withStats({ ...paid, company: raised }, { mood: 8, relationship: 3 }),
        "Your pay goes up {percent}%. Payday is now {amount}.",
        { percent: Math.round(ROUND_RAISE * 100), amount: formatMoney(pay) },
      );
    }
    case "reorg":
      if (choiceId === "stay" && paid.stats.relationship >= REORG_RELATIONSHIP)
        return bump(
          { relationship: -2 },
          "Your old lead asked for you by name. You stay together.",
        );
      return choiceId === "stay"
        ? bump(
            { relationship: -10, mood: -4 },
            "Too late. The new org chart is final, and now it's awkward.",
          )
        : bump(
            { relationship: -8, mood: -2, skill: 10 },
            "New names, a new standup time. You're starting over with a new manager.",
          );
    case "calibration":
      if (choiceId === "modest")
        return bump(
          { reputation: 1 },
          "A solid, safe review. Nobody will remember it.",
        );
      return paid.stats.reputation >= BOLD_REVIEW_REPUTATION
        ? bump(
            { reputation: 6, mood: 4 },
            "Your manager backed every line. Rated above expectations.",
          )
        : bump(
            { reputation: -3, mood: -4 },
            "The committee thought it read a little big.",
          );
    case "compliance":
      return choiceId === "weekend"
        ? done(
            withStats(loseWeekendDay(paid), { reputation: 2, mood: -2 }),
            "You passed the quiz on Saturday morning.",
          )
        : done(
            withStats(loseHours(paid, 4), { reputation: 2 }),
            "You passed the quiz. Four hours gone.",
          );
    case "teamBuilding":
      return choiceId === "go"
        ? done(
            withStats(loseWeekendDay(paid), {
              relationship: 7,
              mood: 4,
              energy: -8,
            }),
            "Your team won the tug of war. Your manager knows your name now.",
          )
        : bump(
            { relationship: -4, mood: 2 },
            "A quiet weekend. Monday's photos are mostly of other people.",
          );
    case "healthCheck":
      return choiceId === "go"
        ? done(
            withStats(loseHours(paid, 4), { health: 8, mood: 1 }),
            "All fine. The doctor says to sleep more.",
          )
        : bump({}, "Maybe next year.");
    case "lateCall":
      return choiceId === "join"
        ? bump(
            { reputation: 4, relationship: 4, health: -3, mood: -2 },
            "You were the most awake person on the call. Barely.",
          )
        : bump(
            { relationship: -4, mood: 2 },
            "The notes were thin. You missed a decision.",
          );
    case "cableCut":
      return choiceId === "cafe"
        ? bump({ mood: 1 }, "The café's line is faster. The coffee adds up.")
        : done(
            withStats(loseHours(paid, 8), { mood: -4 }),
            "Pages loaded one picture at a time. You lost a day.",
          );
    case "lonely":
      return choiceId === "cowork"
        ? bump(
            { mood: 8, relationship: 1 },
            "Other humans. You talked about keyboards for an hour.",
          )
        : bump(
            { mood: 4 },
            "An hour on the phone. You feel like a person again.",
          );
    case "stipend":
      return choiceId === "chair"
        ? bump({ health: 6, mood: 2 }, "Your back stops complaining.")
        : bump(
            { money: event.amount ?? STIPEND },
            "Extra cash this month. Your back has opinions.",
          );
    case "drilling":
      return choiceId === "cafe"
        ? bump({ mood: 1 }, "A quiet corner and decent coffee.")
        : bump(
            { mood: -5 },
            "Headphones on. You can still feel the drill in your teeth.",
          );
    default:
      return null;
  }
}

/**
 * Settles a late payday at the end of a week. A pay week while late holds the whole payday back as cash owed.
 * The next week pays what's owed, if you still have a job.
 */
export function settleLatePay(
  state: CareerState,
  payWeek: boolean,
  payday: number,
): { held: boolean; extra: number; notes: string[]; counters: Record<string, number> } {
  const counters = { ...state.counters };
  const notes: string[] = [];
  let extra = 0;
  const owed = counters[OWED_PAY] ?? 0;
  if (owed > 0) {
    if (state.company) {
      extra = owed;
      notes.push(tr("The late pay arrived: +{amount}.", { amount: formatMoney(owed) }));
    } else {
      notes.push(tr("The late pay never came."));
    }
    delete counters[OWED_PAY];
  }
  if (!state.company) delete counters[PAY_LATE];
  const held = payWeek && state.company !== null && (counters[PAY_LATE] ?? 0) > 0;
  if (held && state.company) {
    counters[OWED_PAY] = payday;
    delete counters[PAY_LATE];
    notes.push(
      tr("Payday is late. {company} owes you {amount}.", {
        company: state.company.name,
        amount: formatMoney(payday),
      }),
    );
  }
  return { held, extra, notes, counters };
}
