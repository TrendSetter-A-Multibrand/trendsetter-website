import { EventRow } from "@/components/cards/EventRow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Event } from "@/lib/events";

const WEEKDAYS = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];

/** "суббота, 12:00" from the editor's "2026-07-27 18:00", a wall clock with no zone. */
function when(event: Event) {
  const [day] = event.date.split(" ");
  const at = new Date(`${day}T12:00:00`);
  const weekday = Number.isNaN(at.getTime()) ? "" : WEEKDAYS[at.getDay()];
  return [weekday, event.time].filter(Boolean).join(", ");
}

/** Today as "2026-07-27", for telling a past event from one to come. */
const today = () => new Date().toISOString().slice(0, 10);

/**
 * "События" on a page: the file's Event rows under a section head, at most
 * three, a thin rule between them. An event whose day has gone is drawn at 60%.
 * With none, the heading goes too.
 */
export function EventsList({
  heading = "События",
  events,
  limit = 3,
}: {
  heading?: string;
  events: Event[];
  limit?: number;
}) {
  if (events.length === 0) return null;
  const now = today();
  return (
    <section className="px-4 pt-16 md:px-10 md:pt-32">
      <SectionTitle heading={heading} className="mb-2" />
      <div className="divide-y divide-line">
        {events.slice(0, limit).map((event) => (
          <EventRow
            key={event.uuid}
            href={event.href}
            day={event.day}
            month={event.month}
            when={when(event)}
            title={event.title}
            text={event.description}
            place={event.location}
            image={event.image}
            past={event.date.slice(0, 10) < now}
          />
        ))}
      </div>
    </section>
  );
}
