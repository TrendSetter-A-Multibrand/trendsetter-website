/**
 * The two browser APIs jsdom leaves out that our components expect to find.
 *
 * `matchMedia` is what a row asks about reduced motion before it walks itself
 * along, and `ResizeObserver` is how a section title watches the row's width.
 * Neither is faked with behaviour: the media query answers «no» - the case
 * every test but a reduced-motion one is about - and the observer does nothing,
 * because a test that cares about a size change writes the size itself.
 *
 * Assigned rather than stubbed through vi, so that a test calling
 * `vi.unstubAllGlobals()` does not take them away with its own stubs.
 */
window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia;

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;
