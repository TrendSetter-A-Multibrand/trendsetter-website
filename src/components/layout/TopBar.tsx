"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Wraps the ticker + header and publishes their combined height as the
 * `--header-h` CSS variable, so a full-screen section below can size itself
 * with `calc(100svh - var(--header-h))` and still end exactly at the fold.
 */
export function TopBar({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

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

  return <div ref={ref}>{children}</div>;
}
