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
    <section className="flex flex-wrap items-end justify-between gap-8 px-6 py-10 lg:px-10">
      <div className="flex flex-wrap gap-4">
        {filters.map((filter) => (
          <FilterChip key={filter} label={filter} />
        ))}
      </div>

      <SearchField placeholder={searchPlaceholder} />
    </section>
  );
}
