"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import type { NavItem, SocialLink } from "@/lib/navigation";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { SideMenu } from "@/components/layout/SideMenu";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { useMenu } from "@/components/layout/MenuContext";
import { Wordmark } from "@/components/ui/Wordmark";
import { BurgerIcon, ChevronIcon } from "@/components/ui/Icons";
import { iconButtonClass } from "@/components/ui/iconButton";

/**
 * The file's Nav link. The brackets are drawn outside the label, so hovering
 * never reflows the row: they sit 0.8em off the word, hidden by opacity rather
 * than removed, and slide in from 0.4em further out as the word turns Red.
 * 350 ms, ease-in-out, both ways; the section you are in wears them for good.
 */
const BRACKETS =
  "relative transition-colors duration-[350ms] ease-in-out " +
  "before:absolute before:-left-[11px] before:text-brand before:content-['['] " +
  "after:absolute after:-right-[11px] after:text-brand after:content-[']'] " +
  "before:transition-[opacity,translate] before:duration-[350ms] before:ease-in-out " +
  "after:transition-[opacity,translate] after:duration-[350ms] after:ease-in-out";

/** Out past the word and not yet there */
const BRACKETS_AWAY =
  "before:-translate-x-[6px] before:opacity-0 after:translate-x-[6px] after:opacity-0";

/** They hold while the pointer is anywhere on the entry, the panel included. */
const BRACKETS_HOME =
  "group-hover:before:translate-x-0 group-hover:before:opacity-100 " +
  "group-hover:after:translate-x-0 group-hover:after:opacity-100 " +
  "group-focus-within:before:translate-x-0 group-focus-within:before:opacity-100 " +
  "group-focus-within:after:translate-x-0 group-focus-within:after:opacity-100";

const BRACKETS_STAY =
  "before:translate-x-0 before:opacity-100 after:translate-x-0 after:opacity-100";

/**
 * The panel opens on hover through CSS. Following a link leaves the pointer
 * sitting on the item, so `:hover` would still be true and the panel would hang
 * around over the new page - hence the dismissed flag, cleared once the pointer
 * leaves the item.
 *
 * On a touch screen there is no hover: the first tap on an entry with a panel
 * opens it and the second goes to the page. A tap anywhere else closes it.
 */
function NavEntry({ locale, item }: { locale: Locale; item: NavItem }) {
  const [dismissed, setDismissed] = useState(false);
  const [touchOpen, setTouchOpen] = useState(false);
  const pointer = useRef<string>("mouse");
  const entry = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const href = `/${locale}/${item.slug}`;
  const current = pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!touchOpen) return;
    const away = (e: PointerEvent) => {
      if (!entry.current?.contains(e.target as Node)) setTouchOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [touchOpen]);

  return (
    <div
      ref={entry}
      className="group relative flex h-full items-center"
      onMouseLeave={() => setDismissed(false)}
    >
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        aria-haspopup={item.children ? "true" : undefined}
        onPointerDown={(e) => (pointer.current = e.pointerType)}
        onClick={(e) => {
          if (item.children && pointer.current === "touch" && !touchOpen) {
            e.preventDefault();
            setTouchOpen(true);
            return;
          }
          setDismissed(true);
          setTouchOpen(false);
        }}
        className={`type-mono-button flex items-center gap-1 ${BRACKETS} group-hover:text-brand group-focus-within:text-brand ${
          current || touchOpen
            ? `text-brand ${BRACKETS_STAY}`
            : `text-ink ${BRACKETS_AWAY} ${BRACKETS_HOME}`
        }`}
      >
        {item.label}
        {item.children && <ChevronIcon size={16} />}
      </Link>
      {item.children && !dismissed && (
        <NavDropdown
          locale={locale}
          item={item}
          open={touchOpen}
          onNavigate={() => {
            setDismissed(true);
            setTouchOpen(false);
          }}
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

/**
 * The file's Header. Desktop: 80 tall, white, a Line rule underneath, the logo
 * in Red at 176, the menu centred with 48 between entries, the search at the
 * right. Where the menu does not fit in a row (under 1280) it folds into the
 * burger. On a phone the bar is 64 with a 136 logo; the sections are in the tab
 * bar, and the burger and the search stay beside the logo.
 */
export function Header({
  locale,
  items,
  socials,
}: {
  locale: Locale;
  items: NavItem[];
  socials: SocialLink[];
}) {
  const { open, setOpen } = useMenu();
  const nav = useRef<HTMLElement>(null);
  // The field only exists once the boundary below has resolved, so the bar keeps
  // it in state rather than looking for it once and giving up.
  const [field, setField] = useState<HTMLElement | null>(null);
  useLinksOutOfTheField(nav, field);

  return (
    <header className="flex h-16 items-center justify-between gap-6 border-b border-line bg-white px-4 md:h-[var(--nav-h)] md:px-10">
      <Link
        href={`/${locale}`}
        className="w-[136px] shrink-0 text-brand md:w-[176px]"
      >
        <Wordmark />
      </Link>

      <nav
        ref={nav}
        className="hidden h-full flex-1 items-center justify-center gap-12 whitespace-nowrap xl:flex"
      >
        {items.map((item) => (
          <NavEntry key={item.slug} locale={locale} item={item} />
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-1">
        <Suspense fallback={<div className="size-11" />}>
          <HeaderSearch locale={locale} onField={setField} />
        </Suspense>
        {/* A phone opens the menu from the tab bar at the foot, so the burger waits for a tablet */}
        <button
          type="button"
          aria-label="Меню"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={`${iconButtonClass()} max-md:hidden xl:hidden`}
        >
          <BurgerIcon />
        </button>
      </div>

      <SideMenu
        locale={locale}
        items={items}
        socials={socials}
        open={open}
        onClose={() => setOpen(false)}
      />
    </header>
  );
}
