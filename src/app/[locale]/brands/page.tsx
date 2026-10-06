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
      {/* Only the 375 frame has the cover; the desktop file opens on the crumbs */}
      <div className="lg:hidden">
        <PageCover
          title={covers.brands.title}
          subtitle={covers.brands.subtitle}
          imageSrc={covers.brands.image}
          flush={false}
        />
      </div>
      <Breadcrumbs
        items={[{ label: "Главная", href: `/${locale}` }, { label: "Бренды" }]}
      />
      <BrandsSection />
    </>
  );
}
