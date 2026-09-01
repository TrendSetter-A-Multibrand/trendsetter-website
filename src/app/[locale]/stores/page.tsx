import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StoresSection } from "@/components/blocks/StoresSection";
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
      <div className="pt-11">
        <StoresSection />
      </div>
      <div className="mt-10">
        <HelpCards locale={locale} />
      </div>
    </div>
  );
}
