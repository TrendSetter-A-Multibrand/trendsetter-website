/**
 * Red band with the quote scrolling across it. The mockup uses two heights:
 * a 55px band with 24px type and an 87px one with 36px.
 */
export function QuoteMarquee({
  text,
  size = "sm",
}: {
  text: string;
  size?: "sm" | "lg";
}) {
  const item = (key: number) => (
    <span
      key={key}
      className={`shrink-0 font-mono text-white ${
        size === "lg" ? "mx-8 text-4xl" : "mx-6 text-2xl"
      }`}
    >
      {text} /
    </span>
  );

  return (
    <div
      className={`flex overflow-hidden bg-brand ${
        size === "lg" ? "h-[87px]" : "h-[55px]"
      } items-center`}
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
