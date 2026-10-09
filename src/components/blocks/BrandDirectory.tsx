"use client";

import { useMemo, useState } from "react";
import { FilterChip } from "@/components/ui/FilterChip";
import { SearchField } from "@/components/ui/SearchField";
import { BrandModal } from "@/components/blocks/BrandModal";
import { alphabetLetters, filterBrands, indexKey, type Brand } from "@/lib/brands";

// The letter filter is gone from the design; brands stay grouped by first letter
const ALPHABET = "en";
const LETTERS = alphabetLetters(ALPHABET);

export function BrandDirectory({
  brands,
  categories,
}: {
  brands: Brand[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<Brand | null>(null);

  const groups = useMemo(() => {
    const matching = filterBrands(brands, { query, categories: selected });
    return LETTERS.map((key) => ({
      letter: key,
      brands: matching.filter((brand) => indexKey(brand.name, ALPHABET) === key),
    })).filter((group) => group.brands.length > 0);
  }, [brands, query, selected]);

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
          <div className="w-full lg:ml-auto lg:w-auto lg:self-end">
            <SearchField placeholder="Найти бренд" value={query} onChange={setQuery} />
          </div>
        </div>

        {/* Order pulled above the search row visually; scrolls sideways since chips can outrun the screen */}
        <div className="-order-1 -mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&>*]:shrink-0 [&::-webkit-scrollbar]:hidden lg:order-none lg:mx-0 lg:mt-[21px] lg:flex-wrap lg:overflow-visible lg:px-0">
          {categories.map((category) => (
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
        {groups.length === 0 && <p className="font-mono text-sm uppercase">Ничего не найдено</p>}
        {groups.map((group) => (
          <section key={group.letter}>
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
