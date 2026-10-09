"use client";

import { Divider } from "@/components/ui/Divider";
import { Marker } from "@/components/ui/Marker";
import { ModalPhoto, ModalSheet } from "@/components/ui/ModalSheet";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ModalEventsRow } from "@/components/blocks/ModalEventsRow";
import type { SpaceCardData } from "@/lib/space";

/**
 * The sheet a Пространство card opens: the shell, a photo, the write-up and a
 * divider, then the shops the goods are in and the events coming up. A section
 * with nothing to show is not drawn, so a Collaboration card is just the first
 * half. (Unlike a brand's sheet there is no logo or tag line in the header.)
 */
export function SpaceModal({
  card,
  onClose,
}: {
  card: SpaceCardData;
  onClose: () => void;
}) {
  const stores = card.stores ?? [];

  return (
    <ModalSheet title={card.title} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <ModalPhoto src={card.image} />

        {card.body && (
          <div className="whitespace-pre-line px-6 text-base/5 lg:px-10">
            {card.body}
          </div>
        )}

        <div className="px-6 lg:px-10">
          <Divider />
        </div>
      </div>

      {stores.length > 0 && (
        <section className="flex flex-col gap-6">
          <SectionTitle heading="Наличие в магазинах" className="px-6 lg:px-10" />
          <ul className="flex flex-col gap-4 px-6 lg:px-10">
            {stores.map((store) => (
              <li
                key={store.name}
                className="flex items-center gap-4 text-sm/[19px] uppercase tracking-[1px]"
              >
                <Marker tone={store.available ? "green" : "red"} />
                {store.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      <ModalEventsRow events={card.events ?? []} />
    </ModalSheet>
  );
}
