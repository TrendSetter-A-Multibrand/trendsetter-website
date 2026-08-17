import Image from "next/image";
import Link from "next/link";
import { ReadOverlay } from "@/components/ui/ReadOverlay";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

import type { Article } from "@/lib/articles";

type ArticleCardProps = {
  article: Article;
  /** Cards on the red band carry white text instead of red tags on dark type. */
  onBrand?: boolean;
  sizes?: string;
  /** Search results pick the matched word out of the title in red. */
  highlight?: string;
};

/** Splits the title on the query; the mockup sets the matched part red and up. */
function mark(title: string, query: string) {
  const needle = query.trim();
  if (!needle) return title;
  const parts = title.split(new RegExp(`(${escape(needle)})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === needle.toLowerCase() ? (
      <span key={i} className="uppercase text-brand">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function ArticleCard({
  article,
  onBrand,
  sizes,
  highlight,
}: ArticleCardProps) {
  return (
    <Link href={article.href ?? "#"} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <ImagePlaceholder />
        {article.image && (
          <Image
            src={article.image}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
          />
        )}
        <ReadOverlay />
      </div>

      <p
        className={`mt-6 font-mono text-sm/[18px] font-medium uppercase tracking-[1px] ${
          onBrand ? "text-white" : "text-brand"
        }`}
      >
        {article.tags.map((tag) => `[${tag}]`).join(" ")}
      </p>

      <p
        className={`mt-4 text-2xl/[29px] font-medium ${
          onBrand ? "text-white" : "text-ink"
        }`}
      >
        {highlight ? mark(article.title, highlight) : article.title}
      </p>
    </Link>
  );
}
