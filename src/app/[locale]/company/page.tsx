import { redirect } from "next/navigation";

/**
 * Temporary: О нас stands in for the section itself, so the header's Компания
 * leads somewhere while the rest of the section is still being drawn. A 307, not
 * a 308 - the section will have a page of its own.
 */
export default async function CompanyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/company/about`);
}
