import { NewsGrid } from "@/components/blocks/NewsGrid";
import { JournalSection } from "@/components/blocks/EditorialGrid";
import { fetchArticles } from "@/lib/storyblok/articles";
import { inSection } from "@/lib/articles";

/**
 * The two rows on the home page. Both read the same articles and take the ones
 * marked for their section, so moving a piece from Новости to Журнал is a field
 * on the piece rather than two lists to keep apart.
 */
export async function NewsRow({
  heading,
  locale,
  underHero,
}: {
  heading?: string;
  locale: string;
  underHero?: boolean;
}) {
  const articles = await fetchArticles(locale);
  return (
    <NewsGrid
      heading={heading}
      items={inSection(articles, "news")}
      underHero={underHero}
    />
  );
}

export async function JournalRow({
  heading,
  locale,
}: {
  heading?: string;
  locale: string;
}) {
  const articles = await fetchArticles(locale);
  return (
    <JournalSection
      heading={heading}
      articles={inSection(articles, "journal")}
      locale={locale}
    />
  );
}
