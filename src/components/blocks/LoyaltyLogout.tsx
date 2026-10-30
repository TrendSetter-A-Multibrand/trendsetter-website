"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonClass } from "@/components/ui/Button";

/** Forgets the session on this browser and shows the sign-in again. */
export function LoyaltyLogout() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/loyalty/account/logout", { method: "POST" }).catch(() => null);
        router.refresh();
        setBusy(false);
      }}
      className={`${buttonClass("outline", "M")} self-start`}
    >
      Выйти
    </button>
  );
}
