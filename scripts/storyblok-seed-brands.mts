/**
 * The brands, each its own story, with the shops it is stocked in referred to
 * rather than copied - the name of a shop lives in one place, and renaming it
 * renames it everywhere.
 *
 * Two brands, not the eighteen in src/lib/brands.ts: those eighteen are nine
 * copies of each, put there to fill the mockup's grid. Nine copies in the space
 * would be nine stories for somebody to delete by hand.
 *
 * npm run storyblok:seed-brands
 */
import { api, block, folder, putStory } from "./mapi.mjs";

/**
 * Written out here rather than imported from src/lib/brands.ts: that file reaches
 * for `@/lib/events` and the alias means nothing to node, and what goes into the
 * space is not what is in that file anyway.
 */
const DESCRIPTION = Array.from(
  { length: 10 },
  () =>
    "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона"
).join(" ");

const BRANDS = [
  {
    name: "Abercrombie & Fitch",
    color: "#1F3F70",
    categories: ["Одежда", "Обувь", "Мужчинам", "Девушкам", "Детям"],
    logo: "/images/brands/abercrombie-fitch.svg",
    image: "/images/home/journal/1.jpg",
    description: DESCRIPTION,
    stores: [
      { name: "Avenue Sever", available: true },
      { name: "ТРЦ Мозаика", available: true },
      { name: "ТРЦ Vegas", available: false },
    ],
  },
  {
    name: "Balenciaga",
    color: "",
    categories: ["Одежда", "Обувь", "Аксессуары"],
    logo: "/images/brands/abercrombie-fitch.svg",
    image: "/images/home/journal/1.jpg",
    description: DESCRIPTION,
    stores: [
      { name: "Avenue Sever", available: false },
      { name: "ТРЦ Vegas", available: true },
    ],
  },
];

const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

const latin = (name: string) =>
  [...name.toLowerCase()]
    .map((letter) => CYRILLIC[letter] ?? letter)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The shops already in the space, so a brand can point at one. Looked up by
 * slug rather than by name: the list the management side returns carries the
 * slug and the uuid but not the content, and the slug is the name spelled out
 * the same way the shops were seeded.
 */
const { stories: shops } = await api("/stories?content_type=store&per_page=100");
const uuidBySlug = new Map<string, string>(
  shops.map((shop: { uuid: string; slug: string }) => [shop.slug, shop.uuid])
);
const uuidOf = (name: string) => uuidBySlug.get(latin(name));

const parent = await folder("brands", "Бренды");

for (const brand of BRANDS) {
  const slug = latin(brand.name);
  const done = await putStory(
    slug,
    brand.name,
    {
      component: "brand",
      name: brand.name,
      color: brand.color,
      categories: brand.categories,
      description: brand.description,
      // Paths from the repository, as with the shops: the logos and photos are
      // not in the space yet and a card without them shows a placeholder.
      logo: { filename: brand.logo },
      image: { filename: brand.image },
      availability: brand.stores
        .filter((shop) => uuidOf(shop.name))
        .map((shop) =>
          block("brand_store", {
            store: uuidOf(shop.name),
            available: shop.available,
          })
        ),
    },
    parent,
    `brands/${slug}`
  );

  const pointed = brand.stores.filter((shop) => uuidOf(shop.name)).length;
  console.log(`${done}  brands/${slug}  «${brand.name}»  магазинов ${pointed}`);
}

const missing = BRANDS.flatMap((brand) => brand.stores)
  .map((shop) => shop.name)
  .filter((name) => !uuidOf(name));
if (missing.length) {
  console.log(`\nне нашлось в пространстве: ${[...new Set(missing)].join(", ")}`);
}
