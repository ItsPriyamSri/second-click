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

type Registrar = (opts: {
  name: string;
  description: string;
  inputSchema: object;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: ToolInput) => unknown;
}) => unknown;

function registrar(): Registrar | null {
  if (typeof document === "undefined") return null;
  const ctx = (
    document as Document & {
      modelContext?: { registerTool?: Registrar };
    }
  ).modelContext;
  return typeof ctx?.registerTool === "function" ? ctx.registerTool.bind(ctx) : null;
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

export async function registerSiteTools(): Promise<{ registered: string[] }> {
  const register = registrar();
  if (!register) return { registered: [] };

  const specs: Array<{
    name: string;
    description: string;
    inputSchema: object;
    readOnly?: boolean;
    execute: (input: ToolInput) => unknown;
  }> = [
    {
      name: "get_page_state",
      description: "Read room, walls, paint, and confirm flags.",
      inputSchema: empty,
      readOnly: true,
      execute: () => get_page_state(),
    },
    {
      name: "dismiss_walls",
      description:
        "Close cookie, notify, and signup sheets. Does not complete the person gate.",
      inputSchema: empty,
      execute: () => dismiss_walls(),
    },
    {
      name: "list_clickables",
      description:
        "List download-like controls in the current room with shown and second URLs.",
      inputSchema: empty,
      readOnly: true,
      execute: () => list_clickables(),
    },
    {
      name: "reveal_second_url",
      description: "Write shown vs second-click URL on the page for one control.",
      inputSchema: withId,
      execute: (input) => reveal_second_url(input),
    },
    {
      name: "show_redirect_chain",
      description: "Write the declared hop list for one control. Does not fetch.",
      inputSchema: withId,
      execute: (input) => show_redirect_chain(input),
    },
    {
      name: "highlight_real",
      description: "Paint the real download path in this room.",
      inputSchema: empty,
      execute: () => highlight_real(),
    },
    {
      name: "dim_decoys",
      description: "Dim decoy buttons in the field room.",
      inputSchema: empty,
      execute: () => dim_decoys(),
    },
    {
      name: "explain_trap",
      description: "Write a one-line agent caption on one control.",
      inputSchema: withId,
      execute: (input) => explain_trap(input),
    },
    {
      name: "request_open",
      description:
        "Ask the human to confirm the dummy file. Does not download.",
      inputSchema: empty,
      execute: () => request_open(),
    },
    {
      name: "get_core_visible",
      description:
        "Whether junk walls are gone and the core download UI is showing.",
      inputSchema: empty,
      readOnly: true,
      execute: () => get_core_visible(),
    },
  ];

  const registered: string[] = [];
  for (const spec of specs) {
    await register({
      name: spec.name,
      description: spec.description,
      inputSchema: spec.inputSchema,
      annotations: spec.readOnly ? { readOnlyHint: true } : undefined,
      execute: spec.execute,
    });
    registered.push(spec.name);
  }
  return { registered };
}