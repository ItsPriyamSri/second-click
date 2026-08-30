import { describe, it, expect } from "vitest";
import { createInitialState, coreVisible } from "../src/state";

describe("createInitialState", () => {
  it("starts in the door with all walls up and no person gate", () => {
    const s = createInitialState();
    expect(s.room).toBe("door");
    expect(s.walls).toEqual({ cookie: true, notify: true, signup: true });
    expect(s.personGateDone).toBe(false);
    expect(s.highlightedId).toBeNull();
    expect(s.dimmedIds).toEqual([]);
    expect(s.revealedIds).toEqual([]);
    expect(s.chainVisibleFor).toBeNull();
    expect(s.explain).toBeNull();
    expect(s.confirmArmed).toBe(false);
    expect(s.confirmOpen).toBe(false);
  });
});

describe("coreVisible", () => {
  it("lists every up wall and the person gate", () => {
    const s = createInitialState();
    expect(coreVisible(s)).toEqual({
      visible: false,
      blocking: ["cookie", "notify", "signup", "person_gate"],
    });
  });

  it("is visible only on field or hops after walls and gate", () => {
    const s = createInitialState();
    s.walls = { cookie: false, notify: false, signup: false };
    s.personGateDone = true;
    s.room = "field";
    expect(coreVisible(s)).toEqual({ visible: true, blocking: [] });
  });
});