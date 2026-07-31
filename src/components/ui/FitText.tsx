"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Scales its text so it always spans the full width of its container, edge to edge. */
export function FitText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number>();

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    function fit() {
      const currentSize = parseFloat(getComputedStyle(text!).fontSize);
      const scale = container!.clientWidth / text!.scrollWidth;
      setFontSize(currentSize * scale);
    }

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <span
        ref={textRef}
        style={{ fontSize, whiteSpace: "nowrap", visibility: fontSize ? "visible" : "hidden" }}
        className={className}
      >
        {children}
      </span>
    </div>
  );
}
