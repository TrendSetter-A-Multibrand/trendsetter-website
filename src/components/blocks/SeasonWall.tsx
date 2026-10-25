import Image from "next/image";
import { LinkArrow } from "@/components/ui/LinkArrow";

/**
 * One line of the wall: the phrase set in giant lowercase, repeated twice so the
 * strip can slide by exactly one copy and meet itself. `dir` is the way it goes -
 * Sage rows run to the right, Red rows to the left.
 */
function Row({
  text,
  tone,
  dir,
  seconds,
  className = "",
}: {
  text: string;
  tone: "ink" | "brand";
  dir: "left" | "right";
  seconds: number;
  className?: string;
}) {
  // Enough repeats that one copy is wider than any screen
  const copy = Array.from({ length: 4 }, () => text).join(" ");
  return (
    <div className={`flex overflow-hidden ${className}`} aria-hidden="true">
      <div
        className={`type-season flex w-max shrink-0 whitespace-nowrap motion-reduce:animate-none ${
          tone === "brand" ? "text-brand" : "text-ink"
        } ${dir === "left" ? "animate-season-left" : "animate-season-right"}`}
        style={{ animationDuration: `${seconds}s` }}
      >
        <span className="pr-[0.25em]">{copy}</span>
        <span className="pr-[0.25em]">{copy}</span>
      </div>
    </div>
  );
}

/**
 * The file's Season wall: rows of giant lowercase type sliding towards each
 * other - Sage to the right over 70 seconds, Red to the left over 80 - with a
 * white guide card in a Sage frame set over the middle: a 1:1 photo, "[Сезон]",
 * the guide's name in H3, a line and a link. Four rows on a desktop, six on a
 * phone. Under a thin rule above and below. It stands still for anyone who has
 * asked for less motion, and changes four times a year.
 */
export function SeasonWall({
  dark = "осень",
  red = "в магазинах",
  label = "Сезон",
  title,
  text,
  linkLabel = "Читать гид",
  href,
  image,
}: {
  /** The Sage phrase, and the Red one under it. */
  dark?: string;
  red?: string;
  label?: string;
  title: string;
  text?: string;
  linkLabel?: string;
  href?: string;
  image?: string;
}) {
  return (
    <section
      aria-label={`${dark} ${red}`}
      className="relative overflow-hidden border-y border-line py-6"
    >
      <div className="flex flex-col">
        <Row text={dark} tone="ink" dir="right" seconds={70} />
        <Row text={red} tone="brand" dir="left" seconds={80} />
        <Row text={dark} tone="ink" dir="right" seconds={70} />
        <Row text={red} tone="brand" dir="left" seconds={80} />
        {/* Two more on a phone only */}
        <Row text={dark} tone="ink" dir="right" seconds={70} className="md:hidden" />
        <Row text={red} tone="brand" dir="left" seconds={80} className="md:hidden" />
      </div>

      <div className="absolute left-1/2 top-1/2 flex w-[calc(100%-32px)] max-w-[640px] -translate-x-1/2 -translate-y-1/2 items-center gap-4 border border-ink bg-white p-4 md:gap-6 md:p-6">
        <div className="relative size-24 shrink-0 bg-surface md:size-[200px]">
          {image && <Image src={image} alt="" fill sizes="200px" className="object-cover" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 text-ink">
          <p className="type-caption">[{label}]</p>
          <p className="type-h3">{title}</p>
          {text && <p className="type-body-s">{text}</p>}
          {href && (
            <LinkArrow href={href} className="self-start">
              {linkLabel}
            </LinkArrow>
          )}
        </div>
      </div>
    </section>
  );
}
