import Image from "next/image";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * The file's Next material, which closes an article: a Paper plate with
 * "[Следующий материал]" over the title in H3 at the left and a small photo at
 * the right - 200 wide on a desktop, 96 on a phone. Under the pointer the title
 * turns Red.
 */
export function NextMaterial({
  href,
  title,
  image,
}: {
  href: string;
  title: string;
  image?: string;
}) {
  return (
    <Link
      href={href}
      className="group mx-auto flex w-full max-w-[770px] items-center gap-4 bg-surface p-4 text-ink md:p-8"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="type-caption">[Следующий материал]</p>
        <p className="type-h3 transition-colors duration-150 group-hover:text-brand">{title}</p>
      </div>
      <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-white md:w-[200px]">
        <ImagePlaceholder />
        {image && <Image src={image} alt="" fill sizes="200px" className="object-cover" />}
      </div>
    </Link>
  );
}
