"use client";

import { type FormEvent, useState, useSyncExternalStore } from "react";
import Link from "@/components/ui/Link";
import { buttonClass } from "@/components/ui/Button";
import { fieldClass, fieldErrorClass } from "@/components/ui/fieldClass";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { ModalSheet } from "@/components/ui/ModalSheet";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NEED_EMAIL = "Проверьте адрес почты";

/**
 * The newsletter's unsubscribe sheet (05.11): the link in a letter leads to the
 * site with `?unsubscribe=<address>`, and the sheet stands over whatever page
 * that is, the address already in its field. Three states as the file draws
 * them: the form, the same with an error under the field, and «Вы отписаны».
 *
 * The request goes to the server, which takes the address off the list in the
 * mailing service; whether or not it was on the list, the answer is the same.
 */
export function UnsubscribeModal({ locale }: { locale: string }) {
  // null = the link did not ask for the sheet (and always null on the server)
  const asked = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("unsubscribe"),
    () => null,
  );
  const [typed, setTyped] = useState<string | null>(null);
  const [closed, setClosed] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (asked === null || closed) return null;
  const email = typed ?? asked.trim();

  function close() {
    setClosed(true);
    const url = new URL(window.location.href);
    url.searchParams.delete("unsubscribe");
    window.history.replaceState(null, "", url);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!EMAIL_PATTERN.test(email)) {
      setError(true);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setError(!res.ok);
      setDone(res.ok);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalSheet
      title={done ? "Вы отписаны" : "Отписаться от рассылки"}
      label="Рассылка"
      size="sm"
      onClose={close}
    >
      <div className="flex flex-col gap-6 px-4 md:px-8">
        {done ? (
          <>
            <p className="type-body">Больше не будем присылать письма. Передумаете — подпишитесь снова.</p>
            <div className="flex flex-col gap-4 md:items-start">
              <Link href={`/${locale}`} onClick={close} className={`${buttonClass("primary", "L")} w-full`}>
                На главную
              </Link>
              <LinkArrow href={`/${locale}#subscribe`} onClick={close} className="self-start">
                Подписаться снова
              </LinkArrow>
            </div>
          </>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-6">
            <p className="type-body">
              Больше не будем присылать письма о новых поставках, событиях и выпусках журнала. Почту подставили из
              ссылки в письме.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setTyped(e.target.value);
                  setError(false);
                }}
                placeholder="name@example.ru"
                aria-label="E-mail"
                aria-invalid={error ? true : undefined}
                className={fieldClass("input", "light")}
              />
              {error && (
                <p role="alert" className={fieldErrorClass("light")}>
                  {NEED_EMAIL}
                </p>
              )}
            </div>
            <button type="submit" disabled={busy} className={`${buttonClass("primary", "L")} w-full`}>
              Отписаться
            </button>
          </form>
        )}
      </div>
    </ModalSheet>
  );
}
