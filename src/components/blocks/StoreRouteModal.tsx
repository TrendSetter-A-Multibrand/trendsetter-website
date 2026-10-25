"use client";

import { buttonClass } from "@/components/ui/Button";
import { ModalSheet } from "@/components/ui/ModalSheet";
import { StoreMap } from "@/components/ui/StoreMap";
import { Facts, type Fact } from "@/components/cards/Facts";
import { routeHref } from "@/lib/ymaps";
import type { Store } from "@/lib/stores";

/**
 * The sheet a shop opens, on the file's Sheet: the shop's name in H2 with its
 * categories in Red brackets over it, a map across the full width, the shop
 * written out as facts, how to walk in from the street, and the route handed to
 * Яндекс Карты in one of three modes.
 *
 * Drawing the route here instead would need the paid routing licence, and would
 * still be worse - no traffic, no handover to the phone's navigation, and it
 * would have to ask for the reader's location first. So the sheet keeps the
 * shop and the information, and the last step goes where it works properly.
 */
const MODES = [
  { id: "auto", label: "На машине" },
  { id: "mt", label: "Транспортом" },
  { id: "pd", label: "Пешком" },
] as const;

export function StoreRouteModal({ store, onClose }: { store: Store; onClose: () => void }) {
  const facts: Fact[] = [
    { label: "Адрес", value: store.address },
    { label: "Часы", value: store.hours },
    { label: "Телефон", value: store.phone },
    ...(store.brandCount ? [{ label: "Брендов", value: store.brandCount }] : []),
    ...(store.assortment ? [{ label: "Ассортимент", value: store.assortment }] : []),
    ...(store.directions.length
      ? [
          {
            label: "Как пройти",
            value: store.directions.map((line, i) => <p key={i}>{line}</p>),
          },
        ]
      : []),
  ].filter((fact) => fact.value);

  return (
    <ModalSheet title={store.name} labels={store.tags} onClose={onClose}>
      {/* Edge to edge: the one block that ignores the sheet's own margins */}
      <StoreMap center={store.coords} className="h-60 w-full overflow-hidden md:aspect-[21/9] md:h-auto" />

      <div className="flex flex-col gap-6 px-4 md:gap-8 md:px-8">
        <Facts items={facts} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:flex-row">
            {MODES.map((mode) => (
              <a
                key={mode.id}
                href={routeHref(store.coords, mode.id)}
                target="_blank"
                rel="noreferrer"
                className={`${buttonClass("outline", "M")} md:flex-1`}
              >
                {mode.label}
              </a>
            ))}
          </div>
          <p className="type-body-s text-text-2">
            Маршрут откроется в Яндекс Картах — там же будут пробки и переход в навигатор.
          </p>
        </div>
      </div>
    </ModalSheet>
  );
}
