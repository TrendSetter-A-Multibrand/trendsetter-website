import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { StoresSection } from "@/components/blocks/StoresSection";
import { seo } from "@/lib/seo";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return seo({
    title: "Магазины",
    description:
      "Адреса магазинов TRENDSETTER, часы работы и как до них дойти.",
    path: "/stores",
    locale,
  });
}

export default async function StoresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Главная", href: `/${locale}` }, { label: "Магазины" }]}
      />
      <PageCover
        title="Магазины"
        subtitle="Одежда, дом, косметика и детское — в магазинах рядом с домом. Выберите ближайший и постройте маршрут."
      />
      <StoresSection variant="map" />
    </>
  );
}
