"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CardImage } from "@/components/ui/CardImage";
import { Divider } from "@/components/ui/Divider";

/**
 * The sheet a Space/Collaboration card opens. The file (2452:7426) draws this
 * as the library's Modal with the Brand instance's own fields still in it
 * (logo, store availability, events) - copied over as a placeholder for "a
 * modal goes here", not redrawn for what these cards actually have. A Space
 * card carries neither a brand's stock levels nor its own events, so this
 * keeps only the parts common to every sheet in the file: header with title
 * and close, full-width photo, body copy, closing divider.
 */
export function InfoModal({
  title,
  body,
  image,
  onClose,
}: {
  title: string;
  body?: string;
  image?: string;
  onClose: () => void;
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative flex max-h-full w-full max-w-[1280px] flex-col gap-6 overflow-y-auto bg-white py-6 text-ink lg:gap-10 lg:py-10">
        <div className="flex items-center justify-between gap-6 px-6 lg:px-10">
          <p className="text-lg font-medium tracking-[1px] lg:text-2xl/none">
            {title}
          </p>

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

        <div className="flex flex-col gap-6">
          {/* 400 tall, the full sheet across - the one block that ignores the
              sheet's own margins, same as every other Modal in the file */}
          <div className="relative h-[400px] w-full shrink-0">
            <CardImage src={image} sizes="1280px" />
          </div>

          {body && (
            <div className="whitespace-pre-line px-6 text-base/5 lg:px-10">
              {body}
            </div>
          )}

          <div className="px-6 lg:px-10">
            <Divider />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
