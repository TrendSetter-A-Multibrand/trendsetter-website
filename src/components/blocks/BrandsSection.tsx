import { BrandDirectory } from "@/components/blocks/BrandDirectory";
import { fetchStories } from "@/lib/storyblok/fetchStory";
import { BRAND_CATEGORIES, type Brand } from "@/lib/brands";
import { fetchDatasource } from "@/lib/storyblok/datasource";
import { fetchEvents } from "@/lib/storyblok/events";

type Availability = { store?: string; available?: boolean };

type BrandFields = {
  name?: string;
  logo?: { filename?: string };
  color?: string;
  categories?: string[];
  description?: string;
  image?: { filename?: string };
  availability?: Availability[];
};

type StoreFields = { name?: string };

/**
 * The brands the space holds. A brand does not carry the name of a shop, it
 * points at the shop's own story - so renaming a shop renames it here too, and
 * a shop cannot be in the list under two spellings.
 *
 * The pointer is the story's uuid, which is why the shops are read as well and
 * kept by uuid; a pointer at a shop that has since been deleted is dropped
 * rather than drawn as a blank line.
 */
export async function BrandsSection() {
  const [brands, shops, events, categories] = await Promise.all([
    fetchStories<BrandFields>("brand"),
    fetchStories<StoreFields>("store"),
    fetchEvents(),
    // The chips over the list are the datasource the editor keeps, so a new
    // category is a new entry there and nothing else
    fetchDatasource("brand-categories", BRAND_CATEGORIES),
  ]);

  const nameByUuid = new Map(
    shops.map((shop) => [shop.uuid, shop.content.name ?? shop.name])
  );

  const list: Brand[] = brands.map(({ content }) => ({
    name: content.name ?? "",
    categories: content.categories ?? [],
    logo: content.logo?.filename || "",
    image: content.image?.filename || "",
    description: content.description ?? "",
    color: content.color || undefined,
    stores: (content.availability ?? [])
      .filter((row) => row.store && nameByUuid.has(row.store))
      .map((row) => ({
        name: nameByUuid.get(row.store!)!,
        available: Boolean(row.available),
      })),
    // Which events belong to which brand is not something the space says yet:
    // a brand has no field for them, so every sheet ends on the same two. It
    // gets one when there is anything to choose between.
    events: events.slice(0, 2),
  }));

  return <BrandDirectory brands={list} categories={categories} />;
}
