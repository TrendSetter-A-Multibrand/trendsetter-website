import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { ContactDetails } from "@/components/blocks/ContactDetails";
import { ContactForm } from "@/components/blocks/ContactForm";
import { CONTACT_GROUPS } from "@/lib/contacts";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      {/* The crumbs sit in a 59 band of their own, 20 of air either side */}
      <div className="py-5">
        <Breadcrumbs
          items={[{ label: "Главная", href: `/${locale}` }, { label: "Контакты" }]}
        />
      </div>
      <PageCover
        title="Контакты"
        imageSrc="/images/covers/articles.jpg"
        flush={false}
      />
      <ContactDetails groups={CONTACT_GROUPS} />
      <ContactForm locale={locale} />
    </>
  );
}
