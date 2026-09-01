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
 * 80px band across the bottom of the page: ink at 40% over a 20px blur, the copy
 * centred in the bar itself - which is what the empty box on the left is for,
 * balancing the close button on the right.
 */
export function CookieNotice({ locale }: { locale: Locale }) {
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[1920px] -translate-x-1/2">
      <div className="flex items-center justify-between gap-6 bg-ink/40 px-6 py-6 shadow-[0_-5px_16px_rgba(37,33,32,0.24)] backdrop-blur-[20px] lg:gap-10 lg:px-10">
        <div aria-hidden="true" className="size-6 shrink-0" />

        {/* Inter Tight 14 on a 16 line, 3 of tracking - the two lines and the
            24 of padding either side are what make the band 80. The file
            underlines both words of the link and leaves them at the same
            weight as the rest of the sentence. */}
        <p className="text-center text-sm/4 uppercase tracking-[3px] text-white">
          Мы используем{" "}
          <Link
            href={`/${locale}/cookies`}
            className="underline underline-offset-2 transition-colors hover:text-white/70"
          >
            файлы cookies
          </Link>
          , чтобы сайт работал лучше и быстрее.
          <br />
          Надеемся, вы не против.
        </p>

        <button
          type="button"
          aria-label="Закрыть"
          onClick={dismiss}
          className="flex size-6 shrink-0 items-center justify-center text-white transition-colors hover:text-brand"
        >
          {/* 18 of ink centred in a 24 box, 2 thick */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m3 3 18 18M21 3 3 21" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
