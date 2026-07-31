import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/locales";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromoTicker } from "@/components/blocks/PromoTicker";

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
      <PromoTicker />
      <Header locale={locale} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
