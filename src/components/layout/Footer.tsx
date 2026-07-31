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

function FooterHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]">
      [{children}]
    </h2>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>
      <ul className="flex flex-col gap-2 text-sm text-white/70">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const companyLinks = NAV_ITEMS.find((item) => item.slug === "company")?.children ?? [];

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="flex flex-col gap-10 px-6 py-16 lg:flex-row lg:justify-between lg:px-10">
        <div className="flex flex-wrap gap-10 lg:gap-16">
          <FooterColumn
            title="Меню"
            links={MENU_LINKS.map((item) => ({
              label: item.label,
              href: `/${locale}/${item.slug}`,
            }))}
          />
          <FooterColumn
            title="Покупателям"
            links={LEGAL_LINKS.map((item) => ({
              label: item.label,
              href: `/${locale}/${item.slug}`,
            }))}
          />
          <FooterColumn
            title="Компания"
            links={companyLinks.map((item) => ({
              label: item.label,
              href: `/${locale}/company/${item.slug}`,
            }))}
          />
        </div>

        <div>
          <FooterHeading>Сотрудничество</FooterHeading>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-white/70">
            {CONTACT_EMAIL.toUpperCase()}
          </a>
        </div>

        <div className="flex h-fit gap-3">
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

      <div className="px-6 pb-2 pt-6 lg:px-10">
        <FitText
          widthRatio={0.9}
          className="select-none font-black leading-none tracking-tight text-white/10"
        >
          TRENDSETTER
        </FitText>
      </div>
    </footer>
  );
}
