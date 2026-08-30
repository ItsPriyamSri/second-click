import { render } from "./ui";
import { subscribe } from "./store";
import { registerSiteTools } from "./webmcp";

const root = document.querySelector("#app");
if (!(root instanceof HTMLElement)) {
  throw new Error("#app missing");
}

const paint = () => render(root);
subscribe(paint);
paint();
void registerSiteTools();