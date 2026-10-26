/**
 * The file's Skeleton: flat Paper plates of the same shape as the card they stand
 * in for - a 4:3 photo and three lines under it on a desktop, a 40% photo with
 * lines beside it on a phone (the Card S row). Nothing moves, not even for
 * those who have not asked for less motion.
 *
 * It shows only when the wait is longer than 300 ms: it is drawn transparent
 * and fades in with that delay, so a page that answers quicker never flashes it.
 * The content replaces it at once.
 *
 * `list` is a row on a phone and a stack from 768, like Card S in a listing;
 * `row` is always a row, the side item of the editorial grid; `lead` is the big
 * photo of the lead card with its lines under it.
 */
export function SkeletonCard({ layout = "list" }: { layout?: "list" | "row" | "lead" }) {
  if (layout === "lead") {
    return (
      <div aria-hidden="true" className="flex animate-skeleton-in flex-col gap-4 opacity-0">
        <div className="aspect-[16/10] w-full bg-surface" />
        <div className="h-3 w-1/4 bg-surface" />
        <div className="h-4 w-4/5 bg-surface" />
        <div className="h-4 w-3/5 bg-surface" />
      </div>
    );
  }

  const wrap =
    layout === "row"
      ? "flex-row"
      : "max-md:border-b max-md:border-line max-md:last:border-b-0 md:flex-col md:py-0";
  const photo = layout === "row" ? "w-[40%] min-w-[120px]" : "w-[40%] min-w-[120px] md:w-full";

  return (
    <div
      aria-hidden="true"
      className={`flex animate-skeleton-in gap-4 py-4 opacity-0 ${wrap}`}
    >
      <div className={`aspect-[4/3] shrink-0 bg-surface ${photo}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="h-3 w-2/5 bg-surface" />
        <div className="h-3 w-full bg-surface" />
        <div className="h-3 w-3/4 bg-surface" />
      </div>
    </div>
  );
}
