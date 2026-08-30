import { createInitialState, type PageState } from "./state";

let state = createInitialState();
const listeners = new Set<() => void>();

export function getState(): PageState {
  return state;
}

export function setState(next: PageState): void {
  state = next;
  for (const fn of listeners) fn();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function resetState(): void {
  state = createInitialState();
}