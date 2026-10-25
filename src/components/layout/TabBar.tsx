"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import { useMenu } from "@/components/layout/MenuContext";
import {
  BurgerIcon,
  CalendarIcon,
  JournalIcon,
  PinIcon,
} from "@/components/ui/Icons";

/**
 * The file's Tab bar - phones only (under 768), fixed to the bottom in the reach
 * of a thumb, with the phone's safe area under it. Four items: an icon of 24 and
 * a caption of 11 in mono. The section you are in is Red with a 2px bar on top
 * over the middle half; a press fills the item Paper. "Меню" opens the full
 * menu, and while the menu is open the bar is gone.
 *
 * The file draws Журнал · События · Магазины · Меню. The events page is not
 * built yet, so the second slot carries Новости for now - one line to swap when
 * /events exists.
 */
const TABS = [
  { slug: "journal", label: "Журнал", Icon: JournalIcon },
  { slug: "news", label: "Новости", Icon: CalendarIcon },
  { slug: "stores", label: "Магазины", Icon: PinIcon },
] as const;

const ITEM =
  "relative flex h-[var(--tabbar-h)] flex-1 flex-col items-center justify-center gap-0.5 type-caption transition-colors duration-150 active:bg-surface";

export function TabBar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { open, setOpen } = useMenu();
  if (open) return null;

  return (
    <nav
      aria-label="Разделы"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {TABS.map(({ slug, label, Icon }) => {
        const href = `/${locale}/${slug}`;
        const current = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={slug}
            href={href}
            aria-current={current ? "page" : undefined}
            className={`${ITEM} ${current ? "text-brand" : "text-ink"}`}
          >
            {current && (
              <span className="absolute inset-x-1/4 -top-px h-0.5 bg-brand" />
            )}
            <Icon />
            {label}
          </Link>
        );
      })}
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={`${ITEM} text-ink`}
      >
        <BurgerIcon />
        Меню
      </button>
    </nav>
  );
}
