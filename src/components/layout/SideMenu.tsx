"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { NAV_ITEMS } from "@/lib/navigation";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function SideMenu({
  locale,
  open,
  onClose,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Закрыть меню"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-6 shadow-xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 border-b border-black/20 pb-2">
            <SearchIcon />
            <input
              type="search"
              placeholder="Поиск"
              className="w-full text-sm outline-none"
            />
          </div>
          <button type="button" aria-label="Закрыть" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-1 flex-col">
          {NAV_ITEMS.map((item) => (
            <div key={item.slug} className="border-b border-black/10 py-4">
              <Link
                href={`/${locale}/${item.slug}`}
                className="text-sm font-medium uppercase tracking-wide text-brand"
                onClick={onClose}
              >
                [{item.label}]
              </Link>
              {item.children && (
                <div className="mt-3 flex flex-col gap-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.slug}
                      href={`/${locale}/${item.slug}/${child.slug}`}
                      className="text-sm text-foreground"
                      onClick={onClose}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <SocialLinks className="pt-6" />
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
