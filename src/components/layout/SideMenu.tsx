"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import type { NavItem, SocialLink } from "@/lib/navigation";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Wordmark } from "@/components/ui/Wordmark";
import { buttonClass } from "@/components/ui/Button";
import { iconButtonClass } from "@/components/ui/iconButton";
import { ChevronIcon, CloseIcon, SearchIcon } from "@/components/ui/Icons";

/** Never fires: the answer only ever changes from false to true, at hydration. */
const noSubscribe = () => () => {};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The file's Mobile menu - on a phone it is the whole screen, and the burger of
 * a narrow desktop opens the same one. White, 250 ms of fade. A bar with the
 * logo and the close, the search, the sections in H2 with a Line rule between
 * them, a section with pages in it opens on tap (its chevron turns over), and at
 * the foot "Найти магазин" across the width and the social links.
 *
 * Escape closes it and focus stays inside while it is open; on closing, focus
 * goes back to where it was.
 */
export function SideMenu({
  locale,
  items,
  socials,
  open,
  onClose,
}: {
  locale: Locale;
  items: NavItem[];
  socials: SocialLink[];
  open: boolean;
  onClose: () => void;
}) {
  // Painted from the body rather than from where it sits in the tree: the
  // header is sticky with a transform, which would otherwise become the
  // containing block for everything fixed inside it. There is no body to
  // portal into while rendering on the server, so nothing goes out until the
  // client has taken over.
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false
  );
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar) document.body.style.paddingRight = `${scrollbar}px`;
    panel.current?.querySelector<HTMLElement>("[data-close]")?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const nodes = Array.from(
        panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    // Past the width where the bar carries the menu in a row it closes itself
    const wide = window.matchMedia("(min-width: 1280px)");
    function onWide() {
      if (wide.matches) onClose();
    }

    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      before?.focus?.();
    };
  }, [open, onClose]);

  if (!hydrated) return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onClose();
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  }

  // inert, not just pointer-events-none: while closed it must not take a tap or
  // a Tab stop from the page underneath.
  return createPortal(
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Меню"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white transition-opacity duration-[250ms] ease-out xl:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4 md:px-0">
          <Link
            href={`/${locale}`}
            onClick={onClose}
            className="w-[136px] text-brand"
          >
            <Wordmark />
          </Link>
          <button
            type="button"
            data-close
            aria-label="Закрыть меню"
            onClick={onClose}
            className={iconButtonClass()}
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={submit} role="search" className="px-4 pt-4 md:px-0">
          <label className="flex h-11 items-center gap-3 border border-ink bg-white pl-4 pr-3 focus-within:border-2 focus-within:border-brand focus-within:pl-[15px] focus-within:pr-[11px]">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по журналу и новостям"
              aria-label="Поиск по сайту"
              className="type-body min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-text-2 [&::-webkit-search-cancel-button]:appearance-none"
            />
            <SearchIcon />
          </label>
        </form>

        <nav className="px-4 pb-6 pt-2 md:px-0">
          {items.map((item) => {
            const children = item.children?.filter((c) => !c.hidden) ?? [];
            const isOpen = expanded === item.slug;
            return (
              <div key={item.slug} className="border-b border-line">
                {children.length ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : item.slug)}
                      className="type-h2 flex min-h-14 w-full items-center justify-between py-4 text-left text-ink"
                    >
                      {item.label}
                      <ChevronIcon
                        className={`transition-transform duration-150 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="flex flex-col gap-3 pb-4">
                        <Link
                          href={`/${locale}/${item.slug}`}
                          onClick={onClose}
                          className="type-body text-ink hover:text-brand"
                        >
                          {item.label}
                        </Link>
                        {children.map((child) => (
                          <Link
                            key={child.slug}
                            href={`/${locale}/${item.slug}/${child.slug}`}
                            onClick={onClose}
                            className="type-body text-ink hover:text-brand"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={`/${locale}/${item.slug}`}
                    onClick={onClose}
                    className="type-h2 flex min-h-14 items-center py-4 text-ink"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-6 px-4 py-8 md:px-0">
          <Link
            href={`/${locale}/stores`}
            onClick={onClose}
            className={`${buttonClass("primary", "L")} w-full`}
          >
            Найти магазин
          </Link>
          <SocialLinks links={socials} surface="light" />
        </div>
      </div>
    </div>,
    document.body
  );
}
