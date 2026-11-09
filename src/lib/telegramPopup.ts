/**
 * When the Telegram pop-up may show (05.11). Once a visit it comes up five
 * seconds after the page opens; if that was closed it comes once more at the
 * foot of the page. «Подписаться» is the end of it for good; the cross puts it
 * off for seven days - from the next visit, the one in progress still gets its
 * second chance at the foot.
 */
export const ENTRY_DELAY_MS = 5000;
export const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
/** How close to the foot of the page counts as the end of it. */
export const END_MARGIN_PX = 160;

export type PopupMemory = { never?: boolean; until?: number };
/** What this visit has already seen: the entry one closed, or both done. */
export type VisitMemory = "entry-closed" | "done" | null;

export type PopupPlan = "none" | "entry" | "end";

/** What to do on a page that has just opened. */
export function planFor(memory: PopupMemory, visit: VisitMemory, now: number): PopupPlan {
  if (memory.never || visit === "done") return "none";
  if (visit === "entry-closed") return "end";
  if (memory.until !== undefined && memory.until > now) return "none";
  return "entry";
}

export const snoozeUntil = (now: number) => now + SNOOZE_MS;

export const atTheFoot = (scrolled: number, viewport: number, page: number) =>
  scrolled + viewport >= page - END_MARGIN_PX;
