import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StoresSection } from "@/components/blocks/StoresSection";
import { seo } from "@/lib/seo";
import { getSiteSettings } from "@/lib/siteSettings";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { storesHeading } = await getSiteSettings();
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
  const { storesHeading } = await getSiteSettings();

  return (
    <div className="pb-6 lg:pb-10">
      <Breadcrumbs
        items={[{ label: "Главная", href: `/${locale}` }, { label: "Магазины" }]}
      />
      {/* 40 under the crumbs and 40 below the row on lg+ - the desktop file's
          own numbers, with nothing else between them and the footer. At 375
          the file asks for less: 16 above the first card, 24 at the foot. */}
      <div className="pt-4 lg:pt-10">
        {/* Only the 375 frame carries a title; the desktop one goes straight to
            the cards */}
        <h2 className="mb-4 px-4 font-mono text-xl/[26px] uppercase tracking-[3px] lg:hidden">
          [{storesHeading}]
        </h2>
        <StoresSection />
      </div>
    </div>
  );
}
