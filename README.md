# Dev Simulator

A cozy mobile game about a software career. You start as a fresher, do short visual work tickets, climb the ladder, and decide what to do with your money.

This README is the rules reference for the team. It has exact numbers. The in-game tooltips only say what each stat is for, so players discover the details by playing.

## Play

```bash
npm install
npm run dev        # http://localhost:5173
npm test
npm run build
npm run ios        # build, sync, and open the iOS project
npm run ios:sync   # build and sync without opening Xcode
npm run push       # push to github.com/lhlvu1999/devSimulator as lhlvu1999, then switch gh back
```

## The day

1. **Placement.** Tic-tac-toe against a newbie opponent. A faster win gives a higher fresher profile: skill 8 on a loss, 11 on a draw, 12 for a slow win, 16 for a 4-move win, and up to 22 for a 3-move win. Placement never goes past fresher.
2. **Goal, then offers.** Pick what this life is for, then choose from three companies based on your placement skill. Each has a tier (seed, growth, established, giant) and a type (startup, product, agency, enterprise, remote).
3. **Room.** The room is your workplace. The top bar shows the week, your title, energy, mood, health, and money; tap it for full stats. The machine on the desk opens **Work**. Everything else lives in the bottom bar: **Home** (the room), **Invest**, **Jobs** (Workline), **Shop**, and **Me** (stats, the Career and Life cards, and Settings). Tap the tab you are on to go back to the room. The bar hides during work, free time, and interviews.
4. **Work.** The monitor opens the **work board**: a week of 40 work hours and a set of tickets with sizes and deadlines. Work tickets until you choose **Wrap up the week**. After that, the monitor says **Free time**.
5. **Free time and the week's end.** The monitor opens free time. **End the week** moves prices, pays payday and rent, refills energy, and shows a summary. **Next week** starts the new one, sometimes with an event card.

Payday and rent both come every 4 weeks, like a month: salary × level pay in cash plus stock, and $500 rent.

## Life

One game day is **one week** of life. You start at 22. A run lasts until you reach your goal, burn out, get too sick, or turn 60 (week 1976).

### Goal

Chosen right after placement. Older saves are asked once.

| Goal          | Met when                                  |
| ------------- | ----------------------------------------- |
| Retire early  | Net worth reaches $500,000                |
| Own a home    | You buy the $180,000 home in the Shop     |
| Reach the top | You become Principal engineer or Director |

The Life card in Stats shows age, week, net worth, goal progress, and achievements.

### Endings and score

| Ending              | When                          |
| ------------------- | ----------------------------- |
| You did it          | Goal met at the end of a week |
| Burned out          | Mood reaches 0                |
| Your body said stop | Health reaches 0              |
| Retired at 60       | Time runs out                 |

Score = ending base (goal 2000, age 600, burnout or health 150) + 60 × years left before 60 (goal only) + net worth ÷ 500 + 3 × mood + 3 × health + 100 × achievements.

### Free time

After **Wrap up the week**, the monitor says **Free time**. Time outside work comes in two pools:

- **Weeknights:** 2 a week, or 3 without a job. Wrapping up early adds up to 2 more, and a sick or burnout week adds 1.
- **Weekend:** 2 days a week. Startup overtime takes weeknights first, then weekend days.

#### Sleep

Pick a sleep habit for the week. It can be changed any time you still have the evening to give up.

| Sleep  | Weeknights | At the end of the week                                      |
| ------ | ---------- | ----------------------------------------------------------- |
| Early  | −1         | +4 health, +1 mood                                          |
| Normal | —          | —                                                           |
| Late   | +1         | −3 health, and next week starts at 80 energy instead of 100 |

#### Weeknights

| Plan                | Cost | Energy | Effect                              |
| ------------------- | ---- | ------ | ----------------------------------- |
| Gym                 | $15  | 15     | +6 health, +2 mood                  |
| Quiet night in      | Free | 0      | +3 health, +4 mood                  |
| Dinner with friends | $40  | 10     | +8 mood                             |
| Team drinks         | $35  | 10     | +3 relationship, +3 mood, −2 health |
| Tech meetup         | $20  | 10     | +2 reputation, +10 skill            |

#### Weekend

| Plan              | Days | Cost | Energy | Effect                                       |
| ----------------- | ---- | ---- | ------ | -------------------------------------------- |
| Date day          | 1    | $80  | 10     | +12 mood, +1 health                          |
| Get outside       | 1    | $10  | 15     | +7 health, +5 mood                           |
| Visit family      | 1    | $30  | 10     | +10 mood, +2 health                          |
| Weekend hackathon | 2    | Free | 30     | +40 skill, +2 reputation, −2 mood, −3 health |
| Vacation          | 2    | $900 | 0      | +25 mood, +10 health                         |

#### Pursuits

Things that build up over many weeks.

- **Courses** take one weeknight per lesson. The last lesson earns a certificate and a bigger reward.

  | Course                | Lessons | Per lesson     | Each lesson     | Certificate                    |
  | --------------------- | ------- | -------------- | --------------- | ------------------------------ |
  | Frontend fundamentals | 6       | $60, 12 energy | +8 skill        | +80 skill, +2 reputation       |
  | System design         | 10      | $90, 15 energy | +12 skill       | +200 skill, +4 reputation      |
  | Leading people        | 8       | $80, 12 energy | +1 relationship | +8 relationship, +4 reputation |

- **Hobbies** fit a weeknight or a weekend day. Doing one in back-to-back weeks builds a streak, and each extra week adds +1 to its main stat, up to +4. Missing a week starts the streak over.

  | Hobby   | Cost | Energy | Effect             | Streak adds to |
  | ------- | ---- | ------ | ------------------ | -------------- |
  | Running | Free | 15     | +4 health          | Health         |
  | Guitar  | $10  | 5      | +4 mood            | Mood           |
  | Cooking | $25  | 8      | +2 health, +2 mood | Mood           |

- **Side project** sessions fit a weeknight or a weekend day, cost 20 energy, and give +6 skill and −1 mood. It grows through stages as you put in sessions, and once launched it pays each week, give or take a fifth, as long as you worked on it in the last 3 weeks.

  | Stage     | Sessions | Weekly income |
  | --------- | -------- | ------------- |
  | Idea      | 0        | —             |
  | Prototype | 5        | —             |
  | Launched  | 12       | about $60     |
  | Growing   | 25       | about $180    |
  | Thriving  | 50       | about $450    |

**End the week** on the same screen runs the night.

### Weekly drift and stakes

- **Mood** −5 every week. Clean tickets no longer raise it; misses still cost 2. Free time is how it comes back.
- **Health** +3 every week, minus aging: −1 every other week from 35, −1 a week from 45, −2 a week from 55. Each ticket still costs 1, and 2 more below 25 energy.
- **Mood and ticket time:** below 30, −2 seconds a ticket. Below 15, −4. At 75 or more, +1. A ticket never has less than 6 seconds.
- **Burnout week:** if mood ends a week below 15, you can't work the next week.
- **Sick week:** if health ends a week below 25, 40% chance you can't work next week, with a $300 doctor's bill.
- **Relationship 60+:** coworkers refer you on Workline, which means one more post and +10% stretch chance.
- **Skill:** raises how high a Workline post's pay can go, up to +25% more at skill 100.

### Events

From week 5, each new week has a 35% chance to start with an event card. It sits over the room until you choose.

| Event                    | When it can happen                                                          | Choices                                                                                                                    |
| ------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Layoffs announced        | Growth, established, or giant employer (giant and established 3× as likely) | Wait. Risk = 35% − reputation ÷ 250 − relationship ÷ 400, between 5% and 40%. Laid off: 2 cash paydays severance, −10 mood |
| Startup ran out of money | Seed employer                                                               | Laid off, no severance                                                                                                     |
| Being bought             | Listed employer                                                             | Its stock +30%, +5 mood                                                                                                    |
| New manager              | Any job                                                                     | Coffee chat ($10, −4 relationship, +2 mood) or head down (−12 relationship)                                                |
| Conference invite        | Any job                                                                     | Go ($400, +4 skill, +4 reputation, +3 mood) or skip                                                                        |
| Recruiter message        | Reputation 25+, not at the top                                              | Adds a stretch role to the top of Workline for 4 weeks                                                                     |
| Market crash             | You hold any investment                                                     | Stocks −15%, crypto −35%. Hold (−3 mood) or sell everything                                                                |
| Family needs help        | $500+ cash                                                                  | Give 10% of cash, at least $500 (+6 mood), or say no (−8 mood)                                                             |
| A friend's wedding       | Any time                                                                    | Go ($300, +8 mood, −1 health) or skip (−4 mood)                                                                            |
| Phone broke              | Any time                                                                    | Buy ($300) or live without (−6 mood)                                                                                       |
| Cat is sick              | Any time                                                                    | Vet ($250, +2 mood) or wait (−6 mood)                                                                                      |
| Office raffle            | Any time                                                                    | +$200, +3 mood                                                                                                             |

**Without a job** the monitor says **Job hunt**. Free time has an **Open Workline** button. There's no payday, rent still comes due, and joining a company from Workline puts you straight back to work.

### Seasons and holidays

The year runs Winter (weeks 49–9), Spring (10–22), Summer (23–35), and Autumn (36–48). The Life card shows the season and the next holiday. A holiday takes the place of any random event that week.

| Week | Holiday             | What happens                                                                                                                                |
| ---- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | New Year            | New Year bonus, then pick a resolution: get healthier (+5 health), learn (+3 skill), see friends (+6 mood), or speak up (+3 reputation)     |
| 6    | Lunar New Year      | Lucky money of half a cash payday after 26+ weeks at the company. Go home ($300, +12 mood) or stay (+3 mood)                                |
| 27   | Summer trip         | With a job: company beach trip (+10 mood, +5 relationship, +2 health) or skip (−2 relationship). Without: beach ($400, +12 mood, +3 health) |
| 38   | Mid-Autumn Festival | Mooncakes for the team ($60, +4 relationship, +2 mood) or for yourself ($25, +3 mood)                                                       |
| 47   | Black Friday        | Machines in the Shop are 30% off that week                                                                                                  |
| 51   | Year-end party      | Go and sing (+6 relationship, +6 mood, −2 health) or skip (−2 relationship)                                                                 |

**New Year bonus** = cash payday × tenure × growth.

- **Tenure** = 0.25 + 0.5 per year at the company, up to 1.5.
- **Growth** = 1 + the employer's stock change over the year, clamped to 0.5–2. For a private company it's a random year from −20% to +40%.

It's paid on top of the week-52 performance review.

### Year-end review

At the end of every 52nd week, with a job: bonus = cash payday × min(1.5, clean tickets that year ÷ 100) × (0.5 + reputation ÷ 100). The count resets each year.

### Achievements

Moving up, People person, Top before 30, Six figures, Millionaire, Survivor (a layoff wave), Job hopper (3 jobs), Negotiator, Out of office (a vacation), Gym regular (20 visits), Healthy at 50, Homeowner. They're checked at the end of each week and shown on the ending screen.

## Stats

All stats except money run from 0 to 100.

| Stat         | What raises it                                                                                                                           | What lowers it                                                                              | What it does                                                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Money        | Payday, clean-ticket time pay, early-ticket bonuses, selling investments, blackjack wins                                                 | Rent, shop, pantry, buying investments, blackjack losses                                    | Pays for everything                                                                                                                                                   |
| Energy       | Refills to 100 each week (80 after late nights). Coffee, energy drink, recovery pill                                                     | Each hour of ticket work, double in overtime                                                | You need enough energy for the next part to start it                                                                                                                  |
| Health       | +3 each week. Free time, hobbies, early nights, vitamins, recovery pill                                                                  | −1 per part, −2 more below 25 energy, −2 more in overtime, late nights, aging, energy drink | Energy cost per hour. Sick weeks below 25. Ending at 0                                                                                                                |
| Skill        | Clean ticket: 2 × company learning on average. Late: 1 × learning. Half on the manager track. Courses, meetups, hackathons, side project | —                                                                                           | Open-ended, no ceiling. Its **rating** (√skill × 2.5, capped at 100) raises ticket difficulty, speeds up tickets, and helps in negotiation. Gates Junior and Engineer |
| Relationship | 0.2 per clean ticket on average (0.4 on the manager track). Team drinks, Leading people                                                  | Missed High and Critical deadlines                                                          | Lowers difficulty. Teammate help at 20 and 40. At 60+, a teammate may take a ticket. Gates Engineering manager                                                        |
| Reputation   | 0.1 per clean ticket on average (0.2 at an enterprise). Early High and Critical tickets, Critical on time. +4 on promotion               | Missed deadlines, tickets left overdue                                                      | Gates Senior, Staff, Principal, Director. At 50+, more High and Critical tickets                                                                                      |
| Mood         | Free time, promotions (+8), some events                                                                                                  | −5 every week, −2 per miss, some events                                                     | Ticket time. Burnout week below 15. Burnout ending at 0                                                                                                               |

### Health and energy cost

A company's base cost is for a 4-hour block. Energy for a part = hours × base cost × health scale ÷ 4, rounded. Overtime hours count twice. A full 40-hour week costs about 100 energy at a typical company, more at a startup, and less at a remote or giant one.

Health scale = `1 + (70 − health) / 100`, clamped between 0.8 and 1.7.

| Health | Scale | A 12-energy block costs |
| ------ | ----- | ----------------------- |
| 100    | 0.8×  | 10                      |
| 70     | 1.0×  | 12                      |
| 40     | 1.3×  | 16                      |
| 10     | 1.6×  | 19                      |
| 0      | 1.7×  | 20                      |

Company base cost ranges from 8 at remote and giant companies up to 16 at a growing startup.

### Pantry (in the Shop)

Items are used right away when bought. Each card shows its effects as green (gain) or red (cost) tags.

| Item          | Cost | Effect                 |
| ------------- | ---- | ---------------------- |
| Coffee        | $6   | +12 energy             |
| Energy drink  | $18  | +35 energy, −4 health  |
| Vitamins      | $30  | +10 health             |
| Recovery pill | $70  | +25 health, +15 energy |

## Work board

Each week has **40 work hours**, Monday 9:00 to Friday 17:00. The board shows the clock, a bar for the week, and your tickets sorted by deadline (overdue first).

### Tickets

Every ticket has a key (like `KEEL-142`), a title, the mini game that does it, a priority, a size, and a deadline on the same clock.

| Size | Hours | Parts | Deadline window when dealt |
| ---- | ----- | ----- | -------------------------- |
| S    | 2     | 1     | 8 to 24 hours              |
| M    | 4     | 1     | 16 to 40 hours             |
| L    | 8     | 2     | 32 to 64 hours             |
| XL   | 16    | 3     | 56 to 96 hours             |

- Each part is one mini game. An L ticket is two games and an XL is three, and finished parts are kept.
- Skill makes every part faster, up to a quarter off at skill 100.
- Priority tightens the window: Low 1.2×, Medium 1×, High 0.8×, Critical 0.6×.
- Freshers get 3 open tickets, S and M only. Juniors get 4. Everyone else gets 5, with bigger sizes.

### Playing a part

- **Clean:** the part is done and takes its hours.
- **Late:** the part is done but takes 1.5× the hours.
- **Miss:** the hours are spent and the part stays open to retry.

Freshers and juniors work in their lead's order: only the top ticket can be started. From Engineer up, and on the manager track, you pick any ticket.

### New work

- Finishing a ticket brings a follow-up 35% of the time.
- Any part may be interrupted by something urgent (S or M, High or Critical, due in 4 to 8 hours): startup 20%, agency 14%, product and enterprise 10%, remote 5%.
- On Monday, the board is topped back up to its usual size.

### Deadlines

| Result        | When                                      | Effect                                                                                                              |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Early         | Done with at least half the window left   | Mood +1. High: reputation +1 and 4% of salary. Critical: reputation +2 and 8% of salary                             |
| On time       | Done before the deadline                  | Critical: reputation +1                                                                                             |
| Overdue       | The deadline passes                       | Low: reputation −1. Medium: −2, mood −1. High: −3, mood −2, relationship −1. Critical: −5, mood −3, relationship −2 |
| Still overdue | Each week it stays open (up to 3 tickets) | Reputation −1, mood −1                                                                                              |
| Handed off    | Two weeks past the deadline               | The ticket leaves your board, reputation −2                                                                         |

- With relationship 60+, there's a 30% chance each Monday that a teammate takes your most pressing ticket.
- On a sick or burnout week, the team covers and every deadline moves a week.

### Ending the week

- **Wrap up early:** every 8 unused hours becomes an extra free-time slot, up to 2.
- **Hard stop:** at 40 hours, most companies stop you. Unfinished tickets carry over.
- **Overtime (startups only):** up to 16 more hours. Energy costs double, each part costs 2 more health, and every 8 overtime hours takes away a free-time slot.

## Work tickets

A ticket part is one short mini game. A **clean** grade means you finished with at least half the clock left. **Late** means you finished with less. **Miss** means the clock hit zero. A wrong tap costs 1 second.

Clean parts pay floor(seconds left ÷ 2 × the difficulty multiplier) in cash.

### Difficulty

Difficulty comes from your **title**, not your skill. Each ticket rolls its difficulty when it lands on the board, from your level's mix, and the card shows it as **Easy**, **Normal**, or **Hard**. Urgent and Critical tickets are never easy: an easy roll becomes normal.

| Title | Easy | Normal | Hard |
| ----- | ---- | ------ | ---- |
| Fresher | 70% | 30% | — |
| Junior engineer | 45% | 45% | 10% |
| Engineer | 25% | 50% | 25% |
| Senior engineer | 10% | 50% | 40% |
| Staff engineer | 5% | 35% | 60% |
| Principal engineer | — | 30% | 70% |
| Team lead | 20% | 50% | 30% |
| Engineering manager | 10% | 45% | 45% |
| Director | 5% | 35% | 60% |

Harder work pays more. Skill, reputation, and relationship gains from a part, and its cash for time left, are multiplied by **0.75** on easy, **1** on normal, and **1.5** on hard. Higher titles earn more because they get more hard work.

Interviews use the target title's usual difficulty (its biggest share, ties going harder), and are always hard for a step up. Promotion reviews stay normal for a fresher and hard after that.

### Games

| Game              | How it plays                                                                                                    | Easy / Normal / Hard                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Tidy the screen   | Remove the wrong piece, place a loose piece, or paint a color to match a note                                   | 1 / 2 / 3 changes, plus a decoy on hard                       |
| Spot the bug      | Tap what differs between the design and the app                                                                 | 1 / 2 / 3 bugs on a 2- or 3-column grid                       |
| Connect the wires | Rotate tiles until the button connects to the server                                                            | 3×3 / 4×4 / 5×5                                               |
| Ship it           | Tap while the marker is in the green window, three times                                                        | Window 26% / 20% / 15%, narrowing each release, faster marker |
| Sort the inbox    | Send each message to Now (stops customers) or Later (can wait)                                                  | 4 / 6 / 8 messages                                            |
| One-on-one        | A teammate says how they feel. Pick the reply that fits                                                         | 2 / 3 / 4 teammates, 3 replies each                           |
| Sprint planning   | Tap task cards so their points exactly fill the team's capacity                                                 | 4 / 6 / 7 cards. On hard, one starred task must be in         |
| Roadmap           | Put each feature in Now (big impact, small effort), Later (small impact, big effort), or Next (everything else) | 3 / 5 / 6 features                                            |

### Content pools

| Game            | Pool                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- |
| Tidy            | 10 app scenes (picnic, ticket shop, photo, music, weather, pet, recipe, chat, bank, map) |
| Spot the bug    | 6 shapes × 4 colors, random every board                                                  |
| Wires, Ship it  | Generated fresh every ticket                                                             |
| Inbox           | 28 messages, half urgent                                                                 |
| One-on-one      | 16 conversations across 8 moods                                                          |
| Sprint planning | 20 task names                                                                            |
| Roadmap         | 20 features                                                                              |

The next ticket's seed is saved in the game and moves forward after every finished ticket, so closing and reopening Work deals something new. Leaving in the middle of a ticket brings the same ticket back, so a hard board can't be skipped.

### Clock (seconds, before device bonus)

| Game            | Easy | Normal | Hard |
| --------------- | ---- | ------ | ---- |
| Tidy            | 12   | 12     | 13   |
| Spot            | 10   | 12     | 14   |
| Wires           | 32   | 26     | 28   |
| Ship it         | 24   | 18     | 14   |
| Inbox           | 28   | 24     | 22   |
| One-on-one      | 16   | 20     | 24   |
| Sprint planning | 20   | 24     | 28   |
| Roadmap         | 16   | 20     | 24   |

Device bonus: starter laptop +0, thin laptop +2, desk monitor +4, home rig +6.

### Teammate help

| Relationship | Help                                                                                                                                                                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 20+          | Hard Tidy tickets drop the decoy                                                                                                                                                                                                                                                         |
| 40+          | Tidy marks the right piece or color. Spot outlines one bug. Wires locks the first two tiles. Ship it widens the window. Inbox labels the first message. One-on-one marks the first right reply. Sprint planning adds one planned card for you. Roadmap says where the first feature goes |

### Which game you get

Each new ticket on the board gets a game from your unlocked set, weighted by company type. Urgent tickets prefer Spot the bug, Ship it, and Sort the inbox when you have them.

| Company type | Tidy | Spot | Wires | Ship it | Inbox |
| ------------ | ---- | ---- | ----- | ------- | ----- |
| Startup      | 20   | 30   | 10    | 30      | 10    |
| Agency       | 25   | 30   | 10    | 20      | 15    |
| Product      | 20   | 20   | 20    | 20      | 20    |
| Enterprise   | 25   | 25   | 10    | 10      | 30    |
| Remote       | 25   | 15   | 35    | 10      | 15    |

One-on-one, Sprint planning, and Roadmap weigh 30 at every company. Weights only apply to games you have unlocked, and they matter for dealing board tickets and for promotion reviews.

## Career ladder

There are two tracks. Everyone starts on the engineer track. From Senior up, you can move across to the manager track at the same height and back again.

### Engineer track

| Level              | Pay  | Games      | Pick your own tasks |
| ------------------ | ---- | ---------- | ------------------- |
| Fresher            | 1.0× | Tidy, Spot | No                  |
| Junior engineer    | 1.3× | + Wires    | No                  |
| Engineer           | 1.7× | + Ship it  | Yes                 |
| Senior engineer    | 2.2× | + Inbox    | Yes                 |
| Staff engineer     | 2.8× | All five   | Yes                 |
| Principal engineer | 3.5× | All five   | Yes                 |

### Manager track

| Level               | Twin               | Pay  | Games                                |
| ------------------- | ------------------ | ---- | ------------------------------------ |
| Team lead           | Senior engineer    | 2.4× | One-on-one, Spot, Inbox              |
| Engineering manager | Staff engineer     | 3.0× | One-on-one, Sprint planning, Inbox   |
| Director            | Principal engineer | 3.8× | One-on-one, Sprint planning, Roadmap |

Each manager rung trades a little more engineering work for people and product work. You always pick your own tasks on this track.

On the manager track, clean tickets give +2 relationship instead of +1, and half the usual skill.

### Switching tracks

Open **Stats → Career** and use the switch button. It asks you to confirm first.

- You move to the twin level: Senior ↔ Team lead, Staff ↔ Engineering manager, Principal ↔ Director.
- Progress toward the next promotion carries over at half, rounded down.
- A switch clears the day's review attempt, so you can try a review on the new track the same day.

### Milestones

| From → to                       | Clean tickets                     | Stat gate       |
| ------------------------------- | --------------------------------- | --------------- |
| Fresher → Junior                | 15 Tidy, 15 Spot                  | Skill 80        |
| Junior → Engineer               | 30 Spot, 15 Wires                 | Skill 220       |
| Engineer → Senior               | 30 Wires, 30 Ship it              | Reputation 30   |
| Senior → Staff                  | 40 Ship it, 40 Inbox              | Reputation 50   |
| Staff → Principal               | 55 Wires, 55 Inbox                | Reputation 65   |
| Team lead → Engineering manager | 60 One-on-one, 25 Inbox           | Relationship 60 |
| Engineering manager → Director  | 90 One-on-one, 90 Sprint planning | Reputation 60   |

Each clean mini-game counts as one, including each part of a big ticket. With about 10 clean parts in a full week, that's roughly 5 weeks as a Fresher and 1.7 to 2.7 game-years to Principal, depending on how often your company deals each game. Principal and Director are the top of their tracks. Only clean tickets count. Progress resets after each promotion and stays with you if you change jobs.

### Promotion review

When every milestone is met, a **Promotion review** opens on the work screen. You play 3 tickets in a row from the next level's games. The first review is on normal, and later reviews are on hard. Teammate help is off, and the review costs no energy.

- **Pass:** new title, higher pay, the next level's games, +8 mood, +4 reputation.
- **Fail:** a miss ends the review. Try again the next day.

## Workline

The **Jobs** tab opens **Workline**, a job and news feed. The red badge shows how many job posts are open.

### Posts

- New posts arrive each morning. They come from any company except your current one and any company on cooldown.
- Number of open posts: min(5, 2 + floor(reputation ÷ 25)).
- Each post is for your level (45%), one level up on your track (40%), or two up (15%). A post above your level shows **Step up**.
- Pay is the company salary × 1.00 to 1.25, rounded to 0.05, then × the level's pay multiplier, plus the post's stock percent in company shares. The card shows total pay, the cash and stock split, and the change against your current total pay.
- Each post closes 2 to 5 days after it goes up. Closed posts disappear overnight.
- Between job posts, the feed shows three social posts a day for flavor.

### Benefits

A post has one or two benefits.

| Benefit         | Effect                                                              |
| --------------- | ------------------------------------------------------------------- |
| Remote days     | This company's ticket energy cost −3, never below 4                 |
| Learning budget | This company's learning +0.2                                        |
| Signing bonus   | Cash on joining: half the new company salary                        |
| Sign-on shares  | 3 to 8 shares of the new employer on joining. Listed companies only |
| Gym membership  | +15 health on joining                                               |

### Your CV and the HR screen

Every post lists what HR is looking for, checked against your CV with ✓ or ✗, plus a match badge. Your CV is your skill (each course certificate adds 50), your **experience** (weeks employed anywhere, +1 each week you have a job and aren't off sick or burned out), your reputation, and, for manager roles, your team relationship.

| Level | Skill | Experience | Other |
| ----- | ----- | ---------- | ----- |
| Junior engineer | 80 | 4 weeks | — |
| Engineer | 220 | 14 weeks | — |
| Senior engineer | 420 | 30 weeks | Reputation 30 |
| Staff engineer | 800 | 60 weeks | Reputation 50 |
| Principal engineer | 1,300 | 100 weeks | Reputation 65 |
| Team lead | 350 | 30 weeks | Relationship 50 |
| Engineering manager | — | 55 weeks | Relationship 60, reputation 45 |
| Director | — | 95 weeks | Relationship 65, reputation 60 |

The bars sit close to where the same player would be when promoted in-house, so switching is an alternative, not a shortcut.

**Send CV** is free and happens once per post. Your match is your weakest requirement as a share of what's asked.

| Match | Badge | Chance of an interview |
| ----- | ----- | ---------------------- |
| Every requirement met | You match | Always |
| 80% or more on everything | Close match | 25% at 80%, rising to 70% just under 100% |
| 60% to 80% | Long shot | 5% |
| Below 60% | Long shot | None |

With relationship 60 or more, a referral adds 15% to any chance above zero, up to 95%. A turned-down CV puts that company on the 5-day cooldown. A recruiter who reaches out skips the screen: the post arrives already shortlisted.

### Interview

- Only shortlisted posts can be interviewed. Starting costs one ticket of energy, paid up front.
- An interview is 2 tickets, plus 1 for each level the role sits above yours. Games come from the post's level, weighted by that company's type.
- Difficulty is at least normal. Interviews for a step up are hard. Teammate help is off.
- A miss ends the interview. That company won't post or interview you for 5 days.
- Passing shows the offer. Accepting moves you to the new company right away. The room, game mix, pay, and benefits all change, and every other post from that company is removed.

### Offer: accept, negotiate, or reject

After a passed interview, the offer screen has three choices.

- **Accept:** join right away.
- **Reject:** the post is removed. No cooldown, and nothing else is lost.
- **Negotiate:** one try per offer.

Leverage = 0.5 × reputation + 0.3 × skill (relationship on the manager track) + 0.2 × mood. The screen shows it as **Weak** (below 35), **Fair** (35–59), or **Strong** (60+).

| Ask           | Salary raise if yes | Chance of yes                        | If no                                                                                                     |
| ------------- | ------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| A little more | +5%                 | 35% + leverage × 0.6%, capped at 95% | The offer stays the same                                                                                  |
| A lot more    | +15%                | 10% + leverage × 0.5%, capped at 95% | 40% chance the company pulls the offer and goes on the 5-day cooldown. Otherwise the offer stays the same |

Chances show as **Likely** (70%+), **Maybe** (40–69%), or **Long shot**. A yes also scales the signing bonus with the new salary.

### Title and progress after switching

- You take the post's title. A post above your level counts as a promotion.
- Promotion progress always starts fresh at a new company: its milestones count your work there from zero. Skill, reputation, experience, and certificates stay with you, since they're on your CV.
- **A strong CV means fewer tasks.** On joining, your CV is checked against the bar for the level *after* the one you're hired at. Halfway to that bar or less, the ticket counts are normal. Meeting it cuts them in half. In between, the cut slides from 0% to 50%, rounded to 5%. Stat gates like reputation 30 never change. The offer screen shows the cut before you accept, and the Career card shows it after.
- The cut lasts while you stay at that company at that level. An in-house promotion or a track switch goes back to normal counts.

## Invest

Prices move once per week. Each chart shows the last 30 weeks.

The game remembers what you paid for each holding. Shares from paydays and sign-on grants count at that week's price. Selling part of a holding keeps the average cost of the rest.

- **Stocks screen:** a **Your stocks** card at the top shows the total value, the gain since you bought, what last week's price move did (shares bought since then have not moved yet), a colored bar for how the money is split, and one row per company with shares, average cost, value, and gain. Tap a row to trade. In **All companies**, the stocks you own have a green edge and a "You own N · $value" tag.
- **Each market screen:** shows You own, Worth, Paid avg, and Gain right under the price.

### Stocks

Ten listed companies. Six of them also hire on Workline. Four are only for investing.

| Ticker | Company      | Sector            | Hires on Workline | Risk   |
| ------ | ------------ | ----------------- | ----------------- | ------ |
| SPRK   | Spark        | Startup software  | Yes               | High   |
| NWND   | Northwind    | Product apps      | Yes               | Medium |
| HRBR   | Harbor       | Remote tools      | Yes               | Medium |
| LUMN   | Lumen        | Product apps      | Yes               | Medium |
| KEEL   | Keel Systems | Business software | Yes               | Low    |
| ATLS   | Atlas        | Big tech          | Yes               | Low    |
| BREW   | Brewly       | Coffee shops      | No                | Medium |
| VOLT   | Voltcar      | Electric cars     | No                | High   |
| PIXL   | Pixelplay    | Video games       | No                | High   |
| LEAF   | Greenleaf    | Groceries         | No                | Low    |

Loft & Co and Relay Studio are private seed startups. They have no stock.

- **The paper:** each week, 0 to 3 companies make the paper with a good or bad headline. The next week that company follows its headline 3 times in 4.
- **News moves:** Low-risk stocks move 1–4%, Medium 1.5–7%, and High 3–11%.
- **Quiet days:** without news, a stock drifts in a small range: Low −1.2% to +1.8%, Medium −2.5% to +3%, High −4.5% to +5%.
- **Stocks screen:** each company shows tags for **Your employer**, **Hiring on Workline**, and **In the paper**.

### Crypto and gold

| Market | Risk | Rule                                                                                                                                                                                        |
| ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Crypto | High | Most weeks −17% to +15%. About 1 in 10 crashes 25–45%. About 1 in 11 spikes 30–70%. Averages about +0.2% a week, so over time it roughly holds its value. It's a gamble, not a savings plan |
| Gold   | Low  | −0.4% to +0.6% a week, about +5% a year. About +2% more on a crypto crash                                                                                                                   |

Buy or sell any amount with the stepper, the 25% / 50% / 75% picks, or **Max**. Every price trades as at least $1.

### Pay in stock

Every payday is cash plus stock:

- **Cash** = company salary × level pay.
- **Stock** = cash × the company's stock percent, paid as the employer's own shares at that night's price. Leftover cents go to cash.
- **Total pay** = cash + stock. This is the number used on payday, in Workline comparisons, and on the Career card.

| Company                 | Stock percent |
| ----------------------- | ------------- |
| Loft & Co, Relay Studio | 0% (private)  |
| Spark                   | 25%           |
| Northwind, Lumen        | 15%           |
| Harbor                  | 12%           |
| Keel Systems            | 10%           |
| Atlas                   | 20%           |

A Workline post can offer a different stock percent: the company's base × 0.8 to 1.4, rounded to 5%.

### Blackjack

Bet from $10 up to all your cash. A win pays the bet. Blackjack with your first two cards pays 1.5×. A tie returns the bet. The dealer draws until 17.

## Shop

The Shop has three tabs. Every row has one button that says what tapping it does: a price to buy, **Use** for a machine you own, or **In use**. After a purchase, a receipt line shows what changed.

- **Pantry:** see the table above. Items are used right away.
- **Machines:** add seconds to every ticket.
- **Home:** the $180,000 house, with how much you have saved toward it.

## Settings

**Me → Settings → Start a new life** erases the save. It asks you to confirm first.

## Planned

- **Cost of living:** homes with their own rent, lifestyle creep, and taxes.

## Art assets

This project builds a cozy desk-life game scene from independent visual entities instead of one pre-rendered image.

The final scene is composed at runtime from:

1. **Environment** — room, desk, decor, plants, lighting, cat, and other background elements.
2. **Character** — the seated person, positioned on the right and facing left toward the desk.
3. **Device** — laptop, monitor, rig, keyboard, stand, and screen bezel.
4. **Dynamic screen content** — work, investing, tasks, or other game UI rendered inside the device screen area.

The goal is to keep each part swappable, reusable, and animatable.

---

### Video room (temporary)

Play currently uses a looping clip as the whole room instead of the stacked layers: `public/art/video/home.mp4`, with `home-poster.jpg` as the still frame. Sandbox still shows the layered entities for asset testing.

The monitor glass is set in `src/content/sceneVideo.ts` as a percent box of the video frame. The whole 9:16 frame is always shown, never cropped. It fits the screen above the tab bar, like `object-fit: contain` anchored to the bottom, so it's as large as the phone allows. The **top bar** then fills exactly the space the clip leaves above it. When that space is too thin to read, for example under a notch or on a short phone, the bar keeps a minimum height and frosts over the top edge of the clip instead of shrinking it. Space left on the sides of short or wide screens is filled with a blur of the poster frame. The top bar shows the week, age, and work clock (or Free time), your title and company, money, and energy, mood, and health as labeled horizontal bars with icons. It lays itself out by its own height: three rows when the gap is tall, and two when it's tight, with the time merged into the title line. Tapping it opens **Me**. `src/ui/useFitRect.ts` maps the glass box onto the screen with the same math at runtime. The **Work** / **End the day** button sits exactly on the glass, and the work screen grows out of it.

To swap the clip, keep the same camera and measure the new glass. The current box was found by sampling frames across the clip and keeping the solid dark screen area that stays put while the camera drifts. A flat magenta screen in the first frame also works well. With reduced motion turned on, the clip pauses on the poster.

The clip is silent. Its sound became the game's music: `public/art/audio/room-theme.m4a`, played by `src/ui/music.ts`.

- It uses Web Audio, so the loop has no gap, and it plays at normal speed even though the clip runs at 75%.
- Browsers only allow sound after a tap, so music starts on the player's first tap or key press and fades in.
- **Me → Settings → Music** turns it off with a fade, and the choice is saved on the device. The music pauses while the app is in the background.

When you swap in a new clip, trim any intro frames that don't loop cleanly, and bump `CLIP_VERSION` in `sceneVideo.ts` so the browser and the iOS app fetch the new file. The current clip was cut 0.5 s in, because the source fades in from a magenta screen:

```sh
ffmpeg -ss 0.5 -i source.mp4 -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
  -movflags +faststart public/art/video/home.mp4
ffmpeg -ss 3 -i public/art/video/home.mp4 -frames:v 1 -q:v 4 public/art/video/home-poster.jpg
```

To make music from a clip, cross-fade its last half-second into its first so the loop is seamless, then bump `MUSIC_SRC` in `music.ts`:

```sh
ffmpeg -i source.mp4 -vn -filter_complex \
  "[0:a]atrim=0:0.5,asetpts=PTS-STARTPTS[head];[0:a]atrim=0.5,asetpts=PTS-STARTPTS[body];[body][head]acrossfade=d=0.5[out]" \
  -map "[out]" -c:a aac -b:a 128k public/art/audio/room-theme.m4a
```

### Documentation

Use these files as the source of truth:

- `docs/ASSET_GUIDE.md` — asset structure, file paths, layer rules, dimensions, and entity organization.
- `docs/ASSET_PROMPTS.md` — AI image-generation prompts for environments, characters, devices, and icons.
- `docs/MOTION_GUIDE.md` — motion-frame generation, animation timing, render order, and runtime scene composition.

---

### Core scene model

The scene is not one image.

It is built by stacking aligned PNG layers:

```text
Environment
    +
Device
    +
Character
    +
Dynamic screen UI
    =
Final scene
```

Environment assets should leave clear space on the right side of the desk for the seated character.

The default environment should **not include a chair**. This avoids alignment and clipping issues when different character variants are composited into the same room.

The character faces left toward the device.

The device screen glass remains empty so the game can render dynamic content inside it.

---

### Static vs motion assets

Do not export the full room as one animated GIF.

Instead:

- keep structural layers static
- generate small motion-frame sets only for elements that should move
- combine the current frame of each animated layer at runtime

Typical static layers:

```text
wall
shelf
floor
desk
```

Typical animated layers:

```text
window
cat
lamp
plants
greenery
```

This allows each element to move independently at a different speed and makes the scene feel less repetitive.

See `docs/MOTION_GUIDE.md` for the full runtime composition model.

---

### Recommended asset workflow

For each new environment:

```text
1. Generate one complete master room image.
2. Review and approve the composition.
3. Decompose the approved room into aligned PNG layers.
4. Generate motion variants only for selected layers.
5. Save each layer under its required asset path.
6. Let the game combine the layers at runtime.
```

This is more reliable than asking an image model to independently invent many perfectly aligned layers from scratch.

---

### Visual consistency

All generated assets should share the same visual language:

- cozy desk-life mobile-game illustration
- soft flat shapes
- clean thin ink outlines
- muted cream, warm wood, and sage palette
- gentle daylight from the left
- simple readable silhouettes
- no photorealism
- no 3D
- no dark cyberpunk styling
- no text, logos, or watermarks inside artwork

Keep the shared style instructions unchanged across generation runs so rooms, characters, and devices still feel like one game.

---

### Runtime principle

At runtime, each scene layer keeps its own state.

Example:

```text
wall.png
+
motion/window/03.png
+
shelf.png
+
floor.png
+
motion/cat/02.png
+
motion/lamp/02.png
+
motion/plants/02.png
+
desk.png
+
device
+
character
+
motion/greenery/03.png
```

Animated layers do not need to advance at the same time.

For example, the cat can breathe slowly while the curtain moves more frequently and the lamp changes only occasionally.

This independent timing is intentional.

---

### Adding new content

When adding a new room, character look, or device:

1. Reuse the same visual style.
2. Keep the same camera and coordinate system for compatible assets.
3. Add files using the paths defined in `docs/ASSET_GUIDE.md`.
4. If the entity uses a new ID, update the relevant content or gear configuration.
5. For motion-enabled layers, follow the naming and timing rules in `docs/MOTION_GUIDE.md`.
