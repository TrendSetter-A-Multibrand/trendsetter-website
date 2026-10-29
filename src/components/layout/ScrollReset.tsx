"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * A new page opens at its top. Next.js leaves the scroll alone when the top of
 * the new page is already on screen - and a section with a loading skeleton
 * arrives short, so after a link in the footer the skeleton sat in view, nothing
 * scrolled, and the real page filled in around a reader left at its foot.
 *
 * Back and forward keep the browser's own restored position, a link to an
 * anchor keeps its anchor, and a filter that only changes the query stays put.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const first = useRef(true);
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => (popped.current = true);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (popped.current) {
      popped.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
