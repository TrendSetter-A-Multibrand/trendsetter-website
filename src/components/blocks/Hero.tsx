import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { FitText } from "@/components/ui/FitText";

type HeroProps = {
  locale: Locale;
  tagline?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc?: string;
};

export function Hero({
  locale,
  tagline = "Доверьте поиск нам, а выбор — себе",
  primaryCta = { label: "Читать журнал", href: `/${locale}/journal` },
  secondaryCta = { label: "Найти магазин", href: `/${locale}/stores` },
  imageSrc,
}: HeroProps) {
  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-neutral-800">
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
      )}

      <div className="relative flex flex-col gap-6 px-6 pb-16 lg:px-10">
        <p className="max-w-xl text-lg uppercase tracking-[0.2em] text-white">
          {tagline}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href={secondaryCta.href}
            className="rounded-full bg-brand px-6 py-3 text-sm font-medium uppercase tracking-wide text-white"
          >
            {secondaryCta.label}
          </Link>
          <Link
            href={primaryCta.href}
            className="rounded-full border border-white px-6 py-3 text-sm font-medium uppercase tracking-wide text-white"
          >
            {primaryCta.label}
          </Link>
        </div>

        <h1 className="-mb-6">
          <FitText className="select-none font-black leading-none tracking-tight text-brand">
            TRENDSETTER
          </FitText>
        </h1>
      </div>
    </section>
  );
}
