import { draftMode } from "next/headers";
import { storyblokFetch, StoryblokError, storyTag } from "@/lib/storyblok/client";

/**
 * A block as the editor left it. Every block carries the name of its own type
 * and an id of its own; what else is in there is the block's business, so the
 * registry that renders it is the one that knows the shape.
 */
export type Block = {
  _uid: string;
  component: string;
  [field: string]: unknown;
};

export type Story<T = Block> = {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: T;
  published_at: string | null;
};

/**
 * One story by its path. Returns null where there is nothing at that path, so a
 * page can call notFound() itself rather than catch.
 *
 * Which version comes back is not this function's choice: with draft mode on -
 * that is, arriving from the editor through /api/preview - it reads what is
 * being written, and otherwise what has been published.
 */
export async function fetchStory<T = Block>(
  slug: string
): Promise<Story<T> | null> {
  const { isEnabled: draft } = await draftMode();

  try {
    const { story } = await storyblokFetch<{ story: Story<T> }>(
      `stories/${slug}`,
      { draft, tags: [storyTag(slug)] }
    );
    return story;
  } catch (error) {
    if (error instanceof StoryblokError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Every story of one kind, in the order the space lists them. Used by the blocks
 * that show a list of something rather than a page of their own - the shops, and
 * the articles and events after them.
 *
 * A hundred is well past anything this site holds; if a list ever outgrows it,
 * that is the moment to page through rather than to raise the number.
 */
export async function fetchStories<T = Block>(
  contentType: string
): Promise<Story<T>[]> {
  const { isEnabled: draft } = await draftMode();

  const { stories } = await storyblokFetch<{ stories: Story<T>[] }>("stories", {
    query: { content_type: contentType, per_page: 100 },
    tags: [`storyblok:${contentType}`],
    draft,
  });

  return stories;
}
