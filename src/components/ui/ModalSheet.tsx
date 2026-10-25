"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CardImage } from "@/components/ui/CardImage";
import { CloseIcon } from "@/components/ui/Icons";
import { iconButtonClass } from "@/components/ui/iconButton";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The file's Sheet. On a desktop it stands in the middle of the screen over the
 * page dimmed to the overlay colour - 720 wide, or 880 for a brand, a space or
 * a shop - with a 1px Sage frame; the head holds a "[метка]" in Caption over the
 * title in H2 and a close button. On a phone it is the whole screen with no
 * dimming and a top row with the cross that stays put while the rest scrolls.
 * It comes up 24 from below and fades in over 250 ms.
 *
 * Esc and a click on the dimmed page close it, the page behind stops scrolling,
 * focus goes in and stays in, and goes back to where it was on closing. What
 * goes inside is the caller's; blocks keep their own air off the sheet's edges
 * (`px-6 lg:px-10`) except the photo, which runs the full width.
 */
export function ModalSheet({
  title,
  label,
  labels,
  size = "lg",
  onClose,
  children,
}: {
  title: string;
  /** The line over the title, brackets added here: "Запись на событие". */
  label?: string;
  /** Several rubrics in a row, each in brackets and Red - a brand's categories. */
  labels?: string[];
  /** 720 for a form, 880 for a brand, space or shop. */
  size?: "sm" | "lg";
  onClose: () => void;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-close]")?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const nodes = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      before?.focus?.();
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[70] md:flex md:items-center md:justify-center md:p-4"
    >
      {/* Only a desktop dims the page; a phone's sheet covers it */}
      <button
        type="button"
        aria-label="Закрыть"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 hidden bg-overlay md:block"
      />

      <div
        ref={panel}
        className={`relative flex h-full w-full animate-sheet-in flex-col overflow-y-auto bg-white text-ink md:h-auto md:max-h-full md:border md:border-ink ${
          size === "sm" ? "md:max-w-[720px]" : "md:max-w-[880px]"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-white p-4 md:static md:p-8 md:pb-6">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {label && <p className="type-caption">[{label}]</p>}
            {labels && labels.length > 0 && (
              <p className="type-caption text-brand">{labels.map((l) => `[${l}]`).join(" ")}</p>
            )}
            <p className="type-h2">{title}</p>
          </div>
          <button
            type="button"
            data-close
            aria-label="Закрыть"
            onClick={onClose}
            className={`${iconButtonClass()} md:-mr-2 md:-mt-2`}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-6 pb-6 md:gap-8 md:pb-8">{children}</div>
      </div>
    </div>,
    document.body
  );
}

/** The sheet's photo: the full width, 21:9 on a desktop, 240 tall on a phone unless `fixed`. */
export function ModalPhoto({
  src,
  fixed = false,
}: {
  src?: string;
  /** Keep a fixed 400 at every width - what the sheet drew before. */
  fixed?: boolean;
}) {
  return (
    <div
      className={`relative w-full shrink-0 bg-surface ${
        fixed ? "h-[400px]" : "h-60 md:aspect-[21/9] md:h-auto"
      }`}
    >
      <CardImage src={src} sizes="880px" />
    </div>
  );
}
