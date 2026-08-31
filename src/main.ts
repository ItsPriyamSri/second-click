import { render } from "./ui";
import { subscribe } from "./store";
import {
  listToolContexts,
  registerSiteTools,
  setWebmcpStatus,
} from "./webmcp";

const root = document.querySelector("#app");
if (!(root instanceof HTMLElement)) {
  throw new Error("#app missing");
}

const paint = () => render(root);
subscribe(paint);
paint();

void (async () => {
  let result = await registerSiteTools(20_000);
  if (result.registered.length === 0) {
    setWebmcpStatus({
      count: 0,
      text: listToolContexts().length
        ? "Site tools: modelContext present but registerTool failed"
        : "Site tools: no document.modelContext. Use ChatGPT desktop in-app browser, GPT-5.6 Sol or Terra, Settings → Browser → Enable site tools. Codex CLI and plain Chrome will not see tools.",
    });
    paint();
    result = await registerSiteTools(60_000);
  }
  if (result.registered.length > 0) {
    setWebmcpStatus({
      count: result.registered.length,
      text: `Site tools: ${result.registered.length} registered`,
    });
    paint();
  }
})();
