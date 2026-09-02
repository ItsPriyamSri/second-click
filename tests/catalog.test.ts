import { describe, it, expect } from "vitest";
import { getClickables, REAL_FIELD_ID, SWAP_ID } from "../src/catalog";

describe("getClickables", () => {
  it("returns nothing in the door", () => {
    expect(getClickables("door")).toEqual([]);
  });

  it("returns eight field buttons with one real id", () => {
    const list = getClickables("field");
    expect(list).toHaveLength(8);
    const reals = list.filter((c) => c.kind === "real");
    expect(reals).toHaveLength(1);
    expect(reals[0].id).toBe(REAL_FIELD_ID);
    expect(reals[0].trapType).toBe("none");
    expect(list.filter((c) => c.kind === "decoy")).toHaveLength(7);
  });

  it("returns the two-url control in hops", () => {
    const list = getClickables("hops");
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(SWAP_ID);
    expect(list[0].kind).toBe("two_url");
    expect(list[0].shownUrl).toBe("/ads/click-here");
    expect(list[0].secondUrl).toBe("/you-clicked-once.html");
    expect(list[0].hops).toEqual([
      "/ads/click-here",
      "/you-clicked-once.html",
    ]);
  });
});