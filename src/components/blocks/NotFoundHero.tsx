"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { useSiteSettings } from "@/components/layout/SettingsContext";

/**
 * The file's Empty state for a 404, no crumbs over it: "[Страница не найдена]"
 * in Label, then "4 · маскот · 4" set as large as the type goes - 316 with the
 * yellow mascot, 269 across, between the fours; 72 and 62 at 375 - and a Red
 * "Вернуться на главную" 56 tall. 96 of air over and under on a desktop, 64 at
 * 375. The wording is the settings', so the editor can change it.
 */
export function NotFoundHero({ ctaHref = "/" }: { ctaHref?: string }) {
  const { notFound } = useSiteSettings();

  return (
    <section className="flex flex-col items-center gap-6 px-4 py-16 md:gap-8 md:px-10 md:py-24">
      <h1 className="type-label uppercase text-ink">[{notFound.heading}]</h1>

      <div aria-hidden="true" className="flex items-center gap-2">
        <span className="type-nf-code text-ink">4</span>
        <Image
          src="/images/home/smile.svg"
          alt=""
          width={269}
          height={267}
          priority
          className="size-[62px] md:size-[269px]"
        />
        <span className="type-nf-code text-ink">4</span>
      </div>

      <Link href={ctaHref} className={`${buttonClass("primary", "L")} max-md:w-full max-md:max-w-[343px]`}>
        {notFound.cta}
      </Link>
    </section>
  );
}
