import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * «Наши преимущества». Under «Наша миссия» the file draws these on the same red
 * as the band, so `onBrand` carries the red and the white type; without it the
 * cards stay as they were on the page's own white (Вакансии, whose frame is
 * still a draft).
 *
 * Desktop: three 587-wide cards 40 apart, a 430 photo, the label and the title
 * in white on the red, 40 of red round them. At 375 the cards are 320 wide with
 * a 320 photo, on white under a heading of their own, in a row that scrolls 16
 * apart. The file draws the title only - the card's body text is not shown.
 */
export function PhotoCards({
  cards,
  onBrand = false,
}: {
  cards: { title: string; body: string; image?: string }[];
  onBrand?: boolean;
}) {
  if (!onBrand) {
    return (
      <section className="grid gap-10 px-6 py-10 lg:grid-cols-3 lg:px-10">
        {cards.map((card, i) => (
          <div key={i} className="flex flex-col gap-6">
            <div className="relative aspect-square w-full overflow-hidden">
              <ImagePlaceholder />
              {card.image && (
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 31vw, 92vw"
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-medium tracking-[0.24px] lg:text-2xl/[29px]">
                {card.title}
              </h2>
              <p className="text-base font-medium lg:text-xl/[24.2px]">
                {card.body}
              </p>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="on-dark pt-10 lg:mt-0 lg:bg-brand lg:py-10 lg:text-white">
      {/* At 375 the cards sit on the page's white under their own mono heading; the red is the desktop band */}
      <h2 className="px-4 pb-4 font-mono text-xl/none uppercase tracking-[3px] lg:hidden">
        [Наши преимущества]
      </h2>
      <div className="flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 [scrollbar-width:none] lg:grid lg:snap-none lg:grid-cols-3 lg:gap-10 lg:overflow-visible lg:px-10 [&::-webkit-scrollbar]:hidden">
        {cards.map((card, i) => (
          <div
            key={i}
            className="flex w-[320px] shrink-0 snap-start flex-col gap-4 lg:w-auto lg:gap-6"
          >
            <div className="relative h-[320px] shrink-0 overflow-hidden lg:h-[430px]">
              <ImagePlaceholder />
              {card.image && (
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 31vw, 320px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex flex-col gap-2 lg:gap-4">
              <p className="font-mono text-xs/4 font-medium uppercase tracking-[1px] text-brand lg:text-2xl/[29px] lg:font-normal lg:tracking-[3px] lg:text-white">
                [Наши преимущества]
              </p>
              <h3 className="text-xl/6 font-medium tracking-[1px] lg:text-2xl/[29px]">
                {card.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
