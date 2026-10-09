import { storyblokFetch, StoryblokError } from "@/lib/storyblok/client";

export type EventCapacity = {
  /** Total seats the editor set; null when none is set (no limit). */
  seats: number | null;
  signupEnabled: boolean;
  /** As the editor wrote it (ISO-like string), "" when absent. */
  date: string;
  title: string;
};

type Node = Record<string, unknown>;

/** The first placement_event block anywhere in the article's content. */
function findPlacement(node: unknown): Node | null {
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = findPlacement(item);
      if (hit) return hit;
    }
  } else if (node && typeof node === "object") {
    const n = node as Node;
    if (n.component === "placement_event") return n;
    for (const value of Object.values(n)) {
      const hit = findPlacement(value);
      if (hit) return hit;
    }
  }
  return null;
}

const text = (v: unknown) => (typeof v === "string" ? v : "");

/** Pure part, for tests: a story as Storyblok gives it -> what sign-up needs. */
export function readCapacity(story: {
  name?: string;
  content?: unknown;
}): EventCapacity | null {
  const block = findPlacement(story.content);
  if (!block) return null;
  const content = (story.content ?? {}) as Node;

  const seats = Number(text(block.seats) || block.seats);
  const flag = block.signup_enabled;
  return {
    seats: Number.isFinite(seats) && block.seats !== "" && block.seats != null
      ? Math.max(0, Math.floor(seats))
      : null,
    // Absent flag = on; only an explicit off (false / "false") closes sign-up.
    signupEnabled: !(flag === false || flag === "false"),
    date: text(block.date) || text(content.date),
    title:
      text(block.card_title) ||
      text(content.title) ||
      text(story.name),
  };
}

/**
 * Read fresh (never from cache): the seat count and the on/off switch must be
 * what the editor has now. By uuid; null when there is no such story or it has
 * no placement_event block.
 */
export async function fetchEventCapacity(
  uuid: string,
): Promise<EventCapacity | null> {
  try {
    const { story } = await storyblokFetch<{
      story: { name?: string; content?: unknown };
    }>(`stories/${encodeURIComponent(uuid)}`, {
      query: { find_by: "uuid" },
      fresh: true,
    });
    return readCapacity(story);
  } catch (error) {
    if (error instanceof StoryblokError && error.status === 404) return null;
    throw error;
  }
}
