import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { ContactForm } from "@/components/blocks/ContactForm";
import { FAQ_GROUPS } from "@/lib/legal";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      {/* The file drops the crumbs 20 lower here than the header leaves them */}
      <div className="pt-5">
        <Breadcrumbs
          items={[{ label: "Главная", href: `/${locale}` }, { label: "FAQ" }]}
        />
      </div>

      <div className="pt-11">
        <FaqAccordion groups={FAQ_GROUPS} />
      </div>

      <ContactForm locale={locale} />
    </>
  );
}
