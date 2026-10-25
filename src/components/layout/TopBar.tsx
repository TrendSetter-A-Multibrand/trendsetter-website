"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** Ignored as trackpad jitter rather than a change of direction. */
const JITTER = 4;

/** How far down the page has to be before the bar goes (the file: 160). */
const HIDE_AFTER = 160;

/** Below this the file draws the phone layout, and only there the bar hides. */
const PHONE = "(max-width: 767px)";

/**
 * Wraps the ticker + header and publishes their combined height as the
 * `--header-h` CSS variable, so a full-screen section below can size itself
 * with `calc(100svh - var(--header-h))` and still end exactly at the fold.
 *
 * On a phone the bar leaves when the page is scrolled down past 160 and comes
 * back on the first upward move, in 250 ms (the file's "Шапка: скрытие при
 * прокрутке"). On a desktop it is always there.
 */
export function TopBar({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

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
    const phone = window.matchMedia(PHONE);
    let last = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < JITTER) return;
      last = y;
      setHidden(phone.matches && delta > 0 && y > HIDE_AFTER);
    }

    // Widening the window past the phone layout brings the bar back at once
    function onChange() {
      if (!phone.matches) setHidden(false);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    phone.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      phone.removeEventListener("change", onChange);
    };
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
