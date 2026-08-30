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