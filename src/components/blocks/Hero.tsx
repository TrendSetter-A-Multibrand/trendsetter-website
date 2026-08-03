import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { Wordmark } from "@/components/ui/Wordmark";

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
  imageSrc = "/images/home/hero.jpg",
}: HeroProps) {
  return (
    <section className="relative flex h-[calc(100svh-var(--header-h,0px))] flex-col justify-end overflow-hidden bg-neutral-800">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center lg:px-10">
        <p className="max-w-4xl font-mono text-xl uppercase tracking-[0.2em] text-white sm:text-2xl lg:text-3xl">
          {tagline}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={primaryCta.href}
            className="bg-white/10 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="bg-brand px-6 py-3 text-sm font-medium uppercase tracking-wide text-white"
          >
            {secondaryCta.label}
          </Link>
        </div>
      </div>

      {/* LINEAR_DODGE in the mockup - lets the photo read through the letters */}
      <h1 className="relative w-full px-6 pb-10 mix-blend-plus-lighter lg:px-10">
        <Wordmark className="text-brand" />
      </h1>
    </section>
  );
}
