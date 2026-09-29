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
```

## The day

1. **Placement.** Tic-tac-toe against a newbie opponent. A faster win gives a higher fresher profile: skill 8 on a loss, 11 on a draw, 12 for a slow win, 16 for a 4-move win, and up to 22 for a 3-move win. Placement never goes past fresher.
2. **Offers.** Three companies based on your placement skill. Each has a tier (seed, growth, established, giant) and a type (startup, product, agency, enterprise, remote).
3. **Room.** The room is your workplace. The machine on the desk opens **Work**. The chart at the top left opens **Invest**. The bag next to it opens the **Shop**. The phone opens **Workline**. The icon at the top right opens **Stats** and the **Career** card.
4. **Work.** Play tickets until you choose **Finish work**. After that, the Work button becomes **End the day**.
5. **Night.** Prices move, payday and rent happen, energy refills to 100, and you see a summary. **Next morning** starts a new day.

Payday is every 5 days. It pays company salary × level pay. Rent is $500 every 10 days.

## Stats

All stats except money run from 0 to 100.

| Stat         | What raises it                                                                  | What lowers it                                                     | What it does                                          |
| ------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| Money        | Payday, clean-ticket time pay, streak tips, selling investments, blackjack wins | Rent, shop, pantry, buying investments, blackjack losses           | Pays for everything                                   |
| Energy       | Refills to 100 each night. Coffee, energy drink, recovery pill                  | Each ticket                                                        | You need at least the ticket cost to start a ticket   |
| Health       | +3 each night. Vitamins, recovery pill                                          | −1 per ticket, −2 more when energy drops below 25. Energy drink −4 | Scales the energy cost of every ticket                |
| Skill        | Clean ticket: 4 × company learning. Late: 2 × learning. Half on the manager track                          | —                                                                  | Raises engineer ticket difficulty. Gates Junior and Engineer   |
| Relationship | +1 per clean ticket (+2 on the manager track)                                                             | —                                                                  | Lowers difficulty. Teammate help at 20 and 40. Gates Engineering manager |
| Reputation   | +1 per clean ticket (+2 at an enterprise). +4 on promotion                      | —                                                                  | Gates Senior, Staff, Principal, Director                              |
| Mood         | +1 clean, +2 each night, +8 on promotion                                        | −2 per miss                                                        | Tracked, no effect yet                                |

### Health and energy cost

Ticket energy cost = company base cost × health scale, rounded.

Health scale = `1 + (70 − health) / 100`, clamped between 0.8 and 1.7.

| Health | Scale | A 12-energy ticket costs |
| ------ | ----- | ------------------------ |
| 100    | 0.8×  | 10                       |
| 70     | 1.0×  | 12                       |
| 40     | 1.3×  | 16                       |
| 10     | 1.6×  | 19                       |
| 0      | 1.7×  | 20                       |

Company base cost ranges from 8 at remote and giant companies up to 16 at a growing startup.

### Pantry (in the Shop)

Items are used right away when bought. Each card shows its effects as green (gain) or red (cost) tags.

| Item          | Cost | Effect                 |
| ------------- | ---- | ---------------------- |
| Coffee        | $6   | +12 energy             |
| Energy drink  | $18  | +35 energy, −4 health  |
| Vitamins      | $30  | +10 health             |
| Recovery pill | $70  | +25 health, +15 energy |

## Work tickets

A ticket is one short mini game. A **clean** grade means you finished with at least half the clock left. **Late** means you finished with less. **Miss** means the clock hit zero. A wrong tap costs 1 second.

Clean tickets pay floor(seconds left ÷ 2) in cash. Every third clean in a row pays a $12 tip and grows a leaf on the streak.

### Difficulty

**Engineer track:** pressure = skill − floor(relationship ÷ 20) × 3.

**Manager track:** pressure = 22 − floor(relationship ÷ 10) × 2 + floor(skill ÷ 25). A close team makes manager work easier, and skill only nudges it.

| Pressure  | Difficulty |
| --------- | ---------- |
| Below 13  | Easy       |
| 13 to 18  | Normal     |
| 19 and up | Hard       |

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

| Game | Pool |
| --- | --- |
| Tidy | 10 app scenes (picnic, ticket shop, photo, music, weather, pet, recipe, chat, bank, map) |
| Spot the bug | 6 shapes × 4 colors, random every board |
| Wires, Ship it | Generated fresh every ticket |
| Inbox | 28 messages, half urgent |
| One-on-one | 16 conversations across 8 moods |
| Sprint planning | 20 task names |
| Roadmap | 20 features |

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

Fresher and Junior get a random game from their unlocked set, weighted by company type. From Engineer up, and on the whole manager track, you choose each ticket from a list. The list shows how far each game is toward the next promotion.

| Company type | Tidy | Spot | Wires | Ship it | Inbox |
| ------------ | ---- | ---- | ----- | ------- | ----- |
| Startup      | 20   | 30   | 10    | 30      | 10    |
| Agency       | 25   | 30   | 10    | 20      | 15    |
| Product      | 20   | 20   | 20    | 20      | 20    |
| Enterprise   | 25   | 25   | 10    | 10      | 30    |
| Remote       | 25   | 15   | 35    | 10      | 15    |

One-on-one, Sprint planning, and Roadmap weigh 30 at every company. Weights only apply to games you have unlocked, and they matter for random tickets and for promotion reviews.

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

| From → to                       | Clean tickets                   | Stat gate       |
| ------------------------------- | ------------------------------- | --------------- |
| Fresher → Junior                | 6 Tidy, 4 Spot                  | Skill 20        |
| Junior → Engineer               | 6 Spot, 5 Wires                 | Skill 35        |
| Engineer → Senior               | 5 Wires, 5 Ship it              | Reputation 30   |
| Senior → Staff                  | 6 Ship it, 5 Inbox              | Reputation 50   |
| Staff → Principal               | 6 Wires, 6 Inbox                | Reputation 65   |
| Team lead → Engineering manager | 6 One-on-one, 4 Inbox           | Relationship 60 |
| Engineering manager → Director  | 5 One-on-one, 6 Sprint planning | Reputation 60   |

Principal and Director are the top of their tracks. Only clean tickets count. Progress resets after each promotion and stays with you if you change jobs.

### Promotion review

When every milestone is met, a **Promotion review** opens on the work screen. You play 3 tickets in a row from the next level's games. The first review is on normal, and later reviews are on hard. Teammate help is off, and the review costs no energy.

- **Pass:** new title, higher pay, the next level's games, +8 mood, +4 reputation.
- **Fail:** a miss ends the review. Try again the next day.
## Workline

The phone icon in the room opens **Workline**, a job and news feed. The red badge shows how many job posts are open.

### Posts

- New posts arrive each morning. They come from any company except your current one and any company on cooldown.
- Number of open posts: min(5, 2 + floor(reputation ÷ 25)).
- Each post is for your current level, or a **stretch role** one level up on your track. Stretch chance: min(60%, reputation%).
- Pay is the company salary × 1.00 to 1.25, rounded to 0.05, then × the level's pay multiplier, plus the post's stock percent in company shares. The card shows total pay, the cash and stock split, and the change against your current total pay.
- Each post closes 2 to 5 days after it goes up. Closed posts disappear overnight.
- Between job posts, the feed shows three social posts a day for flavor.

### Benefits

A post has one or two benefits.

| Benefit         | Effect                                              |
| --------------- | --------------------------------------------------- |
| Remote days     | This company's ticket energy cost −3, never below 4 |
| Learning budget | This company's learning +0.2                        |
| Signing bonus   | Cash on joining: half the new company salary        |
| Sign-on shares | 3 to 8 shares of the new employer on joining. Listed companies only |
| Gym membership  | +15 health on joining                               |

### Interview

- Starting an interview costs one ticket of energy, paid up front.
- Normal posts are 2 tickets, and stretch roles are 3. Games come from the post's level, weighted by that company's type.
- Difficulty is at least normal. Stretch interviews are hard. Teammate help is off.
- A miss ends the interview. That company won't post or interview you for 5 days.
- Passing shows the offer. Accepting moves you to the new company right away. The room, game mix, pay, and benefits all change, and every other post from that company is removed.

### Offer: accept, negotiate, or reject

After a passed interview, the offer screen has three choices.

- **Accept:** join right away.
- **Reject:** the post is removed. No cooldown, and nothing else is lost.
- **Negotiate:** one try per offer.

Leverage = 0.5 × reputation + 0.3 × skill (relationship on the manager track) + 0.2 × mood. The screen shows it as **Weak** (below 35), **Fair** (35–59), or **Strong** (60+).

| Ask | Salary raise if yes | Chance of yes | If no |
| --- | --- | --- | --- |
| A little more | +5% | 35% + leverage × 0.6%, capped at 95% | The offer stays the same |
| A lot more | +15% | 10% + leverage × 0.5%, capped at 95% | 40% chance the company pulls the offer and goes on the 5-day cooldown. Otherwise the offer stays the same |

Chances show as **Likely** (70%+), **Maybe** (40–69%), or **Long shot**. A yes also scales the signing bonus with the new salary.

### Title and progress after switching

- **Normal post:** you keep your title and your milestone progress.
- **Stretch post:** you take the higher title. That counts as a promotion, so milestone progress starts fresh and no promotion review is offered that day.
## Invest

Prices move once per night. Each chart shows the last 30 days.

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

- **The paper:** each night, 0 to 3 companies make the paper with a good or bad headline. The next night that company follows its headline 3 days in 4.
- **News moves:** Low-risk stocks move 1–4%, Medium 1.5–7%, and High 3–11%.
- **Quiet days:** without news, a stock drifts in a small range: Low −1.2% to +1.8%, Medium −2.5% to +3%, High −4.5% to +5%.
- **Stocks screen:** each company shows tags for **Your employer**, **Hiring on Workline**, and **In the paper**.

### Crypto and gold

| Market | Risk | Rule                                                                                                     |
| ------ | ---- | -------------------------------------------------------------------------------------------------------- |
| Crypto | High | Most nights −15% to +20%. About 1 in 10 crashes 25–45%. About 1 in 11 spikes 40–90%. Best average return |
| Gold   | Low  | −0.3% to +1.2% a night. About +2% more on a crypto crash                                                 |

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

- **Pantry:** see the table above.
- **Machines:** add seconds to every ticket.
- **Looks:** change how the character looks.

## Planned

- **Mood:** give it a real effect.

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

The monitor glass is set in `src/content/sceneVideo.ts` as a percent box of the video frame. Because the clip is cropped to fill the phone like `object-fit: cover`, the game maps that box onto the screen at runtime. The **Work** / **End the day** button sits exactly on the glass, and the work screen grows out of it.

To swap the clip, keep the same camera and measure the new glass. The current box was found by sampling frames across the clip and keeping the solid dark screen area that stays put while the camera drifts. A flat magenta screen in the first frame also works well. With reduced motion turned on, the clip pauses on the poster.

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
