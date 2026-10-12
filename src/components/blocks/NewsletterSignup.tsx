"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { NoticeModal } from "@/components/ui/NoticeModal";
import { isSubscribed, remember } from "@/lib/subscribers";

type NewsletterSignupProps = {
  locale?: string;
  heading?: string;
  /** What the 375 frame calls it. */
  mobileHeading?: string;
  description?: string;
  /** And what it writes under it. */
  mobileDescription?: string;
  imageSrc?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The red band under the shops, 303 tall: everything set 40 from the left in
 * mono, the field and its button flush together at 700 + 180, and the smiley
 * sitting to the right of them, taller than the band and clipped by it.
 */
export function NewsletterSignup({
  locale = "ru_ru",
  heading = "Подпишитесь на наши новости",
  mobileHeading = "Подписка на новости",
  description = "Будьте в числе первых, кто узнает о новинках,\nраспрождажах и интересных новостях TRENDSETTER!",
  mobileDescription = "Узнавайте о новинках, секретных распродажах и событиях TRENDSETTER первыми.",
  imageSrc = "/images/home/smile.svg",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  /** The address someone tried to sign up twice, held for the notice */
  const [duplicate, setDuplicate] = useState<string | null>(null);
  const isValid = EMAIL_PATTERN.test(email);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    // Signing the same address up again would look like it worked and quietly
    // do nothing, so say so instead
    if (isSubscribed(email)) {
      setDuplicate(email.trim());
      return;
    }

    remember(email);
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
    <section className="on-dark relative overflow-hidden bg-brand p-4 font-mono text-white lg:px-10 lg:py-10">
      <div className="relative z-10 max-w-[821px]">
        <h2 className="text-xl uppercase tracking-[3px] lg:text-2xl/[31.2px]">
          {/* The 375 frame calls it "Подписка на новости" */}
          <span className="lg:hidden">[{mobileHeading}]</span>
          <span className="max-lg:hidden">[{heading}]</span>
        </h2>

        {/* 375: Inter Tight 13/15, tracked 1, at 90% */}
        <p className="mt-4 font-sans text-[13px]/[15px] tracking-[1px] opacity-90 lg:hidden">
          {mobileDescription}
        </p>
        <p className="mt-6 whitespace-pre-line text-sm/[18px] max-lg:hidden">
          {description}
        </p>

        {/* 821 across: a 641 field with its 180 button hard against it on lg.
            Below lg the frame orders these field → checkboxes → consent →
            button (submit last), not field+button first - `order` carries that
            without duplicating the row markup per breakpoint. */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex w-full flex-wrap gap-4 lg:mt-6 lg:gap-x-0 lg:gap-y-6"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш E-mail адрес здесь"
            className="order-1 h-12 min-w-0 flex-1 border border-white bg-transparent px-4 font-sans text-sm tracking-[1px] placeholder:text-white/40 focus:outline-none"
          />

          <div className="order-2 flex w-full flex-wrap gap-6 font-sans text-[13px]/[15px] tracking-[1px] lg:order-3 lg:font-mono lg:text-sm lg:tracking-normal">
            <Checkbox name="men">Для мужчин</Checkbox>
            <Checkbox name="women">Для девушек</Checkbox>
          </div>

          {/* 16 between the two rows of boxes, 24 from the field above them */}
          {/* One line wherever there is room: past the 821 the rest of the column
              keeps to, and clear of the smiley (which shows from 1700) */}
          <div className="order-3 w-full font-sans text-[13px]/[15px] tracking-[1px] lg:order-4 lg:font-mono lg:text-sm lg:tracking-normal max-wide:min-[1100px]:w-max max-wide:min-[1100px]:whitespace-nowrap min-[1800px]:w-max min-[1800px]:whitespace-nowrap">
            <Checkbox name="consent">
              Я даю согласие на обработку персональных данных в соответствии с{" "}
              <Link href={`/${locale}/privacy-policy`} className="underline">
                политикой конфиденциальности
              </Link>
            </Checkbox>
          </div>

          <button
            type="submit"
            className={`${buttonClass("inverse")} order-4 w-full shrink-0 self-stretch whitespace-nowrap lg:order-2 lg:w-[180px] lg:self-start`}
          >
            Подписаться
          </button>
        </form>
      </div>

      {/* Taller than the band in the mockup, so it overflows and gets clipped */}
      <div className="pointer-events-none absolute inset-y-0 right-6 hidden items-center wide:right-[289px] wide:flex">
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

      {duplicate && (
        <NoticeModal
          title="Вы уже подписаны"
          onClose={() => setDuplicate(null)}
        >
          <p>
            На адрес <span className="font-medium">{duplicate}</span> подписка
            уже оформлена. Если письма не приходят, загляните в папки
            «Промоакции» и «Спам».
          </p>
        </NoticeModal>
      )}
    </section>
  );
}
