"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";

const KEY = "trendsetter.cookies-dismissed";

/** Storage can be blocked outright, in which case the notice keeps showing. */
function isDismissed() {
  try {
    return window.localStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function dismiss() {
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    // Refusing to remember anything is the visitor's call; the notice will
    // simply be back on the next page.
  }
  listeners.forEach((onChange) => onChange());
}

/**
 * 108px band across the bottom of the page: ink at half strength over a 20px
 * blur. The empty box on the left is what centres the copy in the bar itself
 * rather than in the space left over beside the close button.
 */
export function CookieNotice({ locale }: { locale: Locale }) {
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[1920px] -translate-x-1/2">
      <div className="flex items-start justify-between gap-6 bg-ink/50 px-6 py-6 shadow-[0_-5px_16px_rgba(37,33,32,0.24)] backdrop-blur-[20px] lg:h-[108px] lg:gap-10 lg:px-10">
        <div aria-hidden="true" className="hidden size-[30px] shrink-0 lg:block" />

        <p className="text-center font-mono text-xs uppercase leading-6 tracking-[2px] text-white sm:text-sm lg:text-xl lg:leading-[30px] lg:tracking-[4px]">
          Мы используем файлы{" "}
          <Link href={`/${locale}/cookies`} className="font-bold underline-offset-4 transition-colors hover:text-brand hover:underline">
            cookie
          </Link>
          , чтобы сайт работал удобнее и быстрее.
          <br />
          Надеемся, вы не против.
        </p>

        <button
          type="button"
          aria-label="Закрыть"
          onClick={dismiss}
          className="flex size-[30px] shrink-0 items-center justify-center text-white transition-colors hover:text-brand"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m1 1 22 22M23 1 1 23" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
