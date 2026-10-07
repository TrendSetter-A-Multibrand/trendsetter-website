import { findEvent, type Event } from "@/lib/events";

/**
 * The article body is a sequence of blocks, which is the shape Storyblok will
 * hand us later. Each variant matches one layout in the mockup.
 */
/** The shape of a photo's box: `auto` keeps the picture's own proportions. */
export type PhotoRatio = "auto" | "square" | "landscape" | "portrait" | "panorama";
export type PhotoSide = "left" | "right";

/** A text that sits above or below a group of photos, like a text block of its own. */
export type PhotoText = {
  subtitle?: string;
  body: string[];
  position: "above" | "below";
};

export type ArticleBlock =
  | { kind: "text"; subtitle?: string; body: string[] }
  | {
      kind: "text-image";
      subtitle?: string;
      body: string[];
      image: string;
      caption?: string;
      side?: PhotoSide;
      /** `third` is the small photo: a third of the measure, the text the rest. */
      width?: "half" | "third";
      ratio?: PhotoRatio;
    }
  | { kind: "images"; images: string[]; ratio?: PhotoRatio; caption?: string; text?: PhotoText }
  /** The red band, quote marks either side of it. The file dropped the two
      running lines this replaces. */
  | { kind: "quote"; subtitle?: string; body: string[] }
  /** A large opening paragraph, bigger than the body copy. */
  | { kind: "lead"; body: string[] }
  | { kind: "list"; subtitle?: string; ordered: boolean; items: string[] }
  | { kind: "text-columns"; subtitle?: string; body: string[] }
  /** A short quote with a red rule beside it - quieter than the band. */
  | { kind: "pullquote"; text: string; author?: string }
  | { kind: "divider"; style: "line" | "dots" }
  | { kind: "spacer"; size: "s" | "m" | "l" }
  /** One photo by itself, in one of four widths and any of three places. */
  | {
      kind: "photo";
      image: string;
      caption?: string;
      size: "full" | "wide" | "medium" | "small";
      align: "left" | "center" | "right";
      ratio: PhotoRatio;
      text?: PhotoText;
    }
  /** Text on one side, a column of photos on the other. */
  | {
      kind: "text-photos";
      subtitle?: string;
      body: string[];
      images: string[];
      side: PhotoSide;
      ratio: PhotoRatio;
    }
  /** A row where every photo has its own caption. */
  | {
      kind: "photo-row";
      items: { image: string; caption?: string; title?: string; body: string[] }[];
      ratio: PhotoRatio;
      text?: PhotoText;
    }
  /** A strip that scrolls sideways, the next photo peeking in. */
  | {
      kind: "gallery-scroll";
      images: string[];
      ratio: PhotoRatio;
      size: "small" | "medium" | "large";
      caption?: string;
      text?: PhotoText;
    }
  /** One big photo with the rest beside it, or an even grid. */
  | {
      kind: "gallery-mosaic";
      images: string[];
      layout: "feature-left" | "feature-right" | "grid";
      caption?: string;
      text?: PhotoText;
    }
  | { kind: "video"; url: string; caption?: string };

export type ArticleMeta = {
  section: string;
  sectionHref: string;
  title: string;
  author: string;
  publishedAt: string;
  views: number;
  readingMinutes: number;
  heroImage: string;
  /** The tags shown as chips over the title - the card's own, not a fixed list. */
  tags: string[];
  /** Under the title on a card, and what a search engine is given to quote. */
  excerpt?: string;
  /**
   * Set only on an article that is an event. The date, the time and the title
   * come from the same entry the card in Ближайшие события is drawn from, so
   * the two cannot disagree - see lib/events.
   */
  event?: Event;
};

const LOREM =
  "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона";
const PARAGRAPH = Array.from({ length: 6 }, () => LOREM).join(" ");
const SUBTITLE = LOREM;

export const PLACEHOLDER_ARTICLE: { meta: ArticleMeta; blocks: ArticleBlock[] } = {
  meta: {
    section: "Журнал",
    sectionHref: "journal",
    title: "Какой-то заголовок статьи в три строки без описания",
    author: "Имя Фамилия (доп. поле)",
    publishedAt: "22 сентября 2026",
    views: 715,
    readingMinutes: 5,
    heroImage: "/images/home/journal/1.jpg",
    tags: ["Мода", "Тренды"],
  },
  blocks: [
    {
      kind: "text-image",
      subtitle: SUBTITLE,
      body: [PARAGRAPH],
      image: "/images/home/news/1.jpg",
      caption: "Описание к фото / подпись",
    },
    { kind: "images", images: ["/images/home/news/2.jpg", "/images/home/news/3.jpg"] },
    { kind: "text", subtitle: SUBTITLE, body: [PARAGRAPH] },
    {
      kind: "images",
      images: [
        "/images/home/news/4.jpg",
        "/images/home/journal/2.jpg",
        "/images/home/news/1.jpg",
      ],
    },
    { kind: "quote", subtitle: SUBTITLE, body: [PARAGRAPH] },
  ],
};

/**
 * The article behind a slug. Everything shares one placeholder body until
 * Storyblok is wired up; what differs is whether the slug names an event, and
 * only then does the article carry an invitation to sign up.
 */
export function articleFor(slug: string) {
  const event = findEvent(slug);
  const { meta, blocks } = PLACEHOLDER_ARTICLE;
  if (!event) return { meta, blocks };
  return {
    meta: { ...meta, title: event.title, event },
    blocks,
  };
}
