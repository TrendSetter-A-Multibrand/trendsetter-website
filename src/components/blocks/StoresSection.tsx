import { StoreCards } from "@/components/blocks/StoreCards";
import { fetchStories } from "@/lib/storyblok/fetchStory";
import type { Store } from "@/lib/stores";

type StoreFields = {
  name?: string;
  address?: string;
  directions?: string;
  hours?: string;
  phone?: string;
  brands_count?: string;
  assortment?: string;
  tags?: string;
  image?: { filename?: string };
  lon?: string;
  lat?: string;
};

/** A textarea comes back as one string; the site wants it a line at a time. */
const lines = (field?: string) =>
  (field ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * The shops the space holds, drawn as the row of cards the file now asks for.
 * Adding a shop is adding a story: it turns up on the home page and on the
 * shops page at once, and on the map inside the sheet its card opens.
 *
 * Storyblok keeps a number field as a string of digits, which is why the two
 * coordinates come back as text and are read here.
 */
export async function StoresSection({ heading }: { heading?: string }) {
  const stories = await fetchStories<StoreFields>("store");

  const stores: Store[] = stories.map(({ content }) => ({
    name: content.name ?? "",
    address: content.address ?? "",
    hours: content.hours ?? "",
    phone: content.phone ?? "",
    brandCount: content.brands_count ?? "",
    assortment: content.assortment ?? "",
    directions: lines(content.directions),
    tags: lines(content.tags),
    image: content.image?.filename || "",
    coords: [Number(content.lon), Number(content.lat)],
  }));

  // An empty space draws no row at all rather than an empty one.
  if (stores.length === 0) return null;

  return <StoreCards heading={heading} stores={stores} />;
}
