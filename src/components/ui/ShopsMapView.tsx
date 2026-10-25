"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Skeleton } from "@/components/ui/Skeleton";
import { loadYmaps, type YMapInstance, type YMapMarkerInstance } from "@/lib/ymaps";

type Point = { coords: [number, number] };

/**
 * All the shops on one Yandex map - the file's Map marker for each: a Red plate
 * with the logo in white and a tip, Sage for the one chosen, and a Dark blue dot
 * in a white ring where the reader is. The scheme is muted so the plates stand
 * out. Two zoom buttons, 44 square, a Sage frame and no shadow, sit at the
 * top right.
 *
 * Choosing a shop - from the list or from its plate - moves the map to it; a
 * click on a plate reports back through `onSelect`. The map is built once and
 * only moved afterwards: rebuilt, it would put the grey ground back on screen for
 * a beat at every click. The markers are plain DOM handed to the API, so the
 * choice is a class toggled on them.
 */
export function ShopsMapView({
  shops,
  active,
  me,
  onSelect,
  className = "",
}: {
  shops: Point[];
  /** Index into `shops` of the chosen one. */
  active: number;
  /** Longitude, latitude of the reader once they have shared it. */
  me?: [number, number] | null;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<YMapInstance | null>(null);
  const plates = useRef<HTMLElement[]>([]);
  const zoom = useRef(11);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  // Read by the effect that builds the map, which takes no props: the script may
  // land after the reader has already picked a shop
  const wanted = useRef({ shops, active, onSelect });
  useEffect(() => {
    wanted.current = { shops, active, onSelect };
  });

  useEffect(() => {
    let dead = false;

    loadYmaps()
      .then((ymaps3) => {
        if (dead || !host.current) return;
        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapListener } =
          ymaps3;
        const { shops, active } = wanted.current;
        const start = shops[active] ?? shops[0];
        if (!start) return;

        const instance = new YMap(host.current, {
          location: { center: start.coords, zoom: zoom.current },
        });
        instance.addChild(new YMapDefaultSchemeLayer());
        instance.addChild(new YMapDefaultFeaturesLayer());
        instance.addChild(
          new YMapListener({
            layer: "any",
            onUpdate: ({ location }) => {
              zoom.current = location.zoom;
            },
          }),
        );

        plates.current = shops.map((shop, i) => {
          const el = document.createElement("div");
          el.className = `ts-mk${i === active ? " ts-mk--active" : ""}`;
          el.innerHTML = '<span class="ts-mk__box"></span>';
          el.addEventListener("click", () => wanted.current.onSelect(i));
          instance.addChild(new YMapMarker({ coordinates: shop.coords }, el));
          return el;
        });

        map.current = instance;
        setReady(true);
      })
      .catch((error) => {
        if (dead) return;
        console.error("[Карта]", error);
        setFailed(true);
      });

    return () => {
      dead = true;
      map.current?.destroy();
      map.current = null;
      plates.current = [];
    };
  }, []);

  // The chosen plate turns Sage and the map walks over to it
  useEffect(() => {
    plates.current.forEach((el, i) => el.classList.toggle("ts-mk--active", i === active));
    const shop = shops[active];
    if (shop) map.current?.setLocation({ center: shop.coords, duration: 400 });
  }, [active, shops, ready]);

  // Where the reader stands: a dot, and the map shows it with the nearest shop
  const meMarker = useRef<YMapMarkerInstance | null>(null);
  useEffect(() => {
    if (!me || !ready) return;
    let dead = false;
    loadYmaps().then(({ YMapMarker }) => {
      if (dead || !map.current) return;
      const dot = document.createElement("div");
      dot.className = "ts-me";
      const marker = new YMapMarker({ coordinates: me }, dot);
      map.current.addChild(marker);
      meMarker.current = marker;
    });
    return () => {
      dead = true;
    };
  }, [me, ready]);

  function zoomBy(step: number) {
    zoom.current = Math.min(19, Math.max(3, zoom.current + step));
    map.current?.setLocation({ zoom: zoom.current, duration: 200 });
  }

  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      {failed ? <ImagePlaceholder /> : <Skeleton />}
      {!failed && <div ref={host} className="ts-map ts-map--muted absolute inset-0" />}

      {!failed && (
        <div className="absolute right-4 top-4 flex flex-col border border-ink bg-white">
          <button
            type="button"
            aria-label="Приблизить"
            onClick={() => zoomBy(1)}
            className="type-h4 flex size-11 items-center justify-center text-ink transition-colors duration-150 hover:bg-ink hover:text-white"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Отдалить"
            onClick={() => zoomBy(-1)}
            className="type-h4 flex size-11 items-center justify-center text-ink transition-colors duration-150 hover:bg-ink hover:text-white"
          >
            −
          </button>
        </div>
      )}
    </div>
  );
}
