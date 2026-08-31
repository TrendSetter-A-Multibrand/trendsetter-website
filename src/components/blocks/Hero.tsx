import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { buttonClass } from "@/components/ui/Button";
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
    <section className="on-dark relative mt-[calc(-1*var(--header-h,0px))] flex h-[100svh] flex-col justify-end overflow-hidden bg-neutral-800">
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
        {/* Geist Mono 36 on a 46.8 line, 3 of tracking */}
        <p className="max-w-5xl font-mono text-xl uppercase text-white sm:text-2xl lg:text-[36px]/[46.8px] lg:tracking-[3px]">
          {tagline}
        </p>

        {/* 24 apart; the labels are Inter Tight, not the mono they read as - the
            file says so. The library has the pair as White Opacity and Primmary */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link href={primaryCta.href} className={buttonClass("whiteOpacity")}>
            {primaryCta.label}
          </Link>
          <Link href={secondaryCta.href} className={buttonClass("primary")}>
            {secondaryCta.label}
          </Link>
        </div>
      </div>

      {/* LINEAR_DODGE in the mockup - lets the photo read through the letters.
          24 of air all round it, which is what makes the wordmark 1872 at 1920 */}
      <h1 className="relative w-full px-6 pb-6 mix-blend-plus-lighter">
        <Wordmark className="text-brand" />
      </h1>
    </section>
  );
}
