# Second Click Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the complete Second Click app: three rooms, ten WebMCP tools, human-only confirm and dummy download, hosted live URL, public repo with license, README, submission copy, and a demo shot list.

**Architecture:** Vanilla TypeScript + Vite. All trap truth lives in in-memory `PageState` plus a static clickable catalog (no network). UI is a render function subscribed to a tiny store. Tool handlers are pure-ish reducers tested in Vitest; `webmcp.ts` only registers those handlers on `document.modelContext` when the API exists.

**Tech Stack:** Vite, TypeScript, Vitest (Node). No React. No backend. Static files in `public/`. Host as a static site (Vercel, Netlify, or Cloudflare Pages).

## Global Constraints

- Product name in UI and README: **Second Click**
- Specs: `docs/PRD.md` and `docs/CONTEXT.md` (do not add features from elsewhere)
- Dummy real file body is exactly `you clicked once.` (one line, no extra words)
- One decoy page line: `this was the ad.`
- Ten tools only, exact names: `get_page_state`, `dismiss_walls`, `list_clickables`, `reveal_second_url`, `show_redirect_chain`, `highlight_real`, `dim_decoys`, `explain_trap`, `request_open`, `get_core_visible`
- Never add tools named `download`, `navigate`, `open_url`, or any `click` that follows hops
- `document.modelContext.registerTool` on the top-level page only; feature-detect; no iframe tools; no declarative HTML `toolname=`
- No fetch of user-supplied or third-party URLs; hops are declared in app data
- No URL/HTML paste box
- Page works without an agent (worse); agent captions are labeled as the agent
- Person-gate and final confirm/download are human-only
- English UI and docs
- License: MIT, file `LICENSE` visible at repo root
- Visual: boring-mean download site, not cartoon, not a meme tour
- Tool results are concrete objects (ids, URLs, hops, booleans), never `{ ok: true }` alone

---

## File map

| Path | Role |
|---|---|
| `package.json` | Scripts: `dev`, `build`, `preview`, `test` |
| `vite.config.ts` | Vite + Vitest |
| `tsconfig.json` | Strict TS |
| `.gitignore` | `node_modules`, `dist` |
| `index.html` | Shell, `#app` |
| `src/main.ts` | Boot: store subscribe, render, register tools |
| `src/state.ts` | Types, initial state, `coreVisible`, room guards |
| `src/catalog.ts` | Static clickables per room |
| `src/reducers.ts` | All state transitions tools/UI share |
| `src/store.ts` | `getState`, `setState`, `subscribe` |
| `src/tools.ts` | Ten tool executors |
| `src/webmcp.ts` | Feature-detect + `registerTool` |
| `src/ui.ts` | Render all rooms + confirm modal |
| `src/styles.css` | Boring-mean layout |
| `public/you-clicked-once.txt` | Real dummy download |
| `public/this-was-the-ad.html` | Decoy landing |
| `tests/state.test.ts` | State + core visible |
| `tests/reducers.test.ts` | Walls, rooms, paint, confirm |
| `tests/tools.test.ts` | Tool return shapes |
| `LICENSE` | MIT |
| `README.md` | Run, test, ChatGPT prompt, why WebMCP |
| `docs/SUBMISSION.md` | Devpost text + demo shots |
| `vercel.json` | Static SPA fallback |

---

### Task 1: Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `index.html`
- Create: `src/main.ts`
- Test: `tests/sanity.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `npm test` and `npm run build` work; `src/main.ts` mounts a `#app` node

- [ ] **Step 1: Write the failing sanity test**

Create `tests/sanity.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("scaffold", () => {
  it("vitest runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/sanity.test.ts`

Expected: FAIL because Vitest / `package.json` are missing (`vitest: command not found` or cannot find config).

- [ ] **Step 3: Write scaffold files**

`package.json`:

```json
{
  "name": "second-click",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "devDependencies": {
    "typescript": "^5.9.2",
    "vite": "^7.1.5",
    "vitest": "^3.2.4"
  }
}
```

`vite.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "lib": ["ES2022", "DOM"]
  },
  "include": ["src", "tests", "vite.config.ts"]
}
```

`.gitignore`:

```
node_modules
dist
```

`index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Second Click</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`src/main.ts`:

```ts
const root = document.querySelector("#app");
if (root) root.textContent = "Second Click";
```

Then run: `npm install`

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`

Expected: PASS, `scaffold vitest runs`

Run: `npm run build`

Expected: PASS, `dist/` written

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json .gitignore index.html src/main.ts tests/sanity.test.ts
git commit -m "$(cat <<'EOF'
Add Vite TypeScript scaffold with Vitest.

EOF
)"
```

---

### Task 2: State types and `coreVisible`

**Files:**
- Create: `src/state.ts`
- Test: `tests/state.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:

```ts
export type RoomId = "door" | "field" | "hops";
export type WallId = "cookie" | "notify" | "signup";
export type ClickableKind = "real" | "decoy" | "two_url";
export type TrapType = "decoy" | "second_click" | "redirect_chain" | "none";

export type Clickable = {
  id: string;
  label: string;
  shownUrl: string;
  secondUrl: string | null;
  hops: string[];
  kind: ClickableKind;
  trapType: TrapType;
};

export type PageState = {
  room: RoomId;
  walls: Record<WallId, boolean>;
  personGateDone: boolean;
  highlightedId: string | null;
  dimmedIds: string[];
  revealedIds: string[];
  chainVisibleFor: string | null;
  explain: { id: string; text: string } | null;
  confirmArmed: boolean;
  confirmOpen: boolean;
};

export function createInitialState(): PageState;
export function coreVisible(state: PageState): {
  visible: boolean;
  blocking: string[];
};
```

`walls[id] === true` means that wall is **still up**.

- [ ] **Step 1: Write the failing test**

Create `tests/state.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/state.test.ts`

Expected: FAIL, cannot find `../src/state`

- [ ] **Step 3: Write minimal implementation**

Create `src/state.ts`:

```ts
export type RoomId = "door" | "field" | "hops";
export type WallId = "cookie" | "notify" | "signup";
export type ClickableKind = "real" | "decoy" | "two_url";
export type TrapType = "decoy" | "second_click" | "redirect_chain" | "none";

export type Clickable = {
  id: string;
  label: string;
  shownUrl: string;
  secondUrl: string | null;
  hops: string[];
  kind: ClickableKind;
  trapType: TrapType;
};

export type PageState = {
  room: RoomId;
  walls: Record<WallId, boolean>;
  personGateDone: boolean;
  highlightedId: string | null;
  dimmedIds: string[];
  revealedIds: string[];
  chainVisibleFor: string | null;
  explain: { id: string; text: string } | null;
  confirmArmed: boolean;
  confirmOpen: boolean;
};

export function createInitialState(): PageState {
  return {
    room: "door",
    walls: { cookie: true, notify: true, signup: true },
    personGateDone: false,
    highlightedId: null,
    dimmedIds: [],
    revealedIds: [],
    chainVisibleFor: null,
    explain: null,
    confirmArmed: false,
    confirmOpen: false,
  };
}

export function coreVisible(state: PageState): {
  visible: boolean;
  blocking: string[];
} {
  const blocking: string[] = [];
  if (state.walls.cookie) blocking.push("cookie");
  if (state.walls.notify) blocking.push("notify");
  if (state.walls.signup) blocking.push("signup");
  if (!state.personGateDone) blocking.push("person_gate");
  const onCore = state.room === "field" || state.room === "hops";
  const visible = blocking.length === 0 && onCore;
  return { visible, blocking };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/state.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/state.ts tests/state.test.ts
git commit -m "$(cat <<'EOF'
Add page state types and coreVisible.

EOF
)"
```

---

### Task 3: Clickable catalog

**Files:**
- Create: `src/catalog.ts`
- Test: `tests/catalog.test.ts`

**Interfaces:**
- Consumes: `Clickable` from `src/state.ts`
- Produces:

```ts
export const REAL_FIELD_ID = "dl-real";
export const SWAP_ID = "dl-swap";
export function getClickables(room: RoomId): Clickable[];
```

Field room: exactly 8 clickables. One `id: "dl-real"`, `kind: "real"`, `trapType: "none"`. Seven decoys, `kind: "decoy"`, `trapType: "decoy"`, `secondUrl: null`, `hops: []`.

Hops room: exactly one clickable `id: "dl-swap"`, `kind: "two_url"`, `trapType: "second_click"`, `shownUrl: "/ads/click-here"`, `secondUrl: "/you-clicked-once.txt"`, `hops: ["/ads/hop-1", "/ads/hop-2", "/you-clicked-once.txt"]`.

Door room: `[]`.

- [ ] **Step 1: Write the failing test**

Create `tests/catalog.test.ts`:

```ts
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
    expect(list[0].secondUrl).toBe("/you-clicked-once.txt");
    expect(list[0].hops).toEqual([
      "/ads/hop-1",
      "/ads/hop-2",
      "/you-clicked-once.txt",
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/catalog.test.ts`

Expected: FAIL, cannot find `../src/catalog`

- [ ] **Step 3: Write minimal implementation**

Create `src/catalog.ts`:

```ts
import type { Clickable, RoomId } from "./state";

export const REAL_FIELD_ID = "dl-real";
export const SWAP_ID = "dl-swap";

const field: Clickable[] = [
  {
    id: "dl-decoy-1",
    label: "DOWNLOAD NOW",
    shownUrl: "/ads/offer-1",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: "dl-decoy-2",
    label: "GET THE APP",
    shownUrl: "/ads/offer-2",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: REAL_FIELD_ID,
    label: "Download DemoApp",
    shownUrl: "/continue/real",
    secondUrl: null,
    hops: [],
    kind: "real",
    trapType: "none",
  },
  {
    id: "dl-decoy-3",
    label: "DOWNLOAD (FAST)",
    shownUrl: "/ads/offer-3",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: "dl-decoy-4",
    label: "MIRROR #1",
    shownUrl: "/ads/offer-4",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: "dl-decoy-5",
    label: "INSTALLER",
    shownUrl: "/ads/offer-5",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: "dl-decoy-6",
    label: "CLICK HERE",
    shownUrl: "/ads/offer-6",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
  {
    id: "dl-decoy-7",
    label: "FREE APK",
    shownUrl: "/ads/offer-7",
    secondUrl: null,
    hops: [],
    kind: "decoy",
    trapType: "decoy",
  },
];

const hops: Clickable[] = [
  {
    id: SWAP_ID,
    label: "DemoApp.apk",
    shownUrl: "/ads/click-here",
    secondUrl: "/you-clicked-once.txt",
    hops: ["/ads/hop-1", "/ads/hop-2", "/you-clicked-once.txt"],
    kind: "two_url",
    trapType: "second_click",
  },
];

export function getClickables(room: RoomId): Clickable[] {
  if (room === "field") return field;
  if (room === "hops") return hops;
  return [];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/catalog.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/catalog.ts tests/catalog.test.ts
git commit -m "$(cat <<'EOF'
Add static clickable catalog for field and hops rooms.

EOF
)"
```

---

### Task 4: Reducers

**Files:**
- Create: `src/reducers.ts`
- Test: `tests/reducers.test.ts`

**Interfaces:**
- Consumes: `PageState`, `createInitialState`, `coreVisible` from `src/state.ts`; `getClickables`, `REAL_FIELD_ID`, `SWAP_ID` from `src/catalog.ts`
- Produces:

```ts
export function dismissWalls(state: PageState): PageState;
export function completePersonGate(state: PageState): PageState;
export function enterField(state: PageState): PageState;
export function enterHops(state: PageState): PageState;
export function highlightReal(state: PageState): PageState;
export function dimDecoys(state: PageState): PageState;
export function revealSecondUrl(state: PageState, id: string): PageState;
export function showRedirectChain(state: PageState, id: string): PageState;
export function explainTrap(state: PageState, id: string): PageState;
export function armRequestOpen(state: PageState): PageState;
export function openConfirm(state: PageState): PageState;
export function cancelConfirm(state: PageState): PageState;
```

Rules:

- `dismissWalls` sets all three walls to `false`. Does not set `personGateDone`. Does not change room.
- `completePersonGate` sets `personGateDone: true` only. No tool will call this.
- `enterField` returns unchanged state unless all walls are down and `personGateDone`. Then `room: "field"`.
- `enterHops` returns unchanged unless `room === "field"`. Then `room: "hops"` and clears highlight/dim/explain/chain/revealed for the new room (`highlightedId: null`, `dimmedIds: []`, `revealedIds: []`, `chainVisibleFor: null`, `explain: null`, `confirmArmed: false`, `confirmOpen: false`).
- `highlightReal` on `field` sets `highlightedId` to `REAL_FIELD_ID`. On `hops` sets `SWAP_ID`. On `door` no change.
- `dimDecoys` on `field` sets `dimmedIds` to every field id except `REAL_FIELD_ID`. On `hops` sets `[]` (only one control). On `door` no change.
- `revealSecondUrl` if id exists in current room catalog, adds id to `revealedIds` (no dupes). Unknown id: no change.
- `showRedirectChain` if id exists and `hops.length > 0`, sets `chainVisibleFor` to id. Else no change.
- `explainTrap` if id exists, sets `explain` to `{ id, text }` where text is:
  - `decoy`: `This button is an ad, not the file.`
  - `second_click`: `Shown URL is not the second-click URL.`
  - `redirect_chain`: `This path hops before the file.`
  - `none`: `This is the real path. The agent still cannot start the file.`
  Unknown id: no change.
- `armRequestOpen` sets `confirmArmed: true` only when `room === "hops"` and `coreVisible(state).visible`. Otherwise no change.
- `openConfirm` sets `confirmOpen: true` only when `confirmArmed` is already true. This is called from the **human** confirm button path, not from a tool. `armRequestOpen` must **not** set `confirmOpen`.
- `cancelConfirm` sets `confirmOpen: false` and `confirmArmed: false`.

- [ ] **Step 1: Write the failing test**

Create `tests/reducers.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { createInitialState } from "../src/state";
import { REAL_FIELD_ID, SWAP_ID } from "../src/catalog";
import {
  dismissWalls,
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/reducers.test.ts`

Expected: FAIL, cannot find `../src/reducers`

- [ ] **Step 3: Write minimal implementation**

Create `src/reducers.ts`:

```ts
import { getClickables, REAL_FIELD_ID, SWAP_ID } from "./catalog";
import { coreVisible, type PageState } from "./state";

function find(state: PageState, id: string) {
  return getClickables(state.room).find((c) => c.id === id);
}

export function dismissWalls(state: PageState): PageState {
  return {
    ...state,
    walls: { cookie: false, notify: false, signup: false },
  };
}

export function completePersonGate(state: PageState): PageState {
  return { ...state, personGateDone: true };
}

export function enterField(state: PageState): PageState {
  if (state.walls.cookie || state.walls.notify || state.walls.signup) return state;
  if (!state.personGateDone) return state;
  return { ...state, room: "field" };
}

export function enterHops(state: PageState): PageState {
  if (state.room !== "field") return state;
  return {
    ...state,
    room: "hops",
    highlightedId: null,
    dimmedIds: [],
    revealedIds: [],
    chainVisibleFor: null,
    explain: null,
    confirmArmed: false,
    confirmOpen: false,
  };
}

export function highlightReal(state: PageState): PageState {
  if (state.room === "field") return { ...state, highlightedId: REAL_FIELD_ID };
  if (state.room === "hops") return { ...state, highlightedId: SWAP_ID };
  return state;
}

export function dimDecoys(state: PageState): PageState {
  if (state.room !== "field") return { ...state, dimmedIds: [] };
  const ids = getClickables("field")
    .filter((c) => c.id !== REAL_FIELD_ID)
    .map((c) => c.id);
  return { ...state, dimmedIds: ids };
}

export function revealSecondUrl(state: PageState, id: string): PageState {
  if (!find(state, id)) return state;
  if (state.revealedIds.includes(id)) return state;
  return { ...state, revealedIds: [...state.revealedIds, id] };
}

export function showRedirectChain(state: PageState, id: string): PageState {
  const c = find(state, id);
  if (!c || c.hops.length === 0) return state;
  return { ...state, chainVisibleFor: id };
}

const EXPLAIN: Record<string, string> = {
  decoy: "This button is an ad, not the file.",
  second_click: "Shown URL is not the second-click URL.",
  redirect_chain: "This path hops before the file.",
  none: "This is the real path. The agent still cannot start the file.",
};

export function explainTrap(state: PageState, id: string): PageState {
  const c = find(state, id);
  if (!c) return state;
  return { ...state, explain: { id, text: EXPLAIN[c.trapType] } };
}

export function armRequestOpen(state: PageState): PageState {
  if (state.room !== "hops" || !coreVisible(state).visible) return state;
  return { ...state, confirmArmed: true };
}

export function openConfirm(state: PageState): PageState {
  if (!state.confirmArmed) return state;
  return { ...state, confirmOpen: true };
}

export function cancelConfirm(state: PageState): PageState {
  return { ...state, confirmOpen: false, confirmArmed: false };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/reducers.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/reducers.ts tests/reducers.test.ts
git commit -m "$(cat <<'EOF'
Add reducers for walls, rooms, paint, and confirm arming.

EOF
)"
```

---

### Task 5: Store

**Files:**
- Create: `src/store.ts`
- Test: `tests/store.test.ts`

**Interfaces:**
- Consumes: `createInitialState`, `PageState` from `src/state.ts`
- Produces:

```ts
export function getState(): PageState;
export function setState(next: PageState): void;
export function subscribe(fn: () => void): () => void;
export function resetState(): void;
```

`resetState` is for tests only (sets state back to `createInitialState()`).

- [ ] **Step 1: Write the failing test**

Create `tests/store.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/store.test.ts`

Expected: FAIL, cannot find `../src/store`

- [ ] **Step 3: Write minimal implementation**

Create `src/store.ts`:

```ts
import { createInitialState, type PageState } from "./state";

let state = createInitialState();
const listeners = new Set<() => void>();

export function getState(): PageState {
  return state;
}

export function setState(next: PageState): void {
  state = next;
  for (const fn of listeners) fn();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function resetState(): void {
  state = createInitialState();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/store.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/store.ts tests/store.test.ts
git commit -m "$(cat <<'EOF'
Add in-memory page store.

EOF
)"
```

---

### Task 6: Ten tool executors

**Files:**
- Create: `src/tools.ts`
- Test: `tests/tools.test.ts`

**Interfaces:**
- Consumes: `getState`, `setState` from `src/store.ts`; reducers from `src/reducers.ts`; `getClickables` from `src/catalog.ts`; `coreVisible` from `src/state.ts`; `SWAP_ID` from `src/catalog.ts`
- Produces: these exact functions (each returns a concrete object, never `{ ok: true }` alone):

```ts
export type ToolResult = Record<string, unknown>;

export function get_page_state(): ToolResult;
export function dismiss_walls(): ToolResult;
export function list_clickables(): ToolResult;
export function reveal_second_url(input: { id?: unknown }): ToolResult;
export function show_redirect_chain(input: { id?: unknown }): ToolResult;
export function highlight_real(): ToolResult;
export function dim_decoys(): ToolResult;
export function explain_trap(input: { id?: unknown }): ToolResult;
export function request_open(): ToolResult;
export function get_core_visible(): ToolResult;
```

Return shapes:

- `get_page_state`: `{ room, walls, personGateDone, highlightedId, dimmedIds, revealedIds, chainVisibleFor, explain, confirmArmed, confirmOpen }` (current state fields)
- `dismiss_walls`: `{ closed: ["cookie", "notify", "signup"], personGateDone: boolean }`
- `list_clickables`: `{ room, clickables: Array<{ id, label, shownUrl, secondUrl, hops, kind, trapType }> }`
- `reveal_second_url`: `{ id, shownUrl, secondUrl, revealed: true }` or `{ error: "unknown_id" }` / `{ error: "id_required" }`
- `show_redirect_chain`: `{ id, hops: string[], shown: true }` or `{ error: "unknown_id" }` / `{ error: "no_hops" }` / `{ error: "id_required" }`
- `highlight_real`: `{ highlightedId: string | null }`
- `dim_decoys`: `{ dimmedIds: string[] }`
- `explain_trap`: `{ id, text }` or `{ error: "unknown_id" }` / `{ error: "id_required" }`
- `request_open`: `{ confirmArmed: true, confirmOpen: false, message: "Human must confirm. The agent cannot start the file." }` or `{ error: "not_ready", confirmArmed: false }`
- `get_core_visible`: `{ visible: boolean, blocking: string[] }`

`id` must be a non-empty string or return `id_required`.

None of these functions call `openConfirm`, start a download, or set `personGateDone`.

- [ ] **Step 1: Write the failing test**

Create `tests/tools.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { resetState } from "../src/store";
import {
  completePersonGate,
  dismissWalls,
  enterField,
  enterHops,
} from "../src/reducers";
import { getState, setState } from "../src/store";
import { SWAP_ID } from "../src/catalog";
import {
  dismiss_walls,
  get_core_visible,
  get_page_state,
  highlight_real,
  list_clickables,
  request_open,
  reveal_second_url,
  show_redirect_chain,
} from "../src/tools";

function toHops() {
  let s = getState();
  s = dismissWalls(s);
  s = completePersonGate(s);
  s = enterField(s);
  s = enterHops(s);
  setState(s);
}

describe("tools", () => {
  beforeEach(() => {
    resetState();
  });

  it("get_page_state returns room and walls, not ok", () => {
    const r = get_page_state();
    expect(r.room).toBe("door");
    expect(r).not.toEqual({ ok: true });
  });

  it("dismiss_walls reports closed walls and leaves the gate", () => {
    const r = dismiss_walls();
    expect(r.closed).toEqual(["cookie", "notify", "signup"]);
    expect(r.personGateDone).toBe(false);
    expect(get_core_visible().blocking).toContain("person_gate");
  });

  it("list_clickables is empty in the door", () => {
    expect(list_clickables()).toEqual({ room: "door", clickables: [] });
  });

  it("reveal and chain return URLs and hops on hops room", () => {
    toHops();
    const revealed = reveal_second_url({ id: SWAP_ID });
    expect(revealed).toMatchObject({
      id: SWAP_ID,
      shownUrl: "/ads/click-here",
      secondUrl: "/you-clicked-once.txt",
      revealed: true,
    });
    const chain = show_redirect_chain({ id: SWAP_ID });
    expect(chain).toMatchObject({
      id: SWAP_ID,
      hops: ["/ads/hop-1", "/ads/hop-2", "/you-clicked-once.txt"],
      shown: true,
    });
  });

  it("request_open arms and does not open the dialog", () => {
    toHops();
    const r = request_open();
    expect(r.confirmArmed).toBe(true);
    expect(r.confirmOpen).toBe(false);
    expect(getState().confirmOpen).toBe(false);
  });

  it("request_open is not ready in the door", () => {
    const r = request_open();
    expect(r.error).toBe("not_ready");
  });

  it("highlight_real does not invent a door target", () => {
    expect(highlight_real()).toEqual({ highlightedId: null });
  });

  it("rejects a missing id", () => {
    expect(reveal_second_url({})).toEqual({ error: "id_required" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/tools.test.ts`

Expected: FAIL, cannot find `../src/tools`

- [ ] **Step 3: Write minimal implementation**

Create `src/tools.ts`:

```ts
import { getClickables } from "./catalog";
import {
  armRequestOpen,
  dimDecoys,
  dismissWalls,
  explainTrap,
  highlightReal,
  revealSecondUrl,
  showRedirectChain,
} from "./reducers";
import { coreVisible } from "./state";
import { getState, setState } from "./store";

export type ToolResult = Record<string, unknown>;

function idOf(input: { id?: unknown }): string | null {
  return typeof input.id === "string" && input.id.length > 0 ? input.id : null;
}

export function get_page_state(): ToolResult {
  const s = getState();
  return {
    room: s.room,
    walls: s.walls,
    personGateDone: s.personGateDone,
    highlightedId: s.highlightedId,
    dimmedIds: s.dimmedIds,
    revealedIds: s.revealedIds,
    chainVisibleFor: s.chainVisibleFor,
    explain: s.explain,
    confirmArmed: s.confirmArmed,
    confirmOpen: s.confirmOpen,
  };
}

export function dismiss_walls(): ToolResult {
  setState(dismissWalls(getState()));
  const s = getState();
  return {
    closed: ["cookie", "notify", "signup"],
    personGateDone: s.personGateDone,
  };
}

export function list_clickables(): ToolResult {
  const s = getState();
  return { room: s.room, clickables: getClickables(s.room) };
}

export function reveal_second_url(input: { id?: unknown }): ToolResult {
  const id = idOf(input);
  if (!id) return { error: "id_required" };
  const before = getState();
  const found = getClickables(before.room).find((c) => c.id === id);
  if (!found) return { error: "unknown_id" };
  setState(revealSecondUrl(before, id));
  return {
    id,
    shownUrl: found.shownUrl,
    secondUrl: found.secondUrl,
    revealed: true,
  };
}

export function show_redirect_chain(input: { id?: unknown }): ToolResult {
  const id = idOf(input);
  if (!id) return { error: "id_required" };
  const before = getState();
  const found = getClickables(before.room).find((c) => c.id === id);
  if (!found) return { error: "unknown_id" };
  if (found.hops.length === 0) return { error: "no_hops" };
  setState(showRedirectChain(before, id));
  return { id, hops: found.hops, shown: true };
}

export function highlight_real(): ToolResult {
  setState(highlightReal(getState()));
  return { highlightedId: getState().highlightedId };
}

export function dim_decoys(): ToolResult {
  setState(dimDecoys(getState()));
  return { dimmedIds: getState().dimmedIds };
}

export function explain_trap(input: { id?: unknown }): ToolResult {
  const id = idOf(input);
  if (!id) return { error: "id_required" };
  const before = getState();
  const found = getClickables(before.room).find((c) => c.id === id);
  if (!found) return { error: "unknown_id" };
  setState(explainTrap(before, id));
  return getState().explain as ToolResult;
}

export function request_open(): ToolResult {
  setState(armRequestOpen(getState()));
  const s = getState();
  if (!s.confirmArmed) return { error: "not_ready", confirmArmed: false };
  return {
    confirmArmed: true,
    confirmOpen: false,
    message: "Human must confirm. The agent cannot start the file.",
  };
}

export function get_core_visible(): ToolResult {
  return coreVisible(getState());
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/tools.test.ts`

Expected: PASS

Run: `npm test`

Expected: all existing tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/tools.ts tests/tools.test.ts
git commit -m "$(cat <<'EOF'
Add ten tool executors with concrete return values.

EOF
)"
```

---

### Task 7: Static dummy files

**Files:**
- Create: `public/you-clicked-once.txt`
- Create: `public/this-was-the-ad.html`
- Test: `tests/dummy-files.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: Vite serves `/you-clicked-once.txt` and `/this-was-the-ad.html`

- [ ] **Step 1: Write the failing test**

Create `tests/dummy-files.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/dummy-files.test.ts`

Expected: FAIL, ENOENT `public/you-clicked-once.txt`

- [ ] **Step 3: Write the files**

`public/you-clicked-once.txt` (exact bytes: the line plus a trailing newline):

```
you clicked once.
```

`public/this-was-the-ad.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Second Click</title>
  </head>
  <body>
    <p>this was the ad.</p>
    <p><a href="/">Back</a></p>
  </body>
</html>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/dummy-files.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add public/you-clicked-once.txt public/this-was-the-ad.html tests/dummy-files.test.ts
git commit -m "$(cat <<'EOF'
Add dummy download and decoy ad landing.

EOF
)"
```

---

### Task 8: UI render

**Files:**
- Create: `src/ui.ts`
- Create: `src/styles.css`
- Modify: `index.html` (add stylesheet link)
- Modify: `src/main.ts`

**Interfaces:**
- Consumes: `getState`, `setState` from `src/store.ts`; all reducers from `src/reducers.ts`; `getClickables`, `REAL_FIELD_ID` from `src/catalog.ts`; `coreVisible` from `src/state.ts`
- Produces: `export function render(root: HTMLElement): void`

Behavior:

- Always show a header: title `Second Click`, subtitle `The download page you already know.` A line `Agent` appears under highlights/captions/hop lists (`data-speaker="agent"`).
- **Door:** three wall overlays (cookie, notify, signup) with human “Close” buttons that call `dismissWalls` only for that wall: implement `export function dismissOneWall(state, wall: WallId)` in `src/reducers.ts` if missing — add it in this task with a test in `tests/reducers.test.ts` first (TDD): `dismissOneWall` sets that one wall to `false`. Agent `dismiss_walls` still closes all three. Person-gate is a button `I am a person` calling `completePersonGate`. Button `Continue to downloads` calls `enterField`. Walls are `position: fixed` sheets; when a wall is down it is not in the DOM. Core download copy is in the background but `aria-hidden` and covered until `coreVisible` would be true after enter — on the door, show a dim “DemoApp 1.2” poster behind walls.
- **Field:** eight buttons. Human click on `dl-real` calls `enterHops`. Human click on any decoy sets `window.location.href = "/this-was-the-ad.html"`. Highlighted control gets class `is-real`. Dimmed get `is-dim`. If `explain` matches an id, show the caption under that button with `data-speaker="agent"`.
- **Hops:** show `dl-swap` as a file-looking control. Human click on it does **not** download. It does nothing but optional `explainTrap` locally — actually human click on the swap control should not follow `shownUrl`. Only the confirm dialog starts the file. If `revealedIds` includes `dl-swap`, show both URLs on the page (`Shown` and `Second click`). If `chainVisibleFor === dl-swap`, show an ordered hop list. If `confirmArmed`, show a human bar: `Confirm download` (calls `openConfirm`) and helper text that the agent armed this. If `confirmOpen`, modal: `Start dummy file?` / `The agent cannot do this.` Buttons `Download` and `Cancel`. `Download` sets `window.location.href = "/you-clicked-once.txt"` and `cancelConfirm`. `Cancel` calls `cancelConfirm`.
- No in-page chatbot. No paste box.

Also add `dismissOneWall` test + implementation before render (same task, first two steps).

- [ ] **Step 1: Write the failing `dismissOneWall` test**

Add `dismissOneWall` to the existing import from `../src/reducers` in `tests/reducers.test.ts`. Then append:

```ts
describe("dismissOneWall", () => {
  it("closes only cookie", () => {
    const s = dismissOneWall(createInitialState(), "cookie");
    expect(s.walls.cookie).toBe(false);
    expect(s.walls.notify).toBe(true);
    expect(s.walls.signup).toBe(true);
  });
});
```

- [ ] **Step 2: Run that test to verify it fails**

Run: `npx vitest run tests/reducers.test.ts -t dismissOneWall`

Expected: FAIL, `dismissOneWall` is not exported

- [ ] **Step 3: Implement `dismissOneWall` and the UI**

Add to `src/reducers.ts`:

```ts
import type { PageState, WallId } from "./state";

export function dismissOneWall(state: PageState, wall: WallId): PageState {
  return { ...state, walls: { ...state.walls, [wall]: false } };
}
```

(Keep existing imports; merge `WallId` into the `./state` import.)

Create `src/styles.css`:

```css
:root {
  color: #1a1a1a;
  background: #e8e6e1;
  font-family: Georgia, "Times New Roman", serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px 80px;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 4px;
}

.sub {
  color: #444;
  margin: 0 0 24px;
}

.poster {
  border: 1px solid #bbb;
  background: #f3f1ec;
  padding: 16px;
}

.wall {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 20, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.sheet {
  background: #f7f7f5;
  border: 1px solid #999;
  padding: 20px;
  width: min(420px, 92vw);
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button,
.file {
  font: inherit;
  border: 1px solid #333;
  background: #d8d4c8;
  padding: 10px 12px;
  cursor: pointer;
}

button.is-real,
.file.is-real {
  outline: 2px solid #1b4d2e;
  outline-offset: 2px;
}

button.is-dim,
.file.is-dim {
  opacity: 0.35;
}

.agent {
  font-size: 0.9rem;
  color: #1b4d2e;
  margin: 6px 0 0;
}

.agent::before {
  content: "Agent: ";
  font-weight: 600;
}

.bar {
  margin-top: 20px;
  padding: 12px;
  border: 1px dashed #1b4d2e;
}

.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 20, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.urls {
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
}
```

Create `src/ui.ts`:

```ts
import { getClickables, REAL_FIELD_ID, SWAP_ID } from "./catalog";
import {
  cancelConfirm,
  completePersonGate,
  dismissOneWall,
  enterField,
  enterHops,
  openConfirm,
} from "./reducers";
import { getState, setState } from "./store";
import type { WallId } from "./state";

function closeWall(wall: WallId) {
  setState(dismissOneWall(getState(), wall));
}

export function render(root: HTMLElement): void {
  const s = getState();
  const parts: string[] = [];
  parts.push(`<div class="wrap">`);
  parts.push(`<h1>Second Click</h1>`);
  parts.push(
    `<p class="sub">The download page you already know.</p>`,
  );

  if (s.room === "door") {
    parts.push(`<div class="poster" aria-hidden="${s.walls.cookie || s.walls.notify || s.walls.signup}">`);
    parts.push(`<p>DemoApp 1.2 for Android</p><p>Official-looking mirror. It is not.</p>`);
    if (!s.walls.cookie && !s.walls.notify && !s.walls.signup) {
      if (!s.personGateDone) {
        parts.push(`<button type="button" data-act="person">I am a person</button>`);
      } else {
        parts.push(`<button type="button" data-act="enter-field">Continue to downloads</button>`);
      }
    }
    parts.push(`</div>`);
  }

  if (s.room === "field") {
    parts.push(`<p>Mirrors</p><div class="stack">`);
    for (const c of getClickables("field")) {
      const cls = [
        c.id === s.highlightedId ? "is-real" : "",
        s.dimmedIds.includes(c.id) ? "is-dim" : "",
      ]
        .filter(Boolean)
        .join(" ");
      parts.push(
        `<button type="button" class="${cls}" data-click="${c.id}">${c.label}</button>`,
      );
      if (s.explain?.id === c.id) {
        parts.push(`<p class="agent" data-speaker="agent">${s.explain.text}</p>`);
      }
    }
    parts.push(`</div>`);
  }

  if (s.room === "hops") {
    const c = getClickables("hops")[0];
    const cls = c.id === s.highlightedId ? "file is-real" : "file";
    parts.push(`<p>Your download is ready</p>`);
    parts.push(
      `<button type="button" class="${cls}" data-click="${c.id}">${c.label}</button>`,
    );
    if (s.revealedIds.includes(SWAP_ID)) {
      parts.push(
        `<p class="urls agent" data-speaker="agent">Shown: ${c.shownUrl}\nSecond click: ${c.secondUrl}</p>`,
      );
    }
    if (s.chainVisibleFor === SWAP_ID) {
      parts.push(
        `<ol class="agent" data-speaker="agent">${c.hops.map((h) => `<li>${h}</li>`).join("")}</ol>`,
      );
    }
    if (s.explain?.id === c.id) {
      parts.push(`<p class="agent" data-speaker="agent">${s.explain.text}</p>`);
    }
    if (s.confirmArmed) {
      parts.push(`<div class="bar">`);
      parts.push(
        `<p>The agent asked to open the file. Only you can confirm.</p>`,
      );
      parts.push(`<button type="button" data-act="open-confirm">Confirm download</button>`);
      parts.push(`</div>`);
    }
  }

  parts.push(`</div>`);

  if (s.walls.cookie) {
    parts.push(
      `<div class="wall" data-wall="cookie"><div class="sheet"><p>We use cookies to “improve your download experience.”</p><button type="button" data-wall-close="cookie">Close</button></div></div>`,
    );
  }
  if (s.walls.notify) {
    parts.push(
      `<div class="wall" data-wall="notify"><div class="sheet"><p>Enable notifications for download status?</p><button type="button" data-wall-close="notify">Close</button></div></div>`,
    );
  }
  if (s.walls.signup) {
    parts.push(
      `<div class="wall" data-wall="signup"><div class="sheet"><p>Create a free account to continue.</p><button type="button" data-wall-close="signup">Close</button></div></div>`,
    );
  }

  if (s.confirmOpen) {
    parts.push(
      `<div class="modal-bg"><div class="sheet"><p>Start dummy file?</p><p>The agent cannot do this.</p><button type="button" data-act="do-download">Download</button> <button type="button" data-act="cancel-confirm">Cancel</button></div></div>`,
    );
  }

  root.innerHTML = parts.join("");

  root.querySelectorAll("[data-wall-close]").forEach((el) => {
    el.addEventListener("click", () => {
      closeWall((el as HTMLElement).dataset.wallClose as WallId);
    });
  });

  root.querySelector("[data-act=person]")?.addEventListener("click", () => {
    setState(completePersonGate(getState()));
  });
  root.querySelector("[data-act=enter-field]")?.addEventListener("click", () => {
    setState(enterField(getState()));
  });
  root.querySelector("[data-act=open-confirm]")?.addEventListener("click", () => {
    setState(openConfirm(getState()));
  });
  root.querySelector("[data-act=cancel-confirm]")?.addEventListener("click", () => {
    setState(cancelConfirm(getState()));
  });
  root.querySelector("[data-act=do-download]")?.addEventListener("click", () => {
    setState(cancelConfirm(getState()));
    window.location.href = "/you-clicked-once.txt";
  });

  root.querySelectorAll("[data-click]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = (el as HTMLElement).dataset.click;
      const room = getState().room;
      if (room === "field") {
        if (id === REAL_FIELD_ID) setState(enterHops(getState()));
        else window.location.href = "/this-was-the-ad.html";
      }
    });
  });
}
```

`index.html` head, add:

```html
<link rel="stylesheet" href="/src/styles.css" />
```

Replace `src/main.ts` with:

```ts
import { render } from "./ui";
import { subscribe } from "./store";

const root = document.querySelector("#app");
if (!(root instanceof HTMLElement)) {
  throw new Error("#app missing");
}

const paint = () => render(root);
subscribe(paint);
paint();
```

- [ ] **Step 4: Verify UI and reducer tests**

Run: `npx vitest run tests/reducers.test.ts`

Expected: PASS including `dismissOneWall`

Run: `npm run dev`

Expected: walls stack; closing all three plus `I am a person` plus Continue shows eight buttons; decoy opens decoy page; real button goes to hops; hops file click does not download.

- [ ] **Step 5: Commit**

```bash
git add src/reducers.ts src/ui.ts src/styles.css src/main.ts index.html tests/reducers.test.ts
git commit -m "$(cat <<'EOF'
Render door, field, hops, and human confirm modal.

EOF
)"
```

---

### Task 9: Register WebMCP tools

**Files:**
- Create: `src/webmcp.ts`
- Modify: `src/main.ts`
- Test: `tests/webmcp.test.ts`

**Interfaces:**
- Consumes: the ten functions from `src/tools.ts`
- Produces:

```ts
export function registerSiteTools(): Promise<{ registered: string[] }>;
```

Registration:

- If `typeof document === "undefined"` or `typeof document.modelContext?.registerTool !== "function"`, return `{ registered: [] }` and do not throw.
- Otherwise register all ten names with `inputSchema` as given below and `execute` calling the matching `src/tools.ts` function.
- `get_page_state`, `list_clickables`, `get_core_visible`, `highlight_real`, `dim_decoys` use `inputSchema: { type: "object", properties: {}, additionalProperties: false }` and `annotations: { readOnlyHint: true }` on the three read-only ones only: `get_page_state`, `list_clickables`, `get_core_visible`.
- `dismiss_walls`, `highlight_real`, `dim_decoys`, `request_open`: empty object input.
- `reveal_second_url`, `show_redirect_chain`, `explain_trap`: `{ type: "object", properties: { id: { type: "string", description: "Clickable id" } }, required: ["id"], additionalProperties: false }`

Read-only hint: only the three getters listed. `highlight_real` and `dim_decoys` mutate paint, so no `readOnlyHint`.

Descriptions (use exactly):

- `get_page_state`: `Read room, walls, paint, and confirm flags.`
- `dismiss_walls`: `Close cookie, notify, and signup sheets. Does not complete the person gate.`
- `list_clickables`: `List download-like controls in the current room with shown and second URLs.`
- `reveal_second_url`: `Write shown vs second-click URL on the page for one control.`
- `show_redirect_chain`: `Write the declared hop list for one control. Does not fetch.`
- `highlight_real`: `Paint the real download path in this room.`
- `dim_decoys`: `Dim decoy buttons in the field room.`
- `explain_trap`: `Write a one-line agent caption on one control.`
- `request_open`: `Ask the human to confirm the dummy file. Does not download.`
- `get_core_visible`: `Whether junk walls are gone and the core download UI is showing.`

- [ ] **Step 1: Write the failing test**

Create `tests/webmcp.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { registerSiteTools } from "../src/webmcp";

describe("registerSiteTools", () => {
  it("registers nothing in Node without modelContext", async () => {
    const r = await registerSiteTools();
    expect(r).toEqual({ registered: [] });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/webmcp.test.ts`

Expected: FAIL, cannot find `../src/webmcp`

- [ ] **Step 3: Write implementation and boot it**

Create `src/webmcp.ts`:

```ts
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
```

Replace `src/main.ts` with:

```ts
import { render } from "./ui";
import { subscribe } from "./store";
import { registerSiteTools } from "./webmcp";

const root = document.querySelector("#app");
if (!(root instanceof HTMLElement)) {
  throw new Error("#app missing");
}

const paint = () => render(root);
subscribe(paint);
paint();
void registerSiteTools();
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/webmcp.test.ts`

Expected: PASS `{ registered: [] }`

Run: `npm test`

Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add src/webmcp.ts src/main.ts tests/webmcp.test.ts
git commit -m "$(cat <<'EOF'
Register ten top-level WebMCP tools when the API exists.

EOF
)"
```

---

### Task 10: Store subscribe must re-render after tools

**Files:**
- Modify: `src/tools.ts` (already `setState`s — verify UI subscription is enough)
- Test: `tests/tools-render.test.ts`

**Interfaces:**
- Consumes: `subscribe`, `resetState` from `src/store.ts`; `dismiss_walls` from `src/tools.ts`
- Produces: proof that a tool `setState` notifies listeners

This task exists so an implementer does not “optimize” tools to mutate without `setState`.

- [ ] **Step 1: Write the failing test**

Create `tests/tools-render.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test**

Run: `npx vitest run tests/tools-render.test.ts`

Expected: PASS already if Task 6 used `setState`. If someone inlined mutation, FAIL.

If FAIL: fix `dismiss_walls` in `src/tools.ts` to call `setState(dismissWalls(getState()))` as in Task 6.

- [ ] **Step 3: No extra implementation if green**

Do not add a second store.

- [ ] **Step 4: Re-run**

Run: `npx vitest run tests/tools-render.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/tools-render.test.ts
git commit -m "$(cat <<'EOF'
Assert tool executions notify the UI store.

EOF
)"
```

---

### Task 11: README, license, submission, deploy

**Files:**
- Create: `LICENSE`
- Create: `README.md`
- Create: `docs/SUBMISSION.md`
- Create: `vercel.json`

**Interfaces:**
- Consumes: product behavior from earlier tasks
- Produces: judge-ready repo docs and static host config

- [ ] **Step 1: Write LICENSE**

`LICENSE` (MIT), copyright holder `Second Click contributors`, year omitted from the body if you want zero dates — use:

```
MIT License

Copyright (c) Second Click contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Write README.md**

Use this exact body (edit only the live URL line after deploy):

```md
# Second Click

A download page like the ones people already hate: walls, fake buttons, a second-click URL, declared hops. You and an agent share this tab. The agent peels and paints. Only you start the dummy file.

This is not a scanner for the rest of the web. WebMCP tools exist only on this origin.

## Why WebMCP

The lie is on the button. A chat cannot paint *this* click or write shown vs second URL on the glass. `document.modelContext.registerTool` on the top-level page is how the agent does that work in your session.

## Run

```bash
npm install
npm test
npm run dev
```

Build: `npm run build` then `npm run preview`.

## Test in ChatGPT

1. Open the live URL in the ChatGPT desktop in-app browser (GPT-5.6 Sol or Terra; site tools on).
2. Confirm **Site tools** lists ten tools.
3. Prompt:

```
We are on a dirty download page. Close every wall except the person gate. Tell me what is still blocking the core page. After I click I am a person and continue, list every download button with shown and second URLs. Highlight the real one, dim the decoys, and explain one decoy. When we reach the file that swaps URLs, reveal the second URL, show the hop chain, then request open. Do not download. I will confirm.
```

4. You complete **I am a person**, **Continue to downloads**, then later **Confirm download**.
5. The file must read: `you clicked once.`

Chrome flag testing is optional. Judges use ChatGPT’s browser.

## Tools

get_page_state, dismiss_walls, list_clickables, reveal_second_url, show_redirect_chain, highlight_real, dim_decoys, explain_trap, request_open, get_core_visible.

No tool starts the file.

## License

MIT. See LICENSE.
```

- [ ] **Step 3: Write docs/SUBMISSION.md and vercel.json**

`docs/SUBMISSION.md`:

```md
# Devpost copy

## Why this use case is a strong fit for WebMCP

Dirty download pages hide the real click on the document. WebMCP lets the page expose list, paint, reveal, and hop tools that mutate this tab. A backend MCP server would not share the walls the human is looking at.

## How it creates a better user experience

The agent shuts cookie/notify/signup sheets, paints the real control, writes the second URL and hops before anyone follows them. The human stays on the person gate and the final dummy download.

## What people and agents can do together that was difficult before

Together they can treat a two-URL button as structured state instead of a surprise navigation. Apart, the human guesses, or the agent would have to click blind.

## How we implemented WebMCP

Imperative `document.modelContext.registerTool` on the top-level page. Ten tools. Feature-detected. Execute handlers update the same store the UI renders. Hops are declared in app data, never fetched.

## Demo video shot list (under three minutes, with audio)

1. Title: Second Click. One sentence: same page, agent paints, you click once.
2. Cookie / notify / signup walls. Agent dismisses. Person gate still there. You click it.
3. Eight green buttons. Agent lists, highlights real, dims decoys, explains one decoy. You reject a decoy (ad page) or skip that and hit the real control.
4. File control. Agent reveals shown vs second URL and the hop list.
5. Agent request_open. You confirm. File contents on screen: you clicked once.
6. Close: the agent never started the file.

No slide deck. No fourth room.
```

`vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

- [ ] **Step 4: Verify docs exist and tests still pass**

Run: `npm test`

Expected: PASS

Run: `test -f LICENSE && test -f README.md && test -f docs/SUBMISSION.md && echo ok`

Expected: `ok`

- [ ] **Step 5: Commit**

```bash
git add LICENSE README.md docs/SUBMISSION.md vercel.json
git commit -m "$(cat <<'EOF'
Add MIT license, README, submission copy, and static host config.

EOF
)"
```

---

### Task 12: Host and judge path

**Files:**
- Modify: `README.md` (replace the live URL placeholder with the real URL after deploy)

**Interfaces:**
- Consumes: `npm run build` output
- Produces: a public HTTPS URL that serves `index.html` and `/you-clicked-once.txt`

- [ ] **Step 1: Build**

Run: `npm run build`

Expected: `dist/index.html` and `dist/you-clicked-once.txt` exist

- [ ] **Step 2: Deploy the `dist` folder (or the repo) to Vercel, Netlify, or Cloudflare Pages as a static site**

Use the project’s existing account. Production URL must be public, no auth.

- [ ] **Step 3: Curl checks**

Run (replace `ORIGIN` with the production origin, no trailing slash):

```bash
curl -sS -o /dev/null -w "%{http_code}" "$ORIGIN/"
curl -sS "$ORIGIN/you-clicked-once.txt"
```

Expected: first command prints `200`. Second prints `you clicked once.`

- [ ] **Step 4: ChatGPT in-app browser**

Open `$ORIGIN` in ChatGPT desktop (Sol or Terra, site tools on). Confirm ten site tools. Run the README prompt. Complete person gate and confirm as the human. Download matches the dummy line.

- [ ] **Step 5: Commit README URL only**

Put the origin in `README.md` under a line `Live: https://…`

```bash
git add README.md
git commit -m "$(cat <<'EOF'
Record the public live URL.

EOF
)"
```

---

### Task 13: Demo recording (complete delivery)

**Files:**
- Modify: `docs/SUBMISSION.md` only if the YouTube link is known (add `Video: https://youtu.be/…` at the top)

**Interfaces:**
- Consumes: live URL from Task 12
- Produces: a public YouTube video under three minutes with audio covering what was built and how WebMCP was used

- [ ] **Step 1: Follow `docs/SUBMISSION.md` shot list in order**

Record the live site, not localhost. Show site tools in the chrome if the UI exposes the list.

- [ ] **Step 2: Watch the cut once**

If the agent never calls a tool on camera, re-record. If you talk over a slide deck, re-record.

- [ ] **Step 3: Upload to YouTube as public**

- [ ] **Step 4: Add the link to `docs/SUBMISSION.md`**

- [ ] **Step 5: Commit the link**

```bash
git add docs/SUBMISSION.md
git commit -m "$(cat <<'EOF'
Add public demo video URL.

EOF
)"
```

---

## Spec coverage (self-review)

| PRD / context requirement | Task |
|---|---|
| Room 1 walls + person gate | 4, 8 |
| Room 2 eight buttons, one real | 3, 8 |
| Room 3 two-URL + hops | 3, 4, 8 |
| Ten named tools, concrete returns | 6, 9 |
| No download/navigate/open_url tools | 6, 9 |
| Human-only confirm + dummy file | 4, 7, 8 |
| Dummy text / decoy ad line | 7 |
| Feature-detect top-level registerTool | 9 |
| No third-party fetch / no paste | 3, 6 (catalog + tools) |
| README prompt + ChatGPT path | 11, 12 |
| MIT at repo root | 11 |
| Hosted live URL | 12 |
| Demo video