"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";

type NewsletterSignupProps = {
  heading?: string;
  description?: string;
  imageSrc?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Checkbox({ label }: { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input type="checkbox" defaultChecked className="peer sr-only" />
      <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-white peer-checked:[&>svg]:opacity-100 lg:h-10 lg:w-10">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 opacity-0 lg:h-6 lg:w-6">
          <path
            d="m5 13 4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label}
    </label>
  );
}

export function NewsletterSignup({
  heading = "Подпишитесь на наши новости",
  description = "Будьте в числе первых, кто узнает о новинках, распродажах и интересных новостях TRENDSETTER!",
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
    <section className="relative overflow-hidden bg-brand px-6 py-10 text-white lg:px-10">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <h2 className="font-mono text-xl uppercase lg:text-3xl">[{heading}]</h2>
          <p className="font-mono text-lg lg:text-2xl">{description}</p>

          <form onSubmit={handleSubmit} className="flex w-full">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш E-mail адрес здесь"
              className="w-full border border-white bg-transparent px-4 py-3 font-mono text-lg placeholder:text-center placeholder:text-white/40 focus:outline-none lg:text-2xl"
            />
            <button
              type="submit"
              disabled={!isValid}
              className="shrink-0 whitespace-nowrap border border-white bg-white px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-ink disabled:cursor-not-allowed disabled:opacity-50 lg:text-xl"
            >
              Подписаться
            </button>
          </form>

          <div className="flex flex-wrap gap-6 font-mono text-lg lg:text-xl">
            <Checkbox label="Для мужчин" />
            <Checkbox label="Для девушек" />
          </div>
        </div>

        {/* Taller than the block in the mockup, so it overflows and gets clipped */}
        <div className="relative min-h-56 lg:min-h-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* tilted ~10deg in the mockup; the roll keeps that as its resting angle */}
            <div
              className={`relative h-60 w-60 transition-transform duration-700 ease-in sm:h-80 sm:w-80 lg:h-[500px] lg:w-[500px] ${
                submitted
                  ? "translate-x-[100vw] rotate-[910deg]"
                  : "translate-x-0 rotate-[10deg]"
              }`}
            >
              <Image src={imageSrc} alt="" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
