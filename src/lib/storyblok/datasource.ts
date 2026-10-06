import { storyblokFetch } from "@/lib/storyblok/client";

type Entry = { name: string; value: string };

/**
 * The values of one datasource - a list the editor keeps in Settings →
 * Datasources and a field can offer as its choices. Returns `fallback` when the
 * datasource is empty or cannot be read, so a filter built on it never comes up
 * blank because of a slow answer.
 *
 * Entries are not versioned the way stories are, so there is nothing to draft:
 * what is saved is what is read.
 */
export async function fetchDatasource(
  slug: string,
  fallback: string[] = []
): Promise<string[]> {
  try {
    const { datasource_entries: entries } = await storyblokFetch<{
      datasource_entries: Entry[];
    }>("datasource_entries", {
      query: { datasource: slug, per_page: 1000 },
      tags: [`storyblok:datasource:${slug}`],
    });
    return entries.length ? entries.map((entry) => entry.value) : fallback;
  } catch {
    return fallback;
  }
}
