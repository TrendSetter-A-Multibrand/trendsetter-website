import { FilterChip } from "@/components/ui/FilterChip";
import { SearchField } from "@/components/ui/SearchField";
import { sameTag, toggleTagHref } from "@/lib/articles";

type ArticleFiltersProps = {
  filters: string[];
  locale: string;
  section: "journal" | "news";
  /** Which ones are on, straight off the address. */
  activeTags?: string[];
  searchPlaceholder?: string;
};

/**
 * Pill filters on the left, an underlined search field 280px wide on the right.
 * Each pill links to the current set with its tag switched on or off, so several
 * can be chosen at once; "Все" clears the set.
 */
export function ArticleFilters({
  filters,
  locale,
  section,
  activeTags = [],
  searchPlaceholder = "Поиск статьи",
}: ArticleFiltersProps) {
  return (
    <section className="flex flex-col gap-3 border-b border-ink/15 p-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-8 lg:border-b-0 lg:px-10 lg:py-10">
      {/* Chips are 16 apart in the mockup, and the field lines up with them */}
      {/* Below lg the row scrolls edge-to-edge: negative margins cancel the
          section's own padding so the first/last chip doesn't sit flush
          against the viewport, and the scrollbar is hidden since the mockup
          shows a plain horizontal list, not a browser scrollbar. shrink-0 has
          no lg: pair on purpose - at lg the row wraps instead of scrolling,
          so nothing there needs to resist shrinking, and desktop stays as it was. */}
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 [scrollbar-width:none] [&>*]:shrink-0 [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {/* Same first chip the search page has: the way back to everything.
            Without it a reader who picks a tag can only get out through the
            home page. */}
        <FilterChip
          label="Все"
          active={activeTags.length === 0}
          href={`/${locale}/${section}`}
        />
        {filters.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            active={activeTags.some((tag) => sameTag(filter, tag))}
            href={toggleTagHref(locale, section, activeTags, filter)}
          />
        ))}
      </div>

      <SearchField placeholder={searchPlaceholder} />
    </section>
  );
}
