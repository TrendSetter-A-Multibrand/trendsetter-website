import { FilterChip } from "@/components/ui/FilterChip";
import { SearchField } from "@/components/ui/SearchField";

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
    <section className="flex flex-wrap items-center justify-between gap-8 px-6 py-10 lg:px-10">
      {/* Chips are 16 apart in the mockup, and the field lines up with them */}
      <div className="flex flex-wrap gap-4">
        {filters.map((filter) => (
          <FilterChip key={filter} label={filter} />
        ))}
      </div>

      <SearchField placeholder={searchPlaceholder} />
    </section>
  );
}
