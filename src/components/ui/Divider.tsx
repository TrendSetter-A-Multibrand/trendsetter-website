/**
 * The file's Divider. Line - a 1px #d9d9d9 hairline between the rows of a list,
 * never above the first or below the last, with 8 of air either side. Strong is
 * the Sage rule that closes a section header, and Dots the three red 6px squares
 * that mark a break in an article.
 */
export function Divider({ type = "line" }: { type?: "line" | "strong" | "dots" }) {
  if (type === "dots") {
    return (
      <div className="flex items-center justify-center gap-3 py-2" aria-hidden="true">
        <span className="size-[6px] bg-brand" />
        <span className="size-[6px] bg-brand" />
        <span className="size-[6px] bg-brand" />
      </div>
    );
  }
  return (
    <div className="py-2">
      <div className={`h-px ${type === "strong" ? "bg-ink" : "bg-line"}`} />
    </div>
  );
}
