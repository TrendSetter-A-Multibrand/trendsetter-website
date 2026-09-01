import { NotFoundHero } from "@/components/blocks/NotFoundHero";
import { NewsRow } from "@/components/blocks/ArticlesRow";
import { defaultLocale } from "@/lib/i18n/locales";

/**
 * Renders inside the locale layout, so it keeps the header and footer. Next hands
 * a not-found page no params, so the links in the row are built for the default
 * market - which is where a reader who mistyped a path ends up anyway.
 */
export default function NotFound() {
  return (
    <>
      <NotFoundHero />
      {/* The home page ends on the newsletter, which sits flush on the footer.
          Here the row is last, so it has to carry the air itself. */}
      <div className="pb-16">
        <NewsRow locale={defaultLocale} />
      </div>
    </>
  );
}
