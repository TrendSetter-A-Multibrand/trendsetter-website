import { fetchStories } from "@/lib/storyblok/fetchStory";
import { brandStores } from "@/lib/brands";

type BrandFields = { name?: string; availability?: { store?: string; available?: boolean | string }[] };
type StoreFields = { name?: string };

/**
 * The line a brand carries in an article's "Бренды в материале" list - "есть в 2
 * магазинах" or "нет в наличии" - keyed by the brand's name in lower case. A
 * brand that lists no shops has no line, the way it has none in the index.
 */
export async function fetchBrandStock(): Promise<Record<string, string>> {
  const [brands, shops] = await Promise.all([
    fetchStories<BrandFields>("brand"),
    fetchStories<StoreFields>("store"),
  ]);
  const allShops = shops.map((shop) => ({ uuid: shop.uuid, name: shop.content.name ?? shop.name }));

  const stock: Record<string, string> = {};
  for (const { content } of brands) {
    const stores = brandStores(allShops, content.availability ?? []);
    if (!content.name || !stores.length) continue;
    const n = stores.filter((s) => s.available).length;
    stock[content.name.toLowerCase()] =
      n > 0 ? `есть в ${n} ${n === 1 ? "магазине" : "магазинах"}` : "нет в наличии";
  }
  return stock;
}
