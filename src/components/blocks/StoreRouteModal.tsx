"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { buttonClass } from "@/components/ui/Button";
import { DetailRow } from "@/components/ui/DetailRow";
import { StoreMap } from "@/components/ui/StoreMap";
import { routeHref } from "@/lib/ymaps";
import type { Store } from "@/lib/stores";

/**
 * The sheet a shop card opens, as the file draws it (2528:8142): the name with
 * its categories under it, a map across the full width of the card, the shop
 * written out beside «Как пройти», and the route handed to Яндекс Карты in one
 * of three modes.
 *
 * Drawing the route here instead would need the paid routing licence, and would
 * still be worse - no traffic, no handover to the phone's navigation, and it
 * would have to ask for the reader's location first. So the sheet keeps the
 * brand and the information, and the last step goes where it works properly.
 */
const MODES = [
  { id: "auto", label: "На машине" },
  { id: "mt", label: "Транспортом" },
  { id: "pd", label: "Пешком" },
] as const;

/**
 * The card holds 40 of air, but the map runs edge to edge - so the padding sits
 * on the blocks either side of the map rather than on the card itself.
 */
const GUTTER = "px-6 lg:px-10";

export function StoreRouteModal({
  store,
  onClose,
}: {
  store: Store;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // The page behind must not scroll while the sheet is open
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Как добраться: ${store.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative flex max-h-full w-full max-w-[1280px] flex-col gap-6 overflow-y-auto bg-white py-6 text-ink lg:gap-10 lg:py-10">
        <div className={`flex items-start justify-between gap-6 ${GUTTER}`}>
          <div className="flex min-w-0 flex-col gap-2">
            {/* The name is set plainly here. The brackets on this screen belong
                to the categories under it, and two bracketed things one above
                the other read as one list. */}
            <p className="text-lg font-medium tracking-[1px] lg:text-2xl/none">
              {store.name}
            </p>

            {store.tags.length > 0 && (
              <ul className="flex flex-wrap items-center gap-2">
                {store.tags.map((tag) => (
                  <li
                    key={tag}
                    className="font-mono text-sm/none font-medium uppercase tracking-[1px] text-brand"
                  >
                    [{tag}]
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="shrink-0 transition-colors hover:text-brand"
          >
            <CloseIcon />
          </button>
        </div>

        {/* 400 tall in the file, and edge to edge - the only block here that
            ignores the gutter. Shorter on a phone, where 400 is most of it. */}
        <StoreMap
          center={store.coords}
          className="h-[260px] w-full overflow-hidden lg:h-[400px]"
        />

        <div className={`flex flex-col gap-6 lg:gap-10 ${GUTTER}`}>
          {/* 588 of shop beside whatever is left for the walk in */}
          <div className="flex flex-col gap-6 lg:flex-row">
            <dl className="flex flex-col gap-2 text-sm lg:w-[588px] lg:shrink-0 lg:text-base/5">
              <DetailRow label="Адрес" value={store.address} />
              <DetailRow label="Часы работы" value={store.hours} />
              <DetailRow label="Телефон" value={store.phone} />
              <DetailRow label="Кол-во брендов" value={store.brandCount} />
              <DetailRow label="Ассортимент" value={store.assortment} />
            </dl>

            <div className="flex min-w-0 flex-1 flex-col gap-3 lg:gap-4">
              <p className="text-lg font-medium tracking-[1px] lg:text-2xl/none">
                Как пройти:
              </p>
              <div className="text-sm lg:text-base/5">
                {store.directions.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Three of the same button in the file - none of them is the red
                one this sheet used to lead with. Яндекс Карты know where the
                reader is and what the traffic is doing, and on a phone they
                hand the route straight to the navigator. */}
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
              {MODES.map((mode) => (
                <a
                  key={mode.id}
                  href={routeHref(store.coords, mode.id)}
                  target="_blank"
                  rel="noreferrer"
                  className={`${buttonClass("outline")} lg:min-w-[180px] lg:flex-1`}
                >
                  {mode.label}
                </a>
              ))}
            </div>

            <p className="text-sm text-muted lg:text-base/5">
              Маршрут откроется в Яндекс Картах — там же будут пробки и переход в
              навигатор.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** 24 in the file. The same cross the side menu and the notice sheet carry. */
function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 5 14 14M19 5 5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
