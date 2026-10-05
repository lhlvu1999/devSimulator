/** @vitest-environment happy-dom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { isSeniorOrAbove } from "../game/ladder";
import { FEEDBACK_EMAIL, SupportPanel } from "./Support";

afterEach(cleanup);

describe("support tab", () => {
  it("opens at Senior on either track", () => {
    expect(isSeniorOrAbove("mid")).toBe(false);
    expect(isSeniorOrAbove("senior")).toBe(true);
    expect(isSeniorOrAbove("principal")).toBe(true);
    expect(isSeniorOrAbove("lead")).toBe(true);
  });

  it("stays locked before Senior", () => {
    render(<SupportPanel level="mid" />);
    expect(screen.getByText("Unlocks at Senior engineer")).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("shows the coffee QR and a clickable feedback email at Senior", () => {
    render(<SupportPanel level="senior" />);
    expect(
      screen.getByRole("img", { name: "Bank transfer QR code for a coffee" }),
    ).toBeTruthy();
    const email = screen.getByRole("link", { name: FEEDBACK_EMAIL });
    expect(email.getAttribute("href")).toMatch(
      new RegExp(`^mailto:${FEEDBACK_EMAIL}`),
    );
  });
});
