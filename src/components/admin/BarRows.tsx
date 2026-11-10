export type BarRow = {
  label: string;
  /** What the bar measures, e.g. the sign-ups. */
  value: number;
  /** The full bar: the seats of an event, or the busiest row when there is no limit. */
  max: number;
  /** The part of `value` that came, drawn over it in Red. */
  attended?: number;
  note: string;
};

/**
 * Horizontal bars, one per row: Sage for those who signed up, Red over it for
 * those who came, the figures to the right. A rule, not a plate, carries the
 * whole length so an empty bar still shows how much room there was.
 */
export function BarRows({ rows }: { rows: BarRow[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {rows.map((row) => {
        const share = row.max > 0 ? Math.min(100, (row.value / row.max) * 100) : 0;
        const came = row.max > 0 && row.attended ? Math.min(100, (row.attended / row.max) * 100) : 0;
        return (
          <li key={row.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="type-body min-w-0 truncate">{row.label}</span>
              <span className="type-caption shrink-0 text-text-2">{row.note}</span>
            </div>
            <div
              role="img"
              aria-label={`${row.label}: ${row.note}`}
              className="relative mt-1 h-3 border border-line bg-white"
            >
              <div className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${share}%` }} />
              <div className="absolute inset-y-0 left-0 bg-brand" style={{ width: `${came}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
