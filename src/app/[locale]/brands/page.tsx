import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BrandDirectory } from "@/components/blocks/BrandDirectory";
import { BRANDS } from "@/lib/brands";

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
      <BrandDirectory brands={BRANDS} />
    </>
  );
}
