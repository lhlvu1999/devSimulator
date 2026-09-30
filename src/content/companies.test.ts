import { describe, expect, it } from "vitest";
import { COMPANIES } from "./companies";
import { HEADLINE_TEMPLATE_COUNT, STOCKS } from "../game/market";

describe("company and market pools", () => {
  it("lists at least sixteen hiring companies and twenty stocks", () => {
    expect(COMPANIES.length).toBeGreaterThanOrEqual(16);
    expect(STOCKS.length).toBeGreaterThanOrEqual(20);
  });

  it("links every listed employer stock to a Workline company", () => {
    for (const stock of STOCKS) {
      if (!stock.companyId) continue;
      expect(COMPANIES.some((company) => company.id === stock.companyId)).toBe(
        true,
      );
    }
  });

  it("has doubled good and bad headline templates", () => {
    expect(HEADLINE_TEMPLATE_COUNT.good).toBeGreaterThanOrEqual(12);
    expect(HEADLINE_TEMPLATE_COUNT.bad).toBeGreaterThanOrEqual(12);
  });
});
