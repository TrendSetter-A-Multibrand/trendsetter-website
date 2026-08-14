import { isLocale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";
import { Hero } from "@/components/blocks/Hero";
import { NewsGrid } from "@/components/blocks/NewsGrid";
import { EventsCarousel } from "@/components/blocks/EventsCarousel";
import { JournalCarousel } from "@/components/blocks/JournalCarousel";
import { StoreLocator } from "@/components/blocks/StoreLocator";
import { NewsletterSignup } from "@/components/blocks/NewsletterSignup";

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
      {/* The block itself carries no vertical padding: the Магазины page needs
          it flush under the breadcrumbs */}
      <div className="pt-10">
        <StoreLocator heading="Магазины" />
      </div>
      {/* The red band runs to the page edges, so the 40 has to sit outside it */}
      <div className="mt-10">
        <NewsletterSignup locale={locale} />
      </div>
    </>
  );
}
