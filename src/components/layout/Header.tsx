"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { NAV_ITEMS } from "@/lib/navigation";
import { SideMenu } from "@/components/layout/SideMenu";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { Wordmark } from "@/components/ui/Wordmark";

export function Header({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // 90px tall in the mockup, with a 287px wordmark
  return (
    <header className="flex h-16 items-center justify-between gap-6 border-b border-black/10 px-6 lg:h-[90px] lg:px-10">
      <Link href={`/${locale}`} className="w-40 shrink-0 text-brand lg:w-[287px]">
        <Wordmark />
      </Link>

      <nav className="hidden h-full items-center gap-6 text-sm font-medium uppercase tracking-wide lg:flex">
        {NAV_ITEMS.map((item) => (
          <div key={item.slug} className="group relative flex h-full items-center">
            {/* Brackets are drawn outside the label so hovering never reflows the nav */}
            <Link
              href={`/${locale}/${item.slug}`}
              className="relative transition-colors before:absolute before:-left-2.5 before:opacity-0 before:transition-opacity before:content-['['] after:absolute after:-right-2.5 after:opacity-0 after:transition-opacity after:content-[']'] group-hover:text-brand group-hover:before:opacity-100 group-hover:after:opacity-100"
            >
              {item.label}
            </Link>
            {item.children && <NavDropdown locale={locale} item={item} />}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button type="button" aria-label="Поиск" onClick={() => setMenuOpen(true)}>
          <SearchIcon />
        </button>
        <button type="button" aria-label="Меню" onClick={() => setMenuOpen(true)}>
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
