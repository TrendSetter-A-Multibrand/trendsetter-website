import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * The file's Category tile: a square photo with a white plate along its foot
 * holding the name in mono and an arrow - "[1] Одежда ->". The plate goes Sage
 * under the pointer, its text white. 216 on a desktop, 160 on a phone, where the
 * plate is a little tighter. The photo fills the tile; `tint` is the colour
 * behind it while it loads.
 */
export function CategoryTile({
  href,
  label,
  image,
  tint = "bg-ext-blue",
}: {
  href: string;
  label: string;
  image?: string;
  tint?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative block aspect-square w-full overflow-hidden ${tint}`}
    >
      <CardImage src={image} sizes="216px" />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-white p-3 text-ink transition-colors duration-150 group-hover:bg-ink group-hover:text-white md:px-4">
        <span className="type-caption md:type-label min-w-0 flex-1">{label}</span>
        <ArrowIcon size={20} />
      </span>
    </Link>
  );
}
