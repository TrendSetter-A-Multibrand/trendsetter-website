import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { EventsBoard } from "@/components/blocks/EventsBoard";
import { isLocale } from "@/lib/i18n/locales";
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
 * The events page: the crumbs, the section header (the widget with the nearest
 * events moved to the news page), and the whole list below it - coming ones by month, the ones already gone behind a line.
 */
export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const events = await fetchEvents(locale);

  return (
    <>
      <Breadcrumbs items={[{ label: "Главная", href: `/${locale}` }, { label: "События" }]} />
      <PageCover
        title="События"
        subtitle="Мастер-классы, встречи со стилистом, лекции и маркеты в магазинах и мастерской"
      />
      <div className="pb-32">
        <EventsBoard events={events} />
      </div>
    </>
  );
}
