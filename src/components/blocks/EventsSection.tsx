import { EventsList } from "@/components/blocks/EventsList";
import { isPast } from "@/lib/eventsView";
import { fetchEvents } from "@/lib/storyblok/events";

/** The events the space holds, as the file's Event rows. */
export async function EventsSection({
  heading,
  locale,
}: {
  heading?: string;
  locale: string;
}) {
  const events = (await fetchEvents(locale)).filter((event) => !isPast(event));
  return <EventsList heading={heading} events={events} href={`/${locale}/events`} />;
}
