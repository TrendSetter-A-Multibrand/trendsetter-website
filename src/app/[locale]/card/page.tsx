import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { LoyaltyAuth } from "@/components/blocks/LoyaltyAuth";
import { LoyaltyCabinet } from "@/components/blocks/LoyaltyCabinet";
import { accountEnabled, type Cabinet, loadCabinet, SessionExpired } from "@/lib/bonusRarus/customer";
import { readSession } from "@/lib/bonusRarus/session";

export const metadata: Metadata = {
  title: "Моя карта",
  robots: { index: false, follow: false },
};

/**
 * DEMO: "Моя карта" - the loyalty card's own cabinet on the site, against the
 * vendor's test space (see `accountEnabled`; switched off on the live site).
 * Signed out it is the phone-and-code form; signed in, the card, the year and
 * the history, read with the client's own token on every visit.
 */
export default async function CardPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!accountEnabled()) notFound();
  const { locale } = await params;

  const token = await readSession();
  let cabinet: Cabinet | null = null;
  let unavailable = false;
  if (token) {
    try {
      cabinet = await loadCabinet(token);
    } catch (e) {
      // An expired token shows the sign-in; signing in writes a new one over it
      if (!(e instanceof SessionExpired)) unavailable = true;
    }
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: `/${locale}` },
          { label: "Лояльность", href: `/${locale}/loyalty` },
          { label: "Моя карта" },
        ]}
      />
      <PageCover
        title={cabinet?.name ? `Здравствуйте, ${cabinet.name}` : "Моя карта"}
        subtitle={cabinet ? "Баланс, история покупок и карта для кассы" : "Бонусная карта TRENDSETTER"}
      />
      <div className="px-4 pb-32 md:px-10">
        {unavailable ? (
          <p role="alert" className="type-body-l text-text-2">
            Не получилось загрузить данные карты. Обновите страницу чуть позже.
          </p>
        ) : cabinet ? (
          <LoyaltyCabinet cabinet={cabinet} />
        ) : (
          <LoyaltyAuth locale={locale} />
        )}
      </div>
    </>
  );
}
