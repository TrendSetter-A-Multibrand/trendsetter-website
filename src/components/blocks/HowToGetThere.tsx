import { buttonClass } from "@/components/ui/Button";
import { RouteIcon } from "@/components/ui/Icons";
import { routeUrl } from "@/lib/eventsView";

/**
 * The file's "How to get there": a Paper plate with "[Как добраться]", the place
 * in H3, the address when there is one, and an outlined "Построить маршрут" that
 * opens Yandex Maps. The editor gives a place's name, so the link searches the
 * map for it.
 */
export function HowToGetThere({ place, address }: { place: string; address?: string }) {
  return (
    <section className="flex flex-col items-start gap-4 bg-surface p-6 text-ink">
      <p className="type-label">[Как добраться]</p>
      <p className="type-h3">{place}</p>
      {address && <p className="type-body">{address}</p>}
      <a
        href={routeUrl(place)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass("outline", "M")}
      >
        Построить маршрут
        <RouteIcon />
      </a>
    </section>
  );
}
