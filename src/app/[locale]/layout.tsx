import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/locales";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { TabBar } from "@/components/layout/TabBar";
import { MenuProvider } from "@/components/layout/MenuContext";
import { ScrollReset } from "@/components/layout/ScrollReset";
import { PromoTicker } from "@/components/blocks/PromoTicker";
import { CookieNotice } from "@/components/blocks/CookieNotice";
import { getSiteSettings, resolveHref } from "@/lib/siteSettings";
import { SettingsProvider } from "@/components/layout/SettingsContext";

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
    <SettingsProvider settings={settings}>
      <MenuProvider>
        <ScrollReset />
        <TopBar>
          {ticker.enabled && (
            <PromoTicker
              text={ticker.text}
              ctaLabel={ticker.ctaLabel}
              href={resolveHref(locale, ticker.href)}
              tone={ticker.tone}
            />
          )}
          <Header
            locale={locale}
            items={settings.nav}
            socials={settings.socials}
          />
        </TopBar>
        {/* On a phone the tab bar is fixed over the foot of the page, so the page
          keeps its height in reserve */}
        <div className="flex flex-1 flex-col">
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer locale={locale} settings={settings} />
        </div>
        <TabBar locale={locale} />
        <CookieNotice locale={locale} text={settings.cookieText} />
      </MenuProvider>
    </SettingsProvider>
  );
}
