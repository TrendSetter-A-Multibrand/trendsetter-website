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

/**
 * «22 сентября 2026», the way the file writes a date under a title. The whole
 * word here rather than the plates' three letters: this one is read as a line
 * of text and has the width of the page to do it in.
 */
function written(value: string) {
  const { day, monthFull } = eventDate(value);
  return day && monthFull ? `${day} ${monthFull} ${value.slice(0, 4)}` : "";
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


const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const asset = (value: unknown) => (value as { filename?: string } | undefined)?.filename ?? "";
const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

const RATIOS = ["auto", "square", "landscape", "portrait", "panorama"] as const;
const SIDES = ["left", "right"] as const;

/** One block of an article body as the editor filled it, in the shape the page draws. */
export function articleBlock(blok: Block): ArticleBlock | null {
  const subtitle = str(blok.subtitle) || undefined;
  const caption = str(blok.caption) || undefined;

  switch (blok.component) {
    case "article_text":
      return { kind: "text", subtitle, body: paragraphs(blok.body as string) };
    case "article_text_image":
      return {
        kind: "text-image",
        subtitle,
        body: paragraphs(blok.body as string),
        image: asset(blok.image),
        caption,
        side: pick(blok.image_side, SIDES, "right"),
        width: pick(blok.image_width, ["half", "third"] as const, "half"),
        ratio: pick(blok.image_ratio, RATIOS, "square"),
      };
    case "article_images":
      return {
        kind: "images",
        images: filenames(blok.images),
        ratio: pick(blok.ratio, RATIOS, "square"),
        caption,
      };
    case "article_quote":
      return { kind: "quote", subtitle, body: paragraphs(blok.body as string) };
    case "article_lead":
      return { kind: "lead", body: paragraphs(blok.body as string) };
    case "article_list":
      return {
        kind: "list",
        subtitle,
        ordered: blok.ordered === true || blok.ordered === "true",
        items: str(blok.items)
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };
    case "article_text_columns":
      return { kind: "text-columns", subtitle, body: paragraphs(blok.body as string) };
    case "article_pullquote":
      return {
        kind: "pullquote",
        text: str(blok.text),
        author: str(blok.author) || undefined,
      };
    case "article_divider":
      return { kind: "divider", style: pick(blok.style, ["line", "dots"] as const, "line") };
    case "article_spacer":
      return { kind: "spacer", size: pick(blok.size, ["s", "m", "l"] as const, "m") };
    case "article_photo":
      return {
        kind: "photo",
        image: asset(blok.image),
        caption,
        size: pick(blok.size, ["full", "wide", "medium", "small"] as const, "wide"),
        align: pick(blok.align, ["left", "center", "right"] as const, "center"),
        ratio: pick(blok.ratio, RATIOS, "auto"),
      };
    case "article_text_photos":
      return {
        kind: "text-photos",
        subtitle,
        body: paragraphs(blok.body as string),
        images: filenames(blok.images),
        side: pick(blok.side, SIDES, "right"),
        ratio: pick(blok.ratio, RATIOS, "square"),
      };
    case "article_photo_row":
      return {
        kind: "photo-row",
        items: ((blok.items as Block[] | undefined) ?? [])
          .map((item) => ({
            image: asset(item.image),
            caption: str(item.caption) || undefined,
          }))
          .filter((item) => item.image),
        ratio: pick(blok.ratio, RATIOS, "landscape"),
      };
    case "article_gallery_scroll":
      return {
        kind: "gallery-scroll",
        images: filenames(blok.images),
        ratio: pick(blok.ratio, RATIOS, "landscape"),
        size: pick(blok.size, ["small", "medium", "large"] as const, "medium"),
        caption,
      };
    case "article_gallery_mosaic":
      return {
        kind: "gallery-mosaic",
        images: filenames(blok.images),
        layout: pick(blok.layout, ["feature-left", "feature-right", "grid"] as const, "feature-left"),
        caption,
      };
    case "article_video":
      return { kind: "video", url: str(blok.url), caption };
    default:
      return null;
  }
}

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
    .map((blok): ArticleBlock | null => articleBlock(blok))
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
