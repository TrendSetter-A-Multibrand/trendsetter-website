import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";
import { DateBadge } from "@/components/ui/DateBadge";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * The file's Event row: the date, the weekday and time, the title in H3, two
 * lines of text, the place, a photo and an arrow. On a desktop it is one row of
 * the twelve columns - the date 2, the text 5, the place 2, the photo 2 (4:3), the
 * arrow 1 - 24 apart with
 * 24 of air above and below; on a phone the date is 64 wide beside the text, the
 * place goes into the time line and the photo is left out. Under the pointer the
 * title turns Red and the arrow fills Sage. A past event is the whole row at 60%.
 * The rule between rows is the list's to draw.
 */
export function EventRow({
  href,
  day,
  month,
  when,
  title,
  text,
  place,
  image,
  past = false,
}: {
  href: string;
  day: string;
  month: string;
  /** "суббота, 12:00" */
  when: string;
  title: string;
  text?: string;
  /** The shop or the hall; the label above it is fixed. */
  place?: string;
  image?: string;
  past?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-start gap-4 py-6 md:grid md:grid-cols-12 md:items-center md:gap-x-6 ${
        past ? "opacity-60" : ""
      }`}
    >
      <div className="w-16 shrink-0 md:col-span-2 md:w-auto">
        <div className="md:inline-block">
          <DateBadge day={day} month={month} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 md:col-span-5">
        <p className="type-caption text-ink">
          {when}
          {place && <span className="md:hidden"> · {place}</span>}
        </p>
        <p className="type-h3 text-ink transition-colors duration-150 group-hover:text-brand">
          {title}
        </p>
        {text && <p className="type-body-s line-clamp-2 text-ink">{text}</p>}
      </div>

      {/* Two columns of the twelve, kept even when there is no place to put in them */}
      <div className="hidden min-w-0 flex-col gap-1 text-ink md:col-span-2 md:flex">
        {place && (
          <>
            <p className="type-caption">[Магазин]</p>
            <p className="type-label">{place}</p>
          </>
        )}
      </div>

      <div className="relative hidden aspect-[4/3] shrink-0 overflow-hidden bg-surface min-[560px]:block max-md:w-24 md:col-span-2 md:block">
        <CardImage src={image} sizes="207px" />
      </div>

      <span className="hidden size-11 shrink-0 items-center justify-center justify-self-start border border-ink text-ink transition-colors duration-150 group-hover:bg-ink group-hover:text-white md:flex">
        <ArrowIcon />
      </span>
    </Link>
  );
}
