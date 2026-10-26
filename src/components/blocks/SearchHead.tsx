import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonClass } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { SearchIcon } from "@/components/ui/Icons";
import type { SiteSettings } from "@/lib/siteDefaults";

const SECTIONS = [
  { key: "all", value: "all" },
  { key: "news", value: "news" },
  { key: "journal", value: "journal" },
] as const;

// The file's own word for the page; the settings' older "Результаты поиска" is not used
const HEADING = "Поиск";

/**
 * The file's Search head: the crumbs, a field 56 tall with a Red "Найти" beside
 * it (898 across on a desktop), the page's H1, the chips «Все / Новости /
 * Журнал» and, once the results are known, "[Найдено: N]" in Caption. The same
 * head stays on the screen while the results load, so it takes no count then.
 */
export function SearchHead({
  locale,
  query,
  type,
  copy,
  count,
}: {
  locale: string;
  query: string;
  type: string;
  copy: SiteSettings["search"];
  count?: number;
}) {
  const hrefFor = (section: string) =>
    `/${locale}/search?q=${encodeURIComponent(query)}&type=${section}`;

  return (
    <>
      <Breadcrumbs items={[{ label: "Главная", href: `/${locale}` }, { label: HEADING }]} />

      <section className="flex flex-col gap-6 px-4 pb-8 md:px-10 md:pt-12">
        <form action={`/${locale}/search`} method="get" className="flex gap-2 md:max-w-[898px]">
          <input type="hidden" name="type" value={type} />
          <label className="flex h-14 min-w-0 flex-1 items-center gap-3 border border-ink bg-white pl-4 pr-3 focus-within:border-2 focus-within:border-brand focus-within:pl-[15px] focus-within:pr-[11px]">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={copy.placeholder}
              className="type-body min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-text-2 [&::-webkit-search-cancel-button]:appearance-none"
            />
            <SearchIcon className="max-md:hidden" />
          </label>
          <button type="submit" className={buttonClass("primary", "L")}>
            Найти
          </button>
        </form>

        <h1 className="type-h1 text-ink">{HEADING}</h1>

        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] max-md:-mx-4 max-md:px-4 [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((section) => (
            <FilterChip
              key={section.value}
              label={copy.filters[section.key]}
              active={section.value === type}
              href={hrefFor(section.value)}
            />
          ))}
        </div>

        {count !== undefined && (
          <p className="type-caption uppercase text-text-2">[Найдено: {count}]</p>
        )}
      </section>
    </>
  );
}
