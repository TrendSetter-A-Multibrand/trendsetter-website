"use client";

import { useMemo, useState } from "react";
import { EventRow } from "@/components/cards/EventRow";
import { Dropdown } from "@/components/ui/Dropdown";
import { FilterChip } from "@/components/ui/FilterChip";
import { eventDate, type Event } from "@/lib/events";
import { groupByMonth, isPast, whenShort } from "@/lib/eventsView";

const ALL_PLACES = "Все места";

function Row({ event }: { event: Event }) {
  return (
    <EventRow
      href={event.href}
      day={event.day}
      month={eventDate(event.date).monthFull || event.month}
      when={whenShort(event)}
      title={event.title}
      text={event.description}
      place={event.location}
      image={event.image}
      past={isPast(event)}
    />
  );
}

/**
 * The list under the events widget: a bar with the kinds of event as chips and
 * a "Где" field to pick a place, then the coming events by month - "[Октябрь
 * 2026]" over its rows, a thin rule between them - and, last, one line "Прошедшие
 * · N" that opens the ones already gone, drawn at 60%. The kinds are the tags the
 * events carry and the places are where they are held; neither is a list of its
 * own. A bar with no kind and one place is not drawn.
 */
export function EventsBoard({ events }: { events: Event[] }) {
  const [kind, setKind] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [archive, setArchive] = useState(false);

  const kinds = useMemo(
    () => Array.from(new Set(events.flatMap((e) => (e.tags ?? []).slice(0, 1)))),
    [events],
  );
  const places = useMemo(
    () => Array.from(new Set(events.map((e) => e.location).filter(Boolean))),
    [events],
  );

  const shown = events.filter(
    (e) => (!kind || e.tags?.[0] === kind) && (!place || e.location === place),
  );
  const coming = shown.filter((e) => !isPast(e));
  const past = shown.filter((e) => isPast(e));

  return (
    <>
      {(kinds.length > 0 || places.length > 1) && (
        <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:px-10">
          {places.length > 1 && (
            <div className="flex items-center gap-3 md:order-2 md:ml-auto md:w-[437px]">
              <span className="type-caption shrink-0">Где</span>
              <div className="min-w-0 flex-1">
                <Dropdown
                  name="place"
                  surface="light"
                  placeholder={ALL_PLACES}
                  options={[ALL_PLACES, ...places]}
                  onChange={(value) => setPlace(value === ALL_PLACES ? "" : value)}
                />
              </div>
            </div>
          )}
          {kinds.length > 0 && (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:order-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              <FilterChip label="Все" active={kind === ""} onClick={() => setKind("")} />
              {kinds.map((k) => (
                <FilterChip key={k} label={k} active={kind === k} onClick={() => setKind(k)} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-8 px-4 pt-6 md:gap-12 md:px-10 md:pt-8">
        {coming.length === 0 && (
          <p className="type-body-l text-text-2">Ближайших событий пока нет.</p>
        )}
        {groupByMonth(coming).map((group) => (
          <section key={group.key}>
            <h2 className="type-label text-ink">[{group.label}]</h2>
            <div className="divide-y divide-line">
              {group.events.map((event) => (
                <Row key={event.uuid} event={event} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {past.length > 0 && (
        <div className="mt-8 px-4 md:mt-12 md:px-10">
          <button
            type="button"
            aria-expanded={archive}
            onClick={() => setArchive(!archive)}
            className="type-label flex min-h-14 w-full items-center border-t border-line text-left text-ink transition-colors duration-150 hover:text-brand"
          >
            Прошедшие · {past.length}
          </button>
          {archive && (
            <div className="divide-y divide-line">
              {past.map((event) => (
                <Row key={event.uuid} event={event} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
