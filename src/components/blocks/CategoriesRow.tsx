import { CategoryTile } from "@/components/cards/CategoryTile";
import { SectionTitle } from "@/components/ui/SectionTitle";

export type CategoryItem = {
  label: string;
  href: string;
  image?: string;
};

/** The colours behind the photos while they load, one after another. */
const TINTS = [
  "bg-ext-blue",
  "bg-ext-pink",
  "bg-ext-emerald",
  "bg-accent-yellow",
  "bg-ext-dark-blue",
  "bg-accent-green",
];

/**
 * "Что есть в магазинах": the file's Category tiles under a section head. Six
 * across a desktop with 24 between, square; on a phone a row of 160 tiles that
 * swipes, 12 apart, the next one showing past the edge. Each tile is numbered by
 * its place - "[1] Одежда".
 */
export function CategoriesRow({
  heading = "Что есть в магазинах",
  items,
}: {
  heading?: string;
  items: CategoryItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="px-4 pt-16 md:px-10 md:pt-32">
      <SectionTitle heading={heading} className="mb-6 md:mb-8" />
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 [scrollbar-width:none] max-md:scroll-pl-4 md:mx-0 md:grid md:grid-cols-6 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => (
          <div key={i} className="w-40 shrink-0 snap-start md:w-auto">
            <CategoryTile
              href={item.href}
              label={`[${i + 1}] ${item.label}`}
              image={item.image}
              tint={TINTS[i % TINTS.length]}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
