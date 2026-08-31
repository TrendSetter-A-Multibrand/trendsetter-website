"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ReadOverlay } from "@/components/ui/ReadOverlay";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * The three states the library draws for an image slot, in one place: flat
 * #f7f7f7 while the photo is on its way, the grey smiley if it fails or was
 * never supplied, the photo itself once it arrives.
 *
 * The ground stays mounted under the photo. It costs nothing, and it means a
 * photo already in the cache before hydration has nothing to switch off - so
 * failure is the only thing held as state, and the only reason for the client.
 *
 * Expects a positioned, clipped parent, and a `group` for the hover plate.
 */
export function CardImage({
  src,
  sizes,
  label,
}: {
  src?: string;
  sizes?: string;
  /** Set to draw the file's hover plate over the photo, with this label on it. */
  label?: string;
}) {
  const [failed, setFailed] = useState(!src);

  return (
    <>
      {failed ? <ImagePlaceholder /> : <Skeleton />}

      {src && !failed && (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}

      {label && <ReadOverlay label={label} broken={failed} />}
    </>
  );
}
