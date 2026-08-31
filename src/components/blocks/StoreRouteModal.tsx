"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { buttonClass } from "@/components/ui/Button";
import { StoreMap } from "@/components/ui/StoreMap";
import { routeHref } from "@/lib/ymaps";
import type { Store } from "@/lib/stores";

/**
 * The sheet behind «Построить маршрут»: our map, our details, and the route
 * itself handed off to Яндекс Карты.
 *
 * Drawing the route here instead would need the paid routing licence, and would
 * still be worse - no traffic, no handover to the phone's navigation, and it
 * would have to ask for the reader's location first. So the sheet keeps the
 * brand and the information, and the last step goes where it works properly.
 *
 * Built like the brand sheet: same dimmed backdrop, same white card, same cross.
 * Stands in until the designer draws one.
 */
const MODES = [
  { id: "auto", label: "На машине" },
  { id: "mt", label: "Транспортом" },
  { id: "pd", label: "Пешком" },
] as const;

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

      <div className="relative flex max-h-full w-full max-w-[1214px] flex-col overflow-y-auto bg-white p-6 lg:p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-lg uppercase tracking-[1px] lg:text-2xl/none">
              [{store.name}]
            </p>
            <p className="mt-2 text-sm text-muted lg:mt-3 lg:text-base">
              {store.address}
            </p>
          </div>

          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="shrink-0 p-1 transition-colors hover:text-brand"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="m1 1 16 16M17 1 1 17" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <StoreMap
          center={store.coords}
          className="mt-6 aspect-[16/9] w-full overflow-hidden lg:mt-8 lg:aspect-[1134/520]"
        />

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[429px_minmax(0,1fr)] lg:gap-10">
          <dl className="text-sm lg:text-base/7">
            <div className="flex gap-4">
              <dt className="font-bold text-muted">Часы работы:</dt>
              <dd>{store.hours}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="font-bold text-muted">Телефон:</dt>
              <dd>{store.phone}</dd>
            </div>
          </dl>

          <div>
            <p className="text-lg font-semibold lg:text-xl/[24px]">Как пройти:</p>
            <div className="mt-2 text-sm font-medium lg:text-base/[19px]">
              {store.directions.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Яндекс Карты know where the reader is and what the traffic is doing,
            and on a phone they hand the route straight to the navigator */}
        <div className="mt-8 flex flex-wrap gap-4 lg:mt-10">
          {MODES.map((mode, i) => (
            <a
              key={mode.id}
              href={routeHref(store.coords, mode.id)}
              target="_blank"
              rel="noreferrer"
              className={buttonClass(i === 0 ? "primary" : "outline")}
            >
              {mode.label}
            </a>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted">
          Маршрут откроется в Яндекс Картах — там же будут пробки и переход в
          навигатор.
        </p>
      </div>
    </div>,
    document.body,
  );
}
