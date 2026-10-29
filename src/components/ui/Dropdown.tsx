"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronIcon } from "@/components/ui/Icons";

/**
 * The file's Select, standing in for a native one: a 44-tall header carrying the
 * choice and a 20 chevron, and a white panel that opens under it over the page
 * rather than pushing it down. On the red planes of the forms it is drawn the
 * way the other fields are - a white 1px rule on the red, the placeholder at 75%
 * white, a 2px rule while open - and on a light ground it is white with a Sage
 * rule.
 *
 * The list is painted from the body and placed against the header's own box.
 * A native select's popup is not part of the page either, and it has to be that
 * way here: the band this stands on clips its own smiley, and a list left in
 * place would be cut off at the same edge.
 *
 * The choice rides in a hidden input, so the form around it needs to know
 * nothing about any of this.
 */
export type DropdownOption = string | { value: string; short: string };

const valueOf = (o: DropdownOption) => (typeof o === "string" ? o : o.value);

/** One name below sm, another from it up - the director's subject is long. */
function Label({ option }: { option: DropdownOption }) {
  if (typeof option === "string") return <>{option}</>;
  return (
    <>
      <span className="sm:hidden">{option.short}</span>
      <span className="max-sm:hidden">{option.value}</span>
    </>
  );
}

export function Dropdown({
  name,
  placeholder,
  options,
  invalid,
  surface = "red",
  tall = false,
  onChange,
}: {
  name: string;
  placeholder: string;
  options: DropdownOption[];
  invalid?: boolean;
  surface?: "light" | "red";
  /** 56 tall, level with the inputs beside it, instead of the select's own 44. */
  tall?: boolean;
  /** Told the new choice - its value, as the option names it. */
  onChange?: (value: string) => void;
}) {
  const red = surface === "red";
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const chosen = options.find((o) => valueOf(o) === value);
  const [box, setBox] = useState<DOMRect | null>(null);
  const header = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function place() {
      if (header.current) setBox(header.current.getBoundingClientRect());
    }
    // pointerdown rather than click: the list is out of the tree, so a click on
    // an option would otherwise be read as a click outside and close the list
    // before it ever landed
    function closeOnOutside(e: PointerEvent) {
      const target = e.target as Node;
      if (header.current?.contains(target) || list.current?.contains(target))
        return;
      setOpen(false);
    }
    function closeOnEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    place();
    // capture: the list has to follow the header when anything scrolls, not
    // only the window
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        ref={header}
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        data-invalid={invalid || undefined}
        className={`type-body flex ${tall ? "h-14" : "h-11"} w-full items-center justify-between gap-3 border pl-4 pr-3 text-left transition-[border-color] duration-150 ${
          red
            ? `border-white bg-transparent ${chosen ? "text-white" : "text-white/75"}`
            : `border-ink bg-white ${chosen ? "text-ink" : "text-text-2"}`
        } ${open ? `border-2 pl-[15px] pr-[11px] ${red ? "" : "border-brand"}` : ""} ${
          invalid ? "border-[3px] pl-[13px] pr-[9px]" : ""
        }`}
      >
        {chosen ? <Label option={chosen} /> : placeholder}
        <ChevronIcon size={20} className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open &&
        box &&
        createPortal(
          <div
            ref={list}
            className="fixed z-40 flex flex-col gap-1 border border-line bg-white py-2"
            style={{ left: box.left, top: box.bottom, width: box.width }}
          >
            {options.map((option) => (
              <button
                key={valueOf(option)}
                type="button"
                onClick={() => {
                  setValue(valueOf(option));
                  onChange?.(valueOf(option));
                  setOpen(false);
                }}
                className="type-body px-4 py-2 text-left text-ink transition-colors duration-150 hover:text-brand"
              >
                <Label option={option} />
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
