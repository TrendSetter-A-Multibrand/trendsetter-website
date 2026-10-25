import Image from "next/image";
import Link from "next/link";
import type { ArticleBlock, PhotoRatio } from "@/lib/article";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Divider } from "@/components/ui/Divider";
import { ArrowIcon } from "@/components/ui/Icons";
import { GalleryStrip } from "@/components/blocks/GalleryStrip";

/* The file's article column. Text sits in 770, the wide blocks - photos, pairs,
   galleries, the pull quote - step one column out either side to 1000, and a
   full photo runs to the edges. Everything is 24 from the next block on a
   desktop, 16 on a phone. Text is Prose (21 / 17 on a phone, 1.6 apart). */
const SUBTITLE = "type-h3 text-ink";
const BODY = "type-prose text-ink";
const CAPTION = "type-caption mt-3 text-ink";

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
      {src && <Image src={src} alt="" fill sizes={sizes} className="object-cover" />}
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

const Paragraphs = ({ body }: { body: string[] }) => (
  <div className="flex flex-col gap-4 md:gap-6">
    {body.map((p, i) => (
      <p key={i} className={BODY}>
        {p}
      </p>
    ))}
  </div>
);

/** A subtitle over paragraphs, the way a text block of the file is set. */
const TextPart = ({ subtitle, body }: { subtitle?: string; body: string[] }) => (
  <div className="flex flex-col gap-4 md:gap-6">
    {subtitle && <h2 className={SUBTITLE}>{subtitle}</h2>}
    <Paragraphs body={body} />
  </div>
);

/** How many photos stand in a row: up to four, then they wrap. Two across even on a phone. */
const COLUMNS: Record<number, string> = {
  1: "",
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

const GAP = "gap-3 md:gap-6";

/** A video address as the player's own embed address, or null for any other. */
function embedUrl(url: string) {
  const youtube = /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/.exec(url);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const rutube = /rutube\.ru\/(?:video|play\/embed)\/([\da-f]{16,})/i.exec(url);
  if (rutube) return `https://rutube.ru/play/embed/${rutube[1]}`;
  return null;
}

/** Where a link from the editor leads: a path without a locale gets the page's. */
function hrefOf(href: string, locale: string) {
  if (!href) return "#";
  if (/^[a-z]+:/i.test(href) || href.startsWith("/")) return href;
  return `/${locale}/${href}`;
}

/** Renders one article block. Width and air are the wrapper's, below. */
function BlockBody({ block, locale }: { block: ArticleBlock; locale: string }) {
  switch (block.kind) {
    case "images": {
      const count = Math.min(block.images.length, 4);
      return (
        <div>
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
          ? "md:grid-cols-[1fr_2fr]"
          : "md:grid-cols-[2fr_1fr]"
        : "md:grid-cols-2";
      return (
        <div className={`grid gap-4 md:gap-6 ${columns}`}>
          <TextPart subtitle={block.subtitle} body={block.body} />
          <figure className={`m-0 ${left ? "md:order-first" : ""}`}>
            <Photo src={block.image} ratio={block.ratio ?? "square"} />
            {block.caption && <figcaption className={CAPTION}>{block.caption}</figcaption>}
          </figure>
        </div>
      );
    }

    case "text-photos":
      return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <TextPart subtitle={block.subtitle} body={block.body} />
          <div className={`flex flex-col ${GAP} ${block.side === "left" ? "md:order-first" : ""}`}>
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
      const width = {
        full: "w-full",
        wide: "w-full",
        medium: "w-full md:w-3/5",
        small: "w-1/2 md:w-[30%]",
      }[block.size];
      return (
        <div className={`flex ${place}`}>
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
        <div className={`grid ${GAP} ${COLUMNS[count] ?? COLUMNS[4]}`}>
          {block.items.map((item, i) => (
            <div key={i}>
              <Figure
                src={item.image}
                caption={item.caption}
                ratio={block.ratio}
                sizes={count >= 3 ? "31vw" : "47vw"}
              />
              {/* Words of its own under the photo: what makes a row of them
                  a row of little articles rather than a row of pictures */}
              {(item.title || item.body.length > 0) && (
                <div className="mt-4 flex flex-col gap-2 md:mt-6">
                  {item.title && <h3 className="type-h4 text-ink">{item.title}</h3>}
                  {item.body.map((p, j) => (
                    <p key={j} className="type-body-s text-ink">
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    case "gallery-scroll": {
      const card = {
        small: "w-[45%] md:w-[22%]",
        medium: "w-[75%] md:w-[36%]",
        large: "w-[88%] md:w-[58%]",
      }[block.size];
      return (
        <div>
          <GalleryStrip
            className={`flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${GAP}`}
          >
            {block.images.map((src, i) => (
              <div key={i} className={`shrink-0 snap-start ${card}`}>
                <Photo src={src} ratio={block.ratio} sizes="(min-width: 1024px) 40vw, 80vw" />
              </div>
            ))}
          </GalleryStrip>
          {block.caption && <p className={CAPTION}>{block.caption}</p>}
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
        <div>
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
                <div className={`mt-3 grid grid-cols-2 md:mt-6 md:grid-cols-3 ${GAP}`}>
                  {feature.rest.map((src, i) => (
                    <Photo key={i} src={src} sizes="(min-width: 1024px) 31vw, 47vw" />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={`grid grid-cols-2 md:grid-cols-3 ${GAP}`}>
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
        <figure className="m-0">
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

    // The quote in the column: a 2px Red rule at the left, the words in H3 and
    // the speaker in Caption underneath. The old red band is gone from the file;
    // what the editor put in the subtitle is the speaker now.
    case "quote":
      return (
        <blockquote className="m-0 flex flex-col gap-3 border-l-2 border-brand pl-6">
          {block.body.map((p, i) => (
            <p key={i} className="type-h3 text-ink">
              {p}
            </p>
          ))}
          {block.subtitle && <footer className="type-caption text-ink">— {block.subtitle}</footer>}
        </blockquote>
      );

    // The pull quote: H2 with Red guillemets and a mono line under it, a column out
    case "pullquote":
      return (
        <blockquote className="m-0 flex flex-col gap-4">
          <p className="type-h2 text-ink">
            <span className="text-brand">«</span>
            {block.text}
            <span className="text-brand">»</span>
          </p>
          {block.author && <footer className="type-label text-text-2">{block.author}</footer>}
        </blockquote>
      );

    case "lead":
      return (
        <div className="flex flex-col gap-4 md:gap-6">
          {block.body.map((p, i) => (
            <p key={i} className="type-prose-lead text-ink">
              {p}
            </p>
          ))}
        </div>
      );

    // Dashes, or numbers in mono Red; 8 between items, 12 between numbered ones
    case "list":
      return (
        <div className="flex flex-col gap-4 md:gap-6">
          {block.subtitle && <h2 className={SUBTITLE}>{block.subtitle}</h2>}
          <ul className={`flex flex-col ${block.ordered ? "gap-3" : "gap-2"}`}>
            {block.items.map((item, i) => (
              <li key={i} className={`flex items-start ${block.ordered ? "gap-4" : "gap-2"}`}>
                {block.ordered ? (
                  <span className="type-label w-7 shrink-0 text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                ) : (
                  <span className="type-prose shrink-0 text-ink">—</span>
                )}
                <span className={`min-w-0 flex-1 ${BODY}`}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "text-columns":
      return (
        <div className="flex flex-col gap-4 md:gap-6">
          {block.subtitle && <h2 className={SUBTITLE}>{block.subtitle}</h2>}
          <div className="md:columns-2 md:gap-6">
            {block.body.map((p, i) => (
              <p key={i} className={`mb-4 break-inside-avoid-column md:mb-6 ${BODY}`}>
                {p}
              </p>
            ))}
          </div>
        </div>
      );

    case "divider":
      return block.style === "dots" ? (
        <div className="py-6 md:py-12">
          <Divider type="dots" />
        </div>
      ) : (
        <hr className="m-0 border-0 border-t border-line" />
      );

    case "spacer":
      return (
        <div
          aria-hidden="true"
          className={{ s: "h-0", m: "h-6 md:h-10", l: "h-12 md:h-24" }[block.size]}
        />
      );

    case "text":
      return <TextPart subtitle={block.subtitle} body={block.body} />;

    case "question":
      return <p className="type-prose font-medium text-ink">{block.text}</p>;

    case "answer":
      return (
        <p className={BODY}>
          {block.name && <span className="type-label mr-1 text-brand">{block.name}: </span>}
          {block.text}
        </p>
      );

    case "note":
      return (
        <aside className="flex flex-col gap-2 bg-surface p-6 text-ink">
          <p className="type-label">[{block.label ?? "Справка"}]</p>
          <p className="type-body">{block.text}</p>
        </aside>
      );

    case "person":
      return (
        <div className="flex items-center gap-4 border-y border-line py-4">
          <div className="relative size-24 shrink-0 overflow-hidden bg-surface md:size-[120px]">
            <ImagePlaceholder />
            {block.image && (
              <Image src={block.image} alt="" fill sizes="120px" className="object-cover" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="type-label text-brand">[{block.label ?? "Интервью"}]</p>
            <p className="type-h4 text-ink">{block.name}</p>
            {block.role && <p className="type-caption text-ink">{block.role}</p>}
          </div>
        </div>
      );

    case "brands":
      return (
        <div className="flex flex-col gap-3">
          <p className="type-label text-ink">[{block.label ?? "Бренды в материале"}]</p>
          <ul className="divide-y divide-line">
            {block.names.map((name) => (
              <li key={name}>
                <Link
                  href={`/${locale}/brands`}
                  className="group flex items-center gap-4 py-4 text-ink"
                >
                  <span className="type-h4 min-w-0 flex-1 transition-colors duration-150 group-hover:text-brand">
                    {name}
                  </span>
                  <ArrowIcon className="transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );

    case "readmore":
      return (
        <Link
          href={hrefOf(block.href, locale)}
          className="group flex items-center gap-4 bg-surface p-4 text-ink"
        >
          <div className="relative h-[72px] w-24 shrink-0 overflow-hidden bg-white md:h-[120px] md:w-40">
            <ImagePlaceholder />
            {block.image && (
              <Image src={block.image} alt="" fill sizes="160px" className="object-cover" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="type-label">[{block.label ?? "Читайте также"}]</p>
            <p className="type-h4 transition-colors duration-150 group-hover:text-brand">
              {block.title}
            </p>
          </div>
        </Link>
      );

    case "credits":
      return (
        <dl className="type-caption m-0 flex flex-wrap gap-x-8 gap-y-3 text-ink">
          {block.items.map((item, i) => (
            <div key={i} className="flex flex-col gap-1">
              {item.role && <dt className="type-label">{item.role}</dt>}
              <dd className="m-0">{item.name}</dd>
            </div>
          ))}
        </dl>
      );
  }
}

/**
 * A text the editor put over or under a group of photos, set like a text block
 * of its own so the groups can read as text-and-pictures, not pictures alone.
 */
function Block({ block, locale }: { block: ArticleBlock; locale: string }) {
  // The pull quote has a `text` too, but that one is a string, not a PhotoText
  const text = "text" in block && typeof block.text === "object" ? block.text : undefined;
  if (!text) return <BlockBody block={block} locale={locale} />;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {text.position === "above" && <TextPart subtitle={text.subtitle} body={text.body} />}
      <BlockBody block={block} locale={locale} />
      {text.position === "below" && <TextPart subtitle={text.subtitle} body={text.body} />}
    </div>
  );
}

/** How wide a block stands: text in 770, the wide ones a column out to 1000, a full photo edge to edge. */
function widthOf(block: ArticleBlock): "text" | "wide" | "full" {
  switch (block.kind) {
    case "photo":
      return block.size === "full" ? "full" : "wide";
    case "images":
    case "text-image":
    case "text-photos":
    case "photo-row":
    case "gallery-scroll":
    case "gallery-mosaic":
    case "video":
    case "pullquote":
    case "text-columns":
      return "wide";
    default:
      return "text";
  }
}

const COLUMN = {
  text: "mx-auto w-full max-w-[770px] px-4 md:px-0",
  wide: "mx-auto w-full max-w-[1000px] px-4 md:px-0",
  full: "w-full",
} as const;

/**
 * The article's body: blocks one under another, 24 apart on a desktop and 16 on
 * a phone, each in the column the file gives it - the text column is 770 and the
 * wide blocks are 1000, centred on the 1000 column the head and the photo use.
 */
export function ArticleBody({
  blocks,
  locale = "ru_ru",
}: {
  blocks: ArticleBlock[];
  locale?: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {blocks.map((block, i) => (
        <div key={i} className={COLUMN[widthOf(block)]}>
          <Block block={block} locale={locale} />
        </div>
      ))}
    </div>
  );
}
