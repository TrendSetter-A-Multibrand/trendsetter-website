import Image from "next/image";
import type { ArticleBlock } from "@/lib/article";
import { QuoteMarquee } from "@/components/ui/QuoteMarquee";

const SUBTITLE = "text-2xl/8 font-medium text-inherit lg:text-4xl/11";
const BODY = "text-lg/7 text-inherit lg:text-[30px]/9";

/** Renders one article block; the marquee and the red band go full-bleed. */
function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "marquee":
      return <QuoteMarquee text={block.text} size={block.size} />;

    case "images":
      return (
        <div
          className={`grid gap-10 px-6 lg:px-10 ${
            block.images.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {block.images.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-surface-strong">
              <Image
                src={src}
                alt=""
                fill
                sizes={block.images.length === 3 ? "31vw" : "47vw"}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      );

    case "text-image":
      return (
        <div className="grid gap-10 px-6 lg:grid-cols-2 lg:px-10">
          <div>
            {block.subtitle && <h2 className={SUBTITLE}>{block.subtitle}</h2>}
            {block.body.map((p, i) => (
              <p key={i} className={`mt-8 ${BODY}`}>
                {p}
              </p>
            ))}
          </div>
          <figure className="m-0">
            <div className="relative aspect-square overflow-hidden bg-surface-strong">
              <Image src={block.image} alt="" fill sizes="47vw" className="object-cover" />
            </div>
            {block.caption && (
              <figcaption className="mt-6 text-lg text-ink lg:text-2xl">
                {block.caption}
              </figcaption>
            )}
          </figure>
        </div>
      );

    case "brand":
      // 200px side padding inside the band, per the mockup
      return (
        <div className="bg-brand px-6 py-12 text-white lg:px-[200px] lg:py-[47px]">
          {block.subtitle && <h2 className={SUBTITLE}>{block.subtitle}</h2>}
          {block.body.map((p, i) => (
            <p key={i} className={`mt-8 ${BODY}`}>
              {p}
            </p>
          ))}
        </div>
      );

    case "text":
      return (
        <div className="px-6 lg:px-10">
          {block.subtitle && <h2 className={SUBTITLE}>{block.subtitle}</h2>}
          {block.body.map((p, i) => (
            <p key={i} className={`mt-8 ${BODY}`}>
              {p}
            </p>
          ))}
        </div>
      );
  }
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="flex flex-col gap-16">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
