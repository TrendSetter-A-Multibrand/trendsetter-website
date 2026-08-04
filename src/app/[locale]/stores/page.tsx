import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StoreLocator } from "@/components/blocks/StoreLocator";
import { HelpCards } from "@/components/blocks/HelpCards";

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
      <StoreLocator rowGap={40} />
      <div className="mt-10">
        <HelpCards />
      </div>
    </div>
  );
}
