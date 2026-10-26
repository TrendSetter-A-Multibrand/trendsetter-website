import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

/**
 * The file's Informer: a Paper plate, 898 at most, 24 inside, with a question in
 * H4, a line under it in Body S and a Secondary M button - what the ends of
 * Вакансии, Лояльность and Подарочные карты close on. 64 of air over it and the
 * 128 of the section gap under it.
 */
export function Informer({
  title,
  text,
  label,
  href,
}: {
  title: string;
  text?: string;
  label?: string;
  href?: string;
}) {
  return (
    <section className="px-4 pb-32 pt-16 md:px-10">
      <div className="flex max-w-[898px] flex-col items-start gap-4 bg-surface p-6">
        <div className="flex flex-col gap-2">
          <h2 className="type-h4 text-ink">{title}</h2>
          {text && <p className="type-body-s text-ink">{text}</p>}
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
