import { useEffect, type RefObject } from "react";

type Options = {
  /** Walk the row along on its own. Off for rows that always fit. */
  autoplay?: boolean;
  /** How long each card sits still before the row steps on. */
  interval?: number;
};

/** One card plus the gap between them, read off the row itself. */
export function stepWidth(el: HTMLElement) {
  const first = el.firstElementChild as HTMLElement | null;
  if (!first) return el.clientWidth;
  const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
  return first.getBoundingClientRect().width + gap;
}

/**
 * Makes a horizontally scrolling row draggable, and optionally walks it along by
 * itself. Both work through the element's own scroll position rather than a
 * transform, so anything already listening for `scroll` - the red block riding
 * the rule over the news row, for one - follows without being told.
 *
 * The row stops while the pointer is on it, while it holds focus, while the tab
 * is in the background, and for anyone who has asked for less motion.
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

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      down = true;
      travelled = 0;
      startX = e.clientX;
      startLeft = el!.scrollLeft;
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
      el!.scrollLeft = startLeft - dx;
    }

    function onPointerUp() {
      down = false;
      el!.style.cursor = "";
      el!.style.userSelect = "";
      el!.style.scrollBehavior = "";
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
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", enter);
    el.addEventListener("focusout", leave);

    let timer = 0;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (autoplay && !still.matches) {
      timer = window.setInterval(() => {
        if (down || hovered || document.hidden) return;
        if (el.scrollWidth <= el.clientWidth) return;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
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
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", enter);
      el.removeEventListener("focusout", leave);
      window.clearInterval(timer);
    };
  }, [ref, autoplay, interval]);
}
