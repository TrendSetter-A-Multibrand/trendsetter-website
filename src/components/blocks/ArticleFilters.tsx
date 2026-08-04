type ArticleFiltersProps = {
  filters: string[];
  searchPlaceholder?: string;
};

/** Pill filters on the left, an underlined search field 280px wide on the right. */
export function ArticleFilters({
  filters,
  searchPlaceholder = "Поиск статьи",
}: ArticleFiltersProps) {
  return (
    <section className="flex flex-wrap items-end justify-between gap-8 px-6 py-10 lg:px-10">
      <div className="flex flex-wrap gap-[18px]">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="flex h-10 items-center rounded-full border-2 border-black px-4 font-mono text-sm uppercase text-brand"
          >
            {filter}
          </button>
        ))}
      </div>

      <label className="flex w-[280px] items-center gap-6 border-b border-ink pb-2">
        <SearchIcon />
        <input
          type="search"
          placeholder={searchPlaceholder}
          className="w-full bg-transparent font-mono text-sm uppercase tracking-[3px] text-ink outline-none placeholder:text-ink/50"
        />
      </label>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
