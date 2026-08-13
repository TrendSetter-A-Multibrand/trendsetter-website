import Link from "next/link";

type PromoTickerProps = {
  text?: string;
  ctaLabel?: string;
  href?: string;
};

/**
 * The red strip above the header. One repeat measures 428px in the mockup: the
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
}: PromoTickerProps) {
  const item = (key: number) => (
    <Link
      key={key}
      href={href}
      className="flex shrink-0 items-center gap-2 pr-2 text-white"
    >
      <span>{text}</span>
      <Arrow />
      <span>{ctaLabel}</span>
      <span aria-hidden="true">/</span>
    </Link>
  );

  return (
    <div className="flex h-10 items-center overflow-hidden bg-brand font-mono text-xs uppercase tracking-[1px]">
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
