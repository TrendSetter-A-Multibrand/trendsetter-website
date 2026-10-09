import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BrandsSection } from "@/components/blocks/BrandsSection";
import { PageCover } from "@/components/blocks/PageCover";
import { seo } from "@/lib/seo";
import { getSiteSettings } from "@/lib/siteSettings";


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
  const { covers } = await getSiteSettings();

  return (
    <>
      {/* Crumbs, then the cover, then the letters and search (BrandsSection) */}
      <div className="lg:py-5">
        <Breadcrumbs
          items={[{ label: "Главная", href: `/${locale}` }, { label: "Бренды" }]}
        />
      </div>
      <PageCover
        title={covers.brands.title}
        subtitle={covers.brands.subtitle}
        imageSrc={covers.brands.image}
        flush={false}
        short
      />
      <BrandsSection />
    </>
  );
}
