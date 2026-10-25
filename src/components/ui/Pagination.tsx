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

/* The file's Pager item: a 44 square with a 1px #d9d9d9 rule, a 12px mono number
   and 12 of air either side. Hover takes a Sage rule, the current page fills Red
   with a white number, and an arrow at either end of the list drops to 30%. */
const CELL =
  "flex h-11 min-w-11 items-center justify-center border px-3 font-mono text-[12px]/[1.3] uppercase tracking-[0.04em] transition-colors duration-150";
const ARROW = `${CELL} border-line text-ink hover:border-ink aria-disabled:pointer-events-none aria-disabled:opacity-30`;

export function Pagination({ page, pageCount, hrefFor }: PaginationProps) {
  if (pageCount < 2) return null;

  return (
    <nav
      aria-label="Страницы"
      className="flex items-center justify-center gap-2 py-10"
    >
      <Link
        href={hrefFor(Math.max(page - 1, 1))}
        aria-label="Предыдущая страница"
        aria-disabled={page <= 1 || undefined}
        className={ARROW}
      >
        <Chevron direction="left" />
      </Link>

      {pageWindow(page, pageCount).map((item, i) =>
        item === "gap" ? (
          <span
            key={`gap-${i}`}
            className="flex h-11 w-4 items-center justify-center font-mono text-[12px] text-ink"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            // Below lg only the ends and the current page show; the gaps stay
            // visible either side and end up sitting between whatever numbers
            // are left, so the row still reads as a window onto the whole count.
            className={`${CELL} ${
              item === page
                ? "border-brand bg-brand text-white"
                : "border-line text-ink hover:border-ink"
            } ${
              item === 1 || item === pageCount || item === page
                ? ""
                : "max-lg:hidden"
            }`}
          >
            {item}
          </Link>
        )
      )}

      <Link
        href={hrefFor(Math.min(page + 1, pageCount))}
        aria-label="Следующая страница"
        aria-disabled={page >= pageCount || undefined}
        className={ARROW}
      >
        <Chevron direction="right" />
      </Link>
    </nav>
  );
}

/** The file's arrow, 20 across: a shaft with the head at one end, 1.5 line */
function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M20 12H4m6-6-6 6 6 6" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
