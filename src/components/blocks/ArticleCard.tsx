import Image from "next/image";
import Link from "next/link";

export type Article = {
  tags: string[];
  title: string;
  href?: string;
  image?: string;
};

type ArticleCardProps = {
  article: Article;
  /** Cards on the red band carry white text instead of red tags on dark type. */
  onBrand?: boolean;
  sizes?: string;
};

export function ArticleCard({ article, onBrand, sizes }: ArticleCardProps) {
  return (
    <Link href={article.href ?? "#"} className="flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-surface-strong">
        {article.image && (
          <Image
            src={article.image}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
          />
        )}
      </div>

      <p
        className={`mt-6 font-mono text-sm uppercase ${
          onBrand ? "text-white" : "text-brand"
        }`}
      >
        {article.tags.map((tag) => `[${tag}]`).join(" ")}
      </p>

      <p className={`mt-3 text-2xl/[30px] ${onBrand ? "text-white" : "text-ink"}`}>
        {article.title}
      </p>
    </Link>
  );
}
