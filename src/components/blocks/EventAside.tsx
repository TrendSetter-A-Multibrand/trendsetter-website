"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Facts } from "@/components/cards/Facts";
import { CalendarIcon } from "@/components/ui/Icons";
import { Toast } from "@/components/ui/Toast";
import { EventSignupModal } from "@/components/blocks/EventSignupModal";
import { useSiteSettings } from "@/components/layout/SettingsContext";
import type { Event } from "@/lib/events";
import { signupShut } from "@/lib/eventSignup";
import { SHARE_ROW, SHARE_TARGETS, ShareGlyph } from "@/components/ui/ShareMenu";
import { calendarLinks, whenLong } from "@/lib/eventsView";

/**
 * The file's Event aside: the facts - when, where, how to take part - and under
 * them the actions: "Записаться" across the full width in Red, which opens the
 * sheet, and two outlined buttons. "В календарь" opens a short list - Google,
 * Apple (the calendar file served from the site, which an iPhone adds straight
 * away), Outlook, or the file itself. "Поделиться" opens the device's own share
 * sheet where there is one (a phone or a tablet) and otherwise a list - copy the
 * link, MAX, VK, Telegram, OK - copying says so in a toast. On a desktop
 * it is the right column and stays put while the text scrolls; on a phone it
 * sits under the cover.
 *
 * On a phone the file adds the Book bar: the event's name and date and a
 * "Записаться" fixed above the tab bar - and it steps aside while the button in
 * the text is on screen, so there are never two of them.
 */
export function EventAside({
  event,
  locale,
  url,
}: {
  event: Event;
  locale: string;
  url: string;
}) {
  const { eventSignup } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [menu, setMenu] = useState<"calendar" | "share" | null>(null);
  const [mainButtonSeen, setMainButtonSeen] = useState(true);
  const button = useRef<HTMLButtonElement>(null);
  const canSign = event.signupEnabled && !signupShut(event);

  // The bar on a phone waits while the button in the text is in view
  useEffect(() => {
    const el = button.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setMainButtonSeen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(false), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function copyLink() {
    setMenu(null);
    try {
      await navigator.clipboard.writeText(url);
      setToast(true);
    } catch {
      // Clipboard refused: the address is in the bar anyway
    }
  }

  async function share() {
    // Only on a touch screen: Windows' own share window often comes up empty
    // ("Try that again"), so a desktop gets the site's list
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: event.title, url });
        return;
      } catch (e) {
        // Closed by the reader - nothing to do; any other refusal falls back to the list
        if ((e as Error)?.name === "AbortError") return;
      }
    }
    setMenu((was) => (was === "share" ? null : "share"));
  }

  const calendar = calendarLinks(event, { url, file: `/${locale}/events/${event.slug}/calendar.ics` });

  const take = event.signupEnabled
    ? event.seats !== undefined
      ? `По записи · ${event.seats} мест`
      : "По записи"
    : "Вход свободный";

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-offset,var(--header-h,116px))+24px)] lg:transition-[top] lg:duration-[250ms]">
      <Facts
        items={[
          { label: "Когда", value: whenLong(event) },
          ...(event.location ? [{ label: "Где", value: event.location }] : []),
          { label: "Участие", value: take },
          ...(event.age ? [{ label: "Возраст", value: event.age }] : []),
        ]}
      />

      <div className="flex flex-col gap-2">
        {canSign && (
          <button
            ref={button}
            type="button"
            onClick={() => setOpen(true)}
            className={`${buttonClass("primary", "L")} w-full`}
          >
            {eventSignup.button}
          </button>
        )}
        <div className="relative flex gap-2">
          {calendar.length > 0 && (
            <button
              type="button"
              aria-expanded={menu === "calendar"}
              onClick={() => setMenu((was) => (was === "calendar" ? null : "calendar"))}
              className={`${buttonClass("outline", "M")} flex-1 px-4`}
            >
              В календарь
              <CalendarIcon size={20} />
            </button>
          )}
          <button
            type="button"
            aria-expanded={menu === "share"}
            onClick={share}
            className={`${buttonClass("outline", "M")} flex-1 px-4`}
          >
            Поделиться
          </button>

          {menu && (
            <>
              {/* Catches the click that dismisses the list */}
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setMenu(null)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div className="absolute inset-x-0 top-full z-20 mt-2 border border-ink/15 bg-white py-2">
                {menu === "calendar"
                  ? calendar.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        {...(item.download
                          ? { download: `${event.slug}.ics` }
                          : item.href.startsWith("http")
                            ? { target: "_blank", rel: "noreferrer" }
                            : {})}
                        onClick={() => setMenu(null)}
                        className={SHARE_ROW}
                      >
                        {item.label}
                      </a>
                    ))
                  : SHARE_TARGETS.map((target) =>
                      target.href ? (
                        <a
                          key={target.label}
                          href={target.href(encodeURIComponent(url))}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setMenu(null)}
                          className={SHARE_ROW}
                        >
                          <ShareGlyph src={target.icon} />
                          {target.label}
                        </a>
                      ) : (
                        <button key={target.label} type="button" onClick={copyLink} className={SHARE_ROW}>
                          <ShareGlyph src={target.icon} />
                          {target.label}
                        </button>
                      ),
                    )}
              </div>
            </>
          )}
        </div>
      </div>

      {canSign && (
        <div
          className={`fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] z-30 flex items-center justify-between gap-4 border-t border-line bg-white px-4 py-3 transition-transform duration-[250ms] ease-out md:hidden ${
            mainButtonSeen ? "translate-y-[200%]" : "translate-y-0"
          }`}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="type-body-s truncate">{event.title}</p>
            <p className="type-caption">
              {event.day} {event.month}, {event.time}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`${buttonClass("primary", "M")} shrink-0`}
          >
            {eventSignup.button}
          </button>
        </div>
      )}

      <Toast show={toast}>Ссылка скопирована</Toast>

      {open && <EventSignupModal event={event} locale={locale} onClose={() => setOpen(false)} />}
    </aside>
  );
}
