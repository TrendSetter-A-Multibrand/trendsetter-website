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
      className="flex items-center justify-center gap-2 py-10 font-mono text-xl"
    >
      <Link
        href={hrefFor(Math.max(page - 1, 1))}
        aria-label="Предыдущая страница"
        className="px-4 text-ink"
      >
        <Chevron direction="left" />
      </Link>

      {pageWindow(page, pageCount).map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} className="w-[34px] text-center text-ink">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            className={`flex h-[52px] w-[60px] items-center justify-center ${
              item === page ? "bg-brand text-white" : "bg-ink/6 text-ink"
            }`}
          >
            {item}
          </Link>
        )
      )}

      <Link
        href={hrefFor(Math.min(page + 1, pageCount))}
        aria-label="Следующая страница"
        className="px-4 text-ink"
      >
        <Chevron direction="right" />
      </Link>
    </nav>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M10 2 2 10l8 8" : "M2 2l8 8-8 8"}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
