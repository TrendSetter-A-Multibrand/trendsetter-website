"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { stepWidth } from "@/lib/useCarousel";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { ArrowIcon, ArrowLeftIcon } from "@/components/ui/Icons";
import { iconButtonClass } from "@/components/ui/iconButton";

/**
 * The file's Section head, which every titled section and scrolling row wears:
 * "[ЗАГОЛОВОК]" in Label, a 1px Sage rule running out to the edge - the only
 * rule the section has - and then, if the section wants them, a "Смотреть все"
 * link and the arrows of a carousel. 24 between the parts on a desktop, 12 on a
 * phone; the arrows are for a desktop only, because on a phone the row swipes.
 *
 * The row the arrows drive is passed in rather than owned, because each section
 * lays its own cards out. They step it by one card and the gap after it, and
 * each goes to 30% at its end of the row. They are not drawn while the whole row
 * fits, since an arrow that cannot move is worse than none.
 *
 * The file has no scroll bar any more, so `controls="bar"` - the old red block
 * on a rule - now draws the arrows too.
 */
export function SectionTitle({
  heading,
  trackRef,
  controls,
  href,
  linkLabel = "Смотреть все",
  className = "",
}: {
  heading: string;
  /** Only a row that scrolls has one. */
  trackRef?: RefObject<HTMLElement | null>;
  /** Draw the carousel arrows for this row. */
  controls?: "bar" | "arrows";
  /** The "Смотреть все" link, when the section has a page of its own. */
  href?: string;
  linkLabel?: string;
  /** Kept for the callers that still pass it; the rule is one thickness now. */
  thin?: boolean;
  /** Each section keeps its own air around the row. */
  className?: string;
}) {
  // True until measured, so the server draws what the file draws and hydration
  // has nothing to disagree about; the first measurement takes it away where
  // there is nothing to scroll.
  const [scrollable, setScrollable] = useState(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef?.current;
    if (!track) return;
    setScrollable(track.scrollWidth > track.clientWidth + 1);
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
  }, [trackRef]);

  // After every render: a card added or removed changes the content width
  useEffect(measure);

  useEffect(() => {
    const track = trackRef?.current;
    if (!track || !controls) return;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    track.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", measure);
    };
  }, [trackRef, controls, measure]);

  /** One card plus the gap after it, the same step the row walks itself along by. */
  function step(direction: 1 | -1) {
    const track = trackRef?.current;
    if (!track) return;
    track.scrollBy({ left: direction * stepWidth(track), behavior: "smooth" });
  }

  const arrows = Boolean(controls) && scrollable;

  return (
    <div className={`flex items-center gap-3 md:gap-6 ${className}`}>
      <h2 className="type-label min-w-0 whitespace-nowrap text-ink">[{heading}]</h2>
      <div className="h-px min-w-4 flex-1 bg-ink" />

      {href && (
        <LinkArrow href={href} context="plain" className="shrink-0">
          {linkLabel}
        </LinkArrow>
      )}

      {arrows && (
        <div className="flex shrink-0 gap-2 max-md:hidden">
          <button
            type="button"
            aria-label="Назад"
            disabled={atStart}
            onClick={() => step(-1)}
            className={iconButtonClass("outline")}
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Вперёд"
            disabled={atEnd}
            onClick={() => step(1)}
            className={iconButtonClass("outline")}
          >
            <ArrowIcon />
          </button>
        </div>
      )}
    </div>
  );
}
