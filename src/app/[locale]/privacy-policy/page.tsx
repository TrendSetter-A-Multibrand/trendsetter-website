import { notFound } from "next/navigation";
import { LegalArticle } from "@/components/blocks/LegalArticle";
import { NewsletterSignup } from "@/components/blocks/NewsletterSignup";
import { findLegalPage } from "@/lib/legal";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = findLegalPage("privacy-policy");
  if (!page) notFound();

  return (
    <>
      <LegalArticle title={page.title} sections={page.sections} />
      <NewsletterSignup locale={locale} />
    </>
  );
}
