import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonClass } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { fieldClass, fieldErrorClass } from "@/components/ui/fieldClass";
import { DbNotConfigured } from "@/lib/db/client";
import {
  listEventCounts,
  listRegistrations,
} from "@/lib/db/queries/registrations";
import { canSeeEvent } from "@/lib/staff/access";
import { currentStaff } from "@/lib/staff/session";
import { fetchEventCapacity } from "@/lib/storyblok/eventCapacity";
import { fetchStories } from "@/lib/storyblok/fetchStory";
import { eventDate } from "@/lib/events";
import {
  groupByStore,
  perDay,
  perStore,
  totals,
  type CabinetEvent,
} from "@/lib/registrationStats";
import { BarRows } from "@/components/admin/BarRows";
import { DayBars } from "@/components/admin/DayBars";
import { StatTiles } from "@/components/admin/StatTiles";
import { login, logout, toggleAttended } from "./actions";

export const metadata: Metadata = {
  title: "Записи на события",
  robots: { index: false, follow: false },
};

const when = (d: Date) =>
  d.toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

/** "12 ноября, 15:00" for the editor's "2026-11-12 15:00"; empty when there is no date. */
function heldOn(date: string) {
  const { day, monthFull, time } = eventDate(date);
  if (!day) return "";
  return [`${day} ${monthFull}`, time].filter(Boolean).join(", ");
}

const percent = (part: number, whole: number) =>
  whole > 0 ? `${Math.round((part / whole) * 100)}%` : "-";

const ERRORS: Record<string, string> = {
  bad: "Неверный логин или пароль",
  wait: "Слишком много попыток, подождите десять минут",
};

export default async function RegistrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const { locale } = await params;
  const { e } = await searchParams;

  let staff;
  try {
    staff = await currentStaff();
  } catch (error) {
    if (error instanceof DbNotConfigured) notFound();
    throw error;
  }

  const crumbs = (
    <Breadcrumbs
      items={[{ label: "Главная", href: `/${locale}` }, { label: "Записи на события" }]}
    />
  );

  if (!staff) {
    return (
      <>
        {crumbs}
        <main className="px-4 pb-32 pt-6 md:px-10 md:pt-12">
          <div className="mx-auto max-w-[437px]">
            <h1 className="type-h2 md:type-h1 mb-8">Вход для администраторов</h1>
            <form action={login} className="flex flex-col gap-4">
              <input type="hidden" name="locale" value={locale} />
              <input
                name="login"
                autoComplete="username"
                placeholder="Логин"
                aria-label="Логин"
                aria-invalid={e === "bad" || undefined}
                className={fieldClass("input", "light")}
                required
              />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Пароль"
                aria-label="Пароль"
                aria-invalid={e === "bad" || undefined}
                className={fieldClass("input", "light")}
                required
              />
              {e && ERRORS[e] && <p className={fieldErrorClass("light")}>{ERRORS[e]}</p>}
              <button className={`${buttonClass("primary", "L")} w-full`}>Войти</button>
            </form>
          </div>
        </main>
      </>
    );
  }

  const storeNames = new Map(
    (await fetchStories<{ name?: string }>("store").catch(() => [])).map((store) => [
      store.uuid,
      store.content.name ?? store.name,
    ]),
  );

  const events: CabinetEvent[] = (
    await Promise.all(
      (await listEventCounts()).map(async ({ uuid }) => {
        const info = await fetchEventCapacity(uuid).catch(() => null);
        if (!info || !canSeeEvent(staff, info.store)) return null;
        return {
          uuid,
          title: info.title || uuid,
          date: info.date,
          storeUuid: info.store,
          storeName: storeNames.get(info.store) ?? "",
          seats: info.seats,
          rows: await listRegistrations(uuid),
        };
      }),
    )
  ).filter((x) => x !== null);

  const sum = totals(events);
  const groups = groupByStore(events);
  const busiest = Math.max(1, ...events.map((e) => e.rows.length));

  return (
    <>
      {crumbs}
      <main className="px-4 pb-32 pt-6 md:px-10 md:pt-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 md:mb-12">
          <h1 className="type-h2 md:type-h1">Записи на события</h1>
          <form action={logout} className="flex items-center gap-4">
            <input type="hidden" name="locale" value={locale} />
            <span className="type-label">{staff.name}</span>
            <button className={buttonClass("outline", "S")}>Выйти</button>
          </form>
        </div>

        {events.length === 0 && <p className="type-body-l text-text-2">Пока никто не записался.</p>}

        {events.length > 0 && (
          <div className="mb-16 flex flex-col gap-12 md:mb-24">
            <StatTiles
              tiles={[
                { label: "События", value: String(sum.events) },
                { label: "Записалось", value: String(sum.registered) },
                {
                  label: "Пришло",
                  value: String(sum.attended),
                  note: `${percent(sum.attended, sum.registered)} от записавшихся`,
                },
                {
                  label: "Места заняты",
                  value: sum.seats > 0 ? percent(sum.taken, sum.seats) : "-",
                  note: sum.seats > 0 ? `${sum.taken} из ${sum.seats}` : "у событий нет лимита",
                },
              ]}
            />

            <section>
              <h2 className="type-label mb-4 border-b border-line pb-2">[Записи по дням, 30 дней]</h2>
              <DayBars days={perDay(events, 30)} />
            </section>

            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <section>
                <h2 className="type-label mb-4 border-b border-line pb-2">[По событиям]</h2>
                <BarRows
                  rows={events.map((e) => ({
                    label: e.title,
                    value: e.rows.length,
                    max: e.seats ?? busiest,
                    attended: e.rows.filter((r) => r.attendedAt).length,
                    note: e.seats !== null ? `${e.rows.length} из ${e.seats}` : `${e.rows.length}`,
                  }))}
                />
                <p className="type-caption mt-4 text-text-2">
                  Тёмная полоса: записались, красная: пришли. Длина: места события (без лимита:
                  самое популярное событие).
                </p>
              </section>

              {groups.length > 1 && (
                <section>
                  <h2 className="type-label mb-4 border-b border-line pb-2">[По магазинам]</h2>
                  <BarRows
                    rows={perStore(events).map((store, _, all) => ({
                      label: store.name,
                      value: store.registered,
                      max: Math.max(1, ...all.map((x) => x.registered)),
                      attended: store.attended,
                      note: `${store.registered}, пришло ${store.attended}`,
                    }))}
                  />
                </section>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-16 md:gap-24">
          {groups.map((group) => (
            <section key={group.uuid || "none"}>
              <h2 className="type-label mb-6 border-b border-ink pb-2">[{group.name}]</h2>
              <div className="flex flex-col gap-12">
                {group.events.map(({ uuid, title, date, rows }) => (
                  <article key={uuid}>
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                      <div>
                        <h3 className="type-h3">{title}</h3>
                        <p className="type-body mt-1 text-text-2">
                          {[group.name, heldOn(date)].filter(Boolean).join(" · ")}
                        </p>
                        <p className="type-body text-text-2">
                          Записано {rows.length} · пришло {rows.filter((r) => r.attendedAt).length}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <CopyButton
                          label="Копировать список"
                          text={rows
                            .map((r) => [r.name, r.phone, r.email].filter(Boolean).join(", "))
                            .join("\n")}
                        />
                        <a
                          className={buttonClass("outline", "S")}
                          href={`/api/events/${uuid}/registrations`}
                        >
                          Скачать CSV
                        </a>
                      </div>
                    </div>

                    <ul className="divide-y divide-line">
                      {rows.map((r) => (
                        <li
                          key={r.id}
                          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3"
                        >
                          <div className="min-w-0">
                            <p className="type-body">{r.name || "Имя не указано"}</p>
                            <p className="type-body-s break-all text-text-2">
                              {r.phone && (
                                <a href={`tel:${r.phone}`} className="underline">
                                  {r.phone}
                                </a>
                              )}
                              {r.phone && " · "}
                              {r.email}
                            </p>
                            <p className="type-caption text-text-2">записался {when(r.createdAt)}</p>
                          </div>
                          <form action={toggleAttended}>
                            <input type="hidden" name="locale" value={locale} />
                            <input type="hidden" name="event" value={uuid} />
                            <input type="hidden" name="id" value={r.id} />
                            <input type="hidden" name="attended" value={r.attendedAt ? "0" : "1"} />
                            <button
                              className={`${buttonClass(r.attendedAt ? "secondary" : "outline", "M")} min-w-36`}
                            >
                              {r.attendedAt ? "Пришёл" : "Отметить"}
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
