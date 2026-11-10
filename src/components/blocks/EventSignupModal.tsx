"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "@/components/ui/Link";
import { buttonClass } from "@/components/ui/Button";
import { fieldClass, fieldErrorClass } from "@/components/ui/fieldClass";
import { Facts } from "@/components/cards/Facts";
import { whenLong } from "@/lib/eventsView";
import { ModalSheet } from "@/components/ui/ModalSheet";
import { useSiteSettings } from "@/components/layout/SettingsContext";
import type { Event } from "@/lib/events";
import {
  checkSignup,
  fillSeats,
  readSeats,
  readSignup,
  splitBraces,
  type SeatsState,
} from "@/lib/eventSignupForm";

const ERROR = "Не удалось отправить, попробуйте позже";
const NEED_NAME = "Укажите фамилию и имя";
const NEED_PHONE = "Укажите телефон, например +7 999 123-45-67";
const NEED_EMAIL = "Укажите корректный e-mail";
const NEED_CONSENT = "Нужно согласие на обработку персональных данных";

/**
 * The sign-up sheet: the event's photo and write-up, when and where, the seats
 * still free (only for an event that has a limit), then e-mail, the consent and
 * the button. The seats are asked of the server each time it opens, so a count
 * a day old is never shown; the server decides in the end, whatever we drew.
 */
export function EventSignupModal({
  event,
  locale,
  onClose,
}: {
  event: Event;
  locale: string;
  onClose: () => void;
}) {
  const { eventSignup: t } = useSiteSettings();
  // null = still asking
  const [seats, setSeats] = useState<SeatsState | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<"done" | "already" | null>(null);

  // An event with a Яндекс Формы page shows that form; it keeps its own seats
  const embed = event.signupFormUrl;

  useEffect(() => {
    if (embed) return;
    const ctrl = new AbortController();
    fetch(`/api/events/${event.uuid}/seats`, { cache: "no-store", signal: ctrl.signal })
      .then((res) => res.json())
      .then((body) => setSeats(readSeats(body)))
      // The count is a courtesy; the register route still has the last word
      .catch((e) => e?.name !== "AbortError" && setSeats({ phase: "open", left: null }));
    return () => ctrl.abort();
  }, [event.uuid, embed]);

  const phase = seats?.phase ?? "open";
  const shut = phase !== "open";
  const consentText = splitBraces(t.consent);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy || shut) return;
    const invalid = checkSignup({ name, phone, email }, consent);
    if (invalid) {
      setError(
        invalid === "consent"
          ? NEED_CONSENT
          : invalid === "name"
            ? NEED_NAME
            : invalid === "phone"
              ? NEED_PHONE
              : NEED_EMAIL,
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/events/${event.uuid}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, consent: true, website: "" }),
      });
      const out = readSignup(res.status, await res.json().catch(() => ({})));
      if (out.kind === "done" || out.kind === "already") {
        setSeats((s) => (s ? { ...s, left: out.left ?? s.left } : s));
        setResult(out.kind);
      } else if (out.kind === "full") setSeats({ phase: "full", left: 0 });
      else if (out.kind === "closed") setSeats({ phase: "closed", left: null });
      else setError(ERROR);
    } catch {
      setError(ERROR);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalSheet title={event.title} label="Запись на событие" size="sm" onClose={onClose}>
      <div className="flex flex-col gap-6 px-4 md:px-8">
        <Facts
          items={[
            { label: "Когда", value: whenLong(event) },
            ...(event.location ? [{ label: "Где", value: event.location }] : []),
          ]}
        />

        {embed && (
          <iframe
            src={embed}
            title="Запись на событие"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            className="h-[440px] max-h-[70vh] w-full border-0 bg-white"
          />
        )}

        {!embed && event.seats !== undefined && (
          <p className="type-caption min-h-4">
            {seats === null ? (
              <span aria-hidden="true" className="block h-4 w-40 bg-surface" />
            ) : phase === "full" ? null : (
              seats.left !== null && fillSeats(t.seatsLeft, seats.left)
            )}
          </p>
        )}

        {phase === "full" && <p role="status" className="type-body">{t.seatsNone}</p>}
        {phase === "closed" && <p role="status" className="type-body">{t.closed}</p>}
        {result && (
          <p role="status" className="type-h3">
            {result === "done" ? t.done : t.already}
          </p>
        )}

        {!embed && !result && (
          <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <input
              name="name"
              value={name}
              disabled={shut}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Фамилия и имя"
              aria-label="Фамилия и имя"
              aria-invalid={error === NEED_NAME ? true : undefined}
              className={`${fieldClass("input", "light")} disabled:border-line disabled:text-muted`}
            />
            <input
              type="tel"
              name="phone"
              value={phone}
              disabled={shut}
              autoComplete="tel"
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Телефон"
              aria-label="Телефон"
              aria-invalid={error === NEED_PHONE ? true : undefined}
              className={`${fieldClass("input", "light")} disabled:border-line disabled:text-muted`}
            />
            <input
              type="email"
              name="email"
              value={email}
              disabled={shut}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              aria-invalid={error === NEED_EMAIL ? true : undefined}
              className={`${fieldClass("input", "light")} disabled:border-line disabled:text-muted`}
            />

            <label className="type-body-s flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                disabled={shut}
                onChange={(e) => setConsent(e.target.checked)}
                className="peer sr-only"
              />
              <span className="flex size-5 shrink-0 items-center justify-center border border-ink bg-white peer-checked:bg-ink peer-checked:text-white peer-disabled:border-line peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-checked:[&>svg]:opacity-100">
                <svg viewBox="0 0 20 20" fill="none" className="size-5 opacity-0">
                  <path d="m5 10.5 3.5 3.5L15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </span>
              <span>
                {consentText ? (
                  <>
                    {consentText.before}
                    <Link
                      href={`/${locale}/personal-data-consent`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="underline"
                    >
                      {consentText.link}
                    </Link>
                    {consentText.after}
                  </>
                ) : (
                  t.consent
                )}
              </span>
            </label>

            {error && <p role="alert" className={fieldErrorClass("light")}>{error}</p>}

            <button
              type="submit"
              disabled={busy || shut}
              className={`${buttonClass("primary", "L")} w-full`}
            >
              {t.submit}
            </button>
          </form>
        )}
      </div>
    </ModalSheet>
  );
}
