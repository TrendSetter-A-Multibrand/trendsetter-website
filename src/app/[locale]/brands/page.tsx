import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BrandsSection } from "@/components/blocks/BrandsSection";

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
