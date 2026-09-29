import { SENIOR_REVIEW } from "./config";
import type { Choice, DayEvent } from "../game/types";

const seniorBar = `skill ${SENIOR_REVIEW.skill}, reputation ${SENIOR_REVIEW.reputation}, health still above ${SENIOR_REVIEW.healthViable}`;

function stayed(flags: readonly string[]): boolean {
  return flags.includes("stayedLate");
}

export const MID_DAYS: DayEvent[] = [
  {
    day: 21,
    title: "The level change",
    scene: (flags) => {
      const tone = flags.includes("fresher:on_track")
        ? "Morgan says the fresher month earned this."
        : flags.includes("fresher:health_warning")
          ? "Morgan says the title is changing and the pace plan is not."
          : "Morgan says the title is changing, and the performance note is still open.";
      return `Rent has left again. Your badge still says the old level. ${tone} Ari, who started this week, is waiting beside your desk with a laptop that will not boot.`;
    },
    choices: [
      {
        id: "d21-scope",
        label: "Ask what mid-level owns now",
        detail: "Get the new map before the new work.",
        effects: { reputation: 4, skill: 2, mood: 2 },
        outcome:
          "Morgan describes a surface you run, not a ticket you wait for. Ari hears it too.",
      },
      {
        id: "d21-ari",
        label: "Sit with Ari until the laptop boots",
        detail: "The promotion can wait twenty minutes.",
        effects: { relationship: 6, mood: 3, reputation: 2 },
        setFlags: ["helpedAri"],
        outcome:
          "You spend the morning on permissions you still remember. Ari looks less lost. You look like someone who was just there.",
      },
      {
        id: "d21-same",
        label: "Act as if the title did not change",
        detail: "Keep your head down.",
        effects: { mood: -2, reputation: -2 },
        outcome:
          "The queue does not care about your level. Morgan notices that you didn't either.",
      },
    ],
  },
  {
    day: 22,
    title: "A ticket with no owner",
    scene:
      "The board has a hole where an owner should be. Jun says, quietly, that this is what the level is. Ari asks if they should take it. They should not. Not yet.",
    choices: [
      {
        id: "d22-own",
        label: "Put your name on it and define the edge",
        detail: "Scope first. Then code.",
        effects: { skill: 4, reputation: 4, energy: -6 },
        outcome:
          "You write the boundary in the ticket before you open the editor. Morgan reacts with a real sentence, not a thumbs-up.",
      },
      {
        id: "d22-pair",
        label: "Pair with Jun on the shape, then you build it",
        detail: "Borrow judgment, keep the ownership.",
        effects: { skill: 3, relationship: 4, reputation: 2 },
        outcome:
          "Jun pokes one hole in the plan. You keep the name on the ticket. It feels like a job, not a rescue.",
      },
      {
        id: "d22-ari",
        label: "Let Ari try, and stay close",
        detail: "Teaching is slower than doing.",
        effects: { relationship: 5, reputation: 1, skill: 1, energy: -4 },
        setFlags: ["helpedAri"],
        outcome:
          "Ari makes the first commit. You make the second. The ticket moves, and so does someone new.",
      },
    ],
  },
  {
    day: 23,
    title: "You run standup",
    scene:
      "Morgan is out. The note says you facilitate. Twelve people look at you the way you looked at Morgan on day three. Ari is about to narrate their entire evening.",
    choices: [
      {
        id: "d23-short",
        label: "Keep it to blockers and one owner",
        detail: "Fifteen minutes, then release them.",
        effects: { reputation: 5, mood: 3, skill: 1 },
        outcome:
          "You cut the story off kindly. People leave with one name next to the risk. Yours, where it should be.",
      },
      {
        id: "d23-ari",
        label: "Give Ari two minutes, then move on",
        detail: "Let them be heard without handing them the meeting.",
        effects: { relationship: 4, reputation: 3, mood: 2 },
        setFlags: ["helpedAri"],
        outcome:
          "Ari names a real blocker. You write it down and do not let the room debug it live.",
      },
      {
        id: "d23-drift",
        label: "Let the room talk",
        detail: "Facilitating felt like interrupting.",
        effects: { reputation: -3, mood: -2, energy: -4 },
        outcome:
          'Standup becomes a design review with no design. Jun messages you after: "next time, stop us."',
      },
    ],
  },
  {
    day: 24,
    title: "The design that is actually yours",
    scene:
      "The ticket you owned needs a decision nobody else will make. There is a short path and a clean path. Ari has already started the short one in a branch named wip-final.",
    choices: [
      {
        id: "d24-clean",
        label: "Choose the clean path and say why",
        detail: "Write the decision where the next person can find it.",
        effects: { skill: 5, reputation: 4, energy: -8 },
        outcome:
          "You pick the clean path and leave a note Ari can follow. The branch named wip-final gets a kinder name.",
      },
      {
        id: "d24-short",
        label: "Ship Ari's short path behind a flag",
        detail: "Speed, with a door you can close.",
        effects: { skill: 3, reputation: 2, relationship: 3, energy: -4 },
        outcome:
          "The flag ships. You tell Ari the flag is the design, not a apology. They look relieved and a little proud.",
      },
      {
        id: "d24-wait",
        label: "Wait for Morgan to pick",
        detail: "Mid-level, still asking permission.",
        effects: { reputation: -3, mood: -2 },
        outcome:
          "Morgan asks what you recommend. You do not have a sentence ready. The ticket ages a day.",
      },
    ],
  },
  {
    day: 25,
    title: "Ari's first review",
    scene:
      "Forty comments would crush them. Three would teach them. Jun offers to do it so you can stay in your own queue. Sam texts about dinner like the level change never happened.",
    choices: [
      {
        id: "d25-teach",
        label: "Review it yourself, and leave three notes",
        detail: "One bug, one habit, one thing they did right.",
        effects: { relationship: 5, reputation: 3, skill: 2, energy: -6 },
        setFlags: ["helpedAri"],
        outcome:
          "Ari fixes the bug and quotes your note about the habit. The queue you postponed is still there. So is the person.",
      },
      {
        id: "d25-jun",
        label: "Ask Jun to review, and you read it after",
        detail: "Share the load. Stay in the loop.",
        effects: { relationship: 3, skill: 2, reputation: 2 },
        outcome:
          "Jun's review is kinder than yours would have been, and sharper. You learn a way to say the hard part.",
      },
      {
        id: "d25-dump",
        label: "Leave forty comments and get back to your ticket",
        detail: "Correct, and too much.",
        effects: { skill: 1, reputation: -2, relationship: -4, mood: -3 },
        outcome:
          "Ari goes quiet in the channel. The ticket is cleaner. The room is not.",
      },
    ],
  },
  {
    day: 26,
    title: "The dependency",
    scene:
      'Another team owns the API you need. Their calendar is a wall. Your launch date is a sentence someone else typed. A meeting invite arrives titled "quick align," which you now know is a lie.',
    choices: [
      {
        id: "d26-write",
        label: "Send the contract in writing and skip the room",
        detail: "A page they can answer without a meeting.",
        effects: { skill: 4, reputation: 4, mood: 2 },
        outcome:
          "They answer on the doc. You did not sit in the lie. Morgan calls that judgment.",
      },
      {
        id: "d26-room",
        label: "Go, and leave with one owner and one date",
        detail: "If you must meet, leave with a fact.",
        effects: { reputation: 3, energy: -8, mood: -2 },
        outcome:
          "You repeat the question until a date exists. The hour is gone. The date is real.",
      },
      {
        id: "d26-wait",
        label: "Wait for them to have time",
        detail: "Polite, and stuck.",
        effects: { reputation: -3, mood: -3 },
        outcome:
          "They do not find time. Your launch sentence starts to look like a wish.",
      },
    ],
  },
  {
    day: 27,
    title: "Production, and it is yours",
    scene:
      'The graph is production, and the recent change has your name on it. Ari is in the channel typing and deleting. Jun is online. Morgan asks, in few words, "you have this?"',
    choices: [
      {
        id: "d27-lead",
        label: "Take the call and give Ari one concrete job",
        detail: "You speak. They check the one thing they can check.",
        effects: {
          reputation: 5,
          skill: 4,
          relationship: 3,
          energy: -10,
          health: -4,
        },
        setFlags: ["helpedAri"],
        outcome:
          "You narrate the checks. Ari confirms the flag. The error bends down. You sound like the owner, because you were.",
      },
      {
        id: "d27-jun",
        label: "Ask Jun to pair, and you keep the comms",
        detail: "Hands on the keys, voice on the bridge.",
        effects: {
          skill: 3,
          relationship: 4,
          reputation: 3,
          energy: -8,
          health: -2,
        },
        outcome:
          "Jun reads logs. You tell the channel what is true. Nobody has to be the hero twice.",
      },
      {
        id: "d27-freeze",
        label: "Go quiet and hope the graph forgives you",
        detail: "The level does not include hiding.",
        effects: { reputation: -5, mood: -5, relationship: -2 },
        outcome:
          "Jun takes the bridge. Morgan does not ask again that day. Ari stops typing.",
      },
    ],
  },
  {
    day: 28,
    title: "Say no",
    scene:
      "A stakeholder wants the happy path, the sad path, and a third path invented this morning. Your surface cannot hold it before the date you just won. Ari looks ready to promise anyway.",
    choices: [
      {
        id: "d28-no",
        label: "Say no, and offer the path that fits",
        detail: "A smaller yes is still a yes.",
        effects: { reputation: 5, skill: 3, mood: 2 },
        outcome:
          "You draw the cut line. Morgan backs it. The stakeholder frowns, then takes the smaller yes.",
      },
      {
        id: "d28-ari",
        label: "Let Ari watch you negotiate, then you decide",
        detail: "Show the no. Don't make them deliver it.",
        effects: { relationship: 4, reputation: 3, skill: 2 },
        setFlags: ["helpedAri"],
        outcome:
          "Ari hears a no that is not an apology. Afterward they say they would have said yes. That was the lesson.",
      },
      {
        id: "d28-yes",
        label: "Say yes and sort it out later",
        detail: "The room leaves happy.",
        effects: { reputation: -3, mood: -4, energy: -6, health: -3 },
        outcome:
          "The room leaves happy. Your week does not. The third path has your name on it now.",
      },
    ],
  },
  {
    day: 29,
    title: "Waiting on the other team",
    scene:
      "The contract is written. The date is real. The other team has not merged. Your editor is idle in a way that feels like failure. Sam asks if mid-level means you can leave on time.",
    choices: [
      {
        id: "d29-unblock",
        label: "Unblock them with a patch they can accept",
        detail: "Do the small annoying part yourself.",
        effects: { skill: 4, reputation: 3, energy: -8 },
        outcome:
          "You send a patch, not a ping. They merge it. The date survives.",
      },
      {
        id: "d29-ari-prep",
        label: "Use the quiet to prep Ari's next task",
        detail: "Idle is a choice.",
        effects: { relationship: 4, skill: 2, reputation: 2, mood: 2 },
        setFlags: ["helpedAri"],
        outcome:
          "Ari starts tomorrow with a ticket that has an edge. You start tomorrow less guilty.",
      },
      {
        id: "d29-stew",
        label: "Refresh the pull request until it hurts",
        detail: "Watching is not leading.",
        effects: { mood: -4, energy: -4, reputation: -1 },
        outcome: "The pull request does not merge faster. Your jaw does.",
      },
    ],
  },
  {
    day: 30,
    title: "Payday, new scale",
    scene:
      'The deposit is larger. It is not retirement, and it is not nothing. Morgan says "nice month" with more specificity than last time. Ari has a question queued before you have had coffee.',
    choices: [
      {
        id: "d30-plan",
        label: "Put the raise toward the retirement number, on paper",
        detail: "Look at the years before you look at the queue.",
        effects: { mood: 4, skill: 1 },
        outcome:
          "You write the new savings guess next to the target. The years move. Not enough, and not zero.",
      },
      {
        id: "d30-visible",
        label: "Spend the morning on the risk Morgan will see",
        detail: "Let the new level be visible.",
        effects: { reputation: 4, skill: 3, energy: -6 },
        outcome:
          'You close the risk that had your name near it. Morgan\'s "nice" attaches to a fact.',
      },
      {
        id: "d30-ari",
        label: "Give Ari the morning and protect your afternoon",
        detail: "Payday is not a new quota.",
        effects: { relationship: 4, mood: 3, health: 2 },
        setFlags: ["helpedAri"],
        outcome: "Ari gets an hour. You get lunch. The queue survives both.",
      },
    ],
  },
  {
    day: 31,
    title: "Ari is stuck",
    scene:
      "Ari has been on one function since yesterday. The diff is a spiral. They apologize before you have read it. Your own review with Morgan is close enough to feel.",
    choices: [
      {
        id: "d31-sit",
        label: "Sit with the function until it has one job",
        detail: "An hour now, or a week of spiral.",
        effects: { relationship: 5, skill: 3, reputation: 2, energy: -8 },
        setFlags: ["helpedAri"],
        outcome:
          'You delete more than you add. Ari says "oh" in the way that means they will not spiral the same way tomorrow.',
      },
      {
        id: "d31-rewrite",
        label: "Rewrite it yourself tonight's problem",
        detail: "Fast, and they learn that stuck means you take it.",
        effects: { skill: 4, reputation: 1, relationship: -3, energy: -6 },
        outcome:
          "The function is clean. Ari did not write it. Next time they will wait for you, which is a different bug.",
      },
      {
        id: "d31-later",
        label: "Tell them to keep trying and get back to your review",
        detail: "Your review is also real.",
        effects: { reputation: 1, relationship: -2, mood: -2 },
        outcome:
          "You protect your prep. Ari is still stuck at dusk. Both things are true, and only one of them feels fine.",
      },
    ],
  },
  {
    day: 32,
    title: "Delegate or stay",
    scene:
      "The follow-up is close, and it is the kind of fix you would have stayed for last month. Ari could land it with you in the room until six, not until midnight. Sam has stopped sending third texts.",
    choices: [
      {
        id: "d32-delegate",
        label: "Let Ari land it, and you review before dinner",
        detail: "The level is the handoff.",
        effects: { relationship: 5, reputation: 4, skill: 2, mood: 2 },
        setFlags: ["helpedAri", "protectedHealth"],
        outcome:
          "Ari lands it at a human hour. You approve it and leave. The commit time looks like a team.",
      },
      {
        id: "d32-late",
        label: "Stay and land it yourself",
        detail: "Old habit, new title.",
        requires: { energy: 24 },
        effects: {
          skill: 5,
          reputation: 3,
          energy: -16,
          health: -10,
          mood: -3,
          relationship: -4,
        },
        setFlags: ["stayedLate"],
        outcome:
          "The build is green and the timestamp is yours alone. Ari never got the landing. Sam's thread stays quiet.",
      },
      {
        id: "d32-half",
        label: "Push a draft so it looks owned",
        detail: "Motion without a decision.",
        effects: { reputation: -3, skill: -1, mood: -3 },
        outcome:
          "The draft fails a check. Tomorrow starts with an apology you are now senior enough to hate.",
      },
    ],
  },
  {
    day: 33,
    title: "After the handoff",
    scene: (flags) =>
      stayed(flags)
        ? "People thank you for the late green build. Ari does not. Morgan mentions pace with the new level in the same sentence, which is worse than last month."
        : "Ari's commit is in the history at a reasonable hour. Jun says that is the job. You feel the strange quiet of not being the one who stayed.",
    choices: (flags): Choice[] =>
      stayed(flags)
        ? [
            {
              id: "d33-stop",
              label: "Tell the room you will not do the sequel",
              detail: "Mid-level includes refusing the encore.",
              effects: { reputation: 3, health: 4, mood: 3 },
              setFlags: ["protectedHealth"],
              outcome:
                "You say it in standup. The thanks get smaller. Your evening gets larger.",
            },
            {
              id: "d33-post",
              label: "Write the postmortem and name the handoff you skipped",
              detail: "Include the part where Ari could have landed it.",
              effects: { reputation: 4, skill: 3, energy: -6, health: -2 },
              outcome:
                'The doc is honest. Morgan writes "this is the lesson." Ari reads it and does not flinch, which is a gift.',
            },
            {
              id: "d33-again",
              label: "Offer to watch production again tonight",
              detail: "The thanks felt like a schedule.",
              requires: { energy: 20 },
              effects: { reputation: 1, energy: -10, health: -6, mood: -3 },
              outcome:
                "You volunteer for a shift nobody staffed. Jun stops arguing after one try.",
            },
          ]
        : [
            {
              id: "d33-credit",
              label: "Give Ari the credit in standup",
              detail: 'Say their name, not "we."',
              effects: { relationship: 5, reputation: 4, mood: 3 },
              setFlags: ["helpedAri"],
              outcome:
                "You say Ari landed it. The room updates its picture of both of you.",
            },
            {
              id: "d33-next",
              label: "Point at the next risk while the room is calm",
              detail: "Use the quiet.",
              effects: { skill: 3, reputation: 4, energy: -4 },
              outcome:
                "You name the next edge before it is an incident. Morgan nods like this is the level.",
            },
            {
              id: "d33-shrug",
              label: "Let the win pass without comment",
              detail: "Humble, and a little erased.",
              effects: { mood: 1, reputation: -1, relationship: -2 },
              outcome:
                "The commit sits in the history with no story. Ari looks unsure it counted.",
            },
          ],
  },
  {
    day: 34,
    title: "Two good uses of a day",
    scene:
      "There is an easy ticket with your name nearby, and there is Ari, who will copy whatever pace you model. Coffee is a choice. So is the second ticket.",
    choices: [
      {
        id: "d34-model",
        label: "Do the easy ticket well, and stop when Ari stops",
        detail: "The pace is the lesson.",
        effects: { skill: 2, health: 4, mood: 3, relationship: 3 },
        setFlags: ["protectedHealth", "helpedAri"],
        outcome:
          "You both stop. The easy ticket is done. Nobody performs exhaustion.",
      },
      {
        id: "d34-second",
        label: "Take the second ticket after theirs is done",
        detail: "More surface, less evening.",
        requires: { energy: 22 },
        effects: { skill: 4, reputation: 3, energy: -10, health: -6 },
        outcome:
          "Two things move. You pay for the second one in the usual places.",
      },
      {
        id: "d34-slow",
        label: "Tell Morgan the day is for Ari",
        detail: "Name the investment.",
        effects: { reputation: 3, relationship: 4, health: 2 },
        setFlags: ["helpedAri"],
        outcome:
          "Morgan says okay and means the team, not the ticket. You do less visible work. It counts differently.",
      },
    ],
  },
  {
    day: 35,
    title: "Rent, and the demo is yours",
    scene:
      "Rent leaves. The demo is on your surface now, not a stakeholder's whim from the fresher month. Ari asks if they should talk. The honest answer is: one part, not the whole room.",
    choices: [
      {
        id: "d35-you",
        label: "Demo the boundary, and let Ari show the flag",
        detail: "You hold the story. They hold one click.",
        effects: { reputation: 5, relationship: 4, skill: 2, energy: -6 },
        setFlags: ["helpedAri"],
        outcome:
          "The room claps at the right time, and once for Ari. You do not hate how that feels.",
      },
      {
        id: "d35-honest",
        label: "Show what is not ready",
        detail: "Mid-level can disappoint a room on purpose.",
        effects: { reputation: 4, skill: 3, mood: 2 },
        outcome:
          "You show the missing edge. The stakeholder asks a better question. Morgan does not rescue you, because you did not need it.",
      },
      {
        id: "d35-ari-all",
        label: "Hand Ari the whole demo",
        detail: "A gift, or a test you did not announce.",
        effects: { relationship: 1, reputation: -3, mood: -3 },
        outcome:
          "Ari does their best. The room is kind and confused. You feel the size of the thing you handed over.",
      },
    ],
  },
  {
    day: 36,
    title: "The senior bar",
    scene: `Morgan books the next review. The agenda is \"the team, and you.\" The bar, in smaller text: ${seniorBar}. Ari's name is in your notes more often than your own.`,
    choices: [
      {
        id: "d36-prep",
        label: "Prepare two decisions and one handoff",
        detail: "Examples of judgment, not hours.",
        effects: { reputation: 5, skill: 2, energy: -6 },
        setFlags: ["pushedForReview"],
        outcome:
          "You walk in with decisions you made and a landing you gave away. That is the map.",
      },
      {
        id: "d36-wing",
        label: "Trust that the month is obvious",
        detail: "It is not obvious from outside your head.",
        effects: { mood: 1, reputation: 1 },
        outcome:
          "You are pleasant and vague. The month was not vague. The notes are.",
      },
      {
        id: "d36-script",
        label: "Over-prepare until the sentences sound borrowed",
        detail: "A script is not a review.",
        effects: { energy: -8, mood: -3, skill: 2, reputation: 2 },
        outcome:
          "One sentence survives. The rest sounded like a fresher trying on a bigger coat.",
      },
    ],
  },
  {
    day: 37,
    title: "The team, and you",
    scene: (flags) => {
      const lines = [
        'Morgan closes the laptop. "How is the team, and how are you."',
      ];
      if (flags.includes("fresher:health_warning")) {
        lines.push('"The pace plan did not expire with the title."');
      }
      if (flags.includes("helpedAri")) {
        lines.push(
          '"Ari is in this conversation whether you bring them up or not."',
        );
      }
      if (flags.includes("stayedLate")) {
        lines.push('"I saw the commit time again."');
      }
      return lines.join(" ");
    },
    choices: [
      {
        id: "d37-both",
        label: "Talk about Ari's landing and your own stop",
        detail: "The team and you, in one answer.",
        effects: { reputation: 5, skill: 2, mood: 3, relationship: 2 },
        outcome:
          'Morgan writes "judgment" and "pace" on the same line. Senior is not offered. The line is a map.',
      },
      {
        id: "d37-team",
        label: "Talk only about the team",
        detail: "Hide inside the mentoring.",
        effects: { reputation: 2, relationship: 2, mood: -2 },
        outcome:
          "The team sounds healthy. You sound absent. Morgan asks the question again, softer.",
      },
      {
        id: "d37-fine",
        label: "Say the team is fine and so are you",
        detail: "Smooth, and thin.",
        effects: { reputation: -2, mood: -4, health: -2 },
        outcome:
          "It is not all fine. The sentence sits there until the meeting ends.",
      },
    ],
  },
  {
    day: 38,
    title: "The week of the next review",
    scene:
      "A visible slice can look finished if you sprint, or finished enough if you cut it. Ari will copy whichever one you pick. Jun says senior is a cut, not a hero commit.",
    choices: [
      {
        id: "d38-cut",
        label: "Cut the slice and name what is left",
        detail: "Judgment is the edit.",
        effects: { skill: 4, reputation: 5, energy: -6, health: 1 },
        outcome:
          "You ship a boundary and a list. It reads like someone who can be trusted with a bigger one.",
      },
      {
        id: "d38-sprint",
        label: "Sprint so the screenshot is complete",
        detail: "Hours for a picture.",
        requires: { energy: 24 },
        effects: {
          skill: 5,
          reputation: 3,
          energy: -16,
          health: -12,
          mood: -4,
          relationship: -4,
        },
        setFlags: ["stayedLate"],
        outcome:
          "The screenshot is complete. You and the evening are not. Ari saw the sprint and will remember it.",
      },
      {
        id: "d38-ari",
        label: "Give Ari a piece of the slice and review it",
        detail: "The review cares about the handoff.",
        effects: { relationship: 5, reputation: 3, skill: 2, energy: -5 },
        setFlags: ["helpedAri"],
        outcome:
          "Ari ships a piece with their name on it. Yours is the review that made it safe.",
      },
    ],
  },
  {
    day: 39,
    title: "Green enough",
    scene:
      "The build is green enough to leave. Ari's notes for tomorrow are half a page. Sam sends a walk with no caption, which is trust. Morgan does not need a hero. The senior conversation is in the morning, with payday.",
    choices: [
      {
        id: "d39-leave",
        label: "Leave the build, and read Ari's notes once",
        detail: "Then close the laptop.",
        effects: { relationship: 3, mood: 4, health: 4, reputation: 2 },
        setFlags: ["protectedHealth", "helpedAri"],
        outcome:
          "You fix one sentence in Ari's notes and stop. The build stays green without supervision.",
      },
      {
        id: "d39-polish",
        label: "One more pass on the slice",
        detail: "Small, real, and it spends the evening early.",
        effects: { skill: 3, reputation: 2, energy: -8, health: -4 },
        outcome:
          "The polish is real. So is the dent. Ari's notes stay half a page.",
      },
      {
        id: "d39-note",
        label: "Write Morgan four lines: team, decision, stop",
        detail: "What you would not repeat.",
        effects: { reputation: 5, skill: 1, energy: -4 },
        outcome:
          'Four lines. Morgan replies, "this is the review," which is a lot from Morgan.',
      },
    ],
  },
  {
    day: 40,
    title: "Toward senior",
    scene: (flags) => {
      const bits = [
        "Payday and the senior conversation share a morning. There is no promotion in the invite. There is a question about whether you can run a surface without becoming the surface.",
      ];
      if (flags.includes("helpedAri")) {
        bits.push(" Ari is in the building, less lost than on day 21.");
      }
      if (flags.includes("stayedLate")) {
        bits.push(" The late commits are still in the history.");
      }
      if (flags.includes("protectedHealth")) {
        bits.push(" So are the evenings you left intact.");
      }
      return bits.join("");
    },
    choices: [
      {
        id: "d40-examples",
        label: "Speak in decisions, handoffs, and stops",
        detail: "Not hours. Not vibes.",
        effects: { reputation: 4, skill: 2, mood: 2 },
        outcome:
          "You talk about a no, a landing you gave Ari, and a night you did not stay. Morgan writes while you talk.",
      },
      {
        id: "d40-listen",
        label: "Listen to the bar before you edit it",
        detail: "Let Morgan's version land.",
        effects: { reputation: 3, mood: 4, health: 1 },
        outcome:
          "Morgan tells you what they saw in the team and in you. You let it land. Senior stays a direction.",
      },
      {
        id: "d40-sprint",
        label: "Promise a sprint after this review too",
        detail: "Offer hours. That was the fresher answer.",
        effects: { reputation: -1, health: -4, mood: -4, energy: -6 },
        outcome:
          "You offer more hours. Morgan's pen pauses, the same way it did last month. The question moved. The answer did not.",
      },
    ],
  },
];
