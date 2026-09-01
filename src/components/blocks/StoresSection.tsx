import { StoreLocator } from "@/components/blocks/StoreLocator";
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
  image?: { filename?: string };
  lon?: string;
  lat?: string;
};

/**
 * The shops the space holds, drawn by the same panel as before. Adding a shop is
 * adding a story: it turns up in the row on the home page, on the shops page and
 * on the map at once.
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
    directions: (content.directions ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    image: content.image?.filename || "",
    coords: [Number(content.lon), Number(content.lat)],
  }));

  // The panel writes out whichever shop is selected, so with none there is no
  // selection to write out. An empty space is the only way here.
  if (stores.length === 0) return null;

  return <StoreLocator heading={heading} stores={stores} />;
}
