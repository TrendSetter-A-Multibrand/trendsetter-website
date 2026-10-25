"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "@/components/ui/Icons";

/**
 * The magnifier in the header, and the field that comes out of it. The icon is
 * the file's 44 icon button; opened, it grows to the file's Search field - white,
 * a 1px Sage rule, the placeholder in Text-2 - to the left of itself, 240 wide
 * (320 on a wide screen, the width of the bar less the logo on a phone), with the
 * magnifier staying inside it at the right.
 *
 * On the search page the field arrives already open with the query in it - land
 * there from a shared link and you can see, and edit, what was searched for.
 */
export function HeaderSearch({
  locale,
  onField,
}: {
  locale: string;
  /** Hands the growing box to the bar, which hides the links it covers. */
  onField?: (el: HTMLDivElement | null) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const query = pathname.endsWith("/search") ? (params.get("q") ?? "") : "";

  const [open, setOpen] = useState(Boolean(query));
  const [value, setValue] = useState(query);
  const [lastQuery, setLastQuery] = useState(query);
  const field = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // Landing on another search follows the address rather than what was typed
  if (query !== lastQuery) {
    setLastQuery(query);
    setValue(query);
    setOpen(Boolean(query));
  }

  useEffect(() => {
    if (!open) return;
    input.current?.focus();

    // Anywhere outside the field closes it again
    const onPointerDown = (e: PointerEvent) => {
      if (!field.current?.contains(e.target as Node)) setOpen(Boolean(query));
    };

    // Scrolling takes the whole bar away on a phone, so an empty field may as
    // well fold back into the magnifier. A started query is not thrown away over
    // a scroll: it rides out with the bar and is still there when it returns.
    const onScroll = () => {
      if (!input.current?.value) setOpen(Boolean(query));
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, query]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  }

  // The form itself is the 44 the icon takes and never anything else. The field
  // grows out of it towards the middle of the bar rather than pushing the bar
  // aside: its right edge is pinned where the icon stands, so nothing in the row
  // moves when it opens.
  return (
    <form ref={field} onSubmit={submit} role="search" className="relative size-11 shrink-0">
      <div
        ref={onField}
        className={`absolute right-0 top-0 z-10 flex h-11 items-center bg-white transition-[width] duration-300 ${
          open
            ? "w-[calc(100vw-2rem-48px)] border border-ink pl-4 sm:w-[240px] xl:w-[320px]"
            : "w-11 border border-transparent"
        }`}
      >
        <input
          ref={input}
          name="q"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введите запрос"
          aria-label="Поиск по сайту"
          tabIndex={open ? 0 : -1}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          // Chrome hangs its own clear cross off a search field; the file has
          // only the magnifier, and Escape already empties it
          className={`type-body min-w-0 bg-transparent text-ink outline-none placeholder:text-text-2 [&::-webkit-search-cancel-button]:appearance-none ${
            open ? "flex-1" : "w-0"
          }`}
        />
        <button
          type={open ? "submit" : "button"}
          aria-label={open ? "Искать" : "Поиск"}
          aria-expanded={open}
          onClick={() => !open && setOpen(true)}
          className="flex size-[42px] shrink-0 items-center justify-center text-ink"
        >
          <SearchIcon />
        </button>
      </div>
    </form>
  );
}
