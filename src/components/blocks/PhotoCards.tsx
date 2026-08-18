import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/** Three 587 squares, each with a heading and a paragraph 24 under it. */
export function PhotoCards({
  cards,
}: {
  cards: { title: string; body: string; image?: string }[];
}) {
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
