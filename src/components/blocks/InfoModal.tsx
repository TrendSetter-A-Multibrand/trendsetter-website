"use client";

import { Divider } from "@/components/ui/Divider";
import { ModalPhoto, ModalSheet } from "@/components/ui/ModalSheet";

/**
 * The sheet a Collaboration card opens: the shell's header, a full-width photo,
 * body copy and the closing divider. (Space cards open SpaceModal, which adds
 * the shops and the events.)
 */
export function InfoModal({
  title,
  body,
  image,
  onClose,
}: {
  title: string;
  body?: string;
  image?: string;
  onClose: () => void;
}) {
  return (
    <ModalSheet title={title} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <ModalPhoto src={image} fixed />

        {body && (
          <div className="whitespace-pre-line px-6 text-base/5 lg:px-10">
            {body}
          </div>
        )}

        <div className="px-6 lg:px-10">
          <Divider />
        </div>
      </div>
    </ModalSheet>
  );
}
