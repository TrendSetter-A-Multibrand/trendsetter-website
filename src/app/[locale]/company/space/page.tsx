import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { SpaceCards } from "@/components/blocks/SpaceCards";
import { ContactForm } from "@/components/blocks/ContactForm";
import { SPACE_CARDS, SPACE_INTRO } from "@/lib/company";

export default async function SpacePage({
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
            { label: "Пространство" },
          ]}
        />
      </div>

      <PageCover
        title="Пространство"
        subtitle="Для всей семьи"
        imageSrc="/images/covers/articles.jpg"
        flush={false}
      />

      {/* 24 mono across the whole measure, centred, with 40 of air over it */}
      <p className="px-6 pt-10 text-center font-mono text-base lg:px-10 lg:text-2xl/[31.2px]">
        {SPACE_INTRO}
      </p>

      <SpaceCards cards={SPACE_CARDS} />
      <ContactForm locale={locale} />
    </>
  );
}
