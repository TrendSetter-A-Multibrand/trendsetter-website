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
    <div className="pb-10">
      <Breadcrumbs
        items={[{ label: "Главная", href: `/${locale}` }, { label: "Магазины" }]}
      />
      {/* 40 under the crumbs, and the 40 below the row is the page's own
          bottom padding - the file puts nothing else between them and the
          footer. */}
      <div className="pt-10">
        <StoresSection />
      </div>
    </div>
  );
}
