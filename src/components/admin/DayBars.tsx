/** "2026-11-10" -> "10.11" */
const short = (day: string) => `${day.slice(8, 10)}.${day.slice(5, 7)}`;

/**
 * Sign-ups per day as bars, today on the right. Plain SVG, so it draws on the
 * server and needs no library: the bars are Red, the rule under them Sage, the
 * dates in mono caps every fifth day. A row of only zeros says so instead of
 * drawing an empty frame.
 */
export function DayBars({ days }: { days: { day: string; count: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) {
    return <p className="type-body text-text-2">За эти дни записей не было.</p>;
  }

  const W = 600;
  const H = 140;
  const GAP = 3;
  const bar = (W - GAP * (days.length - 1)) / days.length;

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H + 22}`}
        role="img"
        aria-label={`Записи по дням, всего ${total}`}
        className="h-auto w-full"
      >
        {days.map((d, i) => {
          const h = (d.count / max) * H;
          const x = i * (bar + GAP);
          return (
            <g key={d.day}>
              <rect x={x} y={H - h} width={bar} height={h} className="fill-brand">
                <title>{`${short(d.day)}: ${d.count}`}</title>
              </rect>
              {(days.length - 1 - i) % 5 === 0 && (
                <text
                  x={x + bar / 2}
                  y={H + 16}
                  textAnchor="middle"
                  className="fill-ink font-mono text-[10px]"
                >
                  {short(d.day)}
                </text>
              )}
            </g>
          );
        })}
        <line x1="0" x2={W} y1={H} y2={H} className="stroke-ink" strokeWidth="1" />
      </svg>
      <figcaption className="type-caption mt-2 text-text-2">
        Больше всего за день: {max}. Всего за период: {total}.
      </figcaption>
    </figure>
  );
}
