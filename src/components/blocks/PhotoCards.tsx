import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * Three cards with a photo and a title. Under «Наша миссия» they are the file's
 * Value card strip: on the same red as the band, a 4:3 photo on Sage, the label
 * in brackets and the title in H4, all White - three across on a desktop, 24
 * apart, and on a phone a row of 280s that swipes. The card's text is not drawn.
 *
 * Without `onBrand` they stay as they were, on white (Вакансии, which the file
 * has not drawn yet).
 */
export function PhotoCards({
  cards,
  onBrand = false,
}: {
  cards: { title: string; body: string; image?: string; label?: string }[];
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
    <section className="on-dark bg-brand pb-12 text-white md:pb-24">
      <div className="flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-10 [&::-webkit-scrollbar]:hidden">
        {cards.map((card, i) => (
          <div
            key={i}
            className="flex w-[280px] shrink-0 snap-start flex-col gap-4 md:w-auto"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink">
              {card.image && (
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 31vw, 280px"
                  className="object-cover"
                />
              )}
            </div>

            {card.label && <p className="type-caption uppercase">[{card.label}]</p>}
            <h3 className="type-h4">{card.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
