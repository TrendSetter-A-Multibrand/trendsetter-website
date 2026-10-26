import { EventRow } from "@/components/cards/EventRow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { eventDate, type Event } from "@/lib/events";
import { isPast, whenShort } from "@/lib/eventsView";

/**
 * "События" on a page: the file's Event rows under a section head, at most
 * three, a thin rule between them. An event whose day has gone is drawn at 60%.
 * With none, the heading goes too.
 */
export function EventsList({
  heading = "События",
  events,
  limit = 3,
  href,
}: {
  heading?: string;
  events: Event[];
  limit?: number;
  /** Where "Смотреть все" leads; no link without it. */
  href?: string;
}) {
  if (events.length === 0) return null;
  return (
    <section className="px-4 pt-16 md:px-10 md:pt-32">
      <SectionTitle heading={heading} href={href} />
      <div className="divide-y divide-line">
        {events.slice(0, limit).map((event) => (
          <EventRow
            key={event.uuid}
            href={event.href}
            day={event.day}
            month={eventDate(event.date).monthFull || event.month}
            when={whenShort(event)}
            title={event.title}
            text={event.description}
            place={event.location}
            image={event.image}
            past={isPast(event)}
          />
        ))}
      </div>
    </section>
  );
}
