"use client";

import { type FormEvent, useState } from "react";
import { ModalSheet } from "@/components/ui/ModalSheet";
import { buttonClass } from "@/components/ui/Button";
import { fieldClass, fieldErrorClass } from "@/components/ui/fieldClass";

type Result = { balance: number; level: string; status: string };

/** DEMO: проверка баланса карты через пробное пространство сервиса (см. BONUS_RARUS_REGISTRATION_TOKEN). */
export function LoyaltyCardCheckModal({ onClose }: { onClose: () => void }) {
  const [barcode, setBarcode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy || !barcode.trim()) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/loyalty/card?barcode=${encodeURIComponent(barcode.trim())}`);
      const out = await res.json();
      if (!res.ok) {
        setError(res.status === 404 ? "Карта с таким номером не найдена" : out.error ?? "Не удалось проверить карту");
        return;
      }
      setResult(out);
    } catch {
      setError("Не удалось проверить карту, попробуйте позже");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalSheet title="Система лояльности" label="Проверить карту" size="sm" onClose={onClose}>
      <div className="flex flex-col gap-6 px-4 md:px-8">
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Номер карты"
            aria-label="Номер карты"
            className={fieldClass("input", "light")}
          />
          {error && <p role="alert" className={fieldErrorClass("light")}>{error}</p>}
          <button type="submit" disabled={busy} className={`${buttonClass("primary", "L")} w-full`}>
            Проверить
          </button>
        </form>

        {result && (
          <div className="flex flex-col gap-2 border-t border-line pt-6">
            <p className="type-body">Баланс: {result.balance} баллов</p>
            {result.level && <p className="type-body">Уровень: {result.level}</p>}
            {result.status && <p className="type-body">Статус: {result.status}</p>}
          </div>
        )}
      </div>
    </ModalSheet>
  );
}
