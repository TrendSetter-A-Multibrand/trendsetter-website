import type { Locale } from "@/lib/i18n/locales";
import { getSiteSettings } from "@/lib/siteSettings";
import { slidesFromContent, type HeroSlide } from "@/lib/heroSlides";
import { isPast } from "@/lib/eventsView";
import { newestFirst } from "@/lib/articles";
import { fetchArticles } from "@/lib/storyblok/articles";
import { fetchEvents } from "@/lib/storyblok/events";
import { HeroSlider } from "@/components/blocks/HeroSlider";

type HeroProps = {
  locale: Locale;
  tagline?: string;
  /** A sentence under the headline. */
  lead?: string;
  /** The categories in brackets above it, one per entry. */
  descriptor?: string[];
  /** The red button. */
  primaryCta?: { label: string; href: string };
  /** The underlined link beside it. */
  secondaryCta?: { label: string; href: string };
  imageSrc?: string;
  /** The screens after the first; the file's own when the editor has written none. */
  slides?: HeroSlide[];
  /** The editor has no further slides yet: one screen, nothing of the file's sample after it. */
  onlyFirst?: boolean;
};

/**
 * What the screens after the first show when the editor has written none: the
 * newest news item, the newest journal piece and the nearest event, each leading
 * to its own page.
 */
async function slidesFromSite(locale: Locale): Promise<HeroSlide[]> {
  const [articles, events] = await Promise.all([fetchArticles(locale), fetchEvents(locale)]);
  const newest = newestFirst(articles);
  const nearest = events
    .filter((event) => !isPast(event))
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  return slidesFromContent({
    news: newest.find((article) => article.section === "news"),
    journal: newest.find((article) => article.section !== "news"),
    event: nearest,
  });
}

/**
 * The headline was written in capitals for the old design. The new one sets it in
 * sentence case, so a line typed wholly in capitals is brought down to one.
 */
function sentenceCase(text: string) {
  if (text !== text.toUpperCase() || text === text.toLowerCase()) return text;
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

const DESCRIPTOR = ["Одежда", "Дом", "Еда", "Мастерская", "Ателье"];

/**
 * The file's Home hero, a slider of four screens (see `HeroSlider`). The first
 * is the block's own fields - the brand's line, «Найти магазин» and «О нас» -
 * the rest are `slides`, or - while the editor has written none - the newest
 * news item, the newest journal piece and the nearest event. The social links on the photo are the settings' own.
 */
export async function Hero({
  locale,
  tagline = "Доверьте поиск нам, а выбор — себе",
  lead = "Отбираем одежду, вещи для дома и косметику известных брендов — и привозим их в магазины рядом с вами.",
  descriptor = DESCRIPTOR,
  primaryCta = { label: "Найти магазин", href: `/${locale}/stores` },
  secondaryCta = { label: "О нас", href: `/${locale}/company/about` },
  imageSrc = "/images/home/hero.jpg",
  slides,
  onlyFirst = false,
}: HeroProps) {
  const { socials } = await getSiteSettings();
  const first: HeroSlide = {
    title: sentenceCase(tagline),
    lead,
    primary: primaryCta,
    secondary: secondaryCta,
    image: imageSrc,
  };
  const rest = onlyFirst ? [] : slides?.length ? slides : await slidesFromSite(locale);

  return (
    <HeroSlider
      slides={[first, ...rest]}
      tags={descriptor}
      socials={socials.map(({ label, href }) => ({ label, href }))}
    />
  );
}
