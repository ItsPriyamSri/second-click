# Second Click

A download page like the ones people already hate: walls, fake buttons, a second-click URL, declared hops. You and an agent share this tab. The agent peels and paints. Only you start the dummy file.

This is not a scanner for the rest of the web. WebMCP tools exist only on this origin.

Live: https://itspriyamsri.github.io/second-click/

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

Site tools only exist in the **ChatGPT desktop app built-in browser**. They do not exist in Chrome, Cursor, Codex CLI, or a Codex computer-use session that reports `Capability is not available: webmcp`. That message is the **client** missing WebMCP, not a missing `registerTool` call.

1. ChatGPT **desktop** (latest). Model **GPT-5.6 Sol** or **GPT-5.6 Terra**. Not Luna. Not Enterprise/Edu.
2. Settings → Browser → Permissions → **Enable site tools**.
3. Open the built-in browser from the desktop toolbar (not Chrome).
4. Go to `https://itspriyamsri.github.io/second-click/?v=20260831`
5. Wait until the dark footer says `Site tools: 10 registered`, and the address-bar **Site tools** arrow lists ten tools. If the footer stays at `no document.modelContext`, stop — this client cannot see WebMCP.
6. Prompt:

```
Stay on this tab. Do not open Chrome. Do not look up a host capability named webmcp.

First read the footer `data-webmcp-tools`. If it is not 10, report the footer text and stop.

Then use only these site tools, in order:
1. get_page_state
2. dismiss_walls
3. get_core_visible
4. Stop and tell me to click "I am a person", then "Continue to Mirror Downloads". Do not click those yourself.
5. After I continue: list_clickables, highlight_real, dim_decoys, explain_trap on one decoy id
6. After I click the dull real download (dl-real): reveal_second_url and show_redirect_chain on dl-swap
7. request_open
8. Stop. I will confirm the dummy file. Do not download. Do not navigate.

If site tools are missing, say so. Do not click walls by hand unless I ask.
```

7. You complete **I am a person**, **Continue to Mirror Downloads**, then later **Download File**.
8. The file must read: `you clicked once.`

Chrome flag testing is optional. Judges use ChatGPT's browser.

## Tools

get_page_state, dismiss_walls, list_clickables, reveal_second_url, show_redirect_chain, highlight_real, dim_decoys, explain_trap, request_open, get_core_visible.

No tool starts the file.

## License

MIT. See LICENSE.