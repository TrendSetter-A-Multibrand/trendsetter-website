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
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" defaultChecked className="peer sr-only" />
      <span className="flex h-5 w-5 items-center justify-center border-2 border-white peer-checked:[&>svg]:opacity-100">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 opacity-0">
          <path
            d="m5 13 4 4L19 7"
            stroke="currentColor"
            strokeWidth="3"
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
    <section className="relative overflow-hidden bg-brand px-6 py-16 text-white lg:px-10">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <h2 className="font-mono text-sm uppercase tracking-[0.2em]">
            [{heading}]
          </h2>
          <p className="max-w-md font-mono">{description}</p>

          <form onSubmit={handleSubmit} className="flex max-w-lg">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш E-mail адрес здесь"
              className="w-full border-2 border-white bg-white/10 px-4 py-3 font-mono text-sm placeholder:text-center placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!isValid}
              className="shrink-0 whitespace-nowrap border-2 border-white bg-white px-6 py-3 font-mono text-sm uppercase tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              Подписаться
            </button>
          </form>

          <div className="flex gap-6 text-sm">
            <Checkbox label="Для мужчин" />
            <Checkbox label="Для девушек" />
          </div>
        </div>

        {/* In the mockup the smiley is taller than the block and gets clipped by it */}
        <div className="relative min-h-64 lg:min-h-72">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className={`relative h-64 w-64 transition-transform duration-700 ease-in sm:h-80 sm:w-80 lg:h-[420px] lg:w-[420px] ${
                submitted ? "translate-x-[100vw] rotate-[900deg]" : "translate-x-0 rotate-0"
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
