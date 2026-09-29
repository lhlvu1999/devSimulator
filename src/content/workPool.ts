export type TaskKind = "glitch" | "steps" | "request";

export type WorkTask = {
  id: string;
  kind: TaskKind;
  scene: "picnic" | "shop" | "save" | "photo" | "color" | "both";
  label: string;
  detail: string;
};

export const WORK_POOL: WorkTask[] = [
  {
    id: "picnic-glitch",
    kind: "glitch",
    scene: "picnic",
    label: "Fix the picnic app",
    detail: "Tap the part a customer would not want.",
  },
  {
    id: "shop-glitch",
    kind: "glitch",
    scene: "shop",
    label: "Fix the ticket shop",
    detail: "Tap what does not match the sign.",
  },
  {
    id: "save-steps",
    kind: "steps",
    scene: "save",
    label: "Teach Save what to do",
    detail: "Tap the steps in the order they should happen.",
  },
  {
    id: "photo-steps",
    kind: "steps",
    scene: "photo",
    label: "Teach the camera button",
    detail: "Put the steps in the order a person would do them.",
  },
  {
    id: "color-request",
    kind: "request",
    scene: "color",
    label: "Make the button they asked for",
    detail: "Match the request. No code, just the look.",
  },
  {
    id: "both-request",
    kind: "request",
    scene: "both",
    label: "Match two requests",
    detail: "Color and words. Change only what they asked.",
  },
];
