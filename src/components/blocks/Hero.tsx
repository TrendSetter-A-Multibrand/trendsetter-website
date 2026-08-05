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
  // The section is pulled up behind the header, so that the photo - and not the
  // page's own white - is what shows while the bar slides in and out. The copy
  // is padded back down to stay centred in what is left below the bar.
  return (
    <section className="relative mt-[calc(-1*var(--header-h,0px))] flex h-[100svh] flex-col justify-end overflow-hidden bg-neutral-800">
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

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 pt-[var(--header-h,0px)] text-center lg:px-10">
        {/* 36px with 5px tracking in the mockup, and mixed case - not uppercase */}
        <p className="max-w-5xl font-mono text-xl text-white sm:text-2xl lg:text-[36px] lg:tracking-[5px]">
          {tagline}
        </p>

        {/* 49px tall, 24px apart; the first one is white at 50% */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href={primaryCta.href}
            className="flex h-[49px] items-center bg-white/50 px-4 text-sm font-medium uppercase tracking-[0.15em] text-white"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="flex h-[49px] items-center bg-brand px-4 text-sm font-medium uppercase tracking-[0.15em] text-white"
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
