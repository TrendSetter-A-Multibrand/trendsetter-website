import type { Article } from "@/lib/articles";
import type { Event } from "@/lib/events";

/** One screen of the home slider. The first screen is the hero's own fields; the rest are these. */
export type HeroSlide = {
  /** Replaces the first of the categories in brackets above the headline, e.g. «Скоро открытие». */
  tag?: string;
  title: string;
  lead: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  image: string;
};

/** Long headlines (the journal's) are set smaller on a desktop: 64 in the file against 96. */
export const isLongTitle = (title: string) => title.length > 40;

const FALLBACK_IMAGES = ["/images/home/hero-2.jpg", "/images/home/hero-3.jpg", "/images/home/hero-4.jpg"];

/**
 * The screens after the first, made from what the site actually holds: the
 * newest news item, the newest piece of the journal and the nearest event, each
 * leading to its own page and not to the list it belongs to. A kind with nothing
 * in it leaves its screen out, so a site with no events shows no empty one.
 * Written slides in the hero block take the place of all this.
 */
export function slidesFromContent({
  news,
  journal,
  event,
}: {
  /** Newest first. */
  news?: Article;
  journal?: Article;
  event?: Event;
}): HeroSlide[] {
  const slides: HeroSlide[] = [];

  if (news?.href) {
    slides.push({
      tag: "Новости",
      title: news.title,
      lead: news.excerpt ?? "",
      primary: { label: "Читать новость", href: news.href },
      image: news.image ?? FALLBACK_IMAGES[0],
    });
  }
  if (journal?.href) {
    slides.push({
      tag: "Журнал",
      title: journal.title,
      lead: journal.excerpt ?? "",
      primary: { label: "Читать статью", href: journal.href },
      image: journal.image ?? FALLBACK_IMAGES[1],
    });
  }
  if (event) {
    const when = [`${event.day} ${event.month}`, event.time, event.location]
      .filter(Boolean)
      .join(" · ");
    slides.push({
      tag: "Ближайшее событие",
      title: event.title,
      lead: [when, event.description].filter(Boolean).join(". "),
      primary: { label: event.ctaLabel || "Подробнее", href: event.href },
      image: event.image ?? FALLBACK_IMAGES[2],
    });
  }
  return slides;
}
