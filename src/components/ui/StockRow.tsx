import Link from "next/link";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * The file's Stock row: whether a brand is on the shelves of a shop. At least 56
 * tall - a 12 mark (a Mint square when it is there, a Muted dash when it is not),
 * the shop's name, "Есть" or "Нет" in Caption and a 44 arrow to the shop. The
 * word is set in the dark: light green text would not read. A thin rule between
 * rows. Not a checkbox, and a shop without the brand is dimmed to Text-2.
 */
export function StockRow({
  shop,
  available,
  href,
}: {
  shop: string;
  available: boolean;
  /** The shop's page; the arrow is left out without one. */
  href?: string;
}) {
  const tone = available ? "text-ink" : "text-text-2";
  return (
    <li className="flex min-h-14 items-center gap-3 border-t border-line first:border-t-0">
      <span className="flex size-3 shrink-0 items-center justify-center" aria-hidden="true">
        {available ? (
          <span className="size-3 bg-ext-mint" />
        ) : (
          <span className="h-px w-3 bg-muted" />
        )}
      </span>
      <span className={`type-body min-w-0 flex-1 ${tone}`}>{shop}</span>
      <span className={`type-caption shrink-0 ${tone}`}>{available ? "Есть" : "Нет"}</span>
      {href ? (
        <Link
          href={href}
          aria-label={`${shop}: магазин`}
          className="flex size-11 shrink-0 items-center justify-center text-ink transition-colors duration-150 hover:text-brand"
        >
          <ArrowIcon size={20} />
        </Link>
      ) : (
        <span className="size-11 shrink-0" />
      )}
    </li>
  );
}
