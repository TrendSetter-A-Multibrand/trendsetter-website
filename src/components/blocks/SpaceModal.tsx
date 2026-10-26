"use client";

import { ModalPhoto, ModalSheet } from "@/components/ui/ModalSheet";
import { StockRow } from "@/components/ui/StockRow";
import { ModalEventsRow } from "@/components/blocks/ModalEventsRow";
import type { SpaceCardData } from "@/lib/space";

/**
 * The file's zone sheet, on the Sheet: the zone's rubric in Red brackets over
 * its name in H2, a 21:9 photo and the write-up in Body. Shops with the goods and
 * the events coming up follow only where the card has them - the file draws
 * neither - and a section with nothing to show is not drawn at all.
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
    <ModalSheet title={card.title} labels={card.label ? [card.label] : undefined} onClose={onClose}>
      <ModalPhoto src={card.image} />

      {card.body && (
        <div className="type-body whitespace-pre-line px-4 md:px-8">{card.body}</div>
      )}

      {stores.length > 0 && (
        <section className="flex flex-col gap-3 px-4 md:px-8">
          <h3 className="type-label">[Наличие в магазинах]</h3>
          <ul>
            {stores.map((store) => (
              <StockRow key={store.name} shop={store.name} available={store.available} />
            ))}
          </ul>
        </section>
      )}

      <ModalEventsRow events={card.events ?? []} />
    </ModalSheet>
  );
}
