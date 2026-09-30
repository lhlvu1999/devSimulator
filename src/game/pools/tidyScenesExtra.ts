type Swatch = "cream" | "sage" | "clay" | "blue";
type TidyPiece = {
  id: string;
  label: string;
  kind: "keep" | "wrong" | "decoy";
};

export type SceneDef = {
  keep: TidyPiece[];
  wrong: TidyPiece;
  decoy: TidyPiece;
  loose: { id: string; label: string };
  slotLabel: string;
  paintLabel: string;
  removeNote: string;
  placeNote: string;
  colorNote: (want: Swatch) => string;
};

const LABEL: Record<Swatch, string> = {
  cream: "white",
  sage: "green",
  clay: "orange",
  blue: "blue",
};

const RAW = {
  "calendar": {
    "keep": [
      {
        "id": "calendar-k1",
        "label": "Event",
        "kind": "keep"
      },
      {
        "id": "calendar-k2",
        "label": "Reminder",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "calendar-w",
      "label": "Wrong date",
      "kind": "wrong"
    },
    "decoy": {
      "id": "calendar-d",
      "label": "Sticker",
      "kind": "decoy"
    },
    "loose": {
      "id": "calendar-l",
      "label": "Invite card"
    },
    "slotLabel": "Pin board",
    "paintLabel": "Header",
    "removeNote": "Remove the wrong date.",
    "placeNote": "Put the invite card in the pin board.",
    "colorNoteWant": "header"
  },
  "fitness": {
    "keep": [
      {
        "id": "fitness-k1",
        "label": "Steps",
        "kind": "keep"
      },
      {
        "id": "fitness-k2",
        "label": "Heart rate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "fitness-w",
      "label": "999999 steps",
      "kind": "wrong"
    },
    "decoy": {
      "id": "fitness-d",
      "label": "Water bottle",
      "kind": "decoy"
    },
    "loose": {
      "id": "fitness-l",
      "label": "Towel"
    },
    "slotLabel": "Hook",
    "paintLabel": "Chart",
    "removeNote": "Remove the 999999 steps.",
    "placeNote": "Put the towel in the hook.",
    "colorNoteWant": "chart"
  },
  "garden": {
    "keep": [
      {
        "id": "garden-k1",
        "label": "Tomato",
        "kind": "keep"
      },
      {
        "id": "garden-k2",
        "label": "Water can",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garden-w",
      "label": "Weed",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garden-d",
      "label": "Gnome",
      "kind": "decoy"
    },
    "loose": {
      "id": "garden-l",
      "label": "Seed packet"
    },
    "slotLabel": "Plot",
    "paintLabel": "Fence",
    "removeNote": "Remove the weed.",
    "placeNote": "Put the seed packet in the plot.",
    "colorNoteWant": "fence"
  },
  "library": {
    "keep": [
      {
        "id": "library-k1",
        "label": "Book",
        "kind": "keep"
      },
      {
        "id": "library-k2",
        "label": "Bookmark",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "library-w",
      "label": "Coffee stain",
      "kind": "wrong"
    },
    "decoy": {
      "id": "library-d",
      "label": "Bookmark ribbon",
      "kind": "decoy"
    },
    "loose": {
      "id": "library-l",
      "label": "Return slip"
    },
    "slotLabel": "Shelf",
    "paintLabel": "Sign",
    "removeNote": "Remove the coffee stain.",
    "placeNote": "Put the return slip in the shelf.",
    "colorNoteWant": "sign"
  },
  "travel": {
    "keep": [
      {
        "id": "travel-k1",
        "label": "Ticket",
        "kind": "keep"
      },
      {
        "id": "travel-k2",
        "label": "Gate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "travel-w",
      "label": "Wrong gate",
      "kind": "wrong"
    },
    "decoy": {
      "id": "travel-d",
      "label": "Suitcase",
      "kind": "decoy"
    },
    "loose": {
      "id": "travel-l",
      "label": "Boarding pass"
    },
    "slotLabel": "Tray",
    "paintLabel": "Banner",
    "removeNote": "Remove the wrong gate.",
    "placeNote": "Put the boarding pass in the tray.",
    "colorNoteWant": "banner"
  },
  "cooking": {
    "keep": [
      {
        "id": "cooking-k1",
        "label": "Pot",
        "kind": "keep"
      },
      {
        "id": "cooking-k2",
        "label": "Timer",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "cooking-w",
      "label": "Sponge in pot",
      "kind": "wrong"
    },
    "decoy": {
      "id": "cooking-d",
      "label": "Lid",
      "kind": "decoy"
    },
    "loose": {
      "id": "cooking-l",
      "label": "Recipe card"
    },
    "slotLabel": "Trivet",
    "paintLabel": "Apron",
    "removeNote": "Remove the sponge in pot.",
    "placeNote": "Put the recipe card in the trivet.",
    "colorNoteWant": "apron"
  },
  "school": {
    "keep": [
      {
        "id": "school-k1",
        "label": "Desk",
        "kind": "keep"
      },
      {
        "id": "school-k2",
        "label": "Pencil",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "school-w",
      "label": "Doodle on test",
      "kind": "wrong"
    },
    "decoy": {
      "id": "school-d",
      "label": "Eraser",
      "kind": "decoy"
    },
    "loose": {
      "id": "school-l",
      "label": "Homework"
    },
    "slotLabel": "Tray",
    "paintLabel": "Board",
    "removeNote": "Remove the doodle on test.",
    "placeNote": "Put the homework in the tray.",
    "colorNoteWant": "board"
  },
  "clinic": {
    "keep": [
      {
        "id": "clinic-k1",
        "label": "Chart",
        "kind": "keep"
      },
      {
        "id": "clinic-k2",
        "label": "Stethoscope",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "clinic-w",
      "label": "Band-aid on screen",
      "kind": "wrong"
    },
    "decoy": {
      "id": "clinic-d",
      "label": "Thermometer",
      "kind": "decoy"
    },
    "loose": {
      "id": "clinic-l",
      "label": "Patient card"
    },
    "slotLabel": "Slot",
    "paintLabel": "Wall",
    "removeNote": "Remove the band-aid on screen.",
    "placeNote": "Put the patient card in the slot.",
    "colorNoteWant": "wall"
  },
  "studio": {
    "keep": [
      {
        "id": "studio-k1",
        "label": "Camera",
        "kind": "keep"
      },
      {
        "id": "studio-k2",
        "label": "Light",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "studio-w",
      "label": "Lens cap on",
      "kind": "wrong"
    },
    "decoy": {
      "id": "studio-d",
      "label": "Tripod",
      "kind": "decoy"
    },
    "loose": {
      "id": "studio-l",
      "label": "Memory card"
    },
    "slotLabel": "Bay",
    "paintLabel": "Backdrop",
    "removeNote": "Remove the lens cap on.",
    "placeNote": "Put the memory card in the bay.",
    "colorNoteWant": "backdrop"
  },
  "garage": {
    "keep": [
      {
        "id": "garage-k1",
        "label": "Car",
        "kind": "keep"
      },
      {
        "id": "garage-k2",
        "label": "Wrench",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garage-w",
      "label": "Flat tire icon",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garage-d",
      "label": "Oil can",
      "kind": "decoy"
    },
    "loose": {
      "id": "garage-l",
      "label": "Key fob"
    },
    "slotLabel": "Peg",
    "paintLabel": "Door",
    "removeNote": "Remove the flat tire icon.",
    "placeNote": "Put the key fob in the peg.",
    "colorNoteWant": "door"
  },
  "news": {
    "keep": [
      {
        "id": "news-k1",
        "label": "Headline",
        "kind": "keep"
      },
      {
        "id": "news-k2",
        "label": "Byline",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "news-w",
      "label": "Typo in title",
      "kind": "wrong"
    },
    "decoy": {
      "id": "news-d",
      "label": "Coffee cup",
      "kind": "decoy"
    },
    "loose": {
      "id": "news-l",
      "label": "Photo credit"
    },
    "slotLabel": "Slot",
    "paintLabel": "Masthead",
    "removeNote": "Remove the typo in title.",
    "placeNote": "Put the photo credit in the slot.",
    "colorNoteWant": "masthead"
  },
  "podcast": {
    "keep": [
      {
        "id": "podcast-k1",
        "label": "Mic",
        "kind": "keep"
      },
      {
        "id": "podcast-k2",
        "label": "Waveform",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "podcast-w",
      "label": "Dog barking track",
      "kind": "wrong"
    },
    "decoy": {
      "id": "podcast-d",
      "label": "Headphones",
      "kind": "decoy"
    },
    "loose": {
      "id": "podcast-l",
      "label": "Episode art"
    },
    "slotLabel": "Cover",
    "paintLabel": "Player",
    "removeNote": "Remove the dog barking track.",
    "placeNote": "Put the episode art in the cover.",
    "colorNoteWant": "player"
  },
  "budget": {
    "keep": [
      {
        "id": "budget-k1",
        "label": "Income",
        "kind": "keep"
      },
      {
        "id": "budget-k2",
        "label": "Expense",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "budget-w",
      "label": "Negative lunch fund",
      "kind": "wrong"
    },
    "decoy": {
      "id": "budget-d",
      "label": "Receipt",
      "kind": "decoy"
    },
    "loose": {
      "id": "budget-l",
      "label": "Savings jar"
    },
    "slotLabel": "Tray",
    "paintLabel": "Chart",
    "removeNote": "Remove the negative lunch fund.",
    "placeNote": "Put the savings jar in the tray.",
    "colorNoteWant": "chart"
  },
  "hike": {
    "keep": [
      {
        "id": "hike-k1",
        "label": "Trail",
        "kind": "keep"
      },
      {
        "id": "hike-k2",
        "label": "Boots",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "hike-w",
      "label": "Sign pointing wrong way",
      "kind": "wrong"
    },
    "decoy": {
      "id": "hike-d",
      "label": "Flask",
      "kind": "decoy"
    },
    "loose": {
      "id": "hike-l",
      "label": "Map fold"
    },
    "slotLabel": "Pocket",
    "paintLabel": "Sky",
    "removeNote": "Remove the sign pointing wrong way.",
    "placeNote": "Put the map fold in the pocket.",
    "colorNoteWant": "sky"
  },
  "bakery": {
    "keep": [
      {
        "id": "bakery-k1",
        "label": "Loaf",
        "kind": "keep"
      },
      {
        "id": "bakery-k2",
        "label": "Oven",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "bakery-w",
      "label": "Raw dough on shelf",
      "kind": "wrong"
    },
    "decoy": {
      "id": "bakery-d",
      "label": "Whisk",
      "kind": "decoy"
    },
    "loose": {
      "id": "bakery-l",
      "label": "Order slip"
    },
    "slotLabel": "Counter",
    "paintLabel": "Apron",
    "removeNote": "Remove the raw dough on shelf.",
    "placeNote": "Put the order slip in the counter.",
    "colorNoteWant": "apron"
  },
  "theater": {
    "keep": [
      {
        "id": "theater-k1",
        "label": "Stage",
        "kind": "keep"
      },
      {
        "id": "theater-k2",
        "label": "Curtain",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "theater-w",
      "label": "Spotlight on empty seat",
      "kind": "wrong"
    },
    "decoy": {
      "id": "theater-d",
      "label": "Program",
      "kind": "decoy"
    },
    "loose": {
      "id": "theater-l",
      "label": "Ticket stub"
    },
    "slotLabel": "Seat",
    "paintLabel": "Banner",
    "removeNote": "Remove the spotlight on empty seat.",
    "placeNote": "Put the ticket stub in the seat.",
    "colorNoteWant": "banner"
  },
  "museum": {
    "keep": [
      {
        "id": "museum-k1",
        "label": "Plaque",
        "kind": "keep"
      },
      {
        "id": "museum-k2",
        "label": "Artifact",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "museum-w",
      "label": "Price tag on statue",
      "kind": "wrong"
    },
    "decoy": {
      "id": "museum-d",
      "label": "Brochure",
      "kind": "decoy"
    },
    "loose": {
      "id": "museum-l",
      "label": "Audio guide"
    },
    "slotLabel": "Stand",
    "paintLabel": "Wall",
    "removeNote": "Remove the price tag on statue.",
    "placeNote": "Put the audio guide in the stand.",
    "colorNoteWant": "wall"
  },
  "farm": {
    "keep": [
      {
        "id": "farm-k1",
        "label": "Barn",
        "kind": "keep"
      },
      {
        "id": "farm-k2",
        "label": "Tractor",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "farm-w",
      "label": "Chicken in cab",
      "kind": "wrong"
    },
    "decoy": {
      "id": "farm-d",
      "label": "Hay bale",
      "kind": "decoy"
    },
    "loose": {
      "id": "farm-l",
      "label": "Feed bag"
    },
    "slotLabel": "Hook",
    "paintLabel": "Sign",
    "removeNote": "Remove the chicken in cab.",
    "placeNote": "Put the feed bag in the hook.",
    "colorNoteWant": "sign"
  },
  "beach": {
    "keep": [
      {
        "id": "beach-k1",
        "label": "Umbrella",
        "kind": "keep"
      },
      {
        "id": "beach-k2",
        "label": "Towel",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "beach-w",
      "label": "Snow on sand",
      "kind": "wrong"
    },
    "decoy": {
      "id": "beach-d",
      "label": "Cooler",
      "kind": "decoy"
    },
    "loose": {
      "id": "beach-l",
      "label": "Sandcastle flag"
    },
    "slotLabel": "Pole",
    "paintLabel": "Sky",
    "removeNote": "Remove the snow on sand.",
    "placeNote": "Put the sandcastle flag in the pole.",
    "colorNoteWant": "sky"
  },
  "office": {
    "keep": [
      {
        "id": "office-k1",
        "label": "Inbox",
        "kind": "keep"
      },
      {
        "id": "office-k2",
        "label": "Calendar",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "office-w",
      "label": "Meeting at 3 AM",
      "kind": "wrong"
    },
    "decoy": {
      "id": "office-d",
      "label": "Stapler",
      "kind": "decoy"
    },
    "loose": {
      "id": "office-l",
      "label": "Name plate"
    },
    "slotLabel": "Desk",
    "paintLabel": "Wall",
    "removeNote": "Remove the meeting at 3 am.",
    "placeNote": "Put the name plate in the desk.",
    "colorNoteWant": "wall"
  },
  "calendar1": {
    "keep": [
      {
        "id": "calendar1-k1",
        "label": "Event",
        "kind": "keep"
      },
      {
        "id": "calendar1-k2",
        "label": "Reminder",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "calendar1-w",
      "label": "Wrong date",
      "kind": "wrong"
    },
    "decoy": {
      "id": "calendar1-d",
      "label": "Sticker",
      "kind": "decoy"
    },
    "loose": {
      "id": "calendar1-l",
      "label": "Invite card"
    },
    "slotLabel": "Pin board",
    "paintLabel": "Header",
    "removeNote": "Remove the wrong date.",
    "placeNote": "Put the invite card in the pin board.",
    "colorNoteWant": "header"
  },
  "fitness1": {
    "keep": [
      {
        "id": "fitness1-k1",
        "label": "Steps",
        "kind": "keep"
      },
      {
        "id": "fitness1-k2",
        "label": "Heart rate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "fitness1-w",
      "label": "999999 steps",
      "kind": "wrong"
    },
    "decoy": {
      "id": "fitness1-d",
      "label": "Water bottle",
      "kind": "decoy"
    },
    "loose": {
      "id": "fitness1-l",
      "label": "Towel"
    },
    "slotLabel": "Hook",
    "paintLabel": "Chart",
    "removeNote": "Remove the 999999 steps.",
    "placeNote": "Put the towel in the hook.",
    "colorNoteWant": "chart"
  },
  "garden1": {
    "keep": [
      {
        "id": "garden1-k1",
        "label": "Tomato",
        "kind": "keep"
      },
      {
        "id": "garden1-k2",
        "label": "Water can",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garden1-w",
      "label": "Weed",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garden1-d",
      "label": "Gnome",
      "kind": "decoy"
    },
    "loose": {
      "id": "garden1-l",
      "label": "Seed packet"
    },
    "slotLabel": "Plot",
    "paintLabel": "Fence",
    "removeNote": "Remove the weed.",
    "placeNote": "Put the seed packet in the plot.",
    "colorNoteWant": "fence"
  },
  "library1": {
    "keep": [
      {
        "id": "library1-k1",
        "label": "Book",
        "kind": "keep"
      },
      {
        "id": "library1-k2",
        "label": "Bookmark",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "library1-w",
      "label": "Coffee stain",
      "kind": "wrong"
    },
    "decoy": {
      "id": "library1-d",
      "label": "Bookmark ribbon",
      "kind": "decoy"
    },
    "loose": {
      "id": "library1-l",
      "label": "Return slip"
    },
    "slotLabel": "Shelf",
    "paintLabel": "Sign",
    "removeNote": "Remove the coffee stain.",
    "placeNote": "Put the return slip in the shelf.",
    "colorNoteWant": "sign"
  },
  "travel1": {
    "keep": [
      {
        "id": "travel1-k1",
        "label": "Ticket",
        "kind": "keep"
      },
      {
        "id": "travel1-k2",
        "label": "Gate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "travel1-w",
      "label": "Wrong gate",
      "kind": "wrong"
    },
    "decoy": {
      "id": "travel1-d",
      "label": "Suitcase",
      "kind": "decoy"
    },
    "loose": {
      "id": "travel1-l",
      "label": "Boarding pass"
    },
    "slotLabel": "Tray",
    "paintLabel": "Banner",
    "removeNote": "Remove the wrong gate.",
    "placeNote": "Put the boarding pass in the tray.",
    "colorNoteWant": "banner"
  },
  "cooking1": {
    "keep": [
      {
        "id": "cooking1-k1",
        "label": "Pot",
        "kind": "keep"
      },
      {
        "id": "cooking1-k2",
        "label": "Timer",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "cooking1-w",
      "label": "Sponge in pot",
      "kind": "wrong"
    },
    "decoy": {
      "id": "cooking1-d",
      "label": "Lid",
      "kind": "decoy"
    },
    "loose": {
      "id": "cooking1-l",
      "label": "Recipe card"
    },
    "slotLabel": "Trivet",
    "paintLabel": "Apron",
    "removeNote": "Remove the sponge in pot.",
    "placeNote": "Put the recipe card in the trivet.",
    "colorNoteWant": "apron"
  },
  "school1": {
    "keep": [
      {
        "id": "school1-k1",
        "label": "Desk",
        "kind": "keep"
      },
      {
        "id": "school1-k2",
        "label": "Pencil",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "school1-w",
      "label": "Doodle on test",
      "kind": "wrong"
    },
    "decoy": {
      "id": "school1-d",
      "label": "Eraser",
      "kind": "decoy"
    },
    "loose": {
      "id": "school1-l",
      "label": "Homework"
    },
    "slotLabel": "Tray",
    "paintLabel": "Board",
    "removeNote": "Remove the doodle on test.",
    "placeNote": "Put the homework in the tray.",
    "colorNoteWant": "board"
  },
  "clinic1": {
    "keep": [
      {
        "id": "clinic1-k1",
        "label": "Chart",
        "kind": "keep"
      },
      {
        "id": "clinic1-k2",
        "label": "Stethoscope",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "clinic1-w",
      "label": "Band-aid on screen",
      "kind": "wrong"
    },
    "decoy": {
      "id": "clinic1-d",
      "label": "Thermometer",
      "kind": "decoy"
    },
    "loose": {
      "id": "clinic1-l",
      "label": "Patient card"
    },
    "slotLabel": "Slot",
    "paintLabel": "Wall",
    "removeNote": "Remove the band-aid on screen.",
    "placeNote": "Put the patient card in the slot.",
    "colorNoteWant": "wall"
  },
  "studio1": {
    "keep": [
      {
        "id": "studio1-k1",
        "label": "Camera",
        "kind": "keep"
      },
      {
        "id": "studio1-k2",
        "label": "Light",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "studio1-w",
      "label": "Lens cap on",
      "kind": "wrong"
    },
    "decoy": {
      "id": "studio1-d",
      "label": "Tripod",
      "kind": "decoy"
    },
    "loose": {
      "id": "studio1-l",
      "label": "Memory card"
    },
    "slotLabel": "Bay",
    "paintLabel": "Backdrop",
    "removeNote": "Remove the lens cap on.",
    "placeNote": "Put the memory card in the bay.",
    "colorNoteWant": "backdrop"
  },
  "garage1": {
    "keep": [
      {
        "id": "garage1-k1",
        "label": "Car",
        "kind": "keep"
      },
      {
        "id": "garage1-k2",
        "label": "Wrench",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garage1-w",
      "label": "Flat tire icon",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garage1-d",
      "label": "Oil can",
      "kind": "decoy"
    },
    "loose": {
      "id": "garage1-l",
      "label": "Key fob"
    },
    "slotLabel": "Peg",
    "paintLabel": "Door",
    "removeNote": "Remove the flat tire icon.",
    "placeNote": "Put the key fob in the peg.",
    "colorNoteWant": "door"
  },
  "news1": {
    "keep": [
      {
        "id": "news1-k1",
        "label": "Headline",
        "kind": "keep"
      },
      {
        "id": "news1-k2",
        "label": "Byline",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "news1-w",
      "label": "Typo in title",
      "kind": "wrong"
    },
    "decoy": {
      "id": "news1-d",
      "label": "Coffee cup",
      "kind": "decoy"
    },
    "loose": {
      "id": "news1-l",
      "label": "Photo credit"
    },
    "slotLabel": "Slot",
    "paintLabel": "Masthead",
    "removeNote": "Remove the typo in title.",
    "placeNote": "Put the photo credit in the slot.",
    "colorNoteWant": "masthead"
  },
  "podcast1": {
    "keep": [
      {
        "id": "podcast1-k1",
        "label": "Mic",
        "kind": "keep"
      },
      {
        "id": "podcast1-k2",
        "label": "Waveform",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "podcast1-w",
      "label": "Dog barking track",
      "kind": "wrong"
    },
    "decoy": {
      "id": "podcast1-d",
      "label": "Headphones",
      "kind": "decoy"
    },
    "loose": {
      "id": "podcast1-l",
      "label": "Episode art"
    },
    "slotLabel": "Cover",
    "paintLabel": "Player",
    "removeNote": "Remove the dog barking track.",
    "placeNote": "Put the episode art in the cover.",
    "colorNoteWant": "player"
  },
  "budget1": {
    "keep": [
      {
        "id": "budget1-k1",
        "label": "Income",
        "kind": "keep"
      },
      {
        "id": "budget1-k2",
        "label": "Expense",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "budget1-w",
      "label": "Negative lunch fund",
      "kind": "wrong"
    },
    "decoy": {
      "id": "budget1-d",
      "label": "Receipt",
      "kind": "decoy"
    },
    "loose": {
      "id": "budget1-l",
      "label": "Savings jar"
    },
    "slotLabel": "Tray",
    "paintLabel": "Chart",
    "removeNote": "Remove the negative lunch fund.",
    "placeNote": "Put the savings jar in the tray.",
    "colorNoteWant": "chart"
  },
  "hike1": {
    "keep": [
      {
        "id": "hike1-k1",
        "label": "Trail",
        "kind": "keep"
      },
      {
        "id": "hike1-k2",
        "label": "Boots",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "hike1-w",
      "label": "Sign pointing wrong way",
      "kind": "wrong"
    },
    "decoy": {
      "id": "hike1-d",
      "label": "Flask",
      "kind": "decoy"
    },
    "loose": {
      "id": "hike1-l",
      "label": "Map fold"
    },
    "slotLabel": "Pocket",
    "paintLabel": "Sky",
    "removeNote": "Remove the sign pointing wrong way.",
    "placeNote": "Put the map fold in the pocket.",
    "colorNoteWant": "sky"
  },
  "bakery1": {
    "keep": [
      {
        "id": "bakery1-k1",
        "label": "Loaf",
        "kind": "keep"
      },
      {
        "id": "bakery1-k2",
        "label": "Oven",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "bakery1-w",
      "label": "Raw dough on shelf",
      "kind": "wrong"
    },
    "decoy": {
      "id": "bakery1-d",
      "label": "Whisk",
      "kind": "decoy"
    },
    "loose": {
      "id": "bakery1-l",
      "label": "Order slip"
    },
    "slotLabel": "Counter",
    "paintLabel": "Apron",
    "removeNote": "Remove the raw dough on shelf.",
    "placeNote": "Put the order slip in the counter.",
    "colorNoteWant": "apron"
  },
  "theater1": {
    "keep": [
      {
        "id": "theater1-k1",
        "label": "Stage",
        "kind": "keep"
      },
      {
        "id": "theater1-k2",
        "label": "Curtain",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "theater1-w",
      "label": "Spotlight on empty seat",
      "kind": "wrong"
    },
    "decoy": {
      "id": "theater1-d",
      "label": "Program",
      "kind": "decoy"
    },
    "loose": {
      "id": "theater1-l",
      "label": "Ticket stub"
    },
    "slotLabel": "Seat",
    "paintLabel": "Banner",
    "removeNote": "Remove the spotlight on empty seat.",
    "placeNote": "Put the ticket stub in the seat.",
    "colorNoteWant": "banner"
  },
  "museum1": {
    "keep": [
      {
        "id": "museum1-k1",
        "label": "Plaque",
        "kind": "keep"
      },
      {
        "id": "museum1-k2",
        "label": "Artifact",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "museum1-w",
      "label": "Price tag on statue",
      "kind": "wrong"
    },
    "decoy": {
      "id": "museum1-d",
      "label": "Brochure",
      "kind": "decoy"
    },
    "loose": {
      "id": "museum1-l",
      "label": "Audio guide"
    },
    "slotLabel": "Stand",
    "paintLabel": "Wall",
    "removeNote": "Remove the price tag on statue.",
    "placeNote": "Put the audio guide in the stand.",
    "colorNoteWant": "wall"
  },
  "farm1": {
    "keep": [
      {
        "id": "farm1-k1",
        "label": "Barn",
        "kind": "keep"
      },
      {
        "id": "farm1-k2",
        "label": "Tractor",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "farm1-w",
      "label": "Chicken in cab",
      "kind": "wrong"
    },
    "decoy": {
      "id": "farm1-d",
      "label": "Hay bale",
      "kind": "decoy"
    },
    "loose": {
      "id": "farm1-l",
      "label": "Feed bag"
    },
    "slotLabel": "Hook",
    "paintLabel": "Sign",
    "removeNote": "Remove the chicken in cab.",
    "placeNote": "Put the feed bag in the hook.",
    "colorNoteWant": "sign"
  },
  "beach1": {
    "keep": [
      {
        "id": "beach1-k1",
        "label": "Umbrella",
        "kind": "keep"
      },
      {
        "id": "beach1-k2",
        "label": "Towel",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "beach1-w",
      "label": "Snow on sand",
      "kind": "wrong"
    },
    "decoy": {
      "id": "beach1-d",
      "label": "Cooler",
      "kind": "decoy"
    },
    "loose": {
      "id": "beach1-l",
      "label": "Sandcastle flag"
    },
    "slotLabel": "Pole",
    "paintLabel": "Sky",
    "removeNote": "Remove the snow on sand.",
    "placeNote": "Put the sandcastle flag in the pole.",
    "colorNoteWant": "sky"
  },
  "office1": {
    "keep": [
      {
        "id": "office1-k1",
        "label": "Inbox",
        "kind": "keep"
      },
      {
        "id": "office1-k2",
        "label": "Calendar",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "office1-w",
      "label": "Meeting at 3 AM",
      "kind": "wrong"
    },
    "decoy": {
      "id": "office1-d",
      "label": "Stapler",
      "kind": "decoy"
    },
    "loose": {
      "id": "office1-l",
      "label": "Name plate"
    },
    "slotLabel": "Desk",
    "paintLabel": "Wall",
    "removeNote": "Remove the meeting at 3 am.",
    "placeNote": "Put the name plate in the desk.",
    "colorNoteWant": "wall"
  },
  "calendar2": {
    "keep": [
      {
        "id": "calendar2-k1",
        "label": "Event",
        "kind": "keep"
      },
      {
        "id": "calendar2-k2",
        "label": "Reminder",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "calendar2-w",
      "label": "Wrong date",
      "kind": "wrong"
    },
    "decoy": {
      "id": "calendar2-d",
      "label": "Sticker",
      "kind": "decoy"
    },
    "loose": {
      "id": "calendar2-l",
      "label": "Invite card"
    },
    "slotLabel": "Pin board",
    "paintLabel": "Header",
    "removeNote": "Remove the wrong date.",
    "placeNote": "Put the invite card in the pin board.",
    "colorNoteWant": "header"
  },
  "fitness2": {
    "keep": [
      {
        "id": "fitness2-k1",
        "label": "Steps",
        "kind": "keep"
      },
      {
        "id": "fitness2-k2",
        "label": "Heart rate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "fitness2-w",
      "label": "999999 steps",
      "kind": "wrong"
    },
    "decoy": {
      "id": "fitness2-d",
      "label": "Water bottle",
      "kind": "decoy"
    },
    "loose": {
      "id": "fitness2-l",
      "label": "Towel"
    },
    "slotLabel": "Hook",
    "paintLabel": "Chart",
    "removeNote": "Remove the 999999 steps.",
    "placeNote": "Put the towel in the hook.",
    "colorNoteWant": "chart"
  },
  "garden2": {
    "keep": [
      {
        "id": "garden2-k1",
        "label": "Tomato",
        "kind": "keep"
      },
      {
        "id": "garden2-k2",
        "label": "Water can",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garden2-w",
      "label": "Weed",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garden2-d",
      "label": "Gnome",
      "kind": "decoy"
    },
    "loose": {
      "id": "garden2-l",
      "label": "Seed packet"
    },
    "slotLabel": "Plot",
    "paintLabel": "Fence",
    "removeNote": "Remove the weed.",
    "placeNote": "Put the seed packet in the plot.",
    "colorNoteWant": "fence"
  },
  "library2": {
    "keep": [
      {
        "id": "library2-k1",
        "label": "Book",
        "kind": "keep"
      },
      {
        "id": "library2-k2",
        "label": "Bookmark",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "library2-w",
      "label": "Coffee stain",
      "kind": "wrong"
    },
    "decoy": {
      "id": "library2-d",
      "label": "Bookmark ribbon",
      "kind": "decoy"
    },
    "loose": {
      "id": "library2-l",
      "label": "Return slip"
    },
    "slotLabel": "Shelf",
    "paintLabel": "Sign",
    "removeNote": "Remove the coffee stain.",
    "placeNote": "Put the return slip in the shelf.",
    "colorNoteWant": "sign"
  },
  "travel2": {
    "keep": [
      {
        "id": "travel2-k1",
        "label": "Ticket",
        "kind": "keep"
      },
      {
        "id": "travel2-k2",
        "label": "Gate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "travel2-w",
      "label": "Wrong gate",
      "kind": "wrong"
    },
    "decoy": {
      "id": "travel2-d",
      "label": "Suitcase",
      "kind": "decoy"
    },
    "loose": {
      "id": "travel2-l",
      "label": "Boarding pass"
    },
    "slotLabel": "Tray",
    "paintLabel": "Banner",
    "removeNote": "Remove the wrong gate.",
    "placeNote": "Put the boarding pass in the tray.",
    "colorNoteWant": "banner"
  },
  "cooking2": {
    "keep": [
      {
        "id": "cooking2-k1",
        "label": "Pot",
        "kind": "keep"
      },
      {
        "id": "cooking2-k2",
        "label": "Timer",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "cooking2-w",
      "label": "Sponge in pot",
      "kind": "wrong"
    },
    "decoy": {
      "id": "cooking2-d",
      "label": "Lid",
      "kind": "decoy"
    },
    "loose": {
      "id": "cooking2-l",
      "label": "Recipe card"
    },
    "slotLabel": "Trivet",
    "paintLabel": "Apron",
    "removeNote": "Remove the sponge in pot.",
    "placeNote": "Put the recipe card in the trivet.",
    "colorNoteWant": "apron"
  },
  "school2": {
    "keep": [
      {
        "id": "school2-k1",
        "label": "Desk",
        "kind": "keep"
      },
      {
        "id": "school2-k2",
        "label": "Pencil",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "school2-w",
      "label": "Doodle on test",
      "kind": "wrong"
    },
    "decoy": {
      "id": "school2-d",
      "label": "Eraser",
      "kind": "decoy"
    },
    "loose": {
      "id": "school2-l",
      "label": "Homework"
    },
    "slotLabel": "Tray",
    "paintLabel": "Board",
    "removeNote": "Remove the doodle on test.",
    "placeNote": "Put the homework in the tray.",
    "colorNoteWant": "board"
  },
  "clinic2": {
    "keep": [
      {
        "id": "clinic2-k1",
        "label": "Chart",
        "kind": "keep"
      },
      {
        "id": "clinic2-k2",
        "label": "Stethoscope",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "clinic2-w",
      "label": "Band-aid on screen",
      "kind": "wrong"
    },
    "decoy": {
      "id": "clinic2-d",
      "label": "Thermometer",
      "kind": "decoy"
    },
    "loose": {
      "id": "clinic2-l",
      "label": "Patient card"
    },
    "slotLabel": "Slot",
    "paintLabel": "Wall",
    "removeNote": "Remove the band-aid on screen.",
    "placeNote": "Put the patient card in the slot.",
    "colorNoteWant": "wall"
  },
  "studio2": {
    "keep": [
      {
        "id": "studio2-k1",
        "label": "Camera",
        "kind": "keep"
      },
      {
        "id": "studio2-k2",
        "label": "Light",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "studio2-w",
      "label": "Lens cap on",
      "kind": "wrong"
    },
    "decoy": {
      "id": "studio2-d",
      "label": "Tripod",
      "kind": "decoy"
    },
    "loose": {
      "id": "studio2-l",
      "label": "Memory card"
    },
    "slotLabel": "Bay",
    "paintLabel": "Backdrop",
    "removeNote": "Remove the lens cap on.",
    "placeNote": "Put the memory card in the bay.",
    "colorNoteWant": "backdrop"
  },
  "garage2": {
    "keep": [
      {
        "id": "garage2-k1",
        "label": "Car",
        "kind": "keep"
      },
      {
        "id": "garage2-k2",
        "label": "Wrench",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garage2-w",
      "label": "Flat tire icon",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garage2-d",
      "label": "Oil can",
      "kind": "decoy"
    },
    "loose": {
      "id": "garage2-l",
      "label": "Key fob"
    },
    "slotLabel": "Peg",
    "paintLabel": "Door",
    "removeNote": "Remove the flat tire icon.",
    "placeNote": "Put the key fob in the peg.",
    "colorNoteWant": "door"
  },
  "news2": {
    "keep": [
      {
        "id": "news2-k1",
        "label": "Headline",
        "kind": "keep"
      },
      {
        "id": "news2-k2",
        "label": "Byline",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "news2-w",
      "label": "Typo in title",
      "kind": "wrong"
    },
    "decoy": {
      "id": "news2-d",
      "label": "Coffee cup",
      "kind": "decoy"
    },
    "loose": {
      "id": "news2-l",
      "label": "Photo credit"
    },
    "slotLabel": "Slot",
    "paintLabel": "Masthead",
    "removeNote": "Remove the typo in title.",
    "placeNote": "Put the photo credit in the slot.",
    "colorNoteWant": "masthead"
  },
  "podcast2": {
    "keep": [
      {
        "id": "podcast2-k1",
        "label": "Mic",
        "kind": "keep"
      },
      {
        "id": "podcast2-k2",
        "label": "Waveform",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "podcast2-w",
      "label": "Dog barking track",
      "kind": "wrong"
    },
    "decoy": {
      "id": "podcast2-d",
      "label": "Headphones",
      "kind": "decoy"
    },
    "loose": {
      "id": "podcast2-l",
      "label": "Episode art"
    },
    "slotLabel": "Cover",
    "paintLabel": "Player",
    "removeNote": "Remove the dog barking track.",
    "placeNote": "Put the episode art in the cover.",
    "colorNoteWant": "player"
  },
  "budget2": {
    "keep": [
      {
        "id": "budget2-k1",
        "label": "Income",
        "kind": "keep"
      },
      {
        "id": "budget2-k2",
        "label": "Expense",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "budget2-w",
      "label": "Negative lunch fund",
      "kind": "wrong"
    },
    "decoy": {
      "id": "budget2-d",
      "label": "Receipt",
      "kind": "decoy"
    },
    "loose": {
      "id": "budget2-l",
      "label": "Savings jar"
    },
    "slotLabel": "Tray",
    "paintLabel": "Chart",
    "removeNote": "Remove the negative lunch fund.",
    "placeNote": "Put the savings jar in the tray.",
    "colorNoteWant": "chart"
  },
  "hike2": {
    "keep": [
      {
        "id": "hike2-k1",
        "label": "Trail",
        "kind": "keep"
      },
      {
        "id": "hike2-k2",
        "label": "Boots",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "hike2-w",
      "label": "Sign pointing wrong way",
      "kind": "wrong"
    },
    "decoy": {
      "id": "hike2-d",
      "label": "Flask",
      "kind": "decoy"
    },
    "loose": {
      "id": "hike2-l",
      "label": "Map fold"
    },
    "slotLabel": "Pocket",
    "paintLabel": "Sky",
    "removeNote": "Remove the sign pointing wrong way.",
    "placeNote": "Put the map fold in the pocket.",
    "colorNoteWant": "sky"
  },
  "bakery2": {
    "keep": [
      {
        "id": "bakery2-k1",
        "label": "Loaf",
        "kind": "keep"
      },
      {
        "id": "bakery2-k2",
        "label": "Oven",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "bakery2-w",
      "label": "Raw dough on shelf",
      "kind": "wrong"
    },
    "decoy": {
      "id": "bakery2-d",
      "label": "Whisk",
      "kind": "decoy"
    },
    "loose": {
      "id": "bakery2-l",
      "label": "Order slip"
    },
    "slotLabel": "Counter",
    "paintLabel": "Apron",
    "removeNote": "Remove the raw dough on shelf.",
    "placeNote": "Put the order slip in the counter.",
    "colorNoteWant": "apron"
  },
  "theater2": {
    "keep": [
      {
        "id": "theater2-k1",
        "label": "Stage",
        "kind": "keep"
      },
      {
        "id": "theater2-k2",
        "label": "Curtain",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "theater2-w",
      "label": "Spotlight on empty seat",
      "kind": "wrong"
    },
    "decoy": {
      "id": "theater2-d",
      "label": "Program",
      "kind": "decoy"
    },
    "loose": {
      "id": "theater2-l",
      "label": "Ticket stub"
    },
    "slotLabel": "Seat",
    "paintLabel": "Banner",
    "removeNote": "Remove the spotlight on empty seat.",
    "placeNote": "Put the ticket stub in the seat.",
    "colorNoteWant": "banner"
  },
  "museum2": {
    "keep": [
      {
        "id": "museum2-k1",
        "label": "Plaque",
        "kind": "keep"
      },
      {
        "id": "museum2-k2",
        "label": "Artifact",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "museum2-w",
      "label": "Price tag on statue",
      "kind": "wrong"
    },
    "decoy": {
      "id": "museum2-d",
      "label": "Brochure",
      "kind": "decoy"
    },
    "loose": {
      "id": "museum2-l",
      "label": "Audio guide"
    },
    "slotLabel": "Stand",
    "paintLabel": "Wall",
    "removeNote": "Remove the price tag on statue.",
    "placeNote": "Put the audio guide in the stand.",
    "colorNoteWant": "wall"
  },
  "farm2": {
    "keep": [
      {
        "id": "farm2-k1",
        "label": "Barn",
        "kind": "keep"
      },
      {
        "id": "farm2-k2",
        "label": "Tractor",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "farm2-w",
      "label": "Chicken in cab",
      "kind": "wrong"
    },
    "decoy": {
      "id": "farm2-d",
      "label": "Hay bale",
      "kind": "decoy"
    },
    "loose": {
      "id": "farm2-l",
      "label": "Feed bag"
    },
    "slotLabel": "Hook",
    "paintLabel": "Sign",
    "removeNote": "Remove the chicken in cab.",
    "placeNote": "Put the feed bag in the hook.",
    "colorNoteWant": "sign"
  },
  "beach2": {
    "keep": [
      {
        "id": "beach2-k1",
        "label": "Umbrella",
        "kind": "keep"
      },
      {
        "id": "beach2-k2",
        "label": "Towel",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "beach2-w",
      "label": "Snow on sand",
      "kind": "wrong"
    },
    "decoy": {
      "id": "beach2-d",
      "label": "Cooler",
      "kind": "decoy"
    },
    "loose": {
      "id": "beach2-l",
      "label": "Sandcastle flag"
    },
    "slotLabel": "Pole",
    "paintLabel": "Sky",
    "removeNote": "Remove the snow on sand.",
    "placeNote": "Put the sandcastle flag in the pole.",
    "colorNoteWant": "sky"
  },
  "office2": {
    "keep": [
      {
        "id": "office2-k1",
        "label": "Inbox",
        "kind": "keep"
      },
      {
        "id": "office2-k2",
        "label": "Calendar",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "office2-w",
      "label": "Meeting at 3 AM",
      "kind": "wrong"
    },
    "decoy": {
      "id": "office2-d",
      "label": "Stapler",
      "kind": "decoy"
    },
    "loose": {
      "id": "office2-l",
      "label": "Name plate"
    },
    "slotLabel": "Desk",
    "paintLabel": "Wall",
    "removeNote": "Remove the meeting at 3 am.",
    "placeNote": "Put the name plate in the desk.",
    "colorNoteWant": "wall"
  },
  "calendar3": {
    "keep": [
      {
        "id": "calendar3-k1",
        "label": "Event",
        "kind": "keep"
      },
      {
        "id": "calendar3-k2",
        "label": "Reminder",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "calendar3-w",
      "label": "Wrong date",
      "kind": "wrong"
    },
    "decoy": {
      "id": "calendar3-d",
      "label": "Sticker",
      "kind": "decoy"
    },
    "loose": {
      "id": "calendar3-l",
      "label": "Invite card"
    },
    "slotLabel": "Pin board",
    "paintLabel": "Header",
    "removeNote": "Remove the wrong date.",
    "placeNote": "Put the invite card in the pin board.",
    "colorNoteWant": "header"
  },
  "fitness3": {
    "keep": [
      {
        "id": "fitness3-k1",
        "label": "Steps",
        "kind": "keep"
      },
      {
        "id": "fitness3-k2",
        "label": "Heart rate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "fitness3-w",
      "label": "999999 steps",
      "kind": "wrong"
    },
    "decoy": {
      "id": "fitness3-d",
      "label": "Water bottle",
      "kind": "decoy"
    },
    "loose": {
      "id": "fitness3-l",
      "label": "Towel"
    },
    "slotLabel": "Hook",
    "paintLabel": "Chart",
    "removeNote": "Remove the 999999 steps.",
    "placeNote": "Put the towel in the hook.",
    "colorNoteWant": "chart"
  },
  "garden3": {
    "keep": [
      {
        "id": "garden3-k1",
        "label": "Tomato",
        "kind": "keep"
      },
      {
        "id": "garden3-k2",
        "label": "Water can",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garden3-w",
      "label": "Weed",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garden3-d",
      "label": "Gnome",
      "kind": "decoy"
    },
    "loose": {
      "id": "garden3-l",
      "label": "Seed packet"
    },
    "slotLabel": "Plot",
    "paintLabel": "Fence",
    "removeNote": "Remove the weed.",
    "placeNote": "Put the seed packet in the plot.",
    "colorNoteWant": "fence"
  },
  "library3": {
    "keep": [
      {
        "id": "library3-k1",
        "label": "Book",
        "kind": "keep"
      },
      {
        "id": "library3-k2",
        "label": "Bookmark",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "library3-w",
      "label": "Coffee stain",
      "kind": "wrong"
    },
    "decoy": {
      "id": "library3-d",
      "label": "Bookmark ribbon",
      "kind": "decoy"
    },
    "loose": {
      "id": "library3-l",
      "label": "Return slip"
    },
    "slotLabel": "Shelf",
    "paintLabel": "Sign",
    "removeNote": "Remove the coffee stain.",
    "placeNote": "Put the return slip in the shelf.",
    "colorNoteWant": "sign"
  },
  "travel3": {
    "keep": [
      {
        "id": "travel3-k1",
        "label": "Ticket",
        "kind": "keep"
      },
      {
        "id": "travel3-k2",
        "label": "Gate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "travel3-w",
      "label": "Wrong gate",
      "kind": "wrong"
    },
    "decoy": {
      "id": "travel3-d",
      "label": "Suitcase",
      "kind": "decoy"
    },
    "loose": {
      "id": "travel3-l",
      "label": "Boarding pass"
    },
    "slotLabel": "Tray",
    "paintLabel": "Banner",
    "removeNote": "Remove the wrong gate.",
    "placeNote": "Put the boarding pass in the tray.",
    "colorNoteWant": "banner"
  },
  "cooking3": {
    "keep": [
      {
        "id": "cooking3-k1",
        "label": "Pot",
        "kind": "keep"
      },
      {
        "id": "cooking3-k2",
        "label": "Timer",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "cooking3-w",
      "label": "Sponge in pot",
      "kind": "wrong"
    },
    "decoy": {
      "id": "cooking3-d",
      "label": "Lid",
      "kind": "decoy"
    },
    "loose": {
      "id": "cooking3-l",
      "label": "Recipe card"
    },
    "slotLabel": "Trivet",
    "paintLabel": "Apron",
    "removeNote": "Remove the sponge in pot.",
    "placeNote": "Put the recipe card in the trivet.",
    "colorNoteWant": "apron"
  },
  "school3": {
    "keep": [
      {
        "id": "school3-k1",
        "label": "Desk",
        "kind": "keep"
      },
      {
        "id": "school3-k2",
        "label": "Pencil",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "school3-w",
      "label": "Doodle on test",
      "kind": "wrong"
    },
    "decoy": {
      "id": "school3-d",
      "label": "Eraser",
      "kind": "decoy"
    },
    "loose": {
      "id": "school3-l",
      "label": "Homework"
    },
    "slotLabel": "Tray",
    "paintLabel": "Board",
    "removeNote": "Remove the doodle on test.",
    "placeNote": "Put the homework in the tray.",
    "colorNoteWant": "board"
  },
  "clinic3": {
    "keep": [
      {
        "id": "clinic3-k1",
        "label": "Chart",
        "kind": "keep"
      },
      {
        "id": "clinic3-k2",
        "label": "Stethoscope",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "clinic3-w",
      "label": "Band-aid on screen",
      "kind": "wrong"
    },
    "decoy": {
      "id": "clinic3-d",
      "label": "Thermometer",
      "kind": "decoy"
    },
    "loose": {
      "id": "clinic3-l",
      "label": "Patient card"
    },
    "slotLabel": "Slot",
    "paintLabel": "Wall",
    "removeNote": "Remove the band-aid on screen.",
    "placeNote": "Put the patient card in the slot.",
    "colorNoteWant": "wall"
  },
  "studio3": {
    "keep": [
      {
        "id": "studio3-k1",
        "label": "Camera",
        "kind": "keep"
      },
      {
        "id": "studio3-k2",
        "label": "Light",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "studio3-w",
      "label": "Lens cap on",
      "kind": "wrong"
    },
    "decoy": {
      "id": "studio3-d",
      "label": "Tripod",
      "kind": "decoy"
    },
    "loose": {
      "id": "studio3-l",
      "label": "Memory card"
    },
    "slotLabel": "Bay",
    "paintLabel": "Backdrop",
    "removeNote": "Remove the lens cap on.",
    "placeNote": "Put the memory card in the bay.",
    "colorNoteWant": "backdrop"
  },
  "garage3": {
    "keep": [
      {
        "id": "garage3-k1",
        "label": "Car",
        "kind": "keep"
      },
      {
        "id": "garage3-k2",
        "label": "Wrench",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garage3-w",
      "label": "Flat tire icon",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garage3-d",
      "label": "Oil can",
      "kind": "decoy"
    },
    "loose": {
      "id": "garage3-l",
      "label": "Key fob"
    },
    "slotLabel": "Peg",
    "paintLabel": "Door",
    "removeNote": "Remove the flat tire icon.",
    "placeNote": "Put the key fob in the peg.",
    "colorNoteWant": "door"
  },
  "news3": {
    "keep": [
      {
        "id": "news3-k1",
        "label": "Headline",
        "kind": "keep"
      },
      {
        "id": "news3-k2",
        "label": "Byline",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "news3-w",
      "label": "Typo in title",
      "kind": "wrong"
    },
    "decoy": {
      "id": "news3-d",
      "label": "Coffee cup",
      "kind": "decoy"
    },
    "loose": {
      "id": "news3-l",
      "label": "Photo credit"
    },
    "slotLabel": "Slot",
    "paintLabel": "Masthead",
    "removeNote": "Remove the typo in title.",
    "placeNote": "Put the photo credit in the slot.",
    "colorNoteWant": "masthead"
  },
  "podcast3": {
    "keep": [
      {
        "id": "podcast3-k1",
        "label": "Mic",
        "kind": "keep"
      },
      {
        "id": "podcast3-k2",
        "label": "Waveform",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "podcast3-w",
      "label": "Dog barking track",
      "kind": "wrong"
    },
    "decoy": {
      "id": "podcast3-d",
      "label": "Headphones",
      "kind": "decoy"
    },
    "loose": {
      "id": "podcast3-l",
      "label": "Episode art"
    },
    "slotLabel": "Cover",
    "paintLabel": "Player",
    "removeNote": "Remove the dog barking track.",
    "placeNote": "Put the episode art in the cover.",
    "colorNoteWant": "player"
  },
  "budget3": {
    "keep": [
      {
        "id": "budget3-k1",
        "label": "Income",
        "kind": "keep"
      },
      {
        "id": "budget3-k2",
        "label": "Expense",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "budget3-w",
      "label": "Negative lunch fund",
      "kind": "wrong"
    },
    "decoy": {
      "id": "budget3-d",
      "label": "Receipt",
      "kind": "decoy"
    },
    "loose": {
      "id": "budget3-l",
      "label": "Savings jar"
    },
    "slotLabel": "Tray",
    "paintLabel": "Chart",
    "removeNote": "Remove the negative lunch fund.",
    "placeNote": "Put the savings jar in the tray.",
    "colorNoteWant": "chart"
  },
  "hike3": {
    "keep": [
      {
        "id": "hike3-k1",
        "label": "Trail",
        "kind": "keep"
      },
      {
        "id": "hike3-k2",
        "label": "Boots",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "hike3-w",
      "label": "Sign pointing wrong way",
      "kind": "wrong"
    },
    "decoy": {
      "id": "hike3-d",
      "label": "Flask",
      "kind": "decoy"
    },
    "loose": {
      "id": "hike3-l",
      "label": "Map fold"
    },
    "slotLabel": "Pocket",
    "paintLabel": "Sky",
    "removeNote": "Remove the sign pointing wrong way.",
    "placeNote": "Put the map fold in the pocket.",
    "colorNoteWant": "sky"
  },
  "bakery3": {
    "keep": [
      {
        "id": "bakery3-k1",
        "label": "Loaf",
        "kind": "keep"
      },
      {
        "id": "bakery3-k2",
        "label": "Oven",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "bakery3-w",
      "label": "Raw dough on shelf",
      "kind": "wrong"
    },
    "decoy": {
      "id": "bakery3-d",
      "label": "Whisk",
      "kind": "decoy"
    },
    "loose": {
      "id": "bakery3-l",
      "label": "Order slip"
    },
    "slotLabel": "Counter",
    "paintLabel": "Apron",
    "removeNote": "Remove the raw dough on shelf.",
    "placeNote": "Put the order slip in the counter.",
    "colorNoteWant": "apron"
  },
  "theater3": {
    "keep": [
      {
        "id": "theater3-k1",
        "label": "Stage",
        "kind": "keep"
      },
      {
        "id": "theater3-k2",
        "label": "Curtain",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "theater3-w",
      "label": "Spotlight on empty seat",
      "kind": "wrong"
    },
    "decoy": {
      "id": "theater3-d",
      "label": "Program",
      "kind": "decoy"
    },
    "loose": {
      "id": "theater3-l",
      "label": "Ticket stub"
    },
    "slotLabel": "Seat",
    "paintLabel": "Banner",
    "removeNote": "Remove the spotlight on empty seat.",
    "placeNote": "Put the ticket stub in the seat.",
    "colorNoteWant": "banner"
  },
  "museum3": {
    "keep": [
      {
        "id": "museum3-k1",
        "label": "Plaque",
        "kind": "keep"
      },
      {
        "id": "museum3-k2",
        "label": "Artifact",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "museum3-w",
      "label": "Price tag on statue",
      "kind": "wrong"
    },
    "decoy": {
      "id": "museum3-d",
      "label": "Brochure",
      "kind": "decoy"
    },
    "loose": {
      "id": "museum3-l",
      "label": "Audio guide"
    },
    "slotLabel": "Stand",
    "paintLabel": "Wall",
    "removeNote": "Remove the price tag on statue.",
    "placeNote": "Put the audio guide in the stand.",
    "colorNoteWant": "wall"
  },
  "farm3": {
    "keep": [
      {
        "id": "farm3-k1",
        "label": "Barn",
        "kind": "keep"
      },
      {
        "id": "farm3-k2",
        "label": "Tractor",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "farm3-w",
      "label": "Chicken in cab",
      "kind": "wrong"
    },
    "decoy": {
      "id": "farm3-d",
      "label": "Hay bale",
      "kind": "decoy"
    },
    "loose": {
      "id": "farm3-l",
      "label": "Feed bag"
    },
    "slotLabel": "Hook",
    "paintLabel": "Sign",
    "removeNote": "Remove the chicken in cab.",
    "placeNote": "Put the feed bag in the hook.",
    "colorNoteWant": "sign"
  },
  "beach3": {
    "keep": [
      {
        "id": "beach3-k1",
        "label": "Umbrella",
        "kind": "keep"
      },
      {
        "id": "beach3-k2",
        "label": "Towel",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "beach3-w",
      "label": "Snow on sand",
      "kind": "wrong"
    },
    "decoy": {
      "id": "beach3-d",
      "label": "Cooler",
      "kind": "decoy"
    },
    "loose": {
      "id": "beach3-l",
      "label": "Sandcastle flag"
    },
    "slotLabel": "Pole",
    "paintLabel": "Sky",
    "removeNote": "Remove the snow on sand.",
    "placeNote": "Put the sandcastle flag in the pole.",
    "colorNoteWant": "sky"
  },
  "office3": {
    "keep": [
      {
        "id": "office3-k1",
        "label": "Inbox",
        "kind": "keep"
      },
      {
        "id": "office3-k2",
        "label": "Calendar",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "office3-w",
      "label": "Meeting at 3 AM",
      "kind": "wrong"
    },
    "decoy": {
      "id": "office3-d",
      "label": "Stapler",
      "kind": "decoy"
    },
    "loose": {
      "id": "office3-l",
      "label": "Name plate"
    },
    "slotLabel": "Desk",
    "paintLabel": "Wall",
    "removeNote": "Remove the meeting at 3 am.",
    "placeNote": "Put the name plate in the desk.",
    "colorNoteWant": "wall"
  },
  "calendar4": {
    "keep": [
      {
        "id": "calendar4-k1",
        "label": "Event",
        "kind": "keep"
      },
      {
        "id": "calendar4-k2",
        "label": "Reminder",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "calendar4-w",
      "label": "Wrong date",
      "kind": "wrong"
    },
    "decoy": {
      "id": "calendar4-d",
      "label": "Sticker",
      "kind": "decoy"
    },
    "loose": {
      "id": "calendar4-l",
      "label": "Invite card"
    },
    "slotLabel": "Pin board",
    "paintLabel": "Header",
    "removeNote": "Remove the wrong date.",
    "placeNote": "Put the invite card in the pin board.",
    "colorNoteWant": "header"
  },
  "fitness4": {
    "keep": [
      {
        "id": "fitness4-k1",
        "label": "Steps",
        "kind": "keep"
      },
      {
        "id": "fitness4-k2",
        "label": "Heart rate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "fitness4-w",
      "label": "999999 steps",
      "kind": "wrong"
    },
    "decoy": {
      "id": "fitness4-d",
      "label": "Water bottle",
      "kind": "decoy"
    },
    "loose": {
      "id": "fitness4-l",
      "label": "Towel"
    },
    "slotLabel": "Hook",
    "paintLabel": "Chart",
    "removeNote": "Remove the 999999 steps.",
    "placeNote": "Put the towel in the hook.",
    "colorNoteWant": "chart"
  },
  "garden4": {
    "keep": [
      {
        "id": "garden4-k1",
        "label": "Tomato",
        "kind": "keep"
      },
      {
        "id": "garden4-k2",
        "label": "Water can",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garden4-w",
      "label": "Weed",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garden4-d",
      "label": "Gnome",
      "kind": "decoy"
    },
    "loose": {
      "id": "garden4-l",
      "label": "Seed packet"
    },
    "slotLabel": "Plot",
    "paintLabel": "Fence",
    "removeNote": "Remove the weed.",
    "placeNote": "Put the seed packet in the plot.",
    "colorNoteWant": "fence"
  },
  "library4": {
    "keep": [
      {
        "id": "library4-k1",
        "label": "Book",
        "kind": "keep"
      },
      {
        "id": "library4-k2",
        "label": "Bookmark",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "library4-w",
      "label": "Coffee stain",
      "kind": "wrong"
    },
    "decoy": {
      "id": "library4-d",
      "label": "Bookmark ribbon",
      "kind": "decoy"
    },
    "loose": {
      "id": "library4-l",
      "label": "Return slip"
    },
    "slotLabel": "Shelf",
    "paintLabel": "Sign",
    "removeNote": "Remove the coffee stain.",
    "placeNote": "Put the return slip in the shelf.",
    "colorNoteWant": "sign"
  },
  "travel4": {
    "keep": [
      {
        "id": "travel4-k1",
        "label": "Ticket",
        "kind": "keep"
      },
      {
        "id": "travel4-k2",
        "label": "Gate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "travel4-w",
      "label": "Wrong gate",
      "kind": "wrong"
    },
    "decoy": {
      "id": "travel4-d",
      "label": "Suitcase",
      "kind": "decoy"
    },
    "loose": {
      "id": "travel4-l",
      "label": "Boarding pass"
    },
    "slotLabel": "Tray",
    "paintLabel": "Banner",
    "removeNote": "Remove the wrong gate.",
    "placeNote": "Put the boarding pass in the tray.",
    "colorNoteWant": "banner"
  },
  "cooking4": {
    "keep": [
      {
        "id": "cooking4-k1",
        "label": "Pot",
        "kind": "keep"
      },
      {
        "id": "cooking4-k2",
        "label": "Timer",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "cooking4-w",
      "label": "Sponge in pot",
      "kind": "wrong"
    },
    "decoy": {
      "id": "cooking4-d",
      "label": "Lid",
      "kind": "decoy"
    },
    "loose": {
      "id": "cooking4-l",
      "label": "Recipe card"
    },
    "slotLabel": "Trivet",
    "paintLabel": "Apron",
    "removeNote": "Remove the sponge in pot.",
    "placeNote": "Put the recipe card in the trivet.",
    "colorNoteWant": "apron"
  },
  "school4": {
    "keep": [
      {
        "id": "school4-k1",
        "label": "Desk",
        "kind": "keep"
      },
      {
        "id": "school4-k2",
        "label": "Pencil",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "school4-w",
      "label": "Doodle on test",
      "kind": "wrong"
    },
    "decoy": {
      "id": "school4-d",
      "label": "Eraser",
      "kind": "decoy"
    },
    "loose": {
      "id": "school4-l",
      "label": "Homework"
    },
    "slotLabel": "Tray",
    "paintLabel": "Board",
    "removeNote": "Remove the doodle on test.",
    "placeNote": "Put the homework in the tray.",
    "colorNoteWant": "board"
  },
  "clinic4": {
    "keep": [
      {
        "id": "clinic4-k1",
        "label": "Chart",
        "kind": "keep"
      },
      {
        "id": "clinic4-k2",
        "label": "Stethoscope",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "clinic4-w",
      "label": "Band-aid on screen",
      "kind": "wrong"
    },
    "decoy": {
      "id": "clinic4-d",
      "label": "Thermometer",
      "kind": "decoy"
    },
    "loose": {
      "id": "clinic4-l",
      "label": "Patient card"
    },
    "slotLabel": "Slot",
    "paintLabel": "Wall",
    "removeNote": "Remove the band-aid on screen.",
    "placeNote": "Put the patient card in the slot.",
    "colorNoteWant": "wall"
  },
  "studio4": {
    "keep": [
      {
        "id": "studio4-k1",
        "label": "Camera",
        "kind": "keep"
      },
      {
        "id": "studio4-k2",
        "label": "Light",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "studio4-w",
      "label": "Lens cap on",
      "kind": "wrong"
    },
    "decoy": {
      "id": "studio4-d",
      "label": "Tripod",
      "kind": "decoy"
    },
    "loose": {
      "id": "studio4-l",
      "label": "Memory card"
    },
    "slotLabel": "Bay",
    "paintLabel": "Backdrop",
    "removeNote": "Remove the lens cap on.",
    "placeNote": "Put the memory card in the bay.",
    "colorNoteWant": "backdrop"
  },
  "garage4": {
    "keep": [
      {
        "id": "garage4-k1",
        "label": "Car",
        "kind": "keep"
      },
      {
        "id": "garage4-k2",
        "label": "Wrench",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garage4-w",
      "label": "Flat tire icon",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garage4-d",
      "label": "Oil can",
      "kind": "decoy"
    },
    "loose": {
      "id": "garage4-l",
      "label": "Key fob"
    },
    "slotLabel": "Peg",
    "paintLabel": "Door",
    "removeNote": "Remove the flat tire icon.",
    "placeNote": "Put the key fob in the peg.",
    "colorNoteWant": "door"
  },
  "news4": {
    "keep": [
      {
        "id": "news4-k1",
        "label": "Headline",
        "kind": "keep"
      },
      {
        "id": "news4-k2",
        "label": "Byline",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "news4-w",
      "label": "Typo in title",
      "kind": "wrong"
    },
    "decoy": {
      "id": "news4-d",
      "label": "Coffee cup",
      "kind": "decoy"
    },
    "loose": {
      "id": "news4-l",
      "label": "Photo credit"
    },
    "slotLabel": "Slot",
    "paintLabel": "Masthead",
    "removeNote": "Remove the typo in title.",
    "placeNote": "Put the photo credit in the slot.",
    "colorNoteWant": "masthead"
  },
  "podcast4": {
    "keep": [
      {
        "id": "podcast4-k1",
        "label": "Mic",
        "kind": "keep"
      },
      {
        "id": "podcast4-k2",
        "label": "Waveform",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "podcast4-w",
      "label": "Dog barking track",
      "kind": "wrong"
    },
    "decoy": {
      "id": "podcast4-d",
      "label": "Headphones",
      "kind": "decoy"
    },
    "loose": {
      "id": "podcast4-l",
      "label": "Episode art"
    },
    "slotLabel": "Cover",
    "paintLabel": "Player",
    "removeNote": "Remove the dog barking track.",
    "placeNote": "Put the episode art in the cover.",
    "colorNoteWant": "player"
  },
  "budget4": {
    "keep": [
      {
        "id": "budget4-k1",
        "label": "Income",
        "kind": "keep"
      },
      {
        "id": "budget4-k2",
        "label": "Expense",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "budget4-w",
      "label": "Negative lunch fund",
      "kind": "wrong"
    },
    "decoy": {
      "id": "budget4-d",
      "label": "Receipt",
      "kind": "decoy"
    },
    "loose": {
      "id": "budget4-l",
      "label": "Savings jar"
    },
    "slotLabel": "Tray",
    "paintLabel": "Chart",
    "removeNote": "Remove the negative lunch fund.",
    "placeNote": "Put the savings jar in the tray.",
    "colorNoteWant": "chart"
  },
  "hike4": {
    "keep": [
      {
        "id": "hike4-k1",
        "label": "Trail",
        "kind": "keep"
      },
      {
        "id": "hike4-k2",
        "label": "Boots",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "hike4-w",
      "label": "Sign pointing wrong way",
      "kind": "wrong"
    },
    "decoy": {
      "id": "hike4-d",
      "label": "Flask",
      "kind": "decoy"
    },
    "loose": {
      "id": "hike4-l",
      "label": "Map fold"
    },
    "slotLabel": "Pocket",
    "paintLabel": "Sky",
    "removeNote": "Remove the sign pointing wrong way.",
    "placeNote": "Put the map fold in the pocket.",
    "colorNoteWant": "sky"
  },
  "bakery4": {
    "keep": [
      {
        "id": "bakery4-k1",
        "label": "Loaf",
        "kind": "keep"
      },
      {
        "id": "bakery4-k2",
        "label": "Oven",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "bakery4-w",
      "label": "Raw dough on shelf",
      "kind": "wrong"
    },
    "decoy": {
      "id": "bakery4-d",
      "label": "Whisk",
      "kind": "decoy"
    },
    "loose": {
      "id": "bakery4-l",
      "label": "Order slip"
    },
    "slotLabel": "Counter",
    "paintLabel": "Apron",
    "removeNote": "Remove the raw dough on shelf.",
    "placeNote": "Put the order slip in the counter.",
    "colorNoteWant": "apron"
  },
  "theater4": {
    "keep": [
      {
        "id": "theater4-k1",
        "label": "Stage",
        "kind": "keep"
      },
      {
        "id": "theater4-k2",
        "label": "Curtain",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "theater4-w",
      "label": "Spotlight on empty seat",
      "kind": "wrong"
    },
    "decoy": {
      "id": "theater4-d",
      "label": "Program",
      "kind": "decoy"
    },
    "loose": {
      "id": "theater4-l",
      "label": "Ticket stub"
    },
    "slotLabel": "Seat",
    "paintLabel": "Banner",
    "removeNote": "Remove the spotlight on empty seat.",
    "placeNote": "Put the ticket stub in the seat.",
    "colorNoteWant": "banner"
  },
  "museum4": {
    "keep": [
      {
        "id": "museum4-k1",
        "label": "Plaque",
        "kind": "keep"
      },
      {
        "id": "museum4-k2",
        "label": "Artifact",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "museum4-w",
      "label": "Price tag on statue",
      "kind": "wrong"
    },
    "decoy": {
      "id": "museum4-d",
      "label": "Brochure",
      "kind": "decoy"
    },
    "loose": {
      "id": "museum4-l",
      "label": "Audio guide"
    },
    "slotLabel": "Stand",
    "paintLabel": "Wall",
    "removeNote": "Remove the price tag on statue.",
    "placeNote": "Put the audio guide in the stand.",
    "colorNoteWant": "wall"
  },
  "farm4": {
    "keep": [
      {
        "id": "farm4-k1",
        "label": "Barn",
        "kind": "keep"
      },
      {
        "id": "farm4-k2",
        "label": "Tractor",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "farm4-w",
      "label": "Chicken in cab",
      "kind": "wrong"
    },
    "decoy": {
      "id": "farm4-d",
      "label": "Hay bale",
      "kind": "decoy"
    },
    "loose": {
      "id": "farm4-l",
      "label": "Feed bag"
    },
    "slotLabel": "Hook",
    "paintLabel": "Sign",
    "removeNote": "Remove the chicken in cab.",
    "placeNote": "Put the feed bag in the hook.",
    "colorNoteWant": "sign"
  },
  "beach4": {
    "keep": [
      {
        "id": "beach4-k1",
        "label": "Umbrella",
        "kind": "keep"
      },
      {
        "id": "beach4-k2",
        "label": "Towel",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "beach4-w",
      "label": "Snow on sand",
      "kind": "wrong"
    },
    "decoy": {
      "id": "beach4-d",
      "label": "Cooler",
      "kind": "decoy"
    },
    "loose": {
      "id": "beach4-l",
      "label": "Sandcastle flag"
    },
    "slotLabel": "Pole",
    "paintLabel": "Sky",
    "removeNote": "Remove the snow on sand.",
    "placeNote": "Put the sandcastle flag in the pole.",
    "colorNoteWant": "sky"
  },
  "office4": {
    "keep": [
      {
        "id": "office4-k1",
        "label": "Inbox",
        "kind": "keep"
      },
      {
        "id": "office4-k2",
        "label": "Calendar",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "office4-w",
      "label": "Meeting at 3 AM",
      "kind": "wrong"
    },
    "decoy": {
      "id": "office4-d",
      "label": "Stapler",
      "kind": "decoy"
    },
    "loose": {
      "id": "office4-l",
      "label": "Name plate"
    },
    "slotLabel": "Desk",
    "paintLabel": "Wall",
    "removeNote": "Remove the meeting at 3 am.",
    "placeNote": "Put the name plate in the desk.",
    "colorNoteWant": "wall"
  },
  "calendar5": {
    "keep": [
      {
        "id": "calendar5-k1",
        "label": "Event",
        "kind": "keep"
      },
      {
        "id": "calendar5-k2",
        "label": "Reminder",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "calendar5-w",
      "label": "Wrong date",
      "kind": "wrong"
    },
    "decoy": {
      "id": "calendar5-d",
      "label": "Sticker",
      "kind": "decoy"
    },
    "loose": {
      "id": "calendar5-l",
      "label": "Invite card"
    },
    "slotLabel": "Pin board",
    "paintLabel": "Header",
    "removeNote": "Remove the wrong date.",
    "placeNote": "Put the invite card in the pin board.",
    "colorNoteWant": "header"
  },
  "fitness5": {
    "keep": [
      {
        "id": "fitness5-k1",
        "label": "Steps",
        "kind": "keep"
      },
      {
        "id": "fitness5-k2",
        "label": "Heart rate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "fitness5-w",
      "label": "999999 steps",
      "kind": "wrong"
    },
    "decoy": {
      "id": "fitness5-d",
      "label": "Water bottle",
      "kind": "decoy"
    },
    "loose": {
      "id": "fitness5-l",
      "label": "Towel"
    },
    "slotLabel": "Hook",
    "paintLabel": "Chart",
    "removeNote": "Remove the 999999 steps.",
    "placeNote": "Put the towel in the hook.",
    "colorNoteWant": "chart"
  },
  "garden5": {
    "keep": [
      {
        "id": "garden5-k1",
        "label": "Tomato",
        "kind": "keep"
      },
      {
        "id": "garden5-k2",
        "label": "Water can",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garden5-w",
      "label": "Weed",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garden5-d",
      "label": "Gnome",
      "kind": "decoy"
    },
    "loose": {
      "id": "garden5-l",
      "label": "Seed packet"
    },
    "slotLabel": "Plot",
    "paintLabel": "Fence",
    "removeNote": "Remove the weed.",
    "placeNote": "Put the seed packet in the plot.",
    "colorNoteWant": "fence"
  },
  "library5": {
    "keep": [
      {
        "id": "library5-k1",
        "label": "Book",
        "kind": "keep"
      },
      {
        "id": "library5-k2",
        "label": "Bookmark",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "library5-w",
      "label": "Coffee stain",
      "kind": "wrong"
    },
    "decoy": {
      "id": "library5-d",
      "label": "Bookmark ribbon",
      "kind": "decoy"
    },
    "loose": {
      "id": "library5-l",
      "label": "Return slip"
    },
    "slotLabel": "Shelf",
    "paintLabel": "Sign",
    "removeNote": "Remove the coffee stain.",
    "placeNote": "Put the return slip in the shelf.",
    "colorNoteWant": "sign"
  },
  "travel5": {
    "keep": [
      {
        "id": "travel5-k1",
        "label": "Ticket",
        "kind": "keep"
      },
      {
        "id": "travel5-k2",
        "label": "Gate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "travel5-w",
      "label": "Wrong gate",
      "kind": "wrong"
    },
    "decoy": {
      "id": "travel5-d",
      "label": "Suitcase",
      "kind": "decoy"
    },
    "loose": {
      "id": "travel5-l",
      "label": "Boarding pass"
    },
    "slotLabel": "Tray",
    "paintLabel": "Banner",
    "removeNote": "Remove the wrong gate.",
    "placeNote": "Put the boarding pass in the tray.",
    "colorNoteWant": "banner"
  },
  "cooking5": {
    "keep": [
      {
        "id": "cooking5-k1",
        "label": "Pot",
        "kind": "keep"
      },
      {
        "id": "cooking5-k2",
        "label": "Timer",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "cooking5-w",
      "label": "Sponge in pot",
      "kind": "wrong"
    },
    "decoy": {
      "id": "cooking5-d",
      "label": "Lid",
      "kind": "decoy"
    },
    "loose": {
      "id": "cooking5-l",
      "label": "Recipe card"
    },
    "slotLabel": "Trivet",
    "paintLabel": "Apron",
    "removeNote": "Remove the sponge in pot.",
    "placeNote": "Put the recipe card in the trivet.",
    "colorNoteWant": "apron"
  },
  "school5": {
    "keep": [
      {
        "id": "school5-k1",
        "label": "Desk",
        "kind": "keep"
      },
      {
        "id": "school5-k2",
        "label": "Pencil",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "school5-w",
      "label": "Doodle on test",
      "kind": "wrong"
    },
    "decoy": {
      "id": "school5-d",
      "label": "Eraser",
      "kind": "decoy"
    },
    "loose": {
      "id": "school5-l",
      "label": "Homework"
    },
    "slotLabel": "Tray",
    "paintLabel": "Board",
    "removeNote": "Remove the doodle on test.",
    "placeNote": "Put the homework in the tray.",
    "colorNoteWant": "board"
  },
  "clinic5": {
    "keep": [
      {
        "id": "clinic5-k1",
        "label": "Chart",
        "kind": "keep"
      },
      {
        "id": "clinic5-k2",
        "label": "Stethoscope",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "clinic5-w",
      "label": "Band-aid on screen",
      "kind": "wrong"
    },
    "decoy": {
      "id": "clinic5-d",
      "label": "Thermometer",
      "kind": "decoy"
    },
    "loose": {
      "id": "clinic5-l",
      "label": "Patient card"
    },
    "slotLabel": "Slot",
    "paintLabel": "Wall",
    "removeNote": "Remove the band-aid on screen.",
    "placeNote": "Put the patient card in the slot.",
    "colorNoteWant": "wall"
  },
  "studio5": {
    "keep": [
      {
        "id": "studio5-k1",
        "label": "Camera",
        "kind": "keep"
      },
      {
        "id": "studio5-k2",
        "label": "Light",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "studio5-w",
      "label": "Lens cap on",
      "kind": "wrong"
    },
    "decoy": {
      "id": "studio5-d",
      "label": "Tripod",
      "kind": "decoy"
    },
    "loose": {
      "id": "studio5-l",
      "label": "Memory card"
    },
    "slotLabel": "Bay",
    "paintLabel": "Backdrop",
    "removeNote": "Remove the lens cap on.",
    "placeNote": "Put the memory card in the bay.",
    "colorNoteWant": "backdrop"
  },
  "garage5": {
    "keep": [
      {
        "id": "garage5-k1",
        "label": "Car",
        "kind": "keep"
      },
      {
        "id": "garage5-k2",
        "label": "Wrench",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garage5-w",
      "label": "Flat tire icon",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garage5-d",
      "label": "Oil can",
      "kind": "decoy"
    },
    "loose": {
      "id": "garage5-l",
      "label": "Key fob"
    },
    "slotLabel": "Peg",
    "paintLabel": "Door",
    "removeNote": "Remove the flat tire icon.",
    "placeNote": "Put the key fob in the peg.",
    "colorNoteWant": "door"
  },
  "news5": {
    "keep": [
      {
        "id": "news5-k1",
        "label": "Headline",
        "kind": "keep"
      },
      {
        "id": "news5-k2",
        "label": "Byline",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "news5-w",
      "label": "Typo in title",
      "kind": "wrong"
    },
    "decoy": {
      "id": "news5-d",
      "label": "Coffee cup",
      "kind": "decoy"
    },
    "loose": {
      "id": "news5-l",
      "label": "Photo credit"
    },
    "slotLabel": "Slot",
    "paintLabel": "Masthead",
    "removeNote": "Remove the typo in title.",
    "placeNote": "Put the photo credit in the slot.",
    "colorNoteWant": "masthead"
  },
  "podcast5": {
    "keep": [
      {
        "id": "podcast5-k1",
        "label": "Mic",
        "kind": "keep"
      },
      {
        "id": "podcast5-k2",
        "label": "Waveform",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "podcast5-w",
      "label": "Dog barking track",
      "kind": "wrong"
    },
    "decoy": {
      "id": "podcast5-d",
      "label": "Headphones",
      "kind": "decoy"
    },
    "loose": {
      "id": "podcast5-l",
      "label": "Episode art"
    },
    "slotLabel": "Cover",
    "paintLabel": "Player",
    "removeNote": "Remove the dog barking track.",
    "placeNote": "Put the episode art in the cover.",
    "colorNoteWant": "player"
  },
  "budget5": {
    "keep": [
      {
        "id": "budget5-k1",
        "label": "Income",
        "kind": "keep"
      },
      {
        "id": "budget5-k2",
        "label": "Expense",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "budget5-w",
      "label": "Negative lunch fund",
      "kind": "wrong"
    },
    "decoy": {
      "id": "budget5-d",
      "label": "Receipt",
      "kind": "decoy"
    },
    "loose": {
      "id": "budget5-l",
      "label": "Savings jar"
    },
    "slotLabel": "Tray",
    "paintLabel": "Chart",
    "removeNote": "Remove the negative lunch fund.",
    "placeNote": "Put the savings jar in the tray.",
    "colorNoteWant": "chart"
  },
  "hike5": {
    "keep": [
      {
        "id": "hike5-k1",
        "label": "Trail",
        "kind": "keep"
      },
      {
        "id": "hike5-k2",
        "label": "Boots",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "hike5-w",
      "label": "Sign pointing wrong way",
      "kind": "wrong"
    },
    "decoy": {
      "id": "hike5-d",
      "label": "Flask",
      "kind": "decoy"
    },
    "loose": {
      "id": "hike5-l",
      "label": "Map fold"
    },
    "slotLabel": "Pocket",
    "paintLabel": "Sky",
    "removeNote": "Remove the sign pointing wrong way.",
    "placeNote": "Put the map fold in the pocket.",
    "colorNoteWant": "sky"
  },
  "bakery5": {
    "keep": [
      {
        "id": "bakery5-k1",
        "label": "Loaf",
        "kind": "keep"
      },
      {
        "id": "bakery5-k2",
        "label": "Oven",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "bakery5-w",
      "label": "Raw dough on shelf",
      "kind": "wrong"
    },
    "decoy": {
      "id": "bakery5-d",
      "label": "Whisk",
      "kind": "decoy"
    },
    "loose": {
      "id": "bakery5-l",
      "label": "Order slip"
    },
    "slotLabel": "Counter",
    "paintLabel": "Apron",
    "removeNote": "Remove the raw dough on shelf.",
    "placeNote": "Put the order slip in the counter.",
    "colorNoteWant": "apron"
  },
  "theater5": {
    "keep": [
      {
        "id": "theater5-k1",
        "label": "Stage",
        "kind": "keep"
      },
      {
        "id": "theater5-k2",
        "label": "Curtain",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "theater5-w",
      "label": "Spotlight on empty seat",
      "kind": "wrong"
    },
    "decoy": {
      "id": "theater5-d",
      "label": "Program",
      "kind": "decoy"
    },
    "loose": {
      "id": "theater5-l",
      "label": "Ticket stub"
    },
    "slotLabel": "Seat",
    "paintLabel": "Banner",
    "removeNote": "Remove the spotlight on empty seat.",
    "placeNote": "Put the ticket stub in the seat.",
    "colorNoteWant": "banner"
  },
  "museum5": {
    "keep": [
      {
        "id": "museum5-k1",
        "label": "Plaque",
        "kind": "keep"
      },
      {
        "id": "museum5-k2",
        "label": "Artifact",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "museum5-w",
      "label": "Price tag on statue",
      "kind": "wrong"
    },
    "decoy": {
      "id": "museum5-d",
      "label": "Brochure",
      "kind": "decoy"
    },
    "loose": {
      "id": "museum5-l",
      "label": "Audio guide"
    },
    "slotLabel": "Stand",
    "paintLabel": "Wall",
    "removeNote": "Remove the price tag on statue.",
    "placeNote": "Put the audio guide in the stand.",
    "colorNoteWant": "wall"
  },
  "farm5": {
    "keep": [
      {
        "id": "farm5-k1",
        "label": "Barn",
        "kind": "keep"
      },
      {
        "id": "farm5-k2",
        "label": "Tractor",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "farm5-w",
      "label": "Chicken in cab",
      "kind": "wrong"
    },
    "decoy": {
      "id": "farm5-d",
      "label": "Hay bale",
      "kind": "decoy"
    },
    "loose": {
      "id": "farm5-l",
      "label": "Feed bag"
    },
    "slotLabel": "Hook",
    "paintLabel": "Sign",
    "removeNote": "Remove the chicken in cab.",
    "placeNote": "Put the feed bag in the hook.",
    "colorNoteWant": "sign"
  },
  "beach5": {
    "keep": [
      {
        "id": "beach5-k1",
        "label": "Umbrella",
        "kind": "keep"
      },
      {
        "id": "beach5-k2",
        "label": "Towel",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "beach5-w",
      "label": "Snow on sand",
      "kind": "wrong"
    },
    "decoy": {
      "id": "beach5-d",
      "label": "Cooler",
      "kind": "decoy"
    },
    "loose": {
      "id": "beach5-l",
      "label": "Sandcastle flag"
    },
    "slotLabel": "Pole",
    "paintLabel": "Sky",
    "removeNote": "Remove the snow on sand.",
    "placeNote": "Put the sandcastle flag in the pole.",
    "colorNoteWant": "sky"
  },
  "office5": {
    "keep": [
      {
        "id": "office5-k1",
        "label": "Inbox",
        "kind": "keep"
      },
      {
        "id": "office5-k2",
        "label": "Calendar",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "office5-w",
      "label": "Meeting at 3 AM",
      "kind": "wrong"
    },
    "decoy": {
      "id": "office5-d",
      "label": "Stapler",
      "kind": "decoy"
    },
    "loose": {
      "id": "office5-l",
      "label": "Name plate"
    },
    "slotLabel": "Desk",
    "paintLabel": "Wall",
    "removeNote": "Remove the meeting at 3 am.",
    "placeNote": "Put the name plate in the desk.",
    "colorNoteWant": "wall"
  },
  "calendar6": {
    "keep": [
      {
        "id": "calendar6-k1",
        "label": "Event",
        "kind": "keep"
      },
      {
        "id": "calendar6-k2",
        "label": "Reminder",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "calendar6-w",
      "label": "Wrong date",
      "kind": "wrong"
    },
    "decoy": {
      "id": "calendar6-d",
      "label": "Sticker",
      "kind": "decoy"
    },
    "loose": {
      "id": "calendar6-l",
      "label": "Invite card"
    },
    "slotLabel": "Pin board",
    "paintLabel": "Header",
    "removeNote": "Remove the wrong date.",
    "placeNote": "Put the invite card in the pin board.",
    "colorNoteWant": "header"
  },
  "fitness6": {
    "keep": [
      {
        "id": "fitness6-k1",
        "label": "Steps",
        "kind": "keep"
      },
      {
        "id": "fitness6-k2",
        "label": "Heart rate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "fitness6-w",
      "label": "999999 steps",
      "kind": "wrong"
    },
    "decoy": {
      "id": "fitness6-d",
      "label": "Water bottle",
      "kind": "decoy"
    },
    "loose": {
      "id": "fitness6-l",
      "label": "Towel"
    },
    "slotLabel": "Hook",
    "paintLabel": "Chart",
    "removeNote": "Remove the 999999 steps.",
    "placeNote": "Put the towel in the hook.",
    "colorNoteWant": "chart"
  },
  "garden6": {
    "keep": [
      {
        "id": "garden6-k1",
        "label": "Tomato",
        "kind": "keep"
      },
      {
        "id": "garden6-k2",
        "label": "Water can",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garden6-w",
      "label": "Weed",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garden6-d",
      "label": "Gnome",
      "kind": "decoy"
    },
    "loose": {
      "id": "garden6-l",
      "label": "Seed packet"
    },
    "slotLabel": "Plot",
    "paintLabel": "Fence",
    "removeNote": "Remove the weed.",
    "placeNote": "Put the seed packet in the plot.",
    "colorNoteWant": "fence"
  },
  "library6": {
    "keep": [
      {
        "id": "library6-k1",
        "label": "Book",
        "kind": "keep"
      },
      {
        "id": "library6-k2",
        "label": "Bookmark",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "library6-w",
      "label": "Coffee stain",
      "kind": "wrong"
    },
    "decoy": {
      "id": "library6-d",
      "label": "Bookmark ribbon",
      "kind": "decoy"
    },
    "loose": {
      "id": "library6-l",
      "label": "Return slip"
    },
    "slotLabel": "Shelf",
    "paintLabel": "Sign",
    "removeNote": "Remove the coffee stain.",
    "placeNote": "Put the return slip in the shelf.",
    "colorNoteWant": "sign"
  },
  "travel6": {
    "keep": [
      {
        "id": "travel6-k1",
        "label": "Ticket",
        "kind": "keep"
      },
      {
        "id": "travel6-k2",
        "label": "Gate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "travel6-w",
      "label": "Wrong gate",
      "kind": "wrong"
    },
    "decoy": {
      "id": "travel6-d",
      "label": "Suitcase",
      "kind": "decoy"
    },
    "loose": {
      "id": "travel6-l",
      "label": "Boarding pass"
    },
    "slotLabel": "Tray",
    "paintLabel": "Banner",
    "removeNote": "Remove the wrong gate.",
    "placeNote": "Put the boarding pass in the tray.",
    "colorNoteWant": "banner"
  },
  "cooking6": {
    "keep": [
      {
        "id": "cooking6-k1",
        "label": "Pot",
        "kind": "keep"
      },
      {
        "id": "cooking6-k2",
        "label": "Timer",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "cooking6-w",
      "label": "Sponge in pot",
      "kind": "wrong"
    },
    "decoy": {
      "id": "cooking6-d",
      "label": "Lid",
      "kind": "decoy"
    },
    "loose": {
      "id": "cooking6-l",
      "label": "Recipe card"
    },
    "slotLabel": "Trivet",
    "paintLabel": "Apron",
    "removeNote": "Remove the sponge in pot.",
    "placeNote": "Put the recipe card in the trivet.",
    "colorNoteWant": "apron"
  },
  "school6": {
    "keep": [
      {
        "id": "school6-k1",
        "label": "Desk",
        "kind": "keep"
      },
      {
        "id": "school6-k2",
        "label": "Pencil",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "school6-w",
      "label": "Doodle on test",
      "kind": "wrong"
    },
    "decoy": {
      "id": "school6-d",
      "label": "Eraser",
      "kind": "decoy"
    },
    "loose": {
      "id": "school6-l",
      "label": "Homework"
    },
    "slotLabel": "Tray",
    "paintLabel": "Board",
    "removeNote": "Remove the doodle on test.",
    "placeNote": "Put the homework in the tray.",
    "colorNoteWant": "board"
  },
  "clinic6": {
    "keep": [
      {
        "id": "clinic6-k1",
        "label": "Chart",
        "kind": "keep"
      },
      {
        "id": "clinic6-k2",
        "label": "Stethoscope",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "clinic6-w",
      "label": "Band-aid on screen",
      "kind": "wrong"
    },
    "decoy": {
      "id": "clinic6-d",
      "label": "Thermometer",
      "kind": "decoy"
    },
    "loose": {
      "id": "clinic6-l",
      "label": "Patient card"
    },
    "slotLabel": "Slot",
    "paintLabel": "Wall",
    "removeNote": "Remove the band-aid on screen.",
    "placeNote": "Put the patient card in the slot.",
    "colorNoteWant": "wall"
  },
  "studio6": {
    "keep": [
      {
        "id": "studio6-k1",
        "label": "Camera",
        "kind": "keep"
      },
      {
        "id": "studio6-k2",
        "label": "Light",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "studio6-w",
      "label": "Lens cap on",
      "kind": "wrong"
    },
    "decoy": {
      "id": "studio6-d",
      "label": "Tripod",
      "kind": "decoy"
    },
    "loose": {
      "id": "studio6-l",
      "label": "Memory card"
    },
    "slotLabel": "Bay",
    "paintLabel": "Backdrop",
    "removeNote": "Remove the lens cap on.",
    "placeNote": "Put the memory card in the bay.",
    "colorNoteWant": "backdrop"
  },
  "garage6": {
    "keep": [
      {
        "id": "garage6-k1",
        "label": "Car",
        "kind": "keep"
      },
      {
        "id": "garage6-k2",
        "label": "Wrench",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garage6-w",
      "label": "Flat tire icon",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garage6-d",
      "label": "Oil can",
      "kind": "decoy"
    },
    "loose": {
      "id": "garage6-l",
      "label": "Key fob"
    },
    "slotLabel": "Peg",
    "paintLabel": "Door",
    "removeNote": "Remove the flat tire icon.",
    "placeNote": "Put the key fob in the peg.",
    "colorNoteWant": "door"
  },
  "news6": {
    "keep": [
      {
        "id": "news6-k1",
        "label": "Headline",
        "kind": "keep"
      },
      {
        "id": "news6-k2",
        "label": "Byline",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "news6-w",
      "label": "Typo in title",
      "kind": "wrong"
    },
    "decoy": {
      "id": "news6-d",
      "label": "Coffee cup",
      "kind": "decoy"
    },
    "loose": {
      "id": "news6-l",
      "label": "Photo credit"
    },
    "slotLabel": "Slot",
    "paintLabel": "Masthead",
    "removeNote": "Remove the typo in title.",
    "placeNote": "Put the photo credit in the slot.",
    "colorNoteWant": "masthead"
  },
  "podcast6": {
    "keep": [
      {
        "id": "podcast6-k1",
        "label": "Mic",
        "kind": "keep"
      },
      {
        "id": "podcast6-k2",
        "label": "Waveform",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "podcast6-w",
      "label": "Dog barking track",
      "kind": "wrong"
    },
    "decoy": {
      "id": "podcast6-d",
      "label": "Headphones",
      "kind": "decoy"
    },
    "loose": {
      "id": "podcast6-l",
      "label": "Episode art"
    },
    "slotLabel": "Cover",
    "paintLabel": "Player",
    "removeNote": "Remove the dog barking track.",
    "placeNote": "Put the episode art in the cover.",
    "colorNoteWant": "player"
  },
  "budget6": {
    "keep": [
      {
        "id": "budget6-k1",
        "label": "Income",
        "kind": "keep"
      },
      {
        "id": "budget6-k2",
        "label": "Expense",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "budget6-w",
      "label": "Negative lunch fund",
      "kind": "wrong"
    },
    "decoy": {
      "id": "budget6-d",
      "label": "Receipt",
      "kind": "decoy"
    },
    "loose": {
      "id": "budget6-l",
      "label": "Savings jar"
    },
    "slotLabel": "Tray",
    "paintLabel": "Chart",
    "removeNote": "Remove the negative lunch fund.",
    "placeNote": "Put the savings jar in the tray.",
    "colorNoteWant": "chart"
  },
  "hike6": {
    "keep": [
      {
        "id": "hike6-k1",
        "label": "Trail",
        "kind": "keep"
      },
      {
        "id": "hike6-k2",
        "label": "Boots",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "hike6-w",
      "label": "Sign pointing wrong way",
      "kind": "wrong"
    },
    "decoy": {
      "id": "hike6-d",
      "label": "Flask",
      "kind": "decoy"
    },
    "loose": {
      "id": "hike6-l",
      "label": "Map fold"
    },
    "slotLabel": "Pocket",
    "paintLabel": "Sky",
    "removeNote": "Remove the sign pointing wrong way.",
    "placeNote": "Put the map fold in the pocket.",
    "colorNoteWant": "sky"
  },
  "bakery6": {
    "keep": [
      {
        "id": "bakery6-k1",
        "label": "Loaf",
        "kind": "keep"
      },
      {
        "id": "bakery6-k2",
        "label": "Oven",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "bakery6-w",
      "label": "Raw dough on shelf",
      "kind": "wrong"
    },
    "decoy": {
      "id": "bakery6-d",
      "label": "Whisk",
      "kind": "decoy"
    },
    "loose": {
      "id": "bakery6-l",
      "label": "Order slip"
    },
    "slotLabel": "Counter",
    "paintLabel": "Apron",
    "removeNote": "Remove the raw dough on shelf.",
    "placeNote": "Put the order slip in the counter.",
    "colorNoteWant": "apron"
  },
  "theater6": {
    "keep": [
      {
        "id": "theater6-k1",
        "label": "Stage",
        "kind": "keep"
      },
      {
        "id": "theater6-k2",
        "label": "Curtain",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "theater6-w",
      "label": "Spotlight on empty seat",
      "kind": "wrong"
    },
    "decoy": {
      "id": "theater6-d",
      "label": "Program",
      "kind": "decoy"
    },
    "loose": {
      "id": "theater6-l",
      "label": "Ticket stub"
    },
    "slotLabel": "Seat",
    "paintLabel": "Banner",
    "removeNote": "Remove the spotlight on empty seat.",
    "placeNote": "Put the ticket stub in the seat.",
    "colorNoteWant": "banner"
  },
  "museum6": {
    "keep": [
      {
        "id": "museum6-k1",
        "label": "Plaque",
        "kind": "keep"
      },
      {
        "id": "museum6-k2",
        "label": "Artifact",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "museum6-w",
      "label": "Price tag on statue",
      "kind": "wrong"
    },
    "decoy": {
      "id": "museum6-d",
      "label": "Brochure",
      "kind": "decoy"
    },
    "loose": {
      "id": "museum6-l",
      "label": "Audio guide"
    },
    "slotLabel": "Stand",
    "paintLabel": "Wall",
    "removeNote": "Remove the price tag on statue.",
    "placeNote": "Put the audio guide in the stand.",
    "colorNoteWant": "wall"
  },
  "farm6": {
    "keep": [
      {
        "id": "farm6-k1",
        "label": "Barn",
        "kind": "keep"
      },
      {
        "id": "farm6-k2",
        "label": "Tractor",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "farm6-w",
      "label": "Chicken in cab",
      "kind": "wrong"
    },
    "decoy": {
      "id": "farm6-d",
      "label": "Hay bale",
      "kind": "decoy"
    },
    "loose": {
      "id": "farm6-l",
      "label": "Feed bag"
    },
    "slotLabel": "Hook",
    "paintLabel": "Sign",
    "removeNote": "Remove the chicken in cab.",
    "placeNote": "Put the feed bag in the hook.",
    "colorNoteWant": "sign"
  },
  "beach6": {
    "keep": [
      {
        "id": "beach6-k1",
        "label": "Umbrella",
        "kind": "keep"
      },
      {
        "id": "beach6-k2",
        "label": "Towel",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "beach6-w",
      "label": "Snow on sand",
      "kind": "wrong"
    },
    "decoy": {
      "id": "beach6-d",
      "label": "Cooler",
      "kind": "decoy"
    },
    "loose": {
      "id": "beach6-l",
      "label": "Sandcastle flag"
    },
    "slotLabel": "Pole",
    "paintLabel": "Sky",
    "removeNote": "Remove the snow on sand.",
    "placeNote": "Put the sandcastle flag in the pole.",
    "colorNoteWant": "sky"
  },
  "office6": {
    "keep": [
      {
        "id": "office6-k1",
        "label": "Inbox",
        "kind": "keep"
      },
      {
        "id": "office6-k2",
        "label": "Calendar",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "office6-w",
      "label": "Meeting at 3 AM",
      "kind": "wrong"
    },
    "decoy": {
      "id": "office6-d",
      "label": "Stapler",
      "kind": "decoy"
    },
    "loose": {
      "id": "office6-l",
      "label": "Name plate"
    },
    "slotLabel": "Desk",
    "paintLabel": "Wall",
    "removeNote": "Remove the meeting at 3 am.",
    "placeNote": "Put the name plate in the desk.",
    "colorNoteWant": "wall"
  },
  "calendar7": {
    "keep": [
      {
        "id": "calendar7-k1",
        "label": "Event",
        "kind": "keep"
      },
      {
        "id": "calendar7-k2",
        "label": "Reminder",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "calendar7-w",
      "label": "Wrong date",
      "kind": "wrong"
    },
    "decoy": {
      "id": "calendar7-d",
      "label": "Sticker",
      "kind": "decoy"
    },
    "loose": {
      "id": "calendar7-l",
      "label": "Invite card"
    },
    "slotLabel": "Pin board",
    "paintLabel": "Header",
    "removeNote": "Remove the wrong date.",
    "placeNote": "Put the invite card in the pin board.",
    "colorNoteWant": "header"
  },
  "fitness7": {
    "keep": [
      {
        "id": "fitness7-k1",
        "label": "Steps",
        "kind": "keep"
      },
      {
        "id": "fitness7-k2",
        "label": "Heart rate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "fitness7-w",
      "label": "999999 steps",
      "kind": "wrong"
    },
    "decoy": {
      "id": "fitness7-d",
      "label": "Water bottle",
      "kind": "decoy"
    },
    "loose": {
      "id": "fitness7-l",
      "label": "Towel"
    },
    "slotLabel": "Hook",
    "paintLabel": "Chart",
    "removeNote": "Remove the 999999 steps.",
    "placeNote": "Put the towel in the hook.",
    "colorNoteWant": "chart"
  },
  "garden7": {
    "keep": [
      {
        "id": "garden7-k1",
        "label": "Tomato",
        "kind": "keep"
      },
      {
        "id": "garden7-k2",
        "label": "Water can",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garden7-w",
      "label": "Weed",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garden7-d",
      "label": "Gnome",
      "kind": "decoy"
    },
    "loose": {
      "id": "garden7-l",
      "label": "Seed packet"
    },
    "slotLabel": "Plot",
    "paintLabel": "Fence",
    "removeNote": "Remove the weed.",
    "placeNote": "Put the seed packet in the plot.",
    "colorNoteWant": "fence"
  },
  "library7": {
    "keep": [
      {
        "id": "library7-k1",
        "label": "Book",
        "kind": "keep"
      },
      {
        "id": "library7-k2",
        "label": "Bookmark",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "library7-w",
      "label": "Coffee stain",
      "kind": "wrong"
    },
    "decoy": {
      "id": "library7-d",
      "label": "Bookmark ribbon",
      "kind": "decoy"
    },
    "loose": {
      "id": "library7-l",
      "label": "Return slip"
    },
    "slotLabel": "Shelf",
    "paintLabel": "Sign",
    "removeNote": "Remove the coffee stain.",
    "placeNote": "Put the return slip in the shelf.",
    "colorNoteWant": "sign"
  },
  "travel7": {
    "keep": [
      {
        "id": "travel7-k1",
        "label": "Ticket",
        "kind": "keep"
      },
      {
        "id": "travel7-k2",
        "label": "Gate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "travel7-w",
      "label": "Wrong gate",
      "kind": "wrong"
    },
    "decoy": {
      "id": "travel7-d",
      "label": "Suitcase",
      "kind": "decoy"
    },
    "loose": {
      "id": "travel7-l",
      "label": "Boarding pass"
    },
    "slotLabel": "Tray",
    "paintLabel": "Banner",
    "removeNote": "Remove the wrong gate.",
    "placeNote": "Put the boarding pass in the tray.",
    "colorNoteWant": "banner"
  },
  "cooking7": {
    "keep": [
      {
        "id": "cooking7-k1",
        "label": "Pot",
        "kind": "keep"
      },
      {
        "id": "cooking7-k2",
        "label": "Timer",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "cooking7-w",
      "label": "Sponge in pot",
      "kind": "wrong"
    },
    "decoy": {
      "id": "cooking7-d",
      "label": "Lid",
      "kind": "decoy"
    },
    "loose": {
      "id": "cooking7-l",
      "label": "Recipe card"
    },
    "slotLabel": "Trivet",
    "paintLabel": "Apron",
    "removeNote": "Remove the sponge in pot.",
    "placeNote": "Put the recipe card in the trivet.",
    "colorNoteWant": "apron"
  },
  "school7": {
    "keep": [
      {
        "id": "school7-k1",
        "label": "Desk",
        "kind": "keep"
      },
      {
        "id": "school7-k2",
        "label": "Pencil",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "school7-w",
      "label": "Doodle on test",
      "kind": "wrong"
    },
    "decoy": {
      "id": "school7-d",
      "label": "Eraser",
      "kind": "decoy"
    },
    "loose": {
      "id": "school7-l",
      "label": "Homework"
    },
    "slotLabel": "Tray",
    "paintLabel": "Board",
    "removeNote": "Remove the doodle on test.",
    "placeNote": "Put the homework in the tray.",
    "colorNoteWant": "board"
  },
  "clinic7": {
    "keep": [
      {
        "id": "clinic7-k1",
        "label": "Chart",
        "kind": "keep"
      },
      {
        "id": "clinic7-k2",
        "label": "Stethoscope",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "clinic7-w",
      "label": "Band-aid on screen",
      "kind": "wrong"
    },
    "decoy": {
      "id": "clinic7-d",
      "label": "Thermometer",
      "kind": "decoy"
    },
    "loose": {
      "id": "clinic7-l",
      "label": "Patient card"
    },
    "slotLabel": "Slot",
    "paintLabel": "Wall",
    "removeNote": "Remove the band-aid on screen.",
    "placeNote": "Put the patient card in the slot.",
    "colorNoteWant": "wall"
  },
  "studio7": {
    "keep": [
      {
        "id": "studio7-k1",
        "label": "Camera",
        "kind": "keep"
      },
      {
        "id": "studio7-k2",
        "label": "Light",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "studio7-w",
      "label": "Lens cap on",
      "kind": "wrong"
    },
    "decoy": {
      "id": "studio7-d",
      "label": "Tripod",
      "kind": "decoy"
    },
    "loose": {
      "id": "studio7-l",
      "label": "Memory card"
    },
    "slotLabel": "Bay",
    "paintLabel": "Backdrop",
    "removeNote": "Remove the lens cap on.",
    "placeNote": "Put the memory card in the bay.",
    "colorNoteWant": "backdrop"
  },
  "garage7": {
    "keep": [
      {
        "id": "garage7-k1",
        "label": "Car",
        "kind": "keep"
      },
      {
        "id": "garage7-k2",
        "label": "Wrench",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garage7-w",
      "label": "Flat tire icon",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garage7-d",
      "label": "Oil can",
      "kind": "decoy"
    },
    "loose": {
      "id": "garage7-l",
      "label": "Key fob"
    },
    "slotLabel": "Peg",
    "paintLabel": "Door",
    "removeNote": "Remove the flat tire icon.",
    "placeNote": "Put the key fob in the peg.",
    "colorNoteWant": "door"
  },
  "news7": {
    "keep": [
      {
        "id": "news7-k1",
        "label": "Headline",
        "kind": "keep"
      },
      {
        "id": "news7-k2",
        "label": "Byline",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "news7-w",
      "label": "Typo in title",
      "kind": "wrong"
    },
    "decoy": {
      "id": "news7-d",
      "label": "Coffee cup",
      "kind": "decoy"
    },
    "loose": {
      "id": "news7-l",
      "label": "Photo credit"
    },
    "slotLabel": "Slot",
    "paintLabel": "Masthead",
    "removeNote": "Remove the typo in title.",
    "placeNote": "Put the photo credit in the slot.",
    "colorNoteWant": "masthead"
  },
  "podcast7": {
    "keep": [
      {
        "id": "podcast7-k1",
        "label": "Mic",
        "kind": "keep"
      },
      {
        "id": "podcast7-k2",
        "label": "Waveform",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "podcast7-w",
      "label": "Dog barking track",
      "kind": "wrong"
    },
    "decoy": {
      "id": "podcast7-d",
      "label": "Headphones",
      "kind": "decoy"
    },
    "loose": {
      "id": "podcast7-l",
      "label": "Episode art"
    },
    "slotLabel": "Cover",
    "paintLabel": "Player",
    "removeNote": "Remove the dog barking track.",
    "placeNote": "Put the episode art in the cover.",
    "colorNoteWant": "player"
  },
  "budget7": {
    "keep": [
      {
        "id": "budget7-k1",
        "label": "Income",
        "kind": "keep"
      },
      {
        "id": "budget7-k2",
        "label": "Expense",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "budget7-w",
      "label": "Negative lunch fund",
      "kind": "wrong"
    },
    "decoy": {
      "id": "budget7-d",
      "label": "Receipt",
      "kind": "decoy"
    },
    "loose": {
      "id": "budget7-l",
      "label": "Savings jar"
    },
    "slotLabel": "Tray",
    "paintLabel": "Chart",
    "removeNote": "Remove the negative lunch fund.",
    "placeNote": "Put the savings jar in the tray.",
    "colorNoteWant": "chart"
  },
  "hike7": {
    "keep": [
      {
        "id": "hike7-k1",
        "label": "Trail",
        "kind": "keep"
      },
      {
        "id": "hike7-k2",
        "label": "Boots",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "hike7-w",
      "label": "Sign pointing wrong way",
      "kind": "wrong"
    },
    "decoy": {
      "id": "hike7-d",
      "label": "Flask",
      "kind": "decoy"
    },
    "loose": {
      "id": "hike7-l",
      "label": "Map fold"
    },
    "slotLabel": "Pocket",
    "paintLabel": "Sky",
    "removeNote": "Remove the sign pointing wrong way.",
    "placeNote": "Put the map fold in the pocket.",
    "colorNoteWant": "sky"
  },
  "bakery7": {
    "keep": [
      {
        "id": "bakery7-k1",
        "label": "Loaf",
        "kind": "keep"
      },
      {
        "id": "bakery7-k2",
        "label": "Oven",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "bakery7-w",
      "label": "Raw dough on shelf",
      "kind": "wrong"
    },
    "decoy": {
      "id": "bakery7-d",
      "label": "Whisk",
      "kind": "decoy"
    },
    "loose": {
      "id": "bakery7-l",
      "label": "Order slip"
    },
    "slotLabel": "Counter",
    "paintLabel": "Apron",
    "removeNote": "Remove the raw dough on shelf.",
    "placeNote": "Put the order slip in the counter.",
    "colorNoteWant": "apron"
  },
  "theater7": {
    "keep": [
      {
        "id": "theater7-k1",
        "label": "Stage",
        "kind": "keep"
      },
      {
        "id": "theater7-k2",
        "label": "Curtain",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "theater7-w",
      "label": "Spotlight on empty seat",
      "kind": "wrong"
    },
    "decoy": {
      "id": "theater7-d",
      "label": "Program",
      "kind": "decoy"
    },
    "loose": {
      "id": "theater7-l",
      "label": "Ticket stub"
    },
    "slotLabel": "Seat",
    "paintLabel": "Banner",
    "removeNote": "Remove the spotlight on empty seat.",
    "placeNote": "Put the ticket stub in the seat.",
    "colorNoteWant": "banner"
  },
  "museum7": {
    "keep": [
      {
        "id": "museum7-k1",
        "label": "Plaque",
        "kind": "keep"
      },
      {
        "id": "museum7-k2",
        "label": "Artifact",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "museum7-w",
      "label": "Price tag on statue",
      "kind": "wrong"
    },
    "decoy": {
      "id": "museum7-d",
      "label": "Brochure",
      "kind": "decoy"
    },
    "loose": {
      "id": "museum7-l",
      "label": "Audio guide"
    },
    "slotLabel": "Stand",
    "paintLabel": "Wall",
    "removeNote": "Remove the price tag on statue.",
    "placeNote": "Put the audio guide in the stand.",
    "colorNoteWant": "wall"
  },
  "farm7": {
    "keep": [
      {
        "id": "farm7-k1",
        "label": "Barn",
        "kind": "keep"
      },
      {
        "id": "farm7-k2",
        "label": "Tractor",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "farm7-w",
      "label": "Chicken in cab",
      "kind": "wrong"
    },
    "decoy": {
      "id": "farm7-d",
      "label": "Hay bale",
      "kind": "decoy"
    },
    "loose": {
      "id": "farm7-l",
      "label": "Feed bag"
    },
    "slotLabel": "Hook",
    "paintLabel": "Sign",
    "removeNote": "Remove the chicken in cab.",
    "placeNote": "Put the feed bag in the hook.",
    "colorNoteWant": "sign"
  },
  "beach7": {
    "keep": [
      {
        "id": "beach7-k1",
        "label": "Umbrella",
        "kind": "keep"
      },
      {
        "id": "beach7-k2",
        "label": "Towel",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "beach7-w",
      "label": "Snow on sand",
      "kind": "wrong"
    },
    "decoy": {
      "id": "beach7-d",
      "label": "Cooler",
      "kind": "decoy"
    },
    "loose": {
      "id": "beach7-l",
      "label": "Sandcastle flag"
    },
    "slotLabel": "Pole",
    "paintLabel": "Sky",
    "removeNote": "Remove the snow on sand.",
    "placeNote": "Put the sandcastle flag in the pole.",
    "colorNoteWant": "sky"
  },
  "office7": {
    "keep": [
      {
        "id": "office7-k1",
        "label": "Inbox",
        "kind": "keep"
      },
      {
        "id": "office7-k2",
        "label": "Calendar",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "office7-w",
      "label": "Meeting at 3 AM",
      "kind": "wrong"
    },
    "decoy": {
      "id": "office7-d",
      "label": "Stapler",
      "kind": "decoy"
    },
    "loose": {
      "id": "office7-l",
      "label": "Name plate"
    },
    "slotLabel": "Desk",
    "paintLabel": "Wall",
    "removeNote": "Remove the meeting at 3 am.",
    "placeNote": "Put the name plate in the desk.",
    "colorNoteWant": "wall"
  },
  "calendar8": {
    "keep": [
      {
        "id": "calendar8-k1",
        "label": "Event",
        "kind": "keep"
      },
      {
        "id": "calendar8-k2",
        "label": "Reminder",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "calendar8-w",
      "label": "Wrong date",
      "kind": "wrong"
    },
    "decoy": {
      "id": "calendar8-d",
      "label": "Sticker",
      "kind": "decoy"
    },
    "loose": {
      "id": "calendar8-l",
      "label": "Invite card"
    },
    "slotLabel": "Pin board",
    "paintLabel": "Header",
    "removeNote": "Remove the wrong date.",
    "placeNote": "Put the invite card in the pin board.",
    "colorNoteWant": "header"
  },
  "fitness8": {
    "keep": [
      {
        "id": "fitness8-k1",
        "label": "Steps",
        "kind": "keep"
      },
      {
        "id": "fitness8-k2",
        "label": "Heart rate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "fitness8-w",
      "label": "999999 steps",
      "kind": "wrong"
    },
    "decoy": {
      "id": "fitness8-d",
      "label": "Water bottle",
      "kind": "decoy"
    },
    "loose": {
      "id": "fitness8-l",
      "label": "Towel"
    },
    "slotLabel": "Hook",
    "paintLabel": "Chart",
    "removeNote": "Remove the 999999 steps.",
    "placeNote": "Put the towel in the hook.",
    "colorNoteWant": "chart"
  },
  "garden8": {
    "keep": [
      {
        "id": "garden8-k1",
        "label": "Tomato",
        "kind": "keep"
      },
      {
        "id": "garden8-k2",
        "label": "Water can",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garden8-w",
      "label": "Weed",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garden8-d",
      "label": "Gnome",
      "kind": "decoy"
    },
    "loose": {
      "id": "garden8-l",
      "label": "Seed packet"
    },
    "slotLabel": "Plot",
    "paintLabel": "Fence",
    "removeNote": "Remove the weed.",
    "placeNote": "Put the seed packet in the plot.",
    "colorNoteWant": "fence"
  },
  "library8": {
    "keep": [
      {
        "id": "library8-k1",
        "label": "Book",
        "kind": "keep"
      },
      {
        "id": "library8-k2",
        "label": "Bookmark",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "library8-w",
      "label": "Coffee stain",
      "kind": "wrong"
    },
    "decoy": {
      "id": "library8-d",
      "label": "Bookmark ribbon",
      "kind": "decoy"
    },
    "loose": {
      "id": "library8-l",
      "label": "Return slip"
    },
    "slotLabel": "Shelf",
    "paintLabel": "Sign",
    "removeNote": "Remove the coffee stain.",
    "placeNote": "Put the return slip in the shelf.",
    "colorNoteWant": "sign"
  },
  "travel8": {
    "keep": [
      {
        "id": "travel8-k1",
        "label": "Ticket",
        "kind": "keep"
      },
      {
        "id": "travel8-k2",
        "label": "Gate",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "travel8-w",
      "label": "Wrong gate",
      "kind": "wrong"
    },
    "decoy": {
      "id": "travel8-d",
      "label": "Suitcase",
      "kind": "decoy"
    },
    "loose": {
      "id": "travel8-l",
      "label": "Boarding pass"
    },
    "slotLabel": "Tray",
    "paintLabel": "Banner",
    "removeNote": "Remove the wrong gate.",
    "placeNote": "Put the boarding pass in the tray.",
    "colorNoteWant": "banner"
  },
  "cooking8": {
    "keep": [
      {
        "id": "cooking8-k1",
        "label": "Pot",
        "kind": "keep"
      },
      {
        "id": "cooking8-k2",
        "label": "Timer",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "cooking8-w",
      "label": "Sponge in pot",
      "kind": "wrong"
    },
    "decoy": {
      "id": "cooking8-d",
      "label": "Lid",
      "kind": "decoy"
    },
    "loose": {
      "id": "cooking8-l",
      "label": "Recipe card"
    },
    "slotLabel": "Trivet",
    "paintLabel": "Apron",
    "removeNote": "Remove the sponge in pot.",
    "placeNote": "Put the recipe card in the trivet.",
    "colorNoteWant": "apron"
  },
  "school8": {
    "keep": [
      {
        "id": "school8-k1",
        "label": "Desk",
        "kind": "keep"
      },
      {
        "id": "school8-k2",
        "label": "Pencil",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "school8-w",
      "label": "Doodle on test",
      "kind": "wrong"
    },
    "decoy": {
      "id": "school8-d",
      "label": "Eraser",
      "kind": "decoy"
    },
    "loose": {
      "id": "school8-l",
      "label": "Homework"
    },
    "slotLabel": "Tray",
    "paintLabel": "Board",
    "removeNote": "Remove the doodle on test.",
    "placeNote": "Put the homework in the tray.",
    "colorNoteWant": "board"
  },
  "clinic8": {
    "keep": [
      {
        "id": "clinic8-k1",
        "label": "Chart",
        "kind": "keep"
      },
      {
        "id": "clinic8-k2",
        "label": "Stethoscope",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "clinic8-w",
      "label": "Band-aid on screen",
      "kind": "wrong"
    },
    "decoy": {
      "id": "clinic8-d",
      "label": "Thermometer",
      "kind": "decoy"
    },
    "loose": {
      "id": "clinic8-l",
      "label": "Patient card"
    },
    "slotLabel": "Slot",
    "paintLabel": "Wall",
    "removeNote": "Remove the band-aid on screen.",
    "placeNote": "Put the patient card in the slot.",
    "colorNoteWant": "wall"
  },
  "studio8": {
    "keep": [
      {
        "id": "studio8-k1",
        "label": "Camera",
        "kind": "keep"
      },
      {
        "id": "studio8-k2",
        "label": "Light",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "studio8-w",
      "label": "Lens cap on",
      "kind": "wrong"
    },
    "decoy": {
      "id": "studio8-d",
      "label": "Tripod",
      "kind": "decoy"
    },
    "loose": {
      "id": "studio8-l",
      "label": "Memory card"
    },
    "slotLabel": "Bay",
    "paintLabel": "Backdrop",
    "removeNote": "Remove the lens cap on.",
    "placeNote": "Put the memory card in the bay.",
    "colorNoteWant": "backdrop"
  },
  "garage8": {
    "keep": [
      {
        "id": "garage8-k1",
        "label": "Car",
        "kind": "keep"
      },
      {
        "id": "garage8-k2",
        "label": "Wrench",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "garage8-w",
      "label": "Flat tire icon",
      "kind": "wrong"
    },
    "decoy": {
      "id": "garage8-d",
      "label": "Oil can",
      "kind": "decoy"
    },
    "loose": {
      "id": "garage8-l",
      "label": "Key fob"
    },
    "slotLabel": "Peg",
    "paintLabel": "Door",
    "removeNote": "Remove the flat tire icon.",
    "placeNote": "Put the key fob in the peg.",
    "colorNoteWant": "door"
  },
  "news8": {
    "keep": [
      {
        "id": "news8-k1",
        "label": "Headline",
        "kind": "keep"
      },
      {
        "id": "news8-k2",
        "label": "Byline",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "news8-w",
      "label": "Typo in title",
      "kind": "wrong"
    },
    "decoy": {
      "id": "news8-d",
      "label": "Coffee cup",
      "kind": "decoy"
    },
    "loose": {
      "id": "news8-l",
      "label": "Photo credit"
    },
    "slotLabel": "Slot",
    "paintLabel": "Masthead",
    "removeNote": "Remove the typo in title.",
    "placeNote": "Put the photo credit in the slot.",
    "colorNoteWant": "masthead"
  },
  "podcast8": {
    "keep": [
      {
        "id": "podcast8-k1",
        "label": "Mic",
        "kind": "keep"
      },
      {
        "id": "podcast8-k2",
        "label": "Waveform",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "podcast8-w",
      "label": "Dog barking track",
      "kind": "wrong"
    },
    "decoy": {
      "id": "podcast8-d",
      "label": "Headphones",
      "kind": "decoy"
    },
    "loose": {
      "id": "podcast8-l",
      "label": "Episode art"
    },
    "slotLabel": "Cover",
    "paintLabel": "Player",
    "removeNote": "Remove the dog barking track.",
    "placeNote": "Put the episode art in the cover.",
    "colorNoteWant": "player"
  },
  "budget8": {
    "keep": [
      {
        "id": "budget8-k1",
        "label": "Income",
        "kind": "keep"
      },
      {
        "id": "budget8-k2",
        "label": "Expense",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "budget8-w",
      "label": "Negative lunch fund",
      "kind": "wrong"
    },
    "decoy": {
      "id": "budget8-d",
      "label": "Receipt",
      "kind": "decoy"
    },
    "loose": {
      "id": "budget8-l",
      "label": "Savings jar"
    },
    "slotLabel": "Tray",
    "paintLabel": "Chart",
    "removeNote": "Remove the negative lunch fund.",
    "placeNote": "Put the savings jar in the tray.",
    "colorNoteWant": "chart"
  },
  "hike8": {
    "keep": [
      {
        "id": "hike8-k1",
        "label": "Trail",
        "kind": "keep"
      },
      {
        "id": "hike8-k2",
        "label": "Boots",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "hike8-w",
      "label": "Sign pointing wrong way",
      "kind": "wrong"
    },
    "decoy": {
      "id": "hike8-d",
      "label": "Flask",
      "kind": "decoy"
    },
    "loose": {
      "id": "hike8-l",
      "label": "Map fold"
    },
    "slotLabel": "Pocket",
    "paintLabel": "Sky",
    "removeNote": "Remove the sign pointing wrong way.",
    "placeNote": "Put the map fold in the pocket.",
    "colorNoteWant": "sky"
  },
  "bakery8": {
    "keep": [
      {
        "id": "bakery8-k1",
        "label": "Loaf",
        "kind": "keep"
      },
      {
        "id": "bakery8-k2",
        "label": "Oven",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "bakery8-w",
      "label": "Raw dough on shelf",
      "kind": "wrong"
    },
    "decoy": {
      "id": "bakery8-d",
      "label": "Whisk",
      "kind": "decoy"
    },
    "loose": {
      "id": "bakery8-l",
      "label": "Order slip"
    },
    "slotLabel": "Counter",
    "paintLabel": "Apron",
    "removeNote": "Remove the raw dough on shelf.",
    "placeNote": "Put the order slip in the counter.",
    "colorNoteWant": "apron"
  },
  "theater8": {
    "keep": [
      {
        "id": "theater8-k1",
        "label": "Stage",
        "kind": "keep"
      },
      {
        "id": "theater8-k2",
        "label": "Curtain",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "theater8-w",
      "label": "Spotlight on empty seat",
      "kind": "wrong"
    },
    "decoy": {
      "id": "theater8-d",
      "label": "Program",
      "kind": "decoy"
    },
    "loose": {
      "id": "theater8-l",
      "label": "Ticket stub"
    },
    "slotLabel": "Seat",
    "paintLabel": "Banner",
    "removeNote": "Remove the spotlight on empty seat.",
    "placeNote": "Put the ticket stub in the seat.",
    "colorNoteWant": "banner"
  },
  "museum8": {
    "keep": [
      {
        "id": "museum8-k1",
        "label": "Plaque",
        "kind": "keep"
      },
      {
        "id": "museum8-k2",
        "label": "Artifact",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "museum8-w",
      "label": "Price tag on statue",
      "kind": "wrong"
    },
    "decoy": {
      "id": "museum8-d",
      "label": "Brochure",
      "kind": "decoy"
    },
    "loose": {
      "id": "museum8-l",
      "label": "Audio guide"
    },
    "slotLabel": "Stand",
    "paintLabel": "Wall",
    "removeNote": "Remove the price tag on statue.",
    "placeNote": "Put the audio guide in the stand.",
    "colorNoteWant": "wall"
  },
  "farm8": {
    "keep": [
      {
        "id": "farm8-k1",
        "label": "Barn",
        "kind": "keep"
      },
      {
        "id": "farm8-k2",
        "label": "Tractor",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "farm8-w",
      "label": "Chicken in cab",
      "kind": "wrong"
    },
    "decoy": {
      "id": "farm8-d",
      "label": "Hay bale",
      "kind": "decoy"
    },
    "loose": {
      "id": "farm8-l",
      "label": "Feed bag"
    },
    "slotLabel": "Hook",
    "paintLabel": "Sign",
    "removeNote": "Remove the chicken in cab.",
    "placeNote": "Put the feed bag in the hook.",
    "colorNoteWant": "sign"
  },
  "beach8": {
    "keep": [
      {
        "id": "beach8-k1",
        "label": "Umbrella",
        "kind": "keep"
      },
      {
        "id": "beach8-k2",
        "label": "Towel",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "beach8-w",
      "label": "Snow on sand",
      "kind": "wrong"
    },
    "decoy": {
      "id": "beach8-d",
      "label": "Cooler",
      "kind": "decoy"
    },
    "loose": {
      "id": "beach8-l",
      "label": "Sandcastle flag"
    },
    "slotLabel": "Pole",
    "paintLabel": "Sky",
    "removeNote": "Remove the snow on sand.",
    "placeNote": "Put the sandcastle flag in the pole.",
    "colorNoteWant": "sky"
  },
  "office8": {
    "keep": [
      {
        "id": "office8-k1",
        "label": "Inbox",
        "kind": "keep"
      },
      {
        "id": "office8-k2",
        "label": "Calendar",
        "kind": "keep"
      }
    ],
    "wrong": {
      "id": "office8-w",
      "label": "Meeting at 3 AM",
      "kind": "wrong"
    },
    "decoy": {
      "id": "office8-d",
      "label": "Stapler",
      "kind": "decoy"
    },
    "loose": {
      "id": "office8-l",
      "label": "Name plate"
    },
    "slotLabel": "Desk",
    "paintLabel": "Wall",
    "removeNote": "Remove the meeting at 3 am.",
    "placeNote": "Put the name plate in the desk.",
    "colorNoteWant": "wall"
  }
} as Record<string, Omit<SceneDef, 'colorNote'> & { colorNoteWant: string }>;

export const EXTRA_TIDY_SCENES: Record<string, SceneDef> = Object.fromEntries(
  Object.entries(RAW).map(([key, scene]) => [
    key,
    {
      ...scene,
      colorNote: (want: Swatch) => `Make the ${scene.colorNoteWant} ${LABEL[want]}.`,
    },
  ]),
);
