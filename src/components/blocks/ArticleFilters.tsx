import { FilterChip } from "@/components/ui/FilterChip";
import { SearchField } from "@/components/ui/SearchField";
import { sameTag, tagHref } from "@/lib/articles";

type ArticleFiltersProps = {
  filters: string[];
  locale: string;
  section: "journal" | "news";
  /** Which one is on, straight off the address. */
  activeTag?: string;
  searchPlaceholder?: string;
};

/**
 * Pill filters on the left, an underlined search field 280px wide on the right.
 * Each pill is the same link a tag under a card is, so both ways of narrowing
 * the page end up on the same address.
 */
export function ArticleFilters({
  filters,
  locale,
  section,
  activeTag,
  searchPlaceholder = "Поиск статьи",
}: ArticleFiltersProps) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-8 px-6 py-10 lg:px-10">
      {/* Chips are 16 apart in the mockup, and the field lines up with them */}
      <div className="flex flex-wrap gap-4">
        {/* Same first chip the search page has: the way back to everything.
            Without it a reader who picks a tag can only get out through the
            home page. */}
        <FilterChip
          label="Все"
          active={!activeTag}
          href={`/${locale}/${section}`}
        />
        {filters.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            active={!!activeTag && sameTag(filter, activeTag)}
            href={tagHref(locale, section, filter)}
          />
        ))}
      </div>

      <SearchField placeholder={searchPlaceholder} />
    </section>
  );
}
