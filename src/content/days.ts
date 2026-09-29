import { MID_DAYS } from "./midDays";
import { REVIEW } from "./config";
import type { Choice, DayEvent } from "../game/types";

const reviewBar = `skill ${REVIEW.skill}, reputation ${REVIEW.reputation}, health still above ${REVIEW.healthViable}`;

function stayed(flags: readonly string[]): boolean {
  return flags.includes("stayedLate");
}

const FRESHER_DAYS: DayEvent[] = [
  {
    day: 1,
    title: "Badge photo day",
    scene:
      "Rent has already left your account. The badge printer is out of ribbon. Jun, two desks over, holds up a spare lanyard like it is a rescue.",
    choices: [
      {
        id: "d1-jun",
        label: "Ask Jun where a person actually sits",
        detail: "Start with a person, not a floor map.",
        effects: { relationship: 6, mood: 4 },
        outcome:
          "Jun walks you past three wrong pods. You owe them a coffee you cannot quite afford yet.",
      },
      {
        id: "d1-alone",
        label: "Hunt for the desk alone",
        detail: "The map is laminated. That has to count.",
        effects: { skill: 2, mood: -2 },
        outcome:
          "You sit somewhere that might be yours. The plant seems to know the truth.",
      },
      {
        id: "d1-morgan",
        label: "Message Morgan that you arrived",
        detail: "Make the manager the first ping.",
        effects: { reputation: 4, energy: -2 },
        outcome:
          "Morgan replies with a calendar link and a thumbs-up. The thumbs-up does a lot of work.",
      },
    ],
  },
  {
    day: 2,
    title: "Permissions",
    scene:
      "The laptop arrives sealed and useless. No repo, no VPN, no admin. The setup doc was last touched by someone who has left the company.",
    choices: [
      {
        id: "d2-tickets",
        label: "File every access ticket properly",
        detail: "Slow, boring, and real.",
        effects: { skill: 4, reputation: 3, energy: -8 },
        outcome:
          "IT has a trail of polite tickets. You have a headache and a paper trail.",
      },
      {
        id: "d2-jun",
        label: "Ask Jun for the unofficial path",
        detail: "Someone has a script. Of course they do.",
        effects: { relationship: 5, skill: 3 },
        setFlags: ["askedJun"],
        outcome:
          "Jun’s script is named setup-final-FINAL. It works. You decide not to ask why.",
      },
      {
        id: "d2-wait",
        label: "Wait, and look employed",
        detail: "Arrange windows until the screen looks busy.",
        effects: { mood: 2, reputation: -2 },
        outcome:
          'Nothing installs. You do learn which slack emoji means "I am suffering quietly."',
      },
    ],
  },
  {
    day: 3,
    title: "Standup",
    scene:
      "Morgan asks what you did yesterday. Yesterday you waited for a password. Twelve people are listening, and one of them is already muted.",
    choices: [
      {
        id: "d3-truth",
        label: "Tell the truth in one sentence",
        detail: "Got access. Read the ticket. That is the whole story.",
        effects: { reputation: 4, mood: 3 },
        outcome:
          '"Got access, read the button ticket." Morgan nods like that was the assignment.',
      },
      {
        id: "d3-spike",
        label: "Invent a research spike",
        detail: "It sounds like work if you say it fast.",
        effects: { reputation: -4, mood: -4, skill: 1 },
        outcome:
          "The spike has no notes. Jun does not look at you, which is a kindness.",
      },
      {
        id: "d3-none",
        label: 'Say "no blockers" and sit down',
        detail: "The classic. Short. Incomplete.",
        effects: { mood: 1, reputation: -1 },
        outcome:
          "Nobody follows up. The ticket is still waiting, and so is the truth.",
      },
    ],
  },
  {
    day: 4,
    title: "Ticket with no spec",
    scene:
      "The ticket says make the button feel better. There is no design, no metric, and three comments that disagree with each other.",
    choices: [
      {
        id: "d4-ask",
        label: "Write your assumptions and ask Morgan",
        detail: "Make the vagueness visible.",
        effects: { skill: 5, reputation: 4, energy: -8 },
        outcome:
          "Morgan picks an assumption. The button has a definition. You did that.",
      },
      {
        id: "d4-guess",
        label: "Ship a reasonable guess",
        detail: "Rounder. Slightly. Surely that is feel.",
        effects: { skill: 3, reputation: -1, mood: -2 },
        outcome:
          "The button is rounder. Someone will have feelings about that tomorrow.",
      },
      {
        id: "d4-jun",
        label: "Pull Jun in for fifteen minutes",
        detail: "Borrow judgment you do not have yet.",
        effects: { relationship: 5, skill: 3 },
        setFlags: ["askedJun"],
        outcome:
          'Jun says the last person who "felt" the button quit. You take a smaller swing.',
      },
    ],
  },
  {
    day: 5,
    title: "The optional lunch",
    scene:
      "Lunch is optional. Your calendar already has a dotted block named sync that nobody owns. The button ticket is still pink.",
    choices: [
      {
        id: "d5-lunch",
        label: "Go, and ask what the product is for",
        detail: "Costs a little money. Buys context.",
        effects: { relationship: 4, mood: 5, reputation: 2, money: -15 },
        outcome:
          "You learn the product has users who are not in this slack. That should have been day one.",
      },
      {
        id: "d5-ticket",
        label: "Stay and move the ticket",
        detail: "The sync can sync without you.",
        effects: { skill: 4, energy: -6, mood: -3, health: -3 },
        outcome:
          "The button ships a shade. Your lunch is a protein bar from a drawer.",
      },
      {
        id: "d5-walk",
        label: "Walk the block",
        detail: "Miss the optional meeting on purpose.",
        effects: { health: 5, mood: 4, reputation: -1 },
        outcome:
          "You miss a sync that was optional. Your head is quieter. Morgan’s is not.",
      },
    ],
  },
  {
    day: 6,
    title: "The meeting that had a meeting",
    scene:
      "A thirty-minute align becomes a review of a document nobody read. Your laptop fan starts a second conversation.",
    choices: [
      {
        id: "d6-notes",
        label: "Stay and take notes Morgan can use",
        detail: "Be useful in a room that is not.",
        effects: { reputation: 6, energy: -10, mood: -3, health: -2 },
        outcome:
          "You send the notes. Morgan reacts with a checkmark. The hour does not come back.",
      },
      {
        id: "d6-leave",
        label: "Ask if you are needed, then leave",
        detail: 'Take the "probably" and go.',
        effects: { mood: 3, energy: -2, reputation: 1 },
        outcome:
          "Someone says probably. You leave before the document gains a fourth owner.",
      },
      {
        id: "d6-corner",
        label: "Work the ticket from the corner",
        detail: "Present in body, absent in thread.",
        effects: { skill: 3, reputation: -3, mood: -2 },
        outcome:
          "You ship from the meeting. The notes you missed had your name in them.",
      },
    ],
  },
  {
    day: 7,
    title: "Sam texts at noon",
    scene:
      'Sam texts about dinner, nothing fancy. You have been "starting the job" for a week. The afternoon ticket is red because you were the last person to touch the button.',
    choices: [
      {
        id: "d7-fix",
        label: "Focus and ship a small fix",
        detail: "Dinner stays a question mark.",
        effects: { skill: 5, energy: -8, health: -2 },
        outcome:
          "The red fades. So does the afternoon. Sam’s text is still there, unread on purpose.",
      },
      {
        id: "d7-channel",
        label: "Ask the channel before you sink",
        detail: "Panic is smaller when it is shared.",
        effects: { skill: 3, reputation: 3, relationship: 2 },
        outcome:
          "Two people answer. The fix is smaller than your panic. Jun adds the useful link.",
      },
      {
        id: "d7-logs",
        label: "Stare at the logs until they blur",
        detail: "Looking busy at the problem.",
        effects: { skill: 1, energy: -8, mood: -5 },
        outcome:
          "The logs teach you what tired looks like. The ticket stays red.",
      },
    ],
  },
  {
    day: 8,
    title: "The alert that was a dashboard",
    scene:
      "A graph screams in slack. Your stomach files an incident before your eyes do. Jun glances over and mouths one word: staging.",
    choices: [
      {
        id: "d8-check",
        label: "Check the environment before you speak",
        detail: "Read the label. Then the room.",
        effects: { skill: 4, reputation: 4, energy: -6 },
        outcome:
          "It is staging. You say so, with the graph attached. People unclench.",
      },
      {
        id: "d8-page",
        label: "Announce an incident immediately",
        detail: "Wake the channel. Hope you are right.",
        effects: { reputation: -3, mood: -4 },
        outcome:
          "The channel wakes up, then learns the word staging from someone who is not you.",
      },
      {
        id: "d8-jun",
        label: "Ask Jun quietly what to do",
        detail: "Use the person who already knows.",
        effects: { relationship: 4, skill: 2 },
        setFlags: ["askedJun"],
        outcome:
          "Jun points at a label you skipped. You feel new, and also not alone.",
      },
    ],
  },
  {
    day: 9,
    title: "First review",
    scene:
      "Forty comments. Most of them are nits about names. One of them is a real bug in the button you made feel better.",
    choices: [
      {
        id: "d9-thanks",
        label: "Fix the bug and thank them for the nits",
        detail: "Swallow the semicolon. Keep the lesson.",
        effects: { skill: 5, reputation: 4, energy: -8, mood: -2 },
        outcome:
          "The bug dies. You thank a stranger for a semicolon. It counts more than you want.",
      },
      {
        id: "d9-argue",
        label: "Argue the nits in the thread",
        detail: "You are right about a variable name.",
        effects: { reputation: -4, mood: -5 },
        outcome:
          "You win a naming debate and lose the room. The bug is still sitting there.",
      },
      {
        id: "d9-quiet",
        label: "Fix only the bug, and say nothing",
        detail: "Do the dangerous line. Leave the dishes.",
        effects: { skill: 4, reputation: 1 },
        outcome:
          "The dangerous line is gone. The nits remain, like unwashed mugs.",
      },
    ],
  },
  {
    day: 10,
    title: "Payday",
    scene:
      'Salary lands before standup. Morgan says "nice start" in a tone that could mean anything. The queue does not celebrate with you.',
    choices: [
      {
        id: "d10-visible",
        label: "Take a small, visible fix",
        detail: "Put your name where people can see it.",
        effects: { reputation: 5, skill: 3, energy: -8, health: -2 },
        outcome:
          'Your name is on a small thing people notice. Morgan’s "nice" gets a little more specific.',
      },
      {
        id: "d10-deploy",
        label: "Learn the deploy path while it is quiet",
        detail: "Know where a build goes.",
        effects: { skill: 6, energy: -6 },
        outcome:
          "You can say where a build goes. That sentence will matter on a worse day.",
      },
      {
        id: "d10-normal",
        label: "Do a normal amount, and eat lunch",
        detail: "Let payday feel like money.",
        effects: { mood: 5, health: 3, skill: 2 },
        outcome:
          "You let the salary be a salary. The queue survives a human pace.",
      },
    ],
  },
  {
    day: 11,
    title: "It is production this time",
    scene:
      "This graph is production. A customer-facing error is climbing. Morgan says you are on the call. Jun is already there, calmer than the channel.",
    choices: [
      {
        id: "d11-call",
        label: "Stay on the call and run the boring checks",
        detail: "Be the voice in the incident.",
        effects: { reputation: 6, skill: 4, energy: -12, health: -8, mood: -3 },
        outcome:
          "You read dashboards out loud until the error bends down. Morgan heard your voice. Your throat did too.",
      },
      {
        id: "d11-pair",
        label: "Split the checklist with Jun",
        detail: "Logs for them, deploys for you.",
        effects: {
          relationship: 5,
          skill: 4,
          reputation: 3,
          energy: -8,
          health: -4,
        },
        setFlags: ["helpedJun"],
        outcome:
          "The error flattens between you. Nobody has to be the hero of the bridge.",
      },
      {
        id: "d11-quiet",
        label: "Go quiet and let Jun talk",
        detail: "Attendance is not the same as help.",
        effects: { relationship: 1, reputation: -4, mood: -5 },
        outcome: "Jun carries it. You are on the invite and not in the story.",
      },
    ],
  },
  {
    day: 12,
    title: "The branch is close",
    scene:
      "The follow-up fix is close. The laptop is warm. Sam has not heard from you today. A late green build would be the first thing Morgan sees in the morning.",
    choices: [
      {
        id: "d12-late",
        label: "Stay late and land it",
        detail: "The commit time will tell on you.",
        requires: { energy: 24 },
        effects: {
          skill: 6,
          reputation: 6,
          energy: -18,
          health: -12,
          mood: -4,
          relationship: -6,
        },
        setFlags: ["stayedLate"],
        outcome:
          "The build goes green after the office lights don’t. Sam’s message stays on read. Morgan will see the timestamp.",
      },
      {
        id: "d12-pause",
        label: "Stop at a clean pause",
        detail: "Write tomorrow’s first step. Close the lid.",
        effects: { skill: 2, reputation: 2, mood: 3, health: 3 },
        setFlags: ["protectedHealth"],
        outcome:
          "The fix is not heroic. It is findable. You leave while the trains are still frequent.",
      },
      {
        id: "d12-half",
        label: "Push a half-finished branch",
        detail: "Let it look like motion.",
        effects: { reputation: -4, skill: -2, mood: -4 },
        outcome:
          "The branch looks busy and fails a check. Tomorrow starts with an apology.",
      },
    ],
  },
  {
    day: 13,
    title: (flags) =>
      stayed(flags) ? "The morning after green" : "Still open",
    scene: (flags) =>
      stayed(flags)
        ? 'People thank you in standup, then look at your face a second too long. The fix held. Your eyes did not. Morgan says "we should talk about pace" like it is a calendar item, because it is.'
        : "The bug is still in yesterday’s branch. The thread is polite in the way that means soon. Jun has a free half hour, if you ask before noon.",
    choices: (flags): Choice[] =>
      stayed(flags)
        ? [
            {
              id: "d13-watch",
              label: "Say you will watch it, not hero it",
              detail: "Decline the sequel.",
              effects: { reputation: 3, health: 4, mood: 3 },
              setFlags: ["protectedHealth"],
              outcome:
                "You refuse the second late night. The thanks get quieter, which is a relief.",
            },
            {
              id: "d13-post",
              label: "Write the short postmortem",
              detail: "Include the commit time. Don’t romanticize it.",
              effects: { reputation: 5, skill: 3, energy: -8, health: -3 },
              outcome:
                'The doc is honest about the hour. Morgan comments: "good, and let’s talk pace."',
            },
            {
              id: "d13-again",
              label: "Offer to keep watching tonight too",
              detail: "The thanks felt like a request.",
              requires: { energy: 20 },
              effects: {
                reputation: 2,
                energy: -10,
                health: -6,
                mood: -3,
                relationship: -3,
              },
              outcome:
                "You volunteer for a sequel nobody scheduled. Jun stops arguing after one try.",
            },
          ]
        : [
            {
              id: "d13-daylight",
              label: "Finish it in daylight",
              detail: "A commit time that looks like a job.",
              effects: { skill: 5, reputation: 4, energy: -8 },
              outcome:
                "You land it while other people are also working. The timestamp looks ordinary. Good.",
            },
            {
              id: "d13-pair",
              label: "Ask Jun to pair before noon",
              detail: "Trade a half hour for their eyes.",
              effects: { relationship: 5, skill: 3, reputation: 2 },
              setFlags: ["helpedJun"],
              outcome:
                "Jun spots the check you were about to skip. You still have not bought that coffee.",
            },
            {
              id: "d13-later",
              label: "Leave it for after lunch",
              detail: "After lunch has a reputation.",
              effects: { skill: 1, reputation: -3, mood: -2 },
              outcome:
                "After lunch becomes tomorrow. The polite thread grows one more polite line.",
            },
          ],
  },
  {
    day: 14,
    title: "Coffee covering for sleep",
    scene:
      "Coffee is doing a job that belonged to sleep. The ticket in front of you is easy. Your body has already voted.",
    choices: [
      {
        id: "d14-easy",
        label: "Do the easy ticket, then stop",
        detail: "Let the vote win.",
        effects: { skill: 3, health: 5, mood: 4 },
        setFlags: ["protectedHealth"],
        outcome: "One clean thing, then you stop. The day stays a day.",
      },
      {
        id: "d14-second",
        label: "Power through a second ticket",
        detail: "Two greens. One jaw.",
        requires: { energy: 22 },
        effects: { skill: 5, reputation: 3, energy: -12, health: -8, mood: -3 },
        outcome:
          "Two tickets move. You pay in the afternoon, then in your jaw.",
      },
      {
        id: "d14-slow",
        label: "Tell Morgan you are slow today",
        detail: "Say the pace out loud.",
        effects: { reputation: 2, health: 4, mood: 2 },
        outcome:
          "Morgan says okay and means it. You do less. It is logged nowhere, and it helps.",
      },
    ],
  },
  {
    day: 15,
    title: "Rent, again",
    scene:
      "Rent leaves again. The payday emoji is still pinned above a thread about a demo. A stakeholder wants the happy path, today, in a room with too many chairs.",
    choices: [
      {
        id: "d15-demo",
        label: "Prepare a three-click demo",
        detail: "No archaeology. Just the path.",
        effects: { reputation: 5, skill: 3, energy: -8 },
        outcome:
          "Three clicks, and the stakeholder claps at the right time. You hate how good that feels.",
      },
      {
        id: "d15-honest",
        label: "Say the happy path is not honest yet",
        detail: "Show the broken edge.",
        effects: { reputation: 4, mood: 2, skill: 2 },
        outcome:
          "You show the broken edge. Morgan backs you. The stakeholder frowns, then asks a better question.",
      },
      {
        id: "d15-main",
        label: "Demo whatever is on main",
        detail: "Apologize live if you have to.",
        effects: { reputation: -4, mood: -5 },
        outcome:
          "Main has a surprise. You apologize to a room that will remember the surprise longer than the feature.",
      },
    ],
  },
  {
    day: 16,
    title: "The 1:1 invite",
    scene: `Morgan books twenty-five minutes. The agenda is "how are you, really." Under it, in smaller text, the bar they will actually use: ${reviewBar}. Your feelings do not have a chart.`,
    choices: [
      {
        id: "d16-prep",
        label: "Prepare two wins and one ask",
        detail: "Examples, not a vibe.",
        effects: { reputation: 5, skill: 2, energy: -6 },
        setFlags: ["pushedForReview"],
        outcome:
          "You walk in with tickets, not adjectives. The ask is about scope.",
      },
      {
        id: "d16-wing",
        label: "Wing it",
        detail: "You can be charming for twenty-five minutes.",
        effects: { mood: 2, reputation: 1 },
        outcome:
          "You are pleasant and unspecific. Charm does not link to a pull request.",
      },
      {
        id: "d16-script",
        label: "Over-rehearse every sentence",
        detail: "Turn a conversation into a script.",
        effects: { energy: -8, mood: -4, skill: 2, reputation: 2 },
        outcome:
          "You practice until the words sound borrowed. One sentence is still useful.",
      },
    ],
  },
  {
    day: 17,
    title: "How are you, really",
    scene: (flags) => {
      const lines = ['Morgan closes the laptop. "How are you, really."'];
      if (flags.includes("stayedLate")) lines.push('"I saw the commit time."');
      if (flags.includes("protectedHealth")) {
        lines.push(
          '"You have been leaving at a human hour. I noticed that too."',
        );
      }
      lines.push(
        "The review bar from the invite is still the bar. This meeting is about whether you can hear it.",
      );
      return lines.join(" ");
    },
    choices: [
      {
        id: "d17-mid",
        label: "Ask what mid-level means here",
        detail: "Get the map. Don’t ask for the title.",
        effects: { skill: 2, reputation: 4, mood: 2 },
        outcome:
          "Morgan describes judgment, not hours. There is no promotion today. There is a map.",
      },
      {
        id: "d17-sleep",
        label: "Admit the month cost sleep",
        detail: "Put the cost on the table.",
        effects: { health: 2, reputation: 3, mood: 4, relationship: 2 },
        outcome:
          'You say the true cost. Morgan writes "pace" and does not argue with your body.',
      },
      {
        id: "d17-fine",
        label: "Say everything is fine",
        detail: "Keep the month looking smooth.",
        effects: { reputation: -2, mood: -5, health: -2 },
        outcome:
          "Everything is not fine. The sentence sits in the room until the meeting ends.",
      },
    ],
  },
  {
    day: 18,
    title: "The week of the review",
    scene:
      "A visible project can look finished if you sprint. Jun says the review cares more about judgment than a heroic commit. Sam has a walk planned and will not send a third text.",
    choices: [
      {
        id: "d18-sprint",
        label: "Sprint and make it look finished",
        detail: "Hours in exchange for a screenshot.",
        requires: { energy: 24 },
        effects: {
          skill: 7,
          reputation: 6,
          energy: -18,
          health: -14,
          mood: -4,
          relationship: -5,
        },
        setFlags: ["stayedLate", "pushedForReview"],
        outcome:
          "The project looks finished. You look finished in a different way. Jun’s warning sits with your unread texts.",
      },
      {
        id: "d18-slice",
        label: "Finish a smaller slice cleanly",
        detail: "Name what is left. Ship the boundary.",
        effects: { skill: 4, reputation: 4, energy: -6, health: 1 },
        outcome:
          "You ship a boundary and write down what remains. It reads like judgment.",
      },
      {
        id: "d18-jun",
        label: "Help Jun prep their notes",
        detail: "Their review is this week too.",
        effects: { relationship: 6, reputation: 2, energy: -4 },
        setFlags: ["helpedJun"],
        outcome:
          "Jun’s notes get sharper. Yours get a little less lonely. The visible project can wait a day.",
      },
    ],
  },
  {
    day: 19,
    title: "Green enough",
    scene:
      "The build is green enough to leave alone. Sam sends a photo of last week’s walk, no caption. Morgan does not need a hero today. The review is tomorrow, payday riding shotgun.",
    choices: [
      {
        id: "d19-leave",
        label: "Leave the build alone",
        detail: "Do not supervise a green build.",
        effects: { mood: 4, health: 4, reputation: 1 },
        setFlags: ["protectedHealth"],
        outcome:
          "You do not open the editor. The build stays green without your supervision.",
      },
      {
        id: "d19-polish",
        label: "One more polish pass",
        detail: "Small, real, and it takes the evening’s energy early.",
        effects: { skill: 3, reputation: 2, energy: -8, health: -4 },
        outcome: "The polish is real and small. So is the dent it puts in you.",
      },
      {
        id: "d19-note",
        label: "Write Morgan a short week note",
        detail: "What shipped, what you learned, what you would not repeat.",
        effects: { reputation: 5, energy: -4, skill: 1 },
        outcome:
          'Four lines. Morgan replies, "thanks, this helps," which is a lot from Morgan.',
      },
    ],
  },
  {
    day: 20,
    title: "Review morning",
    scene: (flags) => {
      const bits = [
        "Payday and the review share a morning. Morgan’s notes are tilted just enough that you cannot read them.",
      ];
      if (flags.includes("studied")) {
        bits.push(
          " The deploy path you studied is in your head if you need an example.",
        );
      }
      if (flags.includes("sawSomeone")) {
        bits.push(
          " You have a life outside this room. That is either ballast or a distraction.",
        );
      }
      if (flags.includes("stayedLate")) {
        bits.push(
          " The late commits are in the history whether you bring them up or not.",
        );
      }
      if (flags.includes("tookRisk")) {
        bits.push(
          " You also know, privately, what it felt like to move savings and wait.",
        );
      }
      return bits.join("");
    },
    choices: [
      {
        id: "d20-examples",
        label: "Speak in examples",
        detail: "A bug, a choice, a stop.",
        effects: { reputation: 3, skill: 1, mood: 2 },
        outcome:
          "You talk about a bug, a choice, and a time you stopped. Morgan writes while you talk.",
      },
      {
        id: "d20-listen",
        label: "Listen more than you talk",
        detail: "Let Morgan’s version land.",
        effects: { reputation: 2, mood: 4, health: 1 },
        outcome:
          "Morgan tells you what they saw. You let it land before you edit it.",
      },
      {
        id: "d20-sprint",
        label: "Promise a sprint after the review",
        detail: "Offer hours. That was not the question.",
        effects: { reputation: 1, health: -4, mood: -4, energy: -6 },
        outcome:
          "You offer more hours. Morgan’s pen pauses. Pace was the subject, not output.",
      },
    ],
  },
];

export const DAYS: DayEvent[] = [...FRESHER_DAYS, ...MID_DAYS];
