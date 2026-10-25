import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";

export type CardTag = { label: string; href: string };

type CardSProps = {
  href: string;
  title: React.ReactNode;
  image?: string;
  tags?: CardTag[];
  /** Minutes of reading; the line is left out when there are none. */
  minutes?: number;
  /**
   * stack - the photo over its meta and title, in a three-across grid or a strip
   * that swipes; row - the photo 40% at the left, as the lists on a phone;
   * list - a row below 768 and a stack from there up.
   */
  layout?: "stack" | "row" | "list";
  sizes?: string;
  className?: string;
};

/**
 * The file's Card S. A 4:3 photo, a meta line - the rubrics in brackets at the
 * left, the reading time at the right - and the title in H4. Hovering turns the
 * title Red and draws the photo 3% closer over 600 ms; on a touch screen the
 * same happens on press. The row version lays the photo, 40% of the width, beside
 * the rubric over the time over a Body title, with 16 above and below.
 *
 * The photo, the title and each rubric are three links rather than one around
 * the lot - a link inside a link is not something a browser will render. The
 * photo is hidden from the keyboard so the card is one stop and not two.
 */
export function CardS({
  href,
  title,
  image,
  tags = [],
  minutes = 0,
  layout = "stack",
  sizes,
  className = "",
}: CardSProps) {
  const row = layout === "row";
  const list = layout === "list";
  // Which classes apply at which width is the whole difference between the layouts
  const wrap = row
    ? "flex-row gap-4 py-4"
    : list
      ? "flex-row gap-4 py-4 md:flex-col md:py-0"
      : "flex-col gap-4";
  const photo = row
    ? "w-[40%] min-w-[120px] shrink-0"
    : list
      ? "w-[40%] min-w-[120px] shrink-0 md:w-full"
      : "w-full";
  const meta = row
    ? "flex-col gap-1"
    : list
      ? "flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-2"
      : "items-start justify-between gap-2";
  const titleClass = row
    ? "type-body leading-[1.35]"
    : list
      ? "type-body leading-[1.35] md:type-h4"
      : "type-h4";

  return (
    <article className={`group flex ${wrap} ${className}`}>
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative aspect-[4/3] overflow-hidden bg-surface ${photo}`}
      >
        <CardImage src={image} sizes={sizes} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2 md:gap-4">
        {(tags.length > 0 || minutes > 0) && (
          <div className={`type-caption flex text-ink ${meta}`}>
            <p>
              {tags.map((tag, i) => (
                <span key={tag.label}>
                  {i > 0 && " "}
                  <Link href={tag.href} className="hover:underline">
                    [{tag.label}]
                  </Link>
                </span>
              ))}
            </p>
            {minutes > 0 && <p className="shrink-0">{minutes} мин чтения</p>}
          </div>
        )}
        <Link
          href={href}
          className={`${titleClass} text-ink transition-colors duration-150 group-hover:text-brand group-active:text-brand`}
        >
          {title}
        </Link>
      </div>
    </article>
  );
}
