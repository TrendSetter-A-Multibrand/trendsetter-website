"use client";

import { type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { useSiteSettings } from "@/components/layout/SettingsContext";
import {
  CONTACT_ERRORS,
  MESSAGE_MAX,
  parseContact,
  type ContactField,
} from "@/lib/contact";

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
  const [invalid, setInvalid] = useState<ContactField[]>([]);
  const bad = (field: ContactField) => invalid.includes(field) || undefined;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    // The same rules the server applies; nothing leaves the page if they fail.
    // The subject lives in the dropdown's hidden input, so `required` could not
    // catch it - this does.
    const parsed = parseContact(data);
    if (!parsed.ok) {
      setInvalid(Object.keys(parsed.errors) as ContactField[]);
      setError(Object.values(parsed.errors)[0] ?? "Не удалось отправить, попробуйте позже");
      return;
    }
    setInvalid([]);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const { error: code } = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        const field = code && code in CONTACT_ERRORS ? (code as ContactField) : null;
        setInvalid(field ? [field] : []);
        setError(
          field ? CONTACT_ERRORS[field] : "Не удалось отправить, попробуйте позже",
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

        <form onSubmit={handleSubmit} noValidate className="mt-6">
          {/* At 375 the file puts the subject dropdown above the message box;
              from sm it rejoins name/email in one row under the message, same
              as before - `order` moves it there without moving it in the DOM. */}
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
            <div className="sm:order-4">
              <Dropdown
                name="subject"
                placeholder={form.subjectPlaceholder}
                options={subjects}
                invalid={!!bad("subject")}
              />
            </div>

            <textarea
              name="message"
              placeholder={placeholder}
              maxLength={MESSAGE_MAX}
              aria-invalid={bad("message")}
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
              aria-invalid={bad("name")}
              className="h-12 border border-white bg-transparent px-4 text-sm/[18px] tracking-[1px] outline-none placeholder:text-white/40 sm:order-2"
            />
            <input
              type="email"
              name="email"
              placeholder={form.emailPlaceholder}
              aria-invalid={bad("email")}
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
