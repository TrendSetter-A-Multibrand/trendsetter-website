import type { Metadata } from "next";
import { SectionListing } from "@/components/blocks/SectionListing";
import { tagsFromParam } from "@/lib/articles";
import { seo } from "@/lib/seo";

// Same layout as the journal page - only the cover, the filters and where a
// tag leads differ. Articles still open under /journal: there is no separate
// news article route in the file yet.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return seo({
    title: "Новости",
    description:
      "Главное в новостном потоке TRENDSETTER: открытия магазинов, новые бренды и коллекции.",
    path: "/news",
    locale,
  });
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string | string[]; page?: string }>;
}) {
  const { locale } = await params;
  const { tag, page } = await searchParams;

  return <SectionListing section="news" locale={locale} tags={tagsFromParam(tag)} page={page} />;
}
