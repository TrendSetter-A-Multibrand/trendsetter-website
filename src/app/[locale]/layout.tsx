import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/locales";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { PromoTicker } from "@/components/blocks/PromoTicker";
import { CookieNotice } from "@/components/blocks/CookieNotice";
import { getSiteSettings, resolveHref } from "@/lib/siteSettings";

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

  // The strip, the menu, the footer and the social tiles are the editor's: one
  // story called "settings", read once per page and handed down.
  const settings = await getSiteSettings();
  const { ticker } = settings;

  return (
    <>
      <TopBar>
        {ticker.enabled && (
          <PromoTicker
            text={ticker.text}
            ctaLabel={ticker.ctaLabel}
            href={resolveHref(locale, ticker.href)}
            tone={ticker.tone}
          />
        )}
        <Header locale={locale} items={settings.nav} socials={settings.socials} />
      </TopBar>
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer locale={locale} settings={settings} />
      <CookieNotice locale={locale} />
    </>
  );
}
