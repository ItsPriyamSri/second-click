# Second Click — project context

Working name until we pick a better one. Solo WebMCP app. Four days.

## What this is

A three-room **download / sideload trap course** on *our* origin. You and the agent share the same page. The agent shuts walls, paints the real button, and writes shown URL vs second-click URL and the hop list. **You** confirm the one real click. The agent never starts the file.

WebMCP only exists on this tab. We do not scan the rest of the internet. Official demos work the same way (their cart, their cube). Pitch it as a seatbelt on a page people already know, not a haunted house we built to look brave.

## Hack (source of truth)

- Challenge: [webmcp.devpost.com](https://webmcp.devpost.com/) · rules: [webmcp.devpost.com/rules](https://webmcp.devpost.com/rules)
- Deadline: **3 Sep 2026, 1:00pm PDT** (~11:30pm IST)
- Must ship: live URL (ChatGPT in-app browser or Chrome WebMCP), public repo, visible OSS license, **<3 min** YouTube demo with audio
- Tools: `document.modelContext.registerTool` on the **top-level** page. ChatGPT does **not** support declarative `toolname=` or iframe tools
- Test in ChatGPT desktop with **GPT-5.6 Sol or Terra** (Luna has site tools off)
- After deadline: do not edit the submitted repo or live site until winners are announced

## Winning criteria (equal, 25% each)

| Criterion | We win if | We die if |
|---|---|---|
| **WebMCP leverage** | ~8–15 tools change the page or return real URLs/hops | Chat sidebar, `{ ok: true }`, 3 toys or 80 toys |
| **Execution** | Hosted, complete, judges can run the three rooms in ChatGPT’s browser | Broken URL, Chrome-flag-only, “works on my machine” |
| **Potential impact** | Named pain (dirty download / sideload pages); demo treats that pain | “AI for everyone,” cartoon popups, lecture with no paint |
| **Creativity** | Second-click + hops on the glass; not a shop / form / showcase clone | Pizza, todo, Margin, 3D studio, crossword, travel notes |

**10-second test:** delete WebMCP. If it is the same product plus a chat box, it will not place.

**Thesis:** worse if you take the agent off the page; dangerous if the agent can finish alone.

## Do not build

Whole-web scanner, live fetch of random URLs, real APKs, iframe-other-sites, store, form factory, plugin platform, meme tour.

## One wink

Real dummy file is a one-line text: `you clicked once.` Not `GPT was right.` One decoy may say `this was the ad.`
