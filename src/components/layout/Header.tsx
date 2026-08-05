"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { SideMenu } from "@/components/layout/SideMenu";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { Wordmark } from "@/components/ui/Wordmark";

/**
 * The panel opens on hover through CSS. Following a link leaves the pointer
 * sitting on the item, so `:hover` would still be true and the panel would hang
 * around over the new page - hence the dismissed flag, cleared once the pointer
 * leaves the item.
 */
function NavEntry({ locale, item }: { locale: Locale; item: NavItem }) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div
      className="group relative flex h-full items-center"
      onMouseLeave={() => setDismissed(false)}
    >
      {/* Brackets are drawn outside the label so hovering never reflows the nav */}
      <Link
        href={`/${locale}/${item.slug}`}
        onClick={() => setDismissed(true)}
        className="relative transition-colors before:absolute before:-left-2.5 before:opacity-0 before:transition-opacity before:content-['['] after:absolute after:-right-2.5 after:opacity-0 after:transition-opacity after:content-[']'] group-hover:text-brand group-hover:before:opacity-100 group-hover:after:opacity-100"
      >
        {item.label}
      </Link>
      {item.children && !dismissed && (
        <NavDropdown
          locale={locale}
          item={item}
          onNavigate={() => setDismissed(true)}
        />
      )}
    </div>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    searchRef.current?.focus();

    // Anywhere outside the field and its toggle closes it again
    const onPointerDown = (e: PointerEvent) => {
      if (!searchBoxRef.current?.contains(e.target as Node)) setSearchOpen(false);
    };

    // Scrolling takes the whole bar away, so an empty field may as well fold
    // back into the magnifier. A started query is not thrown away over a
    // scroll: it rides out with the bar and is still there when it returns.
    const onScroll = () => {
      if (!searchRef.current?.value) setSearchOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [searchOpen]);

  // 90px tall in the mockup, with a 287px wordmark. The fill is its own rather
  // than the body's: stuck to the top of the page it now travels over content.
  return (
    <header className="flex h-16 items-center justify-between gap-6 border-b border-black/10 bg-background px-6 lg:h-[90px] lg:px-10">
      <Link href={`/${locale}`} className="w-40 shrink-0 text-brand lg:w-[287px]">
        <Wordmark />
      </Link>

      <nav className="hidden h-full items-center gap-6 text-sm font-medium uppercase tracking-wide lg:flex">
        {NAV_ITEMS.map((item) => (
          <NavEntry key={item.slug} locale={locale} item={item} />
        ))}
      </nav>

      <div ref={searchBoxRef} className="flex shrink-0 items-center gap-4">
        {/* Slides out of the magnifier; the rule and the type match the field
            on the Бренды page */}
        <div
          className={`overflow-hidden transition-[width] duration-300 ${
            searchOpen ? "w-[180px] xl:w-[280px]" : "w-0"
          }`}
        >
          <input
            ref={searchRef}
            type="search"
            placeholder="Поиск"
            onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
            className="w-full border-b-2 border-ink bg-transparent pb-2 font-mono text-sm uppercase tracking-[3px] text-ink outline-none placeholder:text-ink/50"
          />
        </div>
        <button
          type="button"
          aria-label={searchOpen ? "Закрыть поиск" : "Поиск"}
          aria-expanded={searchOpen}
          onClick={() => setSearchOpen((open) => !open)}
        >
          <SearchIcon />
        </button>
        {/* Below lg only: from lg up the same links are already in the nav bar */}
        <button
          type="button"
          aria-label="Меню"
          onClick={() => setMenuOpen(true)}
          className="lg:hidden"
        >
          <MenuIcon />
        </button>
      </div>

      <SideMenu locale={locale} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
