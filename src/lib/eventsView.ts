import { eventDate, EVENT_TZ, type Event } from "@/lib/events";

/* What the events pages read off an event beyond the plain fields: the weekday,
   the months a list is grouped under, how far away it is, and the two links a
   page offers - the calendar file and the map. The editor's date is a wall clock
   in Moscow with no zone ("2026-07-27 18:00"), so everything here is done on the
   text of it, never through a Date in the reader's zone. */

const WEEKDAYS = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];

const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

/** The day as a number of days since 1970, in no zone at all: only for comparing and counting. */
const dayNumber = (date: string) => {
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  return Math.floor(Date.UTC(y, (m || 1) - 1, d || 1) / 86_400_000);
};

/** "суббота" for "2026-07-27 18:00"; empty for a date that cannot be read. */
export function weekdayOf(date: string) {
  const day = dayNumber(date);
  return Number.isNaN(day) ? "" : WEEKDAYS[(new Date(day * 86_400_000).getUTCDay())];
}

/** "суббота, 18:00" - the line over an event's title in a row. */
export function whenShort(event: Pick<Event, "date" | "time">) {
  return [weekdayOf(event.date), event.time].filter(Boolean).join(", ");
}

/** "24 октября, суббота · 18:00" - the long form for the facts. */
export function whenLong(event: Pick<Event, "date" | "time">) {
  const { day, monthFull } = eventDate(event.date);
  const head = [`${day} ${monthFull}`, weekdayOf(event.date)].filter(Boolean).join(", ");
  return [head, event.time].filter(Boolean).join(" · ");
}

/** Today as "2026-07-27" in Moscow, for telling what has passed. */
export function todayInZone(now: Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: EVENT_TZ }).format(now);
}

/** An event whose day is before today. A date with no day is not past. */
export const isPast = (event: Pick<Event, "date">, now?: Date) =>
  event.date.length >= 10 && event.date.slice(0, 10) < todayInZone(now);

/** "[Октябрь 2026]"-style key and label for the month an event falls in. */
export function monthOf(date: string) {
  const [year, month] = date.split("-");
  const index = Number(month) - 1;
  return {
    key: `${year}-${month}`,
    label: `${MONTHS_NOMINATIVE[index] ?? ""} ${year}`.trim(),
  };
}

/** Events grouped by month, in the order they come. */
export function groupByMonth(events: Event[]) {
  const groups: { key: string; label: string; events: Event[] }[] = [];
  for (const event of events) {
    const { key, label } = monthOf(event.date);
    const last = groups[groups.length - 1];
    if (last?.key === key) last.events.push(event);
    else groups.push({ key, label, events: [event] });
  }
  return groups;
}

/** "через 5 дней", "завтра", "сегодня" - the red words in the widget. */
export function daysUntil(event: Pick<Event, "date">, now?: Date) {
  const diff = dayNumber(event.date) - dayNumber(todayInZone(now));
  if (Number.isNaN(diff) || diff < 0) return "";
  if (diff === 0) return "сегодня";
  if (diff === 1) return "завтра";
  const last = diff % 10;
  const teen = diff % 100 >= 11 && diff % 100 <= 14;
  const word = !teen && last === 1 ? "день" : !teen && last >= 2 && last <= 4 ? "дня" : "дней";
  return `через ${diff} ${word}`;
}

/**
 * The event as a calendar file. It carries only what the page knows: the start,
 * an hour's length (the editor does not give an end), the title and the place.
 * The start goes in UTC - Moscow is +03:00 all year - because a zone named
 * without its VTIMEZONE block is read differently from one calendar to another.
 */
export function calendarFile(event: Event, url: string) {
  const clock = wallClock(event);
  const start = clock
    ? `${new Date(Date.parse(isoMoscow(clock.start))).toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`
    : "";
  const escape = (text: string) => text.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TRENDSETTER//events//RU",
    "BEGIN:VEVENT",
    `UID:${event.uuid}@trendsetter`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    start ? `DTSTART:${start}` : `DTSTART;VALUE=DATE:${event.date.slice(0, 10).replace(/-/g, "")}`,
    "DURATION:PT1H",
    `SUMMARY:${escape(event.title)}`,
    event.location ? `LOCATION:${escape(event.location)}` : "",
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

/** The start and an hour later as Moscow wall clocks, "20261029T160000"; null without a time. */
function wallClock(event: Pick<Event, "date">) {
  const match = event.date.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!match) return null;
  const [, y, mo, d, h, mi] = match.map(Number);
  const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").slice(0, 15);
  const start = Date.UTC(y, mo - 1, d, h, mi);
  return { start: stamp(start), end: stamp(start + 3_600_000) };
}

/** "2026-10-29T16:00:00+03:00" from "20261029T160000" - Moscow keeps +03:00 all year. */
const isoMoscow = (clock: string) =>
  `${clock.slice(0, 4)}-${clock.slice(4, 6)}-${clock.slice(6, 8)}T${clock.slice(9, 11)}:${clock.slice(11, 13)}:00+03:00`;

/**
 * Links that open the event, filled in, in the reader's own calendar: Google's and
 * Outlook's web forms, and the calendar file served from the site, which an
 * iPhone or a Mac offers to add straight away. Empty without a time.
 */
export function calendarLinks(
  event: Pick<Event, "date" | "title" | "location">,
  { url, file }: { url: string; file: string },
) {
  const clock = wallClock(event);
  if (!clock) return [];
  const google = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${clock.start}/${clock.end}`,
    ctz: EVENT_TZ,
    location: event.location ?? "",
    details: url,
  });
  const outlook = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: isoMoscow(clock.start),
    enddt: isoMoscow(clock.end),
    location: event.location ?? "",
    body: url,
  });
  return [
    { label: "Google Календарь", href: `https://calendar.google.com/calendar/render?${google}` },
    { label: "Apple Календарь", href: file },
    { label: "Outlook", href: `https://outlook.live.com/calendar/0/action/compose?${outlook}` },
    { label: "Другой календарь (.ics)", href: file, download: true },
  ];
}

/** A search on Yandex Maps for the place; the editor gives a name, not coordinates. */
export const routeUrl = (place: string) =>
  `https://yandex.ru/maps/?text=${encodeURIComponent(place)}&mode=search`;
