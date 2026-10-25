import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { NavItem } from "@/lib/navigation";

/**
 * The file's Nav submenu, hung from the bottom edge of the header: a white panel
 * 240 wide with a Line rule down both sides and along the bottom, links in Body
 * 16 with 12 between them, Red under the pointer. It comes down 4 and fades in
 * over 250 ms. `open` is for touch, where a first tap opens it and the second
 * follows the link; with a pointer the group's hover and focus do the job.
 */
export function NavDropdown({
  locale,
  item,
  open,
  onNavigate,
}: {
  locale: Locale;
  item: NavItem;
  open: boolean;
  onNavigate: () => void;
}) {
  return (
    <div
      className={`invisible absolute left-0 top-full z-30 flex w-[240px] -translate-y-1 flex-col gap-3 border-x border-b border-line bg-white px-6 py-4 opacity-0 transition-[opacity,translate,visibility] duration-[250ms] ease-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
        open ? "!visible !translate-y-0 !opacity-100" : ""
      }`}
    >
      {item.children?.map((child) => (
        <Link
          key={child.slug}
          href={`/${locale}/${item.slug}/${child.slug}`}
          onClick={onNavigate}
          className="type-body text-ink transition-colors duration-150 hover:text-brand"
        >
          {child.label}
        </Link>
      ))}
    </div>
  );
}
