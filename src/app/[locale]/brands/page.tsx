import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BrandsSection } from "@/components/blocks/BrandsSection";
import { seo } from "@/lib/seo";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return seo({
    title: "Бренды",
    description:
      "Все бренды TRENDSETTER по алфавиту: одежда, обувь, аксессуары, косметика — и в каких магазинах их найти.",
    path: "/brands",
    locale,
  });
}

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Главная", href: `/${locale}` }, { label: "Бренды" }]}
      />
      <BrandsSection />
    </>
  );
}
