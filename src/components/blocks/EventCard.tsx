import { buttonClass } from "@/components/ui/Button";
import { CardImage } from "@/components/ui/CardImage";
import type { Event } from "@/lib/events";

/**
 * The library's Card Journal/Event, drawn 430 tall wherever it appears - three
 * across the home page at 587, two inside a brand's sheet at 580. The box is the
 * caller's to set, everything inside it is the file's.
 *
 * The file ships the card as two states of one component. At rest the date and
 * the time stand at the top with the name at the foot; on hover the name moves
 * up between the two badges and the foot gives way to the write-up and the
 * button. Both are drawn here at once and traded with opacity, which is what
 * lets the name cross the card rather than blink from one place to the other.
 */
type EventCardProps = {
  item: Event;
  href: string;
  sizes: string;
  /** The card's box - a width and the file's 430 of height. */
  className?: string;
};

/**
 * 64 square, white at 40% over a 4px backdrop blur. The two badges are built
 * differently in the file: the date is a big day over a small month, the time is
 * two equal rows split by a rule. The 12px side padding is what makes that rule
 * 40 wide.
 */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-16 shrink-0 flex-col items-center justify-center bg-white/40 px-3 font-mono text-white backdrop-blur-[4px]">
      {children}
    </div>
  );
}

/** Geist Mono 24 on a 31.2 line, 3 of tracking - the same as the day and hour. */
function EventTitle({ item }: { item: Event }) {
  return (
    <div className="text-center uppercase">
      <p className="font-mono text-2xl/[31.2px] tracking-[3px]">{item.title}</p>
      <p className="font-mono text-2xl/[31.2px] tracking-[3px]">
        {item.location}
      </p>
    </div>
  );
}

export function EventCard({ item, href, sizes, className = "" }: EventCardProps) {
  return (
    <article
      className={`on-dark group relative shrink-0 overflow-hidden ${className}`}
    >
      <CardImage src={item.image} sizes={sizes} />

      {/* At rest the file lays two gradients over the photo, each at half
          strength: black at the top edge and at the bottom, both fading out by
          the middle. On hover they give way to one flat black at 50%. */}
      <div className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-t from-transparent to-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-black/50" />
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="absolute inset-x-0 top-0 flex items-center gap-4 p-6 text-white">
        <Badge>
          {/* 31.2 over 13 comes to 44 of the plate's 64; the pair is centred in
              what is left, which is how the file draws it */}
          <span className="text-2xl/[31.2px] tracking-[3px]">{item.day}</span>
          <span className="text-[10px]/[13px] font-medium uppercase tracking-[3px]">
            {item.month}
          </span>
        </Badge>

        <div className="flex-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <EventTitle item={item} />
        </div>

        <Badge>
          {/* two 31.2 lines and the rule between them fill the plate exactly */}
          <span className="text-2xl/[31.2px] tracking-[3px]">
            {item.time.split(":")[0]}
          </span>
          <span className="h-px w-full bg-white" />
          <span className="text-2xl/[31.2px] tracking-[3px]">
            {item.time.split(":")[1]}
          </span>
        </Badge>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white transition-opacity duration-200 group-hover:opacity-0">
        <EventTitle item={item} />
      </div>

      {/* 24 between the write-up and the button, and the button runs the full
          width of the card the way the file draws it */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {item.description && (
          <p className="text-base/5">{item.description}</p>
        )}
        {item.ctaLabel && (
          <a href={href} className={`${buttonClass("primary")} w-full`}>
            {item.ctaLabel}
          </a>
        )}
      </div>
    </article>
  );
}
