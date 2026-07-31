import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/locales";
import { Header } from "@/components/layout/Header";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Header locale={locale} />
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  );
}
