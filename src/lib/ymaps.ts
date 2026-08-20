/**
 * Loads the Yandex Maps JavaScript API once, however many maps ask for it.
 *
 * The script is fetched on first use rather than in the document head: the map
 * lives on one block of one page, and there is no reason for every other page
 * to carry it. The promise is kept, so a second map reuses the first load.
 */

/** Only the parts of the API we actually call. */
type Ymaps3 = {
  ready: Promise<void>;
  YMap: new (
    root: HTMLElement,
    props: { location: { center: [number, number]; zoom: number } },
  ) => YMapInstance;
  YMapDefaultSchemeLayer: new (props?: object) => object;
  YMapDefaultFeaturesLayer: new (props?: object) => object;
  YMapMarker: new (
    props: { coordinates: [number, number] },
    element: HTMLElement,
  ) => object;
};

type YMapInstance = {
  addChild: (child: object) => void;
  destroy: () => void;
  setLocation: (location: { center?: [number, number]; zoom?: number }) => void;
};

declare global {
  interface Window {
    ymaps3?: Ymaps3;
  }
}

const SRC = "https://api-maps.yandex.ru/v3/?lang=ru_RU&apikey=";

let pending: Promise<Ymaps3> | null = null;

export function loadYmaps(): Promise<Ymaps3> {
  if (pending) return pending;

  pending = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Карта рисуется только в браузере"));
      return;
    }

    const key = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY;
    if (!key) {
      reject(new Error("NEXT_PUBLIC_YANDEX_MAPS_KEY не задан"));
      return;
    }

    const script = document.createElement("script");
    script.src = SRC + encodeURIComponent(key);
    script.async = true;

    script.onload = async () => {
      const api = window.ymaps3;
      if (!api) {
        reject(new Error("Скрипт загрузился, но ymaps3 не появился"));
        return;
      }
      // The script being on the page is not the same as the API being usable
      await api.ready;
      resolve(api);
    };

    // A rejected promise would be cached forever, so let the next caller retry
    script.onerror = () => {
      pending = null;
      script.remove();
      reject(new Error("Не удалось загрузить API Яндекс Карт"));
    };

    document.head.appendChild(script);
  });

  return pending;
}

/** Where a point sits inside Yandex's own maps, with the route already asked for. */
export function routeHref(
  [lon, lat]: [number, number],
  mode: "auto" | "mt" | "pd" = "auto",
) {
  // The empty half before ~ is the starting point: left blank, Yandex Maps
  // fills it in from wherever the reader is
  return `https://yandex.ru/maps/?rtext=~${lat},${lon}&rtt=${mode}&z=16`;
}
