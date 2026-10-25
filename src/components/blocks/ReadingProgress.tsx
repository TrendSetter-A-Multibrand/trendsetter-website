"use client";

import { useEffect, useRef } from "react";

/**
 * The file's reading progress: a 3 tall Red bar fixed to the top of the screen
 * that grows with how much of the article has gone past. It measures the
 * element it is given, not the page - the crumbs above and the pieces under the
 * text are not part of the reading. Written straight to the DOM so a scroll
 * frame does not re-render anything.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    function update() {
      const rect = target!.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const done = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${done})`;
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-brand" />
    </div>
  );
}
