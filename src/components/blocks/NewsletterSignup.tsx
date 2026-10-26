"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { fieldClass } from "@/components/ui/fieldClass";
import { NoticeModal } from "@/components/ui/NoticeModal";
import { isSubscribed, remember } from "@/lib/subscribers";

type NewsletterSignupProps = {
  locale?: string;
  /** The promo line, lower case, five words at most. */
  heading?: string;
  /** Kept so a block in Storyblok that still sends it keeps working; the new file has one headline for both widths. */
  mobileHeading?: string;
  description?: string;
  mobileDescription?: string;
  imageSrc?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The file's Red plane form, Subscribe: "[Рассылка]" in Label, the promo line in
 * H1, a lead in Body L, then the field and its white button side by side (one
 * over the other on a phone) and a single consent checkbox. 128 above and below
 * on a desktop, 64 and 24 on a phone, text in a 898 column. The smiley is
 * turned 12 degrees and cut by the right edge from 1200 up; below that it sits
 * under the form, to the right.
 */
export function NewsletterSignup({
  locale = "ru_ru",
  heading = "новое — первыми",
  description = "Пишем о новых поставках, событиях и выпусках журнала — только то, что стоит внимания.",
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
    <section className="on-dark relative overflow-hidden bg-brand px-4 pb-6 pt-16 text-white md:px-10 md:py-32">
      <div className="relative z-10 flex max-w-[898px] flex-col gap-6 md:gap-8">
        <h2 className="type-label">[Рассылка]</h2>
        <p className="type-h1">{heading}</p>
        <p className="type-body-l max-w-[520px] whitespace-pre-line">{description}</p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[640px] flex-col gap-4"
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Электронная почта"
              aria-label="Электронная почта"
              className={`${fieldClass("input", "red")} md:flex-1`}
            />
            <button
              type="submit"
              className={`${buttonClass("inverse", "L")} w-full shrink-0 md:w-auto`}
            >
              Подписаться
            </button>
          </div>

          <Checkbox name="consent" surface="red" defaultChecked={false} required>
            Согласен(на) на обработку персональных данных{" "}
            <Link href={`/${locale}/privacy-policy`} className="underline">
              политика
            </Link>
          </Checkbox>
        </form>
      </div>

      {/* The smiley: 12 degrees clockwise, 440 across, hanging off the right
          edge. Under 1200 there is no room beside the text, so it sits under the
          form at the right instead. On send it rolls out of the band. */}
      <div className="pointer-events-none relative mt-6 flex justify-end min-[1200px]:absolute min-[1200px]:right-[-30px] min-[1200px]:top-[calc(50%+41px)] min-[1200px]:mt-0 min-[1200px]:size-[522px] min-[1200px]:-translate-y-1/2 min-[1200px]:items-center min-[1200px]:justify-center">
        <div
          className={`relative size-[237px] transition-transform duration-700 ease-in min-[1200px]:size-[440px] ${
            submitted
              ? "translate-x-[100vw] rotate-[890deg]"
              : "rotate-12 translate-x-0"
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
