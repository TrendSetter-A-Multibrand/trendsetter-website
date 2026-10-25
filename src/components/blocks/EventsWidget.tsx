"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { DateBadge } from "@/components/ui/DateBadge";
import { ArrowIcon, ArrowLeftIcon } from "@/components/ui/Icons";
import { iconButtonClass } from "@/components/ui/iconButton";
import { eventDate, type Event } from "@/lib/events";
import { daysUntil } from "@/lib/eventsView";

/** How long each event stays up, and the figure the bar is drawn against. */
const SECONDS = 5;

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * The file's Events widget, the head of the events page: the title and its line
 * at the left and, at the right, the nearest events one at a time - the date in
 * Red, the kind of event in brackets, the title, the place and how many days off
 * it is. Every 5 seconds it moves to the next, and a 2px line shows how long is
 * left; under the pointer or with focus inside it, it waits. The arrows step by
 * hand, "n / m" says where it is. For anyone who asked for less motion there is
 * no line and nothing changes by itself.
 *
 * It is the first thing a visitor sees here, so the markup is a plain list the
 * server can draw; the rotation only starts once the page has hydrated.
 */
export function EventsWidget({
  events,
  title = "События",
  lead = "Мастер-классы, встречи и показы в магазинах",
}: {
  events: Event[];
  title?: string;
  lead?: string;
}) {
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

  return (
    <section className="flex flex-col gap-6 px-4 pb-6 pt-12 md:flex-row md:items-end md:gap-6 md:px-10 md:pb-8 md:pt-6">
      <div className="flex flex-col gap-3 md:w-[437px] md:shrink-0">
        <h1 className="type-h1 text-ink">{title}</h1>
        <p className="type-body-l text-text-2">{lead}</p>
      </div>

      <div className="hidden flex-1 md:block" />

      {event && (
        <div
          className="flex w-full flex-col gap-3 md:w-[667px] md:shrink-0 md:gap-2"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
          aria-roledescription="карусель"
          aria-label="Ближайшие события"
        >
          <Link
            href={event.href}
            className="group flex flex-col gap-4 md:flex-row md:items-end md:gap-6"
          >
            {/* The date: Red, the day scrolls up into place when it changes */}
            <div key={event.uuid} className="animate-digit-in text-brand md:self-end">
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

            <div key={`${event.uuid}-body`} className="flex min-w-0 flex-1 animate-fade-in flex-col gap-2 text-ink md:pb-2">
              <p className="type-label">[{event.tags?.[0] ?? "Событие"}]</p>
              <p className="type-h2 transition-colors duration-150 group-hover:text-brand md:type-h4">
                {event.title}
              </p>
              <p className="type-body-s">
                {event.location}
                {daysUntil(event) && (
                  <>
                    {event.location && " · "}
                    <span className="text-brand">{daysUntil(event)}</span>
                  </>
                )}
              </p>
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
      )}
    </section>
  );
}
