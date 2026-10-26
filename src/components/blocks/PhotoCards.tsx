import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * Three cards with a photo and a title. Under «Наша миссия» they are the file's
 * Value card strip: on the same red as the band, a 4:3 photo on Sage, the label
 * in brackets and the title in H4, all White - three across on a desktop, 24
 * apart, and on a phone a row of 280s that swipes. The card's text is not drawn.
 *
 * Without `onBrand` they are the file's Value card (вакансии), on white: a 4:3
 * photo, the title in H3 and the text in Body under it, 12 apart. The row is the
 * same, 24 apart three across or swiping at 375.
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
      <section className="pt-6 md:pt-8">
        <div className="flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-10 [&::-webkit-scrollbar]:hidden">
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex w-[280px] shrink-0 snap-start flex-col gap-3 md:w-auto"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                <ImagePlaceholder />
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
              <h3 className="type-h3 text-ink">{card.title}</h3>
              {card.body && <p className="type-body text-ink">{card.body}</p>}
            </div>
          ))}
        </div>
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
