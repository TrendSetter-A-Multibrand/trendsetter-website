"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/Button";

/**
 * "Add to a wallet": the pass is built by the loyalty service on the tap, which
 * takes a few seconds, and until it arrives the page looks frozen. So the button
 * says it is working. The tap is still an ordinary link - the phone itself takes
 * the file from there - and the button comes back when the page is shown again.
 */
export function WalletButton({ href, warm, children }: { href: string; warm?: boolean; children: React.ReactNode }) {
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
        if (!warm) return;
        // Safari hangs on a navigation that waits for the file: have the service build it
        // first, then go to the link, which the server now answers at once. If the build
        // failed the link still goes, and the server sends the visitor back with a notice.
        e.preventDefault();
        fetch(`${href}&warm=1`, { credentials: "same-origin" })
          .catch(() => {})
          .finally(() => {
            window.location.href = href;
          });
      }}
      className={`${buttonClass("primary", "L")} flex w-full items-center justify-center gap-3 ${busy ? "opacity-80" : ""}`}
    >
      {busy && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {busy ? "Готовим карту…" : children}
    </a>
  );
}
