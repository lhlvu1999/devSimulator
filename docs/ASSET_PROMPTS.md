# Asset prompts

This file is a prompt library for generating one entity at a time while keeping every asset inside the same visual world.

The recommended workflow is:

1. Generate one complete master entity.
2. Approve the composition/style.
3. Use that approved image as reference for layer extraction.
4. Generate only the motion layers that need animation.

Do not ask the model to create a presentation, infographic, guide, or labeled sprite sheet. Production art must contain no explanatory text.

---

# Shared style

Paste this style block into every image-generation prompt without changing it.

```text
Cozy desk-life illustration for a mobile game.

Soft flat 2D shapes.
Clean thin dark-brown ink outlines.
Muted cream, warm wood, sage, soft blue, and clay accents.
Gentle daylight from the left.
Warm, calm, cozy atmosphere.
Simple readable forms.
Slightly playful mobile-game look.

Palette:
paper #F6EFE6
wood #E6C48A
ink #3F342C
plant #6F8F5B
accent blue #7FA7C9
accent clay #E39B7A

Keep the same visual language across every asset:
same line thickness,
same camera logic,
same proportions,
same lighting direction,
same color language.

No photorealism.
No 3D rendering.
No cyberpunk styling.
No dramatic shadows.
No text.
No labels.
No logos.
No watermark.
```

---

# Environment workflow

Environment generation should happen in two steps.

## Step 1 - Generate the complete master room

Use one of the room prompts below. Output one finished portrait room only.

All rooms use this shared functional layout:

- portrait composition, 1170 x 2532 target
- window on the left
- shelves in the upper-right
- rectangular work desk across the lower-left and center
- clear device area on the left-center of the desk
- clear keyboard area along the front edge of the desk
- open character space on the right side of the desk
- the future character will sit on the right and face left
- floor lamp behind or near the workstation
- tall plant toward the right wall but not blocking the future character
- large foreground greenery at front-left
- rug/floor area with a sleeping cat
- no chair
- no person
- no computer
- no monitor
- no laptop
- no keyboard

The desk must look like a real workstation, not a decorative console table.

---

## MASTER ROOM - HOME

```text
[paste Shared style]

Create one complete cozy home-office game environment.

Portrait composition, designed for a 1170 x 2532 game background.

This must look like a real home workstation.

Layout:
- tall window on the left with a pale curtain
- simple shelves in the upper-right with books, small pottery, and a little greenery
- rectangular wooden work desk across the lower-left and center
- enough desk depth for a monitor and keyboard
- keep the left-center desktop clear for a future device
- keep the front working edge clear for a future keyboard
- leave open space on the RIGHT side of the desk for a seated character
- the future character will face LEFT toward the desk
- floor lamp behind or slightly beside the workstation
- tall plant near the right wall, behind the future character zone
- large monstera-style plant in the front-left foreground
- soft rug
- sleeping cat on the rug near the lower-right
- gentle daylight from the left

Small decor may include a mug, notebook, headphones, and tiny plants near the edges of the desk.
Do not overcrowd the work surface.

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No text or labels.

Output only the finished room illustration.
```

## MASTER ROOM - REMOTE

```text
[paste Shared style]

Create one complete remote-work home office using the same camera logic and workstation layout as the HOME room.

Theme:
- tidy and calm
- soft cream walls
- pale curtain
- one organized shelf
- fewer decorations than HOME
- soft rug
- warm wooden work desk
- comfortable home atmosphere
- clear device area on the desk
- open character space on the right
- subtle indoor plants
- gentle daylight from the left

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No text or labels.

Output only the finished room illustration.
```

## MASTER ROOM - STARTUP

```text
[paste Shared style]

Create one complete warm startup-loft workstation using the same functional room layout as the HOME room.

Theme:
- warm oak furniture
- many plants
- slightly busy shelves
- subtle string lights
- books and small creative objects
- natural imperfections
- lively but still cozy startup feeling
- practical rectangular work desk
- clear device and keyboard area
- open character space on the right

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No text or labels.

Output only the finished room illustration.
```

## MASTER ROOM - AGENCY

```text
[paste Shared style]

Create one complete small creative-agency studio using the same functional room layout as the HOME room.

Theme:
- brighter clay and soft-blue accents
- creative client-studio energy
- neat but active shelves
- subtle pinboard-inspired details
- warm wood
- indoor plants
- friendly design-agency atmosphere
- practical rectangular work desk
- clear device and keyboard area
- open character space on the right

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No text or labels.

Output only the finished room illustration.
```

## MASTER ROOM - LOFT

```text
[paste Shared style]

Create one complete small startup-loft workspace using the same functional room layout as the HOME room.

Theme:
- slightly smaller left-side window
- extra hanging vines
- lightly scuffed wooden desk
- modest startup atmosphere
- lived-in but comfortable
- practical rectangular work desk
- clear device and keyboard area
- open character space on the right

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No text or labels.

Output only the finished room illustration.
```

## MASTER ROOM - CABIN

```text
[paste Shared style]

Create one complete cozy evening remote-work room using the same functional room layout as the HOME room.

Theme:
- slightly warmer light
- natural wood
- calm home atmosphere
- warm floor lamp
- soft natural textures
- peaceful evening feeling
- do not make the room dark
- practical rectangular work desk
- clear device and keyboard area
- open character space on the right

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No text or labels.

Output only the finished room illustration.
```

## MASTER ROOM - PRODUCT

```text
[paste Shared style]

Create one complete calm product-company office using the same functional room layout as the HOME room.

Theme:
- cooler paper-colored wall
- straight clean wooden work desk
- fewer objects
- one main plant
- quiet matching books
- tidy shelf
- organized professional atmosphere
- still cozy, not sterile
- clear device and keyboard area
- open character space on the right

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No text or labels.

Output only the finished room illustration.
```

## MASTER ROOM - ENTERPRISE

```text
[paste Shared style]

Create one complete quiet large-company office using the same functional room layout as the HOME room.

Theme:
- larger left window
- cooler cream walls
- simple metal lamp
- nearly empty shelf
- straight clean work desk
- minimal decoration
- calm corporate feeling
- still warm enough for a cozy mobile game
- clear device and keyboard area
- open character space on the right

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No text or labels.

Output only the finished room illustration.
```

## MASTER ROOM - INTERVIEW

```text
[paste Shared style]

Create one complete minimal professional interview-room style workspace using the same functional room layout as the HOME room.

Theme:
- sparse decoration
- calm daylight
- almost empty shelf
- simple work desk
- limited plants
- no cat if a more formal version is desired
- quiet and neutral atmosphere
- friendly rather than sterile
- clear device and keyboard area
- open character space on the right

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No text or labels.

Output only the finished room illustration.
```

## MASTER ROOM - CAMPUS

```text
[paste Shared style]

Create one complete soft modern campus-style office using the same functional room layout as the HOME room.

Theme:
- pale sage wall
- long shelf with matching books
- slim wooden work desk
- subtle plants
- organized and welcoming
- young professional atmosphere
- clear device and keyboard area
- open character space on the right

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No text or labels.

Output only the finished room illustration.
```

---

# Environment layer extraction

After a master room is approved, provide that exact image back to the image model and use this prompt.

```text
Use the supplied room image as the exact visual reference.

Do not redesign the room.
Do not change the camera.
Do not move objects.
Do not change scale.
Do not change perspective.
Do not change colors.
Do not change lighting.

Create production-ready isolated layers from this exact room.

Every layer must use the exact same 1170 x 2532 canvas and the object's original coordinates from the reference image.

Do NOT center isolated objects.
Do NOT crop tightly around them.
Each output must behave like a Photoshop layer that can be placed directly over the original image without moving or resizing.

Create these layers separately:

1. wall - back wall only
2. window - window and curtain only
3. shelf - shelves, books, small shelf decor, vines/string lights only
4. floor - floor and rug only, no cat
5. lamp - floor lamp only
6. plants - tall/right-side plant only
7. desk - work desk and small desktop decor only
8. greenery - large front-left plant only
9. cat - sleeping cat only

No chair.
No person.
No computer.
No monitor.
No laptop.
No keyboard.
No labels or text.

Everything outside the requested object/layer must be transparent.
If transparency is not available, use exactly flat #FF00FF with no gradient or shadow.
```

If the image model can only generate one image at a time, ask for one named layer per run using the same reference image and the same instructions.

---

# Motion prompts

Use the approved isolated layer as the reference image. Generate only subtle variations of that exact layer.

## MOTION - WINDOW / CURTAIN

```text
[paste Shared style]

Use the supplied window layer as the exact reference.

Create 6 animation frames for this exact window and curtain.

Keep identical:
- canvas size
- position
- scale
- window frame
- colors
- line work
- lighting direction

Only animate a very small curtain movement and, if visible, very subtle outdoor leaf movement.

Frame progression:
1 neutral
2 curtain shifts slightly right
3 curtain shifts a little more right
4 returns toward center
5 shifts slightly left
6 returns to neutral

The motion must be gentle enough for a cozy idle game.
Do not redraw the window differently.
Do not change perspective.
Do not change the room lighting dramatically.

Outside the layer must be transparent, or flat #FF00FF if transparency is unavailable.
The 6 frames must loop smoothly.
```

## MOTION - CAT BREATHING

```text
[paste Shared style]

Use the supplied sleeping-cat layer as the exact reference.

Create 6 animation frames for this exact sleeping cat.

Keep identical:
- canvas size
- position
- scale
- colors
- outline style
- head position
- paws
- tail
- sleeping pose

Only animate very subtle breathing in the chest/body.

Frame progression:
1 neutral resting body
2 chest rises slightly
3 chest rises a little more
4 chest begins to return
5 almost neutral
6 neutral

Do not change the face.
Do not move the cat across the floor.
Do not change the tail pose.
Do not morph the cat into a different drawing.

Outside the cat must be transparent, or flat #FF00FF if transparency is unavailable.
The 6 frames must loop smoothly.
```

## MOTION - FOREGROUND GREENERY

```text
[paste Shared style]

Use the supplied foreground greenery layer as the exact reference.

Create 6 animation frames for this exact plant.

Keep identical:
- canvas size
- pot position
- plant anchor point
- scale
- colors
- line work

Only animate the leaves with extremely subtle indoor-breeze motion.

Frame progression:
1 neutral
2 leaves tilt slightly right
3 leaves tilt a little more right
4 return toward center
5 leaves tilt slightly left
6 neutral

Do not change the pot.
Do not add or remove leaves.
Do not significantly change individual leaf shapes.
Do not move the whole plant.

Outside the plant must be transparent, or flat #FF00FF if transparency is unavailable.
The 6 frames must loop smoothly.
```

## MOTION - TALL PLANT

```text
[paste Shared style]

Use the supplied tall-plant layer as the exact reference.

Create 6 animation frames.

Keep the pot, canvas position, scale, colors, and line work unchanged.
Only animate a tiny sway in the upper leaves.
The lower stems and pot should remain almost fixed.

Use a gentle loop:
neutral -> slight right -> slightly more right -> center -> slight left -> neutral.

Do not add or remove leaves.
Do not move the whole plant.
Do not change perspective.

Outside the plant must be transparent, or flat #FF00FF if transparency is unavailable.
```

## MOTION - LAMP GLOW

```text
[paste Shared style]

Use the supplied lamp layer as the exact reference.

Create 4 subtle animation frames.

Keep the lamp shape, position, scale, stand, shade, colors, and line work identical.

Only change the light glow very slightly:
1 normal
2 slightly warmer/brighter
3 soft peak
4 back to normal

Do not make the lamp flash.
Do not change the lamp shape.
Do not move the lamp.
Do not cast large new shadows across the room.

Outside the lamp/glow layer must be transparent, or flat #FF00FF if transparency is unavailable.
The loop must feel calm and almost unnoticeable.
```

---

# Character prompts

All characters share the exact same seated working pose:

- young adult
- side view
- facing left
- natural seated posture without a visible chair
- relaxed shoulders
- both arms reaching left and slightly downward
- hands positioned toward a keyboard area
- body placement should fit naturally into the open character zone on the right side of the room

Generate or extract four aligned layers:

1. `body`
2. `head`
3. `hair`
4. `shirt`

Do not draw a chair, desk, device, or room.

## CHARACTER - PLAIN

```text
[paste Shared style]

Create one seated side-view character facing left in a natural working pose.
No visible chair.

Look id: plain
Hair: short simple hairstyle
Clothing: rust-colored casual shirt
Theme: relaxed startup worker

Prepare the character so it can be separated into four perfectly aligned layers:
body, head, hair, shirt.

No desk.
No device.
No room.
No text.
```

## CHARACTER - BUN

```text
[paste Shared style]

Create one seated side-view character facing left in the exact same working pose and scale as the other character assets.
No visible chair.

Look id: bun
Hair: simple bun
Clothing: rust-colored casual shirt
Theme: relaxed startup worker

Prepare four aligned layers: body, head, hair, shirt.
No desk, device, room, or text.
```

## CHARACTER - CAP

```text
[paste Shared style]

Create one seated side-view character facing left in the shared working pose.
No visible chair.

Look id: cap
Hair layer: simple casual cap
Clothing: navy casual shirt
Theme: casual startup worker

Prepare four aligned layers: body, head, hair, shirt.
No desk, device, room, or text.
```

## CHARACTER - HOODIE

```text
[paste Shared style]

Create one seated side-view character facing left in the shared working pose.
No visible chair.

Look id: hoodie
Hair: short, slightly messy
Clothing: soft sage hoodie
Theme: creative startup worker

Prepare four aligned layers: body, head, hair, shirt.
No desk, device, room, or text.
```

## CHARACTER - CURLS

```text
[paste Shared style]

Create one seated side-view character facing left in the shared working pose.
No visible chair.

Look id: curls
Hair: natural curls
Clothing: simple black shirt
Theme: casual remote worker

Prepare four aligned layers: body, head, hair, shirt.
No desk, device, room, or text.
```

## CHARACTER - GREEN

```text
[paste Shared style]

Create one seated side-view character facing left in the shared working pose.
No visible chair.

Look id: green
Hair: bun
Clothing: soft green hoodie
Theme: cozy remote-work character

Prepare four aligned layers: body, head, hair, shirt.
No desk, device, room, or text.
```

## CHARACTER - SWEATER

```text
[paste Shared style]

Create one seated side-view character facing left in the shared working pose.
No visible chair.

Look id: sweater
Hair: soft curls
Clothing: cream knitted sweater
Theme: warm home-office look

Prepare four aligned layers: body, head, hair, shirt.
No desk, device, room, or text.
```

## CHARACTER - NAVY

```text
[paste Shared style]

Create one seated side-view character facing left in the shared working pose.
No visible chair.

Look id: navy
Hair: short and neat
Clothing: navy shirt
Theme: professional product-company worker

Prepare four aligned layers: body, head, hair, shirt.
No desk, device, room, or text.
```

## CHARACTER - CARDIGAN

```text
[paste Shared style]

Create one seated side-view character facing left in the shared working pose.
No visible chair.

Look id: cardigan
Hair: low bun
Clothing: ink-colored cardigan over a pale cream top
Theme: professional big-company worker

Prepare four aligned layers: body, head, hair, shirt.
No desk, device, room, or text.
```

## CHARACTER - CLIP

```text
[paste Shared style]

Create one seated side-view character facing left in the shared working pose.
No visible chair.

Look id: clip
Hair: short neat hair with one small hair clip
Clothing: soft blue shirt
Theme: young professional big-company worker

Prepare four aligned layers: body, head, hair, shirt.
No desk, device, room, or text.
```

---

# Device prompts

Every device uses three aligned layers:

1. `bezel`
2. `keyboard`
3. `stand`

The screen glass must remain empty/transparent so the game can render live content behind it. If transparency is unavailable during generation, use flat `#FF00FF` inside the screen hole and outside the device.

Do not draw room, desk, character, UI, text, code, or reflections inside the screen glass.

## DEVICE - LAPTOP

```text
[paste Shared style]

Create one thick startup laptop as a production game asset.

Bezel: thick screen frame with a wide bezel and one clean empty screen hole.
Keyboard: simple chunky laptop keyboard.
Stand: two small supports/feet.

Theme: affordable, sturdy startup laptop.
No room, desk, character, screen content, text, or UI.
```

## DEVICE - TABLET

```text
[paste Shared style]

Create one compact startup tablet workstation.

Bezel: compact folio-style display with one clean empty screen hole.
Keyboard: small separate keyboard.
Stand: simple easel-style support.

Theme: flexible startup workstation.
No room, desk, character, screen content, text, or UI.
```

## DEVICE - LOFTBOOK

```text
[paste Shared style]

Create one chunky creative startup laptop.

Bezel: thick frame with subtle clay-colored corner accents and one clean empty screen hole.
Keyboard: thick playful keys.
Stand: low simple support.

No room, desk, character, screen content, text, or UI.
```

## DEVICE - AIR

```text
[paste Shared style]

Create one thin remote-work laptop.

Bezel: slim frame with a narrow border and one clean empty screen hole.
Keyboard: lightweight thin keyboard.
Stand: slim subtle feet.

Theme: clean remote-work laptop.
No room, desk, character, screen content, text, or UI.
```

## DEVICE - RIG

```text
[paste Shared style]

Create one dual-screen home workstation.

Bezel: two monitors side by side with two separate clean empty screen holes.
Keyboard: one shared centered keyboard.
Stand: one shared stand supporting both monitors.

Theme: powerful but cozy home workstation.
No room, desk, character, screen content, text, or UI.
```

## DEVICE - STUDIO

```text
[paste Shared style]

Create one warm dual-screen remote-work setup.

Bezel: two monitors side by side with two clean empty screen holes.
Keyboard: one shared keyboard.
Stand: warm wooden shared stand.

Theme: creative home studio setup.
No room, desk, character, screen content, text, or UI.
```

## DEVICE - MONITOR

```text
[paste Shared style]

Create one professional large single monitor.

Bezel: one large rectangular frame with one large clean empty screen hole.
Keyboard: standard clean keyboard.
Stand: single centered stand.

Theme: modern product-company workstation.
No room, desk, character, screen content, text, or UI.
```

## DEVICE - ULTRAWIDE

```text
[paste Shared style]

Create one professional ultrawide monitor setup.

Bezel: one long horizontal frame with one uninterrupted clean empty screen hole.
Keyboard: clean professional keyboard.
Stand: two separate support legs.

Theme: big-company workstation.
No room, desk, character, screen content, text, or UI.
```

## DEVICE - GLASS

```text
[paste Shared style]

Create one very thin modern monitor.

Bezel: very thin pale frame with one clean empty screen hole.
Keyboard: slim matching keyboard.
Stand: low metal stand.

Theme: minimal professional monitor.
Do not make it futuristic or transparent.
No room, desk, character, screen content, text, or UI.
```

## DEVICE - MINI

```text
[paste Shared style]

Create one compact secondary desk screen.

Bezel: small monitor frame with one clean empty screen hole.
Keyboard: tiny spare keypad rather than a full keyboard.
Stand: clamp-style monitor arm.

Theme: compact secondary company screen.
No room, desk, character, screen content, text, or UI.
```

---

# Icon prompt template

```text
[paste Shared style]

Generate one 64 x 64 game-stat icon.
Transparent background.
Simple readable silhouette.
Clean thin ink outline.
Same cozy flat illustration style as the game.
No text, letters, numbers, logos, or watermark.
```

Use separately for:

- `money`: small coin or compact stack of coins
- `energy`: simple lightning bolt
- `mood`: cheerful face or warm sun-like symbol
- `skill`: small book, spark, or skill badge
- `reputation`: simple star or badge
- `health`: simple heart
- `relationship`: two connected hearts or two friendly connected figures

---

# Adding assets later

Keep the same visual style block and the same functional layout rules.

For a new room:
1. write one master-room flavor prompt,
2. approve the full room,
3. extract the 9 environment layers,
4. generate motion only for the layers that need it,
5. add the room id to code if it is new.

For a new character:
1. keep the exact same seated pose and scale,
2. change only hair/clothing flavor,
3. extract body/head/hair/shirt,
4. add the id to `LOOKS` if it should be selectable/buyable.

For a new device:
1. keep the shared illustration language,
2. preserve an empty screen hole,
3. separate bezel/keyboard/stand,
4. add the id to `DEVICES` if it should be selectable/buyable.
