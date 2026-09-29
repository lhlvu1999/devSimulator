/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { App } from "./App";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

it("starts on the tic-tac-toe placement board", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "Placement" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Center" }));
  expect(screen.getByRole("button", { name: "Center" }).textContent).toBe("X");
});
