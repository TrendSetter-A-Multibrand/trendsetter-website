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
  imageSrc = "/images/home/smile.jpg",
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
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">
            [{heading}]
          </h2>
          <p className="max-w-md">{description}</p>

          <form onSubmit={handleSubmit} className="flex max-w-lg">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш E-mail адрес здесь"
              className="w-full border border-white/40 bg-transparent px-4 py-3 text-sm placeholder:text-white/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!isValid}
              className="shrink-0 whitespace-nowrap bg-white px-6 py-3 text-sm font-medium uppercase tracking-wide text-brand disabled:cursor-not-allowed disabled:opacity-50"
            >
              Подписаться
            </button>
          </form>

          <div className="flex gap-6 text-sm">
            <Checkbox label="Для мужчин" />
            <Checkbox label="Для девушек" />
          </div>
        </div>

        <div className="flex justify-center">
          <div
            className={`relative h-48 w-48 overflow-hidden rounded-full transition-transform duration-700 ease-in lg:h-64 lg:w-64 ${
              submitted ? "translate-x-[100vw] rotate-[900deg]" : "translate-x-0 rotate-0"
            }`}
          >
            {/* the artwork sits on a white square, so scale it up to crop the corners inside the circle */}
            <Image src={imageSrc} alt="" fill className="scale-[1.3] object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
