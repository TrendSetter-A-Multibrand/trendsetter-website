"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { ArrowIcon, ArrowLeftIcon } from "@/components/ui/Icons";
import { iconButtonClass } from "@/components/ui/iconButton";
import { isLongTitle, type HeroSlide } from "@/lib/heroSlides";

/** How long each screen stays up, and the figure the line is drawn against. */
const SECONDS = 5;

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const subscribeVisible = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

/**
 * The file's Social strip: one white band at the foot of the photo, the names in
 * mono caps with no gap between them and a 1px line left of every cell but the
 * first. It answers to the width of the photo, not of the screen: from 600 it is
 * 56 tall with 32 either side of a name, 48 up from the bottom and a grid margin
 * in from the right; under 600, 44 tall with 16, 24 in; under 420 it runs the
 * width of the photo, the cells equal, 8 either side, 16 in. Under the pointer a
 * name turns Red.
 */
function SocialStrip({ socials }: { socials: { label: string; href: string }[] }) {
  if (!socials.length) return null;
  return (
    <div
      className={
        "absolute inset-x-4 bottom-4 flex bg-white " +
        "@min-[420px]:inset-x-auto @min-[420px]:bottom-6 @min-[420px]:right-6 " +
        "@min-[600px]:bottom-12 @min-[600px]:right-10"
      }
    >
      {socials.map((social, i) => (
        <a
          key={social.label}
          href={social.href}
          className={
            "type-caption flex h-11 flex-1 items-center justify-center px-2 text-ink transition-colors duration-150 hover:text-brand " +
            "@min-[420px]:flex-none @min-[420px]:px-4 " +
            "@min-[600px]:type-label-16 @min-[600px]:h-14 @min-[600px]:px-8 " +
            (i > 0 ? "border-l border-line" : "")
          }
        >
          {social.label}
        </a>
      ))}
    </div>
  );
}

/**
 * The file's Hero slider: the home screen split in two, the words at the left
 * and the photo at the right running off the edge, and on a phone the photo
 * first. Four screens turn on their own every 5 seconds, a 2px line under the
 * buttons shows how long is left, "n / m" and the arrows step by hand.
 *
 * It waits only while a mouse rests on the words or buttons - not on the photo,
 * and not for a tap - and while keyboard focus is inside them; a hidden tab or a
 * wish for less motion stops it for good. The first screen is drawn by the
 * server and the rotation starts once the page has hydrated.
 */
export function HeroSlider({
  slides,
  tags,
  socials,
}: {
  slides: HeroSlide[];
  /** The categories in brackets, one per entry; a slide's own tag takes the first place. */
  tags: string[];
  socials: { label: string; href: string }[];
}) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => true,
  );
  const hidden = useSyncExternalStore(
    subscribeVisible,
    () => document.visibilityState === "hidden",
    () => false,
  );

  const count = slides.length;
  const slide = slides[index];
  const step = (by: number) => setIndex((i) => (i + by + count) % count);
  const running = !reduced && !held && !hidden && count > 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [index, running, count]);

  const shown = tags.map((tag, i) => (i === 0 && slide.tag ? `[${slide.tag}]` : `[${i + 1}] ${tag}`));

  return (
    <section className="flex flex-col md:h-[calc(100svh-var(--header-h,116px))] md:min-h-[560px] md:flex-row">
      <div className="flex flex-col md:justify-between md:py-12 md:pl-10 md:max-[1199px]:w-1/2 md:max-[1199px]:pr-[63px] min-[1200px]:w-[46.3%]">
        {/* Desktop: a row at the top of the column */}
        <p className="type-caption hidden gap-4 whitespace-nowrap text-ink md:flex">
          {shown.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>

        {/* The photo leads on a phone */}
        <div className="@container relative h-60 w-full md:hidden">
          <Photos slides={slides} index={index} />
          <SocialStrip socials={socials} />
        </div>

        <div
          className="flex flex-col px-4 pt-6 md:p-0"
          onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
          onFocus={(e) => e.target.matches(":focus-visible") && setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          <div key={index} className="flex animate-fade-in flex-col gap-6 md:gap-8">
            <h1 className={`type-display text-ink ${isLongTitle(slide.title) ? "md:[font-size:64px]" : ""}`}>
              {slide.title}
            </h1>
            <p className="type-body-l max-w-[420px] text-ink">{slide.lead}</p>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              <Link
                href={slide.primary.href}
                className={`${buttonClass("primary", "L")} w-full md:w-auto`}
              >
                {slide.primary.label}
              </Link>
              {slide.secondary && (
                <LinkArrow href={slide.secondary.href} className="max-md:self-start max-md:text-[16px]!">
                  {slide.secondary.label}
                </LinkArrow>
              )}
            </div>
          </div>

          {/* How long is left, then where we are and the arrows */}
          <div className="mt-6 flex flex-col gap-2.5 md:mt-8">
            <div className="h-0.5 w-full bg-line" aria-hidden="true">
              {running && (
                <div
                  key={`${index}-${held}`}
                  className="h-full animate-widget-bar bg-ink"
                  style={{ animationDuration: `${SECONDS}s` }}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="type-caption text-ink">
                {index + 1} / {count}
              </p>
              {count > 1 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Предыдущий слайд"
                    onClick={() => step(-1)}
                    className={iconButtonClass("outline")}
                  >
                    <ArrowLeftIcon />
                  </button>
                  <button
                    type="button"
                    aria-label="Следующий слайд"
                    onClick={() => step(1)}
                    className={iconButtonClass("outline")}
                  >
                    <ArrowIcon />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Phone: the categories as a swiping line between two rules */}
          <p className="type-caption -mx-4 mt-6 flex gap-4 overflow-x-auto whitespace-nowrap border-y border-line px-4 py-3 text-ink [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
            {shown.map((tag) => (
              <span key={tag} className="shrink-0">
                {tag}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* The 63 between the text and the photo, from 1200 up where the text column has no padding of its own on that side */}
      <div aria-hidden="true" className="hidden w-[63px] shrink-0 min-[1200px]:block" />

      {/* Desktop photo: fills the right half and runs to the edge */}
      <div className="@container relative hidden flex-1 md:block">
        <Photos slides={slides} index={index} />
        <SocialStrip socials={socials} />
      </div>
    </section>
  );
}

/** Every photo is in the page, the shown one on top, so a turn is a fade and not a load. */
function Photos({ slides, index }: { slides: HeroSlide[]; index: number }) {
  return (
    <>
      {slides.map((slide, i) => (
        <Image
          key={i}
          src={slide.image}
          alt=""
          fill
          priority={i === 0}
          sizes="(min-width: 768px) 50vw, 100vw"
          className={`object-cover transition-opacity duration-300 motion-reduce:transition-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}
