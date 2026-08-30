import { describe, it, expect, beforeEach } from "vitest";
import { getState, setState, subscribe, resetState } from "../src/store";
import { createInitialState } from "../src/state";

describe("store", () => {
  beforeEach(() => {
    resetState();
  });

  it("starts as the initial page", () => {
    expect(getState()).toEqual(createInitialState());
  });

  it("notifies subscribers on setState", () => {
    let n = 0;
    const off = subscribe(() => {
      n += 1;
    });
    setState({ ...getState(), personGateDone: true });
    expect(n).toBe(1);
    expect(getState().personGateDone).toBe(true);
    off();
    setState({ ...getState(), personGateDone: false });
    expect(n).toBe(1);
  });
});