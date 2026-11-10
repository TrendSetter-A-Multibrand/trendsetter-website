import { fetchStories } from "@/lib/storyblok/fetchStory";
import type { StoreRef } from "@/lib/storeMatch";

/** The stores as the cabinet needs them: the story's uuid and the name it is shown by. */
export async function fetchStoreRefs(): Promise<StoreRef[]> {
  const stories = await fetchStories<{ name?: string }>("store").catch(() => []);
  return stories.map((story) => ({
    uuid: story.uuid,
    name: story.content.name ?? story.name,
  }));
}
