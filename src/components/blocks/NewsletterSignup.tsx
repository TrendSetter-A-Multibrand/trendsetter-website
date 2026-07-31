"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";

type NewsletterSignupProps = {
  heading?: string;
  description?: string;
  imageSrc?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  }

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
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="h-4 w-4" />
              Для мужчин
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="h-4 w-4" />
              Для девушек
            </label>
          </div>
        </div>
      </div>

      <div
        className={`absolute right-6 top-1/2 h-48 w-48 -translate-y-1/2 overflow-hidden rounded-full transition-transform duration-700 ease-in lg:right-10 lg:h-64 lg:w-64 ${
          submitted ? "translate-x-[100vw]" : "translate-x-0"
        }`}
      >
        <Image src={imageSrc} alt="" fill className="object-cover" />
      </div>
    </section>
  );
}
