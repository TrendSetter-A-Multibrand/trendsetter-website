import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/ui/CopyButton";
import { DbNotConfigured } from "@/lib/db/client";
import {
  listEventCounts,
  listRegistrations,
} from "@/lib/db/queries/registrations";
import {
  ADMIN_COOKIE,
  adminSecret,
  cookieMatches,
  cookieValue,
  secretMatches,
} from "@/lib/registrationsAdmin";
import { fetchEventCapacity } from "@/lib/storyblok/eventCapacity";

export const metadata: Metadata = {
  title: "Записи на события",
  robots: { index: false, follow: false },
};

async function login(form: FormData) {
  "use server";
  const secret = adminSecret();
  if (secret && secretMatches(form.get("secret"), secret)) {
    (await cookies()).set(ADMIN_COOKIE, cookieValue(secret), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }
}

const when = (d: Date) => d.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

export default async function RegistrationsPage() {
  const secret = adminSecret();
  if (!secret) notFound();

  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!cookieMatches(cookie, secret)) {
    return (
      <main className="mx-auto max-w-sm px-4 py-16">
        <form action={login} className="flex flex-col gap-3">
          <input
            type="password"
            name="secret"
            placeholder="Пароль"
            className="border border-ink px-3 py-2"
            required
          />
          <button className="bg-ink px-3 py-2 text-white">Войти</button>
        </form>
      </main>
    );
  }

  let events;
  try {
    events = await Promise.all(
      (await listEventCounts()).map(async ({ uuid }) => ({
        uuid,
        title: (await fetchEventCapacity(uuid).catch(() => null))?.title || uuid,
        rows: await listRegistrations(uuid),
      })),
    );
  } catch (e) {
    if (e instanceof DbNotConfigured) return <main className="p-8">База не подключена</main>;
    throw e;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl">Записи на события</h1>
      {events.length === 0 && <p>Пока никто не записался.</p>}
      {events.map(({ uuid, title, rows }) => (
        <section key={uuid} className="mb-10">
          <h2 className="mb-3 text-lg">
            {title} ({rows.length})
          </h2>
          <div className="mb-3 flex gap-3">
            <CopyButton
              label="Копировать список"
              text={rows.map((r) => r.email).join("\n")}
            />
            <a
              className="border border-ink px-3 py-1 text-sm hover:bg-surface"
              href={`/api/events/${uuid}/registrations`}
            >
              Скачать CSV
            </a>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-1">Email</th>
                <th className="py-1">Дата записи</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email}>
                  <td className="py-1">{r.email}</td>
                  <td className="py-1">{when(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}
