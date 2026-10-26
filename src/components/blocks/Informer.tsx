import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

/**
 * The file's Informer: a Paper plate, 898 at most, 24 inside, with a question in
 * H4, a line under it in Body S, an optional Red arrow at the left and a Secondary M button - what the ends of
 * Вакансии, Лояльность and Подарочные карты close on. 64 of air over it and the
 * 128 of the section gap under it.
 */
export function Informer({
  title,
  text,
  label,
  href,
  icon = false,
}: {
  title: string;
  text?: string;
  label?: string;
  href?: string;
  /** The file's 44 Red arrow to the upper right, left of the text; it is optional there too. */
  icon?: boolean;
}) {
  return (
    <section className="px-4 pb-32 pt-16 md:px-10">
      <div className="flex max-w-[898px] flex-col items-start gap-4 bg-surface p-6">
        <div className="flex items-start gap-6">
          {icon && (
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-brand"
            >
              <path
                d="M11 33L33 11M14 11H33V30"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          )}
          <div className="flex flex-col gap-2">
            <h2 className="type-h4 text-ink">{title}</h2>
            {text && <p className="type-body-s text-ink">{text}</p>}
          </div>
        </div>
        {label && href && (
          <Link href={href} className={`${buttonClass("secondary", "M")} max-md:w-full`}>
            {label}
          </Link>
        )}
      </div>
    </section>
  );
}
