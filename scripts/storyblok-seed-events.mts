/**
 * The four events, taken from src/lib/events.ts. A date and a time go in as one
 * field - the editor picks them from a calendar rather than typing a day, a
 * month and an hour into three boxes, and the badges on the card are worked out
 * from it.
 *
 * npm run storyblok:seed-events
 */
import { EVENTS } from "../src/lib/events.ts";
import { folder, putStory } from "./mapi.mjs";

/** The mock writes the month short; a date needs its number. */
const MONTHS: Record<string, string> = {
  янв: "01", фев: "02", мар: "03", апр: "04", май: "05", июн: "06",
  июл: "07", авг: "08", сен: "09", окт: "10", ноя: "11", дек: "12",
};

/** No year in the mock, and the mockup is drawn for the coming season. */
const YEAR = "2026";

const parent = await folder("events", "Мероприятия");

for (const event of EVENTS) {
  const month = MONTHS[event.month.slice(0, 3)] ?? "01";
  const day = event.day.padStart(2, "0");

  const done = await putStory(
    event.slug,
    event.title,
    {
      component: "event",
      title: event.title,
      location: event.location,
      date: `${YEAR}-${month}-${day} ${event.time}`,
      description: event.description ?? "",
      cta_label: event.ctaLabel,
      // A path from the repository, as with the shops and the brands
      image: { filename: event.image ?? "" },
    },
    parent,
    `events/${event.slug}`
  );
  console.log(`${done}  events/${event.slug}  ${YEAR}-${month}-${day} ${event.time}  «${event.title}»`);
}
