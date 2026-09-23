"use client";

import { useMemo, useState } from "react";
import { FilterChip } from "@/components/ui/FilterChip";
import { SearchField } from "@/components/ui/SearchField";
import { BrandModal } from "@/components/blocks/BrandModal";
import { BRAND_CATEGORIES, BRAND_INDEX, indexKey, type Brand } from "@/lib/brands";

export function BrandDirectory({ brands }: { brands: Brand[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<Brand | null>(null);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matching = brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(needle) &&
        selected.every((category) => brand.categories.includes(category))
    );
    return BRAND_INDEX.map((letter) => ({
      letter,
      brands: matching.filter((brand) => indexKey(brand.name) === letter),
    })).filter((group) => group.brands.length > 0);
  }, [brands, query, selected]);

  const filled = new Set(groups.map((group) => group.letter));

  function toggle(category: string) {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  return (
    <div className="px-4 pt-4 lg:px-10 lg:pt-6">
      {/* Wrapper lets the divider bleed to the screen edge on mobile, like ArticleFilters */}
      <div className="-mx-4 flex flex-col gap-3 border-b border-ink/15 px-4 pb-4 lg:mx-0 lg:block lg:border-b-0 lg:px-0 lg:pb-0">
        <div className="flex flex-wrap items-center justify-between gap-6 lg:h-[50px]">
          <div className="hidden flex-wrap gap-4 font-mono text-xl leading-none lg:flex">
            {BRAND_INDEX.map((letter) =>
              filled.has(letter) ? (
                <a key={letter} href={`#brands-${letter}`} className="hover:text-brand">
                  {letter}
                </a>
              ) : (
                <span key={letter} className="text-ink/30">
                  {letter}
                </span>
              )
            )}
          </div>

          {/* The rule sits on the bottom of the 50px row, the letters centred in it */}
          <div className="w-full lg:w-auto lg:self-end">
            <SearchField placeholder="Найти бренд" value={query} onChange={setQuery} />
          </div>
        </div>

        {/* Order pulled above the search row visually; scrolls sideways since chips can outrun the screen */}
        <div className="-order-1 -mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&>*]:shrink-0 [&::-webkit-scrollbar]:hidden lg:order-none lg:mx-0 lg:mt-[21px] lg:flex-wrap lg:overflow-visible lg:px-0">
          {BRAND_CATEGORIES.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={selected.includes(category)}
              onClick={() => toggle(category)}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 pb-4 lg:mt-[50px] lg:gap-12 lg:pb-16">
        {groups.map((group) => (
          <section key={group.letter} id={`brands-${group.letter}`}>
            <h2 className="mb-4 font-mono text-[32px]/[40px] font-bold tracking-[6px] lg:mb-[52px] lg:font-sans lg:text-[58px]/none lg:tracking-normal">
              {group.letter}
            </h2>
            <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3 lg:gap-y-[81px]">
              {group.brands.map((brand, i) => (
                <button
                  key={`${group.letter}-${i}`}
                  type="button"
                  onClick={() => setOpen(brand)}
                  className="group border-b border-ink/15 pb-3 text-left sm:border-b-0 sm:pb-0"
                >
                  <p className="text-base/[20px] font-bold uppercase transition-colors group-hover:text-brand lg:text-2xl/none">
                    {brand.name}
                  </p>
                  <p className="mt-1.5 font-mono text-sm/[18px] font-medium uppercase text-brand lg:mt-[15px] lg:text-sm/none lg:font-normal lg:text-inherit">
                    {brand.categories.map((c) => `[${c}]`).join(" ")}
                  </p>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {open && <BrandModal brand={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
