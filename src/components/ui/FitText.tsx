"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Scales its text to span its container's width, edge to edge. */
export function FitText({
  children,
  className,
  widthRatio = 1,
}: {
  children: string;
  className?: string;
  /** Fraction of the container width to fill (e.g. 0.92 leaves a safety margin so rounding never clips the last letter). */
  widthRatio?: number;
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
      const scale = (container!.clientWidth * widthRatio) / text!.scrollWidth;
      setFontSize(currentSize * scale);
    }

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, [children, widthRatio]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <span
        ref={textRef}
        style={{
          fontSize,
          display: "inline-block",
          whiteSpace: "nowrap",
          visibility: fontSize ? "visible" : "hidden",
        }}
        className={className}
      >
        {children}
      </span>
    </div>
  );
}
