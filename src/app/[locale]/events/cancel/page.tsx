import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonClass } from "@/components/ui/Button";
import { DbNotConfigured } from "@/lib/db/client";
import { findByCancelToken } from "@/lib/db/queries/registrations";
import { whenText } from "@/lib/eventMail";
import { fetchEventCapacity } from "@/lib/storyblok/eventCapacity";
import { cancelSignup } from "./actions";

export const metadata: Metadata = {
  title: "Отмена записи",
  robots: { index: false, follow: false },
};

const MESSAGES: Record<string, string> = {
  done: "Запись отменена. Место освободилось для других гостей.",
  used: "Эта ссылка уже использована или не подходит: запись отменена раньше или не найдена.",
  wait: "Слишком много попыток, попробуйте через десять минут.",
};

export default async function CancelPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ t?: string; done?: string; e?: string }>;
}) {
  const { locale } = await params;
  const { t, done, e } = await searchParams;

  // Opening the link only shows the sign-up; it is the button that cancels, so a
  // mail program that opens links to check them cancels nobody.
  let target = null;
  if (t && !done) {
    try {
      target = await findByCancelToken(t.slice(0, 100));
    } catch (error) {
      if (error instanceof DbNotConfigured) notFound();
      throw error;
    }
  }
  const event = target ? await fetchEventCapacity(target.eventUuid).catch(() => null) : null;

  const message = done ? MESSAGES.done : e ? MESSAGES[e] : !target ? MESSAGES.used : null;

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Главная", href: `/${locale}` }, { label: "Отмена записи" }]}
      />
      <main className="px-4 pb-32 pt-6 md:px-10 md:pt-12">
        <div className="mx-auto max-w-[437px]">
          <h1 className="type-h2 md:type-h1 mb-8">Отмена записи</h1>
          {message ? (
            <p className="type-body">{message}</p>
          ) : (
            <form action={cancelSignup} className="flex flex-col gap-6">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="t" value={t} />
              <p className="type-body">
                Отменить запись на «{event?.title ?? "событие"}»
                {event?.date ? ` (${whenText(event.date)})` : ""}
                {target?.name ? ` для ${target.name}` : ""}?
              </p>
              <button className={`${buttonClass("primary", "L")} w-full`}>Отменить запись</button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
