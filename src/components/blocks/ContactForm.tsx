"use client";

import { type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { fieldClass, fieldErrorClass } from "@/components/ui/fieldClass";
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
  /** The H2 under the label. */
  lead?: string;
  placeholder?: string;
  /** The list the file opens the dropdown with on О нас. */
  subjects?: DropdownOption[];
  imageSrc?: string;
};

/**
 * The file's Red plane form, Feedback - "[Свяжитесь с нами]" in Label, a line in
 * H2, a 152 message box, name / email / subject in a row (three across from 640,
 * stacked before) and the white "Отправить" with its consent note beside it. The
 * subscribe plane's sibling: the same padding, the same smiley.
 */
export function ContactForm({
  locale = "ru_ru",
  heading = "Свяжитесь с нами",
  lead = "Задайте вопрос или напишите пожелания и предложения",
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
    <section className="on-dark relative overflow-hidden bg-brand px-4 pb-6 pt-16 text-white md:px-10 md:py-32">
      <div className="relative z-10 flex max-w-[898px] flex-col gap-6 md:gap-8">
        <h2 className="type-label">[{heading}]</h2>
        <p className="type-h2">{lead}</p>

        <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-4">
          <textarea
            name="message"
            placeholder={placeholder}
            aria-label={placeholder}
            maxLength={MESSAGE_MAX}
            aria-invalid={bad("message")}
            className={fieldClass("textarea", "red")}
          />

          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {/* Three in a row once the form is 640 wide, one under another before */}
          <div className="flex flex-col gap-3 min-[640px]:flex-row [&>*]:min-[640px]:flex-1">
            <input
              name="name"
              placeholder={form.namePlaceholder}
              aria-label={form.namePlaceholder}
              aria-invalid={bad("name")}
              className={fieldClass("input", "red")}
            />
            <input
              type="email"
              name="email"
              placeholder={form.emailPlaceholder}
              aria-label={form.emailPlaceholder}
              aria-invalid={bad("email")}
              className={fieldClass("input", "red")}
            />
            <Dropdown
              name="subject"
              placeholder={form.subjectPlaceholder}
              options={subjects}
              invalid={!!bad("subject")}
              surface="red"
            />
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <button
              type="submit"
              disabled={busy}
              className={`${buttonClass("inverse", "L")} w-full shrink-0 md:w-auto`}
            >
              {sent ? form.sent : form.button}
            </button>
            <p className="type-body-s max-w-[520px]">
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
          {error && (
            <p role="alert" className={fieldErrorClass("red")}>
              {error}
            </p>
          )}
        </form>
      </div>

      {/* The smiley, as on the subscribe plane: turned 12 degrees, 440 across,
          off the right edge from 1200 up, under the form at the right below it.
          It rolls out of the band when the message is sent. */}
      <div className="pointer-events-none relative mt-6 flex justify-end min-[1200px]:absolute min-[1200px]:right-[-30px] min-[1200px]:top-[calc(50%+41px)] min-[1200px]:mt-0 min-[1200px]:size-[522px] min-[1200px]:-translate-y-1/2 min-[1200px]:items-center min-[1200px]:justify-center">
        <div
          className={`relative size-[237px] transition-transform duration-700 ease-in min-[1200px]:size-[440px] ${
            sent
              ? "translate-x-[100vw] rotate-[890deg]"
              : "rotate-12 translate-x-0"
          }`}
        >
          <Image src={imageSrc} alt="" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
}
