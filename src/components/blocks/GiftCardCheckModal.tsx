"use client";

import { type FormEvent, useState } from "react";
import { ModalSheet } from "@/components/ui/ModalSheet";
import { buttonClass } from "@/components/ui/Button";
import { fieldClass, fieldErrorClass } from "@/components/ui/fieldClass";

type Result = { balance: number; holded: number; status: string };

/** DEMO: проверка баланса сертификата через пробное пространство сервиса (см. BONUS_RARUS_REGISTRATION_TOKEN). */
export function GiftCardCheckModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy || !code.trim()) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/loyalty/gift-card?code=${encodeURIComponent(code.trim())}`);
      const out = await res.json();
      if (!res.ok) {
        setError(res.status === 404 ? "Сертификат с таким кодом не найден" : out.error ?? "Не удалось проверить сертификат");
        return;
      }
      setResult(out);
    } catch {
      setError("Не удалось проверить сертификат, попробуйте позже");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalSheet title="Подарочная карта" label="Проверить баланс" size="sm" onClose={onClose}>
      <div className="flex flex-col gap-6 px-4 md:px-8">
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Код сертификата"
            aria-label="Код сертификата"
            className={fieldClass("input", "light")}
          />
          {error && <p role="alert" className={fieldErrorClass("light")}>{error}</p>}
          <button type="submit" disabled={busy} className={`${buttonClass("primary", "L")} w-full`}>
            Проверить
          </button>
        </form>

        {result && (
          <div className="flex flex-col gap-2 border-t border-line pt-6">
            <p className="type-body">Остаток: {result.balance} ₽</p>
            {result.holded > 0 && <p className="type-body">В заморозке: {result.holded} ₽</p>}
            {result.status && <p className="type-body">Статус: {result.status}</p>}
          </div>
        )}
      </div>
    </ModalSheet>
  );
}
