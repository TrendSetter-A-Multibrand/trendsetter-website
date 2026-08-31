"use client";

import type { ReactNode } from "react";

/**
 * The drop the FAQ opens its questions with, and now the legal pages as well:
 * one row, a rule under it, and a plus that loses its upright when the row
 * opens. Rows are 38 of air above and below, 30 below once open.
 *
 * The designer asked for this one drop everywhere rather than one per section -
 * "чтобы не плодить компоненты" - so the title arrives as a node. Each page
 * keeps its own type on it and takes the rhythm from here.
 */
export function Drop({
  title,
  open,
  onToggle,
  children,
}: {
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-6 pt-[38px] text-left ${
          open ? "pb-[30px]" : "pb-[38px]"
        }`}
      >
        {title}
        <Toggle open={open} />
      </button>

      {open && <div className="pb-8">{children}</div>}

      <div className="h-px bg-ink/15" />
    </div>
  );
}

/** 22 square, 2px strokes; the upright of the plus goes when the row opens. */
function Toggle({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M0 11h22" stroke="currentColor" strokeWidth="2" />
      {!open && <path d="M11 0v22" stroke="currentColor" strokeWidth="2" />}
    </svg>
  );
}
