# Motion Guide

This document defines how environment motion assets are generated, stored, and combined at runtime.

The goal is to make the room feel alive without turning the entire background into one pre-rendered animation.

---

## 1. Motion philosophy

Do **not** generate 5–10 completely different full-room images and play them as a GIF.

That often causes:

- desk edges to shift
- shelves to move
- perspective to change
- plants to redraw themselves
- unwanted visual flicker
- character/device alignment issues

Instead, keep the room structure static and animate only a small number of independent layers.

Each animated layer should use subtle motion.

The room should feel calm and alive, not visibly looping.

---

## 2. Static and animated environment layers

Recommended static layers:

```text
wall
shelf
floor
desk
```

Recommended animated layers:

```text
window
cat
lamp
plants
greenery
```

The exact set can vary by environment, but the structural room geometry should remain static.

---

## 3. Recommended motion behavior

### Window

Possible motion:

- curtain shifts slightly
- outdoor foliage moves subtly
- daylight changes very slightly

Recommended frame count:

```text
4–6 frames
```

Avoid:

- changing window geometry
- moving the window frame
- large light changes
- obvious flashing

---

### Cat

Possible motion:

- subtle breathing
- tiny ear movement
- occasional tail movement in a longer animation set

Recommended frame count:

```text
4–6 frames
```

For the default idle loop, breathing alone is enough.

Avoid moving the entire cat between frames.

---

### Lamp

Possible motion:

- very small glow variation
- subtle warm intensity change

Recommended frame count:

```text
2–4 frames
```

Avoid visible flickering.

---

### Plants

Possible motion:

- gentle leaf sway
- very small branch movement

Recommended frame count:

```text
4–6 frames
```

The pot and main stem position should remain fixed.

---

### Greenery

Possible motion:

- small foreground leaf sway
- slight return movement for a seamless loop

Recommended frame count:

```text
4–6 frames
```

Foreground motion can be slightly more visible than background plants, but it should still be subtle.

---

## 4. Frame generation rule

Generate motion from an **approved base asset**.

Do not ask the image model to redesign the object in every frame.

For every frame set, keep:

- identical canvas size
- identical object position
- identical scale
- identical camera
- identical outline style
- identical colors
- identical lighting direction

Only the intended moving part should change.

Example plant sequence:

```text
01 neutral
02 slightly right
03 a little more right
04 returning toward center
05 slightly left
06 neutral
```

Example cat sequence:

```text
01 resting
02 chest rises slightly
03 chest rises slightly more
04 chest lowers
05 almost neutral
06 neutral
```

---

## 5. File structure

Recommended structure:

```text
public/art/environment/<place>/
  wall.png
  shelf.png
  floor.png
  desk.png

  motion/
    window/
      01.png
      02.png
      03.png
      04.png
      05.png
      06.png

    cat/
      01.png
      02.png
      03.png
      04.png
      05.png
      06.png

    lamp/
      01.png
      02.png
      03.png
      04.png

    plants/
      01.png
      02.png
      03.png
      04.png
      05.png
      06.png

    greenery/
      01.png
      02.png
      03.png
      04.png
      05.png
      06.png
```

All frames for one layer must use the same canvas dimensions as that layer's base image.

---

## 6. Runtime render order

Recommended render order:

```text
1. wall
2. window
3. shelf
4. floor
5. cat
6. lamp
7. plants
8. desk
9. device
10. character
11. greenery
```

This order keeps foreground greenery in front of the workstation while the character and device remain properly integrated into the scene.

If a specific room requires a different overlap relationship, adjust only that room's layer order deliberately.

---

## 7. Runtime composition

At any moment, the final screen is created by stacking the current image for each layer.

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
=
current scene
```

The room itself is never required to exist as one animated GIF.

---

## 8. Independent animation timing

Each animated layer should maintain its own:

- current frame
- frame duration
- loop direction
- optional idle pause

Example starting values:

```text
window:   6 frames, 350–500 ms per frame
greenery: 6 frames, 400–550 ms per frame
plants:   6 frames, 500–700 ms per frame
cat:      6 frames, 650–900 ms per frame
lamp:     4 frames, 900–1500 ms per frame
```

These are starting points, not strict requirements.

The important rule is that all layers should **not advance in sync**.

---

## 9. Example timeline

At time 0 ms:

```text
window   = 01
greenery = 01
plants   = 01
cat      = 01
lamp     = 01
```

At time 450 ms:

```text
window   = 02
greenery = 02
plants   = 01
cat      = 01
lamp     = 01
```

At time 900 ms:

```text
window   = 03
greenery = 03
plants   = 02
cat      = 02
lamp     = 01
```

At time 1350 ms:

```text
window   = 04
greenery = 04
plants   = 03
cat      = 02
lamp     = 02
```

Because each layer advances separately, the full scene does not look like a short repeating GIF.

---

## 10. Loop behavior

Use smooth loops.

A good motion sequence usually:

```text
neutral
→ move slightly
→ move a little more
→ return
→ move slightly opposite
→ neutral
```

Avoid:

```text
neutral
→ extreme movement
→ instant jump back to neutral
```

When possible, the last frame should transition naturally back to the first frame.

---

## 11. Optional idle pauses

Not every animated object needs to move continuously.

For a more natural scene:

### Curtain

Move for a short loop, then pause for a few seconds.

### Plants

Sway occasionally rather than constantly.

### Cat

Breathing can remain continuous.

### Lamp

Change very slowly or only occasionally.

### Foreground greenery

Use slow continuous motion or brief movement followed by an idle pause.

Randomized pauses help prevent visible synchronization.

---

## 12. Recommended runtime model

Each animated layer can use a small state object.

Conceptually:

```text
AnimatedLayer
  frames
  currentFrame
  frameDuration
  nextFrameAt
  loopMode
  idleDelay
```

The scene renderer updates each layer independently and then redraws the final composition.

Pseudo-flow:

```text
update current time

for each animated layer:
    if current time >= nextFrameAt:
        advance frame
        calculate nextFrameAt

render all static layers
render current frame of each animated layer
render device
render character
render foreground layers
```

---

## 13. Do not bake the character into the room

The environment should keep an open character area on the right side of the desk.

Do not include a chair in the default environment.

The character is its own composited entity and should visually sit in the open workspace area while facing left toward the desk.

This makes it easier to support multiple:

- body types
- hairstyles
- shirts
- future character animations

without redrawing the environment.

---

## 14. Device motion

Devices should normally remain structurally static.

Dynamic content should be rendered inside the screen hole by the game.

Possible future device motion:

- tiny notification light
- small keyboard interaction
- subtle screen glow

Do not animate the bezel geometry or change device perspective.

---

## 15. Character motion

Character animation can be added separately from environment motion.

Possible future loops:

- breathing
- typing
- blinking
- slight head movement
- drinking from mug
- stretching

Character motion should use the same principle:

```text
approved base pose
→ small aligned frame variations
→ independent runtime playback
```

Do not regenerate the full room for character animation.

---

## 16. Performance

Prefer small PNG frame sequences over full-screen GIF animation.

Benefits:

- only moving layers need multiple files
- static layers are loaded once
- different animations can run at different speeds
- easier to pause or disable motion
- easier to replace one asset
- easier to create low-motion accessibility settings

For future optimization, frame sets can also be converted into sprite sheets or a more efficient runtime texture format.

---

## 17. Reduced-motion support

The game should be able to disable or reduce ambient animation.

Recommended behavior:

```text
normal motion:
all enabled ambient layers animate

reduced motion:
use frame 01 for most layers
keep only very subtle cat breathing if desired

motion off:
render frame 01 for every animated layer
```

This requires no alternate environment artwork.

---

## 18. Motion generation workflow

For each room:

```text
1. Generate the complete master room.
2. Approve the room composition.
3. Extract static layers.
4. Extract the base version of each animated layer.
5. Generate 4–6 small motion variants from the approved layer.
6. Verify every frame has identical canvas alignment.
7. Save frames under motion/<layer>/.
8. Test each animation individually.
9. Test all animated layers together.
10. Adjust timing until the room feels calm and natural.
```

The visual target is a room that feels gently alive while keeping the desk, character, and device visually stable.
