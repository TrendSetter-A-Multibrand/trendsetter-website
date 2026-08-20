"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { loadYmaps } from "@/lib/ymaps";

type StoreMapProps = {
  /** Longitude first, latitude second - the order the API expects. */
  center: [number, number];
  zoom?: number;
  /** What the plate over the point says. */
  label?: string;
  className?: string;
};

/**
 * One shop on a Yandex map, with our own plate rather than the stock pin.
 *
 * The marker is an ordinary DOM element handed to the API, so it is our mono,
 * our black and our brackets - the same [TS] the site sets its headings in.
 *
 * While the API is loading, and if it never arrives, the grey smiley stays put:
 * a missing key or a blocked script leaves a placeholder, not a hole.
 */
export function StoreMap({
  center,
  zoom = 16,
  label = "[TS]",
  className = "",
}: StoreMapProps) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let map: { destroy: () => void } | null = null;
    let dead = false;

    loadYmaps()
      .then((ymaps3) => {
        // Unmounted while the script was in flight
        if (dead || !host.current) return;

        const {
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultFeaturesLayer,
          YMapMarker,
        } = ymaps3;

        const instance = new YMap(host.current, {
          location: { center, zoom },
        });
        map = instance;

        instance.addChild(new YMapDefaultSchemeLayer());
        instance.addChild(new YMapDefaultFeaturesLayer());

        const plate = document.createElement("div");
        plate.className = "ts-pin";
        plate.textContent = label;
        instance.addChild(new YMapMarker({ coordinates: center }, plate));
      })
      .catch((error) => {
        if (dead) return;
        console.error("[Карта]", error);
        setFailed(true);
      });

    return () => {
      dead = true;
      map?.destroy();
    };
  }, [center, zoom, label]);

  return (
    <div className={`relative ${className}`}>
      {/* Sits underneath: covered by the map once it draws, and left showing if
          it never does */}
      <ImagePlaceholder />
      {!failed && <div ref={host} className="absolute inset-0" />}
    </div>
  );
}
