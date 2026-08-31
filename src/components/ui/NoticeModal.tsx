"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { buttonClass } from "@/components/ui/Button";

/**
 * A short message over a dimmed page, built like the brand sheet - same backdrop,
 * same white card, same cross in the corner - only as wide as it needs to be.
 *
 * Rendered at the end of the body rather than where it is written. The band it
 * is called from is one of the dark blocks, and everything inside those steps
 * down a notch on the weight axis - which is right for white on red and wrong
 * for black on white.
 */
export function NoticeModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Only ever opened by a click, so there is nothing to portal into on the
  // server and nothing to render there either
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-[600px] bg-white p-6 text-ink lg:p-10">
        <div className="flex items-start gap-6">
          <p className="flex-1 font-mono text-lg uppercase lg:text-2xl/none">
            [{title}]
          </p>

          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="shrink-0 p-1 transition-colors hover:text-brand"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="m1 1 16 16M17 1 1 17" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <div className="mt-6 text-base/6 lg:text-xl/6">{children}</div>

        <button
          type="button"
          onClick={onClose}
          className={`${buttonClass("primary")} mt-10 w-full lg:w-[180px]`}
        >
          Понятно
        </button>
      </div>
    </div>,
    document.body,
  );
}
