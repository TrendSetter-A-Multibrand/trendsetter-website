"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { NAV_ITEMS } from "@/lib/navigation";
import { SideMenu } from "@/components/layout/SideMenu";
import { Wordmark } from "@/components/ui/Wordmark";

export function Header({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between gap-6 border-b border-black/10 px-6 py-4 lg:px-10">
      <Link href={`/${locale}`} className="w-40 shrink-0 text-brand sm:w-52">
        <Wordmark />
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-medium uppercase tracking-wide lg:flex">
        {NAV_ITEMS.map((item) => (
          <Link key={item.slug} href={`/${locale}/${item.slug}`}>
            {item.label}
          </Link>
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
