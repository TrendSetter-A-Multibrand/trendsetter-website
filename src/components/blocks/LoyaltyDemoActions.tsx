"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { LoyaltyRegisterModal } from "@/components/blocks/LoyaltyRegisterModal";
import { LoyaltyCardCheckModal } from "@/components/blocks/LoyaltyCardCheckModal";

/**
 * The buttons that open the loyalty demo: oформить карту, проверить карту.
 * Only stood up for показа руководству, against the vendor's test space; see
 * the fallback page that draws it, `fallbackPages.ts`, for the caveat.
 */
export function LoyaltyDemoActions() {
  const [open, setOpen] = useState<"register" | "check" | null>(null);

  return (
    <section className="flex flex-col gap-4 px-4 pt-6 md:flex-row md:px-10">
      <button type="button" onClick={() => setOpen("register")} className={buttonClass("primary", "L")}>
        Оформить карту
      </button>
      <button type="button" onClick={() => setOpen("check")} className={buttonClass("outline", "L")}>
        Проверить карту
      </button>

      {open === "register" && <LoyaltyRegisterModal onClose={() => setOpen(null)} />}
      {open === "check" && <LoyaltyCardCheckModal onClose={() => setOpen(null)} />}
    </section>
  );
}
