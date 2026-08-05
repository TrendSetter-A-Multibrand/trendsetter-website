import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { NavItem } from "@/lib/navigation";

/**
 * 200px wide, brand red at 50% over a 6px blur, hanging from the bottom edge of
 * the header.
 * Labels are white at rest and go dark on hover. Rows are 33px including their
 * rule, which lands the panel on the mockup's 215px.
 */
export function NavDropdown({
  locale,
  item,
  onNavigate,
}: {
  locale: Locale;
  item: NavItem;
  onNavigate: () => void;
}) {
  return (
    <div className="invisible absolute left-0 top-full z-30 flex w-[200px] flex-col border-t border-ink/15 bg-brand/50 py-2 opacity-0 backdrop-blur-[6px] transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
      {item.children?.map((child, i) => (
        <Link
          key={child.slug}
          href={`/${locale}/${item.slug}/${child.slug}`}
          onClick={onNavigate}
          className={`flex h-[33px] items-center px-5 text-sm font-normal normal-case tracking-normal text-white transition-colors hover:text-ink ${
            i > 0 ? "border-t border-ink/15" : ""
          }`}
        >
          {child.label}
        </Link>
      ))}
    </div>
  );
}
