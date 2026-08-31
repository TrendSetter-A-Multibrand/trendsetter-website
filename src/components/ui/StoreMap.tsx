"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  loadYmaps,
  type YMapInstance,
  type YMapMarkerInstance,
} from "@/lib/ymaps";

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
 * The marker is an ordinary DOM element handed to the API, so it is our mono
 * and our red, with the name spelled out rather than a stock pin.
 *
 * The file draws the map slot in the same three states as a card's photo, and
 * the two that are not the map are the ground under it: flat #f7f7f7 while the
 * API is on its way, the grey smiley if it never arrives - a missing key or a
 * blocked script leaves a placeholder, not a hole.
 */
export function StoreMap({
  center,
  zoom = 16,
  label = "TRENDSETTER",
  className = "",
}: StoreMapProps) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<YMapInstance | null>(null);
  const pin = useRef<YMapMarkerInstance | null>(null);
  const [failed, setFailed] = useState(false);
  const [lng, lat] = center;

  /**
   * Where the map should be looking. Written by the effect below and read by the
   * one that builds the map, which takes no props of its own: the script can
   * land a shop or two after the reader has moved on, and it must open on the
   * shop they are looking at rather than the one they clicked first.
   */
  const wanted = useRef({ center, zoom, label });

  /**
   * Picking another shop moves this map rather than building a new one. Rebuilt,
   * it tore its tiles down and put the ground back on screen for a beat - which
   * is what anyone clicking down the list actually saw.
   */
  useEffect(() => {
    wanted.current = { center: [lng, lat], zoom, label };
    map.current?.setLocation({ center: [lng, lat], zoom });
    pin.current?.update({ coordinates: [lng, lat] });
  }, [lng, lat, zoom, label]);

  useEffect(() => {
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
        const { center, zoom, label } = wanted.current;

        const instance = new YMap(host.current, {
          location: { center, zoom },
        });

        instance.addChild(new YMapDefaultSchemeLayer());
        instance.addChild(new YMapDefaultFeaturesLayer());

        const plate = document.createElement("div");
        plate.className = "ts-pin";
        plate.textContent = label;
        const marker = new YMapMarker({ coordinates: center }, plate);
        instance.addChild(marker);

        map.current = instance;
        pin.current = marker;
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
      pin.current = null;
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Sits underneath: covered by the map once it draws, and left showing if
          it never does. Grey while it is coming - the smiley is the state for a
          map that failed, and wearing it during the wait said so wrongly. */}
      {failed ? <ImagePlaceholder /> : <Skeleton />}
      {!failed && <div ref={host} className="ts-map absolute inset-0" />}
    </div>
  );
}
