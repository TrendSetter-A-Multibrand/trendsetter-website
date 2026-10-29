import Link from "next/link";

/**
 * The editor still picks a tone in the settings, and the field is kept so
 * nothing in the Storyblok space has to change. The new file draws one band,
 * Sage, and the brand rule is one line, one colour - so every tone renders as
 * that band. (Redesign 2.0, "Ticker".)
 */
export type TickerTone = "red" | "yellow" | "green" | "blue";

type PromoTickerProps = {
  text?: string;
  ctaLabel?: string;
  href?: string;
  tone?: TickerTone;
};

/**
 * The strip above the header: 36 tall, Sage, Caption in white, each announcement
 * followed by an arrow, 24 between them. It runs to the left without a break in
 * 80 seconds (40 read too fast in testing), stops under the pointer, and stands still for anyone who asked
 * the system for less motion. Links underline on hover.
 *
 * Each line of the editor's text is an announcement of its own, as the file
 * runs three different ones in turn; a single line repeats.
 *
 * Two identical halves, each wider than any screen, so the second takes over
 * exactly where the first leaves and the loop has no seam.
 */
export function PromoTicker({
  text = "Скоро открытие нового магазина",
  ctaLabel = "",
  href = "#",
}: PromoTickerProps) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) lines.push("");
  // About ten announcements a half, in whole rounds of the lines
  const half = Math.ceil(10 / lines.length) * lines.length;
  const item = (key: number) => (
    <Link
      key={key}
      href={href}
      className="flex shrink-0 items-center gap-6 pr-6 hover:underline"
    >
      <span>
        {lines[key % lines.length]}
        {ctaLabel ? ` — ${ctaLabel}` : ""}
      </span>
      <span aria-hidden="true">→</span>
    </Link>
  );

  return (
    <div className="type-caption group/ticker flex h-9 items-center overflow-hidden bg-ink text-white">
      <div className="flex shrink-0 animate-ticker group-hover/ticker:[animation-play-state:paused] motion-reduce:animate-none">
        {Array.from({ length: half }, (_, i) => item(i))}
      </div>
      <div
        className="flex shrink-0 animate-ticker group-hover/ticker:[animation-play-state:paused] motion-reduce:hidden"
        aria-hidden="true"
      >
        {Array.from({ length: half }, (_, i) => item(i + half))}
      </div>
    </div>
  );
}
