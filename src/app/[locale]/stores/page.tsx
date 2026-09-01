import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StoresSection } from "@/components/blocks/StoresSection";
import { HelpCards } from "@/components/blocks/HelpCards";
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
      <div className="pt-11">
        <StoresSection />
      </div>
      <div className="mt-10">
        <HelpCards locale={locale} />
      </div>
    </div>
  );
}
