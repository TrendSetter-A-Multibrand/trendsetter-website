"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "@/components/ui/Link";
import { DateBadge } from "@/components/ui/DateBadge";
import { ArrowIcon, ArrowLeftIcon } from "@/components/ui/Icons";
import { iconButtonClass } from "@/components/ui/iconButton";
import { eventDate, type Event } from "@/lib/events";
import { daysUntil, whenShort } from "@/lib/eventsView";

/** How long each event stays up, and the figure the bar is drawn against. */
const SECONDS = 5;

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * The file's Events widget, which sits in the head of the news page (columns
 * 7-12, at the foot of the header; the section's title and lead are the page's
 * own): the nearest events one at a time - the date in Red, the kind of event in
 * brackets, the title and one line that opens with how many days off it is, then
 * the weekday and time, then the place. Every 5 seconds it moves to the next,
 * and a 2px line shows how long is left. It waits under a mouse pointer (not a
 * tap) and with keyboard focus inside it. The arrows step by hand, "n / m" says
 * where it is. For anyone who asked for less motion there is no line and
 * nothing changes by itself.
 *
 * The markup is a plain list the server can draw; the rotation only starts once
 * the page has hydrated.
 */
export function EventsWidget({ events }: { events: Event[] }) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => true,
  );

  const count = events.length;
  const event = events[index];
  const monthFull = event ? eventDate(event.date).monthFull : "";
  const step = (by: number) => setIndex((i) => (i + by + count) % count);

  // The bar's animation ends exactly when the time is up; restarting it is a
  // matter of a new key, so a manual step also starts the five seconds over.
  useEffect(() => {
    if (reduced || held || count < 2) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [index, held, reduced, count]);

  if (!event) return null;
  const when = [daysUntil(event), whenShort(event), event.location].filter(Boolean);

  return (
    <div
      className="flex w-full flex-col gap-3 md:gap-2"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setHeld(true)}
      onBlur={() => setHeld(false)}
      aria-roledescription="карусель"
      aria-label="Ближайшие события"
    >
      <Link href={event.href} className="group flex gap-4 md:items-end md:gap-6">
        {/* The date: Red, the day scrolls up into place when it changes */}
        <div key={event.uuid} className="animate-digit-in shrink-0 text-brand md:self-end">
          <div className="md:hidden">
            <span className="block text-[82px] font-medium leading-none tracking-[-0.02em] tabular-nums">
              {event.day.padStart(2, "0")}
            </span>
            <span className="type-caption block">{monthFull}</span>
          </div>
          <div className="hidden md:block">
            <DateBadge day={event.day.padStart(2, "0")} month={monthFull} color="red" />
          </div>
        </div>

        <div
          key={`${event.uuid}-body`}
          className="flex min-w-0 flex-1 animate-fade-in flex-col gap-2 text-ink md:pb-2"
        >
          <p className="type-label">[{event.tags?.[0] ?? "Событие"}]</p>
          <p className="type-h2 line-clamp-2 transition-colors duration-150 group-hover:text-brand md:type-h4">
            {event.title}
          </p>
          <p className="type-body-s">{when.join(" · ")}</p>
        </div>
      </Link>

      <div className="h-0.5 w-full bg-line" aria-hidden="true">
        {!reduced && count > 1 && (
          <div
            key={`${index}-${held}`}
            className={`h-full bg-ink ${held ? "w-full opacity-0" : "animate-widget-bar"}`}
            style={{ animationDuration: `${SECONDS}s` }}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="type-caption text-ink">
          {index + 1} / {count}
        </p>
        {count > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Предыдущее событие"
              onClick={() => step(-1)}
              className={iconButtonClass("outline")}
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              aria-label="Следующее событие"
              onClick={() => step(1)}
              className={iconButtonClass("outline")}
            >
              <ArrowIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
