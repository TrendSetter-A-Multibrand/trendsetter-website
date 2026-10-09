/**
 * One entry per event. The card in the Ближайшие события row and the article it
 * opens are two views of the same thing, which is why the date, the time and
 * the invitation live here and not in either of them - so a card and its
 * article cannot end up disagreeing about when the thing happens.
 */
export type Event = {
  /** The article the event is: the card and the page are one record. */
  uuid: string;
  slug: string;
  /** Where the card leads - the article's own page. */
  href: string;
  /** As the editor typed it, "2026-07-27 18:00": a wall clock with no zone. */
  date: string;
  /** The editor's «ВСЕГО мест»; absent means no limit and no counter. */
  seats?: number;
  signupEnabled: boolean;
  /** Keys of the Пространство sections the event is shown under. */
  spaceSections: string[];
  day: string;
  month: string;
  time: string;
  title: string;
  location: string;
  description?: string;
  ctaLabel: string;
  image?: string;
};

const STATIC_EVENTS: Pick<
  Event,
  "slug" | "day" | "month" | "time" | "title" | "location" | "description" | "ctaLabel" | "image"
>[] = [
  {
    slug: "master-class-ceramics",
    day: "27",
    month: "июл",
    time: "18:00",
    title: "Мастер-класс",
    location: 'ТЦ "Атриум"',
    description: "Мастер-класс по лепке от известного керамиста Юрия Базанова.",
    ctaLabel: "Подробнее",
    image: "/images/home/events/1.jpg",
  },
  {
    slug: "book-club",
    day: "3",
    month: "авг",
    time: "19:00",
    title: "Встреча книжного клуба",
    location: "Дубровка",
    description: "Обсуждаем новинки нон-фикшна вместе с гостями магазина.",
    ctaLabel: "Подробнее",
    image: "/images/home/events/2.jpg",
  },
  {
    slug: "capsule-show",
    day: "10",
    month: "авг",
    time: "17:30",
    title: "Показ капсульной коллекции",
    location: 'ТЦ "Атриум"',
    description: "Первыми увидите новую капсулу до старта продаж.",
    ctaLabel: "Подробнее",
    image: "/images/home/events/3.jpg",
  },
  {
    slug: "styling-workshop",
    day: "16",
    month: "авг",
    time: "12:00",
    title: "Воркшоп по стайлингу",
    location: "Хлебозавод №9",
    description: "Разбираем базовый гардероб с личным стилистом.",
    ctaLabel: "Подробнее",
    image: "/images/home/events/4.jpg",
  },
];

const STATIC_DATES: Record<string, string> = {
  "master-class-ceramics": "2026-07-27 18:00",
  "book-club": "2026-08-03 19:00",
  "capsule-show": "2026-08-10 17:30",
  "styling-workshop": "2026-08-16 12:00",
};

export const EVENTS: Event[] = STATIC_EVENTS.map((event) => ({
  ...event,
  uuid: event.slug,
  href: `/ru/journal/${event.slug}`,
  date: STATIC_DATES[event.slug] ?? "",
  signupEnabled: true,
  spaceSections: [],
}));

export const findEvent = (slug: string) =>
  EVENTS.find((event) => event.slug === slug);

/**
 * How the badges read the date: the day large, the month small under it in the
 * genitive, the hour over the minute.
 *
 * Two lists, because the same month is written two ways. The plate is 64 square
 * with 12 of padding, so the month has 40 to live in at 10px with 3 of tracking
 * - about four letters. «сентября» wants some seventy and ran out of the plate
 * on both sides; the file draws «июля», which is short enough to have hidden
 * that. So the plates take three letters and prose takes the whole word.
 *
 * Written out rather than left to Intl either way: Intl's own name for the
 * month is «июль», and a date needs «июля», which is a different word.
 */
const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/** The same twelve as the plates wear them: three letters, no full stop. */
const MONTHS_SHORT = [
  "янв", "фев", "мар", "апр", "мая", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

/**
 * Storyblok keeps a date and time as "2026-07-27 18:00" - the wall clock the
 * editor typed, with no zone on it. Read as text rather than through Date, which
 * would take it for UTC and could move the day for a reader in another country.
 */
export function eventDate(value: string) {
  const [date = "", time = ""] = value.split(" ");
  const [, month = "", day = ""] = date.split("-");
  const index = Number(month) - 1;
  return {
    day: String(Number(day) || ""),
    /** For the plates on a card, which have room for no more. */
    month: MONTHS_SHORT[index] ?? "",
    /** For a date read as a sentence: «22 сентября 2026». */
    monthFull: MONTHS[index] ?? "",
    time: time.slice(0, 5),
  };
}

/** The zone the editor's wall clock is read in: the space is in Moscow. */
export const EVENT_TZ = "Europe/Moscow";

/**
 * The moment as a wall clock in EVENT_TZ, "2026-07-27 18:00" - the same shape
 * the editor's date has, so the two compare as text with no zone arithmetic.
 */
function wallClock(moment: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: EVENT_TZ,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(moment)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

/** An event whose start has not come yet, by Moscow time. No date, no event. */
export function isUpcoming(event: Pick<Event, "date">, now: Date = new Date()) {
  const start = event.date.replace("T", " ").slice(0, 16);
  return start !== "" && start > wallClock(now);
}

/** What the editor filled in an article's «Ближайшие события» placement. */
export type EventPlacement = {
  date: string;
  location: string;
  cardTitle: string;
  cardImage?: string;
  cardDescription?: string;
  ctaLabel: string;
  signupEnabled: boolean;
  seats?: number;
};

/** The event an article is, in the shape the cards and the page want. */
export function eventFromPlacement(
  article: { uuid: string; slug: string },
  placement: EventPlacement & { spaceSections?: string[] },
  locale: string,
): Event {
  const { day, month, time } = eventDate(placement.date);
  return {
    uuid: article.uuid,
    slug: article.slug,
    href: `/${locale}/journal/${article.slug}`,
    date: placement.date,
    seats: placement.seats,
    signupEnabled: placement.signupEnabled,
    spaceSections: placement.spaceSections ?? [],
    day,
    month,
    time,
    title: placement.cardTitle,
    location: placement.location,
    description: placement.cardDescription,
    ctaLabel: placement.ctaLabel,
    image: placement.cardImage,
  };
}
