import Image from "next/image";
import type { ArticleBlock, PhotoRatio } from "@/lib/article";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { QuoteMarks } from "@/components/ui/QuoteMarks";

// The mobile h1 is 24px, so a 24px subtitle would tie with it; no subtitle is
// in the file at this width, so 18px/24px here is an interpolation.
const SUBTITLE = "text-balance text-lg/6 font-medium text-inherit lg:text-4xl/11";
const BODY = "text-pretty text-sm/[16px] tracking-[1px] text-inherit lg:text-[30px]/9 lg:tracking-normal";
const QUOTE_LEAD = "text-xl/6 font-medium lg:text-[32px]/[38.72px] lg:tracking-[0.32px]";
const QUOTE_BODY = "text-base/5 lg:text-2xl/[29px] lg:tracking-[0.24px]";
const CAPTION = "mt-3 text-sm text-ink/70 lg:mt-4 lg:text-base";

/** The proportions each box is cut to; `auto` is worked out from the photo. */
const RATIOS: Record<Exclude<PhotoRatio, "auto">, string> = {
  square: "1 / 1",
  landscape: "3 / 2",
  portrait: "2 / 3",
  panorama: "21 / 9",
};

/**
 * Storyblok writes a picture's size into its address - .../f/123/1200x800/... -
 * so a photo can keep its own proportions without being fetched first. A photo
 * from anywhere else has no such number and falls back to the 4:3 of a camera.
 */
function naturalRatio(src: string) {
  const found = /\/(\d{2,5})x(\d{2,5})\//.exec(src);
  return found ? `${found[1]} / ${found[2]}` : "4 / 3";
}

function ratioOf(ratio: PhotoRatio, src: string) {
  return ratio === "auto" ? naturalRatio(src) : RATIOS[ratio];
}

/**
 * A photo in a box of the asked shape, the grey smiley under it for the empty
 * or broken case. `fill` makes the box take whatever its parent gives it - the
 * mosaic cells size themselves.
 */
function Photo({
  src,
  ratio = "square",
  sizes = "(min-width: 1024px) 47vw, 100vw",
  fill = false,
}: {
  src: string;
  ratio?: PhotoRatio;
  sizes?: string;
  fill?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${fill ? "h-full w-full" : "w-full"}`}
      style={fill ? undefined : { aspectRatio: ratioOf(ratio, src) }}
    >
      <ImagePlaceholder />
      {/* A hairline of pure black at 10% keeps a pale photo from dissolving into
          the white page; inset so it never adds to the box */}
      {src && (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover outline outline-1 -outline-offset-1 outline-black/10"
        />
      )}
    </div>
  );
}

function Figure({
  src,
  caption,
  ratio,
  sizes,
}: {
  src: string;
  caption?: string;
  ratio?: PhotoRatio;
  sizes?: string;
}) {
  return (
    <figure className="m-0">
      <Photo src={src} ratio={ratio} sizes={sizes} />
      {caption && <figcaption className={CAPTION}>{caption}</figcaption>}
    </figure>
  );
}

const Paragraphs = ({ body }: { body: string[] }) =>
  body.map((p, i) => (
    <p key={i} className={`mt-4 lg:mt-8 ${BODY}`}>
      {p}
    </p>
  ));

/** How many photos stand in a row: up to four, then they wrap. Two across even on a phone. */
const COLUMNS: Record<number, string> = {
  1: "",
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

const GAP = "gap-4 lg:gap-10";

/** A video address as the player's own embed address, or null for any other. */
function embedUrl(url: string) {
  const youtube = /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/.exec(url);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const rutube = /rutube\.ru\/(?:video|play\/embed)\/([\da-f]{16,})/i.exec(url);
  if (rutube) return `https://rutube.ru/play/embed/${rutube[1]}`;
  return null;
}

/** Renders one article block; the quote band goes full-bleed. */
function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "images": {
      const count = Math.min(block.images.length, 4);
      return (
        <div className="px-4 lg:px-10">
          <div className={`grid ${GAP} ${COLUMNS[count] ?? COLUMNS[4]}`}>
            {block.images.map((src, i) => (
              <Photo
                key={i}
                src={src}
                ratio={block.ratio ?? "square"}
                sizes={count >= 3 ? "31vw" : "47vw"}
              />
            ))}
          </div>
          {block.caption && <p className={CAPTION}>{block.caption}</p>}
        </div>
      );
    }

    case "text-image": {
      const left = block.side === "left";
      const third = block.width === "third";
      // The photo sits second in the markup, so on a phone the text comes first
      // whichever side it takes on a wide screen.
      const columns = third
        ? left
          ? "lg:grid-cols-[1fr_2fr]"
          : "lg:grid-cols-[2fr_1fr]"
        : "lg:grid-cols-2";
      return (
        <div className={`grid gap-4 px-4 lg:gap-10 lg:px-10 ${columns}`}>
          <div>
            {block.subtitle && <h2 className={SUBTITLE}>{block.subtitle}</h2>}
            <Paragraphs body={block.body} />
          </div>
          <figure className={`m-0 ${left ? "lg:order-first" : ""}`}>
            <Photo src={block.image} ratio={block.ratio ?? "square"} />
            {block.caption && (
              // No caption in the file at this width either; 14px here is the
              // same kind of interpolation as the subtitle above.
              <figcaption className="mt-4 text-sm text-ink lg:mt-6 lg:text-2xl">
                {block.caption}
              </figcaption>
            )}
          </figure>
        </div>
      );
    }

    case "text-photos":
      return (
        <div className="grid gap-4 px-4 lg:grid-cols-2 lg:gap-10 lg:px-10">
          <div>
            {block.subtitle && <h2 className={SUBTITLE}>{block.subtitle}</h2>}
            <Paragraphs body={block.body} />
          </div>
          <div
            className={`flex flex-col ${GAP} ${block.side === "left" ? "lg:order-first" : ""}`}
          >
            {block.images.map((src, i) => (
              <Photo key={i} src={src} ratio={block.ratio} />
            ))}
          </div>
        </div>
      );

    case "photo": {
      const place = { left: "justify-start", center: "justify-center", right: "justify-end" }[
        block.align
      ];
      // Full runs to the edges of the screen; the others keep the page margin,
      // and the small ones only take a part of the width.
      const width = {
        full: "w-full",
        wide: "w-full",
        medium: "w-full lg:w-3/5",
        small: "w-1/2 lg:w-[30%]",
      }[block.size];
      return (
        <div
          className={`flex ${place} ${block.size === "full" ? "" : "px-4 lg:px-10"}`}
        >
          <div className={width}>
            <Figure
              src={block.image}
              caption={block.caption}
              ratio={block.ratio}
              sizes={block.size === "full" ? "100vw" : "(min-width: 1024px) 60vw, 100vw"}
            />
          </div>
        </div>
      );
    }

    case "photo-row": {
      const count = Math.min(block.items.length, 4);
      return (
        <div className={`grid px-4 lg:px-10 ${GAP} ${COLUMNS[count] ?? COLUMNS[4]}`}>
          {block.items.map((item, i) => (
            <Figure
              key={i}
              src={item.image}
              caption={item.caption}
              ratio={block.ratio}
              sizes={count >= 3 ? "31vw" : "47vw"}
            />
          ))}
        </div>
      );
    }

    case "gallery-scroll": {
      const card = {
        small: "w-[45%] lg:w-[22%]",
        medium: "w-[75%] lg:w-[36%]",
        large: "w-[88%] lg:w-[58%]",
      }[block.size];
      return (
        <div>
          <div
            className={`flex snap-x snap-mandatory overflow-x-auto px-4 [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden scroll-px-4 lg:scroll-px-10 ${GAP}`}
          >
            {block.images.map((src, i) => (
              <div key={i} className={`shrink-0 snap-start ${card}`}>
                <Photo src={src} ratio={block.ratio} sizes="(min-width: 1024px) 40vw, 80vw" />
              </div>
            ))}
          </div>
          {block.caption && <p className={`px-4 lg:px-10 ${CAPTION}`}>{block.caption}</p>}
        </div>
      );
    }

    case "gallery-mosaic": {
      const [first, second, third, ...rest] = block.images;
      const feature =
        block.layout !== "grid" && first && second && third
          ? { left: block.layout === "feature-left", rest }
          : null;
      return (
        <div className="px-4 lg:px-10">
          {feature ? (
            <>
              <div className={`grid aspect-[3/2] grid-cols-3 grid-rows-2 ${GAP}`}>
                <div
                  className={`col-span-2 row-span-2 row-start-1 ${feature.left ? "col-start-1" : "col-start-2"}`}
                >
                  <Photo src={first} fill sizes="(min-width: 1024px) 60vw, 100vw" />
                </div>
                {[second, third].map((src, i) => (
                  <div
                    key={i}
                    className={`row-span-1 ${feature.left ? "col-start-3" : "col-start-1"}`}
                  >
                    <Photo src={src} fill sizes="(min-width: 1024px) 30vw, 40vw" />
                  </div>
                ))}
              </div>
              {feature.rest.length > 0 && (
                <div className={`mt-4 grid grid-cols-2 lg:mt-10 lg:grid-cols-3 ${GAP}`}>
                  {feature.rest.map((src, i) => (
                    <Photo key={i} src={src} sizes="(min-width: 1024px) 31vw, 47vw" />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={`grid grid-cols-2 lg:grid-cols-3 ${GAP}`}>
              {block.images.map((src, i) => (
                <Photo key={i} src={src} sizes="(min-width: 1024px) 31vw, 47vw" />
              ))}
            </div>
          )}
          {block.caption && <p className={CAPTION}>{block.caption}</p>}
        </div>
      );
    }

    case "video": {
      const embed = embedUrl(block.url);
      return (
        <figure className="m-0 px-4 lg:px-10">
          {embed ? (
            <iframe
              src={embed}
              title={block.caption || "Видео"}
              loading="lazy"
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full border-0"
            />
          ) : (
            <a href={block.url} className="text-brand underline">
              {block.url}
            </a>
          )}
          {block.caption && <figcaption className={CAPTION}>{block.caption}</figcaption>}
        </figure>
      );
    }

    case "quote":
      // 40 of padding all round, a mark at the head and another at the foot of
      // the copy, and 40 between the marks and the text
      return (
        <div className="on-dark flex gap-4 bg-brand p-4 text-white lg:gap-10 lg:p-10">
          <QuoteMarks className="max-lg:h-[52px] max-lg:w-[73px]" />
          <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:gap-10">
            <div className="flex flex-1 flex-col gap-4 lg:gap-10">
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

    case "pullquote":
      return (
        <blockquote className="m-0 px-4 lg:px-10">
          <div className="border-l-4 border-brand pl-4 lg:pl-10">
            <p className="text-balance text-2xl/8 font-medium lg:text-[40px]/[48px]">{block.text}</p>
            {block.author && (
              <footer className="mt-4 font-mono text-sm uppercase tracking-[1px] text-muted lg:text-base">
                {block.author}
              </footer>
            )}
          </div>
        </blockquote>
      );

    case "lead":
      return (
        <div className="px-4 lg:px-10">
          {block.body.map((p, i) => (
            <p
              key={i}
              className={`text-pretty text-xl/7 font-medium lg:text-[40px]/[48px] ${i > 0 ? "mt-4 lg:mt-8" : ""}`}
            >
              {p}
            </p>
          ))}
        </div>
      );

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <div className="px-4 lg:px-10">
          {block.subtitle && <h2 className={SUBTITLE}>{block.subtitle}</h2>}
          <List
            className={`mt-4 pl-6 lg:mt-8 lg:pl-10 ${block.ordered ? "list-decimal" : "list-disc"} marker:text-brand ${BODY}`}
          >
            {block.items.map((item, i) => (
              <li key={i} className={i > 0 ? "mt-2 lg:mt-4" : ""}>
                {item}
              </li>
            ))}
          </List>
        </div>
      );
    }

    case "text-columns":
      return (
        <div className="px-4 lg:px-10">
          {block.subtitle && <h2 className={SUBTITLE}>{block.subtitle}</h2>}
          <div className="lg:columns-2 lg:gap-10">
            {block.body.map((p, i) => (
              <p key={i} className={`mt-4 break-inside-avoid-column lg:mt-8 ${BODY} ${i === 0 ? "lg:mt-8" : ""}`}>
                {p}
              </p>
            ))}
          </div>
        </div>
      );

    case "divider":
      return block.style === "dots" ? (
        <div
          aria-hidden="true"
          className="text-center font-mono text-2xl tracking-[1em] text-brand"
        >
          •••
        </div>
      ) : (
        <hr className="mx-4 border-0 border-t border-ink/15 lg:mx-10" />
      );

    case "spacer":
      return (
        <div
          aria-hidden="true"
          className={{ s: "h-0", m: "h-6 lg:h-10", l: "h-12 lg:h-24" }[block.size]}
        />
      );

    case "text":
      return (
        <div className="px-4 lg:px-10">
          {block.subtitle && <h2 className={SUBTITLE}>{block.subtitle}</h2>}
          <Paragraphs body={block.body} />
        </div>
      );
  }
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="flex flex-col gap-4 lg:gap-10">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
