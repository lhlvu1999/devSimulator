import { COCKPIT_COST, MONITOR_COST, SAVINGS_STAKE } from "./config";
import { formatMoney } from "../game/format";
import type { Activity } from "../game/types";

export const ACTIVITIES: Activity[] = [
  {
    id: "rest",
    label: "Rest",
    detail: "Stop while the evening is still an evening.",
    effects: { energy: 14, health: 4, mood: 5 },
    outcome:
      "You close the laptop while it is still light out. Your shoulders drop.",
  },
  {
    id: "see-someone",
    label: "See Sam or Jun",
    detail: `Spend ${formatMoney(30)} on a person instead of a ticket.`,
    requires: { money: 30 },
    effects: { money: -30, relationship: 8, mood: 7 },
    setFlags: ["sawSomeone"],
    outcome: "You leave the laptop in the bag. Someone is glad you showed up.",
  },
  {
    id: "study",
    label: "Study",
    detail: "Spend energy on the system instead of another ticket.",
    requires: { energy: 15 },
    effects: { energy: -10, skill: 4, mood: -1 },
    setFlags: ["studied"],
    outcome: "You learn one real thing about the system. It costs the evening.",
  },
  {
    id: "savings",
    label: "Move some savings",
    detail: `Stake ${formatMoney(SAVINGS_STAKE)}. It can come back larger, the same, or not at all.`,
    requires: { money: SAVINGS_STAKE },
    effects: {},
    setFlags: ["tookRisk"],
    outcome: "You move the money.",
    risk: {
      stake: SAVINGS_STAKE,
      outcomes: [
        {
          weight: 30,
          delta: SAVINGS_STAKE,
          text: "The small bet pays. You are up, and a little too pleased about it.",
        },
        {
          weight: 40,
          delta: 0,
          text: "It shrugs. Your stake comes back. So does your pulse.",
        },
        {
          weight: 30,
          delta: -SAVINGS_STAKE,
          text: "It drops. The stake is gone. The story you tell yourself is shorter than the loss.",
        },
      ],
    },
  },
  {
    id: "upgrade-monitor",
    label: "Buy an external monitor",
    detail: `${formatMoney(MONITOR_COST)}. More screen, a few extra seconds on the timer.`,
    requires: { money: MONITOR_COST },
    effects: { money: -MONITOR_COST },
    outcome:
      "The laptop becomes a second thought. The new panel is wide enough to hold the ticket and the test.",
  },
  {
    id: "upgrade-cockpit",
    label: "Build a home cockpit",
    detail: `${formatMoney(COCKPIT_COST)}. A second screen. Pings steal less of the hour.`,
    requires: { money: COCKPIT_COST },
    effects: { money: -COCKPIT_COST },
    outcome:
      "Two panels, one lamp, a chair that does not punish you. The room is finally a desk.",
  },
];
