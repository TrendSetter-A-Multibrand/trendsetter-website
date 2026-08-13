"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
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

  // 88px tall in the mockup, with a 273px wordmark. Nothing separates the three
  // groups but the space left over, which is what puts equal air either side of
  // the nav. The fill is its own rather than the body's: stuck to the top of the
  // page the bar now travels over content.
  return (
    <header className="flex h-16 items-center justify-between gap-6 bg-background px-6 lg:h-[88px] lg:px-10">
      <Link href={`/${locale}`} className="w-40 shrink-0 text-brand lg:w-[273px]">
        <Wordmark />
      </Link>

      <nav className="hidden h-full items-center gap-10 font-mono text-sm uppercase tracking-[1px] lg:flex">
        {NAV_ITEMS.map((item) => (
          <NavEntry key={item.slug} locale={locale} item={item} />
        ))}
      </nav>

      {/* 88px across closed, 384 with the field out: two 24px icons 40 apart,
          and a 320 field whose rule runs under the magnifier as well. The gap
          lives on the burger rather than on the row, so the closed field - a
          flex item of no width - does not add one of its own. */}
      <div className="flex shrink-0 items-center">
        <Suspense fallback={<div className="h-12 w-6" />}>
          <HeaderSearch locale={locale} />
        </Suspense>
        {/* Kept at every width: the panel lays the whole site out at once, which
            the seven links in the bar do not */}
        <button
          type="button"
          aria-label="Меню"
          onClick={() => setMenuOpen(true)}
          className="ml-6 lg:ml-10"
        >
          <MenuIcon />
        </button>
      </div>

      <SideMenu locale={locale} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

/** Three full-width 2px rules, 8px apart. */
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M0 4h24M0 12h24M0 20h24"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
