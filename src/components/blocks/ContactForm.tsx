"use client";

import { type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { useSiteSettings } from "@/components/layout/SettingsContext";

type ContactFormProps = {
  locale?: string;
  heading?: string;
  placeholder?: string;
  /** The list the file opens the dropdown with on О нас. */
  subjects?: DropdownOption[];
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
  placeholder: placeholderProp,
  subjects: subjectsProp,
  imageSrc = "/images/home/smile.svg",
}: ContactFormProps) {
  // The wording, the subject list and the consent line are the editor's, from
  // the settings; a block that passes its own keeps them.
  const { form } = useSiteSettings();
  const placeholder = placeholderProp ?? form.placeholder;
  const subjects: DropdownOption[] =
    subjectsProp ??
    form.subjects.map((s) => (s.short ? { value: s.value, short: s.short } : s.value));
  const consentFrom = form.consent.indexOf("{");
  const consentTo = form.consent.indexOf("}", consentFrom);
  const hasLink = consentFrom >= 0 && consentTo > consentFrom;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) {
        const { error: code } = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(
          code === "subject"
            ? "Выберите тему обращения"
            : code === "email"
              ? "Проверьте e-mail"
              : code === "message"
                ? "Напишите сообщение"
                : "Не удалось отправить, попробуйте позже",
        );
        return;
      }
      form.reset();
      setSent(true);
    } catch {
      setError("Не удалось отправить, попробуйте позже");
    } finally {
      setBusy(false);
    }
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
                placeholder={form.subjectPlaceholder}
                options={subjects}
              />
            </div>

            <textarea
              name="message"
              placeholder={placeholder}
              className="on-light block h-[200px] w-full resize-none bg-white p-4 text-sm/[18px] tracking-[1px] text-ink outline-none placeholder:text-muted sm:order-1 sm:col-span-3"
            />

            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <input
              name="name"
              placeholder={form.namePlaceholder}
              className="h-12 border border-white bg-transparent px-4 text-sm/[18px] tracking-[1px] outline-none placeholder:text-white/40 sm:order-2"
            />
            <input
              type="email"
              name="email"
              placeholder={form.emailPlaceholder}
              className="h-12 border border-white bg-transparent px-4 text-sm/[18px] tracking-[1px] outline-none placeholder:text-white/40 sm:order-3"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              disabled={busy}
              className={`${buttonClass("inverse")} w-full shrink-0 lg:w-[180px]`}
            >
              {sent ? form.sent : form.button}
            </button>
            {error && (
              <p role="alert" className="w-full text-sm/[18px]">
                {error}
              </p>
            )}
            <p className="max-w-[986px] text-sm/[18px]">
              {hasLink ? (
                <>
                  {form.consent.slice(0, consentFrom)}
                  <Link href={`/${locale}/user-agreement`} className="underline">
                    {form.consent.slice(consentFrom + 1, consentTo)}
                  </Link>
                  {form.consent.slice(consentTo + 1)}
                </>
              ) : (
                form.consent
              )}
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
