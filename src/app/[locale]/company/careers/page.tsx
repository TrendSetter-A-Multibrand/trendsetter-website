import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { PhotoCards } from "@/components/blocks/PhotoCards";
import { MissionBand } from "@/components/blocks/MissionBand";
import { HelpCards } from "@/components/blocks/HelpCards";
import { ABOUT_MISSION, CAREERS_CARDS, CAREERS_INTRO } from "@/lib/company";

/**
 * Assembled from the frame as it stands, which is still a draft: every heading
 * on it reads «Наша миссия», and the two blocks that plainly belong here -
 * «Кому понравится у нас» and «Актуальные вакансии» - are lying loose in the
 * file, outside the page frame. Both are waiting on the designer.
 */
export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <div className="py-5">
        <Breadcrumbs
          items={[
            { label: "Главная", href: `/${locale}` },
            { label: "Вакансии" },
          ]}
        />
      </div>

      <PageCover
        title="Вакансии"
        imageSrc="/images/covers/articles.jpg"
        flush={false}
      />

      <section className="px-6 pt-10 lg:px-10">
        <h2 className="text-2xl font-medium lg:text-[32px]/[38.72px]">
          {CAREERS_INTRO.title}
        </h2>
        <p className="mt-6 text-base lg:text-2xl/[29px]">{CAREERS_INTRO.body}</p>
      </section>

      <div className="pt-10">
        <PhotoCards cards={CAREERS_CARDS} />
      </div>

      <div className="pt-10">
        <MissionBand body={ABOUT_MISSION} />
      </div>

      <div className="py-10">
        <HelpCards locale={locale} cards={[FEEDBACK_CARD(locale)]} />
      </div>
    </>
  );
}

/** One card on this page, not the three the shop list carries */
const FEEDBACK_CARD = (locale: string) => ({
  title: "Обратная связь",
  text: "Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»",
  href: `/${locale}/company/feedback`,
  icon: "support" as const,
});
