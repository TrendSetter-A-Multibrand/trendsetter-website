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
    <section className="on-dark relative mt-[calc(-1*var(--header-h,0px))] flex h-[524px] flex-col justify-end overflow-hidden bg-neutral-800 lg:h-[100svh]">
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

      {/* The 375 frame pins the buttons to the foot of the image, 16 up from
          the edge, with the tagline riding well above them rather than
          stacked close - the file's own gap here is 160. lg keeps the group
          centred in the frame instead, as it always has. */}
      <div className="absolute inset-0 flex flex-col items-center justify-end gap-[160px] px-4 pb-4 pt-[var(--header-h,0px)] text-center lg:justify-center lg:gap-6 lg:px-10 lg:pb-0">
        {/* Geist Mono 36 on a 46.8 line, 3 of tracking */}
        <p className="max-w-5xl font-mono text-2xl uppercase text-white sm:text-2xl lg:text-[36px]/[46.8px] lg:tracking-[3px]">
          {tagline}
        </p>

        {/* 24 apart; the labels are Inter Tight, not the mono they read as - the
            file says so. The library has the pair as White Opacity and Primmary.
            375 stacks them full-width; the row comes back from lg. */}
        <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:flex-wrap lg:justify-center lg:gap-6">
          <Link href={primaryCta.href} className={`w-full lg:w-auto ${buttonClass("whiteOpacity")}`}>
            {primaryCta.label}
          </Link>
          <Link href={secondaryCta.href} className={`w-full lg:w-auto ${buttonClass("primary")}`}>
            {secondaryCta.label}
          </Link>
        </div>
      </div>

      {/* LINEAR_DODGE in the mockup - lets the photo read through the letters.
          24 of air all round it, which is what makes the wordmark 1872 at 1920.
          The 375 frame carries no bottom wordmark, so it goes sr-only below lg -
          still the page's one <h1>, read by a screen reader rather than removed. */}
      <h1 className="sr-only w-full px-4 pb-4 mix-blend-plus-lighter lg:relative lg:not-sr-only lg:px-6 lg:pb-6">
        <Wordmark className="text-brand" />
      </h1>
    </section>
  );
}
