"use client";

import { useState } from "react";
import { ChevronIcon } from "@/components/ui/Icons";

/**
 * One group of the footer. On a desktop it is a Caption heading in square
 * brackets over its links, always open. On a phone the group is an accordion
 * row 56 tall with a Text-2 rule under it, closed to begin with; the chevron
 * turns over when it opens. The links are in the page either way, so a search
 * engine and a screen reader see all of them.
 */
export function FooterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-md:border-b max-md:border-text-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="type-caption flex min-h-14 w-full items-center justify-between text-left text-white md:pointer-events-none md:min-h-0"
      >
        [{title}]
        <ChevronIcon
          size={20}
          className={`transition-transform duration-150 md:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`${open ? "block pb-4" : "hidden"} md:mt-4 md:block md:pb-0`}>
        {children}
      </div>
    </div>
  );
}
