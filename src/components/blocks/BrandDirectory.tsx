"use client";

import { useMemo, useState } from "react";
import { FilterChip } from "@/components/ui/FilterChip";
import { SearchField } from "@/components/ui/SearchField";
import { BrandIndexItem } from "@/components/cards/BrandIndexItem";
import { BrandModal } from "@/components/blocks/BrandModal";
import { alphabetLetters, filterBrands, indexKey, type Brand } from "@/lib/brands";

// The letter filter is gone from the design; brands stay grouped by first letter
const ALPHABET = "en";
const LETTERS = alphabetLetters(ALPHABET);

/** "Есть в 2 магазинах" from the shops the brand is listed in; nothing when it lists none. */
function stockOf(brand: Brand) {
  const n = brand.stores.filter((s) => s.available).length;
  if (!brand.stores.length) return {};
  return n > 0
    ? { stock: `Есть в ${n} ${n === 1 ? "магазине" : "магазинах"}`, inStock: true }
    : { stock: "Нет в наличии", inStock: false };
}

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
    <div className="px-4 pb-10 pt-4 md:px-10">
      {/* The filter bar: chips that swipe on a phone and wrap on a desktop, and
          the search - above the chips on a phone, at the right of them from 768 */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="order-2 -mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:order-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={selected.includes(category)}
              onClick={() => toggle(category)}
            />
          ))}
        </div>

        <div className="order-1 w-full md:order-2 md:w-auto md:shrink-0">
          <SearchField placeholder="Найти бренд" value={query} onChange={setQuery} />
        </div>
      </div>

      {/* Desktop: the group's letter in H1 at the left, sticking, the brands in
          three columns beside it without rules. Phone: the letter over a list
          with a thin rule between rows. */}
      <div className="mt-8 flex flex-col gap-8 md:mt-12 md:gap-12">
        {groups.length === 0 && <p className="type-label">Ничего не найдено</p>}
        {groups.map((group) => (
          <section key={group.letter} className="md:grid md:grid-cols-[repeat(12,minmax(0,1fr))] md:gap-6">
            <h2 className="type-h1 md:sticky md:top-[calc(var(--header-h,80px)+16px)] md:col-span-2 md:self-start">
              {group.letter}
            </h2>
            <div className="mt-2 divide-y divide-line md:col-span-10 md:mt-0 md:grid md:grid-cols-3 md:gap-x-6 md:divide-y-0">
              {group.brands.map((brand, i) => (
                <BrandIndexItem
                  key={`${group.letter}-${i}`}
                  name={brand.name}
                  categories={brand.categories}
                  {...stockOf(brand)}
                  onOpen={() => setOpen(brand)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {open && <BrandModal brand={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
