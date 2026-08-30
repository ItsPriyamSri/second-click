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
    window.location.href = "you-clicked-once.txt";
  });

  root.querySelectorAll("[data-click]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = (el as HTMLElement).dataset.click;
      const room = getState().room;
      if (room === "field") {
        if (id === REAL_FIELD_ID) setState(enterHops(getState()));
        else window.location.href = "this-was-the-ad.html";
      }
    });
  });
}