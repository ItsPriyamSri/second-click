import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("dummy files", () => {
  it("real file is exactly one dry line", () => {
    const body = readFileSync(
      resolve("public/you-clicked-once.txt"),
      "utf8",
    );
    expect(body).toBe("you clicked once.\n");
  });

  it("decoy page contains the ad line", () => {
    const body = readFileSync(resolve("public/this-was-the-ad.html"), "utf8");
    expect(body).toContain("this was the ad.");
  });
});