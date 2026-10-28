import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";
import type { CardTag } from "@/components/cards/CardS";

/**
 * The file's Lead - the main piece of the editorial grid, one on every journal
 * and news page. A 16:10 photo (4:3 on a phone), the meta line, the title in H2
 * and a lead paragraph in Body L, 24 between photo and text and 16 inside the
 * text, the paragraph held to 560. Hovering turns the title Red.
 */
export function LeadCard({
  href,
  title,
  excerpt,
  image,
  tags = [],
  minutes = 0,
  sizes,
}: {
  href: string;
  title: string;
  excerpt?: string;
  image?: string;
  tags?: CardTag[];
  minutes?: number;
  sizes?: string;
}) {
  return (
    <article className="group flex flex-col gap-6">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative aspect-[4/3] w-full overflow-hidden bg-surface md:aspect-[16/10]"
      >
        <CardImage src={image} sizes={sizes} />
      </Link>
      <div className="flex flex-col gap-4">
        <div className="type-caption flex items-start justify-between gap-2 text-ink">
          <p>
            {tags.slice(0, 1).map((tag) => (
              <Link key={tag.label} href={tag.href} className="hover:underline">
                [{tag.label}]
              </Link>
            ))}
          </p>
          {minutes > 0 && <p className="shrink-0">{minutes} мин чтения</p>}
        </div>
        <Link
          href={href}
          className="type-h2 text-ink transition-colors duration-150 group-hover:text-brand group-active:text-brand"
        >
          {title}
        </Link>
        {excerpt && <p className="type-body-l max-w-[560px] text-ink">{excerpt}</p>}
      </div>
    </article>
  );
}
