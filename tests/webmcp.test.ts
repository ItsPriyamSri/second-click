import { describe, expect, it } from "vitest";
import { registerSiteTools } from "../src/webmcp";

describe("registerSiteTools", () => {
  it("registers nothing in Node without modelContext", async () => {
    const r = await registerSiteTools();
    expect(r).toEqual({ registered: [] });
  });
});