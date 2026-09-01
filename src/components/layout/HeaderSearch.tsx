"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * The magnifier in the header, and the field that comes out of it. 320 wide with
 * the rule running under the icon as well, so the icon reads as part of the
 * field rather than as something next to it.
 *
 * On the search page the field arrives already open with the query in it, the
 * way the mockup shows it - land there from a shared link and you can see, and
 * edit, what was searched for.
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

    // Scrolling takes the whole bar away, so an empty field may as well fold
    // back into the magnifier. A started query is not thrown away over a
    // scroll: it rides out with the bar and is still there when it returns.
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

  // The form itself is the 24 the magnifier takes and never anything else. The
  // field grows out of it towards the middle of the bar rather than pushing the
  // bar aside: its right edge is pinned where the icon stands, so nothing in the
  // row moves when it opens.
  return (
    <form
      ref={field}
      onSubmit={submit}
      role="search"
      className="relative h-12 w-6 shrink-0"
    >
      <div
        ref={onField}
        className={`absolute right-0 top-0 flex h-12 items-center transition-[width] duration-300 ${
          open
            ? "w-[240px] border-b-2 border-ink xl:w-[320px]"
            : "w-6 border-b-2 border-transparent"
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
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        // Chrome hangs its own clear cross off a search field; the mockup has
        // only the magnifier, and Escape already empties it
        className="min-w-0 flex-1 bg-transparent text-sm tracking-[1px] text-ink outline-none placeholder:text-ink/40 [&::-webkit-search-cancel-button]:appearance-none"
      />
      <button
        type={open ? "submit" : "button"}
        aria-label={open ? "Искать" : "Поиск"}
        aria-expanded={open}
        onClick={() => !open && setOpen(true)}
        className="shrink-0"
      >
        <SearchIcon />
      </button>
      </div>
    </form>
  );
}

/** 24x24 in the mockup, the glass 20 across and the handle running to the corner. */
function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m17.5 17.5 5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
    </svg>
  );
}
