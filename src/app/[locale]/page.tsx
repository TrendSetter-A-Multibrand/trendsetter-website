import { isLocale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";
import { Hero } from "@/components/blocks/Hero";
import { NewsGrid } from "@/components/blocks/NewsGrid";
import { EventsCarousel } from "@/components/blocks/EventsCarousel";
import { JournalCarousel } from "@/components/blocks/JournalCarousel";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Hero locale={locale} />
      <NewsGrid />
      <EventsCarousel />
      <JournalCarousel />
    </>
  );
}
