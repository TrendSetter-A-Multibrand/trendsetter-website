import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";

const NAV_ITEMS = [
  { label: "Журнал", slug: "journal" },
  { label: "Новости", slug: "news" },
  { label: "Магазины", slug: "stores" },
  { label: "Бренды", slug: "brands" },
  { label: "Компания", slug: "company" },
  { label: "Система лояльности", slug: "loyalty" },
  { label: "Подарочные карты", slug: "gift-cards" },
];

export function Header({ locale }: { locale: Locale }) {
  return (
    <header className="flex items-center justify-between gap-6 border-b border-black/10 px-6 py-4 lg:px-10">
      <Link
        href={`/${locale}`}
        className="text-2xl font-bold tracking-tight text-brand"
      >
        TRENDSETTER
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-medium uppercase tracking-wide lg:flex">
        {NAV_ITEMS.map((item) => (
          <Link key={item.slug} href={`/${locale}/${item.slug}`}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button type="button" aria-label="Поиск">
          <SearchIcon />
        </button>
        <button type="button" aria-label="Меню">
          <MenuIcon />
        </button>
      </div>
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
