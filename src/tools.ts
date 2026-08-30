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