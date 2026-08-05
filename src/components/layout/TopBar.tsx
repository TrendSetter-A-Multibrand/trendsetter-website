"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Ignored as trackpad jitter rather than a change of direction. */
const JITTER = 4;

/**
 * Wraps the ticker + header and publishes their combined height as the
 * `--header-h` CSS variable, so a full-screen section below can size itself
 * with `calc(100svh - var(--header-h))` and still end exactly at the fold.
 *
 * The bar also drops in from above on every navigation, leaves as soon as the
 * page moves down and comes back on the first hint of upward scroll.
 */
export function TopBar({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Which path the bar was scrolled away on, so that landing on another one
  // brings it back without any extra bookkeeping
  const [hiddenOn, setHiddenOn] = useState<string | null>(null);
  const hidden = hiddenOn === pathname;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    function publishHeight() {
      document.documentElement.style.setProperty(
        "--header-h",
        `${el!.offsetHeight}px`
      );
    }

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let last = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < JITTER) return;
      last = y;
      // 8px down is already enough to send it away; any upward move brings it
      // back, however small
      setHiddenOn(delta > 0 && y > 8 ? pathname : null);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Own stacking layer: the nav dropdown hangs below the header and would
  // otherwise be painted over by the positioned sections that follow it.
  return (
    <div
      ref={ref}
      className={`sticky top-0 z-30 transition-transform duration-[400ms] ease-[cubic-bezier(0,0,0.8,1)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Keyed on the path so the intro animation runs again on every
          navigation, not just on the first load */}
      <div key={pathname} className="animate-topbar-in">
        {children}
      </div>
    </div>
  );
}
