"use client";

import { type FormEvent, useState } from "react";
import { ModalSheet } from "@/components/ui/ModalSheet";
import { buttonClass } from "@/components/ui/Button";
import { fieldClass, fieldErrorClass } from "@/components/ui/fieldClass";

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

/**
 * DEMO: оформление карты через пробное пространство сервиса, не боевая
 * интеграция (см. BONUS_RARUS_REGISTRATION_TOKEN). Форма -> запрос на сервер ->
 * либо карта сразу, либо шаг "код из письма/SMS", который сервис отправляет сам.
 */
export function LoyaltyRegisterModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>({ kind: "form" });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!name.trim() || !phone.trim() || !consent) {
      setError("Заполните имя, телефон и согласие на обработку данных");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/loyalty/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, gender, email, personalDataAccepted: true, newslettersAccepted: consent }),
      });
      const out = await res.json();
      if (!res.ok) {
        setError(out.error ?? "Не удалось отправить, попробуйте позже");
        return;
      }
      if (out.status === "code_required") {
        setStep({ kind: "code", sessionId: out.sessionId, channel: out.channel, receiver: out.receiver });
      } else {
        setStep({ kind: "done", barcode: out.card.barcode, balance: out.card.balance, level: out.card.level });
      }
    } catch {
      setError("Не удалось отправить, попробуйте позже");
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(e: FormEvent) {
    e.preventDefault();
    if (busy || step.kind !== "code" || !code.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/loyalty/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          gender,
          email,
          personalDataAccepted: true,
          newslettersAccepted: consent,
          code: { sessionId: step.sessionId, value: code.trim() },
        }),
      });
      const out = await res.json();
      if (!res.ok || out.status !== "registered") {
        setError(out.error ?? "Код не подошёл, проверьте и попробуйте ещё раз");
        return;
      }
      setStep({ kind: "done", barcode: out.card.barcode, balance: out.card.balance, level: out.card.level });
    } catch {
      setError("Не удалось отправить, попробуйте позже");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalSheet title="Система лояльности" label="Оформить карту" size="sm" onClose={onClose}>
      <div className="flex flex-col gap-6 px-4 md:px-8">
        {step.kind === "form" && (
          <form onSubmit={submitForm} noValidate className="flex flex-col gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя"
              aria-label="Имя"
              className={fieldClass("input", "light")}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Телефон"
              aria-label="Телефон"
              className={fieldClass("input", "light")}
            />
            <div className="flex gap-6">
              <label className="type-body flex items-center gap-2">
                <input type="radio" checked={gender === "female"} onChange={() => setGender("female")} /> Женский
              </label>
              <label className="type-body flex items-center gap-2">
                <input type="radio" checked={gender === "male"} onChange={() => setGender("male")} /> Мужской
              </label>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (необязательно)"
              aria-label="Email"
              className={fieldClass("input", "light")}
            />
            <label className="type-body-s flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="peer sr-only"
              />
              <span className="flex size-5 shrink-0 items-center justify-center border border-ink bg-white peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-checked:[&>svg]:opacity-100">
                <svg viewBox="0 0 20 20" fill="none" className="size-5 opacity-0">
                  <path d="m5 10.5 3.5 3.5L15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </span>
              <span>Согласен(на) на обработку персональных данных и получение рассылок</span>
            </label>

            {error && <p role="alert" className={fieldErrorClass("light")}>{error}</p>}

            <button type="submit" disabled={busy} className={`${buttonClass("primary", "L")} w-full`}>
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
