"use client";

import { useMemo, useRef, useState } from "react";
import { ShopCard } from "@/components/cards/ShopCard";
import { buttonClass } from "@/components/ui/Button";
import { ArrowIcon, PinIcon } from "@/components/ui/Icons";
import { iconButtonClass } from "@/components/ui/iconButton";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import { ShopsMapView } from "@/components/ui/ShopsMapView";
import { StoreRouteModal } from "@/components/blocks/StoreRouteModal";
import type { Store } from "@/lib/stores";
import { routeHref } from "@/lib/ymaps";

/** Great-circle distance in kilometres between two [lng, lat] points. */
function kilometres([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]) {
  const rad = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lng2 - lng1) * rad) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

const label = (km: number) =>
  `${km < 10 ? km.toFixed(1).replace(".", ",") : Math.round(km)} км`;

/**
 * The file's Shops map. A toolbar under a Line rule with "Ближайшие ко мне",
 * which asks the browser where the reader is, puts a blue dot there, lists the
 * shops nearest first and writes the distance on each card. Under it, on a
 * desktop, the cards in a column of four and the map across the other eight,
 * staying put while the list scrolls; the chosen shop wears a Sage frame on its
 * card and a Sage plate on the map. Choosing is a click on either, or the pointer
 * resting on a card.
 *
 * On a phone one view at a time: a "Список / Карта" switch and the locate button
 * in the toolbar, the cards stacked, or the map taking the screen between the
 * header and the tab bar with the chosen shop in a card at the foot.
 */
export function ShopsMap({ stores }: { stores: Store[] }) {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<"list" | "map">("list");
  const [me, setMe] = useState<[number, number] | null>(null);
  const [asking, setAsking] = useState(false);
  const [refused, setRefused] = useState(false);
  const [sheet, setSheet] = useState<Store | null>(null);
  const cards = useRef<Record<number, HTMLElement | null>>({});

  // Nearest first once the reader's place is known, the editor's order before
  const ordered = useMemo(() => {
    const withDistance = stores.map((store) => ({
      store,
      km: me ? kilometres(me, store.coords) : undefined,
    }));
    return me ? [...withDistance].sort((a, b) => (a.km ?? 0) - (b.km ?? 0)) : withDistance;
  }, [stores, me]);

  function locate() {
    if (!navigator.geolocation) {
      setRefused(true);
      return;
    }
    setAsking(true);
    setRefused(false);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMe([coords.longitude, coords.latitude]);
        setActive(0);
        setAsking(false);
      },
      () => {
        setRefused(true);
        setAsking(false);
      },
      { timeout: 10_000 },
    );
  }

  function choose(index: number, fromMap = false) {
    setActive(index);
    if (fromMap) cards.current[index]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  const current = ordered[active]?.store;
  const mapView = (
    <ShopsMapView
      shops={ordered.map(({ store }) => ({ coords: store.coords }))}
      active={active}
      me={me}
      onSelect={(i) => choose(i, true)}
      className="h-full w-full"
    />
  );

  return (
    <section>
      <div className="flex items-center gap-3 border-b border-line px-4 py-3 md:gap-6 md:px-10">
        {/* The switch is a phone's: the desktop has both in view */}
        <div className="flex-1 lg:hidden">
          <SegmentedSwitch
            label="Вид"
            value={view}
            onChange={setView}
            options={[
              { value: "list", label: "Список" },
              { value: "map", label: "Карта" },
            ]}
          />
        </div>
        <button
          type="button"
          onClick={locate}
          disabled={asking}
          aria-label="Ближайшие ко мне"
          className={`${iconButtonClass("outline")} lg:hidden`}
        >
          <PinIcon />
        </button>
        <button
          type="button"
          onClick={locate}
          disabled={asking}
          className={`${buttonClass("outline", "M")} max-lg:hidden`}
        >
          Ближайшие ко мне
          <PinIcon size={20} />
        </button>
        {refused && (
          <p role="status" className="type-caption text-brand max-lg:hidden">
            Не удалось определить, где вы
          </p>
        )}
      </div>
      {refused && (
        <p role="status" className="type-caption px-4 pt-3 text-brand lg:hidden">
          Не удалось определить, где вы
        </p>
      )}

      <div className="grid gap-6 px-4 py-4 md:px-10 md:py-8 lg:grid-cols-12">
        <div
          className={`flex flex-col gap-4 md:gap-6 lg:col-span-4 ${
            view === "map" ? "max-lg:hidden" : ""
          }`}
        >
          {ordered.map(({ store, km }, i) => (
            <div
              key={store.name}
              ref={(el) => {
                cards.current[i] = el;
              }}
              onMouseEnter={() => setActive(i)}
            >
              <ShopCard
                name={store.name}
                image={store.image}
                phone={store.phone}
                distance={km !== undefined ? label(km) : undefined}
                route={routeHref(store.coords)}
                active={i === active}
                facts={[
                  { label: "Адрес", value: store.address },
                  { label: "Часы", value: store.hours },
                  { label: "Телефон", value: store.phone },
                ]}
                onOpen={() => setSheet(store)}
              />
            </div>
          ))}
        </div>

        {/* One map for every width. A desktop: beside the list, sticky. Below
            that it is the second view of the switch and takes the screen between
            the bar and the tab bar, edge to edge, with the chosen shop in a card
            at its foot. */}
        <div
          className={`relative lg:sticky lg:top-[calc(var(--header-h,116px)+16px)] lg:col-span-8 lg:block lg:h-[820px] lg:self-start ${
            view === "map"
              ? "h-[calc(100svh-var(--header-h,100px)-var(--tabbar-h)-69px)] max-lg:-mx-4 max-lg:-my-4 md:max-lg:-mx-10"
              : "max-lg:hidden"
          }`}
        >
          {mapView}
          {current && (
            <div className="absolute inset-x-4 bottom-4 flex items-center gap-4 border border-ink bg-white p-3 pl-4 lg:hidden">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="type-h4 truncate">{current.name}</p>
                <p className="type-body-s truncate">{current.address}</p>
              </div>
              <button
                type="button"
                aria-label={`${current.name}: подробнее`}
                onClick={() => setSheet(current)}
                className={iconButtonClass("outline")}
              >
                <ArrowIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      {sheet && <StoreRouteModal store={sheet} onClose={() => setSheet(null)} />}
    </section>
  );
}
