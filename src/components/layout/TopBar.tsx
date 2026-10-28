"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** Ignored as trackpad jitter rather than a change of direction. */
const JITTER = 4;

/**
 * How far down the page has to be before the bar goes: 160 on a phone, where the
 * file draws it; 8 on a desktop, where the first version sent it away at once.
 */
const HIDE_AFTER_PHONE = 160;
const HIDE_AFTER_DESKTOP = 8;

const PHONE = "(max-width: 767px)";

/**
 * Wraps the ticker + header and publishes their combined height as the
 * `--header-h` CSS variable, so a full-screen section below can size itself
 * with `calc(100svh - var(--header-h))` and still end exactly at the fold.
 *
 * The bar leaves when the page is scrolled down and comes back on the first
 * upward move, in 250 ms, on every width. While it is away `--header-offset` -
 * where a sticky bar of the page's own (the FAQ chips, the brand letters, the
 * news rail) should stand - drops to 0, and is the bar's height otherwise.
 */
export function TopBar({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  // The size observer reads this, so it need not be torn down on every change
  const hiddenRef = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    function publishHeight() {
      const root = document.documentElement.style;
      root.setProperty("--header-h", `${el!.offsetHeight}px`);
      root.setProperty("--header-offset", hiddenRef.current ? "0px" : `${el!.offsetHeight}px`);
    }

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    hiddenRef.current = hidden;
    const el = ref.current;
    if (!el) return;
    document.documentElement.style.setProperty(
      "--header-offset",
      hidden ? "0px" : `${el.offsetHeight}px`
    );
  }, [hidden]);

  useEffect(() => {
    const phone = window.matchMedia(PHONE);
    let last = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < JITTER) return;
      last = y;
      const after = phone.matches ? HIDE_AFTER_PHONE : HIDE_AFTER_DESKTOP;
      setHidden(delta > 0 && y > after);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Own stacking layer: the nav dropdown hangs below the header and would
  // otherwise be painted over by the positioned sections that follow it.
  return (
    <div
      ref={ref}
      className={`sticky top-0 z-30 transition-transform duration-[250ms] ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
