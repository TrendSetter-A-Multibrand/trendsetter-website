import { fetchStories } from "@/lib/storyblok/fetchStory";
import type { StoreRef } from "@/lib/storeMatch";

const coord = (v: string | number | undefined) => {
  const n = typeof v === "number" ? v : Number(v);
  return v !== undefined && v !== "" && Number.isFinite(n) ? n : undefined;
};

/** The stores as the cabinet and the e-mails need them: uuid, name, address, coordinates. */
export async function fetchStoreRefs(): Promise<StoreRef[]> {
  const stories = await fetchStories<{
    name?: string;
    address?: string;
    lat?: string | number;
    lon?: string | number;
  }>("store").catch(() => []);
  return stories.map((story) => ({
    uuid: story.uuid,
    name: story.content.name ?? story.name,
    address: story.content.address || undefined,
    lat: coord(story.content.lat),
    lon: coord(story.content.lon),
  }));
}
