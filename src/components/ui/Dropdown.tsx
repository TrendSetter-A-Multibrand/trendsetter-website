"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Divider } from "@/components/ui/Divider";
import { cellClass, listClass } from "@/components/ui/List";

/**
 * The library's Dropdown, standing in for a native select: a white 48-tall
 * header carrying the choice and a chevron, and a List that opens under it over
 * the page rather than pushing it down. The rule under the header appears only
 * while it is open, which is how the two states are drawn.
 *
 * The list is painted from the body and placed against the header's own box.
 * A native select's popup is not part of the page either, and it has to be that
 * way here: the band this stands on clips its own smiley, and a list left in
 * place would be cut off at the same edge.
 *
 * The choice rides in a hidden input, so the form around it needs to know
 * nothing about any of this.
 */
export function Dropdown({
  name,
  placeholder,
  options,
}: {
  name: string;
  placeholder: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
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
        className={`flex h-12 w-full items-center justify-between gap-2 bg-white px-4 text-left font-sans text-sm/4 font-normal tracking-[1px] text-ink ${
          open ? "border-b border-ink/15" : ""
        }`}
      >
        {value || placeholder}
        <Chevron up={open} />
      </button>

      {open &&
        box &&
        createPortal(
          <div
            ref={list}
            className={`${listClass} fixed z-40 bg-white`}
            style={{ left: box.left, top: box.bottom, width: box.width }}
          >
            {options.map((option, i) => (
              <Fragment key={option}>
                {i > 0 && <Divider />}
                <button
                  type="button"
                  onClick={() => {
                    setValue(option);
                    setOpen(false);
                  }}
                  className={cellClass("black")}
                >
                  {option}
                </button>
              </Fragment>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

/** 24 square, the 12-wide stroke of the file's own arrow inside it. */
function Chevron({ up }: { up: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 transition-transform ${up ? "rotate-180" : ""}`}
    >
      <path d="m6 10 6 6 6-6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
