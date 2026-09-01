import Link from "next/link";

/**
 * The library draws the band in four colours. Yellow, green and blue have no
 * token of their own - the file's Colors page is still a row of unnamed
 * swatches - so they stay written out here, as the Marker's do.
 */
export type TickerTone = "red" | "yellow" | "green" | "blue";

const TONES: Record<TickerTone, string> = {
  red: "bg-brand text-white",
  yellow: "bg-[#F3E73F] text-ink",
  green: "bg-[#71CC98] text-ink",
  blue: "bg-[#1F3F70] text-white",
};

type PromoTickerProps = {
  text?: string;
  ctaLabel?: string;
  href?: string;
  tone?: TickerTone;
};

/**
 * The strip above the header. One repeat measures 428px in the mockup: the
 * announcement, the arrow, the call to action and the slash, evenly spaced - the
 * slash carries the same gap after it, so the repeats space themselves.
 *
 * The 8px gap is smaller than the ~10px measured between the letters, on
 * purpose: the browser lays type out by advance width, which already carries a
 * side bearing and a trailing letter-space that Figma's ink boxes do not show.
 */
export function PromoTicker({
  text = "Скоро открытие нового магазина",
  ctaLabel = "Узнать подробнее",
  href = "#",
  tone = "red",
}: PromoTickerProps) {
  const item = (key: number) => (
    <Link
      key={key}
      href={href}
      className="flex shrink-0 items-center gap-2 pr-2"
    >
      <span>{text}</span>
      <Arrow />
      <span>{ctaLabel}</span>
      <span aria-hidden="true">/</span>
    </Link>
  );

  return (
    <div
      className={`flex h-10 items-center overflow-hidden font-mono text-xs font-medium uppercase tracking-[1px] ${TONES[tone]}`}
    >
      <div className="flex shrink-0 animate-marquee">
        {Array.from({ length: 6 }, (_, i) => item(i))}
      </div>
      <div className="flex shrink-0 animate-marquee" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => item(i + 6))}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 11 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M0 6h10.5M5.5 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
