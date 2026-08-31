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
export function HeaderSearch({ locale }: { locale: string }) {
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

  return (
    <form
      ref={field}
      onSubmit={submit}
      role="search"
      className={`flex h-12 items-center transition-[width] duration-300 ${
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
