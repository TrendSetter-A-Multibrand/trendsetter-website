type PromoTickerProps = {
  text?: string;
  href?: string;
};

export function PromoTicker({
  text = "Скоро открытие нового магазина",
  href = "#",
}: PromoTickerProps) {
  const item = (key: number) => (
    <a
      key={key}
      href={href}
      className="mx-4 shrink-0 font-mono text-xs uppercase tracking-wide text-white"
    >
      {text} · Узнать подробнее
    </a>
  );

  return (
    <div className="flex overflow-hidden bg-brand py-2">
      <div className="flex shrink-0 animate-marquee">
        {Array.from({ length: 8 }, (_, i) => item(i))}
      </div>
      <div className="flex shrink-0 animate-marquee" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => item(i + 8))}
      </div>
    </div>
  );
}
