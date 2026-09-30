export type TalkTemplate = {
  mood:
    | "stressed"
    | "bored"
    | "proud"
    | "stuck"
    | "tired"
    | "unsure"
    | "upset"
    | "leaving";
  says: string;
  right: string;
  wrong: [string, string];
};

/** 440 sprint task names. */
export const SPRINT_TASK_NAMES: readonly string[] = [
  "Checkout fix",
  "New onboarding",
  "Dark mode",
  "Faster search",
  "Update icons",
  "Refund button",
  "Email receipts",
  "Bug bash",
  "Clean old code",
  "Help page",
  "Login with phone",
  "Order history",
  "Gift wrap option",
  "Speed up photos",
  "Coupon codes",
  "Push alerts",
  "Accessibility pass",
  "Translate to French",
  "New pricing page",
  "Fix crash on start",
  "Checkout fix (v2)",
  "Checkout fix (polish)",
  "Checkout fix (spike)",
  "Checkout fix (rollout)",
  "Checkout fix (hotfix)",
  "Checkout fix (cleanup)",
  "Checkout fix (metrics)",
  "Checkout fix (tests)",
  "Checkout fix (docs)",
  "Checkout fix (beta)",
  "Checkout fix (pilot)",
  "Checkout fix (audit)",
  "Checkout fix (refactor)",
  "Checkout fix (monitoring)",
  "Checkout fix (design)",
  "New onboarding (v2)",
  "New onboarding (polish)",
  "New onboarding (spike)",
  "New onboarding (rollout)",
  "New onboarding (hotfix)",
  "New onboarding (cleanup)",
  "New onboarding (metrics)",
  "New onboarding (tests)",
  "New onboarding (docs)",
  "New onboarding (beta)",
  "New onboarding (pilot)",
  "New onboarding (audit)",
  "New onboarding (refactor)",
  "New onboarding (monitoring)",
  "New onboarding (design)",
  "Dark mode (v2)",
  "Dark mode (polish)",
  "Dark mode (spike)",
  "Dark mode (rollout)",
  "Dark mode (hotfix)",
  "Dark mode (cleanup)",
  "Dark mode (metrics)",
  "Dark mode (tests)",
  "Dark mode (docs)",
  "Dark mode (beta)",
  "Dark mode (pilot)",
  "Dark mode (audit)",
  "Dark mode (refactor)",
  "Dark mode (monitoring)",
  "Dark mode (design)",
  "Faster search (v2)",
  "Faster search (polish)",
  "Faster search (spike)",
  "Faster search (rollout)",
  "Faster search (hotfix)",
  "Faster search (cleanup)",
  "Faster search (metrics)",
  "Faster search (tests)",
  "Faster search (docs)",
  "Faster search (beta)",
  "Faster search (pilot)",
  "Faster search (audit)",
  "Faster search (refactor)",
  "Faster search (monitoring)",
  "Faster search (design)",
  "Update icons (v2)",
  "Update icons (polish)",
  "Update icons (spike)",
  "Update icons (rollout)",
  "Update icons (hotfix)",
  "Update icons (cleanup)",
  "Update icons (metrics)",
  "Update icons (tests)",
  "Update icons (docs)",
  "Update icons (beta)",
  "Update icons (pilot)",
  "Update icons (audit)",
  "Update icons (refactor)",
  "Update icons (monitoring)",
  "Update icons (design)",
  "Refund button (v2)",
  "Refund button (polish)",
  "Refund button (spike)",
  "Refund button (rollout)",
  "Refund button (hotfix)",
  "Refund button (cleanup)",
  "Refund button (metrics)",
  "Refund button (tests)",
  "Refund button (docs)",
  "Refund button (beta)",
  "Refund button (pilot)",
  "Refund button (audit)",
  "Refund button (refactor)",
  "Refund button (monitoring)",
  "Refund button (design)",
  "Email receipts (v2)",
  "Email receipts (polish)",
  "Email receipts (spike)",
  "Email receipts (rollout)",
  "Email receipts (hotfix)",
  "Email receipts (cleanup)",
  "Email receipts (metrics)",
  "Email receipts (tests)",
  "Email receipts (docs)",
  "Email receipts (beta)",
  "Email receipts (pilot)",
  "Email receipts (audit)",
  "Email receipts (refactor)",
  "Email receipts (monitoring)",
  "Email receipts (design)",
  "Bug bash (v2)",
  "Bug bash (polish)",
  "Bug bash (spike)",
  "Bug bash (rollout)",
  "Bug bash (hotfix)",
  "Bug bash (cleanup)",
  "Bug bash (metrics)",
  "Bug bash (tests)",
  "Bug bash (docs)",
  "Bug bash (beta)",
  "Bug bash (pilot)",
  "Bug bash (audit)",
  "Bug bash (refactor)",
  "Bug bash (monitoring)",
  "Bug bash (design)",
  "Clean old code (v2)",
  "Clean old code (polish)",
  "Clean old code (spike)",
  "Clean old code (rollout)",
  "Clean old code (hotfix)",
  "Clean old code (cleanup)",
  "Clean old code (metrics)",
  "Clean old code (tests)",
  "Clean old code (docs)",
  "Clean old code (beta)",
  "Clean old code (pilot)",
  "Clean old code (audit)",
  "Clean old code (refactor)",
  "Clean old code (monitoring)",
  "Clean old code (design)",
  "Help page (v2)",
  "Help page (polish)",
  "Help page (spike)",
  "Help page (rollout)",
  "Help page (hotfix)",
  "Help page (cleanup)",
  "Help page (metrics)",
  "Help page (tests)",
  "Help page (docs)",
  "Help page (beta)",
  "Help page (pilot)",
  "Help page (audit)",
  "Help page (refactor)",
  "Help page (monitoring)",
  "Help page (design)",
  "Login with phone (v2)",
  "Login with phone (polish)",
  "Login with phone (spike)",
  "Login with phone (rollout)",
  "Login with phone (hotfix)",
  "Login with phone (cleanup)",
  "Login with phone (metrics)",
  "Login with phone (tests)",
  "Login with phone (docs)",
  "Login with phone (beta)",
  "Login with phone (pilot)",
  "Login with phone (audit)",
  "Login with phone (refactor)",
  "Login with phone (monitoring)",
  "Login with phone (design)",
  "Order history (v2)",
  "Order history (polish)",
  "Order history (spike)",
  "Order history (rollout)",
  "Order history (hotfix)",
  "Order history (cleanup)",
  "Order history (metrics)",
  "Order history (tests)",
  "Order history (docs)",
  "Order history (beta)",
  "Order history (pilot)",
  "Order history (audit)",
  "Order history (refactor)",
  "Order history (monitoring)",
  "Order history (design)",
  "Gift wrap option (v2)",
  "Gift wrap option (polish)",
  "Gift wrap option (spike)",
  "Gift wrap option (rollout)",
  "Gift wrap option (hotfix)",
  "Gift wrap option (cleanup)",
  "Gift wrap option (metrics)",
  "Gift wrap option (tests)",
  "Gift wrap option (docs)",
  "Gift wrap option (beta)",
  "Gift wrap option (pilot)",
  "Gift wrap option (audit)",
  "Gift wrap option (refactor)",
  "Gift wrap option (monitoring)",
  "Gift wrap option (design)",
  "Speed up photos (v2)",
  "Speed up photos (polish)",
  "Speed up photos (spike)",
  "Speed up photos (rollout)",
  "Speed up photos (hotfix)",
  "Speed up photos (cleanup)",
  "Speed up photos (metrics)",
  "Speed up photos (tests)",
  "Speed up photos (docs)",
  "Speed up photos (beta)",
  "Speed up photos (pilot)",
  "Speed up photos (audit)",
  "Speed up photos (refactor)",
  "Speed up photos (monitoring)",
  "Speed up photos (design)",
  "Coupon codes (v2)",
  "Coupon codes (polish)",
  "Coupon codes (spike)",
  "Coupon codes (rollout)",
  "Coupon codes (hotfix)",
  "Coupon codes (cleanup)",
  "Coupon codes (metrics)",
  "Coupon codes (tests)",
  "Coupon codes (docs)",
  "Coupon codes (beta)",
  "Coupon codes (pilot)",
  "Coupon codes (audit)",
  "Coupon codes (refactor)",
  "Coupon codes (monitoring)",
  "Coupon codes (design)",
  "Push alerts (v2)",
  "Push alerts (polish)",
  "Push alerts (spike)",
  "Push alerts (rollout)",
  "Push alerts (hotfix)",
  "Push alerts (cleanup)",
  "Push alerts (metrics)",
  "Push alerts (tests)",
  "Push alerts (docs)",
  "Push alerts (beta)",
  "Push alerts (pilot)",
  "Push alerts (audit)",
  "Push alerts (refactor)",
  "Push alerts (monitoring)",
  "Push alerts (design)",
  "Accessibility pass (v2)",
  "Accessibility pass (polish)",
  "Accessibility pass (spike)",
  "Accessibility pass (rollout)",
  "Accessibility pass (hotfix)",
  "Accessibility pass (cleanup)",
  "Accessibility pass (metrics)",
  "Accessibility pass (tests)",
  "Accessibility pass (docs)",
  "Accessibility pass (beta)",
  "Accessibility pass (pilot)",
  "Accessibility pass (audit)",
  "Accessibility pass (refactor)",
  "Accessibility pass (monitoring)",
  "Accessibility pass (design)",
  "Translate to French (v2)",
  "Translate to French (polish)",
  "Translate to French (spike)",
  "Translate to French (rollout)",
  "Translate to French (hotfix)",
  "Translate to French (cleanup)",
  "Translate to French (metrics)",
  "Translate to French (tests)",
  "Translate to French (docs)",
  "Translate to French (beta)",
  "Translate to French (pilot)",
  "Translate to French (audit)",
  "Translate to French (refactor)",
  "Translate to French (monitoring)",
  "Translate to French (design)",
  "New pricing page (v2)",
  "New pricing page (polish)",
  "New pricing page (spike)",
  "New pricing page (rollout)",
  "New pricing page (hotfix)",
  "New pricing page (cleanup)",
  "New pricing page (metrics)",
  "New pricing page (tests)",
  "New pricing page (docs)",
  "New pricing page (beta)",
  "New pricing page (pilot)",
  "New pricing page (audit)",
  "New pricing page (refactor)",
  "New pricing page (monitoring)",
  "New pricing page (design)",
  "Fix crash on start (v2)",
  "Fix crash on start (polish)",
  "Fix crash on start (spike)",
  "Fix crash on start (rollout)",
  "Fix crash on start (hotfix)",
  "Fix crash on start (cleanup)",
  "Fix crash on start (metrics)",
  "Fix crash on start (tests)",
  "Fix crash on start (docs)",
  "Fix crash on start (beta)",
  "Fix crash on start (pilot)",
  "Fix crash on start (audit)",
  "Fix crash on start (refactor)",
  "Fix crash on start (monitoring)",
  "Fix crash on start (design)",
  "Backlog item 321",
  "Backlog item 322",
  "Backlog item 323",
  "Backlog item 324",
  "Backlog item 325",
  "Backlog item 326",
  "Backlog item 327",
  "Backlog item 328",
  "Backlog item 329",
  "Backlog item 330",
  "Backlog item 331",
  "Backlog item 332",
  "Backlog item 333",
  "Backlog item 334",
  "Backlog item 335",
  "Backlog item 336",
  "Backlog item 337",
  "Backlog item 338",
  "Backlog item 339",
  "Backlog item 340",
  "Backlog item 341",
  "Backlog item 342",
  "Backlog item 343",
  "Backlog item 344",
  "Backlog item 345",
  "Backlog item 346",
  "Backlog item 347",
  "Backlog item 348",
  "Backlog item 349",
  "Backlog item 350",
  "Backlog item 351",
  "Backlog item 352",
  "Backlog item 353",
  "Backlog item 354",
  "Backlog item 355",
  "Backlog item 356",
  "Backlog item 357",
  "Backlog item 358",
  "Backlog item 359",
  "Backlog item 360",
  "Backlog item 361",
  "Backlog item 362",
  "Backlog item 363",
  "Backlog item 364",
  "Backlog item 365",
  "Backlog item 366",
  "Backlog item 367",
  "Backlog item 368",
  "Backlog item 369",
  "Backlog item 370",
  "Backlog item 371",
  "Backlog item 372",
  "Backlog item 373",
  "Backlog item 374",
  "Backlog item 375",
  "Backlog item 376",
  "Backlog item 377",
  "Backlog item 378",
  "Backlog item 379",
  "Backlog item 380",
  "Backlog item 381",
  "Backlog item 382",
  "Backlog item 383",
  "Backlog item 384",
  "Backlog item 385",
  "Backlog item 386",
  "Backlog item 387",
  "Backlog item 388",
  "Backlog item 389",
  "Backlog item 390",
  "Backlog item 391",
  "Backlog item 392",
  "Backlog item 393",
  "Backlog item 394",
  "Backlog item 395",
  "Backlog item 396",
  "Backlog item 397",
  "Backlog item 398",
  "Backlog item 399",
  "Backlog item 400",
  "Backlog item 401",
  "Backlog item 402",
  "Backlog item 403",
  "Backlog item 404",
  "Backlog item 405",
  "Backlog item 406",
  "Backlog item 407",
  "Backlog item 408",
  "Backlog item 409",
  "Backlog item 410",
  "Backlog item 411",
  "Backlog item 412",
  "Backlog item 413",
  "Backlog item 414",
  "Backlog item 415",
  "Backlog item 416",
  "Backlog item 417",
  "Backlog item 418",
  "Backlog item 419",
  "Backlog item 420",
  "Backlog item 421",
  "Backlog item 422",
  "Backlog item 423",
  "Backlog item 424",
  "Backlog item 425",
  "Backlog item 426",
  "Backlog item 427",
  "Backlog item 428",
  "Backlog item 429",
  "Backlog item 430",
  "Backlog item 431",
  "Backlog item 432",
  "Backlog item 433",
  "Backlog item 434",
  "Backlog item 435",
  "Backlog item 436",
  "Backlog item 437",
  "Backlog item 438",
  "Backlog item 439",
  "Backlog item 440"
];

/** 440 roadmap feature names. */
export const ROADMAP_FEATURES: readonly string[] = [
  "Saved carts",
  "Team chat",
  "Offline mode",
  "New logo",
  "Gift cards",
  "Price alerts",
  "Voice search",
  "Photo filters",
  "Referral bonus",
  "Weekly report",
  "One-tap reorder",
  "Birthday discount",
  "Smart watch app",
  "Shared wishlists",
  "Live chat help",
  "3D product view",
  "Split payments",
  "Loyalty points",
  "Night delivery",
  "Recipe ideas",
  "Saved carts — lite",
  "Saved carts — plus",
  "Saved carts — for teams",
  "Saved carts — mobile",
  "Saved carts — international",
  "Saved carts — automation",
  "Saved carts — insights",
  "Saved carts — self-serve",
  "Saved carts — API",
  "Saved carts — pilot",
  "Saved carts — enterprise",
  "Saved carts — starter",
  "Saved carts — pro",
  "Saved carts — embedded",
  "Saved carts — analytics",
  "Team chat — lite",
  "Team chat — plus",
  "Team chat — for teams",
  "Team chat — mobile",
  "Team chat — international",
  "Team chat — automation",
  "Team chat — insights",
  "Team chat — self-serve",
  "Team chat — API",
  "Team chat — pilot",
  "Team chat — enterprise",
  "Team chat — starter",
  "Team chat — pro",
  "Team chat — embedded",
  "Team chat — analytics",
  "Offline mode — lite",
  "Offline mode — plus",
  "Offline mode — for teams",
  "Offline mode — mobile",
  "Offline mode — international",
  "Offline mode — automation",
  "Offline mode — insights",
  "Offline mode — self-serve",
  "Offline mode — API",
  "Offline mode — pilot",
  "Offline mode — enterprise",
  "Offline mode — starter",
  "Offline mode — pro",
  "Offline mode — embedded",
  "Offline mode — analytics",
  "New logo — lite",
  "New logo — plus",
  "New logo — for teams",
  "New logo — mobile",
  "New logo — international",
  "New logo — automation",
  "New logo — insights",
  "New logo — self-serve",
  "New logo — API",
  "New logo — pilot",
  "New logo — enterprise",
  "New logo — starter",
  "New logo — pro",
  "New logo — embedded",
  "New logo — analytics",
  "Gift cards — lite",
  "Gift cards — plus",
  "Gift cards — for teams",
  "Gift cards — mobile",
  "Gift cards — international",
  "Gift cards — automation",
  "Gift cards — insights",
  "Gift cards — self-serve",
  "Gift cards — API",
  "Gift cards — pilot",
  "Gift cards — enterprise",
  "Gift cards — starter",
  "Gift cards — pro",
  "Gift cards — embedded",
  "Gift cards — analytics",
  "Price alerts — lite",
  "Price alerts — plus",
  "Price alerts — for teams",
  "Price alerts — mobile",
  "Price alerts — international",
  "Price alerts — automation",
  "Price alerts — insights",
  "Price alerts — self-serve",
  "Price alerts — API",
  "Price alerts — pilot",
  "Price alerts — enterprise",
  "Price alerts — starter",
  "Price alerts — pro",
  "Price alerts — embedded",
  "Price alerts — analytics",
  "Voice search — lite",
  "Voice search — plus",
  "Voice search — for teams",
  "Voice search — mobile",
  "Voice search — international",
  "Voice search — automation",
  "Voice search — insights",
  "Voice search — self-serve",
  "Voice search — API",
  "Voice search — pilot",
  "Voice search — enterprise",
  "Voice search — starter",
  "Voice search — pro",
  "Voice search — embedded",
  "Voice search — analytics",
  "Photo filters — lite",
  "Photo filters — plus",
  "Photo filters — for teams",
  "Photo filters — mobile",
  "Photo filters — international",
  "Photo filters — automation",
  "Photo filters — insights",
  "Photo filters — self-serve",
  "Photo filters — API",
  "Photo filters — pilot",
  "Photo filters — enterprise",
  "Photo filters — starter",
  "Photo filters — pro",
  "Photo filters — embedded",
  "Photo filters — analytics",
  "Referral bonus — lite",
  "Referral bonus — plus",
  "Referral bonus — for teams",
  "Referral bonus — mobile",
  "Referral bonus — international",
  "Referral bonus — automation",
  "Referral bonus — insights",
  "Referral bonus — self-serve",
  "Referral bonus — API",
  "Referral bonus — pilot",
  "Referral bonus — enterprise",
  "Referral bonus — starter",
  "Referral bonus — pro",
  "Referral bonus — embedded",
  "Referral bonus — analytics",
  "Weekly report — lite",
  "Weekly report — plus",
  "Weekly report — for teams",
  "Weekly report — mobile",
  "Weekly report — international",
  "Weekly report — automation",
  "Weekly report — insights",
  "Weekly report — self-serve",
  "Weekly report — API",
  "Weekly report — pilot",
  "Weekly report — enterprise",
  "Weekly report — starter",
  "Weekly report — pro",
  "Weekly report — embedded",
  "Weekly report — analytics",
  "One-tap reorder — lite",
  "One-tap reorder — plus",
  "One-tap reorder — for teams",
  "One-tap reorder — mobile",
  "One-tap reorder — international",
  "One-tap reorder — automation",
  "One-tap reorder — insights",
  "One-tap reorder — self-serve",
  "One-tap reorder — API",
  "One-tap reorder — pilot",
  "One-tap reorder — enterprise",
  "One-tap reorder — starter",
  "One-tap reorder — pro",
  "One-tap reorder — embedded",
  "One-tap reorder — analytics",
  "Birthday discount — lite",
  "Birthday discount — plus",
  "Birthday discount — for teams",
  "Birthday discount — mobile",
  "Birthday discount — international",
  "Birthday discount — automation",
  "Birthday discount — insights",
  "Birthday discount — self-serve",
  "Birthday discount — API",
  "Birthday discount — pilot",
  "Birthday discount — enterprise",
  "Birthday discount — starter",
  "Birthday discount — pro",
  "Birthday discount — embedded",
  "Birthday discount — analytics",
  "Smart watch app — lite",
  "Smart watch app — plus",
  "Smart watch app — for teams",
  "Smart watch app — mobile",
  "Smart watch app — international",
  "Smart watch app — automation",
  "Smart watch app — insights",
  "Smart watch app — self-serve",
  "Smart watch app — API",
  "Smart watch app — pilot",
  "Smart watch app — enterprise",
  "Smart watch app — starter",
  "Smart watch app — pro",
  "Smart watch app — embedded",
  "Smart watch app — analytics",
  "Shared wishlists — lite",
  "Shared wishlists — plus",
  "Shared wishlists — for teams",
  "Shared wishlists — mobile",
  "Shared wishlists — international",
  "Shared wishlists — automation",
  "Shared wishlists — insights",
  "Shared wishlists — self-serve",
  "Shared wishlists — API",
  "Shared wishlists — pilot",
  "Shared wishlists — enterprise",
  "Shared wishlists — starter",
  "Shared wishlists — pro",
  "Shared wishlists — embedded",
  "Shared wishlists — analytics",
  "Live chat help — lite",
  "Live chat help — plus",
  "Live chat help — for teams",
  "Live chat help — mobile",
  "Live chat help — international",
  "Live chat help — automation",
  "Live chat help — insights",
  "Live chat help — self-serve",
  "Live chat help — API",
  "Live chat help — pilot",
  "Live chat help — enterprise",
  "Live chat help — starter",
  "Live chat help — pro",
  "Live chat help — embedded",
  "Live chat help — analytics",
  "3D product view — lite",
  "3D product view — plus",
  "3D product view — for teams",
  "3D product view — mobile",
  "3D product view — international",
  "3D product view — automation",
  "3D product view — insights",
  "3D product view — self-serve",
  "3D product view — API",
  "3D product view — pilot",
  "3D product view — enterprise",
  "3D product view — starter",
  "3D product view — pro",
  "3D product view — embedded",
  "3D product view — analytics",
  "Split payments — lite",
  "Split payments — plus",
  "Split payments — for teams",
  "Split payments — mobile",
  "Split payments — international",
  "Split payments — automation",
  "Split payments — insights",
  "Split payments — self-serve",
  "Split payments — API",
  "Split payments — pilot",
  "Split payments — enterprise",
  "Split payments — starter",
  "Split payments — pro",
  "Split payments — embedded",
  "Split payments — analytics",
  "Loyalty points — lite",
  "Loyalty points — plus",
  "Loyalty points — for teams",
  "Loyalty points — mobile",
  "Loyalty points — international",
  "Loyalty points — automation",
  "Loyalty points — insights",
  "Loyalty points — self-serve",
  "Loyalty points — API",
  "Loyalty points — pilot",
  "Loyalty points — enterprise",
  "Loyalty points — starter",
  "Loyalty points — pro",
  "Loyalty points — embedded",
  "Loyalty points — analytics",
  "Night delivery — lite",
  "Night delivery — plus",
  "Night delivery — for teams",
  "Night delivery — mobile",
  "Night delivery — international",
  "Night delivery — automation",
  "Night delivery — insights",
  "Night delivery — self-serve",
  "Night delivery — API",
  "Night delivery — pilot",
  "Night delivery — enterprise",
  "Night delivery — starter",
  "Night delivery — pro",
  "Night delivery — embedded",
  "Night delivery — analytics",
  "Recipe ideas — lite",
  "Recipe ideas — plus",
  "Recipe ideas — for teams",
  "Recipe ideas — mobile",
  "Recipe ideas — international",
  "Recipe ideas — automation",
  "Recipe ideas — insights",
  "Recipe ideas — self-serve",
  "Recipe ideas — API",
  "Recipe ideas — pilot",
  "Recipe ideas — enterprise",
  "Recipe ideas — starter",
  "Recipe ideas — pro",
  "Recipe ideas — embedded",
  "Recipe ideas — analytics",
  "Idea 321",
  "Idea 322",
  "Idea 323",
  "Idea 324",
  "Idea 325",
  "Idea 326",
  "Idea 327",
  "Idea 328",
  "Idea 329",
  "Idea 330",
  "Idea 331",
  "Idea 332",
  "Idea 333",
  "Idea 334",
  "Idea 335",
  "Idea 336",
  "Idea 337",
  "Idea 338",
  "Idea 339",
  "Idea 340",
  "Idea 341",
  "Idea 342",
  "Idea 343",
  "Idea 344",
  "Idea 345",
  "Idea 346",
  "Idea 347",
  "Idea 348",
  "Idea 349",
  "Idea 350",
  "Idea 351",
  "Idea 352",
  "Idea 353",
  "Idea 354",
  "Idea 355",
  "Idea 356",
  "Idea 357",
  "Idea 358",
  "Idea 359",
  "Idea 360",
  "Idea 361",
  "Idea 362",
  "Idea 363",
  "Idea 364",
  "Idea 365",
  "Idea 366",
  "Idea 367",
  "Idea 368",
  "Idea 369",
  "Idea 370",
  "Idea 371",
  "Idea 372",
  "Idea 373",
  "Idea 374",
  "Idea 375",
  "Idea 376",
  "Idea 377",
  "Idea 378",
  "Idea 379",
  "Idea 380",
  "Idea 381",
  "Idea 382",
  "Idea 383",
  "Idea 384",
  "Idea 385",
  "Idea 386",
  "Idea 387",
  "Idea 388",
  "Idea 389",
  "Idea 390",
  "Idea 391",
  "Idea 392",
  "Idea 393",
  "Idea 394",
  "Idea 395",
  "Idea 396",
  "Idea 397",
  "Idea 398",
  "Idea 399",
  "Idea 400",
  "Idea 401",
  "Idea 402",
  "Idea 403",
  "Idea 404",
  "Idea 405",
  "Idea 406",
  "Idea 407",
  "Idea 408",
  "Idea 409",
  "Idea 410",
  "Idea 411",
  "Idea 412",
  "Idea 413",
  "Idea 414",
  "Idea 415",
  "Idea 416",
  "Idea 417",
  "Idea 418",
  "Idea 419",
  "Idea 420",
  "Idea 421",
  "Idea 422",
  "Idea 423",
  "Idea 424",
  "Idea 425",
  "Idea 426",
  "Idea 427",
  "Idea 428",
  "Idea 429",
  "Idea 430",
  "Idea 431",
  "Idea 432",
  "Idea 433",
  "Idea 434",
  "Idea 435",
  "Idea 436",
  "Idea 437",
  "Idea 438",
  "Idea 439",
  "Idea 440"
];

/** 320 one-on-one conversation templates. */
export const ONE_ON_ONE_TALKS: readonly TalkTemplate[] = [
  {
    "mood": "stressed",
    "says": "I'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "I'm drowning in tickets this week — any advice?",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "Honestly, i'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "Quick check-in: i'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "Can we talk? I'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "I really'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "I'm drowning in tickets this week, and it's wearing on me.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "I'm drowning in tickets this week before the deadline.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "Not sure how to say this, but i'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "I'm drowning in tickets this week — wanted your take.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "1:1 note: i'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "I'm drowning in tickets this week — could use guidance.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "Heads up: i'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "I'm drowning in tickets this week and I'm not sure what to do.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "Between us: i'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "I'm drowning in tickets this week — mind if we discuss?",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "Small thing: i'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "I'm drowning in tickets this week for a while now.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "Sorry to bother you, but i'm drowning in tickets this week.",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "stressed",
    "says": "I'm drowning in tickets this week — your call?",
    "right": "Let's move two of them to next week.",
    "wrong": [
      "Great, I'll add one more.",
      "Just work a bit faster."
    ]
  },
  {
    "mood": "bored",
    "says": "I've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "I've done the same fix ten times now — any advice?",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "Honestly, i've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "Quick check-in: i've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "Can we talk? I've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "I really've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "I've done the same fix ten times now, and it's wearing on me.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "I've done the same fix ten times now before the deadline.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "Not sure how to say this, but i've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "I've done the same fix ten times now — wanted your take.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "1:1 note: i've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "I've done the same fix ten times now — could use guidance.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "Heads up: i've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "I've done the same fix ten times now and I'm not sure what to do.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "Between us: i've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "I've done the same fix ten times now — mind if we discuss?",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "Small thing: i've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "I've done the same fix ten times now for a while now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "Sorry to bother you, but i've done the same fix ten times now.",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "bored",
    "says": "I've done the same fix ten times now — your call?",
    "right": "Want to try the new payment feature?",
    "wrong": [
      "That's just the job.",
      "Take a longer lunch."
    ]
  },
  {
    "mood": "proud",
    "says": "I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "Honestly, i shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "Quick check-in: i shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "Can we talk? I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "I really shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "Not sure how to say this, but i shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "1:1 note: i shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "Heads up: i shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "Between us: i shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "Small thing: i shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "Sorry to bother you, but i shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "proud",
    "says": "I shipped the login page!",
    "right": "Nice work. Show it at the team demo.",
    "wrong": [
      "Took you long enough.",
      "Okay. What's next?"
    ]
  },
  {
    "mood": "stuck",
    "says": "I can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I can't figure out this bug — any advice?",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Honestly, i can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Quick check-in: i can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Can we talk? I can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I really can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I can't figure out this bug, and it's wearing on me.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I can't figure out this bug before the deadline.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Not sure how to say this, but i can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I can't figure out this bug — wanted your take.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "1:1 note: i can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I can't figure out this bug — could use guidance.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Heads up: i can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I can't figure out this bug and I'm not sure what to do.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Between us: i can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I can't figure out this bug — mind if we discuss?",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Small thing: i can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I can't figure out this bug for a while now.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Sorry to bother you, but i can't figure out this bug.",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I can't figure out this bug — your call?",
    "right": "Let's look at it together for twenty minutes.",
    "wrong": [
      "Figure it out yourself.",
      "Just skip it."
    ]
  },
  {
    "mood": "tired",
    "says": "I stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "I stayed late three nights in a row — any advice?",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "Honestly, i stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "Quick check-in: i stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "Can we talk? I stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "I really stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "I stayed late three nights in a row, and it's wearing on me.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "I stayed late three nights in a row before the deadline.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "Not sure how to say this, but i stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "I stayed late three nights in a row — wanted your take.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "1:1 note: i stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "I stayed late three nights in a row — could use guidance.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "Heads up: i stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "I stayed late three nights in a row and I'm not sure what to do.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "Between us: i stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "I stayed late three nights in a row — mind if we discuss?",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "Small thing: i stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "I stayed late three nights in a row for a while now.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "Sorry to bother you, but i stayed late three nights in a row.",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "tired",
    "says": "I stayed late three nights in a row — your call?",
    "right": "Take tomorrow morning off.",
    "wrong": [
      "Keep it up!",
      "Everyone does that."
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Honestly, am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Quick check-in: am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Can we talk? Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I really doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Not sure how to say this, but am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "1:1 note: am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Heads up: am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Between us: am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Small thing: am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Sorry to bother you, but am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Am I doing okay here?",
    "right": "Yes. Here's what you did well this month.",
    "wrong": [
      "Hard to say.",
      "Why do you ask?"
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking — any advice?",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Honestly, someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Quick check-in: someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Can we talk? Someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking, and it's wearing on me.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking before the deadline.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Not sure how to say this, but someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking — wanted your take.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "1:1 note: someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking — could use guidance.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Heads up: someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking and I'm not sure what to do.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Between us: someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking — mind if we discuss?",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Small thing: someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking for a while now.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Sorry to bother you, but someone keeps changing my work without asking.",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "upset",
    "says": "Someone keeps changing my work without asking — your call?",
    "right": "Let's all agree on a plan together.",
    "wrong": [
      "Just ignore them.",
      "Change their work back."
    ]
  },
  {
    "mood": "leaving",
    "says": "I got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "I got another job offer — any advice?",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "Honestly, i got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "Quick check-in: i got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "Can we talk? I got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "I really got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "I got another job offer, and it's wearing on me.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "I got another job offer before the deadline.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "Not sure how to say this, but i got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "I got another job offer — wanted your take.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "1:1 note: i got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "I got another job offer — could use guidance.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "Heads up: i got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "I got another job offer and I'm not sure what to do.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "Between us: i got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "I got another job offer — mind if we discuss?",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "Small thing: i got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "I got another job offer for a while now.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "Sorry to bother you, but i got another job offer.",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "leaving",
    "says": "I got another job offer — your call?",
    "right": "Thanks for telling me. What would make you stay?",
    "wrong": [
      "Good luck, bye.",
      "You can't leave."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible — any advice?",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "Honestly, the launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "Quick check-in: the launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "Can we talk? The launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible, and it's wearing on me.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible before the deadline.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "Not sure how to say this, but the launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible — wanted your take.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "1:1 note: the launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible — could use guidance.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "Heads up: the launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible and I'm not sure what to do.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "Between us: the launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible — mind if we discuss?",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "Small thing: the launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible for a while now.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "Sorry to bother you, but the launch date feels impossible.",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "stressed",
    "says": "The launch date feels impossible — your call?",
    "right": "Let's cut the plan down to what matters most.",
    "wrong": [
      "It's fine, just stay late.",
      "Launches are always like that."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week — any advice?",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Honestly, meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Quick check-in: meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Can we talk? Meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week, and it's wearing on me.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week before the deadline.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Not sure how to say this, but meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week — wanted your take.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "1:1 note: meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week — could use guidance.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Heads up: meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week and I'm not sure what to do.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Between us: meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week — mind if we discuss?",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Small thing: meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week for a while now.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Sorry to bother you, but meetings take up my whole week.",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "bored",
    "says": "Meetings take up my whole week — your call?",
    "right": "Let's drop the ones you don't need to be in.",
    "wrong": [
      "Meetings build character.",
      "Try to enjoy them more."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "Honestly, a customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "Quick check-in: a customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "Can we talk? A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "Not sure how to say this, but a customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "1:1 note: a customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "Heads up: a customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "Between us: a customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "Small thing: a customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "Sorry to bother you, but a customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "proud",
    "says": "A customer wrote to thank me!",
    "right": "That's great. Share it with the whole team.",
    "wrong": [
      "Customers say lots of things.",
      "Back to work, then."
    ]
  },
  {
    "mood": "stuck",
    "says": "I don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I don't understand the new tool — any advice?",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Honestly, i don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Quick check-in: i don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Can we talk? I don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I really don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I don't understand the new tool, and it's wearing on me.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I don't understand the new tool before the deadline.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Not sure how to say this, but i don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I don't understand the new tool — wanted your take.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "1:1 note: i don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I don't understand the new tool — could use guidance.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Heads up: i don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I don't understand the new tool and I'm not sure what to do.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Between us: i don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I don't understand the new tool — mind if we discuss?",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Small thing: i don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I don't understand the new tool for a while now.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "Sorry to bother you, but i don't understand the new tool.",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "stuck",
    "says": "I don't understand the new tool — your call?",
    "right": "Let's book an hour with someone who knows it.",
    "wrong": [
      "Read the manual again.",
      "Everyone else gets it."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night — any advice?",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "Honestly, my baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "Quick check-in: my baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "Can we talk? My baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night, and it's wearing on me.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night before the deadline.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "Not sure how to say this, but my baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night — wanted your take.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "1:1 note: my baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night — could use guidance.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "Heads up: my baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night and I'm not sure what to do.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "Between us: my baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night — mind if we discuss?",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "Small thing: my baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night for a while now.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "Sorry to bother you, but my baby kept me up all night.",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "tired",
    "says": "My baby kept me up all night — your call?",
    "right": "Take it easy today. Start late if you need to.",
    "wrong": [
      "That's not a work problem.",
      "Coffee fixes that."
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Honestly, should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Quick check-in: should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Can we talk? Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I really try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Not sure how to say this, but should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "1:1 note: should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Heads up: should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Between us: should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Small thing: should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Sorry to bother you, but should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "unsure",
    "says": "Should I try for a promotion?",
    "right": "Yes. Let's write down what you need together.",
    "wrong": [
      "Maybe in a few years.",
      "Why would you want that?"
    ]
  },
  {
    "mood": "upset",
    "says": "I wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "I wasn't invited to the big planning meeting — any advice?",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "Honestly, i wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "Quick check-in: i wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "Can we talk? I wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "I really wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "I wasn't invited to the big planning meeting, and it's wearing on me.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "I wasn't invited to the big planning meeting before the deadline.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "Not sure how to say this, but i wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "I wasn't invited to the big planning meeting — wanted your take.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "1:1 note: i wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "I wasn't invited to the big planning meeting — could use guidance.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "Heads up: i wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "I wasn't invited to the big planning meeting and I'm not sure what to do.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "Between us: i wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "I wasn't invited to the big planning meeting — mind if we discuss?",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "Small thing: i wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "I wasn't invited to the big planning meeting for a while now.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "Sorry to bother you, but i wasn't invited to the big planning meeting.",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "upset",
    "says": "I wasn't invited to the big planning meeting — your call?",
    "right": "You should be there. I'll add you now.",
    "wrong": [
      "It wasn't that important.",
      "You're too busy anyway."
    ]
  },
  {
    "mood": "leaving",
    "says": "I'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "I'm thinking about moving to another team — any advice?",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "Honestly, i'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "Quick check-in: i'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "Can we talk? I'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "I really'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "I'm thinking about moving to another team, and it's wearing on me.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "I'm thinking about moving to another team before the deadline.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "Not sure how to say this, but i'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "I'm thinking about moving to another team — wanted your take.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "1:1 note: i'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "I'm thinking about moving to another team — could use guidance.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "Heads up: i'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "I'm thinking about moving to another team and I'm not sure what to do.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "Between us: i'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "I'm thinking about moving to another team — mind if we discuss?",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "Small thing: i'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "I'm thinking about moving to another team for a while now.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "Sorry to bother you, but i'm thinking about moving to another team.",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  },
  {
    "mood": "leaving",
    "says": "I'm thinking about moving to another team — your call?",
    "right": "Let's talk about what you'd like to work on.",
    "wrong": [
      "Do what you want.",
      "No one leaves my team."
    ]
  }
];
