import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EventsWidget } from "@/components/blocks/EventsWidget";
import { EventsBoard } from "@/components/blocks/EventsBoard";
import { isLocale } from "@/lib/i18n/locales";
import { isPast } from "@/lib/eventsView";
import { fetchEvents } from "@/lib/storyblok/events";
import { seo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return seo({
    title: "События",
    description: "Мастер-классы, встречи и показы в магазинах TRENDSETTER: когда, где и как записаться.",
    path: "/events",
    locale,
  });
}

/**
 * The events page: the crumbs, the widget with the nearest events, and the whole
 * list below it - coming ones by month, the ones already gone behind a line.
 */
export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const events = await fetchEvents(locale);
  const nearest = events.filter((event) => !isPast(event)).slice(0, 5);

  return (
    <>
      <Breadcrumbs items={[{ label: "Главная", href: `/${locale}` }, { label: "События" }]} />
      <EventsWidget events={nearest} />
      <div className="pb-32">
        <EventsBoard events={events} />
      </div>
    </>
  );
}
