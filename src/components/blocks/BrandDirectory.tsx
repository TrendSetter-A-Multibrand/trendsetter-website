"use client";

import { useMemo, useState } from "react";
import { BrandIndexItem } from "@/components/cards/BrandIndexItem";
import { FilterChip } from "@/components/ui/FilterChip";
import { SearchField } from "@/components/ui/SearchField";
import { BrandModal } from "@/components/blocks/BrandModal";
import {
  alphabetLetters,
  filterBrands,
  indexKey,
  matchesLetter,
  OTHER_KEY,
  type Alphabet,
  type Brand,
} from "@/lib/brands";

/** "Есть в 2 магазинах" from the shops the brand is listed in; nothing when it lists none. */
function stockOf(brand: Brand) {
  const n = brand.stores.filter((s) => s.available).length;
  if (!brand.stores.length) return {};
  return n > 0
    ? { stock: `Есть в ${n} ${n === 1 ? "магазине" : "магазинах"}`, inStock: true }
    : { stock: "Сейчас нет в магазинах", inStock: false };
}

/**
 * The brands page: the search in a 437 field, then a bar that sticks under the
 * header with the category chips and the A-Z keys - a key for every letter,
 * the ones with no brand left in Line colour and dead, a press scrolling to the
 * group - and two switches after them: "RU" turns the keys and the groups to the
 * Russian alphabet, "0–9" keeps only the brands that begin with a digit. Then the
 * groups. On a desktop a group is its letter in H1 at the
 * left and its brands in a row to the right, as many across as it has up to
 * four; on a phone the letter is over a list with a rule between rows. A click
 * on a brand opens its sheet.
 */
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
  // Brands are grouped by the first letter of the alphabet in use; the rest go under «#»
  const [alphabet, setAlphabet] = useState<Alphabet>("en");
  const [digits, setDigits] = useState(false);
  const LETTERS = alphabetLetters(alphabet);

  const groups = useMemo(() => {
    const matching = filterBrands(brands, { query, categories: selected });
    if (digits) {
      const withDigit = matching.filter((brand) => matchesLetter(brand.name, OTHER_KEY, alphabet));
      return withDigit.length ? [{ letter: "0–9", brands: withDigit }] : [];
    }
    return alphabetLetters(alphabet)
      .map((key) => ({
        letter: key,
        brands: matching.filter((brand) => indexKey(brand.name, alphabet) === key),
      }))
      .filter((group) => group.brands.length > 0);
  }, [brands, query, selected, alphabet, digits]);

  const present = new Set(groups.map((g) => g.letter));

  function toggle(category: string) {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  function jump(letter: string) {
    document
      .getElementById(`brands-${letter}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="pb-32">
      <div className="px-4 pt-6 md:px-10 md:pt-8">
        <div className="md:w-[437px]">
          <SearchField fluid placeholder="Найти бренд" value={query} onChange={setQuery} />
        </div>
      </div>

      <div className="sticky top-[var(--header-offset,var(--header-h,116px))] transition-[top] duration-[250ms] ease-out z-20 border-b border-line bg-white pb-2 pt-3">
        <div className="-mx-0 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:flex-wrap md:overflow-visible md:px-10 [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={selected.includes(category)}
              onClick={() => toggle(category)}
            />
          ))}
        </div>

        <div
          role="group"
          aria-label="Алфавитный указатель"
          className="mt-2 flex overflow-x-auto px-4 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {LETTERS.filter((l) => l !== "#" || present.has("#")).map((letter) => {
            const on = !digits && present.has(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={!on}
                onClick={() => jump(letter)}
                className="type-label flex size-11 shrink-0 items-center justify-center text-ink transition-colors duration-150 hover:bg-ink hover:text-white active:bg-ink active:text-white disabled:pointer-events-none disabled:text-line md:min-w-0 md:flex-1"
              >
                {letter}
              </button>
            );
          })}
          {/* The two switches: the alphabet and the digits. Pressed - Sage with a white caption. */}
          <div className="ml-2 flex shrink-0 gap-2 md:ml-4">
            <FilterChip
              label="RU"
              active={alphabet === "ru"}
              onClick={() => setAlphabet(alphabet === "ru" ? "en" : "ru")}
            />
            <FilterChip label="0–9" active={digits} onClick={() => setDigits(!digits)} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 px-4 pt-6 md:gap-12 md:px-10 md:pt-12">
        {groups.length === 0 && <p className="type-body-l text-text-2">Ничего не найдено</p>}
        {groups.map((group) => (
          <section
            key={group.letter}
            id={`brands-${group.letter}`}
            className="scroll-mt-[calc(var(--header-h,116px)+130px)] md:grid md:grid-cols-[206px_1fr] md:gap-6"
          >
            <h2 className="type-h2 md:type-h1">{group.letter}</h2>
            <div
              style={
                { "--cols": `repeat(${Math.min(group.brands.length, 4)}, minmax(0, 1fr))` } as React.CSSProperties
              }
              className="mt-2 divide-y divide-line md:mt-0 md:grid md:[grid-template-columns:var(--cols)] md:gap-x-6 md:divide-y-0"
            >
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
