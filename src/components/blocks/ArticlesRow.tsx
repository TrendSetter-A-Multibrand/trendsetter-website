import { NewsGrid } from "@/components/blocks/NewsGrid";
import { JournalCarousel } from "@/components/blocks/JournalCarousel";
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
}: {
  heading?: string;
  locale: string;
}) {
  const articles = await fetchArticles(locale);
  return <NewsGrid heading={heading} items={inSection(articles, "news")} />;
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
    <JournalCarousel heading={heading} items={inSection(articles, "journal")} />
  );
}
