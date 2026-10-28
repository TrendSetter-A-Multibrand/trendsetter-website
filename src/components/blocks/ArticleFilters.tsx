import { FilterChip } from "@/components/ui/FilterChip";
import { sameTag, toggleTagHref } from "@/lib/articles";

type ArticleFiltersProps = {
  filters: string[];
  locale: string;
  section: "journal" | "news";
  /** Which ones are on, straight off the address. */
  activeTags?: string[];
};

/**
 * The file's Filter bar - 12 above and below the 44 chips, a Line rule under it:
 * the chips only, one row that swipes on a phone, wrapping on a desktop, 8 apart.
 * The file's journal and news have no search here; the search is the header's.
 * Each chip links to the current set with its tag switched on or off, so several
 * can be chosen at once; "Все" clears the set.
 */
export function ArticleFilters({
  filters,
  locale,
  section,
  activeTags = [],
}: ArticleFiltersProps) {
  return (
    <section className="border-b border-line px-4 py-3 md:px-10">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
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
    </section>
  );
}
