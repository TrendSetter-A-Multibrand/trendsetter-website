import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * Three 587x727 photos with their name across the foot, 40 apart.
 *
 * The file draws the first in colour and the other two fully desaturated, which
 * is a hover state written down rather than three different pictures: at rest
 * they are grey, and the one under the pointer comes back to colour.
 */
export function SpaceCards({
  cards,
}: {
  cards: { title: string; image?: string }[];
}) {
  return (
    <section className="grid gap-10 px-6 py-10 lg:grid-cols-3 lg:px-10">
      {/* Keyed by position: the file gives all three the same name */}
      {cards.map((card, i) => (
        <div
          key={i}
          className="on-dark group relative aspect-[587/727] overflow-hidden"
        >
          <ImagePlaceholder />
          {card.image && (
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 31vw, 92vw"
              className="object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
            />
          )}

          {/* Black at 60% at the foot, clear by the halfway line */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent to-50%" />

          <p className="absolute inset-x-0 bottom-10 px-10 text-center text-xl font-medium uppercase tracking-[0.32px] text-white lg:text-[32px]/[38.72px]">
            {card.title}
          </p>
        </div>
      ))}
    </section>
  );
}
