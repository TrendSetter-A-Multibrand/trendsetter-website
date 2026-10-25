import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ArticleBody } from "@/components/blocks/ArticleBody";
import { EventAside } from "@/components/blocks/EventAside";
import { EventsList } from "@/components/blocks/EventsList";
import { HowToGetThere } from "@/components/blocks/HowToGetThere";
import { isLocale } from "@/lib/i18n/locales";
import { isPast } from "@/lib/eventsView";
import { fetchArticlePage } from "@/lib/storyblok/articles";
import { fetchEvents } from "@/lib/storyblok/events";
import { seo } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await fetchArticlePage(slug, locale);
  if (!page?.meta.event) return {};
  return seo({
    title: page.meta.title,
    description: page.meta.excerpt,
    image: page.meta.heroImage,
    path: `/events/${slug}`,
    locale,
  });
}

/**
 * An event's own page: the kind of event, the title and the lead over a 16:10
 * photo, the text under it and the place to get to, and beside them in the right
 * column the facts and the actions. Under it the other coming events as rows.
 */
export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [page, events] = await Promise.all([fetchArticlePage(slug, locale), fetchEvents(locale)]);
  // Only an event has a page here; an article lives under the journal
  if (!page?.meta.event) notFound();

  const { meta, blocks } = page;
  const event = meta.event!;
  const others = events.filter((other) => other.uuid !== event.uuid && !isPast(other)).slice(0, 4);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: `/${locale}` },
          { label: "События", href: `/${locale}/events` },
          { label: event.title },
        ]}
      />

      <div className="grid gap-x-6 gap-y-8 px-4 pb-16 pt-6 lg:grid-cols-12 lg:px-10 lg:pb-32 lg:pt-16">
        <div className="flex flex-col gap-6 lg:col-span-8 lg:row-start-1 lg:gap-8">
          <header className="flex flex-col gap-3 lg:gap-4">
            <p className="type-label text-ink">[{meta.tags[0] ?? "Событие"}]</p>
            <h1 className="type-h1 text-ink">{event.title}</h1>
            {meta.excerpt && <p className="type-body-l max-w-[560px] text-ink">{meta.excerpt}</p>}
          </header>

          <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface lg:aspect-[16/10]">
            <ImagePlaceholder />
            {meta.heroImage && (
              <Image
                src={meta.heroImage}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 898px, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:pt-0">
          <EventAside event={event} locale={locale} url={`${siteUrl}/${locale}/events/${slug}`} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8 lg:row-start-2 lg:gap-8">
          <ArticleBody blocks={blocks} locale={locale} flow />
          {event.location && <HowToGetThere place={event.location} />}
        </div>
      </div>

      <EventsList heading="События" events={others} limit={4} href={`/${locale}/events`} />
    </>
  );
}
