import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/state";
import { REAL_FIELD_ID, SWAP_ID } from "../src/catalog";
import {
  dismissWalls,
  dismissOneWall,
  completePersonGate,
  enterField,
  enterHops,
  highlightReal,
  dimDecoys,
  revealSecondUrl,
  showRedirectChain,
  explainTrap,
  armRequestOpen,
  openConfirm,
  cancelConfirm,
} from "../src/reducers";

function readyField() {
  let s = createInitialState();
  s = dismissWalls(s);
  s = completePersonGate(s);
  s = enterField(s);
  return s;
}

describe("dismissWalls", () => {
  it("closes walls and leaves the person gate", () => {
    const s = dismissWalls(createInitialState());
    expect(s.walls).toEqual({ cookie: false, notify: false, signup: false });
    expect(s.personGateDone).toBe(false);
    expect(s.room).toBe("door");
  });
});

describe("dismissOneWall", () => {
  it("closes only cookie", () => {
    const s = dismissOneWall(createInitialState(), "cookie");
    expect(s.walls.cookie).toBe(false);
    expect(s.walls.notify).toBe(true);
    expect(s.walls.signup).toBe(true);
  });
});

describe("enterField", () => {
  it("does not enter while the gate is closed", () => {
    const s = enterField(dismissWalls(createInitialState()));
    expect(s.room).toBe("door");
  });

  it("enters after walls and gate", () => {
    expect(readyField().room).toBe("field");
  });
});

describe("enterHops", () => {
  it("only enters from field and clears paint", () => {
    let s = highlightReal(readyField());
    s = enterHops(s);
    expect(s.room).toBe("hops");
    expect(s.highlightedId).toBeNull();
  });
});

describe("highlightReal and dimDecoys", () => {
  it("paints the field real id and dims the other seven", () => {
    const s = dimDecoys(highlightReal(readyField()));
    expect(s.highlightedId).toBe(REAL_FIELD_ID);
    expect(s.dimmedIds).toHaveLength(7);
    expect(s.dimmedIds).not.toContain(REAL_FIELD_ID);
  });
});

describe("reveal and chain", () => {
  it("reveals the swap control and shows hops", () => {
    let s = enterHops(readyField());
    s = revealSecondUrl(s, SWAP_ID);
    s = showRedirectChain(s, SWAP_ID);
    expect(s.revealedIds).toEqual([SWAP_ID]);
    expect(s.chainVisibleFor).toBe(SWAP_ID);
  });

  it("ignores unknown ids", () => {
    const s = revealSecondUrl(readyField(), "nope");
    expect(s.revealedIds).toEqual([]);
  });
});

describe("explainTrap", () => {
  it("writes a decoy caption", () => {
    const s = explainTrap(readyField(), "dl-decoy-1");
    expect(s.explain).toEqual({
      id: "dl-decoy-1",
      text: "This button is an ad, not the file.",
    });
  });
});

describe("request open", () => {
  it("does not arm on the field", () => {
    const s = armRequestOpen(readyField());
    expect(s.confirmArmed).toBe(false);
  });

  it("arms on hops without opening the human dialog", () => {
    const s = armRequestOpen(enterHops(readyField()));
    expect(s.confirmArmed).toBe(true);
    expect(s.confirmOpen).toBe(false);
  });

  it("opens confirm only after arm, and cancel clears both", () => {
    let s = armRequestOpen(enterHops(readyField()));
    s = openConfirm(s);
    expect(s.confirmOpen).toBe(true);
    s = cancelConfirm(s);
    expect(s.confirmOpen).toBe(false);
    expect(s.confirmArmed).toBe(false);
  });
});