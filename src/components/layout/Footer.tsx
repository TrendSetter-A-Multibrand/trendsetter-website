import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/lib/navigation";
import { FitText } from "@/components/ui/FitText";

const MENU_LINKS = [
  { label: "Журнал", slug: "journal" },
  { label: "Бренды", slug: "brands" },
  { label: "Магазины", slug: "stores" },
  { label: "Коллаборации", slug: "collaborations" },
  { label: "Компания", slug: "company" },
];

const LEGAL_LINKS = [
  { label: "Пользовательское соглашение", slug: "user-agreement" },
  { label: "Политика обработки персональных данных", slug: "privacy-policy" },
  { label: "Согласие на обработку персональных данных", slug: "personal-data-consent" },
  { label: "Публичная оферта", slug: "public-offer" },
  { label: "Доставка, оплата, возврат", slug: "delivery" },
];

const CONTACT_EMAIL = "trader@calledagarment.com";

export function Footer({ locale }: { locale: Locale }) {
  const companyLinks = NAV_ITEMS.find((item) => item.slug === "company")?.children ?? [];

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="grid gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]">
            [Меню]
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-white/70">
            {MENU_LINKS.map((item) => (
              <li key={item.slug}>
                <Link href={`/${locale}/${item.slug}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]">
            [Покупателям]
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-white/70">
            {LEGAL_LINKS.map((item) => (
              <li key={item.slug}>
                <Link href={`/${locale}/${item.slug}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]">
            [Компания]
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-white/70">
            {companyLinks.map((item) => (
              <li key={item.slug}>
                <Link href={`/${locale}/company/${item.slug}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]">
            [Сотрудничество]
          </h2>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-white/70">
            {CONTACT_EMAIL.toUpperCase()}
          </a>
          <div className="mt-4 flex gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded bg-brand text-xs font-semibold uppercase"
              >
                {social.label.slice(0, 2)}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 pb-2 pt-6 lg:px-10">
        <FitText className="select-none font-black leading-none tracking-tight text-white/10">
          TRENDSETTER
        </FitText>
      </div>
    </footer>
  );
}
