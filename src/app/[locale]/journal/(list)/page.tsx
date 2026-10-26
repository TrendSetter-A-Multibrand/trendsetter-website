import type { Metadata } from "next";
import { SectionListing } from "@/components/blocks/SectionListing";
import { tagsFromParam } from "@/lib/articles";
import { seo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return seo({
    title: "Журнал",
    description:
      "Разбираемся, сравниваем, считаем: тексты о моде, красоте, доме и людях от редакции TRENDSETTER.",
    path: "/journal",
    locale,
  });
}

export default async function JournalPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string | string[]; page?: string }>;
}) {
  const { locale } = await params;
  const { tag, page } = await searchParams;

  return <SectionListing section="journal" locale={locale} tags={tagsFromParam(tag)} page={page} />;
}
