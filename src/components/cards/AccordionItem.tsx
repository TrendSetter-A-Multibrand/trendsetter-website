"use client";

import { useId, type ReactNode } from "react";
import { MinusIcon, PlusIcon } from "@/components/ui/Icons";

/**
 * The file's Accordion item - one for the whole site (FAQ, vacancies, onboarding).
 * A row at least 56 tall: an optional number in mono Red, the question in H4 and
 * a 24 plus that becomes a minus. Open, the answer sits in Text-2 under the
 * question with 24 below it, indented to the question when there is a number. It
 * opens over 300 ms in height and opacity; hovering turns the question Red. A
 * thin rule closes each item - the item draws it, so a list is just items.
 */
export function AccordionItem({
  question,
  number,
  open,
  onToggle,
  children,
}: {
  question: ReactNode;
  /** "01" - set in mono at the size of the question. */
  number?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="group flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="flex min-w-0 flex-1 items-baseline gap-3 md:gap-4">
          {number && <span className="type-h4 font-mono font-normal text-brand">{number}</span>}
          <span className="type-h4 text-ink transition-colors duration-150 group-hover:text-brand">
            {question}
          </span>
        </span>
        {open ? <MinusIcon /> : <PlusIcon />}
      </button>

      {/* grid-rows 0fr -> 1fr animates the height without measuring it */}
      <div
        id={id}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div
            className={`type-body max-w-[720px] pb-6 text-text-2 ${
              number ? "pl-9 md:pl-[47px]" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
