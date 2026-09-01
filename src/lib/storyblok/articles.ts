import type { Article } from "@/lib/articles";
import type { ArticleBlock, ArticleMeta } from "@/lib/article";
import { eventDate } from "@/lib/events";
import { fetchEvents } from "@/lib/storyblok/events";
import { fetchStories, fetchStory, type Block } from "@/lib/storyblok/fetchStory";

/** Where every article lives, whichever section it shows under. */
export const JOURNAL = "journal";

type ArticleFields = {
  section?: "journal" | "news";
  title?: string;
  excerpt?: string;
  tags?: string[];
  hero?: { filename?: string };
  author?: string;
  published_at?: string;
  reading_minutes?: string;
  views?: string;
  event?: string;
  body?: Block[];
};

const LABELS = { journal: "Журнал", news: "Новости" } as const;

/** «22 сентября 2026», the way the file writes a date under a title. */
function written(value: string) {
  const { day, month } = eventDate(value);
  return day && month ? `${day} ${month} ${value.slice(0, 4)}` : "";
}

const paragraphs = (body?: string) =>
  (body ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const filenames = (images: unknown) =>
  ((images as { filename?: string }[] | undefined) ?? [])
    .map((image) => image.filename)
    .filter((filename): filename is string => Boolean(filename));

/**
 * Every article, in the shape the cards and the grids want. One list for all of
 * them: which section a piece shows under is a field, not a path, so the rows
 * and the two section pages all read the same stories and sift them.
 */
export async function fetchArticles(locale: string): Promise<Article[]> {
  const stories = await fetchStories<ArticleFields>("article");

  return stories.map(({ content, slug }) => ({
    tags: content.tags ?? [],
    title: content.title ?? "",
    excerpt: content.excerpt || undefined,
    href: `/${locale}/${JOURNAL}/${slug}`,
    image: content.hero?.filename || undefined,
    section: content.section ?? "journal",
  }));
}

/**
 * One article by its slug, with the invitation to sign up attached where the
 * story points at an event - which is a pointer at the event's own story, so the
 * card in Ближайшие события and the page cannot disagree about when it is.
 */
export async function fetchArticlePage(
  slug: string
): Promise<{ meta: ArticleMeta; blocks: ArticleBlock[] } | null> {
  const story = await fetchStory<ArticleFields>(`${JOURNAL}/${slug}`);
  if (!story) return null;

  const { content } = story;
  const section = content.section ?? "journal";

  const events = content.event ? await fetchEvents() : [];
  const event = events.find((candidate) => candidate.uuid === content.event);

  const blocks = (content.body ?? [])
    .map((blok): ArticleBlock | null => {
      switch (blok.component) {
        case "article_text":
          return {
            kind: "text",
            subtitle: (blok.subtitle as string) || undefined,
            body: paragraphs(blok.body as string),
          };
        case "article_text_image":
          return {
            kind: "text-image",
            subtitle: (blok.subtitle as string) || undefined,
            body: paragraphs(blok.body as string),
            image: (blok.image as { filename?: string })?.filename ?? "",
            caption: (blok.caption as string) || undefined,
          };
        case "article_images":
          return { kind: "images", images: filenames(blok.images) };
        case "article_quote":
          return {
            kind: "quote",
            subtitle: (blok.subtitle as string) || undefined,
            body: paragraphs(blok.body as string),
          };
        default:
          return null;
      }
    })
    .filter((blok): blok is ArticleBlock => blok !== null);

  return {
    meta: {
      section: LABELS[section],
      sectionHref: section,
      title: content.title ?? story.name,
      author: content.author ?? "",
      publishedAt: written(content.published_at ?? ""),
      views: Number(content.views) || 0,
      readingMinutes: Number(content.reading_minutes) || 0,
      heroImage: content.hero?.filename ?? "",
      tags: content.tags ?? [],
      excerpt: content.excerpt || undefined,
      event,
    },
    blocks,
  };
}
