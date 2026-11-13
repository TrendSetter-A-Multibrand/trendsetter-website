"use client";

import { type FormEvent, useState } from "react";
import { ModalSheet } from "@/components/ui/ModalSheet";
import { buttonClass } from "@/components/ui/Button";
import { fieldClass, fieldErrorClass } from "@/components/ui/fieldClass";
import { Facts } from "@/components/cards/Facts";
import { cardStatus, points } from "@/lib/points";

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
          <div className="flex flex-col gap-4 border-t border-line pt-6">
            <div className="flex flex-col gap-2 bg-surface p-4 md:p-6">
              <span className="type-caption text-text-2">Баланс</span>
              <span className="type-h3">{points(result.balance)}</span>
            </div>
            <Facts
              items={[
                ...(result.level ? [{ label: "Уровень", value: result.level }] : []),
                ...(result.status ? [{ label: "Статус", value: cardStatus(result.status) }] : []),
              ]}
            />
          </div>
        )}
      </div>
    </ModalSheet>
  );
}
