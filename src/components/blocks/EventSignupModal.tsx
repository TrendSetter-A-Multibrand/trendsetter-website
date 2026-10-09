"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ModalPhoto, ModalSheet } from "@/components/ui/ModalSheet";
import { useSiteSettings } from "@/components/layout/SettingsContext";
import { eventDate, type Event } from "@/lib/events";
import {
  checkSignup,
  fillSeats,
  readSeats,
  readSignup,
  splitBraces,
  type SeatsState,
} from "@/lib/eventSignupForm";

const ERROR = "Не удалось отправить, попробуйте позже";
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
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<"done" | "already" | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/events/${event.uuid}/seats`, { cache: "no-store", signal: ctrl.signal })
      .then((res) => res.json())
      .then((body) => setSeats(readSeats(body)))
      // The count is a courtesy; the register route still has the last word
      .catch((e) => e?.name !== "AbortError" && setSeats({ phase: "open", left: null }));
    return () => ctrl.abort();
  }, [event.uuid]);

  const phase = seats?.phase ?? "open";
  const shut = phase !== "open";
  const { day, monthFull, time } = eventDate(event.date);
  const when = [`${day} ${monthFull}`, time, event.location].filter(Boolean).join(" · ");
  const consentText = splitBraces(t.consent);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy || shut) return;
    const invalid = checkSignup(email, consent);
    if (invalid) {
      setError(invalid === "consent" ? NEED_CONSENT : NEED_EMAIL);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/events/${event.uuid}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, website: "" }),
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
    <ModalSheet title={event.title} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <ModalPhoto src={event.image} />
        <div className="flex flex-col gap-4 px-6 lg:px-10">
          {event.description && (
            <p className="whitespace-pre-line text-base/5">{event.description}</p>
          )}
          <p className="text-sm/[19px] uppercase tracking-[1px]">{when}</p>
        </div>
        <div className="px-6 lg:px-10">
          <Divider />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6 lg:px-10">
        {event.seats !== undefined && (
          <p className="min-h-5 font-mono text-base/5 font-medium">
            {seats === null ? (
              <span aria-hidden="true" className="block h-5 w-40 bg-surface" />
            ) : phase === "full" ? null : (
              seats.left !== null && fillSeats(t.seatsLeft, seats.left)
            )}
          </p>
        )}

        {phase === "full" && <p role="status" className="text-base/5">{t.seatsNone}</p>}
        {phase === "closed" && <p role="status" className="text-base/5">{t.closed}</p>}
        {result && (
          <p role="status" className="text-base/5">
            {result === "done" ? t.done : t.already}
          </p>
        )}

        {!result && (
          <form onSubmit={submit} noValidate className="flex max-w-[586px] flex-col gap-6">
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <input
              type="email"
              name="email"
              value={email}
              disabled={shut}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              className="h-12 border border-ink bg-transparent px-4 text-sm/[18px] tracking-[1px] outline-none placeholder:text-muted disabled:border-surface-active disabled:text-muted"
            />

            <label className="flex cursor-pointer items-start gap-4 text-sm/[18px]">
              <input
                type="checkbox"
                checked={consent}
                disabled={shut}
                onChange={(e) => setConsent(e.target.checked)}
                className="peer sr-only"
              />
              <span className="mt-px flex size-6 shrink-0 items-center justify-center border border-ink peer-checked:[&>svg]:opacity-100 peer-disabled:border-surface-active">
                <svg viewBox="0 0 24 24" fill="none" className="size-4 opacity-0">
                  <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

            {error && <p role="alert" className="text-sm/[18px] text-brand">{error}</p>}

            <button
              type="submit"
              disabled={busy || shut}
              className={`${buttonClass("primary")} w-full lg:w-[180px]`}
            >
              {t.submit}
            </button>
          </form>
        )}
      </div>
    </ModalSheet>
  );
}
