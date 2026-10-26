import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * The file's Split ("О нас"): the text on columns 1-4 - 437 - and the photo
 * across the rest, as tall as the text and never under 360. Below 1280 the text
 * takes two thirds and the photo goes under it at 21:9; on a phone the text and
 * then a 343x240 photo. The heading is H2, the first paragraph Body L and any
 * after it Body. 48 of air over it, none under: the next block keeps its own
 * 128.
 */
export function TextWithPhoto({
  title,
  body,
  image,
}: {
  title: string;
  body: string;
  image?: string;
}) {
  const [lead, ...rest] = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className="px-4 pt-6 md:px-10 md:pt-12">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
        <div className="flex flex-col justify-center gap-6 md:max-w-[66%] xl:w-[437px] xl:max-w-none xl:shrink-0">
          <h2 className="type-h2 text-ink">{title}</h2>
          {lead && <p className="type-body-l text-ink">{lead}</p>}
          {rest.map((paragraph, i) => (
            <p key={i} className="type-body text-ink">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="relative aspect-[343/240] w-full overflow-hidden md:aspect-[21/9] xl:aspect-auto xl:min-h-[360px] xl:flex-1">
          <ImagePlaceholder />
          {image && (
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1280px) 900px, 92vw"
              className="object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
