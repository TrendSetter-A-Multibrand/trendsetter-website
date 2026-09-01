"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { stepWidth } from "@/lib/useCarousel";

/** The red block's width in the file, and the one number the bar's maths needs. */
const THUMB_WIDTH = 56;

/**
 * The library's Title, which every scrolling row wears: the heading, and then
 * either a 2px rule with a 56x24 red block riding it, or the two arrows - 24
 * square, 40 apart.
 *
 * Either, not both. The component holds all three layers and each screen hides
 * the ones it does not use: the news row and the article's related row are drawn
 * with the bar and no arrows, events and the journal with arrows and no bar, and
 * the shops section with neither. So `controls` says which one this row gets.
 *
 * The row it drives is passed in rather than owned, because each section lays
 * its own cards out. Everything here reads that element's scroll position, so
 * dragging the row, dragging the block, the arrows and the row walking on by
 * itself all end up in the same place.
 *
 * The file draws twelve positions of the block. Scroll position is continuous,
 * so the block simply rides it instead.
 */
export function SectionTitle({
  heading,
  trackRef,
  controls,
  className = "",
}: {
  heading: string;
  /** Only a row that scrolls has one; the shops and markets titles do not. */
  trackRef?: RefObject<HTMLElement | null>;
  /** Which of the file's two controls this row is drawn with, if either. */
  controls?: "bar" | "arrows";
  /** Each section keeps its own air around the row. */
  className?: string;
}) {
  const bar = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);

  /**
   * Written straight to the DOM: through state this would re-render every card
   * in the row on every scroll frame.
   */
  const sync = useCallback(() => {
    const track = trackRef?.current;
    if (!track || !bar.current || !thumb.current) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
    thumb.current.style.transform = `translateX(${
      progress * (bar.current.clientWidth - THUMB_WIDTH)
    }px)`;
  }, [trackRef]);

  useEffect(() => {
    const track = trackRef?.current;
    if (!track || controls !== "bar") return;
    sync();
    track.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [trackRef, sync, controls]);

  function scrollToPointer(clientX: number) {
    if (!trackRef) return;
    const track = trackRef.current;
    if (!track || !bar.current) return;

    const rect = bar.current.getBoundingClientRect();
    const usable = rect.width - THUMB_WIDTH;
    const offset = clientX - rect.left - THUMB_WIDTH / 2;
    const progress = usable > 0 ? Math.min(1, Math.max(0, offset / usable)) : 0;
    track.scrollLeft = progress * (track.scrollWidth - track.clientWidth);
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    bar.current?.setPointerCapture(e.pointerId);
    scrollToPointer(e.clientX);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!bar.current?.hasPointerCapture(e.pointerId)) return;
    scrollToPointer(e.clientX);
  }

  /** One card plus the gap after it, the same step the row walks itself along by. */
  function step(direction: 1 | -1) {
    const track = trackRef?.current;
    if (!track) return;
    track.scrollBy({ left: direction * stepWidth(track), behavior: "smooth" });
  }

  return (
    <div
      className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-10 ${className}`}
    >
      <h2 className="min-w-0 font-mono text-xl/[26px] uppercase tracking-[3px] lg:whitespace-nowrap lg:text-2xl/[31.2px]">
        [{heading}]
      </h2>

      {controls === "bar" && (
        <div
          ref={bar}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          className="relative flex h-6 flex-1 cursor-pointer touch-none select-none items-center"
        >
          <div className="h-0.5 w-full bg-ink" />
          <div
            ref={thumb}
            style={{ width: THUMB_WIDTH }}
            className="absolute left-0 h-6 cursor-grab bg-brand active:cursor-grabbing"
          />
        </div>
      )}

      {controls === "arrows" && (
        <div className="flex shrink-0 gap-10">
          <button type="button" aria-label="Назад" onClick={() => step(-1)}>
            <Arrow className="rotate-180" />
          </button>
          <button type="button" aria-label="Вперёд" onClick={() => step(1)}>
            <Arrow />
          </button>
        </div>
      )}
    </div>
  );
}

/** 24 square, the stroke running the full width of it. */
function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M0 12h22M13 3l9 9-9 9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
