"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { EventSignupModal } from "@/components/blocks/EventSignupModal";
import { useSiteSettings } from "@/components/layout/SettingsContext";
import type { Event } from "@/lib/events";

/**
 * «Записаться» in the article's header, under the views and reading time (a
 * temporary spot by the client's decision). Only an event that takes sign-ups
 * gets one; any other article has no button.
 */
export function ArticleSignupButton({
  event,
  locale,
}: {
  event?: Event;
  locale: string;
}) {
  const { eventSignup } = useSiteSettings();
  const [open, setOpen] = useState(false);
  if (!event?.signupEnabled) return null;

  return (
    <div className="mt-4 lg:mt-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${buttonClass("primary")} w-full`}
      >
        {eventSignup.button}
      </button>
      {open && (
        <EventSignupModal event={event} locale={locale} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
