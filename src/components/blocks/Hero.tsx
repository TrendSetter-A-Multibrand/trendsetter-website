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

      {/* The mockup knocks the photo back hard. Measured against the file we
          ship - which is the untouched export, no darkening of its own - the
          closest single black layer is 49%; anything lighter and the white type
          over it sits differently. */}
      <div className="absolute inset-0 bg-black/[0.49]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 pt-[var(--header-h,0px)] text-center lg:px-10">
        {/* 36px with 3px tracking in the mockup */}
        <p className="max-w-5xl font-mono text-xl uppercase text-white sm:text-2xl lg:text-[36px] lg:tracking-[3px]">
          {tagline}
        </p>

        {/* 49px tall, 24px apart, 17px of air either side of the label; the
            first one is white at 40% */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href={primaryCta.href}
            className="flex h-[49px] items-center bg-white/40 px-[17px] font-mono text-sm uppercase tracking-[3px] text-white"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="flex h-[49px] items-center bg-brand px-[17px] font-mono text-sm uppercase tracking-[3px] text-white"
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
