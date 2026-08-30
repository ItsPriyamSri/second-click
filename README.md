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

Chrome flag testing is optional. Judges use ChatGPT's browser.

## Tools

get_page_state, dismiss_walls, list_clickables, reveal_second_url, show_redirect_chain, highlight_real, dim_decoys, explain_trap, request_open, get_core_visible.

No tool starts the file.

## License

MIT. See LICENSE.