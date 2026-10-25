/**
 * The file's Facts: a caption column and the value beside it. Default has a thin
 * rule between the rows - between, never above the first or below the last - a
 * 96 label column, Body and 12 of air. Compact is the shop card's: no rules, a 72
 * label column, Body S and 4 of air. In a column narrower than 280 the label
 * stands over its value instead of beside it.
 */
export type Fact = { label: string; value: React.ReactNode };

export function Facts({
  items,
  compact = false,
}: {
  items: Fact[];
  compact?: boolean;
}) {
  return (
    <dl className="@container flex w-full flex-col">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex gap-3 @max-[280px]:flex-col @max-[280px]:gap-1 ${
            compact
              ? "py-1"
              : `py-3 ${i > 0 ? "border-t border-line" : "pt-0"} ${
                  i === items.length - 1 ? "pb-0" : ""
                }`
          }`}
        >
          <dt className={`type-caption shrink-0 ${compact ? "w-[72px]" : "w-24"}`}>
            {item.label}
          </dt>
          <dd className={`min-w-0 flex-1 ${compact ? "type-body-s" : "type-body"}`}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
