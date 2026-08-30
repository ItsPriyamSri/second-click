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