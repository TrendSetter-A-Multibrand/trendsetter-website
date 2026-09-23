import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
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
    <div className="pb-6 lg:pb-10">
      <Breadcrumbs
        items={[{ label: "Главная", href: `/${locale}` }, { label: "Магазины" }]}
      />
      {/* 40 under the crumbs and 40 below the row on lg+ - the desktop file's
          own numbers, with nothing else between them and the footer. At 375
          the file asks for less: 16 above the first card, 24 at the foot. */}
      <div className="pt-4 lg:pt-10">
        <StoresSection />
      </div>
    </div>
  );
}
