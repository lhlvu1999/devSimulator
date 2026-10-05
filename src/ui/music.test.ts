/** @vitest-environment happy-dom */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useSoundMix } from "./music";

describe("background sound mix", () => {
  beforeEach(() => localStorage.clear());

  it("starts with both lofi and keyboard on", () => {
    const { result } = renderHook(() => useSoundMix());
    expect(result.current[0]).toEqual({ lofi: true, keys: true });
  });

  it("keeps a player's old Music off switch as both off", () => {
    localStorage.setItem("dev-simulator-music", "off");
    const { result } = renderHook(() => useSoundMix());
    expect(result.current[0]).toEqual({ lofi: false, keys: false });
  });

  it("saves each layer on its own, so one, both, or none can play", () => {
    const { result } = renderHook(() => useSoundMix());
    act(() => result.current[1]("keys", false));
    expect(result.current[0]).toEqual({ lofi: true, keys: false });
    act(() => result.current[1]("lofi", false));
    expect(result.current[0]).toEqual({ lofi: false, keys: false });
    act(() => result.current[1]("keys", true));
    expect(result.current[0]).toEqual({ lofi: false, keys: true });

    const reopened = renderHook(() => useSoundMix());
    expect(reopened.result.current[0]).toEqual({ lofi: false, keys: true });
  });
});
