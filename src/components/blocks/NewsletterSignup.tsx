"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

type NewsletterSignupProps = {
  locale?: string;
  heading?: string;
  description?: string;
  imageSrc?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 23px square with a 1px rule, the tick inside it, label 16 to the right. */
function Checkbox({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked
        className="peer sr-only"
      />
      <span className="flex h-[23px] w-[23px] shrink-0 items-center justify-center border border-white peer-checked:[&>svg]:opacity-100">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 opacity-0">
          <path
            d="m5 13 4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}

/**
 * The red band under the shops, 303 tall: everything set 40 from the left in
 * mono, the field and its button flush together at 700 + 180, and the smiley
 * sitting to the right of them, taller than the band and clipped by it.
 */
export function NewsletterSignup({
  locale = "ru_ru",
  heading = "Подпишитесь на наши новости",
  description = "Будьте в числе первых, кто узнает о новинках,\nраспрождажах и интересных новостях TRENDSETTER!",
  imageSrc = "/images/home/smile.svg",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isValid = EMAIL_PATTERN.test(email);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSubmitted(true);
    setEmail("");
  }

  useEffect(() => {
    if (!submitted) return;
    // demo timing only - real UX for the returning smiley will be decided later
    const timeout = setTimeout(() => setSubmitted(false), 10000);
    return () => clearTimeout(timeout);
  }, [submitted]);

  return (
    <section className="relative overflow-hidden bg-brand px-6 py-[22px] font-mono text-white lg:px-10">
      <div className="relative z-10 max-w-[880px]">
        <h2 className="text-xl uppercase tracking-[5px] lg:text-2xl/[29px]">
          [{heading}]
        </h2>

        <p className="mt-[25px] whitespace-pre-line text-sm/[18px]">
          {description}
        </p>

        {/* 880 across: a 700 field with its 180 button hard against it */}
        <form onSubmit={handleSubmit} className="mt-[25px] flex h-12 w-full">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш E-mail адрес здесь"
            className="min-w-0 flex-1 border border-white bg-transparent px-4 text-center text-sm placeholder:text-white/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!isValid}
            className="h-[49px] shrink-0 self-start whitespace-nowrap bg-white text-sm uppercase tracking-[3px] text-ink disabled:cursor-not-allowed lg:w-[180px]"
          >
            Подписаться
          </button>
        </form>

        <div className="mt-[25px] flex flex-wrap gap-x-10 gap-y-[25px] text-sm">
          <Checkbox name="men">Для мужчин</Checkbox>
          <Checkbox name="women">Для девушек</Checkbox>
        </div>

        <div className="mt-[25px] text-sm">
          <Checkbox name="consent">
            Я даю согласие на обработку персональных данных в соответствии с{" "}
            <Link href={`/${locale}/privacy-policy`} className="underline">
              политикой конфиденциальности
            </Link>
          </Checkbox>
        </div>
      </div>

      {/* Taller than the band in the mockup, so it overflows and gets clipped */}
      <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center lg:right-[289px]">
        {/* tilted ~10deg counter-clockwise in the mockup; the roll keeps that as its resting angle */}
        <div
          className={`relative h-60 w-60 transition-transform duration-700 ease-in sm:h-80 sm:w-80 lg:h-[420px] lg:w-[420px] ${
            submitted
              ? "translate-x-[100vw] rotate-[890deg]"
              : "-rotate-[10deg] translate-x-0"
          }`}
        >
          <Image src={imageSrc} alt="" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
}
