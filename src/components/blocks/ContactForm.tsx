"use client";

import { type FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
 * note beside it. Heading is 20 mono, everything else Inter Tight 14.
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

  return (
    <section className="on-dark relative overflow-hidden bg-brand px-6 pb-10 pt-[46px] text-white lg:px-10">
      <div className="relative z-10 max-w-[1190px]">
        <h2 className="font-mono text-xl/6 uppercase">[{heading}]</h2>

        <form onSubmit={handleSubmit} className="mt-[30px]">
          <textarea
            name="message"
            placeholder={placeholder}
            className="on-light block h-[207px] w-full resize-none bg-white p-4 text-sm/[18px] tracking-[1px] text-ink outline-none placeholder:text-muted"
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <input
              name="name"
              placeholder="Ваше имя"
              className="h-12 border border-white bg-transparent px-4 text-sm/[18px] tracking-[1px] outline-none placeholder:text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className="h-12 border border-white bg-transparent px-4 text-sm/[18px] tracking-[1px] outline-none placeholder:text-white"
            />
            {/* White rather than outlined, and a hair taller - that is how it is drawn */}
            <select
              name="subject"
              defaultValue=""
              className="on-light h-[49px] appearance-none bg-white bg-[length:12px] bg-[right_16px_center] bg-no-repeat px-4 text-sm/[18px] tracking-[1px] text-ink outline-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23252120' stroke-width='2'/%3E%3C/svg%3E\")",
              }}
            >
              <option value="" disabled>
                Тема обращения
              </option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              className="on-light h-[49px] w-[180px] shrink-0 bg-white text-sm uppercase tracking-[3px] text-ink"
            >
              {sent ? "Отправлено" : "Отправить"}
            </button>
            <p className="max-w-[545px] text-sm/[18px]">
              Нажимая на кнопку «Отправить», Вы соглашаетесь на обработку
              персональных данных в соответствии с{" "}
              <Link href={`/${locale}/user-agreement`} className="underline">
                пользовательским соглашением
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* 575 across in the mockup, running off the top of the band, and turned
          0.1804 of a radian off square - the file tilts it rather than setting
          it upright */}
      <div className="pointer-events-none absolute -top-[43px] right-6 hidden -rotate-[10.33deg] lg:right-[58px] lg:block">
        <Image src={imageSrc} alt="" width={575} height={575} />
      </div>
    </section>
  );
}
