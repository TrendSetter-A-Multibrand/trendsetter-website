"use client";

import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";

/**
 * A row of photos that scrolls sideways. A finger swipes it on its own; a mouse
 * cannot, so on a wide screen it can also be dragged, and two arrows under it
 * step it along. The arrows go quiet at either end instead of doing nothing.
 */
export function GalleryStrip({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const grab = useRef<{ x: number; left: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  function down(e: PointerEvent<HTMLDivElement>) {
    // Touch and pen scroll natively; only the mouse needs carrying
    if (e.pointerType !== "mouse" || !strip.current) return;
    grab.current = { x: e.clientX, left: strip.current.scrollLeft };
    setDragging(true);
  }

  function move(e: PointerEvent<HTMLDivElement>) {
    if (!grab.current || !strip.current) return;
    strip.current.scrollLeft = grab.current.left - (e.clientX - grab.current.x);
  }

  function release() {
    grab.current = null;
    setDragging(false);
  }

  function step(direction: 1 | -1) {
    const el = strip.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={strip}
        onScroll={measure}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        // The browser's own picture-dragging would take the gesture over
        onDragStart={(e) => e.preventDefault()}
        // Snapping fights a drag, so it waits until the mouse lets go
        className={`${className} ${dragging ? "cursor-grabbing select-none" : "snap-x snap-mandatory lg:cursor-grab"}`}
      >
        {children}
      </div>

      <div className="mt-4 hidden justify-end gap-10 px-10 lg:flex">
        <button
          type="button"
          aria-label="Назад"
          disabled={edge.start}
          onClick={() => step(-1)}
          className="transition-opacity disabled:opacity-30"
        >
          <Arrow className="rotate-180" />
        </button>
        <button
          type="button"
          aria-label="Вперёд"
          disabled={edge.end}
          onClick={() => step(1)}
          className="transition-opacity disabled:opacity-30"
        >
          <Arrow />
        </button>
      </div>
    </div>
  );
}

/** The same 24 square arrow the section titles use. */
function Arrow({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M0 12h22M13 3l9 9-9 9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
