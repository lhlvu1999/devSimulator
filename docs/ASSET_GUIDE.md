# Asset pool

The game view is built from separate entities that stack together. They are not one picture.

1. **Environment** is the room, back to front: wall, window, shelf, floor, lamp, plants, desk, greenery, cat.
2. **Character** is the person sitting on the right and facing left. The character is drawn without a chair so it can fit naturally into every room.
3. **Device** is the machine on the left-center of the desk: stand, bezel, keyboard. The glass in the middle is left empty for live game content.

The environment should intentionally leave open space on the right side of the desk for the character. The character faces left toward the device and keyboard area.

A painted placeholder can live in each slot. Your PNG replaces only that slot; the other layers stay.

Use PNG. Environment `wall` can be opaque. Other environment layers, character layers, device layers, and motion frames should be transparent outside the object. If an image model cannot return transparency reliably, generate on flat magenta `#FF00FF` and key it out afterward.

## Shared visual language

All assets belong to the same cozy desk-life mobile game.

- soft flat 2D shapes
- clean thin dark-brown ink outlines
- muted cream, warm wood, sage, soft blue, and clay accents
- gentle daylight from the left
- calm, warm, slightly playful mood
- no photorealism
- no 3D rendering
- no dark cyberpunk treatment
- no text, logos, watermarks, or labels inside production art

Core palette:

- paper `#F6EFE6`
- wood `#E6C48A`
- ink `#3F342C`
- plant `#6F8F5B`
- accent blue `#7FA7C9`
- accent clay `#E39B7A`

Keep the same line weight, camera logic, proportions, and lighting language across startup, remote, and big-company themes.

## Where files go

```text
public/art/environment/<place>/<layer>.png
public/art/environment/<place>/motion/<layer>/<frame>.png
public/art/character/<look>/<layer>.png
public/art/device/<device>/<layer>.png
public/art/icons/<stat>.png
```

Suggested motion frame names:

```text
01.png
02.png
03.png
04.png
05.png
06.png
```

`<place>` is `home`, `remote`, `startup`, `product`, `agency`, `enterprise`, or `interview`.

Additional planned room ids: `loft`, `cabin`, `campus`.

`<look>` currently includes `plain`, `bun`, `curls`, `cap`, `navy`, `green`, plus planned `hoodie`, `sweater`, `cardigan`, `clip`.

`<device>` currently includes `laptop`, `air`, `monitor`, `rig`, plus planned `tablet`, `loftbook`, `studio`, `ultrawide`, `glass`, `mini`.

The ids used by code should stay synchronized with `src/content/entities.ts` and `src/content/gear.ts`.

## Environment composition

Draw every workplace using the same portrait composition, **1170 x 2532**.

The functional layout matters more than decoration:

- window on the left
- shelves in the upper-right
- desk across the lower-left and center
- device area on the left-center of the desktop
- keyboard area along the front edge of the desk
- open character space on the right side of the desk
- character will later sit on the right and face left
- floor lamp sits behind or near the workstation
- tall plant can sit toward the right wall, but must not block the character space
- large foreground greenery can sit at the front-left
- cat belongs on the floor/rug area

**Do not paint a chair in environment art.** The character must be able to fit naturally without being constrained by a pre-rendered chair.

### Environment layers

| Layer | What to paint |
| --- | --- |
| `wall` | Back wall, full frame |
| `window` | Window and curtains on the left |
| `shelf` | Shelves, books, frames, small decor, optional vines/string lights |
| `floor` | Floor and rug only; do not include the cat here |
| `lamp` | Floor lamp behind or near the workstation |
| `plants` | Tall/right-side plant behind the future character zone |
| `desk` | Practical wooden work desk, plus small edge decor; keep device/keyboard area clear |
| `greenery` | Large foreground plant at the front-left |
| `cat` | Sleeping cat only, positioned on the rug/floor area |

Example:

```text
public/art/environment/home/desk.png
```

### Desk requirements

The desk is a real workstation, not a decorative console table.

- rectangular work desk
- enough depth for monitor/laptop and keyboard
- practical proportions
- clean flat desktop
- sturdy simple legs
- left-center area stays clear for a device
- front edge stays clear for a keyboard
- small objects such as mug, notebook, headphones, or tiny pots can sit near edges
- do not overcrowd the work surface

The desk should visually align with a seated character placed on the right, with the character's arms reaching left toward the keyboard.

## Motion system

The room should feel alive, but the whole scene should **not** be regenerated every frame.

Keep the architectural layers static and animate only a few isolated layers. This avoids flicker, perspective drift, and objects changing shape between frames.

Recommended animated layers:

| Layer | Frames | Motion |
| --- | ---: | --- |
| `window` | 4-6 | very small curtain shift and/or subtle outdoor leaf motion |
| `lamp` | 2-4 | slight glow/intensity variation only |
| `plants` | 4-6 | very small leaf sway |
| `greenery` | 4-6 | gentle foreground leaf sway |
| `cat` | 4-6 | subtle sleeping/breathing motion |

Keep `wall`, `shelf`, `floor`, and `desk` static by default.

### Motion rules

Every animation frame must keep:

- identical canvas size
- identical object anchor point
- identical scale
- identical perspective
- identical colors
- identical line weight
- identical lighting direction

Only the intended moving detail should change.

Do not redraw the whole object differently from frame to frame. A plant should sway, not morph. A cat should breathe, not change pose. A curtain should move slightly, not jump to a new shape.

Use **6 frames as the default** for subtle loops. Four frames are enough for very simple motion. More frames are optional later.

The game should cycle PNG frames in code rather than relying on a GIF as the source asset. GIF/WebP can be generated for previews, but the runtime source should stay as PNG frames so different layers can animate at different speeds.

Example:

```text
public/art/environment/home/motion/greenery/01.png
public/art/environment/home/motion/greenery/02.png
...
public/art/environment/home/motion/greenery/06.png
```

A good loop can move forward and gently return toward the neutral state:

```text
01 neutral
02 slight right
03 a little more right
04 return toward center
05 slight left
06 neutral
```

Do not animate every layer at the same speed. Slight timing offsets make the room feel more natural.

## Recommended generation workflow

For AI-generated art, use a **master image -> layer decomposition -> motion variation** workflow.

1. Generate one complete room illustration first.
2. Approve its composition, desk proportions, open character space, and visual style.
3. Use that approved image as the reference to extract the environment layers without changing coordinates.
4. Generate motion frames only for the selected animated layers.
5. Slice/key out the magenta background and save each layer at the expected path.

This is more reliable than asking an image model to invent multiple perfectly aligned layers from scratch.

## Character layers

About **500 x 700**, transparent.

The person is seen from the side, sitting on the right side of the scene and facing left. Include the arms reaching toward the keyboard area.

There is no pre-rendered chair in the room, so the character pose itself must communicate a natural seated working posture.

| Layer | What to paint |
| --- | --- |
| `body` | Torso and arms; no hair; no garment color that belongs to `shirt` |
| `head` | Face and neck |
| `hair` | Hair or cap only |
| `shirt` | Shirt, hoodie, sweater, or cardigan only |

Example:

```text
public/art/character/bun/hair.png
```

## Device layers

About **900 x 700**, transparent.

The device is front-facing enough that the screen glass is readable. Screen glass is a hole, not a painted picture. The game draws task/investment content inside it.

| Layer | What to paint |
| --- | --- |
| `stand` | Arm, feet, or stand under the screen |
| `bezel` | Frame around the empty screen glass |
| `keyboard` | Keyboard on the desk |

`laptop` and `air` are one screen. `monitor` is one larger screen. `rig` is two screens side by side. For `rig`, the bezel has two holes.

Example:

```text
public/art/device/monitor/bezel.png
```

## Icons

**64 x 64**, transparent.

```text
public/art/icons/money.png
public/art/icons/energy.png
public/art/icons/mood.png
public/art/icons/skill.png
public/art/icons/reputation.png
public/art/icons/health.png
public/art/icons/relationship.png
```

## When a file is ready

Put the PNG at the expected path and refresh. If the id and filename match what the game expects, it replaces that layer.

For a new look or machine, add the folder and sync its id into `gear.ts` if it should be selectable or buyable. For a new room, sync the place id into the environment list in `entities.ts`.
