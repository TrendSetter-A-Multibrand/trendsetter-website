"use client";

import { type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

type ContactFormProps = {
  locale?: string;
  heading?: string;
  placeholder?: string;
  /** The list the file opens the dropdown with on О нас. */
  subjects?: string[];
  imageSrc?: string;
};

/**
 * The red band that closes every legal page - the newsletter's sibling, drawn
 * 485 tall with the same smiley overflowing the right edge. A 1190 column holds
 * a 207 message box, three fields 386 across, and the button with its consent
 * note beside it. Heading is 20 mono at 375, growing to 24 on lg; everything
 * else Inter Tight 14. The band carries 16 of padding at 375.
 */
export function ContactForm({
  locale = "ru_ru",
  heading = "Свяжитесь с нами",
  placeholder = "Задайте вопрос или напишите ваши пожелания и предложения",
  subjects = [
    "О нас",
    "Пространство",
    "Сотрудничество",
    "Вакансии",
    "Контакты",
    "Обратная связь",
  ],
  imageSrc = "/images/home/smile.svg",
}: ContactFormProps) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  useEffect(() => {
    if (!sent) return;
    // demo timing only, same as the newsletter band - the real wait comes back
    // with whatever actually sends the message
    const timeout = setTimeout(() => setSent(false), 10000);
    return () => clearTimeout(timeout);
  }, [sent]);

  return (
    <section className="on-dark relative overflow-hidden bg-brand p-4 text-white lg:px-10 lg:py-10">
      <div className="relative z-10 max-w-[1190px]">
        <h2 className="font-mono text-xl uppercase tracking-[3px] lg:text-2xl/[31px]">
          [{heading}]
        </h2>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* At 375 the file puts the subject dropdown above the message box;
              from sm it rejoins name/email in one row under the message, same
              as before - `order` moves it there without moving it in the DOM. */}
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
            <div className="sm:order-4">
              <Dropdown
                name="subject"
                placeholder="Тема обращения"
                options={subjects}
              />
            </div>

            <textarea
              name="message"
              placeholder={placeholder}
              className="on-light block h-[200px] w-full resize-none bg-white p-4 text-sm/[18px] tracking-[1px] text-ink outline-none placeholder:text-muted sm:order-1 sm:col-span-3"
            />

            <input
              name="name"
              placeholder="Ваше имя"
              className="h-12 border border-white bg-transparent px-4 text-sm/[18px] tracking-[1px] outline-none placeholder:text-white/40 sm:order-2"
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className="h-12 border border-white bg-transparent px-4 text-sm/[18px] tracking-[1px] outline-none placeholder:text-white/40 sm:order-3"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              className={`${buttonClass("secondaryGhost")} w-full shrink-0 lg:w-[180px]`}
            >
              {sent ? "Отправлено" : "Отправить"}
            </button>
            <p className="max-w-[986px] text-sm/[18px]">
              Нажимая на кнопку «Отправить», Вы соглашаетесь на обработку
              персональных данных в соответствии с{" "}
              <Link href={`/${locale}/user-agreement`} className="underline">
                пользовательским соглашением
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* 575 across in the mockup, running off the top of the band. The file
          turns it 0.1804 of a radian off square - ten degrees and a third, and
          the third is below anything an eye can catch, so it shares the round
          number the newsletter smiley rests at. That tilt is where it comes back
          to after rolling out of the band on send. */}
      <div className="pointer-events-none absolute -top-[43px] right-6 hidden wide:right-[58px] wide:block">
        <div
          className={`transition-transform duration-700 ease-in ${
            sent
              ? "translate-x-[100vw] rotate-[890deg]"
              : "-rotate-[10deg] translate-x-0"
          }`}
        >
          <Image src={imageSrc} alt="" width={575} height={575} />
        </div>
      </div>
    </section>
  );
}
