"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type NotFoundHeroProps = {
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * The three balloons, laid out on the mockup's 1920x952 art board: every
 * position is a percentage of that board, so the whole composition scales as one
 * piece. The two silver fours are the same file at different tilts.
 *
 * `body` is where the balloon itself sits inside its file, the string below it
 * left out - that, and not the middle of the image, is the point the pointer
 * pushes against.
 *
 * All three drift up and down for good. The rise, the pace and the point each
 * one starts at are deliberately mismatched - matched, they would read as one
 * sheet moving rather than three balloons. The negative delays start them
 * mid-drift, so nothing sits still waiting for its turn.
 */
const BALLOONS = [
  {
    src: "/images/404/balloon-4.png",
    width: 664,
    height: 996,
    body: { x: 0.514, y: 0.367 },
    box: "left-[28.47%] top-[31.64%] w-[17.29%]",
    tilt: "origin-top-left -rotate-[12.6deg]",
    drift: "[--float-y:-10px] [animation-delay:-800ms] [animation-duration:3600ms]",
  },
  {
    src: "/images/404/balloon-smile.png",
    width: 1280,
    height: 853,
    body: { x: 0.499, y: 0.385 },
    box: "left-[33.33%] top-[28.8%] w-[33.33%]",
    tilt: "",
    drift: "[--float-y:-16px] [animation-delay:-2100ms] [animation-duration:4600ms]",
    priority: true,
  },
  {
    src: "/images/404/balloon-4.png",
    width: 664,
    height: 996,
    body: { x: 0.514, y: 0.367 },
    box: "left-[53.27%] top-[24.18%] w-[17.29%]",
    tilt: "origin-top-left rotate-[7.19deg]",
    drift: "[--float-y:-13px] [animation-delay:-1400ms] [animation-duration:4100ms]",
  },
];

/** How near the pointer has to get, and how far they go to keep out of its way. */
const REACH = 300;
const GIVE = 26;

export function NotFoundHero({
  heading = "Страница не найдена",
  ctaLabel = "Вернуться на главную",
  ctaHref = "/",
}: NotFoundHeroProps) {
  const board = useRef<HTMLDivElement>(null);
  const balloons = useRef<(HTMLDivElement | null)[]>([]);
  const anchors = useRef<{ x: number; y: number }[] | null>(null);

  /**
   * Written straight to the elements rather than held in state: this runs on
   * every pointer move, and none of it is worth a render.
   */
  function shy(event: React.PointerEvent) {
    const box = board.current?.getBoundingClientRect();
    if (!box) return;

    // Taken once and kept as fractions of the board, so neither the drift nor a
    // resize can leave them stale
    anchors.current ??= balloons.current.map((el, i) => {
      const rect = el!.getBoundingClientRect();
      const { body } = BALLOONS[i];
      return {
        x: (rect.left - box.left + rect.width * body.x) / box.width,
        y: (rect.top - box.top + rect.height * body.y) / box.height,
      };
    });

    const pointerX = event.clientX - box.left;
    const pointerY = event.clientY - box.top;

    anchors.current.forEach((anchor, i) => {
      const el = balloons.current[i];
      if (!el) return;

      const dx = anchor.x * box.width - pointerX;
      const dy = anchor.y * box.height - pointerY;
      const away = Math.hypot(dx, dy);
      const push = away > 1 && away < REACH ? (1 - away / REACH) * GIVE : 0;

      // Sideways rather than up: a balloon on a string swings before it rises
      el.style.transform = push
        ? `translate(${(dx / away) * push}px, ${(dy / away) * push * 0.5}px)`
        : "";
    });
  }

  function settle() {
    for (const el of balloons.current) if (el) el.style.transform = "";
  }

  return (
    <section className="flex h-[calc(100svh-var(--header-h,0px))] items-center justify-center overflow-hidden px-6 lg:px-10">
      <div
        ref={board}
        onPointerMove={shy}
        onPointerLeave={settle}
        // The whole composition is percentages of a 1920x952 board, so it
        // shrinks with the board - and on a phone that left the balloons the
        // size of a thumbnail, with the heading landing on top of them. The
        // board is drawn wider than the screen there and centred instead; the
        // section clips the empty margins, and the balloons sit in the middle
        // 40% of it, well inside what stays visible. `shrink-0` because a flex
        // item is otherwise pulled straight back to the width of its container.
        className="@container relative aspect-[1920/952] w-[200%] shrink-0 sm:w-[150%] lg:w-full"
      >
        {/* Sized off the board rather than the screen, like everything else
            here: 36 on the file's 1840 is 1.96% of it, so the line keeps its
            place above the balloons instead of landing on them when the board
            is drawn wider than the screen */}
        <h1 className="absolute inset-x-0 top-[21.5%] text-center font-mono text-[1.96cqw] uppercase tracking-[0.14em] text-ink">
          [{heading}]
        </h1>

        {BALLOONS.map((balloon, i) => (
          <div
            key={balloon.box}
            ref={(el) => {
              balloons.current[i] = el;
            }}
            className={`absolute transition-transform duration-500 ease-out ${balloon.box}`}
          >
            <div
              className={`animate-float will-change-[translate] ${balloon.tilt} ${balloon.drift}`}
            >
              <Image
                src={balloon.src}
                alt=""
                width={balloon.width}
                height={balloon.height}
                priority={balloon.priority}
                className="h-auto w-full"
              />
            </div>
          </div>
        ))}

        <Link
          href={ctaHref}
          className="absolute left-1/2 top-[75.5%] flex h-[49px] -translate-x-1/2 items-center whitespace-nowrap bg-brand px-[17px] text-sm font-medium uppercase tracking-[0.15em] text-white"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
