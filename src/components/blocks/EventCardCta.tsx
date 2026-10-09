"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { buttonClass } from "@/components/ui/Button";
import { EventSignupModal } from "@/components/blocks/EventSignupModal";
import type { Event } from "@/lib/events";

/**
 * The button at the foot of an event card. An event with an article leads to it;
 * one without has nowhere to lead, so the button opens the sign-up sheet instead -
 * every card has a button.
 */
export function EventCardCta({ item, href }: { item: Event; href: string }) {
  const [open, setOpen] = useState(false);
  const params = useParams<{ locale?: string }>();
  const label = item.ctaLabel || "Записаться";
  const cls = `${buttonClass("primary")} w-full`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {label}
      </a>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cls}>
        {label}
      </button>
      {open && (
        <EventSignupModal
          event={item}
          locale={params?.locale ?? "ru_ru"}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
