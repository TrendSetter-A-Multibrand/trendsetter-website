import type { Locale } from "@/lib/i18n/locales";

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

/**
 * The file's slides 2-4 (Hero slider, 05.11): the opening of «Авеню Север», the
 * journal's lead piece and the nearest event. The words and pictures are the
 * file's own sample, until the editor writes slides in the hero block.
 */
export function defaultSlides(locale: Locale): HeroSlide[] {
  return [
    {
      tag: "Скоро открытие",
      title: "Скоро открытие в ТРЦ «Авеню Север»",
      lead: "Новый магазин TRENDSETTER — Коровинское шоссе, 2. Дату открытия сообщим дополнительно.",
      primary: { label: "Читать новость", href: `/${locale}/news` },
      image: "/images/home/hero-2.jpg",
    },
    {
      tag: "Журнал",
      title: "Медленный дом: керамика, лён и вещи, которые хочется трогать",
      lead: "Собрали предметы для дома, которые не устаревают за сезон, — и рассказали, как сочетать их без дизайнера.",
      primary: { label: "Читать", href: `/${locale}/journal` },
      image: "/images/home/hero-3.jpg",
    },
    {
      tag: "Ближайшее событие",
      title: "Мастер-класс по керамике",
      lead: "24 октября, суббота · 18:00 · ТЦ «Атриум». Лепим пиалы вместе с керамистом. Материалы и обжиг — на месте.",
      primary: { label: "Записаться", href: `/${locale}/events` },
      image: "/images/home/hero-4.jpg",
    },
  ];
}

/** Long headlines (the journal's) are set smaller on a desktop: 64 in the file against 96. */
export const isLongTitle = (title: string) => title.length > 40;
