/**
 * The file's Date badge, one component for an event row and the events widget:
 * the day in H1 with tabular figures, the month in Caption beneath it - centred
 * on a desktop, at the left under the day on a phone (as the file draws the row).
 * Red in the widget of the nearest events, Sage in a row. On a phone the day is
 * H1's mobile size (30) rather than 64.
 */
export function DateBadge({
  day,
  month,
  color = "sage",
}: {
  day: string;
  month: string;
  color?: "sage" | "red";
}) {
  return (
    <div
      className={`flex flex-col items-start gap-1 md:items-center ${
        color === "red" ? "text-brand" : "text-ink"
      }`}
    >
      <span className="type-h1 tabular-nums">{day}</span>
      <span className="type-caption">{month}</span>
    </div>
  );
}
