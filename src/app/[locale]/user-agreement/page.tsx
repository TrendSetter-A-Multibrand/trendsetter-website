import { notFound } from "next/navigation";
import { LegalArticle } from "@/components/blocks/LegalArticle";
import { ContactForm } from "@/components/blocks/ContactForm";
import { findLegalPage } from "@/lib/legal";

export default async function UserAgreementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = findLegalPage("user-agreement");
  if (!page) notFound();

  return (
    <>
      <LegalArticle title={page.title} sections={page.sections} />
      <ContactForm locale={locale} />
    </>
  );
}
