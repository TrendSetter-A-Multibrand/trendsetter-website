import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { NAV_ITEMS } from "@/lib/navigation";
import { Wordmark } from "@/components/ui/Wordmark";
import { SocialLinks } from "@/components/ui/SocialLinks";

const MENU_LINKS = [
  { label: "Журнал", slug: "journal" },
  { label: "Бренды", slug: "brands" },
  { label: "Магазины", slug: "stores" },
  { label: "Коллаборации", slug: "collaborations" },
  { label: "Компания", slug: "company" },
];

/**
 * The file draws this column two ways; this is the one that carries the offer.
 * It leaves out the FAQ and the cookie policy, both of which are still reachable
 * - the FAQ from the help cards, cookies from the notice at the bottom of the
 * page. The last two have no document behind them yet.
 */
const LEGAL_LINKS = [
  { label: "Пользовательское соглашение", slug: "user-agreement" },
  { label: "Политика обработки персональных данных", slug: "privacy-policy" },
  { label: "Согласие на обработку персональных данных", slug: "personal-data-consent" },
  { label: "Публичная оферта", slug: null },
  { label: "Доставка, оплата, возврат", slug: null },
];

const CONTACT_EMAIL = "trader@calledagarment.com";

/**
 * 22px in the mockup. Deliberately its own size, not shared with the section
 * headings in components/blocks - those are 24 and scaling them together
 * would move the sliders above. The 34 of leading is what drops the brackets
 * to where the file draws them, 8 below the top of the social tiles.
 */
function FooterHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-6 font-mono text-[22px]/[34px] uppercase tracking-[3px]">
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
      {/* Inter Tight, not the mono the headings above them use - the tracking
          reads like mono but the letterforms are proportional */}
      <ul className="flex flex-col gap-5 text-sm/[19px] uppercase tracking-[1px] text-white/40">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const companyLinks = NAV_ITEMS.find((item) => item.slug === "company")?.children ?? [];

  return (
    <footer className="on-dark bg-ink pb-10 pt-10 text-white">
      {/* Columns sit at 40 / 221 / 670 / 1119 in the mockup, so their widths are
          the file's, not a regular grid. The tiles close the row at 1880. */}
      <div className="grid gap-x-10 gap-y-10 px-6 lg:grid-cols-[181px_449px_449px_1fr_auto] lg:gap-x-0 lg:px-10">
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
            href: item.slug ? `/${locale}/${item.slug}` : "#",
          }))}
        />
        <FooterColumn
          title="Компания"
          links={companyLinks.map((item) => ({
            label: item.label,
            href: `/${locale}/company/${item.slug}`,
          }))}
        />

        <div>
          <FooterHeading>Сотрудничество</FooterHeading>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm/[19px] uppercase tracking-[1px] text-white/40 transition-colors hover:text-white"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <SocialLinks large className="h-fit" />
      </div>

      {/* The file paints this white under SOFT_LIGHT, but Figma's soft light is
          the Photoshop formula and CSS uses the W3C one - over #252120 they land
          on #453e3c and #605a58. The backdrop here is flat, so the blend buys
          nothing: paint the colour Figma arrives at and be exact. */}
      <div className="mt-[76px] px-6 lg:px-10">
        <Wordmark className="text-[#453e3c]" />
      </div>
    </footer>
  );
}
