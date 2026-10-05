/** @vitest-environment happy-dom */
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { App } from "./App";
import { createCareer } from "./game/career";
import { jumpToLevel, topUp } from "./game/sandbox";
import { saveGame } from "./game/save";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

function renderHired() {
  saveGame(topUp(jumpToLevel(createCareer(), "junior")));
  render(<App />);
}

it("buys from the shop with a clear button and a receipt", () => {
  renderHired();
  fireEvent.click(screen.getByRole("button", { name: "Shop" }));
  expect(screen.getByRole("heading", { name: "Shop" })).toBeTruthy();
  expect(screen.queryByText("Looks")).toBeNull();
  const coffee = screen.getByText("Coffee").closest("li");
  fireEvent.click(within(coffee as HTMLElement).getByRole("button"));
  expect(screen.getByRole("status").textContent).toContain("Coffee");
});

it("keeps Start over behind a confirm on the Me tab", () => {
  renderHired();
  fireEvent.click(screen.getByRole("button", { name: "Me" }));
  fireEvent.click(screen.getByRole("button", { name: /Start a new life/ }));
  fireEvent.click(screen.getByRole("button", { name: "Start over" }));
  expect(screen.getByRole("heading", { name: "Dev Simulator" })).toBeTruthy();
});

it("opens on the title screen, then the entry test", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "Dev Simulator" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  expect(screen.getByRole("heading", { name: "Entry test" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Center" }));
  expect(screen.getByRole("button", { name: "Center: X" }).dataset.mark).toBe(
    "X",
  );
});
