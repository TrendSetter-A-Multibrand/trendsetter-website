import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";
import type { CardTag } from "@/components/cards/CardS";

/**
 * The file's Side item: a secondary piece of the editorial grid. Row - the photo
 * 40% (120 at least) with the rubric, the H4 title and the time beside it; that
 * is the column to the right of the lead on a wide desktop, and the phone.
 * Stack - the photo over the same text, three across under the lead on a narrow
 * desktop. The thin rule between rows is the grid's to draw, not the item's.
 */
export function SideItem({
  href,
  title,
  image,
  tags = [],
  minutes = 0,
  layout = "row",
  sizes,
}: {
  href: string;
  title: string;
  image?: string;
  tags?: CardTag[];
  minutes?: number;
  layout?: "row" | "stack";
  sizes?: string;
}) {
  const stack = layout === "stack";
  return (
    <article className={`group flex ${stack ? "flex-col gap-3" : "gap-4"}`}>
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative aspect-[4/3] overflow-hidden bg-surface ${
          stack ? "w-full" : "w-[40%] min-w-[120px] shrink-0"
        }`}
      >
        <CardImage src={image} sizes={sizes} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {tags.length > 0 && (
          <p className="type-caption text-ink">
            {tags.slice(0, 1).map((tag) => (
              <Link key={tag.label} href={tag.href} className="hover:underline">
                [{tag.label}]
              </Link>
            ))}
          </p>
        )}
        <Link
          href={href}
          className="type-h4 text-ink transition-colors duration-150 group-hover:text-brand group-active:text-brand"
        >
          {title}
        </Link>
        {minutes > 0 && <p className="type-caption text-ink">{minutes} мин чтения</p>}
      </div>
    </article>
  );
}
