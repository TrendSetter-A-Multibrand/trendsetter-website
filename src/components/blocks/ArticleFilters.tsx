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
        {filters.map((filter) => {
          const active = !!activeTag && sameTag(filter, activeTag);
          return (
            <FilterChip
              key={filter}
              label={filter}
              active={active}
              // Pressing the one already on takes the narrowing back off
              href={active ? `/${locale}/${section}` : tagHref(locale, section, filter)}
            />
          );
        })}
      </div>

      <SearchField placeholder={searchPlaceholder} />
    </section>
  );
}
