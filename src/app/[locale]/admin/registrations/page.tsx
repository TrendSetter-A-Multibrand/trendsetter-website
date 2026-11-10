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

  const events = (
    await Promise.all(
      (await listEventCounts()).map(async ({ uuid }) => {
        const info = await fetchEventCapacity(uuid).catch(() => null);
        if (!info || !canSeeEvent(staff, info.store)) return null;
        return { uuid, title: info.title || uuid, rows: await listRegistrations(uuid) };
      }),
    )
  ).filter((x) => x !== null);

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

        <div className="flex flex-col gap-12 md:gap-16">
          {events.map(({ uuid, title, rows }) => (
            <section key={uuid}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                <div>
                  <h2 className="type-h3">{title}</h2>
                  <p className="type-body mt-1 text-text-2">
                    Записано {rows.length} · пришло {rows.filter((r) => r.attendedAt).length}
                  </p>
                </div>
                <div className="flex gap-3">
                  <CopyButton
                    label="Копировать список"
                    text={rows.map((r) => r.email).join("\n")}
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
                      <p className="type-body break-all">{r.email}</p>
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
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
