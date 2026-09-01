import Link from "next/link";

type PaginationProps = {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
};

/** Ends, the current page and its neighbours; anything skipped becomes a gap. */
function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  const shown = [1, 2, 3, 4, page, pageCount - 1, pageCount]
    .filter((p, i, all) => p >= 1 && p <= pageCount && all.indexOf(p) === i)
    .sort((a, b) => a - b);

  const out: (number | "gap")[] = [];
  shown.forEach((p, i) => {
    if (i > 0 && p - shown[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export function Pagination({ page, pageCount, hrefFor }: PaginationProps) {
  if (pageCount < 2) return null;

  return (
    <nav
      aria-label="Страницы"
      className="flex items-center justify-center gap-2 py-10 font-mono text-base/5 font-medium"
    >
      <Link
        href={hrefFor(Math.max(page - 1, 1))}
        aria-label="Предыдущая страница"
        className="flex h-[52px] w-[52px] items-center justify-center text-ink"
      >
        <Chevron direction="left" />
      </Link>

      {pageWindow(page, pageCount).map((item, i) =>
        item === "gap" ? (
          <span
            key={`gap-${i}`}
            className="flex h-[52px] w-6 items-center justify-center text-ink"
          >
            <Dots />
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            className={`flex size-[52px] items-center justify-center transition-colors ${
              item === page
                ? "bg-brand text-white"
                : "bg-surface-active text-ink hover:bg-surface"
            }`}
          >
            {item}
          </Link>
        )
      )}

      <Link
        href={hrefFor(Math.min(page + 1, pageCount))}
        aria-label="Следующая страница"
        className="flex h-[52px] w-[52px] items-center justify-center text-ink"
      >
        <Chevron direction="right" />
      </Link>
    </nav>
  );
}

/** 5 across and 10 tall inside a 24 icon box, drawn 2px - no shaft on it */
function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M14 7 9 12l5 5" : "M10 7l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

/** Three round 4px dots in a 24 box - the file draws the skipped pages, not an ellipsis */
function Dots() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="4" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="20" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}
