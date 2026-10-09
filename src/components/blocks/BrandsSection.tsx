import { BrandDirectory } from "@/components/blocks/BrandDirectory";
import { fetchStories } from "@/lib/storyblok/fetchStory";
import { BRAND_CATEGORIES, brandStores, parseShowLogo, type Brand } from "@/lib/brands";
import { fetchDatasource } from "@/lib/storyblok/datasource";

type Availability = { store?: string; available?: boolean | string };

type BrandFields = {
  name?: string;
  logo?: { filename?: string };
  show_logo?: boolean | string;
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
 * The pointer is the story's uuid, which is why the shops are read as well. The
 * sheet always lists every shop; a shop the brand has no row for counts as
 * stocked, and a pointer at a deleted shop is simply never looked up.
 */
export async function BrandsSection() {
  const [brands, shops, categories] = await Promise.all([
    fetchStories<BrandFields>("brand"),
    fetchStories<StoreFields>("store"),
    // The chips over the list are the datasource the editor keeps, so a new
    // category is a new entry there and nothing else
    fetchDatasource("brand-categories", BRAND_CATEGORIES),
  ]);

  // Every shop, in the order /stores lists them, whatever rows a brand has
  const allShops = shops.map((shop) => ({
    uuid: shop.uuid,
    name: shop.content.name ?? shop.name,
  }));

  const list: Brand[] = brands.map(({ content }) => ({
    name: content.name ?? "",
    categories: content.categories ?? [],
    logo: content.logo?.filename || "",
    showLogo: parseShowLogo(content.show_logo),
    image: content.image?.filename || "",
    description: content.description ?? "",
    color: content.color || undefined,
    stores: brandStores(allShops, content.availability ?? []),
  }));

  return <BrandDirectory brands={list} categories={categories} />;
}
