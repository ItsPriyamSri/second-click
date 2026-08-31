import { afterEach, describe, expect, it } from "vitest";
import {
  parseToolInput,
  registerSiteTools,
  SITE_TOOL_NAMES,
  waitForToolContexts,
} from "../src/webmcp";

afterEach(() => {
  Reflect.deleteProperty(globalThis, "document");
});

describe("parseToolInput", () => {
  it("reads a JSON string the way Chrome executeTool passes args", () => {
    expect(parseToolInput('{"id":"dl-swap"}')).toEqual({ id: "dl-swap" });
  });

  it("passes objects through", () => {
    expect(parseToolInput({ id: "dl-real" })).toEqual({ id: "dl-real" });
  });

  it("treats empty as {}", () => {
    expect(parseToolInput(undefined)).toEqual({});
    expect(parseToolInput("not-json")).toEqual({});
  });
});

describe("registerSiteTools", () => {
  it("registers nothing in Node without modelContext", async () => {
    const r = await registerSiteTools(0);
    expect(r).toEqual({ registered: [] });
    expect(await waitForToolContexts(0)).toEqual([]);
  });

  it("registers all ten tools when document.modelContext exists", async () => {
    const names: string[] = [];
    let reveal: ((input: unknown) => Promise<unknown>) | undefined;
    (globalThis as { document?: unknown }).document = {
      modelContext: {
        registerTool: async (tool: {
          name: string;
          execute: (input: unknown) => Promise<unknown>;
        }) => {
          names.push(tool.name);
          if (tool.name === "reveal_second_url") reveal = tool.execute;
        },
      },
    };
    const r = await registerSiteTools(0);
    expect(r.registered).toEqual(SITE_TOOL_NAMES);
    expect(names).toEqual(SITE_TOOL_NAMES);
    expect(SITE_TOOL_NAMES).toHaveLength(10);
    const out = (await reveal?.('{"id":"missing"}')) as {
      error?: string;
      content?: { type: string; text: string }[];
    };
    expect(out?.error).toBe("unknown_id");
    expect(out?.content?.[0]?.text).toContain("unknown_id");
  });
});
