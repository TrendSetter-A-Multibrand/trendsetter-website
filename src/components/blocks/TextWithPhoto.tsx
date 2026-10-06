import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * Two 900 columns 40 apart: a heading and its copy on the left, a square photo
 * on the right. The text is centred against the photo rather than sitting at
 * its top, which is what the file draws whatever the length of the copy.
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
  return (
    <section className="grid gap-10 px-6 py-10 lg:grid-cols-2 lg:px-10">
      <div className="flex flex-col justify-center gap-10">
        <h2 className="text-xl font-medium tracking-[0.24px] lg:text-2xl/[29px]">
          {title}
        </h2>
        {/* At 375 the file sets the copy in mono 14/18, centred; the heading
            stays as it was. */}
        <p className="text-center font-mono text-sm/[18px] lg:text-left lg:font-sans lg:text-xl/[24.2px] lg:tracking-[0.2px]">
          {body}
        </p>
      </div>

      <div className="relative aspect-square w-full overflow-hidden">
        <ImagePlaceholder />
        {image && (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 47vw, 92vw"
            className="object-cover"
          />
        )}
      </div>
    </section>
  );
}
