import { isLocale } from "@/lib/i18n/locales";
import { calendarFile } from "@/lib/eventsView";
import { fetchArticlePage } from "@/lib/storyblok/articles";
import { siteUrl } from "@/lib/site";

/**
 * The event as a calendar file at an address of its own, not a file made in the
 * browser: Safari on an iPhone or a Mac opens text/calendar from a link as
 * "Добавить в календарь" instead of saving it to Downloads.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });

  const event = (await fetchArticlePage(slug, locale))?.meta.event;
  if (!event) return new Response("Not found", { status: 404 });

  return new Response(calendarFile(event, `${siteUrl}/${locale}/events/${slug}`), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${slug}.ics"`,
    },
  });
}
