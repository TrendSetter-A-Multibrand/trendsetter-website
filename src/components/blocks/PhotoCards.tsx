import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/** Three 586 squares with a heading and a paragraph under each. */
export function PhotoCards({
  cards,
}: {
  cards: { title: string; body: string }[];
}) {
  return (
    <section className="grid gap-10 px-6 lg:grid-cols-3 lg:px-10">
      {cards.map((card, i) => (
        <div key={i}>
          <div className="relative aspect-square w-full">
            <ImagePlaceholder />
          </div>
          <h2 className="mt-4 text-2xl lg:mt-6 lg:text-[36px]/[44px]">
            {card.title}
          </h2>
          <p className="mt-3 text-base lg:mt-4 lg:text-2xl/[29px]">{card.body}</p>
        </div>
      ))}
    </section>
  );
}
