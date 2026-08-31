import {
  dim_decoys,
  dismiss_walls,
  explain_trap,
  get_core_visible,
  get_page_state,
  highlight_real,
  list_clickables,
  request_open,
  reveal_second_url,
  show_redirect_chain,
} from "./tools";

type ToolInput = Record<string, unknown>;

type ToolContext = {
  registerTool: (opts: {
    name: string;
    description: string;
    inputSchema: object;
    annotations?: { readOnlyHint?: boolean };
    execute: (input: unknown) => unknown;
  }) => unknown;
};

export type WebmcpStatus = { count: number; text: string };

let status: WebmcpStatus = {
  count: -1,
  text: "Site tools: waiting for document.modelContext…",
};

export function getWebmcpStatus(): WebmcpStatus {
  return status;
}

export function setWebmcpStatus(next: WebmcpStatus): void {
  status = next;
}

export function parseToolInput(input: unknown): ToolInput {
  if (input == null) return {};
  if (typeof input === "string") {
    try {
      const parsed: unknown = JSON.parse(input);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as ToolInput;
      }
    } catch {
      return {};
    }
    return {};
  }
  if (typeof input === "object" && !Array.isArray(input)) {
    return input as ToolInput;
  }
  return {};
}

function contextOf(host: unknown): ToolContext | null {
  if (!host || typeof host !== "object") return null;
  const ctx = (host as { modelContext?: ToolContext }).modelContext;
  return ctx && typeof ctx.registerTool === "function" ? ctx : null;
}

export function listToolContexts(): ToolContext[] {
  const found: ToolContext[] = [];
  const seen = new Set<ToolContext>();
  const hosts: unknown[] = [];
  if (typeof document !== "undefined") hosts.push(document);
  if (typeof navigator !== "undefined") hosts.push(navigator);
  if (typeof window !== "undefined") hosts.push(window);
  for (const host of hosts) {
    const ctx = contextOf(host);
    if (ctx && !seen.has(ctx)) {
      seen.add(ctx);
      found.push(ctx);
    }
  }
  return found;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForToolContexts(
  timeoutMs: number,
): Promise<ToolContext[]> {
  const start = Date.now();
  let found = listToolContexts();
  while (found.length === 0 && Date.now() - start < timeoutMs) {
    await sleep(50);
    found = listToolContexts();
  }
  return found;
}

const empty = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

const withId = {
  type: "object",
  properties: {
    id: { type: "string", description: "Clickable id" },
  },
  required: ["id"],
  additionalProperties: false,
};

type Spec = {
  name: string;
  description: string;
  inputSchema: object;
  readOnly?: boolean;
  run: (input: ToolInput) => ToolInput;
};

const specs: Spec[] = [
  {
    name: "get_page_state",
    description: "Read room, walls, paint, and confirm flags.",
    inputSchema: empty,
    readOnly: true,
    run: () => get_page_state(),
  },
  {
    name: "dismiss_walls",
    description:
      "Close cookie, notify, and signup sheets. Does not complete the person gate.",
    inputSchema: empty,
    run: () => dismiss_walls(),
  },
  {
    name: "list_clickables",
    description:
      "List download-like controls in the current room with shown and second URLs.",
    inputSchema: empty,
    readOnly: true,
    run: () => list_clickables(),
  },
  {
    name: "reveal_second_url",
    description: "Write shown vs second-click URL on the page for one control.",
    inputSchema: withId,
    run: (input) => reveal_second_url(input),
  },
  {
    name: "explain_trap",
    description: "Write a one-line agent caption on one control.",
    inputSchema: withId,
    run: (input) => explain_trap(input),
  },
  {
    name: "show_redirect_chain",
    description: "Write the declared hop list for one control. Does not fetch.",
    inputSchema: withId,
    run: (input) => show_redirect_chain(input),
  },
  {
    name: "highlight_real",
    description: "Paint the real download path in this room.",
    inputSchema: empty,
    run: () => highlight_real(),
  },
  {
    name: "dim_decoys",
    description: "Dim decoy buttons in the field room.",
    inputSchema: empty,
    run: () => dim_decoys(),
  },
  {
    name: "request_open",
    description:
      "Ask the human to confirm the dummy file. Does not download.",
    inputSchema: empty,
    run: () => request_open(),
  },
  {
    name: "get_core_visible",
    description:
      "Whether junk walls are gone and the core download UI is showing.",
    inputSchema: empty,
    readOnly: true,
    run: () => get_core_visible(),
  },
];

export const SITE_TOOL_NAMES = specs.map((spec) => spec.name);

function packResult(result: ToolInput): ToolInput {
  return {
    ...result,
    content: [{ type: "text", text: JSON.stringify(result) }],
  };
}

export async function registerSiteTools(
  timeoutMs?: number,
): Promise<{ registered: string[] }> {
  const budget =
    timeoutMs ?? (typeof document === "undefined" ? 0 : 20_000);
  const contexts = await waitForToolContexts(budget);
  if (contexts.length === 0) return { registered: [] };

  const registered: string[] = [];
  for (const spec of specs) {
    const tool = {
      name: spec.name,
      description: spec.description,
      inputSchema: spec.inputSchema,
      ...(spec.readOnly ? { annotations: { readOnlyHint: true } } : {}),
      execute: async (input: unknown) =>
        packResult(spec.run(parseToolInput(input))),
    };
    let ok = false;
    for (const ctx of contexts) {
      try {
        await ctx.registerTool(tool);
        ok = true;
      } catch {
        // Duplicate name on a second context, or a picky host. Keep going.
      }
    }
    if (ok) registered.push(spec.name);
  }
  return { registered };
}
