"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { GiftCardCheckModal } from "@/components/blocks/GiftCardCheckModal";

/** The button that opens the gift-card balance demo; see `fallbackPages.ts`. */
export function GiftCardDemoActions() {
  const [open, setOpen] = useState(false);

  return (
    <section className="flex px-4 pt-6 md:px-10">
      <button type="button" onClick={() => setOpen(true)} className={buttonClass("primary", "L")}>
        Проверить баланс
      </button>
      {open && <GiftCardCheckModal onClose={() => setOpen(false)} />}
    </section>
  );
}
