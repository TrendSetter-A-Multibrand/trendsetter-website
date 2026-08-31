import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { NAV_ITEMS } from "@/lib/navigation";
import { Wordmark } from "@/components/ui/Wordmark";
import { SocialLinks } from "@/components/ui/SocialLinks";

const MENU_LINKS = [
  { label: "Журнал", slug: "journal" },
  { label: "Бренды", slug: "brands" },
  { label: "Магазины", slug: "stores" },
  { label: "Коллаборации", slug: "company/collaborations" },
  { label: "Компания", slug: "company" },
];

const LEGAL_LINKS = [
  { label: "Часто задаваемые вопросы", slug: "faq" },
  { label: "Пользовательское соглашение", slug: "user-agreement" },
  { label: "Политика обработки cookie", slug: "cookies" },
  { label: "Согласие на обработку персональных данных", slug: "personal-data-consent" },
  { label: "Политика обработки персональных данных", slug: "privacy-policy" },
];

const CONTACT_EMAIL = "trader@calledagarment.com";

/**
 * The same 24 on a 31 line the section titles carry - the library sets all of
 * them from one style, and the 22 measured off the old export was simply wrong.
 * 24 of air under it to the first link.
 */
function FooterHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-6 font-mono text-2xl/[31px] uppercase tracking-[3px]">
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
  // Коллаборации live in the Меню column here, as the library draws it, so the
  // section's own list drops them rather than printing the link twice. Six links
  // is also what makes the column 269 and the footer 525.
  const companyLinks = (
    NAV_ITEMS.find((item) => item.slug === "company")?.children ?? []
  ).filter((item) => item.slug !== "collaborations");

  return (
    <footer className="on-dark bg-ink pb-10 pt-10 text-white">
      {/* Columns sit at 40 / 221 / 670 / 901 in the library, so their widths are
          the file's, not a regular grid. The tiles close the row at 1840. */}
      <div className="footer-columns grid gap-x-10 gap-y-10 px-6 sm:grid-cols-2 lg:px-10 xl:grid-cols-4">
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
      {/* 40 under the columns, and 40 to the foot of the page */}
      <div className="mt-10 px-6 lg:px-10">
        <Wordmark className="text-[#453e3c]" />
      </div>
    </footer>
  );
}
