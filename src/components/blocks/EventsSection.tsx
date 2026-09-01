import { EventsCarousel } from "@/components/blocks/EventsCarousel";
import { fetchEvents } from "@/lib/storyblok/events";

/**
 * The events the space holds, drawn by the same row as before. The row walks
 * along by itself, so with fewer events than fit it has nothing to walk - which
 * is fine, and with none it draws only its heading.
 */
export async function EventsSection({ heading }: { heading?: string }) {
  const events = await fetchEvents();
  return <EventsCarousel heading={heading} items={events} />;
}
