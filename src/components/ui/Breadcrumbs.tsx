import Link from "next/link";

type Crumb = { label: string; href?: string };

/**
 * The file's Crumbs: the first line of every inner page, above the title. Mono
 * Caption in caps, links underlined, a slash between, 8 of air round it. The
 * current page is Text-2 and not a link; a level with no page of its own
 * ("Компания") is text. On a desktop there is 16 above and below and a long
 * current page is cut at 48 characters. On a phone it is one line that swipes
 * sideways, its links 44 tall - and past three levels it drops "Главная" and the
 * current page and keeps the middle.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const long = items.length > 3;
  return (
    <nav
      aria-label="Хлебные крошки"
      className="type-caption flex items-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-1 md:overflow-visible md:px-10 md:py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        // Only on a phone, and only when the trail is long
        const dropOnPhone = long && (i === 0 || last) ? "max-md:hidden" : "";
        return (
          <span key={`${i}-${item.label}`} className={`flex items-center gap-2 ${dropOnPhone}`}>
            {i > 0 && (
              <span
                aria-hidden="true"
                className={`text-ink ${long && i === 1 ? "max-md:hidden" : ""}`}
              >
                /
              </span>
            )}
            {item.href && !last ? (
              <Link
                href={item.href}
                className="inline-flex h-11 items-center text-ink underline transition-colors duration-150 hover:text-brand md:h-auto"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={last ? "page" : undefined}
                className={`inline-block max-w-[48ch] truncate ${last ? "text-text-2" : "text-ink"}`}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
