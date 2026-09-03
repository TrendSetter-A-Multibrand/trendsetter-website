/**
 * The three shops, taken from src/lib/stores.ts. Each becomes a story of its
 * own, so the list on the site is whatever the space holds - adding a shop is
 * adding a story, and it turns up on the home page, on the shops page and on the
 * map at once.
 *
 * npm run storyblok:seed-stores
 */
import { STORES } from "../src/lib/stores.ts";
import { folder, putStory } from "./mapi.mjs";

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

const parent = await folder("stores", "Магазины");

for (const store of STORES) {
  // A path of its own so the shop can have a page later; the name is what an
  // editor will look for in the list. Storyblok takes Latin letters only, so a
  // Russian name is spelled out rather than left to fail.
  const slug = latin(store.name);

  const done = await putStory(
    slug,
    store.name,
    {
      component: "store",
      name: store.name,
      address: store.address,
      directions: store.directions.join("\n"),
      tags: store.tags.join("\n"),
      hours: store.hours,
      phone: store.phone,
      brands_count: store.brandCount,
      assortment: store.assortment,
      // The one place a path from the repository goes into an asset field. The
      // photos are not in the space and are not going to be until there is a
      // space worth uploading to, and a shop card without one shows the grey
      // placeholder. An editor replaces it with a real asset and this goes.
      image: { filename: store.image },
      // Storyblok keeps a number field as a string of digits, not as a number
      lon: String(store.coords[0]),
      lat: String(store.coords[1]),
    },
    parent,
    `stores/${slug}`
  );
  console.log(`${done}  stores/${slug}  «${store.name}»`);
}
