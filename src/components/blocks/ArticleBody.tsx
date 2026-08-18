import Image from "next/image";
import type { ArticleBlock } from "@/lib/article";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { QuoteMarks } from "@/components/ui/QuoteMarks";

const SUBTITLE = "text-2xl/8 font-medium text-inherit lg:text-4xl/11";
const BODY = "text-lg/7 text-inherit lg:text-[30px]/9";
const QUOTE_LEAD = "text-xl/6 font-medium lg:text-[32px]/[38.72px] lg:tracking-[0.32px]";
const QUOTE_BODY = "text-base/5 lg:text-2xl/[29px] lg:tracking-[0.24px]";

/** Renders one article block; the quote band goes full-bleed. */
function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "images":
      return (
        <div
          className={`grid gap-10 px-6 lg:px-10 ${
            block.images.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {block.images.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden">
              <ImagePlaceholder />
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
            <div className="relative aspect-square overflow-hidden">
              <ImagePlaceholder />
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

    case "quote":
      // 40 of padding all round, a mark at the head and another at the foot of
      // the copy, and 40 between the marks and the text
      return (
        <div className="on-dark flex gap-6 bg-brand p-6 text-white lg:gap-10 lg:p-10">
          <QuoteMarks className="max-lg:h-[52px] max-lg:w-[73px]" />
          <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:gap-10">
            <div className="flex flex-1 flex-col gap-6 lg:gap-10">
              {block.subtitle && <h2 className={QUOTE_LEAD}>{block.subtitle}</h2>}
              {block.body.map((p, i) => (
                <p key={i} className={QUOTE_BODY}>
                  {p}
                </p>
              ))}
            </div>
            <QuoteMarks className="self-end max-lg:h-[52px] max-lg:w-[73px]" />
          </div>
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
    <div className="flex flex-col gap-10">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
