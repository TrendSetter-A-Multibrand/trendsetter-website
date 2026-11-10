"use client";

import { Fragment, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "@/components/ui/Link";
import type { Locale } from "@/lib/i18n/locales";
import { buttonClass } from "@/components/ui/Button";

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
 * The file's Cookie informer (approved by the designer on 20.10): a flat Sage
 * bar pressed to the foot of the first screen over the content - on a phone just
 * above the tab bar - with the sentence in Body S white, its link to the cookie
 * policy, and one button, "Понятно". No dimming and no popup; the page stays
 * usable. It appears with the page, without animation, and goes at once when
 * the button is pressed, for good.
 *
 * Desktop: one row, the text at the left and the button at the right. Phone: the
 * text over a button across the full width, 56 tall.
 */
export function CookieNotice({
  locale,
  text,
}: {
  locale: Locale;
  /** The sentence as the editor wrote it: {braces} mark the link, a line break stays one. */
  text: string;
}) {
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  const bar = useRef<HTMLDivElement>(null);

  // Publishes how tall the bar is, so a card standing at the foot of the screen
  // (the shops map on a phone) can rise above it instead of hiding behind it
  useEffect(() => {
    const el = bar.current;
    if (dismissed || !el) return;
    const root = document.documentElement;
    const publish = () => root.style.setProperty("--cookie-h", `${el.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--cookie-h");
    };
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div ref={bar} className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] z-40 mx-auto w-full max-w-[1920px] md:bottom-0">
      <div className="flex flex-col gap-4 bg-ink px-4 py-4 md:flex-row md:items-center md:gap-6 md:px-10">
        <p className="type-body-s flex-1 text-white">
          {text.split("\n").map((line, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {line.split(/(\{[^}]*\})/).map((part, j) =>
                part.startsWith("{") && part.endsWith("}") ? (
                  <Link
                    key={j}
                    href={`/${locale}/cookies`}
                    className="underline underline-offset-2 transition-colors duration-150 hover:text-line"
                  >
                    {part.slice(1, -1)}
                  </Link>
                ) : (
                  part
                )
              )}
            </Fragment>
          ))}
        </p>

        <button
          type="button"
          onClick={dismiss}
          className={`${buttonClass("inverseOnDark", "L")} md:h-11 md:shrink-0 md:px-6`}
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
