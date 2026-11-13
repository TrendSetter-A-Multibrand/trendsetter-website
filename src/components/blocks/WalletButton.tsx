"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/Button";

/**
 * "Add to a wallet": the pass is built by the loyalty service on the tap, which
 * takes a few seconds, and until it arrives the page looks frozen. So the button
 * says it is working. The tap is still an ordinary link - the phone itself takes
 * the file from there - and the button comes back when the page is shown again.
 */
export function WalletButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const back = () => {
      if (document.visibilityState === "visible") setBusy(false);
    };
    window.addEventListener("pageshow", back);
    document.addEventListener("visibilitychange", back);
    return () => {
      window.removeEventListener("pageshow", back);
      document.removeEventListener("visibilitychange", back);
    };
  }, []);

  return (
    <a
      href={href}
      aria-busy={busy}
      onClick={(e) => {
        if (busy) return e.preventDefault();
        setBusy(true);
        // A pass that never comes must not leave the button stuck
        setTimeout(() => setBusy(false), 20000);
      }}
      className={`${buttonClass("primary", "L")} flex w-full items-center justify-center gap-3 ${busy ? "opacity-80" : ""}`}
    >
      {busy && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {busy ? "Готовим карту…" : children}
    </a>
  );
}
