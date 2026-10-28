"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ModalSheet } from "@/components/ui/ModalSheet";
import { buttonClass } from "@/components/ui/Button";
import { fieldClass, fieldErrorClass } from "@/components/ui/fieldClass";
import { useLocale } from "@/lib/i18n/useLocale";
import type { FormField } from "@/lib/bonusRarus/registrationForm";

type Step =
  | { kind: "form" }
  | { kind: "code"; sessionId: string; channel: string; receiver: string }
  | { kind: "done"; barcode: string; balance: number; level: string };

const CHANNEL_WORD: Record<string, string> = {
  mail: "почту",
  phone: "телефон",
  telegram: "Telegram",
  max: "MAX",
  flashcall: "звонком",
};

const ERROR = "Не удалось отправить, попробуйте позже";
const YES_NO = [
  { id: "true", name: "Да" },
  { id: "false", name: "Нет" },
];
const INPUT_TYPE: Partial<Record<FormField["kind"], string>> = { phone: "tel", email: "email", number: "number" };
const AUTOCOMPLETE: Record<string, string> = { name: "given-name", phone: "tel", email: "email", birthday: "bday" };

/** The file's checkbox on a light ground, controlled. */
function Tick({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="type-body-s flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="flex size-5 shrink-0 items-center justify-center border border-ink bg-white peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-checked:[&>svg]:opacity-100">
        <svg viewBox="0 0 20 20" fill="none" className="size-5 opacity-0">
          <path d="m5 10.5 3.5 3.5L15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}

const caption = (field: FormField) => (field.required ? field.name : `${field.name} (необязательно)`);

/** One of the cabinet's fields: a text box, a date, or a row of choices. */
function Field({ field, value, onChange }: { field: FormField; value: string; onChange: (value: string) => void }) {
  if (field.kind === "bool" || field.kind === "choice") {
    const options = field.kind === "bool" ? YES_NO : (field.options ?? []);
    return (
      <fieldset className="flex flex-col gap-2">
        <legend className="type-caption mb-2 text-muted">{caption(field)}</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {options.map((o) => (
            <label key={o.id} className="type-body flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name={field.id}
                checked={value === o.id}
                onChange={() => onChange(o.id)}
                className="accent-ink"
              />
              {o.name}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.kind === "date") {
    return (
      <label className="flex flex-col gap-2">
        <span className="type-caption text-muted">{caption(field)}</span>
        <input
          type="date"
          value={value}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={AUTOCOMPLETE[field.id]}
          className={fieldClass("input", "light")}
        />
      </label>
    );
  }

  return (
    <input
      type={INPUT_TYPE[field.kind] ?? "text"}
      inputMode={field.kind === "phone" ? "tel" : undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={caption(field)}
      aria-label={field.name}
      autoComplete={AUTOCOMPLETE[field.id]}
      className={fieldClass("input", "light")}
    />
  );
}

/**
 * DEMO: оформление карты через пробное пространство сервиса, не боевая
 * интеграция (см. BONUS_RARUS_REGISTRATION_TOKEN). Поля и их обязательность
 * берутся из кабинета (`/api/loyalty/form`), а не из кода: что там отмечено
 * обязательным, то форма и требует. Форма -> запрос на сервер -> либо карта
 * сразу, либо шаг "код из письма/SMS", который сервис отправляет сам.
 */
export function LoyaltyRegisterModal({ onClose }: { onClose: () => void }) {
  const locale = useLocale();
  const [fields, setFields] = useState<FormField[] | null>(null);
  const [step, setStep] = useState<Step>({ kind: "form" });
  const [values, setValues] = useState<Record<string, string>>({});
  const [personalData, setPersonalData] = useState(false);
  const [newsletters, setNewsletters] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/loyalty/form", { cache: "no-store", signal: ctrl.signal })
      .then(async (res) => {
        const out = await res.json();
        if (!res.ok) throw new Error(out.error);
        setFields(out.fields);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setFields([]);
        setError("Система лояльности временно недоступна");
      });
    return () => ctrl.abort();
  }, []);

  async function send(withCode?: { sessionId: string; value: string }) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/loyalty/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          values,
          personalDataAccepted: personalData,
          newslettersAccepted: newsletters,
          code: withCode,
        }),
      });
      const out = await res.json();
      if (!res.ok) {
        setError(out.error ?? (withCode ? "Код не подошёл, проверьте и попробуйте ещё раз" : ERROR));
        return;
      }
      if (out.status === "code_required") {
        setStep({ kind: "code", sessionId: out.sessionId, channel: out.channel, receiver: out.receiver });
      } else {
        setStep({ kind: "done", barcode: out.card.barcode, balance: out.card.balance, level: out.card.level });
      }
    } catch {
      setError(ERROR);
    } finally {
      setBusy(false);
    }
  }

  function submitForm(e: FormEvent) {
    e.preventDefault();
    if (busy || !fields?.length) return;
    const missing = fields.filter((f) => f.required && !values[f.id]?.trim()).map((f) => f.name);
    if (missing.length) {
      setError(`Заполните: ${missing.join(", ")}`);
      return;
    }
    if (!personalData) {
      setError("Нужно согласие на обработку персональных данных");
      return;
    }
    void send();
  }

  function submitCode(e: FormEvent) {
    e.preventDefault();
    if (busy || step.kind !== "code" || !code.trim()) return;
    void send({ sessionId: step.sessionId, value: code.trim() });
  }

  return (
    <ModalSheet title="Система лояльности" label="Оформить карту" size="sm" onClose={onClose}>
      <div className="flex flex-col gap-6 px-4 md:px-8">
        {step.kind === "form" && (
          <form onSubmit={submitForm} noValidate className="flex flex-col gap-4">
            {fields === null &&
              [0, 1, 2, 3].map((i) => <span key={i} aria-hidden="true" className="block h-12 bg-surface" />)}

            {fields?.map((field) => (
              <Field
                key={field.id}
                field={field}
                value={values[field.id] ?? ""}
                onChange={(value) => setValues((v) => ({ ...v, [field.id]: value }))}
              />
            ))}

            {!!fields?.length && (
              <>
                <Tick checked={personalData} onChange={setPersonalData}>
                  Согласен(на) на{" "}
                  <Link
                    href={`/${locale}/personal-data-consent`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="underline"
                  >
                    обработку персональных данных
                  </Link>
                </Tick>
                <Tick checked={newsletters} onChange={setNewsletters}>
                  Хочу получать новости и предложения (необязательно)
                </Tick>
              </>
            )}

            {error && <p role="alert" className={fieldErrorClass("light")}>{error}</p>}

            <button
              type="submit"
              disabled={busy || !fields?.length}
              className={`${buttonClass("primary", "L")} w-full`}
            >
              Оформить карту
            </button>
          </form>
        )}

        {step.kind === "code" && (
          <form onSubmit={submitCode} noValidate className="flex flex-col gap-4">
            <p className="type-body">
              Код отправлен на {CHANNEL_WORD[step.channel] ?? step.channel}: {step.receiver}
            </p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Код из письма или SMS"
              aria-label="Код подтверждения"
              autoComplete="one-time-code"
              inputMode="numeric"
              className={fieldClass("input", "light")}
            />
            {error && <p role="alert" className={fieldErrorClass("light")}>{error}</p>}
            <button type="submit" disabled={busy} className={`${buttonClass("primary", "L")} w-full`}>
              Подтвердить
            </button>
          </form>
        )}

        {step.kind === "done" && (
          <div className="flex flex-col gap-2">
            <p role="status" className="type-h3">Карта оформлена</p>
            <p className="type-body">Номер: {step.barcode || "—"}</p>
            <p className="type-body">Баланс: {step.balance} баллов</p>
            {step.level && <p className="type-body">Уровень: {step.level}</p>}
          </div>
        )}
      </div>
    </ModalSheet>
  );
}
