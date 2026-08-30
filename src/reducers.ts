import { getClickables, REAL_FIELD_ID, SWAP_ID } from "./catalog";
import { coreVisible, type PageState, type WallId } from "./state";

function find(state: PageState, id: string) {
  return getClickables(state.room).find((c) => c.id === id);
}

export function dismissWalls(state: PageState): PageState {
  return {
    ...state,
    walls: { cookie: false, notify: false, signup: false },
  };
}

export function dismissOneWall(state: PageState, wall: WallId): PageState {
  return { ...state, walls: { ...state.walls, [wall]: false } };
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