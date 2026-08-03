import Image from "next/image";
import Link from "next/link";

type NotFoundHeroProps = {
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Laid out on the mockup's 1920x952 art board: every position is a percentage
 * of that board, so the whole composition scales as one piece. The two silver
 * fours are the same file at different tilts.
 */
export function NotFoundHero({
  heading = "Страница не найдена",
  ctaLabel = "Вернуться на главную",
  ctaHref = "/",
}: NotFoundHeroProps) {
  return (
    <section className="flex h-[calc(100svh-var(--header-h,0px))] items-center justify-center overflow-hidden px-6 lg:px-10">
      <div className="relative aspect-[1920/952] w-full">
        <h1 className="absolute inset-x-0 top-[21.5%] text-center font-mono text-xl uppercase tracking-[5px] text-ink lg:text-[36px]">
          [{heading}]
        </h1>

        <div className="absolute left-[28.47%] top-[31.64%] w-[17.29%] origin-top-left -rotate-[12.6deg]">
          <Image
            src="/images/404/balloon-4.png"
            alt=""
            width={664}
            height={996}
            className="h-auto w-full"
          />
        </div>

        <div className="absolute left-[33.33%] top-[28.8%] w-[33.33%]">
          <Image
            src="/images/404/balloon-smile.png"
            alt=""
            width={1280}
            height={853}
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="absolute left-[53.27%] top-[24.18%] w-[17.29%] origin-top-left rotate-[7.19deg]">
          <Image
            src="/images/404/balloon-4.png"
            alt=""
            width={664}
            height={996}
            className="h-auto w-full"
          />
        </div>

        <Link
          href={ctaHref}
          className="absolute left-1/2 top-[75.5%] flex h-[49px] -translate-x-1/2 items-center whitespace-nowrap bg-brand px-[17px] text-sm font-medium uppercase tracking-[0.15em] text-white"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
