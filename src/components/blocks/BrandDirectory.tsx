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
    <div className="px-6 pt-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-6 lg:h-[50px]">
        <div className="flex flex-wrap gap-4 font-mono text-xl leading-none">
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
        <div className="lg:self-end">
          <SearchField placeholder="Найти бренд" value={query} onChange={setQuery} />
        </div>
      </div>

      <div className="mt-[21px] flex flex-wrap gap-2">
        {BRAND_CATEGORIES.map((category) => (
          <FilterChip
            key={category}
            label={category}
            active={selected.includes(category)}
            onClick={() => toggle(category)}
          />
        ))}
      </div>

      <div className="mt-[50px] flex flex-col gap-12 pb-16">
        {groups.map((group) => (
          <section key={group.letter} id={`brands-${group.letter}`}>
            <h2 className="mb-[52px] text-[58px] font-bold leading-none">
              {group.letter}
            </h2>
            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-[81px]">
              {group.brands.map((brand, i) => (
                <button
                  key={`${group.letter}-${i}`}
                  type="button"
                  onClick={() => setOpen(brand)}
                  className="group text-left"
                >
                  <p className="text-2xl font-bold uppercase leading-none transition-colors group-hover:text-brand">
                    {brand.name}
                  </p>
                  <p className="mt-[15px] font-mono text-sm uppercase leading-none">
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
