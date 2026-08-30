import { beforeEach, describe, expect, it } from "vitest";
import { resetState, subscribe } from "../src/store";
import { dismiss_walls } from "../src/tools";

describe("tools notify the store", () => {
  beforeEach(() => {
    resetState();
  });

  it("dismiss_walls triggers subscribe", () => {
    let n = 0;
    subscribe(() => {
      n += 1;
    });
    dismiss_walls();
    expect(n).toBe(1);
  });
});