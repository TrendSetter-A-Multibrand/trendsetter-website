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
 * The file's Filter bar: the chips at the left - one row that swipes on a phone,
 * wrapping on a desktop, 8 apart - and the search at the right (above them on a
 * phone). Each chip links to the current set with its tag switched on or off, so
 * several can be chosen at once; "Все" clears the set.
 */
export function ArticleFilters({
  filters,
  locale,
  section,
  activeTags = [],
  searchPlaceholder = "Поиск статьи",
}: ArticleFiltersProps) {
  return (
    <section className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-start md:justify-between md:gap-6 md:px-10 md:py-6">
      <div className="order-2 -mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:order-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {/* The way back to everything; without it a reader who picks a tag can
            only get out through the home page. */}
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

      <div className="order-1 w-full md:order-2 md:w-auto md:shrink-0">
        <SearchField placeholder={searchPlaceholder} />
      </div>
    </section>
  );
}
