import { isLocale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";
import { Hero } from "@/components/blocks/Hero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <Hero locale={locale} />;
}
