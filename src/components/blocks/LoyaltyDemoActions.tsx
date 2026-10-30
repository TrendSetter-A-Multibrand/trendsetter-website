"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { LoyaltyCardCheckModal } from "@/components/blocks/LoyaltyCardCheckModal";
import { useLocale } from "@/lib/i18n/useLocale";

/**
 * The buttons that open the loyalty demo: "Моя карта" - оформить карту или
 * войти по телефону (the cabinet at /card, on the vendor's customer flow) - and
 * a balance check by card number (the till flow). Each shows only where its
 * own demo is set up. Only stood up for показа руководству, against the
 * vendor's test space; see `fallbackPages.ts` for the caveat.
 */
export function LoyaltyDemoActions({ account, check }: { account: boolean; check: boolean }) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <section className="flex flex-col gap-4 px-4 pt-6 md:flex-row md:px-10">
      {account && (
        <Link href={`/${locale}/card`} className={buttonClass("primary", "L")}>
          Оформить карту или войти
        </Link>
      )}
      {check && (
        <button type="button" onClick={() => setOpen(true)} className={buttonClass("outline", "L")}>
          Проверить карту
        </button>
      )}

      {open && <LoyaltyCardCheckModal onClose={() => setOpen(false)} />}
    </section>
  );
}
