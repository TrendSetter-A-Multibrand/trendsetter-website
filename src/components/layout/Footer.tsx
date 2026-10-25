import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { resolveHref, type SiteSettings } from "@/lib/siteSettings";
import { Wordmark } from "@/components/ui/Wordmark";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { FooterGroup } from "@/components/layout/FooterGroup";

const LINK =
  "type-body-s text-line transition-colors duration-150 hover:text-white hover:underline";

/**
 * The file's Footer: Sage, the groups of links in a row (two by two under 1000,
 * accordions on a phone), a Text-2 rule, the social links on Sage and the ©
 * line, and the logo in white across the full width at the foot. The groups and
 * their links are the editor's, from the settings; the cooperation address the
 * settings keep sits in the row as one more group. On a phone the foot keeps the
 * tab bar's height in Sage rather than leaving a white strip under it.
 */
export function Footer({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SiteSettings;
}) {
  const { columns, cooperationTitle, email } = settings.footer;

  return (
    <footer className="on-dark bg-ink pt-6 text-white max-md:pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))]">
      <div className="px-4 md:px-10">
        <div className="grid pb-6 md:grid-cols-2 md:gap-x-6 md:gap-y-10 md:pb-16 min-[1000px]:grid-flow-col min-[1000px]:auto-cols-fr min-[1000px]:grid-cols-none">
          {columns.map((column) => (
            <FooterGroup key={column.title} title={column.title}>
              <ul className="flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={link.path}>
                    <Link href={resolveHref(locale, link.path)} className={LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterGroup>
          ))}

          <FooterGroup title={cooperationTitle}>
            <a href={`mailto:${email}`} className={LINK}>
              {email}
            </a>
          </FooterGroup>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-6 md:justify-start md:border-t md:border-text-2">
          <SocialLinks links={settings.socials} surface="dark" />
          <p className="type-caption text-line">© 2026 TRENDSETTER</p>
        </div>
      </div>

      <div className="overflow-hidden px-4 md:px-10">
        <Wordmark className="text-white" />
      </div>
    </footer>
  );
}
