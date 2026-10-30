"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonClass } from "@/components/ui/Button";
import { fieldClass, fieldErrorClass } from "@/components/ui/fieldClass";
import type { FormField } from "@/lib/bonusRarus/registrationForm";

type Step =
  | { kind: "phone" }
  | { kind: "register"; fields: FormField[] }
  | { kind: "code"; channel: string; codeLength: number; registering: boolean };

const CHANNEL_WORD: Record<string, string> = {
  mail: "на почту",
  phone: "в SMS",
  telegram: "в Telegram",
  max: "в MAX",
  flashcall: "звонком — это последние цифры номера",
};

const ERROR = "Не удалось отправить, попробуйте позже";
const YES_NO = [
  { id: "true", name: "Да" },
  { id: "false", name: "Нет" },
];
const INPUT_TYPE: Partial<Record<FormField["kind"], string>> = { email: "email", number: "number" };
const AUTOCOMPLETE: Record<string, string> = { name: "given-name", email: "email", birthday: "bday" };

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
        <legend className="type-caption mb-2 text-text-2">{caption(field)}</legend>
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
        <span className="type-caption text-text-2">{caption(field)}</span>
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
 * DEMO: вход в кабинет карты через пробное пространство сервиса лояльности.
 * Телефон - и сервис либо присылает код (клиент уже есть), либо сайт
 * показывает анкету с полями из кабинета сервиса, и код приходит после неё.
 * Код уходит на сервер один раз, как его ввели; после него страница
 * перерисовывается уже с кабинетом.
 */
export function LoyaltyAuth({ locale }: { locale: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>({ kind: "phone" });
  const [phone, setPhone] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [personalData, setPersonalData] = useState(false);
  const [newsletters, setNewsletters] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function post(path: string, body: unknown) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { ok: res.ok, out: await res.json().catch(() => ({})) };
  }

  async function start(registering: boolean) {
    setBusy(true);
    setError("");
    try {
      const { ok, out } = await post(
        "/api/loyalty/account/start",
        registering
          ? { phone, values, personalDataAccepted: personalData, newslettersAccepted: newsletters }
          : { phone },
      );
      if (!ok) return setError(out.error ?? ERROR);
      if (out.status === "register") {
        setStep({ kind: "register", fields: (out.fields as FormField[]).filter((f) => f.id !== "phone") });
        return;
      }
      setCode("");
      setStep({ kind: "code", channel: out.channel, codeLength: out.codeLength, registering });
    } catch {
      setError(ERROR);
    } finally {
      setBusy(false);
    }
  }

  function submitPhone(e: FormEvent) {
    e.preventDefault();
    if (!busy && phone.trim()) void start(false);
  }

  function submitForm(e: FormEvent) {
    e.preventDefault();
    if (busy || step.kind !== "register") return;
    const missing = step.fields.filter((f) => f.required && !values[f.id]?.trim()).map((f) => f.name);
    if (missing.length) return setError(`Заполните: ${missing.join(", ")}`);
    if (!personalData) return setError("Нужно согласие на обработку персональных данных");
    void start(true);
  }

  async function submitCode(e: FormEvent) {
    e.preventDefault();
    if (busy || step.kind !== "code" || !code.trim()) return;
    setBusy(true);
    setError("");
    try {
      const { ok, out } = await post(
        "/api/loyalty/account/confirm",
        step.registering ? { code: code.trim(), values, newslettersAccepted: newsletters } : { code: code.trim() },
      );
      if (!ok) {
        if (out.expired) setStep({ kind: "phone" });
        return setError(out.error ?? "Код не подошёл, проверьте и попробуйте ещё раз");
      }
      router.refresh();
    } catch {
      setError(ERROR);
    } finally {
      setBusy(false);
    }
  }

  const back = (
    <button
      type="button"
      onClick={() => {
        setError("");
        setStep({ kind: "phone" });
      }}
      className="type-body-s self-start underline transition-colors duration-150 hover:text-brand"
    >
      Изменить номер
    </button>
  );

  return (
    <div className="flex w-full max-w-[437px] flex-col gap-6">
      {step.kind === "phone" && (
        <form onSubmit={submitPhone} noValidate className="flex flex-col gap-4">
          <p className="type-body-l text-text-2">
            Введите номер телефона: пришлём код, чтобы войти, или предложим оформить карту, если её ещё нет.
          </p>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 900 000-00-00"
            aria-label="Номер телефона"
            autoComplete="tel"
            className={fieldClass("input", "light")}
          />
          {error && <p role="alert" className={fieldErrorClass("light")}>{error}</p>}
          <button type="submit" disabled={busy} className={`${buttonClass("primary", "L")} w-full`}>
            Получить код
          </button>
        </form>
      )}

      {step.kind === "register" && (
        <form onSubmit={submitForm} noValidate className="flex flex-col gap-4">
          <p className="type-body-l text-text-2">
            Карты с номером {phone} ещё нет. Заполните анкету — и она появится сразу после кода.
          </p>
          {step.fields.map((field) => (
            <Field
              key={field.id}
              field={field}
              value={values[field.id] ?? ""}
              onChange={(value) => setValues((v) => ({ ...v, [field.id]: value }))}
            />
          ))}
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
          {error && <p role="alert" className={fieldErrorClass("light")}>{error}</p>}
          <button type="submit" disabled={busy} className={`${buttonClass("primary", "L")} w-full`}>
            Оформить карту
          </button>
          {back}
        </form>
      )}

      {step.kind === "code" && (
        <form onSubmit={submitCode} noValidate className="flex flex-col gap-4">
          <p className="type-body-l text-text-2">
            Код отправили {CHANNEL_WORD[step.channel] ?? step.channel} на номер {phone}.
          </p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, step.codeLength))}
            placeholder={`Код из ${step.codeLength} цифр`}
            aria-label="Код подтверждения"
            autoComplete="one-time-code"
            inputMode="numeric"
            autoFocus
            className={fieldClass("input", "light")}
          />
          {error && <p role="alert" className={fieldErrorClass("light")}>{error}</p>}
          <button type="submit" disabled={busy} className={`${buttonClass("primary", "L")} w-full`}>
            {step.registering ? "Подтвердить и оформить" : "Войти"}
          </button>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {back}
            <button
              type="button"
              disabled={busy}
              onClick={() => void start(step.registering)}
              className="type-body-s underline transition-colors duration-150 hover:text-brand disabled:opacity-50"
            >
              Отправить код ещё раз
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
