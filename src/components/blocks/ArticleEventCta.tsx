import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import type { Event } from "@/lib/events";

/**
 * What an article invites you to, pinned to the right of the hero photo.
 *
 * The file puts this button at the foot of the first text column, which means
 * it lands somewhere new every time an article is written to a different
 * length. Here it has one place and keeps it. The date and time are the same
 * 56px plates the event cards on the home page carry.
 */
export function ArticleEventCta({ event }: { event: Event }) {
  const [hours, minutes] = event.time.split(":");

  return (
    <div className="on-dark absolute right-6 top-1/2 flex -translate-y-1/2 flex-col items-center gap-6 lg:right-10">
      <div className="flex gap-2">
        <Plate>
          <span className="text-xl leading-none tracking-[3px]">{event.day}</span>
          <span className="mt-1 text-[10px] uppercase tracking-[3px]">
            {event.month}
          </span>
        </Plate>
        <Plate>
          <span className="text-xl leading-none tracking-[3px]">{hours}</span>
          <span className="my-1 h-px w-full bg-white" />
          <span className="text-xl leading-none tracking-[3px]">{minutes}</span>
        </Plate>
      </div>

      {/* Only an event asks you to sign up; an ordinary article has no button */}
      <Link
        href={`#${event.slug}`}
        className={buttonClass("primary")}
      >
        Записаться
      </Link>
    </div>
  );
}

/** 56 square, white at 40% over a 2px blur - the event card's plate */
function Plate({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center bg-white/40 px-3 font-mono leading-none text-white backdrop-blur-[2px]">
      {children}
    </div>
  );
}
