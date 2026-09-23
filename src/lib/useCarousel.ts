import { useEffect, type RefObject } from "react";

type Options = {
  /** Walk the row along on its own. Off for rows that always fit. */
  autoplay?: boolean;
  /** How long each card sits still before the row steps on. */
  interval?: number;
};

/**
 * How long a manual scroll keeps the row from stepping on its own. A mouse
 * never needs this - hover already holds the row still - but a finger has no
 * hover to leave, so without a cooldown the row would fight a swipe on the
 * very next tick.
 */
const PAUSE_AFTER_SCROLL = 5000;

/** One card plus the gap between them, read off the row itself. */
export function stepWidth(el: HTMLElement) {
  const first = el.firstElementChild as HTMLElement | null;
  if (!first) return el.clientWidth;
  const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
  return first.getBoundingClientRect().width + gap;
}

/** Lifts the row's own snap for the length of a drag, so a card mid-flight isn't yanked back. */
export function holdSnap(el: HTMLElement) {
  el.style.scrollSnapType = "none";
}

/**
 * Hands the row's snap back and, below `sm` where it is actually set, settles
 * on whichever card now sits closest to centre - the drag can easily leave one
 * only partway there.
 */
export function settleSnap(el: HTMLElement) {
  el.style.scrollSnapType = "";
  const type = getComputedStyle(el).scrollSnapType;
  // Empty or "none" is `sm+`, where `sm:snap-none` holds, and jsdom - nothing
  // to settle on either.
  if (!type || type === "none") return;

  const box = el.getBoundingClientRect();
  const mid = box.left + el.clientWidth / 2;

  let delta = Infinity;
  for (const child of el.children) {
    const r = (child as HTMLElement).getBoundingClientRect();
    const d = r.left + r.width / 2 - mid;
    if (Math.abs(d) < Math.abs(delta)) delta = d;
  }
  if (!Number.isFinite(delta)) return;

  const left = Math.min(
    Math.max(el.scrollLeft + delta, 0),
    el.scrollWidth - el.clientWidth,
  );
  el.scrollTo({ left, behavior: "smooth" });
}

/**
 * Makes a horizontally scrolling row draggable, and optionally walks it along by
 * itself. Both work through the element's own scroll position rather than a
 * transform, so anything already listening for `scroll` - the red block riding
 * the rule over the news row, for one - follows without being told.
 *
 * The row stops while the pointer is anywhere on its section, while it holds
 * focus, while the tab is in the background, and for anyone who has asked for
 * less motion. The section rather than the row itself: a hand on its way to a
 * card often rests on the heading above them first, and a row that walks on
 * under it reads as one that does not stop at all.
 *
 * A mouse also gets this through hover, but a finger has nothing of the kind
 * to leave, so any scroll of the row - dragged, swiped, or wheeled - buys it
 * a few seconds of quiet before the row is trusted to walk on again.
 *
 * Below `sm` the row also snaps a card at a time; snap is lifted for the
 * length of a drag and the row settles back onto the nearest card once the
 * hand lets go.
 */
export function useCarousel<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { autoplay = false, interval = 4000 }: Options = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startLeft = 0;
    let down = false;
    let travelled = 0;
    let hovered = false;
    let lastScroll = 0;
    let ownScroll = false;

    function markScroll() {
      if (!ownScroll) lastScroll = Date.now();
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      down = true;
      travelled = 0;
      startX = e.clientX;
      startLeft = el!.scrollLeft;
      markScroll();
    }

    function onPointerMove(e: PointerEvent) {
      if (!down) return;
      const dx = e.clientX - startX;
      travelled = Math.max(travelled, Math.abs(dx));
      // Below a few pixels this is still a click on a card, so leave it alone
      if (travelled <= 3) return;
      el!.setPointerCapture(e.pointerId);
      el!.style.cursor = "grabbing";
      el!.style.userSelect = "none";
      // The arrows scroll these rows smoothly, which would put the row seconds
      // behind the hand it is being dragged by
      el!.style.scrollBehavior = "auto";
      // Below `sm` the row snaps a card at a time; held off while the hand
      // moves it, so the snap doesn't fight the drag.
      holdSnap(el!);
      el!.scrollLeft = startLeft - dx;
    }

    function endDrag() {
      down = false;
      el!.style.cursor = "";
      el!.style.userSelect = "";
      el!.style.scrollBehavior = "";
    }

    function onPointerUp() {
      const dragged = travelled > 3;
      endDrag();
      if (dragged) settleSnap(el!);
    }

    /**
     * A cancelled pointer on touch means the gesture went to the browser's own
     * scroll, which already carries its own snap through to a stop - a
     * `scrollTo` here would fight the flick still under way.
     */
    function onPointerCancel() {
      endDrag();
      el!.style.scrollSnapType = "";
    }

    /** A drag that happens to end on a card would otherwise open it */
    function onClick(e: MouseEvent) {
      if (travelled > 3) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    /** Photos are draggable by default and would fight for the gesture */
    function onDragStart(e: Event) {
      if (down) e.preventDefault();
    }

    const enter = () => {
      hovered = true;
    };
    const leave = () => {
      hovered = false;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerCancel);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    // Catches a finger's own native scroll too, which never fires a pointer
    // sequence of its own once the browser takes the gesture over.
    el.addEventListener("scroll", markScroll, { passive: true });
    /** The heading and its bar belong to the row as far as a hand is concerned. */
    const zone = el.closest("section") ?? el;
    zone.addEventListener("pointerenter", enter);
    zone.addEventListener("pointerleave", leave);
    zone.addEventListener("focusin", enter);
    zone.addEventListener("focusout", leave);

    let timer = 0;
    let settleTimer = 0;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    function onScrollEnd() {
      ownScroll = false;
      window.clearTimeout(settleTimer);
    }

    if (autoplay && !still.matches) {
      el.addEventListener("scrollend", onScrollEnd);
      timer = window.setInterval(() => {
        if (down || hovered || document.hidden) return;
        if (Date.now() - lastScroll < PAUSE_AFTER_SCROLL) return;
        if (el.scrollWidth <= el.clientWidth) return;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
        ownScroll = true;
        // `scrollend` isn't everywhere yet, so a fallback timer clears the flag
        // too - either way a step of the row's own is never read as a scroll.
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(onScrollEnd, 1000);
        el.scrollTo({
          left: atEnd ? 0 : el.scrollLeft + stepWidth(el),
          behavior: "smooth",
        });
      }, interval);
    }

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerCancel);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
      el.removeEventListener("scroll", markScroll);
      el.removeEventListener("scrollend", onScrollEnd);
      zone.removeEventListener("pointerenter", enter);
      zone.removeEventListener("pointerleave", leave);
      zone.removeEventListener("focusin", enter);
      zone.removeEventListener("focusout", leave);
      window.clearInterval(timer);
      window.clearTimeout(settleTimer);
    };
  }, [ref, autoplay, interval]);
}
