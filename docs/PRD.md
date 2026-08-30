# Second Click — PRD

## Problem

People trying to get a driver, PDF, or sideloaded app hit the same mess: cookie / notify / signup walls, a field of fake DOWNLOAD buttons, hops through ads, and buttons whose **shown** URL is not the URL on the **second** click. The lie is on the page. A chat cannot point at *this* button.

## Who

Anyone who has clicked the wrong green button on a download page. Recurring, not rare. We are not building for “the whole web.” We are building for that moment, rebuilt on our origin so an agent can tell the truth.

## Product

A hosted **three-room** page. Human and agent share one tab and one session. The agent peels traps and paints facts. The human is the only one who may start the file.

If you remove the agent, you are guessing at walls and buttons. If you remove the human, a robot is downloading. Both are wrong.

### Room 1 — The door

Cookie wall, notify prompt, optional signup sheet. Agent dismisses junk. If there is a “I am a person” gate, **only the human** completes it. After that, the core page is visible.

### Room 2 — The button field

Eight (or so) download-looking controls. One is the real dummy file. The rest are decoys. Agent lists clickables, highlights the real one, dims the rest, scrolls it into view.

### Room 3 — Second click and hops

One control that looks like a file:

- What it **shows** (label / href the human can see)
- What **click 1** does (often an ad hop)
- What **click 2** or the hidden target is
- The **hop chain** written out *before* anyone follows it

Agent reveals this on the glass. Agent must not navigate or download. Human confirms `request_open`. Then a harmless dummy file downloads.

## Success (done when)

1. Live URL works in ChatGPT’s in-app browser with site tools.
2. A judge can finish all three rooms without a README novel (README still has the exact prompt and a test path).
3. After walls close, the core download UI is what you see — not a stack of sheets.
4. Real vs decoy is painted on the page, not only described in chat.
5. Shown URL, second URL, and hops are visible **before** confirm.
6. There is no tool that starts the file. Confirm is human-only.
7. Dummy file contents: `you clicked once.`
8. Tools return concrete state (URLs, hop list, which button is real), never empty ok.

## Tools (target 10, hard cap 15)

Register on the top-level document only.

| Tool | Does | Returns (must be real) |
|---|---|---|
| `get_page_state` | Read-only snapshot | Room, walls up/down, button ids, whether confirm is armed |
| `dismiss_walls` | Close cookie / notify / signup junk | Which walls closed |
| `list_clickables` | Inventory of download-like controls | Label, shown URL, hidden/second URL if any |
| `reveal_second_url` | Expose the two-URL trap on one control | Shown vs second, written on the page |
| `show_redirect_chain` | Draw hops for a control we own | Ordered hop list on the page |
| `highlight_real` | Paint the real dummy target | Id of the real control |
| `dim_decoys` | Fade the rest | Ids dimmed |
| `explain_trap` | Short, specific caption on a control | Trap type + one line |
| `request_open` | Ask the **human** to confirm the real file | Pending confirm; does not download |
| `get_core_visible` | Whether junk is gone and core is shown | Boolean + what’s still blocking |

Do not add `download`, `navigate`, `open_url`, or `click` that follows hops.

## Human vs agent

| Agent | Human only |
|---|---|
| Dismiss walls, list, reveal, paint, explain | Person-gate (if present) |
| Arm `request_open` | Confirm / cancel that confirm |
| | Start the dummy download |

Agent speech on the page is **the agent**, not the user (captions, highlights, hop list).

## Dummy file

Harmless text download. Body is exactly:

```
you clicked once.
```

Optional: one decoy landing line `this was the ad.` No other gags. No “GPT was right.”

## Pitch (use this tone)

Seatbelt, not haunted house. “The download page you already know. We rebuilt it so the agent can tell the truth on the glass.” Do not lead with “we invented popups.”

**15s:** walls die → one button painted → shown vs second URL + hops → human rejects a decoy → human confirms → dummy file.

Devpost text must cover: why WebMCP, better together, what was hard before, how we implemented tools.

## Technical constraints

- Imperative `document.modelContext.registerTool` on the top-level page
- Feature-detect; page still usable without an agent (worse, but not broken)
- No fetch of user-supplied or third-party URLs (no SSRF, no malware proxy)
- Hops are **ours** (declared in app state), not resolved live
- No iframe tools
- Host anywhere judges can open (Vercel / Cloudflare / Netlify / etc.)
- Public repo + visible OSS license
- English UI and README

Stack is undecided on purpose: pick the thinnest thing that deploys and registers tools. No extra product surface.

## Threat model

- Public URL, no auth required for the judge path
- Worst case of hostile input: there is no URL/HTML paste. Do not add one
- Dummy file is static text we ship. Not user-uploaded
- Tool results are page state we control. Treat tool names/descriptions as untrusted to the *model* (normal WebMCP); do not put secrets in tools

## Out of scope

- Scanning or cleaning other origins
- Real APKs, drivers, or warez
- Browser extension, proxy, or “agent-ready any site” plugin
- Store, catalog, accounts, payments
- Form filler, lease reader, helpdesk
- Live unshortening
- More than three rooms
- A meme layer

## 4-day cut line

Ship rooms 1–3, the tool table, confirm gate, dummy file, README (prompt + “open in ChatGPT desktop”), hosted URL. Polish the paint. Video last. Do not add a fourth room.

## Open

- Final public name (not “Second Click” forever if we find a sharper one)
- Exact visual tone of the fake download site (boring-mean, not cartoon)
- Hosting pick when we start code
