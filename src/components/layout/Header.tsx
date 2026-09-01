"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { SideMenu } from "@/components/layout/SideMenu";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { Wordmark } from "@/components/ui/Wordmark";

/**
 * The brackets are drawn outside the label, so hovering never reflows the row.
 * The file leaves 2 between bracket and word and a bracket is 9 wide, which is
 * the 11 they sit at once they are home.
 */
const BRACKETS =
  "relative transition-colors " +
  "before:absolute before:-left-[11px] before:content-['['] " +
  "after:absolute after:-right-[11px] after:content-[']'] " +
  "before:transition before:duration-[350ms] before:ease-in-out " +
  "after:transition after:duration-[350ms] after:ease-in-out " +
  "motion-reduce:before:transition-none motion-reduce:after:transition-none";

/** Out past the word and not yet there: the file opens the gap from 2 to 8. */
const BRACKETS_AWAY =
  "before:-translate-x-[6px] before:opacity-0 after:translate-x-[6px] after:opacity-0";

/**
 * Closed on the word at full strength. They come in fading up as they close -
 * the three frames of the file, in order - and go out the same way round. 350ms
 * either direction: 700 the round trip, which is the figure that was given.
 *
 * They hold while the pointer is anywhere on the entry, the panel below it
 * included, because the panel hangs inside this same group.
 */
const BRACKETS_HOME =
  "group-hover:before:translate-x-0 group-hover:before:opacity-100 " +
  "group-hover:after:translate-x-0 group-hover:after:opacity-100";

/** The section you are in wears them for good, as the mockup shows it. */
const BRACKETS_STAY =
  "before:translate-x-0 before:opacity-100 after:translate-x-0 after:opacity-100";

/**
 * The panel opens on hover through CSS. Following a link leaves the pointer
 * sitting on the item, so `:hover` would still be true and the panel would hang
 * around over the new page - hence the dismissed flag, cleared once the pointer
 * leaves the item.
 */
function NavEntry({ locale, item }: { locale: Locale; item: NavItem }) {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();
  const href = `/${locale}/${item.slug}`;
  const current = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div
      className="group relative flex h-full items-center"
      onMouseLeave={() => setDismissed(false)}
    >
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        onClick={() => setDismissed(true)}
        className={`${BRACKETS} group-hover:text-brand ${
          current
            ? `text-brand ${BRACKETS_STAY}`
            : `${BRACKETS_AWAY} ${BRACKETS_HOME}`
        }`}
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

/** The air the bar keeps between the last link and the field. */
const CLEARANCE = 24;

/**
 * The field grows over the row rather than pushing it, so whichever links end up
 * underneath are hidden - and hidden with `visibility`, which takes them out of
 * sight, out of the tab order and out of the reading order while leaving their
 * place alone. Nothing that stays moves, which is the point: the burger carries
 * the whole menu anyway.
 *
 * Reading positions is safe here for the same reason: visibility changes no
 * layout, so the observer cannot set itself off again.
 */
function useLinksOutOfTheField(
  row: React.RefObject<HTMLElement | null>,
  field: HTMLElement | null
) {
  useEffect(() => {
    const nav = row.current;
    if (!nav || !field) return;

    function update() {
      const edge = field!.getBoundingClientRect().left - CLEARANCE;
      for (const link of Array.from(nav!.children) as HTMLElement[]) {
        link.style.visibility =
          link.getBoundingClientRect().right > edge ? "hidden" : "";
      }
    }

    const observer = new ResizeObserver(update);
    observer.observe(field);
    observer.observe(nav);
    update();
    return () => observer.disconnect();
  }, [row, field]);
}

export function Header({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);
  // The field only exists once the boundary below has resolved, so the bar keeps
  // it in state rather than looking for it once and giving up.
  const [field, setField] = useState<HTMLElement | null>(null);
  useLinksOutOfTheField(nav, field);

  // 88px tall in the mockup, with a 273px wordmark. Nothing separates the three
  // groups but the space left over, which is what puts equal air either side of
  // the nav. The fill is its own rather than the body's: stuck to the top of the
  // page the bar now travels over content.
  return (
    <header className="flex h-16 items-center justify-between gap-6 bg-background px-6 lg:h-[88px] lg:px-10">
      <Link href={`/${locale}`} className="w-40 shrink-0 text-brand lg:w-[273px]">
        <Wordmark />
      </Link>

      {/* 757 of links, plus a 273 logo and the icons - it does not fit until
          1280, and under that the burger carries the whole menu */}
      <nav
        ref={nav}
        className="hidden h-full items-center gap-10 whitespace-nowrap font-mono text-sm font-medium uppercase tracking-[1px] xl:flex"
      >
        {NAV_ITEMS.map((item) => (
          <NavEntry key={item.slug} locale={locale} item={item} />
        ))}
      </nav>

      {/* 92 across closed, 384 with the field out: two 24px icons 44 apart, and
          a 320 field whose rule runs under the magnifier as well. The gap lives
          on the burger rather than on the row, so the closed field - a flex item
          of no width - does not add one of its own. */}
      <div className="flex shrink-0 items-center">
        <Suspense fallback={<div className="h-12 w-6" />}>
          <HeaderSearch locale={locale} onField={setField} />
        </Suspense>
        {/* The panel lays the whole site out at once, which the seven links in
            the bar do not - so it is kept everywhere the page fills the window.
            Past 1920 the page is a fixed column in the middle of the monitor and
            the panel slides out beside it rather than at an edge, which reads as
            floating; at those widths the bar's own links carry the menu. */}
        <button
          type="button"
          aria-label="Меню"
          onClick={() => setMenuOpen(true)}
          className="ml-6 min-[1921px]:hidden lg:ml-11"
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
