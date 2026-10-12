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
    <div className="px-4 pt-4 lg:px-10 lg:pb-10 lg:pt-5">
      {/* Mobile: chips, then the search, a hairline under both that bleeds to the screen edge.
          Desktop: one 48px row, chips at the left and the search at the right. */}
      <div className="-mx-4 flex flex-col gap-3 border-b border-ink/15 px-4 pb-4 lg:mx-0 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:border-b-0 lg:px-0 lg:pb-0">
        {/* Scrolls sideways since chips can outrun the screen */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&>*]:shrink-0 [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
          {categories.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={selected.includes(category)}
              onClick={() => toggle(category)}
            />
          ))}
        </div>

        <div className="w-full lg:w-auto lg:shrink-0">
          <SearchField placeholder="Найти бренд" value={query} onChange={setQuery} />
        </div>
      </div>

      {/* Mobile: 16 between a letter and its rows, 44 between groups. Desktop: the letter
          carries its own 20 above and below, the rows sit in three columns 40 apart. */}
      <div className="mt-4 flex flex-col gap-8 pb-4 lg:mt-5 lg:gap-0 lg:pb-0">
        {groups.length === 0 && <p className="font-mono text-sm uppercase">Ничего не найдено</p>}
        {groups.map((group) => (
          <section key={group.letter}>
            <h2 className="mb-4 font-mono text-[32px]/[40px] font-bold tracking-[6px] lg:mb-0 lg:py-5 lg:text-[60px]/[80px] lg:font-normal lg:tracking-[3px]">
              {group.letter}
            </h2>
            <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
              {group.brands.map((brand, i) => (
                <button
                  key={`${group.letter}-${i}`}
                  type="button"
                  onClick={() => setOpen(brand)}
                  className="group flex flex-col items-start gap-1.5 border-b border-ink/15 pb-3 text-left last:border-b-0 sm:border-b-0 sm:pb-0 lg:gap-2 lg:py-4"
                >
                  <p className="text-base/[20px] font-bold uppercase transition-colors group-hover:text-brand lg:text-2xl/[29px] lg:font-medium lg:tracking-[1px]">
                    {brand.name}
                  </p>
                  <p className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs/4 font-medium uppercase tracking-[1px] text-brand lg:text-sm/4">
                    {brand.categories.map((c) => (
                      <span key={c}>[{c}]</span>
                    ))}
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
