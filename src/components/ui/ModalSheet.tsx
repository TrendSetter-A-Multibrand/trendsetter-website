"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CardImage } from "@/components/ui/CardImage";

/**
 * The library's Modal shell: a 1280 sheet over the dimmed page, 40 of air at
 * the head and foot and 40 between blocks (24 at 375), a header with the title
 * and the cross. Esc and a click on the dimmed page close it, and the page
 * behind stops scrolling. What goes inside is the caller's; blocks keep 40 off
 * the sheet's edges (`px-6 lg:px-10`) except the photo, which runs full width.
 */
export function ModalSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center pt-16 lg:items-center lg:p-4"
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative flex max-h-full w-full max-w-[1280px] flex-col gap-6 overflow-y-auto bg-white py-6 text-ink lg:gap-10 lg:py-10">
        <div className="flex items-center justify-between gap-6 px-6 lg:px-10">
          <p className="text-2xl/none font-medium tracking-[1px]">{title}</p>

          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="shrink-0 transition-colors hover:text-brand"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m3 3 18 18M21 3 3 21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}

/** The sheet's photo: the full width, 400 tall (240 at 375 unless `fixed`). */
export function ModalPhoto({
  src,
  fixed = false,
}: {
  src?: string;
  /** Keep 400 at every width - what the sheet drew before the 375 frame. */
  fixed?: boolean;
}) {
  return (
    <div
      className={`relative w-full shrink-0 ${fixed ? "h-[400px]" : "h-60 lg:h-[400px]"}`}
    >
      <CardImage src={src} sizes="1280px" />
    </div>
  );
}
