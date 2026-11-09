"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/Icons";
import { iconButtonClass } from "@/components/ui/iconButton";
import {
  ENTRY_DELAY_MS,
  atTheFoot,
  planFor,
  snoozeUntil,
  type PopupMemory,
  type VisitMemory,
} from "@/lib/telegramPopup";

const KEY = "trendsetter.telegram-popup";

/** Storage can be blocked outright; the pop-up then simply behaves as on a first visit. */
function readMemory(): PopupMemory {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as PopupMemory;
  } catch {
    return {};
  }
}
function writeMemory(memory: PopupMemory) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    // Not being able to remember is the visitor's setting, not an error
  }
}
function readVisit(): VisitMemory {
  try {
    return window.sessionStorage.getItem(KEY) as VisitMemory;
  } catch {
    return null;
  }
}
function writeVisit(visit: VisitMemory) {
  try {
    if (visit) window.sessionStorage.setItem(KEY, visit);
  } catch {
    // As above
  }
}

/**
 * The file's Telegram pop-up: a card in the bottom right corner, 360 wide, a
 * Sage frame, «[Telegram]» in Red with the cross, a headline, one line and the
 * red button. On a phone it is 343 wide, above the tab bar. It stands over the
 * cookie bar's place rather than under it - the bar's height is `--cookie-h`.
 *
 * When it comes is `lib/telegramPopup`. While the shops map takes the phone's
 * screen the page marks itself `data-map-view` and the pop-up is not drawn
 * (see globals.css). The channel's address is the Telegram link of the settings;
 * until one is written there «Подписаться» only closes the card.
 */
export function TelegramPopup({ href }: { href: string }) {
  const [mode, setMode] = useState<"entry" | "end" | null>(null);
  const stopWatching = useRef<(() => void) | null>(null);

  // At the foot of the page, once the first card has been closed
  function watchFoot() {
    stopWatching.current?.();
    const check = () => {
      if (atTheFoot(window.scrollY, window.innerHeight, document.documentElement.scrollHeight)) {
        stopWatching.current?.();
        stopWatching.current = null;
        setMode("end");
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    stopWatching.current = () => window.removeEventListener("scroll", check);
    // A page too short to scroll is at its foot already
    window.requestAnimationFrame(check);
  }

  useEffect(() => {
    const plan = planFor(readMemory(), readVisit(), Date.now());
    if (plan === "end") watchFoot();
    const timer = plan === "entry" ? window.setTimeout(() => setMode("entry"), ENTRY_DELAY_MS) : undefined;
    return () => {
      window.clearTimeout(timer);
      stopWatching.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on arrival; watchFoot only touches refs and setters
  }, []);

  if (!mode) return null;

  function close() {
    writeMemory({ until: snoozeUntil(Date.now()) });
    if (mode === "entry") {
      writeVisit("entry-closed");
      watchFoot();
    } else {
      writeVisit("done");
    }
    setMode(null);
  }

  function subscribe() {
    if (href && href !== "#") {
      writeMemory({ never: true });
      writeVisit("done");
      window.open(href, "_blank", "noopener,noreferrer");
      setMode(null);
    } else {
      close();
    }
  }

  return (
    <aside
      aria-label="Подписка на Telegram-канал"
      className="tg-popup fixed inset-x-4 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+var(--cookie-h,0px)+16px)] z-40 flex animate-fade-in flex-col gap-4 border border-ink bg-white p-4 text-ink md:inset-x-auto md:bottom-[calc(1.5rem+var(--cookie-h,0px))] md:right-6 md:w-[360px] md:p-6"
    >
      <div className="flex items-center justify-between">
        <p className="type-caption text-brand">[Telegram]</p>
        <button
          type="button"
          aria-label="Закрыть"
          onClick={close}
          className={`${iconButtonClass()} -mr-3 -mt-3 md:-mr-3`}
        >
          <CloseIcon />
        </button>
      </div>
      <p className="type-h3">Подпишитесь на наш Telegram-канал</p>
      <p className="type-body-s">Пишем о новых поставках, событиях и выпусках журнала.</p>
      <button type="button" onClick={subscribe} className={`${buttonClass("primary", "M")} w-full`}>
        Подписаться
      </button>
    </aside>
  );
}
