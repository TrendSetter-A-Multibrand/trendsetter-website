import { Fragment } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { NavItem } from "@/lib/navigation";
import { Divider } from "@/components/ui/Divider";
import { cellClass, listClass } from "@/components/ui/List";

/**
 * The library's List, hung from the bottom edge of the header: 160 wide, solid
 * brand red, cells 24 tall with a hairline and 8 of air on either side of it
 * between them. Five of them come to the 245 the file draws. Labels are white
 * and fade to 40% on hover rather than changing colour.
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
    <div
      className={`${listClass} invisible absolute left-0 top-full z-30 w-[160px] bg-brand opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100`}
    >
      {item.children?.map((child, i) => (
        <Fragment key={child.slug}>
          {i > 0 && <Divider />}
          <Link
            href={`/${locale}/${item.slug}/${child.slug}`}
            onClick={onNavigate}
            className={cellClass("white")}
          >
            {child.label}
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
